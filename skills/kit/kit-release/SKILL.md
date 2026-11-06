---
name: mkit-release
description: Cut a signed, attested mkit release by driving the real tag-triggered release machinery end to end. Use when tagging a new mkit version, publishing to crates.io / npm / GitHub Releases, verifying a published release, or rotating the release-attestation key.
---

# Cutting an mkit release

A single signed `vX.Y.Z` tag is the whole release trigger. Pushing it drives three
decoupled GitHub Actions workflows off the tagged tree. You never publish by hand;
you prepare `main`, push a good tag, then verify each channel actually ran and its
output is trustworthy.

`docs/RELEASE.md` in the repo is the authoritative runbook — this skill is the
repeatable procedure over it. When a detail here disagrees with `docs/RELEASE.md`
or the workflow files, the repo wins; re-read and update.

## The three channels one tag drives

Every channel triggers on `push: tags: 'v*.*.*'` and checks out the **tag's tree**:

| Channel | Workflow | Publishes |
|---|---|---|
| Binaries + npm wasm | `.github/workflows/release.yml` | GitHub Release archives (4 targets) + `@makechain/mkit-wasm` on npm |
| crates.io | `.github/workflows/crates-publish.yml` | every workspace crate without `publish = false`, in dependency order |
| Docs MCP corpus | `.github/workflows/mcp-release.yml` | indexes the tagged tree for the docs MCP server |

`release.yml` job order: `validate-release-tag` → `build` (×4 targets) → `sbom` →
`release` → `publish-wasm`. `release-plz.yml` is retired for publishing (inert on
push, manual-only PR job); do not rely on it to publish.

Read the current workflows before every release — trigger, job order, and gates
change. Do not trust this table over the files.

## Procedure

Work top to bottom. `CHECKLIST.md` beside this file is the full line-by-line
checklist (pre-tag, wait, smoke test, distribution, post-release); use it as the
running to-do and mirror its checkboxes. Each phase below has a completion
criterion — do not advance until it is met.

### Phase 1 — Verify the current publish state (never assume)

Publish state drifts; confirm it live before planning the release.

- crates.io: `cargo search mkit-core` (and the other `mkit-*` library names) —
  is the target version already there? Versions are **immutable**; a re-publish
  of an existing version fails the whole train.
- npm: `npm view @makechain/mkit-wasm version` — is the package claimed, and at
  what version? The `publish-wasm` job only runs when the GitHub repo is
  **public** (`if: github.event.repository.visibility == 'public'`); on a private
  repo it is **skipped, not failed**, so the CLI release still goes green without
  an npm publish.
- Homebrew tap: check whether `officialunofficial/homebrew-tap` has a
  `Formula/mkit.rb` yet, or only LICENSE + README.

**Done when:** you have written down, for this release, the current version on each
channel and whether npm publish will run (repo public?) — no assumptions carried
from a prior release.

### Phase 2 — Green main and bump

- `main` is green in CI. A green PR rollup does **not** prove the release-gating
  jobs ran — enumerate the expected workflows by name and confirm each executed,
  and check the Google Cloud Build `mkit-*-pr` checks (e.g. docs-lint) by name,
  not just the GitHub rollup.
- Bump `[workspace.package].version` in `rust/Cargo.toml` to a version **not yet
  published** on crates.io (Phase 1).
- Move `CHANGELOG.md` items from `## [Unreleased]` into `## [X.Y.Z] - YYYY-MM-DD`.
- Update every hard-coded version site (README install snippets,
  `contrib/homebrew/mkit.rb`, `docs/INSTALL.md`, `install.sh` usage examples) —
  see `CHECKLIST.md` for the exact list.
- Land the bump via a merged release-prep PR.

**Done when:** the version bump + changelog are merged to `main`, `main` is green,
and you have named-confirmed the release-gating workflows and `mkit-*-pr` checks ran.

### Phase 3 — Tag and push

Tag the merge commit on `main` with a signed, annotated tag:

```sh
git tag -s vX.Y.Z -m "mkit X.Y.Z"
git tag -v vX.Y.Z          # confirm the fingerprint before pushing
git push origin vX.Y.Z
```

`validate-release-tag` rejects anything that is not: strict `vX.Y.Z[-prerelease]`,
annotated (not lightweight), GPG-signed by a fingerprint listed in the
`MKIT_RELEASE_GPG_FINGERPRINTS` repo/org variable, with the signing public key
importable from `keys.openpgp.org` or `keyserver.ubuntu.com`, and pointing at a
commit reachable from `origin/main`. Confirm the fingerprint is allowlisted and
the public key is on a keyserver **before** pushing.

**Done when:** the tag is pushed and `validate-release-tag` has passed (not the
whole workflow yet — just the gate).

### Phase 4 — Watch all three workflows to green

Enumerate by name; a green tag push is not proof each one ran.

- `release.yml`: all four platform builds, `sbom`, and `release` succeeded; a
  non-draft GitHub Release exists with the four `mkit-X.Y.Z-<triple>.tar.gz`
  archives, each `.sig`/`.crt`/`.cosign.bundle`, `SHA256SUMS`(+`.sig`/`.crt`/
  `.cosign.bundle`), `sbom.cdx.json`, and `mkit-X.Y.Z.release.dsse`.
- `publish-wasm`: **ran and succeeded** if the repo is public; **correctly skipped**
  if private (confirm which — a skip on a public repo is a bug).
- `crates-publish.yml`: succeeded; the version guard and `cargo semver-checks`
  gate passed, and every publishable crate landed on crates.io.
- `mcp-release.yml`: succeeded; the tag's corpus is indexed.

**Done when:** every workflow you expected shows a terminal green (or a
deliberate, correct skip) — checked by name, with the release assets present.

### Phase 5 — Verify the published release

Prove trust, don't assume it. On at least one macOS and one Linux host:

1. Download the archive for the platform.
2. Verify the cosign keyless signature (pins the signature to mkit's release
   workflow identity):
   ```sh
   VERSION=X.Y.Z; TARGET=aarch64-apple-darwin
   ARCHIVE="mkit-${VERSION}-${TARGET}.tar.gz"
   cosign verify-blob \
     --certificate-identity-regexp '^https://github\.com/officialunofficial/mkit/\.github/workflows/release\.yml@refs/tags/v[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$' \
     --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
     --bundle "${ARCHIVE}.cosign.bundle" "${ARCHIVE}"
   ```
   Expect `Verified OK`.
3. Verify the mkit-native DSSE attestation against the checked-in public key
   (`docs/keys/release-attest.pub`) from a source checkout:
   ```sh
   cargo run -p mkit-release-attest -- verify \
     --pubkeys docs/keys/release-attest.pub \
     --dsse "mkit-${VERSION}.release.dsse" \
     --tag "v${VERSION}" mkit-${VERSION}-*.tar.gz
   ```
4. Extract and run `./mkit-${VERSION}-${TARGET}/mkit version` — matches the tag.
   Confirm `share/man/man1/mkit.1` and the three completion files are present,
   then run a basic `mkit init` → add → `mkit commit` flow.
5. If npm published: `npm view @makechain/mkit-wasm@${VERSION}` and
   `npm audit signatures`.

**Done when:** cosign prints `Verified OK`, the DSSE attestation verifies, the
extracted binary reports the tagged version, and (if applicable) npm shows the
version with valid provenance.

### Phase 6 — Distribute and follow up

- Push `contrib/homebrew/mkit.rb` into `officialunofficial/homebrew-tap` as
  `Formula/mkit.rb`, updating the version and replacing each `PLACEHOLDER_SHA_*`
  with the matching archive hash from the release `SHA256SUMS`.
- Review the auto-generated release notes; pin/announce as usual.
- Open a follow-up PR restoring a fresh `## [Unreleased]` heading in
  `CHANGELOG.md`, and file issues for anything the smoke test surfaced.

**Done when:** the tap formula installs the new version (or the tap gap is
explicitly noted as deferred) and the `[Unreleased]` heading PR is open.

## Attestation and trust roots

Two independent trust roots ship on every release:

- **cosign keyless (Sigstore).** The signing identity is the release workflow
  itself via GitHub OIDC; every signature is Rekor-logged. No stored key. This is
  what `install.sh` enforces.
- **mkit-native DSSE attestation.** `mkit-X.Y.Z.release.dsse` is a DSSE/in-toto
  envelope over the **BLAKE3** digests of every archive, signed by the Ed25519
  release-attestation key. The secret seed lives **only** in the GitHub Actions
  secret `MKIT_RELEASE_ATTEST_KEY`; the public half is committed at
  `docs/keys/release-attest.pub` and embedded (as a rotation set) in the
  `mkit-cli` binary — that embedding is what lets `mkit self update` verify a
  release offline, needing neither cosign nor GitHub. `release.yml` fails the
  release if the secret is missing and self-verifies the fresh envelope against
  the checked-in public key, so a secret/pubkey mismatch can never ship.

### Rotating MKIT_RELEASE_ATTEST_KEY

The full custody and rotation runbook is `docs/RELEASE.md` → **Release
attestation key**. Follow it there; the durable shape is:

1. Generate a new keypair with `mkit-release-attest keygen`, piping the secret
   **straight into** `gh secret set MKIT_RELEASE_ATTEST_KEY` so it never touches
   disk; **append** the new `ed25519:` line to `docs/keys/release-attest.pub`
   (keep the old line).
2. Ship at least one **overlap release** listing **both** keys — binaries in the
   field only trust keys embedded at their build time, so removing the old key
   early strands them.
3. After the overlap release is out, delete the retired line in a follow-up PR.
4. **Compromise** is different: *replace* the compromised line instead of
   appending, note the affected tag range in `docs/RELEASE.md`, and say in the
   release notes that users on the affected versions must reinstall via
   `install.sh` (cosign path) rather than `mkit self update`.

## Guardrails

- Publish only by pushing a tag. Do not run `cargo publish`, `npm publish`, or
  `wrangler` by hand except to recover a partial publish (below) or seed a
  never-claimed package name per `docs/RELEASE.md`.
- If a crates.io publish fails mid-train, the landed crates **cannot** be
  re-published (immutable versions). Re-run the publish with `--exclude` for what
  already landed, or publish the remainder by hand — never bump-and-retag to work
  around it.
- The crates.io name `mkit` belongs to an unrelated project; the CLI publishes as
  **`mkit-cli`**. Tell users `cargo install mkit-cli`, never `mkit`.
- macOS binaries are **not** notarized; trust is the cosign verification, not
  Apple. On a Gatekeeper prompt, verify the archive then
  `xattr -d com.apple.quarantine <path>` — do not tell users to bypass verification.

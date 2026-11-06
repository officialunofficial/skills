---
name: kit-release
description: Cut a signed, attested kit release by driving the real tag-triggered release machinery end to end. Use when tagging a new kit version, publishing to crates.io / npm / GitHub Releases, or verifying a published release.
---

# Cutting a kit release

A single signed `vX.Y.Z` tag is the whole release trigger. Pushing it drives
`release.yml` off the tagged tree, which publishes the GitHub Release and the npm
package. A maintainer then publishes the crates by hand from the same tag. You
prepare `main`, push a good tag, then verify each channel actually ran and its
output is trustworthy.

`docs/RELEASE.md` in the repo is the authoritative runbook — this skill is the
repeatable procedure over it. When a detail here disagrees with `docs/RELEASE.md`
or the workflow files, the repo wins; re-read and update.

## The three channels one tag drives

| Channel | Driven by | Publishes |
|---|---|---|
| Binaries | `.github/workflows/release.yml` on `push: tags: 'v*.*.*'` | GitHub Release archives (4 targets) + signatures, SBOM, notices, provenance |
| npm wasm | `publish-npm` job of `release.yml` | `@officialunofficial/kit-wasm` on npm |
| crates.io | a maintainer running `cargo publish --workspace --locked` at the tag | every workspace crate without `publish = false`, in dependency order |

`release.yml` job order: `validate-release-tag` → `build` (×4 targets) → `sbom` /
`third-party-notices` (parallel) → `release` → `publish-npm`. `release-plz.yml`
only opens the release PR, on manual dispatch, once the repo variable
`KIT_RELEASE_PLZ_ENABLED` is `true`; it never tags or publishes.

Read the current workflows before every release — trigger, job order, and gates
change. Do not trust this table over the files.

## Procedure

Work top to bottom. `CHECKLIST.md` beside this file is the full line-by-line
checklist (pre-tag, wait, smoke test, distribution, post-release); use it as the
running to-do and mirror its checkboxes. Each phase below has a completion
criterion — do not advance until it is met.

### Phase 1 — Verify the current publish state (never assume)

Publish state drifts; confirm it live before planning the release.

- crates.io: `cargo search kit-core` (and `kit-bin` and the other `kit-*` library
  names) — is the target version already there? Versions are **immutable**; a
  re-publish of an existing version fails the whole train.
- npm: `npm view @officialunofficial/kit-wasm version` — at what version? The
  `publish-npm` job ends without publishing if the tag's version is already on npm,
  and it needs the trusted publisher on npmjs.com to name `release.yml` and the
  environment `npm`.
- Homebrew tap: check whether `officialunofficial/homebrew-tap` has a
  `Formula/kit.rb` yet.

**Done when:** you have written down, for this release, the current version on each
channel and whether the npm trusted publisher is in place — no assumptions carried
from a prior release.

### Phase 2 — Green main and bump

- `main` is green in CI. A green PR rollup does **not** prove the release-gating
  jobs ran — confirm by name that the `kit-ci-main` build on Cloud Build and the
  macOS leg (`macos.yml`) both succeeded on the release commit. The macOS leg runs
  only on pushes to `main` and on demand (`gh workflow run macos.yml --ref main`).
- Run `bash scripts/check-publish.sh` (the workspace `cargo publish` dry run) and
  `bash scripts/check-semver.sh`.
- Bump `[workspace.package].version` in `rust/Cargo.toml` to a version **not yet
  published** on crates.io (Phase 1).
- Move `CHANGELOG.md` items from `## [Unreleased]` into `## [X.Y.Z] - YYYY-MM-DD`,
  leaving a fresh `## [Unreleased]` heading above it.
- Update every hard-coded version site (README install snippets, `docs/INSTALL.md`,
  `docs/LIBKIT.md`, `CONTRIBUTING.md`, `install.sh` usage examples) — see
  `CHECKLIST.md` for the exact list.
- Land the bump via a merged release PR (from `release-plz.yml` or by hand).

**Done when:** the version bump + changelog are merged to `main`, `main` is green,
and you have named-confirmed `kit-ci-main` and `macos.yml` ran on that commit.

### Phase 3 — Tag and push

Tag the merge commit on `main` with a signed, annotated tag:

```sh
git tag -s vX.Y.Z -m "kit X.Y.Z"
git tag -v vX.Y.Z          # confirm the fingerprint before pushing
git push origin vX.Y.Z
```

`validate-release-tag` rejects anything that is not: strict `vX.Y.Z[-prerelease]`,
annotated (not lightweight), GPG-signed by a fingerprint listed in the
`KIT_RELEASE_GPG_FINGERPRINTS` repo/org variable, with the signing public key
importable from `keys.openpgp.org` or `keyserver.ubuntu.com`, and pointing at a
commit reachable from `origin/main`. Confirm the fingerprint is allowlisted and
the public key is on a keyserver **before** pushing.

**Done when:** the tag is pushed and `validate-release-tag` has passed (not the
whole workflow yet — just the gate).

### Phase 4 — Watch `release.yml` to green

Enumerate by name; a green tag push is not proof each job ran.

- All four platform builds, `sbom`, `third-party-notices`, and `release` succeeded;
  a non-draft GitHub Release exists with the four `kit-X.Y.Z-<triple>.tar.gz`
  archives, each `.sha256`/`.sig`/`.crt`/`.cosign.bundle`, `SHA256SUMS`(+`.sig`/
  `.crt`/`.cosign.bundle`), `sbom.cdx.json`, `THIRD-PARTY-NOTICES`, and
  `kit-X.Y.Z.provenance.jsonl`.
- `publish-npm`: **ran and succeeded**; `npm view
  @officialunofficial/kit-wasm@X.Y.Z version` prints `X.Y.Z`.

**Done when:** every job shows a terminal green — checked by name, with the release
assets present.

### Phase 5 — Verify the published release

Prove trust, don't assume it. On at least one macOS and one Linux host:

1. Download the archive for the platform.
2. Verify the cosign keyless signature (pins the signature to kit's release
   workflow build of this exact tag):
   ```sh
   VERSION=X.Y.Z; TARGET=aarch64-apple-darwin
   ARCHIVE="kit-${VERSION}-${TARGET}.tar.gz"
   cosign verify-blob \
     --certificate-identity "https://github.com/officialunofficial/kit/.github/workflows/release.yml@refs/tags/v${VERSION}" \
     --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
     --bundle "${ARCHIVE}.cosign.bundle" "${ARCHIVE}"
   ```
   Expect `Verified OK`.
3. Verify the SLSA build provenance:
   ```sh
   gh attestation verify "${ARCHIVE}" --repo officialunofficial/kit
   ```
4. Run the mechanized smoke test from a source checkout. It covers the cosign
   signature, the `SHA256SUMS` entry, `kit version` against the tag, the bundled
   `share/man/man1/kit.1` and three completion files, and a basic `kit init` →
   `kit keygen` → add → `kit commit` flow:
   ```sh
   scripts/release-smoke.sh --archive "${ARCHIVE}" --version "${VERSION}"
   ```
5. Check npm: `npm view @officialunofficial/kit-wasm@${VERSION} version`, and
   `npm audit signatures` in a project that installs that version.

**Done when:** cosign prints `Verified OK`, the provenance verifies, the smoke test
passes, and npm shows the version with valid provenance.

### Phase 6 — Publish the crates, distribute, and follow up

- Check out the signed tag and run `cargo publish --workspace --locked`, with a
  crates.io token that owns the `kit-*` crates. Keep the token out of the repo.
  Check that the tag matches the workspace version first.
- In `officialunofficial/homebrew-tap`, write `Formula/kit.rb` with the new version
  and the archive hashes from the release `SHA256SUMS`.
- Dispatch `gh workflow run release-verify.yml -f version=X.Y.Z` to check `cargo
  install`, `cargo binstall`, the install script, and Homebrew end to end.
- Review the auto-generated release notes; pin/announce as usual.
- Verify the release PR left a fresh `## [Unreleased]` heading in `CHANGELOG.md`,
  add co-owners after a crate's first publish (`cargo owner --add`), and file issues
  for anything the smoke test surfaced.

**Done when:** every publishable crate is on crates.io at the new version, the tap
formula installs the new version (or the tap gap is explicitly noted as deferred),
and `release-verify.yml` has run.

## Attestation and trust roots

Two independent trust roots ship on every release:

- **cosign keyless (Sigstore).** The signing identity is the release workflow
  itself via GitHub OIDC; every signature is Rekor-logged. No stored key. This is
  what `install.sh` and `kit self update` enforce.
- **SLSA build provenance.** `kit-X.Y.Z.provenance.jsonl` comes from
  `actions/attest-build-provenance` over the archives. Verify it with `gh attestation
  verify` or `slsa-verifier`.

No release step needs a repository secret or an npm token. The one allowlist to
keep current is `KIT_RELEASE_GPG_FINGERPRINTS`: a maintainer who leaves also leaves
it (`GOVERNANCE.md`).

## Guardrails

- Publish binaries and npm only by pushing a tag. Do not run `npm publish` by hand
  except to seed a new package per `docs/RELEASE.md` → **One-time setup**. Run `cargo
  publish` only from a checkout of the signed tag.
- If a crates.io publish fails mid-train, the landed crates **cannot** be
  re-published (immutable versions). Re-run the publish with `--exclude` for what
  already landed — never bump-and-retag to work around it.
- The crates.io name `kit` belongs to an unrelated project; the CLI publishes as
  **`kit-bin`**. Tell users `cargo install kit-bin`, never `kit`.
- macOS binaries are **not** notarized; trust is the cosign verification, not
  Apple. On a Gatekeeper prompt, verify the archive then
  `xattr -d com.apple.quarantine <path>` — do not tell users to bypass verification.

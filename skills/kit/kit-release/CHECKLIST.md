# mkit release checklist

The running to-do for one `vX.Y.Z` release. Mirrors `docs/RELEASE.md`'s
"Pre-release checklist"; when they disagree, `docs/RELEASE.md` wins. Do not skip
steps. Substitute the real version for `X.Y.Z` throughout.

## Pre-tag

- [ ] `main` is green (build + test) in CI.
- [ ] The release-gating workflows and the Google Cloud Build `mkit-*-pr` checks
      ran on the head commit — confirmed by name (a green rollup is not proof).
- [ ] `cd rust && cargo test --workspace` passes on a fresh clone.
- [ ] `cargo build --release` passes for each release target:
  - [ ] `--target=aarch64-apple-darwin`
  - [ ] `--target=x86_64-apple-darwin`
  - [ ] `--target=x86_64-unknown-linux-gnu`
  - [ ] `--target=aarch64-unknown-linux-gnu`
- [ ] `[workspace.package].version` in `rust/Cargo.toml` is bumped to a version
      **not already on crates.io** (immutable versions — a re-publish fails the run).
- [ ] `CHANGELOG.md`: items moved from `## [Unreleased]` into `## [X.Y.Z] - YYYY-MM-DD`.
- [ ] Version updated at every hard-coded site:
  - [ ] README install snippets
  - [ ] `contrib/homebrew/mkit.rb`
  - [ ] `docs/INSTALL.md` (both `VERSION=` snippets **and** the expected
        `mkit version` output — three sites)
  - [ ] `vX.Y.Z` examples in `install.sh` usage text
- [ ] `MKIT_RELEASE_GPG_FINGERPRINTS` repo/org variable contains your tag-signing
      fingerprint, and that public key is on `keys.openpgp.org` or
      `keyserver.ubuntu.com`.
- [ ] `MKIT_RELEASE_ATTEST_KEY` secret is present (release.yml hard-fails without it).
- [ ] Release-prep PR merged to `main`; `main` still green.

## Tag

- [ ] `git tag -s vX.Y.Z -m "mkit X.Y.Z"` (signed, annotated).
- [ ] `git tag -v vX.Y.Z` — signature valid and fingerprint is allowlisted.
- [ ] `git push origin vX.Y.Z`.
- [ ] `validate-release-tag` passed.

## Wait for the workflows (confirm each by name)

- [ ] `release.yml`: `validate-release-tag` + all four `build` targets + `sbom` + `release` succeeded.
- [ ] `crates-publish.yml`: version guard + `cargo semver-checks` gate passed; every publishable crate landed.
- [ ] `mcp-release.yml`: docs MCP corpus indexed for the tag.
- [ ] `publish-wasm`: succeeded (public repo) **or** correctly skipped (private repo) — verify which is expected.
- [ ] GitHub Release created as a non-draft.
- [ ] Archives present: `mkit-X.Y.Z-{aarch64,x86_64}-apple-darwin.tar.gz` and
      `mkit-X.Y.Z-{aarch64,x86_64}-unknown-linux-gnu.tar.gz`.
- [ ] `sbom.cdx.json` present.
- [ ] `mkit-X.Y.Z.release.dsse` present.
- [ ] `SHA256SUMS`, `SHA256SUMS.sig`, `SHA256SUMS.crt`, `SHA256SUMS.cosign.bundle` present.
- [ ] Per-archive `.sig` / `.crt` / `.cosign.bundle` present for every archive.

## Smoke test (≥1 macOS and ≥1 Linux host)

- [ ] Download the archive for your platform.
- [ ] `cosign verify-blob … --bundle <archive>.cosign.bundle <archive>` → `Verified OK`
      (regex-pinned identity from SKILL.md Phase 5).
- [ ] `mkit-release-attest verify --pubkeys docs/keys/release-attest.pub
      --dsse mkit-X.Y.Z.release.dsse --tag vX.Y.Z mkit-X.Y.Z-*.tar.gz` passes.
- [ ] `SHA256SUMS` matches the archive.
- [ ] `./mkit-X.Y.Z-<target>/mkit version` prints the tag version.
- [ ] Archive contains `share/man/man1/mkit.1`, `share/completions/mkit.bash`,
      `share/completions/_mkit`, `share/completions/mkit.fish`.
- [ ] Basic flow: `mkit init` → add a file → `mkit commit`.
- [ ] (If npm published) `npm view @makechain/mkit-wasm@X.Y.Z` and `npm audit signatures`.

## Distribution and announce

- [ ] Copy `contrib/homebrew/mkit.rb` → `officialunofficial/homebrew-tap`
      `Formula/mkit.rb`; update version; replace each `PLACEHOLDER_SHA_*` with the
      matching hash from release `SHA256SUMS`.
- [ ] (Deferred) Scoop manifest — until Windows builds land.
- [ ] Release notes reviewed (auto-generated + signing snippet).
- [ ] Pin the release in the repo sidebar; post in relevant channels.

## Post-release

- [ ] Open a PR restoring a fresh `## [Unreleased]` heading at the top of `CHANGELOG.md`.
- [ ] File follow-up issues for anything the smoke test surfaced.

## Recovery notes

- **Partial crates.io publish:** landed crates are immutable — re-run
  `crates-publish.yml` (or `cargo publish`) with `--exclude` for what already
  landed. Never bump-and-retag to route around it.
- **Missing tag-push event:** GitHub occasionally de-dupes tag pushes. Re-run the
  affected workflow via `workflow_dispatch` from the **tag ref** (not a branch) so
  cosign's OIDC certificate identity stays tag-scoped.
- **npm name never claimed:** first publish claims `@makechain/mkit-wasm`; if the
  automated job can't, seed once per `docs/RELEASE.md` → `MKIT_NPM_TOKEN`.

# kit release checklist

The running to-do for one `vX.Y.Z` release. Mirrors `docs/RELEASE.md`'s
"Pre-release checklist"; when they disagree, `docs/RELEASE.md` wins. Do not skip
steps. Substitute the real version for `X.Y.Z` throughout.

## Pre-tag

- [ ] `main` is green (build + test) in CI.
- [ ] The `kit-ci-main` build on Cloud Build and the macOS leg (`macos.yml`) both
      succeeded on the release commit — confirmed by name (a green rollup is not
      proof). Start the macOS leg with `gh workflow run macos.yml --ref main`.
- [ ] `cd rust && cargo test --workspace` passes on a fresh clone.
- [ ] `cargo build --release --locked -p kit-bin --bin kit` passes for each release target:
  - [ ] `--target=aarch64-apple-darwin`
  - [ ] `--target=x86_64-apple-darwin`
  - [ ] `--target=x86_64-unknown-linux-gnu`
  - [ ] `--target=aarch64-unknown-linux-gnu`
- [ ] `bash scripts/check-publish.sh` passes (the workspace `cargo publish` dry run).
- [ ] `[workspace.package].version` in `rust/Cargo.toml` is bumped to a version
      **not already on crates.io** (immutable versions — a re-publish fails the run).
- [ ] `bash scripts/check-semver.sh` passes after the bump (public API against the latest
      release tag; a breaking change fails unless the bump allows it).
- [ ] `CHANGELOG.md`: items moved from `## [Unreleased]` into `## [X.Y.Z] - YYYY-MM-DD`.
- [ ] Version updated at every hard-coded site:
  - [ ] README install snippets
  - [ ] `docs/INSTALL.md` (both `VERSION=` snippets **and** the expected
        `kit version` output — three sites)
  - [ ] `docs/LIBKIT.md` (the two `libkit` dependency snippets)
  - [ ] the `"=X.Y.Z"` example in `CONTRIBUTING.md`
  - [ ] `vX.Y.Z` examples in `install.sh` usage text
- [ ] `bash scripts/wasm-package.sh <empty dir>` builds the npm package, and
      `npm pack --dry-run` in that directory lists the files you expect.
- [ ] The trusted publisher of `@officialunofficial/kit-wasm` on npm names
      `release.yml` and the environment `npm`.
- [ ] `KIT_RELEASE_GPG_FINGERPRINTS` repo/org variable contains your tag-signing
      fingerprint, and that public key is on `keys.openpgp.org` or
      `keyserver.ubuntu.com`.
- [ ] The signing and reproducibility sections of `docs/RELEASE.md` are still accurate for this release.
- [ ] `SECURITY.md` disclosure contact confirmed reachable.
- [ ] Release PR merged to `main`; `main` still green.

## Tag

- [ ] `git tag -s vX.Y.Z -m "kit X.Y.Z"` (signed, annotated).
- [ ] `git tag -v vX.Y.Z` — signature valid and fingerprint is allowlisted.
- [ ] `git push origin vX.Y.Z`.
- [ ] `validate-release-tag` passed.

## Wait for the workflow (confirm each by name)

- [ ] `release.yml`: `validate-release-tag` + all four `build` targets + `sbom` +
      `third-party-notices` + `release` succeeded.
- [ ] `publish-npm` succeeded, and `npm view @officialunofficial/kit-wasm@X.Y.Z version` prints `X.Y.Z`.
- [ ] GitHub Release created as a non-draft.
- [ ] Archives present: `kit-X.Y.Z-{aarch64,x86_64}-apple-darwin.tar.gz` and
      `kit-X.Y.Z-{aarch64,x86_64}-unknown-linux-gnu.tar.gz`.
- [ ] `sbom.cdx.json` present.
- [ ] `THIRD-PARTY-NOTICES` present.
- [ ] `SHA256SUMS`, `SHA256SUMS.sig`, `SHA256SUMS.crt`, `SHA256SUMS.cosign.bundle` present.
- [ ] Per-archive `.cosign.bundle` present for every archive.
- [ ] `kit-X.Y.Z.provenance.jsonl` present, and
      `gh attestation verify <archive> --repo officialunofficial/kit` succeeds for
      at least one archive.

## Smoke test (≥1 macOS and ≥1 Linux host)

Run `scripts/release-smoke.sh --archive kit-X.Y.Z-<target>.tar.gz --version X.Y.Z`.
It covers these items:

- [ ] Download the archive for your platform.
- [ ] `cosign verify-blob … --bundle <archive>.cosign.bundle <archive>` → `Verified OK`
      (exact identity from SKILL.md Phase 5).
- [ ] `SHA256SUMS` matches the archive.
- [ ] `./kit-X.Y.Z-<target>/kit version` prints the tag version.
- [ ] Archive contains `share/man/man1/kit.1`, `share/completions/kit.bash`,
      `share/completions/_kit`, `share/completions/kit.fish`.
- [ ] Basic flow: `kit init` → add a file → `kit commit`.

Then, outside the script:

- [ ] `npm audit signatures` passes in a project that installs
      `@officialunofficial/kit-wasm@X.Y.Z`.

## Distribution and announce

- [ ] Check out the signed tag and run `cargo publish --workspace --locked`; every
      publishable crate landed.
- [ ] In `officialunofficial/homebrew-tap`, write `Formula/kit.rb` with the new
      version and the archive hashes from release `SHA256SUMS`.
- [ ] Release notes reviewed (auto-generated + signing snippet).
- [ ] Pin the release in the repo sidebar; post in relevant channels.
- [ ] `gh workflow run release-verify.yml -f version=X.Y.Z` — `cargo install`,
      `cargo binstall`, the install script, and Homebrew.

## Post-release

- [ ] Verify the release PR left a fresh `## [Unreleased]` heading at the top of `CHANGELOG.md`.
- [ ] After a crate's first publish, add co-owners with `cargo owner --add <maintainer> <crate>`.
- [ ] File follow-up issues for anything the smoke test surfaced.

## Recovery notes

- **Partial crates.io publish:** landed crates are immutable — re-run
  `cargo publish` with `--exclude` for what already landed. Never bump-and-retag to
  route around it.
- **Missing tag-push event:** GitHub occasionally de-dupes tag pushes. Re-run
  `release.yml` via `workflow_dispatch` from the **tag ref** (not a branch) so
  cosign's OIDC certificate identity stays tag-scoped.
- **npm trusted publisher expired or never set:** a new trusted publisher expires
  unless it sees a successful publish within 2 days. Follow `docs/RELEASE.md` →
  **One-time setup**.

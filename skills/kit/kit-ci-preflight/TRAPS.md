# Subsystem traps

Check these when the PR touches the named areas.

- **Generated buffa/connectrpc code** (`rust/crates/kit-rpc/generated/**`,
  `rust/crates/kit-rpc/proto/**`, or the shared `proto/` tree): a version bump or
  `.proto` edit needs a **regen + commit**, not a version-only change. Run
  `scripts/regen-rpc-proto.sh` and `scripts/regen-transport-proto.sh` (both need
  `protoc >= 27`), then commit the refreshed `generated/` tree and `rust/Cargo.lock`.
  `scripts/check-generated-fresh.sh` fails on any drift; it also needs the
  `wasm32-unknown-unknown` target. It runs in the `generated` step of `kit-ci-pr`
  and in `generated code is fresh`. Dependabot **ignores `buffa*`/`connectrpc*` by
  design** (`.github/dependabot.yml`), so these never arrive as an automated bump.
- **Release pipeline** (`.github/workflows/release.yml`): it does not run on PRs —
  a signed `v*.*.*` tag drives it (GitHub release archives + cosign keyless + SLSA
  build provenance; the `@officialunofficial/kit-wasm` npm publish in its
  `publish-npm` job). No workflow publishes to crates.io; a maintainer does that by
  hand. On a PR, `release-artifact-check` and `publish-dry-run` in `kit-supply-pr`
  and `Build twice and compare` are the only signals. Confirm current
  release/publish state in `docs/RELEASE.md` and the workflows rather than trusting
  any snapshot.

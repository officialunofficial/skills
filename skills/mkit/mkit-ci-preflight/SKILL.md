---
name: mkit-ci-preflight
description: >-
  Verify an mkit PR is genuinely green across its real CI surface — the GitHub
  Actions gates AND the Google Cloud Build `mkit-*-pr` checks — before merging.
  Use when preparing to merge a PR into mkit's `main`, when a PR looks green but
  you want to confirm the expected workflows actually ran, when a rustdoc/docs
  or codegen change might slip past the GitHub rollup, or when reviving CI on a
  stale branch.
---

# mkit CI preflight

mkit splits its CI across **two systems**: GitHub Actions and **Google Cloud
Build** (GCB). A green GitHub rollup is *not* proof the PR is mergeable — the
Linux Rust gate, docs-lint, supply-chain, codegen-freshness, and unsafe-ceiling
checks all live on GCB and post their own commit statuses named `mkit-*-pr`.
Path filters, fork gating, and stale merge-refs can each leave a required check
silently absent while the PR still shows green.

This skill is a pre-merge preflight: enumerate the checks that must pass, confirm
they actually *ran*, and clear the subsystem traps. Work the steps in order.

## Ground truth first

The check names and gates below are the current design, but CI configs move.
Before trusting this list, reconcile it against the repo:

- GitHub workflows: `.github/workflows/*.yml`
- GCB configs + trigger table: `cloudbuild/*.yaml`, `cloudbuild/README.md`
- Stated merge bar: `CONTRIBUTING.md` ("What to expect in review")

If a name here isn't found in those files, trust the files and note the drift.

## Step 1 — Pull the live check state

Get the actual per-check results, not a rollup summary. For PR number `<N>`:

```sh
gh pr checks <N> --watch        # live table of every check + status
gh pr view <N> --json statusCheckRollup \
  --jq '.statusCheckRollup[] | {name:.name, status:.status, conclusion:.conclusion, ctx:.context}'
```

**Done when** you have a flat list of every check with its conclusion. GCB posts
**commit statuses** (the `context` field, e.g. `mkit-ci-pr`), while GitHub
Actions posts **check runs** (the `name` field, e.g. `Rust CI gate`) — your list
must include both shapes. If `statusCheckRollup` shows only Actions check-runs
and no `mkit-*` contexts, query statuses directly:

```sh
gh api repos/{owner}/{repo}/commits/$(gh pr view <N> --json headRefOid -q .headRefOid)/status \
  --jq '.statuses[] | {context:.context, state:.state, target:.target_url}'
```

## Step 2 — Confirm the GitHub Actions gates are green AND present

Each Actions workflow exposes a stable **gate job** that is the required check.
The gate is designed to fail (not skip) when its core job didn't run, so a
present-and-success gate is trustworthy — but confirm the gate is *present*, not
just not-failing.

| Workflow (`name:`) | Required gate check | Runs on every PR? | Covers |
|---|---|---|---|
| `CI: Rust` | `Rust CI gate` | Yes (macOS leg always) | macOS build/test/clippy/fmt/doctests/version-contract; keystore matrix is approval-gated |
| `CI: Web` | `Web CI gate` | Yes (gate always; heavy job path-filtered) | wasm build, typecheck, vitest, lint, fmt, prod build, bundler smoke |
| `CI: MCP` | `MCP CI gate` | Yes (gate always; heavy job path-filtered) | MCP corpus index, typecheck, test |
| `Meta: actionlint` | `Lint workflows` | Only if `.github/**` changed | workflow + shellcheck lint |

**Done when** `Rust CI gate`, `Web CI gate`, and `MCP CI gate` are all present
and `success`. If any gate is missing entirely (not even pending), the workflow
never triggered — treat that as a red flag and investigate before proceeding.

Notes that prevent false confidence:
- The `web`/`mcp` heavy jobs legitimately **skip** when the PR touches no
  `apps/web/**` / `apps/mcp/**` (etc.) paths; the gate still reports `success`.
  That's expected — the gate, not the heavy job, is the signal.
- `Lint workflows` is **absent** on PRs that don't touch `.github/**`. Absent is
  correct there; only demand it when the PR edits workflows or actions.
- `Security: Rust` and `Nightly: Fuzz` are **scheduled/dispatch only** — they do
  NOT run per-PR (the per-PR supply-chain gate moved to GCB, see Step 3). Don't
  wait on them for a PR.

## Step 3 — Confirm the GCB `mkit-*-pr` checks ran AND passed (the big gap)

This is where GitHub-green PRs are actually broken. The entire Linux Rust suite,
rustdoc-lint, supply-chain, codegen-freshness, and unsafe-ceiling live here.
Enumerate each expected `mkit-*-pr` context **by name** and confirm its state:

| GCB context | Config | Covers | Path-gated? |
|---|---|---|---|
| `mkit-ci-pr` | `cloudbuild/ci.yaml` | Linux fmt/clippy/build/signers/nextest/ignored-lane/fuzz-unit/doctests/version-contract/enc-transport/**MSRV**/`cargo check --all-targets` | No (runs unless change is web/docs/md-only) |
| `mkit-docs-pr` | `cloudbuild/docs.yaml` | `cargo doc` with `RUSTDOCFLAGS=-D warnings`, both workspaces | No (unless web/docs-only) |
| `mkit-security-pr` | `cloudbuild/security.yaml` | `cargo audit` (both workspaces) + `cargo deny` | **Yes** — only `**/Cargo.toml`, `**/Cargo.lock`, `rust/deny.toml` |
| `mkit-codegen-pr` | `cloudbuild/codegen.yaml` | vendored buffa/connectrpc codegen freshness | **Yes** — protos / `build.rs` / `scripts/regen-*.sh` / `**/generated/**` |
| `mkit-geiger-pr` | `cloudbuild/geiger.yaml` | unsafe-expression ceiling (`cargo geiger`) | No |

**Done when** every non-path-gated GCB check (`mkit-ci-pr`, `mkit-docs-pr`,
`mkit-geiger-pr`) is present and `success`, and each path-gated check
(`mkit-security-pr`, `mkit-codegen-pr`) is either `success` or legitimately
absent because the PR changed none of its trigger paths (verify with
`gh pr diff <N> --name-only`).

Two traps to clear here:

- **docs-lint gap.** `cargo doc -D warnings` runs ONLY on `mkit-docs-pr`, never
  on the macOS `Rust CI gate`. A broken intra-doc link or bad docstring passes
  GitHub-green and lands on `main`. If the PR touches any Rust source or doc
  comment, `mkit-docs-pr` must be present and green — do not merge on the GitHub
  rollup alone.
- **fork/`gcbrun` gating.** GCB PR triggers auto-run for org collaborators but
  require a maintainer **`/gcbrun`** comment for external/fork PRs
  (`cloudbuild/README.md`). On a fork PR with no `mkit-*` statuses at all, the
  GCB side never ran — request `/gcbrun` and wait, rather than reading absence
  as pass.

## Step 4 — Enumerate expected-vs-actual and account for every gap

Map what the PR changed to what *should* have run, then confirm each fired. A
green rollup does not mean the right things ran.

1. `gh pr diff <N> --name-only` → the changed-path set.
2. Derive the expected check set from the path filters in Steps 2–3.
3. For each expected check, confirm a real run (Steps 1–3). For each check that
   is *absent*, name the path-filter reason it legitimately skipped.

**Done when** every check is either present-and-green or has a stated, verified
skip reason — no check is unexplained-absent. Common legitimate absences: a
Rust-only PR skips `mkit-security-pr` (no `Cargo.*` change) and the web/mcp heavy
jobs; a docs-only PR skips `mkit-ci-pr`. An *unexplained* absence means the
trigger didn't fire — resolve it before merging.

## Step 5 — Distrust CI on a stale branch; refresh the ref

If the PR branch is behind `main`, its checks may be stale or run against a
semantically broken auto-merge ref, and a retarget alone does **not** re-trigger
workflows.

```sh
gh pr view <N> --json mergeStateStatus,baseRefName -q '{state:.mergeStateStatus, base:.baseRefName}'
```

If `mergeStateStatus` is `BEHIND` (or the branch is otherwise stale), merge (or
rebase) `main` into the PR branch and push, then re-run Steps 1–4 on the fresh
head SHA.

**Done when** the checks you trusted in Steps 1–4 ran against the branch's
current head SHA with `main` merged in — not an older or auto-generated ref.

## Step 6 — Confirm the branch-protection bar

`main` requires code-owner approval (CODEOWNERS routes to
`@officialunofficial/makechain`), and the merge bar in `CONTRIBUTING.md` includes
items CI can't fully see: a regression test for bug fixes, a CHANGELOG entry
under "Unreleased" for user-visible changes, a spec + golden-vector update for
format changes, and a second reviewer + threat-model note for crypto/keystore
changes.

**Done when** the PR has the required approving review, and any
CONTRIBUTING-mandated artifact for this PR's change class is present in the diff.

## Subsystem traps to check when the PR touches these areas

- **Vendored buffa/connectrpc codegen** (`rust/crates/mkit-rpc/generated/**`,
  `rust/crates/mkit-repo-client/**`, `apps/repo-worker/**`, or the shared
  `.proto`): a version bump or `.proto` edit needs a **regen + commit**, not a
  version-only change. Run `scripts/regen-rpc-proto.sh` and
  `scripts/regen-repo-proto.sh` (both need `protoc >= 27` + the
  `wasm32-unknown-unknown` target), then commit the refreshed `generated/` dirs
  and the affected lockfiles — the vendored consumers span `rust/Cargo.lock`,
  `contrib/signers/Cargo.lock` (its buffa runtime stays in lockstep), and
  `apps/repo-worker/Cargo.lock`. `mkit-codegen-pr` fails on any drift. Dependabot
  **ignores `buffa*`/`connectrpc*` by design** (`.github/dependabot.yml`), so
  these never arrive as an automated bump. Watch the `json` default-feature
  gotcha noted in the buffa vendoring.
- **Codecov via Cloud Build** (`cloudbuild/coverage.yaml`, `mkit-coverage-main`):
  coverage runs on **main push only**, not on PRs (it's informational —
  `require_ci_to_pass: false`, patch/project statuses non-blocking), so don't
  wait on it pre-merge. If you edit that config, reference the secret with
  `printenv CODECOV_TOKEN` into a lowercase var — never `${CODECOV_TOKEN}` or a
  brace-wrapped `$$`-escape, which `dynamicSubstitutions` rejects at config time
  and crashes the build before it starts.
- **Cloudflare Workers Builds (web + MCP + Rust workers)**: `apps/web` (mkit.sh)
  and `apps/mcp` deploy on **merge to `main`** via CF Workers Builds' git
  integration — there is **no GitHub Action for the deploy**, so it will not show
  as a PR check; `mcp.yml`/`web.yml` only *validate*. The Rust workers
  (`apps/repo-worker`, `apps/keys-worker`) need a CF dashboard root-dir + a build
  command that installs rustup + worker-build, because the CF build image has no
  Rust toolchain, and CF build logs aren't readable via the OAuth token. Treat a
  post-merge deploy as unverified by PR CI: watch the CF dashboard after merge
  rather than assuming the green PR proves the deploy.
- **Release pipeline** (`.github/workflows/release.yml`, `crates-publish.yml`,
  `mcp-release.yml`): none of these run on PRs — a signed `v*.*.*` tag drives
  them (GitHub release archives + cosign-keyless + the `MKIT_RELEASE_ATTEST_KEY`
  DSSE attestation in `release.yml`; crates.io in `crates-publish.yml`; the
  `@makechain/mkit-wasm` npm publish job in `release.yml`; the MCP corpus seed in
  `mcp-release.yml`). Per CONTRIBUTING, changes to `release.yml`/`docs/RELEASE.md`
  require a follow-up dry-run; confirm current release/publish state in
  `docs/RELEASE.md` and the workflows rather than trusting any snapshot.

## Merge decision

Merge only when: all three GitHub gates green (Step 2); all applicable
`mkit-*-pr` GCB checks green with every absence explained (Steps 3–4); checks ran
against a fresh head with `main` merged in (Step 5); code-owner approval and the
CONTRIBUTING artifacts are in place (Step 6); and any subsystem trap for the
files this PR touches has been cleared. If any item is unexplained-absent rather
than green, resolve it first — absence is not a pass.

---
name: kit-ci-preflight
description: >-
  Verify a kit PR is genuinely green across its real CI surface — the GitHub
  Actions gates AND the Google Cloud Build `kit-*-pr` checks — before merging.
  Use when preparing to merge a PR into kit's `main`, when a PR looks green but
  you want to confirm the expected workflows actually ran, when a rustdoc/docs
  or codegen change might slip past the GitHub gates, or when reviving CI on a
  stale branch.
---

# kit CI preflight

kit splits its CI across **two systems**: GitHub Actions and **Google Cloud
Build** (GCB). A green `Rust CI gate` is *not* proof the PR is mergeable — docs,
golden vectors, generated code, writing rules, unsafe policy, wasm, fuzz smoke,
and the supply checks all run in the GCB `kit-ci-pr` build, which posts its own
check. Path filters, `/gcbrun` gating, and stale merge-refs can each leave a check
silently absent while the PR still shows green.

This skill is a pre-merge preflight: enumerate the checks that must pass, confirm
they actually *ran*, and clear the subsystem traps. Work the steps in order.

## Ground truth first

The check names and gates below are the current design, but CI configs move.
Before trusting this list, reconcile it against the repo:

- GitHub workflows: `.github/workflows/*.yml`
- GCB configs + trigger table: `cloudbuild/*.yaml`, `cloudbuild/README.md`,
  `scripts/setup-cloud-build.sh`
- Stated merge bar: `CONTRIBUTING.md`, `GOVERNANCE.md`

If a name here isn't found in those files, trust the files and note the drift.

## Step 1 — Pull the live check state

Get the actual per-check results, not a rollup summary. For PR number `<N>`:

```sh
gh pr checks <N> --watch        # live table of every check + status
gh pr view <N> --json statusCheckRollup \
  --jq '.statusCheckRollup[] | {name:.name, status:.status, conclusion:.conclusion}'
```

**Done when** you have a flat list of every check with its conclusion. GCB and
GitHub Actions both post **check runs**. A GCB check shows as `<trigger> (<project>)`,
e.g. `kit-ci-pr (official-unofficial)`; an Actions check shows its job name, e.g.
`Rust CI gate`. Your list must include both. If it shows no `kit-*` check, query
the head commit directly:

```sh
gh api repos/{owner}/{repo}/commits/$(gh pr view <N> --json headRefOid -q .headRefOid)/check-runs \
  --jq '.check_runs[] | {name:.name, status:.status, conclusion:.conclusion}'
```

## Step 2 — Confirm the GitHub Actions gates are green AND present

| Workflow (`name:`) | Check | Runs on every PR? | Covers |
|---|---|---|---|
| `CI: Rust` | `Rust CI gate` | Yes | Linux `fmt`, `clippy`, `msrv`, `build and test`, `nextest` |
| `CI: Proto` | `buf lint + buf breaking`, `generated code is fresh` | Yes | proto lint, breaking check against the base branch, generated code |
| `CI: Third-party notices` | `Third-party notices gate` | Yes (gate always; `cargo about generate` path-filtered) | license attribution of the dependency graph |
| `CI: Mutation testing` | `cargo-mutants (changed lines)` | Yes | mutants on the changed lines |
| `CI: Semver` | `cargo semver-checks` | Only if `rust/**` or the workflow changed | public API against the latest release tag |
| `CI: Reproducible build` | `Build twice and compare` | Only if `rust/**`, `scripts/toolchain-version.sh`, `release.yml`, or the workflow changed | two release builds of one commit agree |
| `Meta: docs lint` | `Docs checks` | Only if `**/*.md`, `docs/**`, its check scripts, or the workflow changed | spec status, doc paths, writing rules |
| `Meta: actionlint` | `Lint workflows` | Only if `.github/workflows/**` or `.github/actions/**` changed | workflow lint |

**Done when** `Rust CI gate`, both `CI: Proto` checks, `Third-party notices gate`,
and `cargo-mutants (changed lines)` are all present and `success`, and each
path-filtered check is `success` or legitimately absent. If an every-PR check is
missing entirely (not even pending), the workflow never triggered — treat that as
a red flag and investigate before proceeding.

Notes that prevent false confidence:
- `Rust CI gate` runs with `if: always()` and fails unless every job it needs
  succeeded, so a present-and-success gate is trustworthy. The GitHub job to read
  is the gate, not the jobs under it.
- `cargo about generate` legitimately **skips** when the PR touches no dependency
  input; `Third-party notices gate` still reports `success`. The gate, not the
  heavy job, is the signal.
- `Enable auto-merge` (Dependabot PRs only) and `cargo-mutants (full sweep, …)`
  (schedule and dispatch only) show as `skipped` on a normal PR. That is correct.
- `CI: macOS` runs on pushes to `main` and on demand, **never** on a PR. `Security:
  Rust`, `Nightly: Fuzz`, and `Nightly: Formal verification` are **scheduled/dispatch
  only**. Don't wait on any of them for a PR.

## Step 3 — Confirm the GCB `kit-*-pr` checks ran AND passed (the big gap)

This is where GitHub-green PRs are actually broken. Every Linux gate lives here,
including rustdoc-lint, golden vectors, and the writing rules. Enumerate each
expected `kit-*-pr` check **by name** and confirm its state:

| GCB check | Config | Covers | Path-gated? |
|---|---|---|---|
| `kit-ci-pr` | `cloudbuild/ci.yaml` | steps `fmt`, `lint` (+ MSRV), `docs`, `nextest-archive`, `nextest-1`..`3`, `ignored-lane`, `tests-misc`, `version`, `cli-baseline`, `wasm`, `fuzz-smoke`, `golden`, `generated`, `writing`, `unsafe`, `supply`, `workflows`, `ci-gates` | No — runs on every PR, docs-only included |
| `kit-supply-pr` | `cloudbuild/supply.yaml` | `third-party-notices`, `release-artifact-check`, `publish-dry-run` | **Yes** — `rust/Cargo.lock`, `rust/Cargo.toml`, `rust/crates/**/Cargo.toml`, `rust/crates/kit-bin/**`, `rust/about.*`, `rust/rust-toolchain.toml`, `scripts/check-release-artifact-features.sh`, `scripts/check-publish.sh`, `scripts/release/**`, `.github/workflows/release.yml`, `cloudbuild/supply.yaml` |
| `kit-connect-pr` | `cloudbuild/connect-latest.yaml` | latest-release probe of the Connect stack | **Yes** — `**/Cargo.toml`, `**/Cargo.lock`, `scripts/check-connect-latest.sh`, `cloudbuild/connect-latest.yaml` |

**Done when** `kit-ci-pr` is present and `success`, and each path-gated check
(`kit-supply-pr`, `kit-connect-pr`) is either `success` or legitimately absent
because the PR changed none of its trigger paths (verify with
`gh pr diff <N> --name-only`).

Two traps to clear here:

- **docs-lint gap.** `cargo doc -Dwarnings` runs ONLY in the `docs` step of
  `kit-ci-pr`, never in `Rust CI gate`. A broken intra-doc link or bad docstring
  passes the GitHub gate. The `writing` step also scans new commit messages, and
  `Rust CI gate` sees neither. Do not merge on `Rust CI gate` alone.
- **fork/`gcbrun` gating.** GCB PR triggers auto-run for org collaborators but
  require a maintainer **`/gcbrun`** comment for external/fork PRs
  (`cloudbuild/README.md`). On a fork PR with no `kit-*` checks at all, the
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
skip reason — no check is unexplained-absent. Common legitimate absences: a PR
with no manifest change skips `kit-connect-pr`; a Rust-only PR with no Markdown
change skips `Docs checks`; a docs-only PR skips `cargo semver-checks` and `Build
twice and compare`. `kit-ci-pr` has no path filter. An *unexplained* absence means
the trigger didn't fire — resolve it before merging.

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

## Step 6 — Confirm the review bar

CODEOWNERS routes every path to `@officialunofficial/officialunofficial`. Check
what GitHub actually enforces on `main` rather than assuming it:

```sh
gh api repos/{owner}/{repo}/branches/main/protection   # 404 "Branch not protected" means GitHub enforces nothing
gh api repos/{owner}/{repo}/rulesets
```

`cloudbuild/README.md` names `kit-ci-pr` as the required check and `Rust CI gate`
as the GitHub job a maintainer can require; when GitHub enforces neither, this
preflight is the bar. `CONTRIBUTING.md` and `GOVERNANCE.md` add items CI can't
fully see: a test for each new behavior, a test that fails without the fix for bug
fixes, a fuzz target for each parser, a spec + golden-vector update in the same
commit for format changes, signed commits, and review from a second maintainer
(when one exists) for a change to a format, a signing rule, a trust rule, or the
release pipeline.

**Done when** the PR has the review its change class needs, and any
CONTRIBUTING-mandated artifact for this PR's change class is present in the diff.

## Subsystem traps to check when the PR touches these areas

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

## Merge decision

Merge only when: every applicable GitHub check is green (Step 2); `kit-ci-pr` and
any applicable `kit-*-pr` GCB check are green with every absence explained (Steps
3–4); checks ran against a fresh head with `main` merged in (Step 5); the required
review and the CONTRIBUTING artifacts are in place (Step 6); and any subsystem trap
for the files this PR touches has been cleared. If any item is unexplained-absent
rather than green, resolve it first — absence is not a pass.

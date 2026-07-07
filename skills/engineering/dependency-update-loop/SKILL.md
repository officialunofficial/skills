---
name: dependency-update-loop
description: Recurring maintenance pass over automated dependency-bump PRs (Dependabot, Renovate, or similar) — rebase, relock, verify, and report what's ready to merge. Meant to be handed to a time-based loop or schedule, not run once.
disable-model-invocation: true
---

# Dependency update loop

Automated dependency-bump PRs rot the moment a lockfile-adjacent PR merges ahead of them, or two bumps in the same ecosystem conflict with each other. Left alone, they pile up stale and unreviewable. This is one pass over that backlog — designed to be re-run on an interval via a time-based loop, not to fix everything in one sitting.

## Step 1 — Enumerate the backlog

List open PRs from the bot(s) this repo uses (author is a recognizable bot account, or a branch prefix like `dependabot/*` / `renovate/*`). For each, capture: ecosystem, branch, base, mergeable state, and whether CI ran at all.

**Done when** you have that list, oldest first.

## Step 2 — Detect the ecosystems in play

Don't assume — check what's actually in the repo:

- Node/Bun/npm/pnpm/yarn: `package.json` + its lockfile
- Rust: `Cargo.toml` + `Cargo.lock`
- Go: `go.mod` + `go.sum`
- Python: `pyproject.toml`/`requirements*.txt` + `poetry.lock`/`uv.lock`

A monorepo may have more than one; match each PR to the ecosystem its diff touches.

## Step 3 — Refresh each PR

For every PR still open from Step 1:

1. Check out its branch, rebase (or merge) the current base into it.
2. Re-run that ecosystem's install/lock step so the lockfile reflects the rebase (e.g. reinstall after a Node rebase, `cargo update -p <crate>` conflicts, `go mod tidy`) — a stale lockfile is the single most common reason these PRs go red for reasons unrelated to the actual bump.
3. Push the refreshed branch.
4. Run the project's real verification gate (its test suite, build, and lint — whatever `just ci`/`make ci`/an npm script/CI workflow actually runs) locally or by re-triggering CI; don't trust a stale check run from before the rebase.

**Done when** every PR from Step 1 has a fresh CI result against its current head, not a cached one.

## Step 4 — Batch same-ecosystem PRs before trusting any single one green

Two PRs in the same ecosystem can each pass individually and still conflict once both land (transitive version skew). Before recommending merge, rebase the *second* PR onto a branch that already includes the *first*'s change and re-verify — or merge the smaller/safer bump first and let Step 3 refresh the rest against the new base on the next cycle.

## Step 5 — Report, don't merge blindly

For each PR, report exactly one of:

- **Ready** — rebased, relocked, gate green against current head. Merge only if you've been given standing authorization to merge dependency PRs; otherwise leave it for a human to click.
- **Needs a human** — a major-version bump with a breaking-change note, a failing test that looks like a real incompatibility (not a stale-lockfile artifact), or a conflict Step 4 didn't resolve cleanly.
- **Unchanged since last pass** — nothing to do; don't re-report it every cycle, only note it once and skip it on subsequent runs until its state changes.

**Stop condition for the loop as a whole:** no open bot PRs remain, or a full pass produces zero state changes from the previous one.

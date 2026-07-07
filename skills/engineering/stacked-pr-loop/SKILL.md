---
name: stacked-pr-loop
description: Recurring check-in on a stack of dependent PRs — rebase children onto updated parents, surface CI state, flag anything waiting on a human-only gate, and report only what changed since last time. Meant to be handed to a time-based loop, not run once.
disable-model-invocation: true
---

# Stacked-PR loop

A **stack** is a chain of PRs where each depends on the one below it merging first (`main <- A <- B <- C`). Left unattended, a stack rots two ways: a lower PR updates and the ones above it go stale, or CI needs a nudge (a manual trigger comment, a required check that didn't fire) and nobody's watching. This is one check-in pass, meant to run on an interval, not a one-shot fix.

## Step 1 — Map the current stack

List the PRs in the chain and their actual base branches (not assumed order — read each PR's base). Note which ones are merged, open, or closed-unmerged; a closed-unmerged PR downstream of it needs re-basing onto whatever the next real base is.

**Done when** you have the true current shape of the stack, bottom to top.

## Step 2 — Rebase anything behind its base

For each open PR whose base has moved since the PR's branch was last updated (the base PR merged, or `main` advanced and this is the bottom of the stack): rebase the branch onto the current base and push. Do this bottom-up — rebasing a PR before the one below it is settled just means redoing the work.

**Done when** every open PR in the stack is rebased onto its actual current base, or you've confirmed it already was.

## Step 3 — Pull real CI state, not a cached rollup

For each PR, get the live per-check state against its *current* head (a rebase invalidates prior runs). If a check is required but hasn't run, that's a red flag, not a pass — don't read absence as success.

## Step 4 — Flag human-only gates explicitly

Some CI systems require a maintainer-posted trigger comment for a check to run at all (a bot/fork-safety gate). If a PR's CI never fired and the repo uses one of these gates, name it as the specific thing blocking progress — don't just report "CI hasn't run." This is a gate only a human can clear; the loop's job is surfacing that it's waiting, not working around it.

## Step 5 — Report deltas only

Compare against the last pass. Report:

- **Changed since last check** — a PR went green, went red, got rebased, or is newly waiting on a human gate.
- **Ready to merge** — bottom of the stack, green, rebased onto current `main`. Merge bottom-up only if you have standing authorization to merge without asking each time; otherwise surface it and stop.
- **Unchanged** — skip it in the report; repeating the same status every cycle just trains you to stop reading.

**Stop condition for the loop as a whole:** the entire stack has merged, or a full pass produces no state changes from the previous one.

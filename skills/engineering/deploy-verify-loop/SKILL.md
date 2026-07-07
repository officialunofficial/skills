---
name: deploy-verify-loop
description: Post-deploy verification loop — poll a rollout until every instance is on the new version and healthy, then run one smoke check against a real user path. Meant to be handed to a time-based loop with a timeout, not polled by hand.
disable-model-invocation: true
---

# Deploy-verify loop

A deploy that reports success isn't the same as a deploy that's actually healthy — a rollout can finish while a pod crash-loops, a health check flakes, or the new version 400s on a path the deploy step never exercised. This loop watches the window right after a deploy closes and turns "did it work?" into a checked answer instead of a hope.

## Step 1 — Establish what "rolled out" means here

Before polling, confirm the concrete signal for this deploy target — it varies by platform:

- Kubernetes: every replica of the relevant Deployment(s)/StatefulSet(s) on the new image digest/tag, `Ready`, no `CrashLoopBackOff`.
- A PaaS/serverless platform: the release/deployment resource's own status field reaches its terminal "active"/"succeeded" state.
- A generic host: the running process's version endpoint (or build hash) matches what you just shipped.

**Done when** you can name the exact check that proves the rollout finished — not "give it a few minutes."

## Step 2 — Poll with a bound, not indefinitely

Check the Step 1 signal on an interval matched to how fast this deploy actually rolls (a Kubernetes rollout finishes in seconds to minutes; a CDN/edge propagation can take longer — don't poll a slow system every few seconds). Set a hard timeout. If the timeout is reached before the signal clears, stop and report exactly what's still not ready — don't keep polling past the bound hoping it resolves.

## Step 3 — Check for the failure the rollout signal can't see

A rollout can report "ready" while the new version is still wrong: pull recent logs for the just-deployed instances and scan for a crash loop, an elevated error rate, or a startup panic that a readiness probe doesn't catch. If anything here looks wrong, stop and report it — don't proceed to the smoke check against something already unhealthy.

## Step 4 — Run one smoke check

Exercise a real, critical-path action end to end (not just a `/health` endpoint returning 200) — whatever this system's core round-trip is: a request that touches the code you just shipped, not a static page. One meaningful check beats a broad shallow sweep here; the goal is "does the thing users actually do still work," not full regression coverage.

**Done when** the smoke check has run against the newly-deployed instance and you have a pass/fail result, not an assumption.

## Step 5 — Report and stop

- **Success** — rollout signal cleared, no failure signs in logs, smoke check passed. Stop the loop.
- **Failure** — name exactly which step failed and what you observed (the specific pod/instance, the specific log line, the specific smoke-check response). Don't just say "deploy looks broken" — a report that isn't actionable defeats the point of automating the watch.
- **Timeout** — report current state as of the timeout, not a guess about what would happen if you kept waiting.

Do not roll back, restart, or otherwise change the running system as part of this loop — verification surfaces the problem; fixing it is a separate, deliberate decision.

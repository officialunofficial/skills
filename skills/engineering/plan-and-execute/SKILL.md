---
name: plan-and-execute
description: Research and plan with a fast, cheap model, then implement and verify with your primary model. Use for a task that deserves a written plan but not full `/to-prd` ceremony, or whenever your harness splits a fast tier (Fable, Astra, whichever yours calls it) from its primary one.
disable-model-invocation: true
---

# Plan and execute

Two phases, two model tiers when your harness has them — a fast model plans, your primary model builds.

## Plan

Do this on your harness's fast tier if it can delegate there; otherwise do it here, before touching implementation.

- Explore: `CONTEXT.md`/`CONTEXT-MAP.md`, the ADRs that touch this area, the current callers and tests for what you're changing.
- Name the seams you'll test at (see `/tdd`) and confirm them with the user.
- Write the plan: files to touch, the seam-by-seam test-before-code pairs, any invariant the change should add (see `/to-invariants`), and every open question.

Stop here. A plan is done when every file, seam, and test pairing is named and no question is left silent — not when it merely sounds finished.

## Execute

Hand the plan to your primary model.

- Drive `/tdd` at each seam, one vertical slice at a time.
- Typecheck and run touched tests as you go; the full suite once, at the end.
- Run `/code-review` over the diff and address what it surfaces.
- Commit.

No fast tier available? Run both phases yourself, in order — skipping the plan because you're already in the room is how a plan never gets written down.

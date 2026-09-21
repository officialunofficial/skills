---
name: plan-and-execute
description: Plan with your most capable model, then implement cheaply and quickly with a fast, lightweight one. Use for a task where getting the plan wrong is expensive but following a good plan is mechanical, or whenever your harness splits a fast tier (Fable, Astra, whichever yours calls it) from its primary one.
disable-model-invocation: true
---

# Plan and execute

Two phases, two model tiers when your harness has them — your most capable model plans, a fast, cheap model executes.

## Plan

Do this on your primary model, never a fast or economy mode. A wrong or vague plan is expensive to unwind no matter how cheaply the code that follows it gets written.

- Explore: `CONTEXT.md`/`CONTEXT-MAP.md`, the ADRs that touch this area, the current callers and tests for what you're changing.
- Name the seams you'll test at (see `/tdd`) and confirm them with the user.
- Write the plan: files to touch, the seam-by-seam test-before-code pairs, any invariant the change should add (see `/to-invariants`), and every open question. Write it specific enough that a cheaper model can follow it without making judgment calls of its own.

Stop here. A plan is done when every file, seam, and test pairing is named and no question is left silent — not when it merely sounds finished.

## Execute

Hand the plan to your harness's fast, cheap tier if it has one. The plan already carries the judgment calls, so execution is mechanical: follow it.

- Drive `/tdd` at each seam, one vertical slice at a time.
- Typecheck and run touched tests as you go; the full suite once, at the end.
- Run `/code-review` over the diff and address what it surfaces.
- Commit.

If a step turns out to be genuinely ambiguous once you're executing it, that's a gap in the plan, not a cue to improvise — flag it back rather than guess.

No fast tier available? Run both phases yourself, in order, on your primary model — a cheap execution tier is an optimization, not a requirement.

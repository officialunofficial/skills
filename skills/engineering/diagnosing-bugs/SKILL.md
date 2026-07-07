---
name: diagnosing-bugs
description: Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", or reports something broken/throwing/failing/slow.
---

# Diagnosing Bugs

A discipline for the hard ones. Skip a phase only when you can explicitly justify it.

While you're getting your bearings, read `CONTEXT.md` (if it exists) to build a clean mental model of the modules in play, and check any ADRs covering the area you're touching.

## Phase 1 — Build a feedback loop

**This is the skill.** Everything downstream is mechanical. Give yourself a **tight** pass/fail signal — one that goes red on _this specific bug_ — and you will find the cause; bisection, hypothesis-testing, and instrumentation are just ways of spending that signal. Without one, no amount of staring at code will rescue you.

Pour disproportionate effort in here. **Be aggressive. Be creative. Refuse to give up.**

### Ways to construct one — try them in roughly this order

1. **Failing test** at whatever seam reaches the bug — unit, integration, or e2e.
2. **Curl / HTTP script** hitting a running dev server.
3. **CLI invocation** on a fixture input, diffing stdout against a known-good snapshot.
4. **Headless browser script** (Playwright / Puppeteer) — drives the UI and asserts on DOM, console, or network.
5. **Replay a captured trace.** Dump a real network request / payload / event log to disk, then replay it through the code path on its own.
6. **Throwaway harness.** Stand up a minimal slice of the system (one service, deps mocked) that hits the bug's code path with a single function call.
7. **Property / fuzz loop.** If the bug is "sometimes wrong output", feed 1000 random inputs and watch for the failure mode.
8. **Bisection harness.** If the bug arrived between two known states (a commit, a dataset, a version), automate "boot at state X, check, repeat" so `git bisect run` can drive it.
9. **Differential loop.** Push the same input through old-version vs new-version (or two configs) and diff the outputs.
10. **HITL bash script.** Last resort. When a human genuinely has to click, drive _them_ with `scripts/hitl-loop.template.sh` so the loop stays structured. What they report flows back to you.

Build the right feedback loop and the bug is 90% solved.

### Tighten the loop

Treat the loop as a product. Once you have _any_ loop, **tighten** it:

- Can it run faster? (Cache setup, skip unrelated init, narrow the test scope.)
- Can the signal sharpen? (Assert on the exact symptom, not "didn't crash".)
- Can it get more deterministic? (Pin the clock, seed the RNG, isolate the filesystem, freeze the network.)

A 30-second flaky loop barely beats no loop; a 2-second deterministic one is tight — a debugging superpower.

### Non-deterministic bugs

The target isn't a clean repro but a **higher reproduction rate**. Loop the trigger 100×, parallelise, pile on stress, narrow timing windows, inject sleeps. A 50%-flake bug is debuggable; a 1% one isn't — keep pushing the rate up until it is.

### When you genuinely cannot build a loop

Stop and say so, out loud. List what you tried. Ask the user for one of: (a) access to whatever environment reproduces it, (b) a captured artifact (HAR file, log dump, core dump, timestamped screen recording), or (c) permission to add temporary production instrumentation. Do **not** roll on to hypothesising without a loop.

### Completion criterion — a tight loop that goes red

Phase 1 is done when the loop is **tight** and **red-capable**: you can name **one command** — a script path, a test invocation, a curl — that you have **already run at least once** (paste the invocation and its output), and that is:

- [ ] **Red-capable** — it drives the actual bug code path and asserts the **user's exact symptom**, so it goes red on this bug and green once it's fixed. Not "runs without erroring" — it has to be able to _catch this specific bug_.
- [ ] **Deterministic** — same verdict every run (for flaky bugs: a pinned, high reproduction rate, per above).
- [ ] **Fast** — seconds, not minutes.
- [ ] **Agent-runnable** — you can run it unattended; a human enters the loop only via `scripts/hitl-loop.template.sh`.

If you catch yourself reading code to form a theory before this command exists, **stop — leaping straight to a hypothesis is the exact failure this skill exists to prevent.** No red-capable command, no Phase 2.

## Phase 2 — Reproduce + minimise

Run the loop. Watch it go red — the bug surfaces.

Confirm:

- [ ] The loop reproduces the failure the **user** described — not some neighbouring failure that happens to be nearby. Wrong bug means wrong fix.
- [ ] The failure repeats across runs (or, for non-deterministic bugs, repeats at a rate high enough to debug against).
- [ ] You've captured the exact symptom (error message, wrong output, slow timing) so later phases can confirm the fix truly addresses it.

### Minimise

Now that it's red, shrink the repro to the **smallest scenario that still goes red**. Strip inputs, callers, config, data, and steps **one at a time**, re-running the loop after each cut — keep only what's load-bearing for the failure.

Why: a minimal repro collapses the hypothesis space in Phase 3 (fewer parts left to suspect) and becomes the clean regression test in Phase 5.

Done when **every remaining element is load-bearing** — pulling any one of them makes the loop go green.

Don't move on until you've both reproduced **and** minimised.

## Phase 3 — Hypothesise

Produce **3–5 ranked hypotheses** before testing any of them. Generating a single hypothesis anchors you on the first plausible idea.

Each hypothesis must be **falsifiable**: state the prediction it makes.

> Format: "If <X> is the cause, then <changing Y> will make the bug vanish / <changing Z> will make it worse."

If you can't state the prediction, the hypothesis is a vibe — sharpen it or drop it.

**Show the ranked list to the user before testing.** They often carry domain knowledge that re-ranks it instantly ("we just shipped a change to #3"), or know which ones they've already ruled out. Cheap checkpoint, huge time saver. Don't block on it — go with your own ranking if the user is AFK.

## Phase 4 — Instrument

Each probe maps to a specific prediction from Phase 3. **Change one variable at a time.**

Tool preference:

1. **Debugger / REPL inspection** if the environment supports it. One breakpoint beats ten log lines.
2. **Targeted logs** at the boundaries that split hypotheses apart.
3. Never "log everything and grep".

**Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`. Cleanup at the end is then a single grep. Untagged logs linger; tagged logs die.

**Perf branch.** For performance regressions, logs are usually the wrong tool. Instead: take a baseline measurement (timing harness, `performance.now()`, profiler, query plan), then bisect. Measure first, fix second.

## Phase 5 — Fix + regression test

Write the regression test **before the fix** — but only when a **correct seam** exists for it.

A correct seam is one where the test drives the **real bug pattern** as it happens at the call site. If the only seam available is too shallow (a single-caller test when the bug needs multiple callers, a unit test that can't reproduce the chain that triggered it), a regression test there hands you false confidence.

**If no correct seam exists, that's itself the finding.** Note it. The codebase architecture is blocking the bug from being locked down. Flag it for the next phase.

If a correct seam exists:

1. Turn the minimised repro into a failing test at that seam.
2. Watch it fail.
3. Apply the fix.
4. Watch it pass.
5. Re-run the Phase 1 feedback loop against the original (un-minimised) scenario.

## Phase 6 — Cleanup + post-mortem

Required before you call it done:

- [ ] Original repro no longer reproduces (re-run the Phase 1 loop)
- [ ] Regression test passes (or the absence of a seam is documented)
- [ ] Every `[DEBUG-...]` probe removed (`grep` the prefix)
- [ ] Throwaway prototypes deleted (or moved to a clearly-labelled debug location)
- [ ] The hypothesis that proved correct is written into the commit / PR message — so the next debugger inherits it

**Then ask: what would have stopped this bug from happening?** If the answer involves an architectural change (no good test seam, tangled callers, hidden coupling), hand off to the `/improve-codebase-architecture` skill with the specifics. Make that recommendation **after** the fix lands, not before — you know far more now than when you started.

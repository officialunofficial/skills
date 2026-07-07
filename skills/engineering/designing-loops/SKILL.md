---
name: designing-loops
description: Reference for designing agent loops — cycles of work that repeat until a stop condition is met. Covers the four loop shapes, writing completion criteria, and managing token usage across a loop's lifetime.
disable-model-invocation: true
---

# Designing loops

A **loop** is an agent repeating cycles of work until a **stop condition** is met. Every loop is a choice along two axes: what **triggers** the next cycle, and what **stops** it. Get both right and the loop runs unattended; get either wrong and it either stalls waiting on you or burns turns past the point of being useful.

Not all tasks need a loop. Start with a single turn — write the prompt, look at the result, write the next prompt — and reach for the shapes below only once that manual cycle itself becomes the bottleneck.

## The four shapes

| Shape | Triggered by | Stops when | Fits |
| --- | --- | --- | --- |
| **Turn-based** | You, each prompt | The agent judges the task done, or needs more from you | Short, one-off tasks outside any regular process |
| **Goal-based** | You, once, in real time | The goal is met, or a turn cap is hit | Tasks with a **verifiable** exit condition |
| **Time-based** | A schedule (local interval or cloud cron) | You cancel it, or the underlying work runs out (queue empties, PR merges) | Recurring work, or watching an external system that changes on its own clock |
| **Proactive** | An event or schedule, no human watching | Each cycle's goal is met; the loop itself runs until switched off | A recurring *stream* of well-defined work — triage, migrations, upgrades |

Turn-based is the default — it's just talking to the agent. The other three trade a bit of setup for running unattended; pick the cheapest shape that still gets you a real stop condition.

**Goal-based** turns "keep going until this is good enough" into a bounded loop: define what done looks like, and an evaluator checks that condition each time the agent tries to stop, sending it back to work until the goal is met or the turn cap is reached. The turn cap is what keeps a fuzzy goal from running forever — always set one.

**Time-based** is for work that either recurs on a fixed schedule (summarize overnight activity every morning) or watches something whose state changes on its own — a build, a review queue, a deploy. Reacting to an external system on an interval is usually simpler than wiring a webhook, provided the interval isn't tighter than the thing you're watching actually changes.

**Proactive** loops compose the other primitives: a recurring trigger picks up a *stream* of same-shaped work (bug reports, dependency bumps, migration units), a goal defines done for each item, and the agent runs without stopping to ask permission on each one. This is where /triage and /implement-style skills earn their keep — the loop's job is routing items to them, not reinventing the procedure each cycle.

## Writing a completion criterion

A loop is only as good as its stop condition. Rank criteria by how directly they're checkable:

1. **Deterministic** — a test suite passes, a build exits 0, a count reaches a target, a score clears a threshold. The agent can't rationalize "close enough" against a binary gate. Prefer this whenever the work has one.
2. **Structural** — a file exists with the expected shape, every item in a list has been visited, a diff touches the files it should. Checkable but requires the agent to enumerate rather than just observe a pass/fail.
3. **Judged** — a second, fresher-context pass decides if the output is good. Use only when 1 and 2 aren't available; a judge with no criteria just repeats the first agent's blind spots, so give it something concrete to check even here (a rubric, a set of examples, a diff to compare against).

Whatever the criterion, make it **specific enough that the agent reaches it, not so loose it stops early and not so vague it never stops.** "Tests pass" beats "the code looks right"; "zero P0/P1 findings" beats "no major issues."

## Managing token usage

Loops multiply cost by however many cycles they run, so bound them deliberately:

- **Match the primitive to the task.** A one-shot edit doesn't need a goal loop; a goal loop doesn't need a fleet of subagents. Scale up only when the task's shape demands it.
- **Route by difficulty, not habit.** Mechanical, well-specified cycles (rebase, relock, re-run a check) can run on a cheaper/faster model; reserve the most capable model for the cycles that require judgment.
- **Pilot before a full run.** Anything that can fan out to many agents or many items should run on a small slice first — watch where it stalls or over-reaches before pointing it at the whole backlog.
- **Push determinism into scripts.** If a cycle's work is the same steps every time, ship a script and have the agent run it rather than re-deriving the same reasoning each cycle — cheaper and more reliable.
- **Set the interval to the thing you're watching, not to convenience.** Polling a fast-moving system too slowly wastes wall-clock; polling a slow one too fast wastes tokens for no new signal.
- **Watch usage as the loop runs**, not just after — most agent harnesses expose a running token/turn count per goal or per subagent; check it early enough to adjust the cap or the model before a runaway cycle burns the budget.

## Keeping quality up across cycles

A loop's output quality depends on the system around it, not the loop itself:

- Keep the codebase (or whatever surface the loop edits) in a state where "follow the existing pattern" is actually a coherent instruction.
- Give the agent a way to check its own work — a skill encoding your manual verification steps end-to-end, ideally against something quantitative it can see or measure, not just read.
- Put a second, fresh-context pass between "the agent thinks it's done" and "it ships" — a reviewer that never saw the first agent's reasoning catches things the first agent is blind to.
- When one cycle's output falls short, don't just patch that instance — fold the fix into the skill or check so every future cycle benefits, not just this one.

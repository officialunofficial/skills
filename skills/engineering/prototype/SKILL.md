---
name: prototype
description: Build a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model or logic feels right, or explore what a UI should look like.
---

# Prototype

A prototype is **throwaway code that answers a question**. The question dictates the shape.

## Pick a branch

Work out which question you're answering — read it off the user's prompt, the surrounding code, or ask if they're reachable:

- **"Does this logic / state model feel right?"** → [LOGIC.md](LOGIC.md). Stand up a tiny interactive terminal app and push the state machine through the cases that are hard to hold in your head on paper.
- **"What should this look like?"** → [UI.md](UI.md). Produce several sharply different UI variations on one route, toggled by a URL search param and a floating bottom bar.

The two branches yield very different artifacts, and choosing wrong throws away the entire prototype. When the question is truly ambiguous and the user can't weigh in, fall back to whichever branch fits the surrounding code (a backend module → logic; a page or component → UI), and record that assumption at the top of the prototype.

## Rules for both branches

1. **Throwaway from the first line, and labelled that way.** Put the prototype code beside the module or page it's exploring, so its context is obvious — but name it so any reader can tell at a glance it's a prototype, not shipping code. For throwaway UI routes, follow the routing convention the project already uses; don't invent a fresh top-level structure.
2. **One command to run it.** Whatever the project's task runner already supports — `pnpm <name>`, `python <path>`, `bun <path>`, and so on. The user should launch it without thinking.
3. **No persistence unless the question demands it.** Keep state in memory. Persistence is usually the thing under test, not a dependency. If the question genuinely turns on a database, point at a scratch DB or a local file named something like "PROTOTYPE — wipe me".
4. **Drop the polish.** No tests, no error handling past what's needed to make it run, no abstractions. You're here to learn one thing fast and then bin it.
5. **Show the state.** After each action (logic) or on each variant switch (UI), print or render the full relevant state so the change is visible.
6. **Delete or absorb it once answered.** When the question is settled, either delete the prototype or fold the confirmed decision into the real code — never let it rot in the repo.

## When done

The one thing worth keeping from a prototype is the **answer**. Record it somewhere durable — a commit message, an ADR, an issue, or a `NOTES.md` beside the prototype — paired with the question it settled. When the user is present, that capture is a short exchange; when they're not, leave the placeholder so they (or you, next pass) can fill in the verdict before deleting the prototype.

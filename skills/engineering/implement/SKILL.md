---
name: implement
description: "Implement a piece of work based on a PRD or set of issues."
disable-model-invocation: true
---

# Implement

Build the work the user points you at — a PRD, or a set of issues.

- Drive `/tdd` wherever it fits, at the seams already agreed in the PRD.
- Typecheck often. Run individual test files often as you go, and the full suite once at the end — it should pass before you consider yourself done.
- When the build is complete, run `/code-review` over the diff and address what it surfaces.
- Commit your work to the current branch.

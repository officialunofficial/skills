---
name: code-review
description: Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes — Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/PRD asked for?). Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to "review since X".
---

Review the diff between `HEAD` and a fixed point the user names, along two independent axes:

- **Standards** — does the code obey this repo's documented coding standards?
- **Spec** — does the code actually build what the originating issue / PRD / spec called for?

Each axis runs in its own **parallel sub-agent** so neither one contaminates the other's context; this skill then gathers their findings together.

You should already have the issue tracker on hand — run `/setup-skills` if `docs/agents/issue-tracker.md` is missing.

## Process

### 1. Pin the fixed point

The fixed point is whatever the user gave you — a commit SHA, a branch name, a tag, `main`, `HEAD~5`, and so on. If they gave you nothing, ask.

Lock in the diff command once: `git diff <fixed-point>...HEAD` (three-dot, comparing against the merge-base). Grab the commit list too: `git log <fixed-point>..HEAD --oneline`.

Before you go any further, verify the fixed point resolves (`git rev-parse <fixed-point>`) and the diff has content. A dead ref or empty diff should blow up right here — not deep inside two parallel sub-agents.

### 2. Identify the spec source

Hunt for the originating spec in this order:

1. Issue references in the commit messages (`#123`, `Closes #45`, GitLab `!67`, and so on) — retrieve them via the workflow in `docs/agents/issue-tracker.md`.
2. A path the user handed you as an argument.
3. A PRD or spec file under `docs/`, `specs/`, or `.scratch/` whose name matches the branch or feature.
4. If none of that turns up anything, ask the user where the spec is. If they say there is none, the **Spec** sub-agent skips and reports "no spec available".

### 3. Identify the standards sources

Whatever in the repo documents how code ought to be written — `CODING_STANDARDS.md`, `CONTRIBUTING.md`, and their kin.

On top of anything the repo documents, the Standards axis always carries the **smell baseline** below: a fixed set of Fowler code smells (_Refactoring_, ch. 3) that applies even when a repo documents nothing. Two rules bind it:

- **The repo wins.** A documented repo standard always beats the baseline; wherever the repo blesses something the baseline would flag, drop the smell.
- **Always a judgement call.** Every smell is a labelled heuristic ("possible Feature Envy"), never a hard violation — and, as with any standard here, skip whatever tooling already enforces.

Each smell reads *what it is* → *how to fix*; check the diff against each:

- **Mysterious Name** — a function, variable, or type whose name hides what it does or holds. → rename it; if no honest name surfaces, the design itself is murky.
- **Duplicated Code** — the same shape of logic shows up across more than one hunk or file in the change. → extract the shared shape and call it from both.
- **Feature Envy** — a method that fingers another object's data more than its own. → move the method onto the data it envies.
- **Data Clumps** — the same handful of fields or params keep travelling as a group (a type trying to be born). → gather them into one type and pass that.
- **Primitive Obsession** — a primitive or string standing in for a domain concept that deserves a type. → give the concept its own small type.
- **Repeated Switches** — the same `switch` or `if`-cascade over the same type recurs across the change. → replace it with polymorphism, or one map both sites share.
- **Shotgun Surgery** — one logical change forces edits scattered across many files in the diff. → pull what changes together into one module.
- **Divergent Change** — one file or module gets edited for several unrelated reasons. → split it so each module changes for a single reason.
- **Speculative Generality** — abstraction, parameters, or hooks added for needs the spec never states. → delete it; inline it back until a real need appears.
- **Message Chains** — long `a.b().c().d()` walks the caller shouldn't depend on. → hide the walk behind one method on the first object.
- **Middle Man** — a class or function that mostly forwards calls onward. → cut it out and call the real target directly.
- **Refused Bequest** — a subclass or implementer that ignores or overrides most of what it inherits. → drop the inheritance in favor of composition.

### 4. Spawn both sub-agents in parallel

Send one message carrying two `Agent` tool calls. Use the `general-purpose` subagent for each.

**Standards sub-agent prompt** — include:

- The full diff command and commit list.
- The standards-source files you found in step 3, **plus the smell baseline from step 3 pasted in full** — the sub-agent has no other route to it.
- The brief: "Report — per file/hunk where relevant — (a) every place the diff violates a documented standard: cite the standard (file + the rule); and (b) any baseline smell you spot: name it and quote the hunk. Separate hard violations from judgement calls — documented-standard breaches can be hard, but baseline smells are always judgement calls, and a documented repo standard overrides the baseline. Skip anything tooling enforces. Under 400 words."

**Spec sub-agent prompt** — include:

- The diff command and commit list.
- The path to, or fetched contents of, the spec.
- The brief: "Report: (a) requirements the spec asked for that are missing or only partly done; (b) behaviour in the diff nobody asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec line behind each finding. Under 400 words."

If there's no spec, skip the Spec sub-agent and say so in the final report.

### 5. Aggregate

Lay out the two reports under `## Standards` and `## Spec` headings, verbatim or lightly tidied. Do **not** merge or re-rank the findings — the two axes are deliberately kept apart (see _Why two axes_).

Close with a one-line summary: total findings per axis, and the worst issue _within each axis_ (if any). Don't crown a single winner across axes — that cross-axis reranking is exactly what the separation exists to prevent.

## Why two axes

A change can clear one axis and fail the other:

- Code that honors every standard but builds the wrong thing → **Standards pass, Spec fail.**
- Code that does precisely what the issue asked but tramples the project's conventions → **Spec pass, Standards fail.**

Reporting the two separately keeps one axis from hiding the other.

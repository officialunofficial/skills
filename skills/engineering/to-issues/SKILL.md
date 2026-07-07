---
name: to-issues
description: Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker using tracer-bullet vertical slices.
disable-model-invocation: true
---

# To Issues

Break a plan into issues anyone can grab independently, cutting them as vertical slices (tracer bullets).

The issue tracker and triage label vocabulary should already have been handed to you — run `/setup-skills` if not.

## Process

### 1. Gather context

Work from whatever's already in the conversation. If the user passes an issue reference (issue number, URL, or path) as an argument, fetch it from the issue tracker and read the full body and comments.

### 2. Explore the codebase (optional)

If you haven't explored the codebase yet, do so to learn the current state of the code. Issue titles and descriptions should use the project's domain glossary and respect ADRs covering the area you're touching.

Look for chances to prefactor the code so the implementation lands more easily. "Make the change easy, then make the easy change."

### 3. Draft the issues

Cut the plan into **tracer bullet** issues, following the **Vertical slice rules**. A **wide refactor** is the exception — slice it by **expand–contract** instead (see **Wide refactors**).

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Blocked by**: which other slices (if any) must land first
- **User stories covered**: which user stories this addresses (when the source has them)

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged, or split further?

Iterate until the user signs off on the breakdown.

### 5. Publish the issues to the issue tracker

For each approved slice, publish a new issue using the **Issue body template**. These issues are AFK-ready, so publish them with the correct triage label unless told otherwise.

Publish in dependency order (blockers first) so you can cite real issue identifiers. Where the tracker supports it, link each slice to its parent as a native **sub-issue** and wire each blocker as a native **blocking edge** (mechanics in the issue-tracker doc); the `## Parent` and `## Blocked by` body sections are the fallback.

Do NOT close or modify any parent issue.

## Reference

### Vertical slice rules

Each issue is a thin vertical slice cutting through ALL integration layers end to end — NOT a horizontal slice of a single layer.

- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A finished slice is demoable or verifiable on its own
- Do any prefactoring first

### Wide refactors

A **wide refactor** is a single mechanical change — rename a column, retype a shared symbol — whose **blast radius** fans across the whole codebase, so one edit shatters thousands of call sites at once and no vertical slice can land green. Don't wrestle it into a tracer bullet; sequence it as **expand–contract**. First expand: add the new form alongside the old so nothing breaks. Then migrate the call sites in batches sized by blast radius (per package, per directory), each batch its own issue blocked by the expand, and CI stays green batch to batch because the old form still stands. Finally contract: delete the old form once no caller remains, in an issue blocked by every migrate batch. When even the batches can't stay green alone, keep the sequence but let them share an integration branch that all block a final integrate-and-verify issue — green is promised only there.

### Issue body template

<issue-template>
## Parent

A reference to the parent issue on the issue tracker (include only if the source was an existing issue; otherwise omit this section).

## What to build

A concise description of this vertical slice. Describe the end-to-end behaviour, not a layer-by-layer implementation.

Avoid specific file paths or code snippets — they go stale fast. Exception: if the `/prototype` skill produced code that captures a decision more precisely than prose could (a state machine, reducer, schema, type shape), add a context pointer to where that prototype code lives rather than inlining it.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by

- A reference to the blocking issue (if any)

Or "None - can start immediately" when there are no blockers.
</issue-template>

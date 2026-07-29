---
name: to-primitives
description: Abstract a feature, user story, or flow into the capability primitives it rests on, graded against the current codebase, ending in an in-repo design doc with a build-order graph. Use when the user wants to decompose a feature into capabilities, check what a feature needs against what the codebase already provides, or settle build order before cutting issues.
argument-hint: "[feature description, or path to a story/PRD doc]"
---

This skill takes a feature — a user story, flow, or expected outcome, from the argument or the current conversation — and abstracts it into the capabilities it rests on, graded against whatever repo you are standing in. It is repo-agnostic: discover each repo's architecture at run time; assume nothing about planes, layers, or stacks. It earns its cost on features; don't point it at one-line fixes.

## Definitions

- **Primitive** — a general-purpose capability the feature rests on, named by *behavior*, not location: "durable future-turn scheduling", "per-conversation feedback storage". Many features would share it.
- **Core component** — a feature-specific assembly that wires primitives together: "reminder intent parser", "feedback-conditioned composer". Components sit on top; primitives are what gets built first.
- **Grade** — every primitive and external prerequisite carries one:
  - `exists` — the codebase, or a dependency it already uses, provides it. Cite `file:line`.
  - `partial` — cite what exists at `file:line`, plus a one-line gap: what it still lacks *for this feature*.
  - `missing` — nothing to build on.

**Stopping rule (two-sided).** `exists` → cite and stop decomposing. `missing` → split only while the sub-parts are themselves missing *and* would be built and tested independently; the floor is what the platform, stdlib, or existing dependencies already hand you. Depth therefore adapts to the repo: shallow in a mature codebase, sinking as deep as "you need a persistence layer, full stop" in a young one.

## Process

1. **Intake gap-check.** The story may already be refined (e.g. via `/grilling`) — respect that work. Hunt for the ambiguities whose answer would *change the primitive set*: durability across restarts, approval gates, multi-tenancy, ordering guarantees, latency class. Ask only those, batched, each with a recommended answer; every unasked judgment call becomes a stated assumption. Done when each load-bearing ambiguity is either answered or written down as an assumption.

2. **Ground in the repo.** Read the repo's domain docs when present (`CONTEXT.md`, `docs/adr/`, `docs/design/`, architecture pages), then fan out read-only exploration agents to grade every candidate primitive. Done when every primitive and prerequisite carries a grade and every `exists`/`partial` grade carries `file:line` evidence — a grade with no citation is not a grade.

3. **Abstract.** Name the primitives by behavior, apply the stopping rule, and list **external prerequisites** in their own section — things outside the repo's code the feature is unbuildable without: webhook subscriptions, OAuth registrations, deployed infra, secrets, contracts, data sources. Same grading. Then name the core components on top. Done when every component's constituent primitives all appear in the primitives section.

4. **Order the missing.** Draw a small mermaid dependency graph over the `missing` pieces only — nodes are the missing pieces, edges are "needs" — then derive **waves**: wave 1 = buildable now, wave 2 = unblocked by wave 1, and so on. Done when every missing piece appears in exactly one wave.

5. **Write the doc** to `docs/design/<feature-slug>-primitives.md` in the target repo, using the template below. Leave it untracked and leave the issue tracker alone — turning waves into issues is a separate, deliberate step (`/to-issues`).

The doc's altitude is capabilities and assemblies; implementation tasks (files, functions, migrations) belong to the tracker, downstream.

<doc-template>

# <Feature> — primitives

## Feature

The feature restated in two to four sentences, from the user's perspective.

## Assumptions

The judgment calls made without asking, one line each — each one falsifiable, so a wrong assumption is cheap to correct and re-run.

## Primitives

| Primitive | Grade | Evidence | Gap |
|---|---|---|---|
| behavior-named capability | exists / partial / missing | `file:line` | partial only: the one-line gap |

## External prerequisites

Same table shape, for what lives outside the repo's code.

## Core components

Each component: one line of what it does, plus the primitives it wires together.

## Build order

```mermaid
graph TD
```

- **Wave 1** — buildable now: ...
- **Wave 2** — unblocked by wave 1: ...

</doc-template>

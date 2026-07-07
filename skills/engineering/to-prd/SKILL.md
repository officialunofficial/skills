---
name: to-prd
description: Turn the current conversation into a PRD and publish it to the project issue tracker — no interview, just synthesis of what you've already discussed.
disable-model-invocation: true
---

# To PRD

Take the current conversation and your understanding of the codebase and turn them into a PRD. Do NOT interview the user — synthesize what you already know.

The issue tracker and triage label vocabulary should already have been handed to you — run `/setup-skills` if not.

## Process

1. Explore the repo to learn the current state of the codebase, if you haven't yet. Use the project's domain glossary throughout the PRD, and respect any ADRs covering the area you're touching.

2. Sketch the seams you'll test the feature at. Favour existing seams over new ones, and pick the highest seam available. When a new seam is unavoidable, propose it as high up as you can. Fewer seams across the codebase is better — one is ideal.

   Check with the user that these seams match what they expect.

3. Write the PRD from the template below, then publish it to the project issue tracker. Apply the `ready-for-agent` triage label — no further triage needed.

<prd-template>

## Problem Statement

The problem the user is facing, in the user's own terms.

## Solution

The solution to that problem, in the user's own terms.

## User Stories

A LONG, numbered list of user stories. Each takes the form:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see the balance on my accounts, so that I can make better-informed decisions about my spending
</user-story-example>

Make this list exhaustive — cover every aspect of the feature.

## Implementation Decisions

The implementation decisions that were made. This can cover:

- The modules to be built or modified
- The interfaces of those modules that will change
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They can go stale fast.

Exception: if a prototype produced a snippet that captures a decision more precisely than prose could (a state machine, reducer, schema, type shape), inline it inside the relevant decision and note briefly that it came from a prototype. Trim to the decision-bearing parts — not a working demo, just the pieces that carry the decision.

## Testing Decisions

The testing decisions that were made. Include:

- What makes a good test here (test external behaviour, not implementation details)
- Which modules will be tested
- Prior art for the tests (similar tests already in the codebase)

## Out of Scope

What this PRD deliberately leaves out.

## Further Notes

Anything else worth recording about the feature.

</prd-template>

---
name: to-invariants
description: Distill the invariants — properties that must always hold — out of the current conversation and codebase, and write them to an in-repo doc. Use when the user wants to capture invariants, pin down what must always be true, harden a design, or turn a discussion/spec/PRD into checkable properties.
argument-hint: "[output-path]  (default: docs/INVARIANTS.md)"
---

Take the current conversation context and codebase understanding and produce a set of **invariants**: properties that must ALWAYS hold for the system to be correct. Do NOT interview the user — synthesize what you already know. Two audiences, two sections: design-level *system invariants* and *enforceable invariants* that map to a concrete check.

An invariant is not a feature, a requirement, or a nice-to-have. It is a condition whose violation means the system is broken. "Users can reset their password" is a feature. "A session token is never valid after logout" is an invariant.

## Process

### 1. Explore (if needed)

If you have not already, skim the code in the area under discussion to ground the invariants in the real data structures, state machines, and boundaries. Use the project's own vocabulary. An invariant you cannot point at a place in the code for is a guess — mark it as one.

### 2. Discover invariants

Sweep the design through these lenses — each tends to surface a different class of invariant. Aim for coverage, not volume; skip lenses that don't apply.

- **Representation** — internal consistency a data structure must always satisfy (no dangling refs, sorted, no duplicates, sums to a stored total, non-null where required).
- **State machine / lifecycle** — only valid transitions occur; terminal states are terminal; nothing escapes a state it shouldn't (e.g. "a cancelled order is never fulfilled").
- **Round-trip / inverse** — `decode(encode(x)) == x`; save→load, serialize→parse, redo(undo) are identity.
- **Conservation / accounting** — a quantity is neither created nor destroyed (money, inventory, reference counts balance before and after).
- **Idempotence** — applying an operation twice equals applying it once (retries, upserts, dedup).
- **Ordering / monotonicity** — timestamps, versions, sequence numbers never go backwards; causality is preserved.
- **Uniqueness / referential integrity** — IDs are unique; every foreign reference resolves; no orphans.
- **Boundary / authority** — inputs stay within range; trust/permission boundaries are never crossed (no privilege escalation, no reading another tenant's data).
- **Metamorphic** — a relationship between related runs holds (adding an item never decreases the count; sorting twice == sorting once).

### 3. Classify and locate

For each invariant, decide which section it belongs in, and find where it lives in the code:

- **System invariant** — a design-level truth, possibly too broad or too semantic for a single assertion. Capture the property and *why it holds*.
- **Enforceable invariant** — expressible as an assertion, precondition/postcondition, property-based test, type, DB constraint, or runtime check. Find where it is enforced today; if nowhere, mark **GAP** — an unenforced invariant is a latent bug.

A single invariant can appear in both sections: stated as a system truth, then listed with its concrete check.

### 4. Write the doc

Write to the path in `{{ARGUMENTS}}`, or `docs/INVARIANTS.md` by default. If the file exists, merge — don't clobber invariants already recorded; add, refine, and flag conflicts. Use the template below.

### 5. Report

Summarize to the user: how many invariants, and — most important — the **GAPs** (invariants with no enforcement). Ask whether they want the gaps turned into tests or tickets (do not do it unless asked).

<invariants-template>

# Invariants

> Properties that must ALWAYS hold. A violation is a bug, by definition.
> Scope: <the system/feature/module these cover>

## System invariants

Design-level properties. Each: the property, why it holds, and the blast radius if it breaks.

### INV-1: <one-line property, stated as an absolute>

- **Always:** <the precise condition — universally quantified, no "usually">
- **Because:** <the mechanism or design decision that makes it true>
- **If violated:** <what breaks downstream — why this matters>

## Enforceable invariants

Each maps to a concrete check. `[x]` = enforced today; `[ ]` = **GAP**, not enforced.

- [x] **INV-2:** <property> — enforced by `<test / assertion / constraint / type>` at `<location>`.
- [ ] **INV-3:** <property> — **GAP**: no current check. Suggested: `<property test / precondition / DB constraint>`.

## Assumptions & non-invariants

- <thing people might assume is invariant but is NOT — state it explicitly to prevent false reliance>
- <invariant that holds only under a stated condition, with the condition named>

</invariants-template>

## What makes an invariant good

- **Absolute.** It holds for *all* valid states, always. If it needs "usually" or "should", it's a heuristic, not an invariant — either tighten it or move it to non-invariants.
- **Falsifiable.** You can describe a concrete state that would violate it. If nothing could ever contradict it, it says nothing.
- **Observable / contractual.** It constrains behavior or observable state, not an incidental implementation detail that a valid refactor could change.
- **Atomic.** One property per invariant. Split conjunctions ("unique AND sorted") so each can be checked and cited independently.
- **Located.** It names where it's enforced, or admits it isn't (GAP).

<examples>
<good>
INV: A token presented after its session's logout is always rejected.
Absolute, falsifiable (present a post-logout token → must 401), enforceable (auth-middleware test), atomic.
</good>
<bad>
INV: The auth system is secure.
Not falsifiable, not atomic, not checkable — it's a wish, not an invariant.
</bad>
<bad>
INV: Passwords are hashed with bcrypt cost 12.
"bcrypt cost 12" is an implementation detail. The invariant is "passwords are never stored in recoverable form"; the algorithm is a how, not a must-always-hold.
</bad>
</examples>

Task: distill the invariants from the current context and write them to the doc. {{ARGUMENTS}}

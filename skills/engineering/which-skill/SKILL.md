---
name: which-skill
description: Pick the skill or flow that fits your situation. A router over the skills in this repo.
disable-model-invocation: true
---

# Which skill?

You won't hold every skill in your head, so route through this instead of guessing.

A **flow** is a path traced across the skills. Most work follows a single **main flow**, with two **on-ramps** feeding into it. The rest are either standalone tools or a vocabulary layer that operates beneath everything else.

## The main flow: idea → ship

The route most work takes. You have an idea; you want it built.

1. **`/grill-with-docs`** — sharpen the idea through interview. Start here when there **is a codebase**: it keeps state, folding what it learns back into `CONTEXT.md` and ADRs. (No codebase yet? Use `/grill-me` — see Standalone. Both drive the same `/grilling` primitive; only `grill-with-docs` leaves a written trail.)
2. **Branch — can every open question be closed in conversation?** If any question demands a runnable answer (state, business logic, a UI you have to lay eyes on), take a detour through a prototype, with **`/handoff`** carrying context in each direction (see Crossing sessions):
   - **`/handoff`** out, then start a clean session against that file,
   - **`/prototype`** to settle the question with disposable code,
   - **`/handoff`** the findings back, and cite them from the original idea thread.
3. **Branch — is this a multi-session build?**
   - **Yes** → **`/to-prd`** (fold the thread into a PRD) → **`/to-issues`** (cut the PRD into issues anyone can grab independently). Since the issues stand alone, **reset context between them**: open a fresh session per issue and start **`/implement`** with the PRD plus the one issue to work on.
   - **No** → **`/implement`** right here, without leaving this context window.

   Either path, **`/implement`** delivers each issue by driving **`/tdd`** underneath — one red-green slice at a time — then finishes with **`/code-review`**, a two-axis pass (Standards + Spec) over the diff, before it commits. Pull in **`/tdd`** by itself when you simply want a concrete behaviour built test-first without a full spec, and **`/code-review`** by itself whenever you want a branch or PR checked against a fixed baseline.

### Context hygiene

Hold steps 1–3 inside **one continuous context window** — don't compact or clear until `/to-issues` is done — so the grilling, the PRD, and the issues all rest on the same line of thinking. Each `/implement` then begins clean, taking the issue as its starting point.

What bounds this is the **smart zone**: the window (roughly 120k tokens on current frontier models) inside which the model still reasons crisply. If a session nears that edge before `/to-issues`, don't grind on through degraded reasoning — `/handoff` and pick up in a fresh thread.

## On-ramps

A starting situation that generates work, then merges onto the main flow.

- **Bugs and requests stacking up** → **`/triage`**. It walks issues through their triage roles and turns out agent-ready issues, which **`/implement`** later collects.

  Triage is for issues **you didn't author** — bug reports, incoming feature requests, whatever lands raw. Issues that `/to-issues` produced are already agent-ready, so **skip triage for those**.

- **Something's broken** → **`/diagnosing-bugs`**. Built for the stubborn ones: the bug that shrugs off a first look, the intermittent flake, the regression that slipped in between two known-good points. It won't theorise until it holds a **tight feedback loop** — one command that already goes red on *this* bug — then lands the fix behind a regression test. Its post-mortem hands off to **`/improve-codebase-architecture`** when the real lesson is that no clean seam exists to pin the bug down.

## Codebase health

Not feature work — upkeep.

- **`/improve-codebase-architecture`** — reach for it whenever you have a spare moment to keep the codebase pleasant for agents to work in. It surfaces **deepening opportunities**; choosing one _spawns an idea_ you can carry into the main flow at `/grill-with-docs`. It's the survey that turns up candidates; **`/codebase-design`** (below) is the bench where you shape the one you picked.

## Verification

Turn a spec or a settled design into the checks that keep an implementation honest. Each distils the current thread into an in-repo doc; run them once the design is firm, before or alongside `/implement`. They compound — invariants become fuzz oracles, and both sharpen the conformance suite.

- **`/to-invariants`** — the properties that must *always* hold. Splits into design-level system invariants and enforceable ones, each mapped to a check or flagged as an unguarded **GAP**. Start here; the other two lean on its output.
- **`/to-fuzz`** — the targets worth fuzzing, each pinned to an **oracle** (differential, round-trip, invariant, crash). Reuses `/to-invariants` output directly — every enforceable invariant is a ready-made oracle.
- **`/to-conformance`** — a spec's normative requirements (MUST/SHOULD/MAY) turned into implementation-independent tests any conforming build must pass, with a traceability matrix and flagged spec ambiguities.

## Vocabulary underneath

Two model-invoked references that sit *below* the other skills — each the single source of truth for its vocabulary. Call them directly when the **words**, not the process, are the sticking point; or let the skills above draw them in.

- **`/domain-modeling`** — tighten the project's *domain* language: challenge a fuzzy term, untangle an overloaded word ("account" pulling triple duty), pin a hard-to-reverse decision into an ADR. It's the live discipline `/grill-with-docs` drives to keep `CONTEXT.md` a clean glossary.
- **`/codebase-design`** — the deep-module vocabulary (module, interface, depth, seam, adapter, leverage, locality) for shaping a module's *form*: plenty of behaviour behind a small interface at a clean seam. Both `/tdd` and `/improve-codebase-architecture` speak it.

## Crossing sessions

- **`/handoff`** — when a thread is full or you need to peel off (say, into a `/prototype` session), this compresses the conversation into a markdown file. You don't resume in place — you **open a new session and point it at that file** to ferry the context across. It's the bridge between context windows, working either way. Use it when you want a **fresh session** but need the **current conversation kept intact**.
- **`/compact`** (built-in) — stay in the **same conversation** and let the earlier turns be summarized. Use it at **deliberate breaks between phases**, when losing the verbatim history is fine. Don't compact mid-phase — the agent can lose the thread. `/handoff` forks; `/compact` continues.

## Standalone

Off the main flow entirely.

- **`/grill-me`** — the same unrelenting interview as `/grill-with-docs`, but for when there's **no codebase**. Stateless: it writes nothing locally, builds no `CONTEXT.md`. Reach for it to sharpen any plan or design that doesn't live in a repo.
- **`/prototype`** — a small, disposable program that answers one design question: does this state model feel right, or what should this UI look like. Throwaway from the first line — keep the answer, delete the code. It's the detour in step 2 of the main flow, but reach for it any time a design question is hard to settle on paper.
- **`/research`** — hand the reading legwork to a **background agent**: it chases a question through **primary sources**, then drops a cited Markdown file into the repo. Keep working while it reads. What it produces is something to bring *into* the main flow at `/grill-with-docs` — research feeds the thinking, it doesn't stand in for it.
- **`/teach`** — learn a concept across several sessions, treating the current directory as a stateful workspace.
- **`/writing-great-skills`** — reference for writing and editing skills well.

## Precondition

**`/setup-skills`** — run it before your first engineering flow to configure the issue tracker, triage labels, and doc layout the other skills expect. Custom issue trackers work too.

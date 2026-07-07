---
name: improve-codebase-architecture
description: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.
disable-model-invocation: true
---

# Improve Codebase Architecture

Surface architectural friction and pitch **deepening opportunities** — refactors that turn shallow modules into deep ones. The goal is testability and AI-navigability.

This command draws on the project's domain model and rests on a shared design vocabulary:

- Run the `/codebase-design` skill for the architecture vocabulary (**module**, **interface**, **depth**, **seam**, **adapter**, **leverage**, **locality**) and its principles (the deletion test, "the interface is the test surface", "one adapter = hypothetical seam, two = real"). Use those exact terms in every suggestion — don't slide into "component," "service," "API," or "boundary."
- The domain language in `CONTEXT.md` names the good seams; the ADRs in `docs/adr/` record decisions this command must not re-open.

## Process

### 1. Explore

Read the project's domain glossary (`CONTEXT.md`) and any ADRs covering the area you're touching first.

Then use the Agent tool with `subagent_type=Explore` to walk the codebase. Skip rigid heuristics — explore organically and mark wherever you feel friction:

- Where does grasping one concept mean bouncing between a swarm of tiny modules?
- Where are modules **shallow** — the interface nearly as complex as the implementation behind it?
- Where were pure functions carved out purely for testability, while the real bugs hide in how they're wired together (no **locality**)?
- Where do tightly-coupled modules bleed across their seams?
- Which parts are untested, or awkward to test through their current interface?

Apply the **deletion test** to anything you suspect is shallow: would deleting it concentrate complexity, or merely shuffle it elsewhere? A "yes, concentrates" is the signal you're after.

### 2. Present candidates as an HTML report

Write a self-contained HTML file into the OS temp directory so nothing lands in the repo. Resolve the temp dir from `$TMPDIR`, falling back to `/tmp` (or `%TEMP%` on Windows), and write to `<tmpdir>/architecture-review-<timestamp>.html` so each run gets its own file. Open it for the user — `xdg-open <path>` on Linux, `open <path>` on macOS, `start <path>` on Windows — and tell them the absolute path.

The report pulls **Tailwind from a CDN** for layout and styling, and **Mermaid from a CDN** for diagrams wherever a graph, flow, or sequence carries the structure reliably. Blend Mermaid with hand-built CSS/SVG visuals — Mermaid when the relationships are graph-shaped (call graphs, dependencies, sequences), hand-crafted divs/SVG when you want something more editorial (mass diagrams, cross-sections, collapse animations). Every candidate earns a **before/after visualisation**. Be visual.

For each candidate, render a card carrying:

- **Files** — which files/modules are in play
- **Problem** — why the current architecture creates friction
- **Solution** — plain-English account of what would change
- **Benefits** — framed in terms of locality and leverage, and how the tests improve
- **Before / After diagram** — side by side, custom-drawn, showing the shallowness and the deepening
- **Recommendation strength** — one of `Strong`, `Worth exploring`, `Speculative`, shown as a badge

Close the report with a **Top recommendation** section: the candidate you'd take on first and why.

**Use CONTEXT.md vocabulary for the domain, and the `/codebase-design` vocabulary for the architecture.** If `CONTEXT.md` defines "Order," talk about "the Order intake module" — not "the FooBarHandler," and not "the Order service."

**ADR conflicts**: if a candidate cuts against an existing ADR, raise it only when the friction is real enough to justify reopening the ADR. Mark it plainly on the card (say, a warning callout: _"contradicts ADR-0007 — but worth reopening because…"_). Don't catalogue every theoretical refactor an ADR rules out.

See [HTML-REPORT.md](HTML-REPORT.md) for the full HTML scaffold, diagram patterns, and styling guidance.

Do NOT propose interfaces yet. Once the file is written, ask the user: "Which of these would you like to explore?"

### 3. Grilling loop

Once the user picks a candidate, run the `/grilling` skill to walk the design tree with them — constraints, dependencies, the shape of the deepened module, what sits behind the seam, which tests survive.

Side effects happen inline as decisions firm up — run the `/domain-modeling` skill to keep the domain model current as you go:

- **Naming a deepened module after a concept `CONTEXT.md` doesn't hold?** Add the term to `CONTEXT.md`. Create the file lazily if it's missing.
- **Sharpening a fuzzy term mid-conversation?** Update `CONTEXT.md` on the spot.
- **User rejects the candidate for a load-bearing reason?** Offer an ADR, framed as: _"Want me to record this as an ADR so future architecture reviews don't re-suggest it?"_ Only offer when a future explorer would genuinely need the reason to avoid re-suggesting the same thing — skip ephemeral reasons ("not worth it right now") and self-evident ones.
- **Want to explore alternative interfaces for the deepened module?** Run the `/codebase-design` skill and use its design-it-twice parallel sub-agent pattern.

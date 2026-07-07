---
name: domain-modeling
description: Actively build and refine a project's domain model as you design. Use when the user wants to nail down domain terminology or a ubiquitous language, capture an architectural decision as an ADR, or when another skill needs to keep the domain model current.
---

# Domain Modeling

Shape the project's domain model while you design — this is the *active* craft, not passive reading. You challenge loose terms, invent scenarios that expose edge cases, and commit the glossary and decisions to disk the instant they firm up. (Simply consulting `CONTEXT.md` to reuse a word is not this skill; that's a habit any skill already has. Reach for this skill when you are *changing* the model, not merely reading it.)

## File structure

Most repositories hold a single context:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

A `CONTEXT-MAP.md` at the root signals multiple contexts. The map records where each one lives:

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

Create these files lazily, the moment you have something worth writing — not before. Write the first `CONTEXT.md` when you resolve the first term; create `docs/adr/` when the first ADR earns its place.

## During the session

### Hold terms against the glossary

The moment the user reaches for a word that clashes with the language already in `CONTEXT.md`, stop and name the clash: "Your glossary pins 'cancellation' to X, but you're describing Y — which do you mean?"

### Sharpen fuzzy language

When a word is vague or carries two meanings at once, offer a single precise term to replace it: "You said 'account' — is that the Customer or the User? They're not the same thing."

### Pressure-test with concrete scenarios

As domain relationships come up, ground them in specific cases. Invent scenarios that push on the edges and force the user to state exactly where one concept ends and the next begins.

### Reconcile claims against the code

When the user explains how something behaves, check whether the code tells the same story. Surface any mismatch: "The code cancels a whole Order, but you just said a partial cancellation is allowed — which one holds?"

### Record terms in CONTEXT.md as you go

Resolve a term, write it down immediately. Never let these pile up for a later pass — capture each one in the moment. Follow the layout in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

Keep `CONTEXT.md` free of any implementation detail. It is not a spec, a scratch pad, or a home for design decisions — it is a glossary, and only that.

### Reach for an ADR sparingly

Propose an ADR only when all three hold:

1. **Hard to reverse** — undoing the choice later would cost real effort
2. **Surprising without context** — a future reader will ask "why on earth did they do it this way?"
3. **Born of a genuine trade-off** — real alternatives existed and you chose one for specific reasons

Miss any one of the three and there's no ADR to write. Follow the layout in [ADR-FORMAT.md](./ADR-FORMAT.md).

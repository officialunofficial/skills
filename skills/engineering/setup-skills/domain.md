# Domain Docs

How the engineering skills should read this repo's domain documentation while exploring the codebase.

## Read these before exploring

- **`CONTEXT.md`** at the repo root, or
- **`CONTEXT-MAP.md`** at the repo root if it exists — it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/adr/`** — read the ADRs that touch the area you're about to work in. In multi-context repos, also check `src/<context>/docs/adr/` for context-scoped decisions.

If any of these files are absent, **carry on silently**. Don't call out the gap; don't push to create them upfront. The `/domain-modeling` skill (reached through `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily, only once terms or decisions actually get resolved.

## File structure

Single-context repo (most repos):

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

Multi-context repo (marked by a `CONTEXT-MAP.md` at the root):

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← system-wide decisions
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← context-specific decisions
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## Speak the glossary's vocabulary

When your output names a domain concept — an issue title, a refactor proposal, a hypothesis, a test name — use the term exactly as `CONTEXT.md` defines it. Don't slide into synonyms the glossary deliberately avoids.

If the concept you need isn't in the glossary yet, treat that as a signal: either you're coining language the project doesn't use (reconsider), or there's a genuine gap (flag it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, say so out loud rather than quietly overriding it:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_

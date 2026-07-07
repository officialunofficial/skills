# ADR Format

ADRs live in `docs/adr/` and are numbered in sequence: `0001-slug.md`, `0002-slug.md`, and so on.

Create the `docs/adr/` directory lazily — only once the first ADR is warranted.

## Template

```md
# {Short title of the decision}

{1-3 sentences: the context, what you decided, and why.}
```

That is the whole format. A single paragraph is a complete ADR. The point is to record *that* a decision happened and *why* — not to complete a set of sections.

## Optional sections

Add these only when they earn their place. Most ADRs need none of them.

- A **Status** field in the YAML header (`proposed | accepted | deprecated | superseded by ADR-NNNN`) — helpful once a decision gets revisited
- **Considered Options** — only when the paths you rejected are worth remembering
- **Consequences** — only when there are non-obvious knock-on effects to flag

## Numbering

Look through `docs/adr/` for the highest number already used and add one.

## When to reach for an ADR

All three must hold:

1. **Hard to reverse** — undoing the choice later would cost real effort
2. **Surprising without context** — a future reader will study the code and wonder "why on earth did they do it this way?"
3. **Born of a genuine trade-off** — real alternatives existed and you picked one for specific reasons

Easy to reverse? Skip it — you'll just reverse it. Not surprising? Nobody will wonder why. No real alternative? There's nothing to record beyond "we did the obvious thing."

### What qualifies

- **Architectural shape.** "We use a monorepo." "The write model is event-sourced; the read model is projected into Postgres."
- **Integration patterns between contexts.** "Ordering and Billing talk through domain events, never synchronous HTTP."
- **Technology choices that carry lock-in.** Database, message bus, auth provider, deployment target — not every library, just the ones that would take a quarter to rip out.
- **Boundary and scope decisions.** "Customer data belongs to the Customer context; every other context references it by ID only." A deliberate no is as worth recording as a yes.
- **Deliberate departures from the obvious path.** "We hand-write SQL instead of using an ORM because X." Anything where a reasonable reader would expect the opposite — recording it stops the next engineer from "fixing" a deliberate choice.
- **Constraints the code can't show.** "We can't run on AWS for compliance reasons." "Responses must land under 200ms because of the partner API contract."
- **Rejected alternatives whose rejection isn't obvious.** If you weighed GraphQL and chose REST for subtle reasons, write it down — otherwise someone re-proposes GraphQL in six months.

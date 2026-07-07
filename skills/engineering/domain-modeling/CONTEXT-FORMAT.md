# CONTEXT.md Format

## Structure

```md
# {Context Name}

{One or two sentences on what this context is and why it exists.}

## Language

**Order**:
{A one or two sentence description of the term}
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer once goods are delivered.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## Rules

- **Take a position.** When several words compete for one concept, choose the best and list the rest under `_Avoid_`.
- **Keep definitions tight.** One or two sentences at most. Say what the thing IS, not what it does.
- **List only terms specific to this context.** General programming vocabulary (timeouts, error types, utility patterns) stays out, even if the project leans on it heavily. Before adding a term, ask: is this unique to this context, or a general programming idea? Only the first kind belongs.
- **Cluster terms under subheadings** when natural groupings appear. If every term sits in one cohesive area, a flat list is fine.

## Single vs multi-context repos

**Single context (most repos):** one `CONTEXT.md` at the repo root.

**Multiple contexts:** a `CONTEXT-MAP.md` at the repo root names the contexts, points to where each lives, and describes how they relate:

```md
# Context Map

## Contexts

- [Ordering](./src/ordering/CONTEXT.md) — receives and tracks customer orders
- [Billing](./src/billing/CONTEXT.md) — generates invoices and processes payments
- [Fulfillment](./src/fulfillment/CONTEXT.md) — manages warehouse picking and shipping

## Relationships

- **Ordering → Fulfillment**: Ordering emits `OrderPlaced` events; Fulfillment consumes them to begin picking
- **Fulfillment → Billing**: Fulfillment emits `ShipmentDispatched` events; Billing consumes them to raise invoices
- **Ordering ↔ Billing**: shared types for `CustomerId` and `Money`
```

Infer which structure is in play:

- `CONTEXT-MAP.md` exists → read it to find the contexts
- only a root `CONTEXT.md` exists → single context
- neither exists → create a root `CONTEXT.md` lazily when you resolve the first term

When several contexts exist, work out which one the current topic belongs to. If it isn't clear, ask.

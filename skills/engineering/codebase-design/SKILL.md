---
name: codebase-design
description: Shared vocabulary and principles for designing deep modules. Use when the user wants to design or refine a module's interface, hunt for deepening opportunities, decide where a seam belongs, make code more testable or AI-navigable, or when another skill needs the deep-module vocabulary.
---

# Codebase Design

Design **deep modules**: a lot of behaviour tucked behind a small interface, sited at a clean seam, and tested through that interface. Apply this language and these principles anywhere code is being designed or reshaped. You are chasing three payoffs — leverage for callers, locality for maintainers, and testability for everyone.

## Glossary

Use these terms precisely. Don't swap in "component," "service," "API," or "boundary" — the consistency is the whole point.

**Module** — anything that pairs an interface with an implementation. Intentionally scale-agnostic: a function, a class, a package, or a slice that spans tiers. _Avoid_: unit, component, service.

**Interface** — everything a caller must know to use the module correctly: the type signature, yes, but also invariants, ordering constraints, error modes, required configuration, and performance characteristics. _Avoid_: API, signature (both too narrow — they name only the type-level surface).

**Implementation** — the code inside a module, its body. Not the same as **Adapter**: a thing can be a small adapter wrapping a large implementation (a Postgres repo) or a large adapter wrapping a small one (an in-memory fake). Say "adapter" when the seam is the subject; "implementation" otherwise.

**Depth** — leverage at the interface: how much behaviour a caller (or test) can reach per unit of interface it must learn. A module is **deep** when a lot of behaviour hides behind a small interface, **shallow** when the interface is nearly as complex as the implementation.

**Seam** _(Michael Feathers)_ — a place where behaviour can change without editing that place; the *location* where a module's interface sits. Choosing where the seam goes is a design decision in its own right, separate from deciding what lives behind it. _Avoid_: boundary (already overloaded by DDD's bounded context).

**Adapter** — a concrete thing that satisfies an interface at a seam. It names a *role* (which slot it fills), not a substance (what's inside).

**Leverage** — the caller's reward for depth: more capability per unit of interface learned. One implementation pays back across N call sites and M tests.

**Locality** — the maintainer's reward for depth: change, bugs, knowledge, and verification gather in one place instead of scattering across callers. Fix it once, it's fixed everywhere.

## Deep vs shallow

**Deep module** = small interface + plenty of implementation:

```
┌─────────────────────┐
│   Small Interface   │  ← Few methods, simple params
├─────────────────────┤
│                     │
│  Deep Implementation│  ← Complex logic hidden
│                     │
└─────────────────────┘
```

**Shallow module** = large interface + thin implementation (avoid):

```
┌─────────────────────────────────┐
│       Large Interface           │  ← Many methods, complex params
├─────────────────────────────────┤
│  Thin Implementation            │  ← Just passes through
└─────────────────────────────────┘
```

As you shape an interface, ask:

- Can I cut the number of methods?
- Can I simplify the parameters?
- Can I bury more complexity inside?

## Principles

- **Depth is a property of the interface, not the implementation.** A deep module may be built inside from small, mockable, swappable pieces — they simply aren't part of the interface. A module can carry **internal seams** (private to its implementation, exercised by its own tests) alongside the **external seam** at its interface.
- **The deletion test.** Picture deleting the module. If complexity evaporates, it was a pass-through. If complexity resurfaces spread across N callers, it was pulling its weight.
- **The interface is the test surface.** Callers and tests cross the same seam. If you find yourself wanting to test *past* the interface, the module is probably the wrong shape.
- **One adapter is a hypothetical seam; two adapters make it real.** Add a seam only when something genuinely varies across it.

## Designing for testability

Good interfaces make tests fall out naturally:

1. **Accept dependencies, don't construct them.**

   ```typescript
   // Testable
   function processOrder(order, paymentGateway) {}

   // Hard to test
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

2. **Return results rather than firing side effects.**

   ```typescript
   // Testable
   function calculateDiscount(cart): Discount {}

   // Hard to test
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

3. **Small surface area.** Fewer methods means fewer tests; fewer params means simpler setup.

## Relationships

- A **Module** has exactly one **Interface** (the surface it shows callers and tests).
- **Depth** is a property of a **Module**, measured against its **Interface**.
- A **Seam** is where a **Module**'s **Interface** lives.
- An **Adapter** sits at a **Seam** and satisfies the **Interface**.
- **Depth** yields **Leverage** for callers and **Locality** for maintainers.

## Rejected framings

- **Depth as the ratio of implementation lines to interface lines** (Ousterhout): rewards padding the implementation. Prefer depth-as-leverage.
- **"Interface" as the TypeScript `interface` keyword or a class's public methods**: too narrow — here, interface covers every fact a caller must know.
- **"Boundary"**: overloaded by DDD's bounded context. Say **seam** or **interface**.

## Going deeper

- **Deepening a cluster given its dependencies** — see [DEEPENING.md](DEEPENING.md): dependency categories, seam discipline, and replace-don't-layer testing.
- **Exploring alternative interfaces** — see [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md): fan out parallel sub-agents to design the interface several radically different ways, then compare on depth, locality, and seam placement.

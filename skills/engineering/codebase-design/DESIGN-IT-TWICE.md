# Design It Twice

When the user wants to explore alternative interfaces for a chosen deepening candidate, run this parallel sub-agent pattern. It draws on "Design It Twice" (Ousterhout) — your first idea is rarely your best.

Uses the vocabulary in [SKILL.md](SKILL.md) — **module**, **interface**, **seam**, **adapter**, **leverage**.

## Process

### 1. Frame the problem space

Before you spawn any sub-agents, write a user-facing explanation of the problem space for the chosen candidate:

- The constraints any new interface must satisfy
- The dependencies it would lean on, and which category each falls into (see [DEEPENING.md](DEEPENING.md))
- A rough code sketch to make the constraints concrete — not a proposal, just something to anchor the discussion

Show this to the user, then move straight to Step 2. The user reads and thinks while the sub-agents work in parallel.

### 2. Spawn sub-agents

Spawn three or more sub-agents in parallel with the Agent tool. Each one must produce a **radically different** interface for the deepened module.

Give every sub-agent its own technical brief — file paths, coupling details, the dependency category from [DEEPENING.md](DEEPENING.md), and what sits behind the seam. This brief is separate from the user-facing problem-space explanation in Step 1. Hand each agent a distinct design constraint:

- Agent 1: "Minimise the interface — 1 to 3 entry points at most. Squeeze maximum leverage out of each."
- Agent 2: "Maximise flexibility — cover many use cases and leave room for extension."
- Agent 3: "Optimise for the most common caller — make the default case trivial."
- Agent 4 (when relevant): "Design around ports & adapters for the cross-seam dependencies."

Put both the [SKILL.md](SKILL.md) vocabulary and the CONTEXT.md vocabulary in each brief, so every sub-agent names things consistently with the architecture language and the project's domain language.

Each sub-agent returns:

1. The interface (types, methods, params — plus invariants, ordering, error modes)
2. A usage example showing how callers reach it
3. What the implementation hides behind the seam
4. The dependency strategy and its adapters (see [DEEPENING.md](DEEPENING.md))
5. Trade-offs — where leverage runs high, where it runs thin

### 3. Present and compare

Walk through the designs one at a time so the user can take each in, then compare them in prose. Contrast on **depth** (leverage at the interface), **locality** (where change concentrates), and **seam placement**.

After the comparison, give your own verdict: which design is strongest and why. If pieces from different designs would fit together, propose the hybrid. Commit to a view — the user wants a strong read, not a menu.

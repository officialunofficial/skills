---
name: tdd
description: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
---

# Test-Driven Development

TDD runs on the red → green loop. This skill is the reference that keeps that loop producing tests you'll actually want to keep: what counts as a good test, where tests belong, the traps to avoid, and the rules that govern each cycle. Treat every section as active on every cycle — read them going in and while you loop, not as a post-mortem.

While you're getting your bearings in the codebase, open `CONTEXT.md` if it's there so your test names and interface vocabulary track the project's domain language, and honor any ADRs covering the area you're changing.

## What a good test is

A good test checks behavior through public interfaces — never through implementation details. The internals can be rewritten wholesale; the test should stand. It reads like a spec: "user can checkout with valid cart" states plainly what the system can do, and it outlives refactors because it never touched internal structure in the first place.

See [tests.md](tests.md) for worked examples and [mocking.md](mocking.md) for when mocking earns its place.

## Seams — where tests go

A **seam** is the public boundary you test from: the interface where behavior is observable without prying inside. Put tests on seams; never wire them to internals.

**Only test at seams you've agreed in advance.** Before you write a single test, list the seams you plan to cover and get the user to confirm them. An unconfirmed seam gets no test. You can't test everything, so naming the seams up front is what steers your effort onto critical paths and genuinely hard logic instead of scattering it across every edge case.

Ask: "What's the public interface, and which seams are worth testing?"

## Anti-patterns

- **Implementation-coupled** — the test mocks internal collaborators, pokes at private methods, or checks results through a back channel (reading the database instead of calling the interface). Its signature: refactoring turns it red even though behavior never moved.
- **Tautological** — the assertion derives the expected value the same way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot hand-computed with the code's own formula, a constant compared to itself). It passes by construction and can never contradict the code. Pull expected values from an independent source: a known-good literal, a worked example, the spec.
- **Horizontal slicing** — all the tests up front, then all the implementation. Tests written in bulk describe _imagined_ behavior: you end up pinning the _shape_ of things rather than what users see, the suite goes numb to real changes, and you've locked in a test structure before you understand the implementation. Slice **vertically** instead — one test, one implementation, repeat — where each test is a **tracer bullet** shaped by what the previous cycle revealed.

## Rules of the loop

- **Red before green.** The failing test comes first, then just enough code to pass it. No pre-empting future tests, no speculative features.
- **One slice per cycle.** A single seam, a single test, a single minimal implementation.
- **Refactoring lives outside the loop.** It belongs to review (see the `code-review` skill), not to the red → green implementation cycle.

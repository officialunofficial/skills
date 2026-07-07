---
name: to-conformance
description: Distill a conformance suite out of a spec and the current conversation — every normative requirement turned into an implementation-independent test any conforming implementation must pass — and write it to an in-repo doc. Use when the user wants conformance tests, a spec compliance suite, test vectors for a format or protocol, to check an implementation against its spec, or to turn MUST/SHOULD requirements into tests.
argument-hint: "[spec-path]  [output-path]  (default output: docs/CONFORMANCE.md)"
---

Take a specification — a file, a linked doc, or the design in this conversation — and produce a **conformance suite**: the tests any implementation MUST pass to be considered compliant. Do NOT interview the user — synthesize from the spec and what you already know.

The unit of work is the chain **normative requirement → conformance assertion → test case**. Each requirement gets a stable ID and a black-box test that exercises it through the public interface or wire format, so the same suite can judge *any* implementation, not just this one. A requirement you cannot test is a spec bug — surface it rather than skipping it.

## Process

### 1. Locate the spec

Use the `spec-path` argument if given; otherwise the spec under discussion, or the relevant `SPEC`/`docs/` file in the repo. If the "spec" is only an informal design in the conversation, treat the design decisions as the normative source and say so.

### 2. Extract normative requirements

Pull out every requirement and classify its level (RFC 2119):

- **MUST / MUST NOT / REQUIRED / SHALL** — mandatory. A non-conforming implementation fails these.
- **SHOULD / RECOMMENDED** — expected unless there's a stated reason not to.
- **MAY / OPTIONAL** — permitted behavior; test that doing it *and* not doing it both stay conformant.

Catch the **implicit** requirements too — the ones the prose implies but never keywords: wire/encoding formats, error conditions, ordering guarantees, idempotence, boundary values, versioning/compatibility rules, canonicalization. Give each a stable ID (`CONF-1`, `CONF-2`, …) and cite its spec section.

### 3. Turn each requirement into a black-box test

For each, describe how to exercise it against an arbitrary implementation, in given/when/then form: the setup, the action through the public interface, and the observable pass condition. Prefer concrete **test vectors** — a fixed input paired with its exact expected output — for anything format- or protocol-shaped; vectors are portable, language-agnostic, and unambiguous. Keep tests independent of internal structure: assert on outputs, wire bytes, and error signals, never on private state.

### 4. Handle levels and profiles

If the spec defines conformance **profiles** or **levels** (core vs extended, MUST vs SHOULD tiers), group tests so an implementation can report which profile it meets. Mark SHOULD/MAY tests as non-blocking.

### 5. Write the suite

Write to the output-path argument or `docs/CONFORMANCE.md`. Use the template. Keep a **traceability matrix** mapping every requirement to its test(s) — this is what proves coverage. Where the format warrants portable fixtures, write the vectors as data files (e.g. `conformance/vectors/*.json`) and reference them.

### 6. Report

Give the coverage count: N requirements, M with tests, and the two lists that matter most — **GAPs** (requirements with no test yet) and **ambiguities** (requirements too vague or contradictory to test, which are defects in the spec). Offer to generate runnable tests in the project's framework (don't unless asked).

<conformance-template>

# Conformance suite

> Every normative requirement, as an implementation-independent test.
> Spec: <source + version/commit>   Scope: <the surface covered>

## Requirements

| ID | Level | Requirement | Spec ref | Test |
| --- | --- | --- | --- | --- |
| CONF-1 | MUST | <the requirement, one line> | §<x> | [x] TEST-1 / [ ] GAP |
| CONF-2 | SHOULD | <…> | §<y> | [ ] GAP |

## Tests

### TEST-1 — CONF-1: <name>

- **Given:** <preconditions / fixture>
- **When:** <action through the public interface / wire format>
- **Then:** <observable pass condition — exact output, byte sequence, or error>
- **Vector:** <input → expected output, or a pointer to conformance/vectors/…>

## Ambiguities & spec gaps

- **CONF-N:** <requirement> — <why it can't be tested as written: underspecified, contradictory, untestable>. Resolve in the spec.

</conformance-template>

## What makes a good conformance test

- **Implementation-independent.** It drives the public interface or wire format only — swap the implementation and the test still applies. If it reads private state, it's a unit test, not a conformance test.
- **Traceable.** It names the exact requirement it proves. A test with no requirement, or a MUST with no test, is the thing this suite exists to prevent.
- **Deterministic and self-contained.** Fixed inputs, fixed expected outputs, no reliance on environment or ordering between tests.
- **Loud on non-conformance.** A wrong implementation fails it unmistakably — prefer exact expected values over "looks roughly right".

<examples>
<good>
CONF: "Object IDs MUST be the BLAKE3 hash of the canonical byte encoding." → TEST with a vector: this exact 12-byte object → this exact 32-byte ID. Any implementation runs it; wrong canonicalization fails it.
Implementation-independent, a concrete vector, traceable to the MUST.
</good>
<bad>
TEST: "the encoder produces valid output."
Not traceable (which requirement?), not deterministic (no fixed input/output), not loud (what is "valid"?). Pin it to a requirement and a vector.
</bad>
</examples>

Task: distill the conformance suite from the spec and current context, and write it to the doc. {{ARGUMENTS}}

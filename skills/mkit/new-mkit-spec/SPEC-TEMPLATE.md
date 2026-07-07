---
spec: SPEC-<NAME>
version: 1
status: draft
audience: <who must implement or review this — name the crate, CLI surface, or role>
---

# SPEC-<NAME> — <short human-readable title>

Status: **Draft** for mkit v1.
Scope: <one to three sentences fixing exactly what this document governs and
what it explicitly does not>.

<!-- Add the openers that apply to your spec kind; delete the rest.
Endianness: **little-endian** throughout. All hashes are 32-byte BLAKE3.
Reference implementation: `rust/crates/mkit-<crate>/src/<module>.rs`.
Authority: this file is the source of truth for <subsystem> behavior. If code,
docs, or tests disagree with this file, fix the implementation or amend this
spec in the same change.
Issue #<n>.
External tools MUST be able to produce and consume these bytes with only this
document. -->

---

## 1. Purpose

<!-- Why this format or subsystem exists. The problem it solves and the
constraints it operates under. Show an example rather than only explaining. -->

## 2. <Normative core>

<!-- The spec's reason to exist. For a byte-layout spec, an offset table:

```
offset  size  field           value
0       1     object_type     one of ...
1       4     magic           ASCII "MKT1"
5       …     body            type-specific
```

For a subsystem, the state model or on-disk layout. State bounds and every
rejection as a typed error (e.g. `> 1_000_000` entries → `TooManyEntries`).
Use MUST / MUST NOT / SHOULD / MAY for every normative requirement. -->

### 2.1 <Subsection>

<!-- Break the core into numbered subsections where a rule needs its own space:
field grammars, ordering invariants, size caps, discovery rules. -->

## 3. Semantics

<!-- How the format is read, written, and behaves. Failure modes, side effects,
concurrency, and crash-safety ordering where relevant. Cross-link the specs that
own adjacent concepts, e.g. [SPEC-SIGNING](SPEC-SIGNING.md) for signing bytes. -->

## 4. Out of scope (v1)

<!-- Bound the spec so scope cannot creep. List deferred follow-ups and permanent
non-goals. -->

## 5. Version history

<!-- On-disk and wire formats only: how the format may evolve and what a version
bump means.

| Version | Released | Changes                          |
|---------|----------|----------------------------------|
| `0x01`  | v1.0     | First mkit format.               |
-->

## 6. Test vectors

<!-- Formats: the input/output pairs an implementer MUST produce, committed under
`rust/tests/golden/<area>/`. Subsystems: retitle to "Test anchors" and list the
unit and CLI tests that pin the behavior. -->

## 7. Invariants

<!-- Almost every mkit spec closes here: properties that MUST hold for every
conformant reader/writer, each paired with the mechanism or error that enforces
it. -->

| Invariant | Enforced by |
|---|---|
| <property that MUST always hold> | <error or mechanism, with a §ref> |

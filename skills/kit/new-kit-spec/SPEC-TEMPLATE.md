---
spec: SPEC-<NAME>
version: 1
status: draft-normative
audience: <who must implement or review this: name the crate, CLI surface, or role>
---

# SPEC-<NAME> &mdash; <short human-readable title>

Status: **Draft** for kit v1.
Scope: <one to three sentences fixing exactly what this document governs and
what it explicitly does not>.

<!-- Add the openers that apply to your spec kind; delete the rest.
Endianness: **little-endian** throughout. All hashes are 32-byte BLAKE3.
Reference implementation: `rust/crates/kit-<crate>/src/<module>.rs`.
Authority: this file is the source of truth for <subsystem> behavior. If code,
docs, or tests disagree with this file, fix the implementation or amend this
spec in the same change.
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
1       4     magic           ASCII "K<3 chars>" (distinct; registered in SPEC-CONVENTIONS §4)
5       …     body            type-specific
```

For a subsystem, the state model or on-disk layout. State bounds and every
rejection as a typed error (e.g. `> 1_000_000` entries → `TooManyEntries`).
Use MUST / MUST NOT / SHOULD / MAY for every normative requirement.
Start each behavioral section with one of these markers (SPEC-CONVENTIONS §7); a
marker covers the following paragraphs until the next marker or heading, and a
mixed section marks each scope:
**Protocol requirement.** A client, verifier, or other conforming server relies on
this rule.
**Reference-server behavior.** A mechanism, storage layout, or limit of the
reference server. -->

### 2.1 <Subsection>

<!-- Break the core into numbered subsections where a rule needs its own space:
field grammars, ordering invariants, size caps, discovery rules. -->

## 3. Semantics

<!-- How the format is read, written, and behaves. Failure modes, side effects,
concurrency, and crash-safety ordering where relevant. Mark this section as in §2.
Cross-link the specs that own adjacent concepts, e.g. [SPEC-SIGNING](SPEC-SIGNING.md)
for signing bytes. -->

## 4. Out of scope (v1)

<!-- Bound the spec so scope cannot creep. List deferred behavior and permanent
non-goals. -->

## 5. Version history

<!-- On-disk and wire formats only: how the format may evolve and what a version
bump means.

| Version | Released | Changes                          |
|---------|----------|----------------------------------|
| `0x01`  | v1.0     | First kit format.                |
-->

## 6. Test vectors

<!-- Formats: the input/output pairs an implementer MUST produce, committed under
`rust/tests/golden/<area>/`. Subsystems: retitle to "Test anchors" and list the
unit and CLI tests that pin the behavior. -->

## 7. Invariants

<!-- Almost every kit spec closes here: properties that MUST hold for every
conformant reader/writer, each paired with the mechanism or error that enforces
it. -->

| Invariant | Enforced by |
|---|---|
| <property that MUST always hold> | <error or mechanism, with a §ref> |

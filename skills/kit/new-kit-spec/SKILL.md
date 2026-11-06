---
name: new-kit-spec
description: Scaffold a new kit SPEC document with the repo's real structure, then register it in the spec index and wire any parity follow-up. Use when adding a docs/specs/SPEC-*.md for a new wire format, on-disk format, or subsystem; when an in-scope command or behavior needs a normative spec; or when a format change requires a spec per the CONTRIBUTING rules.
---

# Author a new kit SPEC

kit specs are the authoritative source for on-disk formats, wire formats, and
subsystem behavior. A format change updates the matching `docs/specs/SPEC-*.md`
and the golden vectors in the same commit (`CONTRIBUTING.md`, "Format changes").
Work in the checkout, not from memory — the specs evolve, so confirm the current
conventions before you write.

Ground truth to read first (they win over anything here if they have changed):

- `docs/specs/README.md` — the spec index you will register into.
- `docs/specs/SPEC-CONVENTIONS.md` — the shared vocabulary and rules every spec
  follows; `CONTRIBUTING.md` ("Writing") for the prose rules.
- Two model specs of the shape you are writing: `docs/specs/SPEC-OBJECTS.md`
  (a byte-layout format spec) and `docs/specs/SPEC-WORKTREE.md` (a subsystem
  spec). Skim one more neighbor if your topic differs.
- `docs/PARITY.md` — only if your spec introduces or changes an in-scope
  command or behavior (see step 3).

## Step 1 — Scaffold the spec file

Create `docs/specs/SPEC-<NAME>.md`. `<NAME>` is uppercase, hyphen-separated,
and names the format or subsystem (`OBJECTS`, `GIT-BRIDGE`, `WORKTREE`). Copy
the shape from `SPEC-TEMPLATE.md` in this skill directory, which encodes the
structure below.

Front matter — the four keys every spec carries, in this order:

```
---
spec: SPEC-<NAME>
version: 1
status: draft-normative
audience: <who must implement or review this: name the crate, CLI surface, or role>
---
```

`status` is `<maturity>-<bindingness>` (SPEC-CONVENTIONS §2.1): maturity is
`draft` or `stable`, bindingness is `normative` or `advisory`.
`scripts/check-spec-status.sh` rejects an unknown token. A new spec normally starts
`draft-normative`.

Opening block, immediately after the `# SPEC-<NAME> &mdash; <short title>` H1:

- `Status:` line — a bold state word plus a sentence (`Status: **Normative**
  for kit v1.`). This restates the front-matter status in prose and MAY say
  more than the one-word key.
- `Scope:` line — one to three sentences fixing exactly what the document
  governs, and what it explicitly does not.
- Optional openers used by real specs, add the ones that apply: `Endianness:`
  (byte-layout specs), `Reference implementation:` (the authoritative module),
  and an `Authority:` sentence. Do not cite issue or PR numbers:
  `scripts/check-writing.sh` rejects them.
- For a format meant for external reimplementation, add the conformance
  sentence the format specs use: external tools MUST be able to produce and
  consume these bytes from this document alone.

Body — numbered H2 sections (`## 1. Title`, `### 1.1 Subtitle`), sentence-case
headings. Numbered sections are the dominant convention; short specs MAY use
unnumbered H2s. Order sections from the model most like your topic. The recurring
ones:

- **Purpose / design constraints** — why the format or subsystem exists.
- **The normative core** — the byte layout (a fenced `offset size field`
  block), the state model, or the protocol. This is the spec's reason to exist.
- **Semantics / discovery / lifecycle** — how the format is read, written, and
  behaves; failure modes as typed errors.
- **Out of scope / non-goals** — bound the spec so scope cannot creep.
- **Version history** — a table, for on-disk and wire formats. A reader accepts one
  version of each format (SPEC-CONVENTIONS §2.2).
- **Test vectors** (formats: the inputs/outputs an implementer MUST produce,
  pointing at `rust/tests/golden/<area>/`) or **Test anchors** (subsystems: the unit
  and CLI tests that pin the behavior).
- **Invariants** — a two-column table mapping each invariant to the mechanism
  or error that enforces it. Nearly every spec closes with this; include it.

Write to the conventions: normative RFC 2119 keywords in caps (MUST, MUST NOT,
SHOULD, MAY); short, active sentences in the present tense; `&mdash;` rather than a
literal em dash; realistic 64-hex BLAKE3 digests in examples, never `xxxx`. A new
magic is a distinct ASCII value that begins with `K` and goes in the SPEC-CONVENTIONS
§4 registry. Specify a contract, not a library API (SPEC-CONVENTIONS §6). Link
sibling specs with relative links (`[SPEC-REFS](SPEC-REFS.md)`) on first reference
to a term they own.

Done when: `docs/specs/SPEC-<NAME>.md` exists; front matter has all four keys;
the opening carries a `Status:` and `Scope:` line; the normative core is
specified precisely enough to implement from; an Invariants section closes it;
and its headings and cross-links match the two model specs (the scripts in step 4
do not check the structure, so this is an eyeball check against `SPEC-OBJECTS.md`).

## Step 2 — Register in the spec index

Add one bullet to the list in `docs/specs/README.md`, keeping the list in
alphabetical order by spec name:

```
- [SPEC-<NAME>](SPEC-<NAME>.md) &mdash; <one lowercase clause naming what it specifies>.
```

Match the file's existing bullets exactly: linked spec name, an `&mdash;`
separator, a single lowercase descriptive clause, and a trailing period.

Done when: the new bullet sits in alphabetical position; every `SPEC-*.md` in
`docs/specs/` has exactly one matching bullet (compare `ls docs/specs/SPEC-*.md`
against the list); and the link resolves.

## Step 3 — Wire the parity follow-up (only if in scope)

Skip this step for a pure format or internal-subsystem spec that adds no
user-visible command or flag.

Do it when the spec introduces or changes an **in-scope** command or behavior
(a new porcelain/plumbing command, a changed flag, a new safety guard, a
machine-output shape). Read `docs/PARITY.md` first — it is the authoritative
scope gate. The per-command matrix is on `kit.storage/parity`; its source is not in
the kit repository, so name the command's new status (`parity`, `divergent`, or
`non-goal`) in the PR.

- **If the command was previously a non-goal or unlisted**, the scope changed:
  update the "Non-goals" list in `docs/PARITY.md` and state the semantics adopted
  and any deliberate divergences, cross-linking your new spec.
- **Update the reference**: the command's entry in `docs/CLI.md`.
- **Record any divergence** in the matching `docs/PARITY.md` section: a safety
  guard under "Safety divergences", a parsed-output shape under the
  "Machine-output contract", a human-output difference under "Output channels", a
  behavior difference under "Documented divergences", or a missing flag under
  "Deferred flags".

Done when: `docs/CLI.md` reflects the command; any scope move is in `docs/PARITY.md`
with a link to the spec; divergences are logged in the right `docs/PARITY.md`
section; and the PR names the matrix status.

## Step 4 — Validate before opening the PR

- Run the doc checks locally; CI runs them too:
  ```sh
  bash scripts/check-spec-status.sh
  bash scripts/check-doc-paths.sh
  bash scripts/check-writing.sh
  python3 -I -B scripts/check-spec-magics.py
  ```
- A spec-only change still runs `kit-ci-pr` (no path filter: its `writing` and
  `golden` steps read the documents) and `Docs checks`. `cargo semver-checks` and
  `Build twice and compare` do not run without a `rust/**` change. Enumerate the
  checks you expect by name and confirm each ran — a green rollup does not prove a
  workflow executed.
- If the spec accompanies a format change, land the spec, the golden vector
  under `rust/tests/golden/`, and the code in the same commit, and run
  `scripts/check-golden.sh`. A change to a format, a signing rule, or a trust rule
  needs review from a second maintainer when one exists (`GOVERNANCE.md`).
- Commit with a `docs(spec):` Conventional Commit header of at most 72 characters,
  matching the spec commits in `git log`. Sign the commit.

## Completion checklist

- [ ] `docs/specs/SPEC-<NAME>.md` created with the four-key front matter,
      `Status:`/`Scope:` opening, numbered normative sections, and an Invariants
      table.
- [ ] Registered as one alphabetically-placed bullet in `docs/specs/README.md`.
- [ ] Parity wired (`docs/CLI.md`, `docs/PARITY.md` scope or divergence note, matrix
      status in the PR) — or consciously skipped because the spec adds no in-scope
      command.
- [ ] Doc checks clean; expected CI checks confirmed by name, including `kit-ci-pr`.

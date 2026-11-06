---
name: new-mkit-spec
description: Scaffold a new mkit SPEC document with the repo's real structure, then register it in the spec index and wire any parity follow-up. Use when adding a docs/specs/SPEC-*.md for a new wire format, on-disk format, or subsystem; when an in-scope command or behavior needs a normative spec; or when a format change requires a spec per the CONTRIBUTING review bar.
---

# Author a new mkit SPEC

mkit specs are the authoritative source for on-disk formats, wire formats, and
subsystem behavior. Anything that mutates an on-disk or wire format requires a
matching `docs/specs/SPEC-*.md` change (CONTRIBUTING review bar item 5). Work in
the checkout, not from memory — the specs evolve, so confirm the current
conventions before you write.

Ground truth to read first (they win over anything here if they have changed):

- `docs/specs/README.md` — the spec index you will register into.
- `docs/STYLE-GUIDE.md` — the writing conventions specs follow.
- Two model specs of the shape you are writing: `docs/specs/SPEC-OBJECTS.md`
  (a byte-layout format spec) and `docs/specs/SPEC-WORKTREE.md` (a subsystem
  spec). Skim one more neighbor if your topic differs.
- `docs/PARITY.md` — only if your spec introduces or changes an in-scope
  command or behavior (see step 3).

## Step 1 — Scaffold the spec file

Create `docs/specs/SPEC-<NAME>.md`. `<NAME>` is uppercase, hyphen-separated,
and names the format or subsystem (`OBJECTS`, `PACK-SHARDS`, `WORKTREE`). Copy
the shape from `SPEC-TEMPLATE.md` in this skill directory, which encodes the
structure below.

Front matter — the four keys every spec carries, in this order:

```
---
spec: SPEC-<NAME>
version: 1
status: draft
audience: <who must implement or review this — name the crate, CLI surface, or role>
---
```

`status` is one of `stable`, `normative`, or `draft` (README front-matter
vocabulary). A new spec normally starts `draft`.

Opening block, immediately after the `# SPEC-<NAME> — <short title>` H1:

- `Status:` line — a bold state word plus a sentence (`Status: **Normative**
  for mkit v1.`). This restates the front-matter status in prose and MAY say
  more than the one-word key.
- `Scope:` line — one to three sentences fixing exactly what the document
  governs, and what it explicitly does not.
- Optional openers used by real specs, add the ones that apply: `Endianness:`
  (byte-layout specs), `Reference implementation:` (the authoritative module),
  an `Authority:` sentence, and the driving issue number.
- For a format meant for external reimplementation, add the conformance
  sentence the format specs use: external tools MUST be able to produce and
  consume these bytes from this document alone.

Body — numbered H2 sections (`## 1. Title`, `### 1.1 Subtitle`), sentence-case
headings per the style guide. Numbered sections are the dominant convention;
short specs MAY use unnumbered H2s. Order sections from the model most like your
topic. The recurring ones:

- **Purpose / design constraints** — why the format or subsystem exists.
- **The normative core** — the byte layout (a fenced `offset size field`
  block), the state model, or the protocol. This is the spec's reason to exist.
- **Semantics / discovery / lifecycle** — how the format is read, written, and
  behaves; failure modes as typed errors.
- **Out of scope / non-goals** — bound the spec so scope cannot creep.
- **Version history** — a table, for on-disk and wire formats that must
  migrate.
- **Test vectors** (formats: the inputs/outputs an implementer MUST produce,
  pointing at `rust/tests/golden/`) or **Test anchors** (subsystems: the unit
  and CLI tests that pin the behavior).
- **Invariants** — a two-column table mapping each invariant to the mechanism
  or error that enforces it. Nearly every spec closes with this; include it.

Write to the style guide: normative RFC 2119 keywords in caps (MUST, MUST NOT,
SHOULD, MAY); present tense, second or third person; realistic 64-hex BLAKE3
digests in examples, never `xxxx`. Link sibling specs with relative links
(`[SPEC-REFS](SPEC-REFS.md)`) on first reference to a term they own.

Done when: `docs/specs/SPEC-<NAME>.md` exists; front matter has all four keys;
the opening carries a `Status:` and `Scope:` line; the normative core is
specified precisely enough to implement from; an Invariants section closes it;
and its headings and cross-links match the two model specs (the repo has no
markdown linter, so this is an eyeball check against `SPEC-OBJECTS.md`).

## Step 2 — Register in the spec index

Add one bullet to the list in `docs/specs/README.md`, keeping the list in
alphabetical order by spec name:

```
- [SPEC-<NAME>](SPEC-<NAME>.md) — <one lowercase clause naming what it specifies>.
```

Match the file's existing bullets exactly: linked spec name, a literal em dash
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
scope gate, and the live per-command matrix renders from
`apps/web/src/lib/parity-data.ts` onto the web `/parity` page.

- **If the command was previously a non-goal or unlisted**, the scope changed:
  add a scope-amendment paragraph to `docs/PARITY.md` (follow the worktree and
  git-bridge amendments as models — state what left the non-goals list, the
  semantics adopted, and any deliberate divergences), and cross-link your new
  spec from it.
- **Update the live matrix** in `apps/web/src/lib/parity-data.ts`: add or edit
  the command's `ParityItem` (`cmd`, `status` of `parity`/`divergent`/`non-goal`,
  and a one-line user-facing `note`). This file, not `docs/PARITY.md`, drives
  the rendered table.
- **Record any divergence** in the matching `docs/PARITY.md` section: a safety
  guard under "Safety divergences", a parsed-output shape under the
  "Machine-output contract", a human-output difference under "Human-facing
  output parity", or a deferred flag under "Deferred flags".

Done when: the `/parity` command's status and note reflect the spec; any scope
move has an amendment paragraph in `docs/PARITY.md` linking the spec; and
divergences are logged in the right `docs/PARITY.md` section. Editing
`apps/web/**` means the path-filtered `CI: Web` workflow now applies to your PR
(see step 4).

## Step 4 — Validate before opening the PR

- Grep your prose for banned copy the style guide flags: `please`, `sorry`,
  `unfortunately`, `simply`, `easy`, and the literal `—` character (the guide
  wants `&mdash;` in prose; the index bullets in step 2 are the exception that
  keep the literal em dash to match the file).
- A spec-only change is path-filtered in CI: the full Rust matrix and coverage
  do not run on a docs-only push. Enumerate the checks you expect by name and
  confirm each ran — a green rollup does not prove a workflow executed. If you
  touched `apps/web/**` in step 3, confirm `CI: Web` ran; and check the
  `mkit-*-pr` Google Cloud Build checks by name, since the docs-lint gate lives
  there rather than on the GitHub gate.
- If the spec accompanies a format change, land the spec, the golden vector
  under `rust/tests/golden/`, and the code in the same change (CONTRIBUTING
  review bar item 5). Crypto or key-handling specs need a second reviewer and a
  threat-model note in the PR body (item 6).
- Commit with a `docs` (or `docs,specs`) Conventional Commit scope, matching the
  spec commits in `git log`.

## Completion checklist

- [ ] `docs/specs/SPEC-<NAME>.md` created with the four-key front matter,
      `Status:`/`Scope:` opening, numbered normative sections, and an Invariants
      table.
- [ ] Registered as one alphabetically-placed bullet in `docs/specs/README.md`.
- [ ] Parity wired (matrix item, scope amendment, divergence note) — or
      consciously skipped because the spec adds no in-scope command.
- [ ] Style-guide copy grep clean; expected CI checks confirmed by name,
      including the `mkit-*-pr` GCB checks.

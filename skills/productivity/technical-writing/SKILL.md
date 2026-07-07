---
name: technical-writing
description: >
  House style for technical writing — the voice, sentence craft, formatting, and
  user-facing-copy rules that make docs and product text clear, direct, and
  consistent. Use when writing or editing a README, docs, a spec, release notes,
  a changelog, help text, or any error/CLI/UI copy a person reads; when reviewing
  a diff that touches prose or messages; or when a project needs a writing
  standard. Reference-heavy mechanics live in REFERENCE.md.
---

# Technical writing

Documentation is the single source of truth for how a system behaves, and every
string a person reads shapes their trust in it. Write for clarity, accuracy, and
completeness. When you can show instead of tell, show: an example lands faster
than an explanation.

This skill is the durable, behavior-changing core. The exhaustive mechanics
(units, possessives, abbreviations, keyboard shortcuts, code-doc conventions)
live in [REFERENCE.md](REFERENCE.md) &mdash; consult it when a specific question
comes up. Project-specific vocabulary (a glossary, wire-format terms, product
names) belongs in that project's own style guide; link the canonical definition
on first use.

## Voice and tone

Three words are the touchstone: **clear, direct, specific.** Every rule below
serves one of them.

- **Second person.** Write "you", not "we". Reserve "we" for the rare moment the
  maintainers address the reader directly (a security advisory, a deprecation).
- **Present tense.** Say what the system does now, not what it "will" do.
- **Active voice.** Name the actor. "The command writes a lockfile", not "a
  lockfile is written". Passive constructions lean on "was" and "by" &mdash; hunt them.
- **Plain American English**, readable by every English speaker, not only native
  ones. Prefer the shorter forms ("behavior", "canceled").
- **Gender-neutral.** Singular "they"; address groups as developers, operators,
  maintainers, or callers.

## Sentence craft

Write short sentences. One thought each is punchier than three crammed together.

- Use action verbs and subject-verb-object order. Cut clunky phrases. Drop any
  adjective or adverb that doesn't change the meaning.
- After a long sentence, write a short one. The contrast snaps attention back.
- Don't repeat a word inside one sentence, and don't open or close a sentence
  with the word that opened or closed the one before it.
- Prefer splitting a phrase into two sentences over gluing clauses with a comma.
  When you must join them, use an em dash or a connecting word ("then",
  "however", "so"), never a bare comma between two independent clauses.

## Formatting

- **Headings in sentence case.** Capitalize only the first word and real proper
  nouns, kept at their canonical casing (GitHub, BLAKE3, in-toto). Never Title
  Case a heading for emphasis. The page title is the H1; top-level sections are
  H2; don't skip levels.
- **Link the noun phrase, never "here".** The link text names its destination and
  reads as the call to action: "see the [packfile specification](#)", not "the
  spec is available [here](#)". Use relative links between files in the same repo.
- **Inline code is for code.** Back-tick identifiers, paths, commands, and literal
  output only. Do not use inline code, bold, or caps as a substitute for emphasis.
- **Bold file and directory names** (**.mkit/**, **src/**, **.cbor**) rather than
  back-ticking them.
- **No emojis** &mdash; not in prose, headings, callouts, or changelog entries.
- **Spell out symbols in prose**: "and" not "&", "plus" not "+" (except in
  keyboard shortcuts).
- **Em dashes**: write `&mdash;` rather than a hyphen or the literal `—`. Markdown
  renders the entity reliably, and the literal `—` is the most common tell of
  AI-assisted writing &mdash; flag it in review.
- Numbered lists start at 1. Use Oxford commas in prose; if a sentence sags under
  its commas, split it rather than dropping the Oxford comma.

## User-facing copy

Any string a person reads is user-facing copy: stdout and stderr, error and
progress messages, `--help` text, prompts, buttons, the web UI, the docs site. A
dynamic `format!`/template string counts. Every string earns its place by doing
at least one of three things: say what happened, say what happens next, or say
what to do. Get to the point.

- **State facts, not feelings.** No "please", "sorry", "unfortunately". Write
  `non-fast-forward push rejected: fetch and retry`, not `Sorry, we couldn't push
  your changes. Please try again.`
- **Every error carries the next action.** The exit code carries the class; the
  message carries the specifics and, when one exists, the recovery step.
- **Plain terms first.** Keep spec jargon in the specs. In help text, errors, and
  UI, prefer the plain term ("attestation envelope"); expand or link a precise
  term on first use.
- **Exact verbs on prompts and buttons.** A confirmation names its action &mdash;
  "Delete branch", "Overwrite key" &mdash; never "Yes" or "OK". Prompt copy is a
  full sentence saying what happens and why.
- **Same state, same words.** Never word one state two ways across surfaces (CLI
  vs UI vs a JSON `message`). Route a repeated string through one helper.
- **Sentence case everywhere** &mdash; headings, labels, buttons, table headers.
  Title case only for real proper nouns.
- **Fidelity wins over style.** Where output is pinned byte-for-byte to another
  tool's (a compatibility format), match that tool's wording even when it breaks
  these rules. Note why.

## Before you ship

Run this pass on any diff that touches prose or copy:

1. **Grep the diff** for `please`, `sorry`, `unfortunately`, `simply`, and
   `easy`. Each is almost always cuttable. ("Simply" and "easy" tell the reader
   their trouble is their own fault.)
2. **Search for the literal `—`** you didn't type as `&mdash;` &mdash; it's the
   AI-writing giveaway.
3. **Check for a duplicated string** already worded by a helper; reuse it instead
   of hand-writing the state again.
4. **Read it once for passive voice and long sentences.** Split the longest
   sentence on the page. Turn one "was …" into an active clause.
5. **Confirm headings are sentence case** and links name their destination.

For anything this skill doesn't cover, fall back to the
[Google developer documentation style guide](https://developers.google.com/style)
and, for the words to strike, [Words to avoid in educational writing](https://css-tricks.com/words-avoid-educational-writing/).

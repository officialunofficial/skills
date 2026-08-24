---
name: best-practices
description: Check a language, framework, or library's current idiomatic patterns against its own docs and style guides, then answer directly or review given code against them. Use when the user asks what's idiomatic, whether something is best practice, or wants code checked against current stack conventions.
---

A foreground idiom check against one named stack — not [`research`](../research/SKILL.md)'s
backgrounded, saved-to-file investigation of a broader question.

Ground every claim in a **primary source** — the maintainer's own docs or style guide (Effective
Go, PEP 8, the Rust API Guidelines, a framework's own docs) — fetched this run, never recalled
from training data. A blog post or forum answer only corroborates a primary source; it never
stands alone as one.

1. Take the stack from the request, or infer it from a target file's extension or the project's
   manifest.
2. Fetch the primary source that covers the pattern in question.
3. No target file: answer directly and cite the source. Target file: list each deviation as
   `file:line` — what the code does, the idiom, the fix — and skip what's already idiomatic.

State plainly when a practice is contested or version-dependent instead of picking one answer as
universal.

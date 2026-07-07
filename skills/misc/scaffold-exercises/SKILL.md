---
name: scaffold-exercises
description: Scaffold an exercise directory tree — sections, problems, solutions, and explainers — that passes the course linter. Use when the user wants to scaffold exercises, stub out exercise folders, or spin up a new course section.
---

# Scaffold exercises

Build an exercise directory tree that passes the course's exercise linter, then commit it. Throughout, run the linter with the project's own command (for example `pnpm lint:exercises` or whatever the repo defines) — substitute it wherever this skill says "run the linter".

## Directory naming

- **Sections**: `XX-section-name/` under `exercises/` (e.g. `01-retrieval-skill-building`)
- **Exercises**: `XX.YY-exercise-name/` under a section (e.g. `01.03-retrieval-with-bm25`)
- Section number is `XX`; exercise number is `XX.YY`
- Every name is dash-case: lowercase words joined by hyphens

## Exercise variants

Each exercise carries at least one of these subfolders:

- `problem/` — the student's starting point, with TODOs
- `solution/` — the reference answer
- `explainer/` — conceptual material, no TODOs

When you are only stubbing, default to `explainer/` unless the plan asks for something else.

## Required files

Every subfolder (`problem/`, `solution/`, `explainer/`) needs a `readme.md` that:

- Has real content — a lone title line counts, an empty file does not
- Contains no broken links

For a stub, a title plus a short description is enough:

```md
# Exercise Title

Description here
```

If a subfolder ships code, it also needs a `main.ts` longer than one line. Stubs can skip that — a readme-only exercise is valid.

## Workflow

1. **Read the plan** — pull out section names, exercise names, and which variants each exercise needs.
2. **Make the directories** — `mkdir -p` each path.
3. **Write stub readmes** — one `readme.md` per variant folder, each with a title.
4. **Run the linter** — validate the tree.
5. **Fix what it reports** — repeat until the linter is clean.

## What the linter checks

- Each exercise has variant subfolders (`problem/`, `solution/`, `explainer/`)
- At least one of `problem/`, `explainer/`, or `explainer.1/` is present
- The primary subfolder has a non-empty `readme.md`
- No `.gitkeep` files
- No `speaker-notes.md` files
- No broken links in any readme
- No `pnpm run exercise` commands inside readmes
- A `main.ts` in each subfolder unless the subfolder is readme-only

## Moving or renumbering exercises

When you renumber or relocate an exercise:

1. Rename with `git mv`, not `mv`, so git keeps the history.
2. Adjust the numeric prefix to hold the intended order.
3. Run the linter again after the moves.

Example:

```bash
git mv exercises/01-retrieval/01.03-embeddings exercises/01-retrieval/01.04-embeddings
```

## Example: stubbing from a plan

Given a plan such as:

```
Section 05: Memory Skill Building
- 05.01 Introduction to Memory
- 05.02 Short-term Memory (explainer + problem + solution)
- 05.03 Long-term Memory
```

Create the tree:

```bash
mkdir -p exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer
mkdir -p exercises/05-memory-skill-building/05.02-short-term-memory/{explainer,problem,solution}
mkdir -p exercises/05-memory-skill-building/05.03-long-term-memory/explainer
```

Then drop in the readme stubs:

```
exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer/readme.md -> "# Introduction to Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/explainer/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/problem/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/solution/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.03-long-term-memory/explainer/readme.md -> "# Long-term Memory"
```

---
name: audit
description: Reviews a change, a session or a whole codebase against every design skill in this collection and returns one ranked, numbered report.
disable-model-invocation: true
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Audit

Review work against every design skill at once. Send each concern to the skill that owns it and merge the results into one ranked report.

This skill owns no interface rule. It owns the scope, the order of review, the merge, and the verdict. Each finding cites the rule id from the skill that owns it, and rests on evidence from the code, the running app, or the thread. Taste alone is not a finding.

Read [format.md](format.md) before writing findings. It holds the severity ladder and the report format.

## 1. State the scope

Name what is under review: the uncommitted diff, a branch, a pull request, this session's requests, or the whole codebase (`audit-state-the-scope`).

## 2. Read the project's rules

Read `AGENTS.md`, `CLAUDE.md`, and the editor rule folders. A written project rule outranks a default from these skills, so code that follows one is not a finding (`audit-project-rules-first`).

## 3. Run every skill

Check the scope against each skill and record what you inspected.

| Skill | Check |
| --- | --- |
| `verify` | Each changed surface opened in the running app |
| `scope` | Every request in the thread against the diff |
| `reuse` | New components, styles, and icons against the shared package |
| `restraint` | Unrequested UI, settings, fallbacks, dead code, and narrating comments |
| `copy` | Every label, description, and status string |
| `prose` | Each changed post, breakdown, or design note, when writing is in scope |
| `defaults` | Surfaces, type, sound, focus, names, forms, loading, hotkeys, and dialogs |
| `motion` | Every transition, animation, gesture, exit, and motion blur |
| `color` | Text and field contrast in each theme, tokens inside components, and the accent |
| `gather` | Each reference board: platform, links, and the part to take |
| `match` | Each named reference, when the work copies one |
| `rule` | Repeated corrections with no written rule, and edits that break one |
| `viewports` | Each changed layout at every width, when layout is in scope |

When a skill has nothing to check, record it as skipped with the reason. A silent skip is a finding (`audit-run-every-skill`).

## 4. Merge by root cause

One cause that breaks rules in two skills is one finding with both ids. Five call sites with the same local fix are one finding with five locations (`audit-one-row-per-cause`).

## 5. Number the fixes and open the report

Rank findings by severity, then by reach. Number them so the user can answer "fix 1, 2 and 5".

Copy [report.html](report.html) to `.audit/<scope>/index.html`. That folder is ignored by git and stays out of the source tree. Write `report.js` beside it in the shape the header comment of `report.html` shows, then open the page. The look ships with the skill, so write data only (`audit-shipped-report`).

The user marks findings with Pick and pastes them back with Copy Picks. Wait for the pick, then fix only the chosen numbers (`audit-fix-what-was-picked`).

## Rules

Each rule pairs the broken case with its replacement.

| Rule | Broken | Replacement |
| --- | --- | --- |
| `audit-state-the-scope` | "Audited the app" | "Audited the uncommitted diff: 14 files" |
| `audit-project-rules-first` | A border flagged in a repo whose rules require it | The project rule cited, no finding |
| `audit-run-every-skill` | `copy` silently skipped | "`copy`: no strings changed" |
| `audit-one-row-per-cause` | Five rows for one missing primitive fix | One row, five locations |
| `audit-shipped-report` | A report page written from scratch | `report.html` copied, only `report.js` written |
| `audit-fix-what-was-picked` | All 18 findings fixed unasked | The numbers the user chose |

## Verdict

`Block` while any `HIGH` remains, `Approve` otherwise. Approve only work you opened or read.

# Audit severity and format

Every audit returns this format. The design skills use the same severity words, so their findings drop in unchanged.

## Severity

| Severity | Meaning |
| --- | --- |
| `HIGH` | Breaks behaviour or loses work: a dropped feature, a control that does nothing, a committed secret, or "done" with nothing opened |
| `MEDIUM` | Visible and inconsistent: a duplicate component, a wrong-case label, a clipped edge, an unrequested addition, or a hand-written report |
| `LOW` | Polish: a word too many, a narrating comment, or a missing screenshot |

When two levels fit, take the higher and say why in the finding.

## Shape

Lead with the scope and the verdict. Follow with the coverage, the numbered findings, and the summary. The same parts fill `report.js` for [report.html](report.html), in the shape its header comment shows.

```
Scope: uncommitted diff, 14 files, 3 requests in this thread
Verdict: Block, 2 HIGH

Coverage
| Skill | Inspected | Result |
| --- | --- | --- |
| verify | Settings and Library opened | 1 finding |
| scope | requests 1 to 3 | 1 finding |
| copy | 9 strings | Clean |
| match | no reference named | Skipped |

Findings
1. HIGH  settings/index.tsx:42 - [verify-click-new-controls] "Reset" has no handler
2. HIGH  request 2 - [scope-keep-what-worked] the back button is gone after the refactor
3. MEDIUM  library/styles.module.css:18, menu/styles.module.css:7 - [reuse-no-local-restyle] local radius on the shared Menu

Summary
| Rule | Count | Severity |
| --- | --- | --- |
| verify-click-new-controls | 1 | HIGH |
| scope-keep-what-worked | 1 | HIGH |
| reuse-no-local-restyle | 2 | MEDIUM |

Not verified: export, it needs a signed build
```

## Rules

- Write each finding as `file:line - [rule-id] what is wrong`. Use `request N` or `step N` when no file applies.
- Give one number to each root cause and list every location of that cause on its line.
- Mark a skill with nothing to check as `Skipped` with the reason, and a skill that found nothing as `Clean`.
- List under `Not verified` every check that could not run, with the reason.
- End by asking which numbers to fix.

---
name: restraint
description: "Cuts a change down to the ask. No interface, setting, fallback, legacy branch or narrating comment that nobody requested, and remove means delete with every trace. Use when building or reviewing UI or code where extras creep in, when the user says remove, delete, simplify, clean up, too much or over-engineered, and before adding a toast, badge, option or compatibility shim that the request does not need."
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Restraint

Build what was asked and nothing beside it. Every extra element, option and code path is something the user must read, review and later maintain, so an extra is a finding unless the ask cannot work without it.

Two limits keep the cutting safe. Work that has not shipped owes nothing to backwards compatibility. A cut the user has not approved is a proposal, not an edit.

`copy` owns label wording. `reuse` owns picking an existing part over a new one.

## Rules

**Nothing beside the ask.** Add no section, badge, count, caption, footer, icon inside a button, sound or decorative effect that the user did not request.

**No feedback the screen already gives.** When the result of an action is visible on screen, add no toast and no dialog to announce it.

**The smallest build that works.** Choose the native element before a custom one, one app before a monorepo, and a fixed value before a setting. A setting nobody will change is cost with no user.

**No defensive code before release.** Unshipped work keeps no legacy branch and no compatibility shim. Add no fallback for a value that is always set, because the fallback hides the bug when the value goes missing.

**Remove means delete.** When the user says remove, delete the code and its trail: styles, variables, routes and menu entries. Do not defer it for review. If the request is unclear, ask one question.

**Cleanup is a list first.** Asked for a cleanup, list the unused files, exports, styles, dependencies and leftover prototypes. Delete them after the user approves the list.

**Comments state constraints.** Delete a comment that narrates the code. Keep a comment only when it states a constraint the code cannot show.

## Checks

| Rule | Broken | Replacement |
| --- | --- | --- |
| `restraint-no-unrequested-ui` | A count badge on every row | No badge |
| `restraint-no-redundant-feedback` | A toast after a move the user can see | No toast |
| `restraint-smallest-build` | A custom video player | `<video controls>` |
| `restraint-no-needless-setting` | A preference for a gap nobody changes | A fixed `--gap` |
| `restraint-no-legacy` | A legacy branch kept "for safety" | Deleted |
| `restraint-no-fallbacks` | `value ?? defaultValue` for a value that is always set | `value` |
| `restraint-delete-dont-defer` | "Deferred for your review" | Deleted, or one question |
| `restraint-remove-the-trail` | A removed package's variables left in `theme.css` | The variables removed with the package |
| `restraint-no-narrating-comments` | `// Render the header` | No comment |

## Reporting

When the skill runs as a review, write one finding per root cause:

```
file:line - [rule-id] what is wrong
```

Severity:

- `HIGH`: a feature, setting or code path nobody asked for, or a "removed" item that still exists.
- `MEDIUM`: a fallback, a legacy branch or a leftover variable.
- `LOW`: a narrating comment.

Close with a `Rule | Count | Severity` summary and a verdict: `Block` while any `HIGH` remains, `Approve` otherwise. Approve only files you read. Mark every check you could not run as `Not verified`.

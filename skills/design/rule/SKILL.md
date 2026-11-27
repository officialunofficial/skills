---
name: rule
description: "Turns a correction into a short written project rule with a broken line and the line that replaces it, puts the rule in the one file that owns its topic, then fixes the existing code that breaks it. Use when the user says make it a rule, always, never or remember this, when the user corrects the same thing a second time, and before editing a repo whose AGENTS.md and rule files are still unread."
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Rule

Turn a correction into a written project rule. Write it once, in the file that owns its topic, then fix the code that already breaks it.

## When to write one

- The user says "make it a rule", "always", "never" or "remember this": write the rule.
- The user corrects the same thing a second time: propose a rule and write it once they agree.

A rule is a pair: a broken line and the line that replaces it. Keep it short enough to read before every edit, because a rule nobody rereads changes nothing.

`scope` owns following the rules during an edit. `audit` reviews a codebase against all of them.

## Steps

1. **Read what exists.** Read `AGENTS.md`, `CLAUDE.md` and the editor rule folders before acting. An edit that breaks a written rule is the most serious finding here.
2. **Write the pair.** State the rule in one sentence. Then give the broken line and the line that replaces it. A rule with no example gets read three different ways.
3. **Keep it short.** One rule is one to three sentences plus its pair. Leave the reasoning out unless one clause of it prevents a misreading.
4. **Give it one home.** Put the rule in the file that owns its topic. Other files point to it and do not repeat it.
5. **Resolve conflicts.** When the new rule contradicts an old one, replace the old one and tell the user what changed.
6. **Sweep the code.** Search for code that breaks the new rule, fix it and list the files.

The work is done when the rule sits in one file with its pair, no other rule contradicts it, and the reply lists every file the sweep fixed.

## Example

> Labels take Title Case. `Add to library` becomes `Add to Library`.

## Checks

| Rule | Broken | Replacement |
| --- | --- | --- |
| `rule-read-before-acting` | A pill button added in a repo whose rules forbid pills | Rules read first, a rounded button |
| `rule-write-the-pair` | "Use good casing" | The example above |
| `rule-keep-it-short` | A paragraph of reasoning | One sentence and a pair |
| `rule-one-home` | One rule in three files | One file, the others point to it |
| `rule-resolve-conflicts` | "Use borders" beside "never use borders" | The old rule replaced, the change noted |
| `rule-sweep-existing` | The rule added, twelve violations left | The violations fixed and listed |

## Reporting

When the skill runs as a review, write one finding per root cause:

```
file:line - [rule-id] what is wrong
```

Severity:

- `HIGH`: an edit that breaks a written rule, or two rules that contradict.
- `MEDIUM`: a rule with no pair, or old violations left after a new rule.
- `LOW`: a rule longer than it needs to be.

Close with a `Rule | Count | Severity` summary and a verdict: `Block` while any `HIGH` remains, `Approve` otherwise. Mark every rule file you could not read as `Not verified`.

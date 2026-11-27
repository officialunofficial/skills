---
name: scope
description: "Holds an edit to the request. Takes the smallest literal reading, answers every item in the message, and keeps earlier instructions and working features intact. Use on any edit request, and above all on a short message that points at one element, a message with several asks, a refactor, a planning request, and a question such as how does this work that wants an explanation and not a diff."
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Scope

Change what was asked, keep what already worked, and account for every item the user sent.

The smallest literal reading of a request wins, because an unrequested change costs the user a review and often a revert. A change outside the named element is a finding unless the user asked for a sweep. One short question before a broad change is not a finding.

Three kinds of message drift most: a short message that points at one element, a message with several asks, and a refactor.

`restraint` owns deleting what nobody asked for. `verify` owns proving the change works.

## Rules

**Every ask gets an answer.** Split the message into numbered items and add the items still open from earlier turns. Close the reply with the same list, each item done or not done with the reason.

**The named element and nothing around it.** Restate the target in a few words before editing. "The card" means the card, not the page around it. When two readings fit, ask one short question.

**Earlier instructions still stand.** Before editing, read the user's earlier corrections in the thread and the rules in the repository. Do not bring back what the user removed. Keep a value the user gave, such as `16px` of left padding, and do not guess a new one.

**What worked keeps working.** Before a refactor, list the features, buttons and states that exist now. Check each one after. When you fix one property, leave the others alone: a clip fixed by deleting the width animation is not fixed.

**Unshipped work is done now.** Do not split unshipped work into phases or mark part of it out of scope without asking. Build it now or ask one question.

**A plan is only a plan.** While planning, edit no files until the user approves the plan.

**An explanation is the answer.** When the user asks how something works, explain it and wait. Do not answer with a diff.

## Checks

| Rule | Broken | Replacement |
| --- | --- | --- |
| `scope-list-every-ask` | The first of four asks done, three dropped | Four numbered items, each reported |
| `scope-smallest-reading` | "Fix the top bar" restyles the whole shell | Only the top bar changes |
| `scope-remember-instructions` | Dots the user removed come back | Earlier turns read before the edit |
| `scope-keep-given-values` | Left padding guessed again as `12px` | The `16px` the user gave |
| `scope-keep-what-worked` | A refactor drops the back and forward buttons | A feature list before and after, both buttons kept |
| `scope-no-collateral` | The clip is fixed and the width animation is gone | The clip fixed, the width animation kept |
| `scope-no-phasing` | "Saved filters: phase 2" | Built now, or one question |
| `scope-plan-means-plan` | Files edited during planning | A plan only, until it is approved |
| `scope-explain-when-asked` | "Explain how it works" answered with a diff | An explanation, then a wait |

## Reporting

When the skill runs as a review, write one finding per root cause, and cite the request when no file applies:

```
file:line - [rule-id] what is wrong
request 2 - [rule-id] what is wrong
```

Severity:

- `HIGH`: a dropped feature, or an earlier instruction undone.
- `MEDIUM`: a change outside the named element, or an ask left unreported.
- `LOW`: a question asked where one reading was plain.

Close with a `Rule | Count | Severity` summary and a verdict: `Block` while any `HIGH` remains, `Approve` otherwise. Approve only a diff you read. Mark every check you could not run as `Not verified`.

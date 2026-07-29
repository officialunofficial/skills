---
name: audit-issue-tree
description: Audit an issue tree (issue + epic + siblings) for continued relevance — verify its claims against HEAD, then recommend keep, rescope, or close, with drafted comments the user can apply.
disable-model-invocation: true
---

# Audit issue tree

Assess whether an issue tree is still relevant, and end in recommendations the user can act on. The user must **understand the issues before being asked to judge them** — the sequencing below is deliberate: product focus captured as context at intake, research next, teach-back after, verdicts last. Never propose a verdict or ask about closure before delivering the digest.

This skill takes **no tracker actions**: its output is analysis plus drafted comments and rewrites, ready for the user to apply (or hand back for execution as a separate, explicit request). It earns its cost on issues old enough to have drifted from the code — epics and long-lived plans. Fresh, never-triaged issues belong to `/triage`; don't point this at an incoming bug report.

Grading discipline comes from `/to-primitives`. Tracker conventions (labels, milestones, auth quirks) come from whatever the repo documents — contributing docs, tracker docs, or the configuration `/setup-skills` established; read them first, and where the repo documents nothing, use the tracker's defaults and skip decoration advice.

**Delivery rule.** Whenever a turn ends in substantive analysis the user must read (the digest, the verdict proposals), that analysis must be the final prose message of its turn, with NO tool call after it — a question tool fired in the same turn swallows the analysis and the user never sees it. End such turns with questions written in plain prose, then stop and wait. Reserve question tools for short, self-contained choices with no analysis preceding them in the turn.

## Process

### 1. Intake

The argument is an issue number or URL. If none was given, ask which issue to audit.

Capture the **product focus** as context: read it from the repo's roadmap or planning docs where they exist, else ask the user for it in one sentence. It is the fulcrum every verdict will turn on, so it must be stated, not improvised later. It scopes nothing before the verdicts — research stays comprehensive regardless — and it does not license early judgment: the sequencing rule above still holds. These are the only questions allowed before the digest.

### 2. Map the tree (tracker only)

- Fetch the issue: full body, labels, milestone, assignees, created/updated dates.
- Fetch its parent epic and ALL sibling sub-issues (via the tracker's native parent/sub-issue relations where it has them, else by following references in bodies).
- Fetch the state of every issue referenced in any body ("builds on / related / depends on"). A closed substrate issue means the sketch may be stale — note each.
- Search the tracker (all states) for newer issues that overlap or supersede any part of the tree.

### 3. Verify claims against HEAD (code research)

Treat every codebase claim in every body as unverified — the bodies froze at `createdAt`. Fan out read-only research agents, one per issue in the tree, in batches of no more than four at a time; if the tree holds more than ~8 issues, confirm the scope with the user before launching. Each agent returns:

- **Claim verdicts** — each factual claim marked still-true / partially-stale / false, with current `file:line` evidence. Cited line numbers, constants, and commit hashes drift; find the current location.
- **Primitive grades** — the capabilities the issue rests on, graded per `/to-primitives` (`exists` / `partial` / `missing`, behavior-named, `file:line`-cited).
- **Approach deltas** — anything landed since authorship that makes the sketch redundant (proposes a store that now exists), harder (new invariants it must join), or easier (a new natural mount point).

### 4. Teach-back digest

Present to the user, in this order — this is the deliverable of the first half:

1. **What the tree touches** — which subsystems/modules/layers, in the repo's own glossary, so the user knows what part of the codebase is implicated.
2. **One user story** — a single concrete narrative in which every issue in the tree is load-bearing, with the exact point where TODAY's code fails at each beat, and a closing line naming the joint affordance ("together these turn X into Y"). If the issues don't compose into one story, say so — that is itself a finding about the epic.
3. **Primitives table** — graded, cited, including any load-bearing missing primitive that NO issue in the tree owns (stated epic build orders often don't survive grading — check explicitly).
4. **Staleness summary** — which motivations still hold, which are already solved on the default branch, which sketches propose duplicating things that now exist.

The delivery rule applies. End the digest with two gating questions in plain prose, then stop and wait for the reply:

- Any part of the digest to go deeper on?
- **Confirm the product focus** — restate the focus captured at intake and ask whether, now that the user has seen what the tree actually affords, it still stands as the fulcrum for the verdicts.

### 5. Recommend verdicts

Apply the **roadmap test, not the complexity test**: "does the stated product focus need this capability soon?", never "does the user story sound ambitious?" — an ambitious story may just mean the audit composed a maximal one.

For each issue propose: **keep as-is** (motivation and sketch both survived verification), **rescope** (capability needed near-term, body needs rewriting against current code), or **close as premature** (real capability, but the focus needs none of it).

Think independently: if the user's framing is wrong, say so with evidence; if one issue in a tree deserves a different fate than the rest, argue it. Note hygiene fixes regardless (wrong labels, stale milestone, drifted size) where the repo documents conventions to check against. The delivery rule applies here too. Iterate until the user settles on a verdict per issue.

### 6. Draft the actions

Produce, as suggestions for the user to apply — take no tracker actions yourself:

- **Close**: one drafted context-preserving comment per issue (template below), closing children first, epic last (the epic's comment carries any build-order correction). Recommend the tracker's "not planned" close reason where it supports one, and removal from any version milestone. The research is the only durable output of a closed issue — a bare "closing as premature" throws it away.
- **Rescope**: a drafted replacement body per issue, rewritten against current code with the same decoration the repo's conventions call for.
- Never suggest reopen-and-edit of a stale sketch when the substrate moved — prefer close-with-guidance now, fresh re-file later.

Done when every issue the user ruled on has its drafted comment or body in the final message, ready to paste or approve.

## Closing-comment template

<closing-comment>
Closing as premature — current focus is <focus>, which needs none of this. Assessed <date> against <default branch> (<HEAD sha>); capturing the findings so a future re-file starts from current code, not this <createdAt> sketch.

**Stale since written:** <each claim that no longer holds, with what replaced it and current `file:line`>.

**Still genuinely missing:** <the capabilities verification confirmed absent>.

**If re-filed:** <the correct framing; the smallest real slice; constraints landed since that the design must satisfy>.
</closing-comment>

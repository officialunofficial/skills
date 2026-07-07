---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a handoff document that summarises the current conversation so a fresh agent can carry the work forward. Save it to the OS temporary directory — not the current workspace.

Add a "suggested skills" section naming the skills the next agent should invoke.

Don't restate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Point to them by path or URL instead.

Redact anything sensitive — API keys, passwords, personally identifiable information.

If the user passed arguments, read them as a description of what the next session will focus on, and shape the document toward that.

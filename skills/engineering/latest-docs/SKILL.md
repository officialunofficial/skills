---
name: latest-docs
description: Fetch a library or framework's current official docs and changelog on the spot, then report what changed from what training data or existing code assumes. Use when the user names a specific library and asks to check the latest docs, verify the current API, or confirm code isn't calling a deprecated or renamed method.
---

A foreground, single-library check — not [`research`](../research/SKILL.md)'s backgrounded,
saved-to-file investigation of a broader question.

1. Take the library and version from the request, or read the pinned version from the project's
   manifest or lockfile.
2. Fetch its own docs site, README, or CHANGELOG — never a third-party tutorial, which lags the
   real docs and can already be stale itself.
3. Report the delta: renamed or removed APIs, new required parameters, deprecations, breaking
   changes.
4. Target file given: point out each call site using an outdated API as `file:line`, with the
   corrected current call.

Cite the URL and, if visible, the doc's version or date — an undated page is weaker evidence than
one naming a release. If the docs can't be reached, say so; never fall back to training-data
assumptions.

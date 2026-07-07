---
name: resolving-merge-conflicts
description: "Use when you need to resolve an in-progress git merge/rebase conflict."
---

1. **Read the current state** of the merge or rebase. Inspect the git history and the files that conflict.

2. **Trace each conflict back to its source.** Understand fully why each side made its change and what it was trying to achieve — read the commit messages, look at the PRs, follow the originating issues/tickets.

3. **Resolve every hunk.** Keep both intents wherever they can coexist. Where they can't, take the side that matches the merge's stated goal and record the trade-off. Do **not** invent new behaviour. Always resolve; never `--abort`.

4. Find the project's **automated checks** and run them — usually typecheck first, then tests, then format. Repair whatever the merge broke.

5. **Complete the merge/rebase.** Stage everything and commit. If you're rebasing, keep continuing until every commit is replayed.

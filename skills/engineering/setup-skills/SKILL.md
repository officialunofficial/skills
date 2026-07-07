---
name: setup-skills
description: Configure this repo for the engineering skills — set up its issue tracker, triage label vocabulary, and domain doc layout. Run once before first use of the other engineering skills.
disable-model-invocation: true
---

# Set up skills

Lay down the per-repo configuration the engineering skills rely on:

- **Issue tracker** — where issues live (GitHub by default; local markdown also works out of the box)
- **Triage labels** — the strings that stand in for the five canonical triage roles
- **Domain docs** — where `CONTEXT.md` and ADRs live, and how consumers should read them

This is prompt-driven, not a deterministic script. Explore, show what you found, confirm with the user, then write.

## Process

### 1. Explore

Inspect the repo to learn its starting state. Read what's actually there rather than assuming:

- `git remote -v` and `.git/config` — is this a GitHub repo? Which one?
- `AGENTS.md` and `CLAUDE.md` at the repo root — does either exist? Does either already carry an `## Agent skills` section?
- `CONTEXT.md` and `CONTEXT-MAP.md` at the repo root
- `docs/adr/` and any `src/*/docs/adr/` directories
- `docs/agents/` — has this skill already produced output here?
- `.scratch/` — a sign a local-markdown issue tracker convention is already in play

### 2. Present findings and ask

Summarise what exists and what's missing. Then walk the user through the three decisions **one at a time** — show a section, take the user's answer, then move on. Don't dump all three at once.

Assume the user hasn't met these terms before. Open each section with a short explainer (what it is, why these skills need it, what shifts if they choose otherwise). Then lay out the choices and the default.

**Section A — Issue tracker.**

> Explainer: The "issue tracker" is where this repo's issues live. Skills like `to-issues`, `triage`, and `to-prd` read from and write to it — they need to know whether to reach for `gh issue create`, drop a markdown file under `.scratch/`, or follow some other workflow you describe. Pick the place you genuinely track work for this repo.

Default posture: these skills were built for GitHub. If a `git remote` points at GitHub, propose that. If a `git remote` points at GitLab (`gitlab.com` or a self-hosted host), propose GitLab. Otherwise (or if the user prefers), offer:

- **GitHub** — issues live in the repo's GitHub Issues (uses the `gh` CLI)
- **GitLab** — issues live in the repo's GitLab Issues (uses the [`glab`](https://gitlab.com/gitlab-org/cli) CLI)
- **Local markdown** — issues live as files under `.scratch/<feature>/` in this repo (good for solo projects or repos without a remote)
- **Other** (Jira, Linear, etc.) — ask the user to describe the workflow in one paragraph; the skill records it as freeform prose

If — and only if — the user picked **GitHub** or **GitLab**, ask one follow-up:

> Explainer: Open-source repos often get feature requests as pull requests, not just issues — a PR is an issue with code attached. Turn this on and `/triage` folds *external* PRs into the same queue, running them through the same labels and states as issues (collaborators' in-flight PRs are left alone). Leave it off if PRs aren't a request surface for you.

- **PRs as a request surface** — yes / no (default: no). Record the answer in `docs/agents/issue-tracker.md`. For local-markdown and other trackers, skip this question — there are no PRs.

**Section B — Triage label vocabulary.**

> Explainer: When the `triage` skill handles an incoming issue, it walks it through a state machine — needs evaluation, waiting on reporter, ready for an AFK agent to grab, ready for a human, or won't fix. To do that it applies labels (or your tracker's equivalent) that match strings *you've actually set up*. If your repo already uses different names (say `bug:triage` instead of `needs-triage`), map them here so the skill reaches for the right ones instead of minting duplicates.

The five canonical roles:

- `needs-triage` — maintainer needs to evaluate
- `needs-info` — waiting on reporter
- `ready-for-agent` — fully specified, AFK-ready (an agent can grab it with no human context)
- `ready-for-human` — needs human implementation
- `wontfix` — will not be actioned

Default: each role's string equals its name. Ask whether the user wants to override any. If their tracker has no existing labels, the defaults are fine.

**Section C — Domain docs.**

> Explainer: Some skills (`improve-codebase-architecture`, `diagnosing-bugs`, `tdd`) read a `CONTEXT.md` file to pick up the project's domain language, and `docs/adr/` for past architectural decisions. They need to know whether the repo runs one global context or several (say a monorepo with separate frontend/backend contexts) so they look in the right place.

Confirm the layout:

- **Single-context** — one `CONTEXT.md` + `docs/adr/` at the repo root. Most repos are this.
- **Multi-context** — `CONTEXT-MAP.md` at the root pointing to per-context `CONTEXT.md` files (typically a monorepo).

### 3. Confirm and edit

Show the user a draft of:

- The `## Agent skills` block to add to whichever of `CLAUDE.md` / `AGENTS.md` you're editing (selection rules in step 4)
- The contents of `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`

Let them edit before you write.

### 4. Write

**Pick the file to edit:**

- If `CLAUDE.md` exists, edit it.
- Else if `AGENTS.md` exists, edit it.
- If neither exists, ask the user which to create — don't decide for them.

Never create `AGENTS.md` when `CLAUDE.md` already exists (or vice versa) — always edit the one already there.

If an `## Agent skills` block already exists in the chosen file, update its contents in place rather than appending a duplicate. Leave the user's edits to the surrounding sections alone.

The block:

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked, plus whether external PRs are a triage surface]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary of the label vocabulary]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout — "single-context" or "multi-context"]. See `docs/agents/domain.md`.
```

Then write the three docs files, seeding them from the templates in this skill folder:

- [issue-tracker-github.md](./issue-tracker-github.md) — GitHub issue tracker
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md) — GitLab issue tracker
- [issue-tracker-local.md](./issue-tracker-local.md) — local-markdown issue tracker
- [triage-labels.md](./triage-labels.md) — label mapping
- [domain.md](./domain.md) — domain doc consumer rules + layout

For "other" issue trackers, write `docs/agents/issue-tracker.md` from scratch out of the user's description.

### 5. Done

Tell the user setup is complete and which engineering skills will now read from these files. Note that they can edit `docs/agents/*.md` directly later — re-running this skill is only needed to switch issue trackers or start over.

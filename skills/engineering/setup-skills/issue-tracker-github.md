# Issue tracker: GitHub

This repo's issues and PRDs live as GitHub issues. Drive every operation through the `gh` CLI.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Reach for a heredoc on multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments with `jq` and also pulling labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`, adding `--label` and `--state` filters as needed.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Add / drop labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

The repo is inferred from `git remote -v` — `gh` handles this on its own when run inside a clone.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Flip to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag.)_

Set to `yes`, PRs travel through the same labels and states as issues, via the `gh pr` equivalents:

- **Read a PR**: `gh pr view <number> --comments`, plus `gh pr diff <number>` for the diff.
- **List external PRs for triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments`, then keep only an `authorAssociation` of `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, or `NONE` (drop `OWNER`/`MEMBER`/`COLLABORATOR`).
- **Comment / label / close**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`.

GitHub runs one number space across issues and PRs, so a bare `#42` may be either — resolve it with `gh pr view 42`, falling back to `gh issue view 42`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant issue"

Run `gh issue view <number> --comments`.

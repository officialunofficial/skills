# Issue tracker: GitLab

This repo's issues and PRDs live as GitLab issues. Drive every operation through the [`glab`](https://gitlab.com/gitlab-org/cli) CLI.

## Conventions

- **Create an issue**: `glab issue create --title "..." --description "..."`. Reach for a heredoc on multi-line descriptions, or pass `--description -` to open an editor.
- **Read an issue**: `glab issue view <number> --comments`. Add `-F json` for machine-readable output.
- **List issues**: `glab issue list -F json`, adding `--label` filters as needed.
- **Comment on an issue**: `glab issue note <number> --message "..."`. GitLab calls comments "notes".
- **Add / drop labels**: `glab issue update <number> --label "..."` / `--unlabel "..."`. Multiple labels can be comma-separated or set by repeating the flag.
- **Close**: `glab issue close <number>`. It takes no closing comment, so post the explanation first with `glab issue note <number> --message "..."`, then close.
- **Merge requests**: GitLab calls PRs "merge requests". Use `glab mr create`, `glab mr view`, `glab mr note`, and so on — the same shape as `gh pr ...`, with `mr` for `pr` and `note`/`--message` for `comment`/`--body`.

The repo is inferred from `git remote -v` — `glab` handles this on its own when run inside a clone.

## Merge requests as a triage surface

**MRs as a request surface: no.** _(Flip to `yes` if this repo treats external merge requests as feature requests; `/triage` reads this flag.)_

Set to `yes`, MRs travel through the same labels and states as issues, via the `glab mr` equivalents:

- **Read an MR**: `glab mr view <number> --comments`, plus `glab mr diff <number>` for the diff.
- **List external MRs for triage**: `glab mr list -F json`, then keep only MRs whose author isn't a project member or owner (a contributor's MR, not a maintainer's in-flight work).
- **Comment / label / close**: `glab mr note`, `glab mr update --label`/`--unlabel`, `glab mr close`.

Unlike GitHub, GitLab numbers issues and MRs separately, so `#42` is unambiguous once you know which surface the maintainer means.

## When a skill says "publish to the issue tracker"

Create a GitLab issue.

## When a skill says "fetch the relevant issue"

Run `glab issue view <number> --comments`.

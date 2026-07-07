# Out-of-Scope Knowledge Base

The `.out-of-scope/` directory in a repo keeps persistent records of rejected feature requests. It earns its place two ways:

1. **Institutional memory** — why a feature was rejected, so the reasoning survives the issue being closed
2. **Deduplication** — when a new issue arrives that matches a prior rejection, the skill can surface the earlier decision instead of re-litigating it

## Directory structure

```
.out-of-scope/
├── dark-mode.md
├── plugin-system.md
└── graphql-api.md
```

One file per **concept**, not per issue. Several issues asking for the same thing gather under a single file.

## File format

Write the file in a relaxed, readable style — closer to a short design note than a database row. Lean on paragraphs, code samples, and examples so the reasoning reads clearly to someone meeting it for the first time.

```markdown
# Dark Mode

This project does not support dark mode or user-facing theming.

## Why this is out of scope

The rendering pipeline assumes a single color palette defined in
`ThemeConfig`. Supporting multiple themes would demand:

- A theme context provider wrapping the entire component tree
- Per-component theme-aware style resolution
- A persistence layer for the user's theme preference

That's a substantial architectural change, out of step with the
project's focus on content authoring. Theming belongs to downstream
consumers who embed or redistribute the output.

```ts
// The current ThemeConfig interface isn't built for runtime switching:
interface ThemeConfig {
  colors: ColorPalette; // single palette, resolved at build time
  fonts: FontStack;
}
```

## Prior requests

- #42 — "Add dark mode support"
- #87 — "Night theme for accessibility"
- #134 — "Dark theme option"
```

### Naming the file

Give the concept a short, descriptive kebab-case name: `dark-mode.md`, `plugin-system.md`, `graphql-api.md`. The name should be clear enough that someone scanning the directory grasps what was rejected without opening the file.

### Writing the reason

Make the reason substantive — not "we don't want this" but why. Strong reasons lean on:

- Project scope or philosophy ("This project focuses on X; theming is a downstream concern")
- Technical constraints ("Supporting this would demand Y, which clashes with our Z architecture")
- Strategic decisions ("We chose A over B because…")

Keep the reason durable. Steer clear of temporary circumstances ("we're too busy right now") — those aren't rejections, they're deferrals.

## When to check `.out-of-scope/`

During triage (Step 1: Gather context), read every file in `.out-of-scope/`. When weighing a new issue:

- Check whether the request matches an existing out-of-scope concept
- Match by concept similarity, not keyword — "night theme" matches `dark-mode.md`
- On a match, surface it to the maintainer: "This looks like `.out-of-scope/dark-mode.md` — we rejected it before because [reason]. Do you still feel the same?"

The maintainer may:

- **Confirm** — the new issue is appended to the existing file's "Prior requests" list, then closed
- **Reconsider** — the out-of-scope file is deleted or updated, and the issue runs through normal triage
- **Disagree** — the issues are related but distinct; proceed with normal triage

## When to write to `.out-of-scope/`

Only when an **enhancement** (not a bug) is *rejected* as `wontfix`. This applies to enhancement PRs exactly as to issues — a rejected PR is recorded here so the same request doesn't come back as fresh code.

Do **not** write here when something is closed as `wontfix` because it's **already implemented**. That's a built feature, not a rejected one; recording it would poison the dedup checks with false rejections. Instead, the closing comment points to where the feature already lives.

The flow:

1. Maintainer decides a feature request is out of scope
2. Check whether a matching `.out-of-scope/` file already exists
3. If yes: append the new issue to the "Prior requests" list
4. If no: create a new file with the concept name, decision, reason, and first prior request
5. Post a comment on the issue explaining the decision and pointing at the `.out-of-scope/` file
6. Close the issue with the `wontfix` label

## Updating or removing out-of-scope files

If the maintainer changes their mind about a previously rejected concept:

- Delete the `.out-of-scope/` file
- The skill needn't reopen old issues — they stand as historical records
- The new issue that prompted the reconsideration runs through normal triage

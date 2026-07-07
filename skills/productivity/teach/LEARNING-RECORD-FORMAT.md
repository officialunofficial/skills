# Learning Record Format

Learning records live in `./learning-records/` under sequential numbering: `0001-slug.md`, `0002-slug.md`, and so on. Create the directory lazily — only when the first record is written.

They are the teaching equivalent of ADRs: they hold non-obvious lessons, key insights, and stated prior knowledge that steer future sessions. They are used to compute the zone of proximal development.

## Template

```md
# {Short title of what was learned or established}

{1-3 sentences: what was learned (or what prior knowledge was established), and why it changes future sessions.}
```

That's the whole shape. A learning record can be a single paragraph. The value is recording _that_ this is now known and _why_ it changes what to teach next — not in filling out sections.

## Optional sections

Include these only when they add real value. Most records won't need them.

- **Status** frontmatter (`active | superseded by LR-NNNN`) — useful when an earlier understanding turns out wrong and gets replaced.
- **Evidence** — how the user demonstrated the understanding (a question answered, an exercise completed, prior experience cited). Useful when the claim may be revisited.
- **Implications** — what this unlocks or rules out for future sessions. Worth recording when non-obvious.

## Numbering

Scan `./learning-records/` for the highest existing number and increment by one.

## When to write a learning record

Write one when any of these holds:

1. **The user demonstrated genuine understanding of something non-trivial** — not mere exposure, but evidence they can use the concept correctly. This raises the floor for what to teach next.
2. **The user disclosed prior knowledge** — "I already know X." Record it so future sessions don't re-teach it. Note the _depth_ claimed too.
3. **A misconception was corrected** — the user previously believed something wrong and now sees why. These are high-value: they predict where related topics will trip the user up.
4. **The mission shifted in response to learning** — the user found they cared about something other than they thought. Cross-link to [[MISSION.md]] and update it.

### What does _not_ qualify

- Material that was merely covered. Coverage is not learning. Wait for evidence.
- Anything already captured tersely in [[GLOSSARY.md]] as a term definition. Don't duplicate.
- Session-by-session activity logs. Learning records are not a journal — they are decision-grade insights.

## Supersession

When a later record contradicts an earlier one (the user's understanding deepened or corrected), mark the old record `Status: superseded by LR-NNNN` rather than deleting it. How understanding evolved is itself useful signal.

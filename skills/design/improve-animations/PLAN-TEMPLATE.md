# Plan template

Every plan from `improve-animations` uses this structure. The executor may be a weaker model with no context, so the plan holds everything it needs. It never refers to "the audit above" or to an earlier discussion.

````markdown
# NNN - [Short imperative title]

- **Status**: TODO
- **Commit**: [output of git rev-parse --short HEAD when the plan was written]
- **Severity**: HIGH | MEDIUM | LOW
- **Category**: [audit category]
- **Estimated scope**: [n files, rough size]

## Problem

What is wrong, where, and how it affects the feel of the product. Cite every
location as path/to/file.tsx:123 and quote the current code:

```css
/* src/components/dropdown.css:14 - current */
.dropdown { transition: all 400ms ease-in; }
```

## Target

The exact end state, with every curve, duration, spring config and media
query written out:

```css
/* target */
.dropdown {
  transition: transform 200ms var(--ease-out), opacity 200ms var(--ease-out);
  transform-origin: var(--transform-origin);
}
```

## Repo conventions to follow

How this codebase already does it, with one exemplar to imitate (token
names, file placement, prop patterns):

- Easing tokens live in src/styles/tokens.css. Add new curves there, for
  example --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
- [file:line of an exemplar that already does this correctly]

## Steps

1. [One concrete edit per step: file, what changes, resulting code.]
2. ...

## Boundaries

- Leave [files and components out of scope] untouched.
- Change motion properties only. Keep markup and structure as they are,
  unless a step says otherwise.
- Add no dependencies.
- If a step does not match the code you find (the code changed after the
  commit stamp), stop and report. Do not improvise.

## Verification

- **Mechanical**: [exact typecheck, lint and build commands, with the expected result].
- **Feel check**: run the UI, trigger [interaction], and confirm:
  - [an observable check, e.g. "the dropdown scales from its trigger, not from center"]
  - [e.g. "rapid toggling never restarts the animation from zero"]
  - In the DevTools Animations panel, set playback to 10% and confirm [detail].
  - In the Rendering panel, turn on prefers-reduced-motion and confirm that
    movement is gone and opacity feedback remains.
- **Done when**: [a criterion a machine or an eye can check].
````

## Notes for the plan author

- Write one plan per finding. Merge two findings only when they share every file and the same fix pattern, such as one easing token swap across components.
- Take every value from [AUDIT.md](AUDIT.md).
- Always include the feel check. Motion can be mechanically correct and still feel wrong, so give the executor, or the person who reviews its diff, concrete things to watch in slow motion.
- After you write plans, create or update `plans/README.md` with a table of plans (number, title, severity, status), the recommended order, and dependencies between plans.

---
name: design-router
description: Routes interface work to the right design skill in this set and sets the order of work. Use at the start of any UI, visual design, motion, copy, layout, mockup or front-end polish task, when reviewing or finishing an interface change, or when it is unclear which design skill applies.
license: MIT
---

# Design router

One skill that knows the others. Read the request, pick the skills that fit, and
use them in the order below. For non-interface work, the user can type
`/which-skill`.

Keep it proportional. A copy tweak needs `scope` and `copy`, not the whole
pipeline. Most requests match one row of the table plus the standards.

## 1. Check what is installed

Route only to skills that exist. Look in `.claude/skills/`, `.agents/skills/`
and `.cursor/skills/` in the project, the same folders under `~/`, and the
plugin skill list of the session.

If a skill named here is missing, say so once, name the skill, and give this
command. Do not install anything yourself.

```
npx skills@latest add officialunofficial/skills
```

Then continue with the skills that are present.

## 2. Standards on every interface change

Apply these without being asked. They do not need to be named in the request.

- `scope`: change what was asked, answer every item, keep what worked.
- `restraint`: build the smallest thing that does the job. Remove means delete.
- `reuse`: project components and tokens first, then a maintained library or a
  platform feature, then custom code.
- `copy`: short, plain labels in the interface.
- `defaults`: focus, hit areas, forms, loading states, dialogs, scroll edges, type.
- `color`: measured contrast, colour through role tokens, a real dark palette.
- `motion`: what animates, easing, durations, springs, reduced motion. When the
  change is an animation or the question is feel, use `emil-design-eng` for the
  decision and `motion` for the numbers.

The project's own conventions win over every skill here: its AGENTS.md,
CLAUDE.md, design tokens and style guide. Read them first. When two rules
conflict, follow the project rule and name the rule you followed in the report.

## 3. Route by intent

Rows marked [user] are user-invoked. The model cannot run them. Name the command,
say in one line what it does, and let the user type it.

| The request is about | Use |
| --- | --- |
| References or inspiration before designing | `gather` |
| A one-line motion or design brief that needs a full prompt | `blank-page` |
| Recreating a named site, screen, screenshot or design file | `match` |
| Choosing between directions, "try a few", "show options" | `prototype` (engineering) |
| A batch of small interaction experiments to keep or kill | `/sketchbook` [user] |
| Faux product UI, hero or feature-card art, bento grids, demo animation | `stageshow` |
| A character or mascot made from an object | `/avatar` [user] |
| An icon the set lacks, or a filled or morphing variant | `icons` |
| Choosing a library (charts, OTP, toasts, command menu) | `/pick-ui-library` [user] |
| Sonner toasts | `ask-sonner` |
| A new animation or transition on the web | `animate` |
| Animation, gestures or haptics in React Native or Expo | `animate-expo` |
| Gestures, springs, sheets, materials, an Apple-like feel | `apple-design` |
| Why an interface feels off; component polish | `emil-design-eng` |
| "Make it feel alive", "what should animate?" | `find-animation-opportunities` |
| "It feels slow", "too much animation" | `remove-animations` |
| A plan to fix motion across a whole app | `improve-animations` |
| The name of a motion effect | `animation-vocabulary` |
| How an existing animation or interaction works | `/deconstruct` [user] |
| A strict review of motion code | `/review-animations` [user] |
| Jank, dropped frames, a choppy animation | `animation-performance` |
| A measured trace of one slow interaction | `/frames` [user] |
| A web app that should feel native on a phone | `mobile-native` |
| Responsive layout, overflow, clipping, zoomed text | `viewports` |
| Worst-case data: long names, empty lists, huge counts | `break-ui` |
| Every variant and state of real components on one page | `/lab` [user] |
| Edges, gaps and radii off by a pixel or two | `/alignment` [user] |
| Keyboard access and focus order | `/keyboard` [user] |
| Colours, contrast, a dark theme | `color` |
| Labels, microcopy, status text | `copy` |
| A post, case study or design note | `prose` |
| Docs, a README, a spec, release notes | `technical-writing` (productivity) |
| Swift code | `write-swift` |
| A review of UI code for accessibility, forms and focus | `web-design-guidelines` |
| "Review everything", one ranked report across the set | `/audit` [user] |
| A review of a branch or PR against standards and spec | `code-review` (engineering) |
| Interface behaviour or logic that needs a test first | `tdd` (engineering) |
| A correction the user repeats, "make it a rule" | `rule` |
| Proof that a change works in the running app | `verify` |

When two rows fit, take the narrower one. `animate` beats `motion` for a new
animation. `match` beats `gather` when the user names one reference.

## 4. Order of work

For anything larger than a one-line fix:

1. **Before building.** Read the project conventions. Use `gather` when
   references matter and `match` when the user names one. When the direction is
   open, use `prototype` and let the user choose before the real build.
2. **While building.** Apply the standards in section 2. Add the one skill from
   the table that fits the work: `stageshow` for faux UI, `animate` or
   `animate-expo` for new motion, `icons` for a missing glyph. Use `tdd` when the
   change adds behaviour a test can pin.
3. **Before saying done.** Run `verify` in the running app, not from the diff.
   Add `viewports` when layout changed, and `break-ui` when the screen shows
   user or list data. Run `web-design-guidelines` on the changed UI files. Offer
   `/alignment`, `/keyboard` or `/frames` when the change touches spacing, focus
   or frame rate.
4. **After.** Use `rule` when the same correction came up twice. Use
   `code-review` when the user asks for a review of the branch. Offer `/audit`
   after a large change.

Scale the list to the change:

| Change | Skills |
| --- | --- |
| A label or message | `scope`, `copy` |
| A colour or token | `scope`, `color`, `verify` |
| One component | standards, `verify`, `viewports` if its size changed |
| A new screen or flow | all four steps |

## 5. Report the route

End with one line that names the skills used, any skill skipped and why, and any
project rule that won over a skill. Examples:

- "Used scope and copy. Skipped verify: the change is a string in a file with no
  running preview."
- "Used stageshow for the hero mock, then verify and viewports. Followed the
  spacing tokens in AGENTS.md over the defaults skill."

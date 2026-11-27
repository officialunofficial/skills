---
name: lab
description: "Builds a temporary page that shows every variant and state of real components at once, each linked to its source."
disable-model-invocation: true
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Lab

Build one development page where every variant and every state of the real components sits open at once. The user can then compare and tune them without clicking through the app.

## What a lab is

- It imports the real components. A copy drifts from the source, so a lab of copied markup proves nothing.
- Every state is visible without a click. States that need interaction are forced open.
- It is a development page. It never reaches production.

The engineering skill `prototype` explores new options for one idea. The values on the page come from `defaults`, `motion`, `color` and the project's tokens.

## Steps

1. **List the states.** Read each component and list its variants, sizes and states: rest, hover, pressed, focus, open, selected, disabled, loading, empty and error.
2. **Add one route.** Create one development-only route such as `/lab` that imports the real components. Copy [lab.js](lab.js) into the app and load it once on that route, in the browser only.
3. **Write entries only.** `lab.js` supplies the grid, labels, filters and controls. Wrap each state in a `lab-entry` that names its component, its state and the source line that renders it. Do not write a grid, labels or styles for the page.
4. **Force states open.** Render menus, popovers, tooltips and submenus open through their controlled props or `data-*` attributes. Hold a pseudo-class with `force` on the entry, for example `force="hover"`.
5. **Use one theme.** Show the app's current theme. Add the second theme only when the user asks for both.
6. **Add sliders on request.** When the user asked to tune values, add one `lab-tune` per custom property with its range.
7. **Open it.** Start the dev server and open the lab for the user. A route that the reply names but nobody opened does not count.
8. **Keep it out of the release.** Gate the route and `lab.js` to development, or delete both before release.

## The elements

```html
<lab-page title="Components" root="/Users/me/app">
  <lab-tune property="--radius-pill" label="Pill Radius" min="0" max="16" value="16" format="{}px"></lab-tune>

  <lab-entry component="Menu" state="Submenu Open" source="src/components/menu/index.tsx:42">
    <Menu open>...</Menu>
  </lab-entry>
  <lab-entry component="Button" state="Hover" source="src/components/button/index.tsx:12" force="hover">
    <Button>Save</Button>
  </lab-entry>
</lab-page>
```

- `lab-page`: `title`, `root` (the absolute project root that each `source` resolves against) and `editor` (the URL scheme that source links open, `cursor` by default).
- `lab-entry`: `component`, `state`, `source` (`file:line` relative to `root`) and optional `force` (`hover`, `active`, `focus`, `focus-visible` or `focus-within`).
- `lab-tune`: `property`, `min`, `max`, `value`, and optional `step`, `format` and `label`. It sets the custom property on the root element. Shift+C copies every moved value.

Entries and tunes are direct children of `lab-page`. Entry content stays in the light DOM, so the app's own styles apply.

Read the header comment of `lab.js` when you wire it into React, Vue or Svelte, need the TypeScript JSX declarations, or need an editor URL template. It holds the full attribute reference.

## Checks

| Rule | Broken | Replacement |
| --- | --- | --- |
| `lab-every-state` | The resting button only | Rest, hover, pressed, focus, disabled and loading |
| `lab-real-components` | Copied markup for each state | The real `Button`, imported |
| `lab-states-open` | A menu behind its trigger | `<Menu open>` with its submenu open |
| `lab-one-theme` | Light and dark side by side, unasked | The app's current theme |
| `lab-link-the-source` | An unlabelled grid | `Menu / Submenu Open` linked to `menu/index.tsx` |
| `lab-shipped-frame` | A hand-written lab grid and labels | `lab.js` loaded, only `lab-entry` elements written |
| `lab-open-it` | "Added `/lab`" | The lab opened for the user |
| `lab-not-in-production` | `/lab` live on the production site | The route gated to development |

## Reporting

When the skill runs as a review, write one finding per root cause:

```
file:line - [rule-id] what is wrong
```

Severity:

- `HIGH`: a lab built from copies, or a lab reachable in production.
- `MEDIUM`: a missing state, a state that still needs a click, or a hand-written lab page.
- `LOW`: an unlabelled entry, or a lab nobody opened for the user.

Close with a `Rule | Count | Severity` summary and a verdict: `Block` while any `HIGH` remains, `Approve` otherwise. Mark every state you could not render as `Not verified`.

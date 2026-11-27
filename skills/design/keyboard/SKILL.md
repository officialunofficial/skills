---
name: keyboard
description: "Walks a running page with the keyboard alone, records every focus stop and reports controls it cannot reach, see or operate."
disable-model-invocation: true
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Keyboard

Put the mouse away and walk a running page with keys alone. Record every focus stop in order, then report what the keyboard cannot reach, see or operate.

## Press the keys

Markup does not show focus order, so judge order, reach and operation only from keys pressed in the running page. A stop the walk did not press is `Not verified`. One unreachable control is a finding, however small the control.

`defaults` owns how the focus ring looks, dialog focus traps and accessible names. A failure there cites the `defaults` rule id. `verify` opens the running result. `lab` forces hidden states open.

## Steps

1. **Load the recorder.** Open the page in the state the user named and click nothing. Evaluate [tabstops.js](tabstops.js) in the page. It returns `unreachable` (pointer targets with no keyboard way in) and `positiveTabindex`, then records each stop as focus moves.
2. **Send trusted keys.** Use real input such as Playwright's `keyboard.press` or the operating system. A dispatched DOM `KeyboardEvent` never moves focus, so a walk with zero stops means the keys did not arrive.
3. **Walk forward, then back.** Press Tab from the top of the page until focus leaves it, then Shift+Tab back to the start. Read `window.__keyboard.stops`, call `window.__keyboard.highlight()` and take a screenshot.
4. **Check the walk** against the rules below: order, visibility, reach.
5. **Operate each control** with the keys its role expects.
6. **Open and close each overlay** from the keyboard.
7. **Remove something, then find focus.** Delete a row, dismiss a toast, collapse a section and submit a form.
8. **Report the walk.** Return the stops as a numbered list of role and name, with the screenshot that shows the `highlight()` numbers. Cite each finding by stop number and the key that failed.

## The recorder

Each stop has `stop` (its number), `where`, `role`, `name`, `tabIndex`, `ring`, `visible`, `onScreen` and `rect`. A stop with `lost: true` means focus fell to `body`, and `from` names where it was. `highlight()` numbers the stops on the page: blue has a ring, red has none. `clear()` removes the numbers and `dispose()` removes the recorder.

`name` is a rough guess. Confirm it in the accessibility tree before reporting a missing name.

## Rules

**Order.** Stops follow the reading order of the layout. A jump from header to footer and back breaks it, and so does any positive `tabindex`.

**Visibility.** Every stop shows a focus indicator on screen. Focus never lands on something hidden, such as a link inside a closed drawer. A stop with no name cites `defaults-name-icon-buttons`.

**Skip link.** When navigation sits before the main content, the first stop is a skip link to that content.

**Reach.** Every control the page shows is a stop. Compare the stops with the screen and with `unreachable`.

**Operation.** Enter and Space press a button. Enter follows a link. Space toggles a checkbox or a switch.

**Composites.** A menu, tab list, radio group, listbox or grid takes one Tab stop, and the arrow keys move inside it.

**Escape.** Escape closes the open menu, popover, sheet or dialog.

**Overlays.** Focus moves into an opened overlay, stays inside a modal and returns to the trigger on close. A failure cites `defaults-trap-and-return-focus`.

**Removal.** After a removal, focus lands on a neighbour, the container or the result. It never stays on `body`.

## Checks

| Rule | Broken | Replacement |
| --- | --- | --- |
| `keyboard-press-the-keys` | "The markup uses buttons, so it is reachable" | A walk recorded with Tab and Shift+Tab |
| `keyboard-order-follows-layout` | `tabindex="3"` on the search field | No positive `tabindex`, the field placed in reading order |
| `keyboard-see-every-stop` | Stop 7 focused with no visible ring | Stop 7 with the project's `:focus-visible` outline |
| `keyboard-no-hidden-stops` | Tab lands on links in the closed drawer | `inert` on the drawer while it is closed |
| `keyboard-skip-link` | Twenty header stops before the first result | A `Skip to Content` link as stop 1 |
| `keyboard-reach-every-control` | `<div onClick={openRow}>` | `<button onClick={openRow}>` |
| `keyboard-operate-every-control` | A switch that toggles on click only | Space toggles it |
| `keyboard-arrows-inside-composites` | Eight Tab stops inside one menu | One stop, arrows move between items |
| `keyboard-escape-closes` | A popover that closes on outside click only | Escape closes it and focus returns to the trigger |
| `keyboard-focus-survives-removal` | Focus on `body` after a row is deleted | Focus on the next row |
| `keyboard-numbered-walk` | "Keyboard support is patchy" | "Stop 12, Space does nothing on `Notifications`" |

## Reporting

When the skill runs as a review, write one finding per root cause, numbered, with the stop and the key:

```
1. file:line - [rule-id] stop N, key, what is wrong
```

Severity:

- `HIGH`: a control the keyboard cannot reach or operate, or focus lost to `body` after an action.
- `MEDIUM`: a stop out of reading order, with no visible ring or hidden off screen, a composite with a Tab stop per item, or an overlay Escape does not close.
- `LOW`: a missing skip link, or a report with no numbered stops.

Close with a `Rule | Count | Severity` summary and a verdict: `Block` while any `HIGH` remains, `Approve` otherwise. Cite the recorder's `where` value when you cannot find the source line. Mark content inside cross-origin frames as `Not verified`.

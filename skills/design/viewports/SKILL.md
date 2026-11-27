---
name: viewports
description: Renders one page at 320, 375, 768, 1024 and 1440 wide, at each side of every breakpoint, on a short landscape phone and at 200% text, then reports what overflows, clips or hides. Use after a layout change, when checking responsive or mobile behaviour, when the user names a phone or a width, or when a page scrolls sideways or cuts off text.
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Viewports

Render one page at a fixed set of sizes and measure each render. The measure finds sideways scroll, clipped text, small targets and controls that only hover reveals.

Render every width. A width that you reason from the media queries is a finding, because layout bugs live where the code looks correct. Run the sweep after any layout change, and whenever the user names a phone or a width.

Neighbouring skills own the rest. `verify` opens the result for the user. `alignment` owns alignment inside one render. `defaults` owns safe areas, hit areas and dynamic viewport units, so a failure there cites the `defaults` rule id.

Each rule ends with its rule id. Cite that id in a finding.

## 1. Read the breakpoints

Read the breakpoints from the CSS, the Tailwind config or the tokens. For each one, add the width 1px below it and the width 1px above it to the list in step 2. A sweep that skips those edges fails (`viewports-cross-each-breakpoint`).

## 2. Render each width

Set the viewport through device emulation. Take a full-page screenshot at each size.

| Width | Viewport | Touch |
| --- | --- | --- |
| 320 | 320 x 568 | Emulated |
| 375 | 375 x 812 | Emulated |
| 768 | 768 x 1024 | Emulated |
| 1024 | 1024 x 768 | Off |
| 1440 | 1440 x 900 | Off |
| Each breakpoint edge | 800 tall | Emulated under 1024 wide |

A layout judged from the code and not from a render fails (`viewports-render-every-width`).

## 3. Measure each render

Run [overflow.js](overflow.js) in the page at each width, through the evaluate call of the browser. It returns `{ viewport, pageOverflow, findings }`. Treat each result as a candidate until a crop at that width shows it.

- The page does not scroll sideways. A box may scroll inside itself (`viewports-no-sideways-scroll`).
- A box does not cut its text without an ellipsis or a clamp (`viewports-no-clipped-text`).
- A target under 24px cites `defaults-hit-area`.

## 4. Tap at touch widths

Tap through the page with touch emulated. Row actions, copy buttons and menus that appear on hover need a second way to appear (`viewports-no-hover-only-controls`).

## 5. Shorten the height

Render 812 x 375, a phone held sideways. Open each dialog, sheet and menu at that size. The content scrolls inside the overlay, and its actions stay reachable (`viewports-short-heights`).

## 6. Double the text

At 1024 wide, set the root font size to 200% and render again. Text wraps and its boxes grow, with no overlap. A layout that cannot grow because its sizes are in `px` gets the same id (`viewports-text-zoom`).

## 7. Report by width

Return one screenshot per width with the overlay numbers. Call `window.__viewports.highlight()` after the script to draw them. Then list the findings in the same order. Every finding names its width (`viewports-name-the-width`).

## Checks

Each row pairs a rule id with a broken line, the line that replaces it and the severity of a finding.

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `viewports-cross-each-breakpoint` | Checked at 375 and 1440 only | Also at 767 and 768, 1023 and 1024 | `MEDIUM` |
| `viewports-render-every-width` | "The grid collapses at `md`, so mobile is fine" | Screenshots at 320, 375 and 768 | `MEDIUM` |
| `viewports-no-sideways-scroll` | A `width: 400px` card at 320, with a 40px sideways scroll | `max-width: 100%` on the card | `HIGH` |
| `viewports-no-clipped-text` | `overflow: hidden` cuts a button label in half at 375 | The label wraps, or truncates with a way back | `MEDIUM` |
| `viewports-no-hover-only-controls` | A delete button behind row `:hover` alone | Shown at all times under `(hover: none)` | `HIGH` |
| `viewports-short-heights` | The `Save` of a dialog below a 375px screen, with no scroll | `max-height: 100dvh` with a body that scrolls | `HIGH` |
| `viewports-text-zoom` | `height: 32px` on a button that clips at 200% | `min-height: 2rem` with padding | `MEDIUM` |
| `viewports-name-the-width` | "The header overlaps" | "At 768, the header overlaps the search field" | `LOW` |

## Reporting

Write one finding per root cause, and name the width:

```
1. file:line - [rule-id] at 375, what is wrong (measured values)
```

When you cannot find the source line, cite the element that the script reports. Then add a `Rule | Count | Severity` summary. The verdict is `Block` while any `HIGH` finding remains, and `Approve` otherwise. Mark each width you could not render as `Not verified`.

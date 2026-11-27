---
name: alignment
description: Measures a running page for edges, gaps, centres and radii that miss by a pixel or two, judges visual weight, and returns a numbered report with proof.
disable-model-invocation: true
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Alignment

Check a running page for things that are out of line or out of balance. Measure the rendered ink, confirm each finding in a zoomed crop, and return a numbered report.

Measure lines, gaps, centres, and radii. Never estimate them. A miss of 1 to 4px is a finding, because it reads as a mistake while a 16px indent reads as intent. Visual weight has no number, so judge it from the screenshot and show the crop.

Related work belongs elsewhere: opening the running result to `verify`, comparing against a named reference to `match`, forcing hover, open, and error states to `lab`, moving a fix into the shared component to `reuse`, and rendering every width to `viewports`.

## 1. Open the shipped render

Open the page at the viewport it ships at, with a device scale factor of 2. Check each theme and each state the user named. Findings come from the running page, not from reasoning about where the CSS should put things (`alignment-measure-the-render`).

## 2. Run the measurement

Read the spacing scale from the project's tokens. Set `window.__alignmentOptions = { scale }`, then run [measure.js](measure.js) in the page through the browser's evaluate call.

It returns findings, each with a rule, the element, the measured values, and a rectangle. Each one is a candidate until step 3 confirms it.

## 3. Check the lines

Crop each candidate from the 2x screenshot and count the pixels. Drop any finding the pixels do not show.

- **Shared edge.** Text, icons, and controls that start a column share one x (`alignment-shared-edge`).
- **Even gaps.** Repeated siblings sit at one gap. A deliberate group break is at least twice that gap (`alignment-even-gaps`).
- **On scale.** Every padding, gap, and margin is a step on the project's scale (`alignment-on-scale`).

## 4. Check the centres

- **Ink centre.** Text in a control centres on its cap height and baseline, not its line box. Fix with `text-box: trim-both cap alphabetic` or by balancing the padding (`alignment-ink-centre`).
- **Icon with label.** An icon beside a label centres on the label's cap height (`alignment-icon-with-label`).
- **Optical glyph.** Play icons, arrows, and triangles carry their weight on one side. Nudge them and name the value, such as `--play-nudge: 1px` (`alignment-optical-glyph`).
- **Concentric radius.** A nested surface's radius is the outer radius minus the inset (`alignment-concentric-radius`).

## 5. Judge the weight

Look at the screenshot at 1x and name what the eye lands on first. Compare icon strokes with the text's stem weight, filled icons beside outline icons, and circles drawn the same size as squares. Circles and triangles need about 10% more size than a square to read as equal (`alignment-visual-weight`).

## 6. Report with proof

Copy [report.html](report.html) to `.alignment/<page>/index.html`. That folder is ignored by git and stays out of the source tree. Save the 2x screenshot beside it, write `report.js` in the shape the header comment of `report.html` shows, then open the page.

The report draws the numbered outlines and cuts each zoomed crop from the screenshot at runtime, so write data only. Custom markup or hand-cut crops are a finding (`alignment-shipped-report`). So is a finding with no measurement and no rect (`alignment-annotated-proof`).

## 7. Fix only when asked

The report is the deliverable. When the user asks for fixes, change the token or primitive behind each finding. Rerun the script and the screenshot, then report what cleared.

## Rules

Each rule pairs the broken case with its replacement.

| Rule | Broken | Replacement |
| --- | --- | --- |
| `alignment-measure-the-render` | "The flex container centres it" | Measured in the running page at 2x |
| `alignment-shared-edge` | Title inset 2px from its description | Both start on one ink line |
| `alignment-even-gaps` | Rows at 8, 8, and 12px | Rows at 8, 8, and 8px |
| `alignment-on-scale` | `padding: 6px` on a 4px scale | `padding: 8px` |
| `alignment-ink-centre` | Label ink 2px low in its button | `text-box: trim-both cap alphabetic` |
| `alignment-icon-with-label` | Icon centred on the line box, 1px low | Icon centred on the cap height |
| `alignment-optical-glyph` | Play icon centred by its box, looks shifted left | Play icon nudged 1px right, with a named value |
| `alignment-concentric-radius` | 16px panel in a 16px card at 8px inset | 8px panel radius |
| `alignment-visual-weight` | 2px icon stroke beside 1.5px text stems | Stroke matched to the text weight |
| `alignment-annotated-proof` | "The button looks a bit off" | Finding 3, 1.8px low, with the crop |
| `alignment-shipped-report` | Hand-cut crops in a page written from scratch | `report.html` copied, only `report.js` written |

## Reporting

**Severity.** `HIGH` is a miss visible at 1x on a primary surface, such as a heading column or a primary button. `MEDIUM` is a 1 to 2px miss, uneven gaps, a radius mismatch, a weight imbalance, or a hand-built report. `LOW` is an off-scale value that still renders aligned.

**Format.** One finding per root cause, numbered to match the overlay:

```
1. file:line - [rule-id] what is wrong (measured values)
```

Cite the element from the script when you cannot find the source line. Follow with a `Rule | Count | Severity` summary. The verdict is `Block` while any `HIGH` remains and `Approve` otherwise. Mark canvas, image, and cross-origin content as `Not verified`.

---
name: icons
description: "Draws the icons a project's set lacks, in that set's own style: measures stroke, grid, radii and padding from every existing icon, writes each new glyph in a form that can morph, and shows the whole set on one sheet. Use when the user says draw an icon for, we need a ... icon, custom icons, the set doesn't have a, match our icons, filled version, animate or morph this icon, icon sheet, or this icon looks off next to the others."
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Icons

Draw the icons a project's set is missing, in the style of that set. Measure the whole set first, write each new glyph so it can animate and morph, then read old and new icons together on one sheet.

## Measure before drawing

An icon reads as part of a set only when its stroke, radii, grid and padding match exactly. The sheet measures those values from every existing icon, and each new glyph follows them. A guessed stroke, radius or grid is a finding.

Sibling skills own the neighbouring decisions:

- `scope`: which glyphs to draw.
- `reuse`: the search of the set before drawing.
- `alignment`: optical nudges.
- `motion`: the curve, duration and reduced-motion fallback of an icon animation.
- `defaults`: accessible names.
- `copy`: visible labels.
- `color`: contrast.

## Steps

### 1. Draw only what the set lacks

Run `reuse` first. Search the icon package, the icon folder or the map that holds inline icons. Draw a glyph only when the set has none.

Add the glyph where the set lives, beside its siblings. An icon left in a feature file never gets reused.

### 2. Measure the whole set

Copy [sheet.html](sheet.html) to `.icons/[set]/index.html`. Keep `.icons/` out of version control and out of the source tree. Write `sheet.js` beside the page with every existing icon, as its header comment shows, then open the page.

- Mark logos and brand marks `brand: true`. Never measure, redraw or restyle them.
- The sheet derives the spec from every existing icon on the most common viewBox. Per kind, it records stroke, caps, joins, radii, grid step, padding, round overshoot and ink coverage.
- Copy Spec gives `icon-spec.md`. Save it beside the icons.
- Draw nothing before `icon-spec.md` exists. A spec measured by hand, from a sample or from memory does not count.
- With fewer than 3 icons on one viewBox, stop and ask for the reference set.
- An existing icon off the spec shows as an outlier. List it in the report and leave it. A redraw is a separate request under `scope`.

### 3. Draw on the grid of the set

Put every anchor point on the grid step of the spec. Curve handles stay free. Use `currentColor`, never a literal colour.

Within the step, keep straight stroke edges on whole pixels so they render sharp:

| Stroke | Centre line sits on |
| --- | --- |
| 2 | whole pixels |
| 1 | half pixels |
| 1.5 | quarter pixels, so the outer edge lands on a whole pixel |

When the set has a separate drawing per size, draw every size and run one sheet per size.

A set whose icons are only rects on whole pixels is pixel-style. Draw each glyph as a text grid first, then convert the grid to rects. Pixel sets skip step 5 and swap with the cross-fade in `motion`.

### 4. Correct what the eye sees

Keep separate parts at least one stroke width apart, and never under 1px. Closer strokes merge into one blot at 16px.

A round shape may pass the padding by the round overshoot of the spec and no further. Arrows and play shapes take the nudge in `alignment`, drawn into the coordinates. A circle drawn at the size of a square cites `alignment-visual-weight`. A play icon centred on its box cites `alignment-optical-glyph`.

### 5. Write every new icon in the morph form

Every new icon can morph into every other new icon of its kind. That works only when the icons share one structure, the morph form:

- Each icon has the same number of `path` elements.
- Each path is an absolute `M` followed by the same number of explicit `C` segments.

The sheet sets both counts from the most complex new icon and shows them as Morph Form. Bring a simpler icon up to the form as follows:

- Pad a shorter path with zero-length segments at its end.
- Write a straight segment as a cubic whose handles sit on its own ends.
- Close a stroke by returning to its start point, not with `Z`.
- Collapse an unused path to one point on another stroke, where it stays hidden.
- Start each path at its topmost anchor, leftmost on a tie.
- Order the paths longest first, so large strokes morph into large strokes.

Two icons that are one shape turned, such as back and forward, share one drawing. The swap rotates the whole icon, and the sheet marks the pair Spins.

To morph into an existing icon, add the morph form of that icon as a new icon with the same ink.

An optimiser that merges paths or converts shapes breaks the form. Turn off `mergePaths` and `convertShapeToPath` for these files.

### 6. Build outline and filled from one skeleton

Outline and filled variants share one skeleton and one morph form. The filled variant fills the paths of the outline and keeps its silhouette. Inner detail becomes a counter at least 1px wide, and a narrower counter is dropped. A fill cannot morph, so outline and filled swap with the cross-fade in `motion`.

### 7. Lint every icon against the spec

The sheet lints each new icon for viewBox, stroke, caps where ends are open, joins where corners exist, grid, padding, radii and more than 3 decimals. It also rejects transforms, ids, classes, inline styles, masks and clip paths.

Ink coverage compares outline with outline and filled with filled, inside the range the set already spans. A kind the set lacks shows `Not Verified`. Judge it by eye on the sheet.

### 8. Read the set on one sheet

The sheet sorts by name, so new glyphs sit among old ones, each with a badge. Style, Size and Dark Tiles set what the grid shows. Three review views each isolate one fault:

| View | What it does | What a fault means |
| --- | --- | --- |
| Pixels | Rasterises each icon at native size and enlarges it 3 times | Soft or doubled edges are a grid problem |
| Weight | Blurs the 48px icons by 2px, so only weight remains | A darker or lighter new glyph is too dense or too thin |
| Morph | Plays each new icon into the next of its kind on the curve in `motion` | A twist, a self-crossing or a flashing dot means the paths are out of order |

Click an icon to open its dialog. The Morph tab chains any icons, pasted ones included, and says whether each step spins, morphs as drawn or needs converting. A converted preview is a guess by the sheet, not the form to commit. Prompts copies the fix, the redraw or the morph-form request for the agent to apply.

Fix every finding and reopen the sheet until Findings is empty. Icons checked one at a time, or on a sheet written from scratch, do not count.

### 9. Match the project's icon component

Generate components on the project's existing icon API, with its props and file shape. Keep each path as its own element, so a caller can animate `d` or draw the stroke on. Set `aria-hidden` on a decorative icon.

Add a hover, active or swap animation only when the user asks, and run it through `motion`. An icon that is the only content of a control cites `defaults-name-icon-buttons`. Contrast cites `color-ui-contrast`.

## Checks

| Rule | Broken | Replacement |
| --- | --- | --- |
| `icons-only-missing` | A new `SearchIcon` when the set has one | The `SearchIcon` of the set |
| `icons-in-the-package` | `ReceiptIcon` in a feature folder | `ReceiptIcon` beside its siblings in the set |
| `icons-measure-the-spec` | A spec measured by hand from 3 icons | `icon-spec.md` copied from the sheet, then the path |
| `icons-on-the-grid` | `M5 2.3` with `stroke="#111"` on a 0.25 step | `M5 2.25` with `stroke="currentColor"` |
| `icons-pixel-grid-first` | A pixel glyph drawn as smooth paths | A text grid converted to rects |
| `icons-open-gaps` | Two 1.5 strokes 0.5 apart | The strokes 1.5 apart |
| `icons-morph-form` | A `circle` element beside a path with relative commands | 3 paths, each `M` and 5 `C` segments |
| `icons-one-skeleton` | A filled icon drawn as a new path | The paths of the outline, filled |
| `icons-lint-the-spec` | `transform="translate(0.5 0.5)"` on a 2px stroke | The stroke and padding of the spec, no transform |
| `icons-one-sheet` | The new icon screenshotted alone at 24px | `sheet.html` copied, only `sheet.js` written |
| `icons-match-the-api` | A feature-file `svg` with its own size prop | The project's icon component, `aria-hidden` when decorative |

A missing glyph added to the set is not a finding in `reuse`.

## Reporting

When the skill runs as a review, write one finding per root cause. When the miss is the work and not a file, cite the request:

```
file:line - [rule-id] what is wrong
request 2 - [rule-id] what is wrong
```

Severity:

- `HIGH`: a glyph drawn with no spec, or a duplicate of a glyph the set already has.
- `MEDIUM`: an off-grid icon, a pixel set drawn as paths, closed gaps, a failed lint, an icon off the morph form, a second skeleton, a missing sheet, a file outside the set, or a component off the project's API.
- `LOW`: a morph that twists or flashes on the sheet.

Close with a `Rule | Count | Severity` summary, then the existing outliers as a separate list, then a verdict: `Block` while any `HIGH` remains, `Approve` otherwise. Mark a sheet you could not render as `Not verified`.

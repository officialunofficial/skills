# Rehearse

Contents:

- Prove the still first
- The host's own controls
- Film
- Lines that are never intentional
- Other film lines
- What to watch
- The last pass

A dress rehearsal: run the whole demo at real speed and watch it as the audience will. Read every image you make, and confirm that the page you filmed runs the code you wrote.

## Prove the still first

Render the opening and the payoff at both shipping widths, beside the gold at shown size. The reduced-motion poster is a separate frame, and it must work as the only frame. Ask the still questions in `verify.md`, then:

- Can the viewer find the focal object and what changes before any branding or copy?
- How does the quality (hierarchy, density, spacing, crop, material) compare with the gold? Judge that apart from whether every object in the brief is present.
- Ask the same of the busiest mid-story frame and of every resting state that changed.

A clean tool report does not close a composition question.

## The host's own controls

A demo lives in a page with a picker, playback buttons and labels, and the viewer judges those too. `scripts/layout.mjs` checks ordinary UI outside a Stage, including the inner crop of a bento tile (`nested-composition-crop`):

```sh
node scripts/layout.mjs "[url]/?example=hero-demo" --select .pg --width 390 --report shots/host-layout.json --screenshot shots/host-layout.png --strict
```

Run it on the viewer page, the direct scene route and the real destination page at its real width. It reports moving geometry as incomplete, not as passed. Watch each control at rest, on hover in and out, pressed, focused, with a changed label, and interrupted in mid-transition.

## Film

`scripts/film.mjs` opens a page in headless Chrome and shoots the stage at a fixed interval into one contact sheet at true size. It prints console and `[stageshow]` warnings such as loop seams and missing targets. `--help` lists every flag.

In a host project, copy `scripts/` beside `kit/` and run `npm i -D playwright-core` (and `postcss` for the CSS check).

In the playground, film the direct `?capture=[name]` route, because the ordinary viewer wraps the scene in an iframe. On a site, film the real page URL.

```sh
node scripts/film.mjs "[url]/?capture=hero-demo" --out shots/hero.png --every 1000 --count 18
node scripts/film.mjs [url] --out shots/still.png --still                         # one clean image of a still
node scripts/film.mjs [url] --out shots/phone.png --width 390 --every 2500 --count 6
node scripts/film.mjs [url] --out shots/drop.png --at drop --every 50 --count 24  # one beat, frame by frame
node scripts/film.mjs [url] --out shots/zoom.png --zoom 380,40,240,120 --still    # close-up, in stage design px
node scripts/film.mjs [url] --out shots/hover.png --hover --every 300             # play="hover": rest, hover, leave
node scripts/film.mjs [host-url] --select "#feature-demo" --report shots/report.json --strict
```

| Topic | Detail |
|---|---|
| Selection | Film finds every visible `.ss-stage`. `--select` narrows. `--at` and `--zoom` need one stage |
| Marks | Call `act.mark('drop')` at a beat and film with `--at drop`. Never guess delays |
| Close-ups | `--zoom x,y,w,h` is in stage design pixels. `--zoom target:[name][,pad]` follows a `data-target` on every frame |
| Hover stages | `--hover` films rest, hover and the settle after leaving. The rest frame must stand as a still |
| Looks and widths | `--dark` films the dark theme. `--width 566` suits a 550 column. `--slow 6 --every 40` samples a landing or press closely |
| Jumps | Film records geometry on every animation frame and reports `jump:` and `drift:` candidates with timestamps. Mark an intentional step narrowly with `data-snap`. `node scripts/jumps.mjs "[url]/?capture=[name]" --ms 30000 --report shots/jumps.json` runs a longer scan |
| Coverage | An empty, short or gapped recording is `inconclusive`, exit 2. A gap is over 1.6x the typical interval, or an interval over 40ms |
| Reports | `--report [path]` writes JSON with `status`, `exitCode`, and `coverage`, `findings` and `manual` per stage. `--strict` exits 1 on candidates. Exit 3 means persistent dev reloads. `no-issues-detected` is not approval |
| Class clashes | `node scripts/class-clash.mjs [demo folders]` checks overlapping class namespaces. A scoped `.row` is fine and an unscoped one is not |

## Lines that are never intentional

Fix the cause of each and film again. `film.mjs --gate` ends `rehearsal passed` only when all are at 0. Clearing a line by hiding, removing or marking the thing it points at (`data-crop`, `data-snap`) is a bug.

| Line | Meaning |
|---|---|
| `framing:` | A gutter, bleed, crop or window shape that `framing.md` forbids, a hero floating whole, a popover against an edge |
| `cut by the crop:` | An action or chip sliced by the stage edge |
| `tight stack:` / `loose stack:` | A title on its subtitle with under 3px of ink between, or drifting past 10px. 4 to 6px is right |
| `tight mark:` | A status dot within 5px of the avatar or text, or outside its row. 6px clear is right |
| `tight inset:` | Words under 8px from the edge of a window, card or row. 12px is right |
| `tight control:` | A button or chip with under 8px to the field, line or card edge above it |
| `skeleton ladder:` | At realistic fidelity, a list of 4 or more rows where the wordless rows (at least 3) outnumber the worded ones |
| `onion skin:` | See-through fills that overlap at rest |
| `kit override:` | Your CSS reshaping the geometry of a kit part |
| `unit wrapped:` | The unit of a stat on its own line |
| `clipped glyph:` | An icon drawn past its box |
| `loose list:` | Rows spread out to fill a pane |
| `fat row:` | A one-line row three times taller than its words |
| `empty pane:` | A void under the content of a pane or screen |
| `emoji icon:` | An emoji where an icon belongs |
| `anchor drift:` | An open popover that moves as its list changes height |
| `uneven padding:` | A card or tile whose content sits about a third closer to one edge than the side inset |
| `uneven inset:` | A bar, pill or row of controls whose children sit much closer to one end |
| `uneven gutters:` | A window or panel in a tile much closer to one side |
| `mixed icons:` | Filled and outline glyphs side by side in one nav, list or toolbar |
| `invented mark:` | A one-letter tile in a brand colour beside the name of a real company |
| `avatar alignment:` | A body under an avatar row that starts under the avatar instead of at the edge of the name |
| `spills its slot:` | Content that runs past the width it was laid out in, or closes the gap of its row |

A `[stageshow] selection drift` warning also fails the gate.

## Other film lines

These are candidates to judge. Their rules are in `craft.md` (`touching`, `tight lines`, `lopsided`, `uneven`, `near-tangent`, `half-pixel glyph`, `squeezed`) and `motion.md` (`covers`, `dashed edge resizes`, `handoff shift`, `settle snap`, `fly size`, `hard edge`, `appears, then moves`, `near-empty frames`, `lands on a transform`, `steps in its box`). The rest:

| Line | Meaning and fix |
|---|---|
| `clipped:` | A mark sliced by a container edge inside the stage. Fix it, or mark the container `data-crop` only when the crop is deliberate |
| `unclipped:` | The page decides the crop. Give the stage `overflow: hidden` |
| `double corner` | Two rounded clips share an edge with different radii. Give the corner to one |
| `appears with no entrance`, `vanishes with no exit` | Film each appear and disappear at 50ms, because a sampling gap can hide one. For intentional instant typing feedback, put `data-typing` or `data-snap` on the exact changing node |
| `shrunk, not laid out for the phone` | The type reads small at that width. Give the scene a `compact` |
| `grown past the design size` | The scene reads large |
| `small text: X renders at Npx` | Text under 10px, checked at widths under 600 |

A pen tip that intentionally leads a draw carries `data-lead`.

## What to watch

- **Framing first.** Film the still and clear every `framing:` and `cut by the crop:` line before motion work. After you move anything, film the whole loop again.
- **Every frame at the real width**, including the figure before it has loaded.
- **Measure.** Compare computed styles across the page: one shadow, one plate, one radius set. Sample a morph on every animation frame, not from a sheet.
- **The loop, end to end.** Film one full loop plus the start of the next. Investigate every `loop seam` warning.
- **Text and glyphs.** Inspect pixels at `--slow 4` after a move. A compositing layer is a possible fix, not proof that the pixels stayed still.
- **The whole drag.** Watch hover to settle at speed, then stepped. The surface never lifts before the press. To track the hotspot of the hand through every transform, add a temporary zero-size child at the grip point and let the browser project it.
- **Overlays land.** Highlights, selections and markers sit on the thing they describe at every scale.
- **Crops explain themselves.** Every edge where screen meets stage fades, bleeds with intent, or is a real window edge.
- **Edges and corners.** Zoom into hover fills and selected rows. Rounded corners stay intact under the `overflow: hidden` of a parent.
- **The narrowest host.** Film the whole loop at 390, and at the width the brief names, and read it as closely as the wide pass.
- **Every look that the request names**, filmed separately.
- **The host.** The demo works in the real page at every shipping width. Page backgrounds stay in the host. A component brings no full-page wrapper.
- **Reduced motion.** `--reduced` shows the poster, still and complete. Toggle the preference during playback and back.
- **Live pacing.** The virtual clock proves geometry, not frame rate. Log rAF timestamps against the transform on the real page. Repeated poses and then a jump mean a clock bug. Pause, offscreen, a hidden tab and a finished `once` scene stop their work. Say which browser and device you checked.
- **Typecheck.** Run the typecheck of the host (`npm run typecheck` in the skill folder). Report unrelated failures separately.
- **Blueprint grid.** Lines sit at `--ss-grid-x` and `--ss-grid-y`. Set them on the Stage so a window edge lands on a grid line.

The tools cannot sign off everything. A contact sheet misses a one-frame flash, and a scan does not know whether a morph, a story or a gesture is right. Watch playback at speed, slowed transitions, the loop plus the next start, an interruption, reduced motion and a return from offscreen. Watch again after the final edit. The Phone control of the playground changes width but not touch, so check touch on a device or with input emulation.

Then put your sheet beside the sheet of the closest gold. Is this instantly a real product, quiet, with one clear story? Iterate until it is.

## The last pass

1. Answer `verify.md` from frames.
2. `--gate` passes on the wide loop, the phone loop and `--states`.
3. A fresh-eye review (`review.md`) returns nothing.
4. `REHEARSAL.md` sits beside the component. It lists the widths, looks, interactions and stages captured, and the cases not captured.

An empty, late or gapped capture is inconclusive, not a pass.

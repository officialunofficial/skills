# Framing

Contents:

- The rules
- The layouts
- Recipes and shadow tokens
- Fades
- Small formats and the page
- Phones
- Checks

How the screen sits in its space decides whether it reads as a product shot or as a screenshot in a box. Decide the framing before you build the screen: a crop needs nothing past the crop, and it sets how big the type must be.

The layouts are recipes. A whole window with even gutters is valid when its contents read and the brief asks for it.

## The rules

**Subject**

1. Use one hero and at most one or two satellites that carry the point (`examples/static-card`).
2. Keep what identifies the product: a title, the real chrome, the rows that give the action a reason. A logo and nav are optional. Crop around the story.
3. The medium picks the first layout: corner bleed for a hero beside copy, pinned bottom bleed for a card or tile, a phone pinned from the top. If it does not hold, try a second layout from the table.

**Crop**

4. Crop only filler. The payoff, the action, what the cursor touches and every real word stay whole. A list, diff or terminal may run one line off a bled bottom edge. Remove a placeholder action that the crop would slice. If the story does not fit, change the stage size or the layout. A button, chip or shadow sliced by the stage edge is the usual fault.
5. Crop 10 to 40% of the hero off stage. The window or phone fills at least two thirds of the stage width and runs off an edge. Labelled controls stay whole. Shapes that read when cut (a card, a slider track, a row of avatars) run off by a third or more.
6. The stage masks everything (`overflow: hidden`), with one rounded corner per edge.
7. A window keeps the shape of its device. Whole, it is 1.25:1 or wider. Bled, the visible part is at least square. Fix shape by crop or layout, never by squashing.
8. What the story opens stays in frame, a gutter from every edge on every frame. Place the trigger so the overlay has room.

**Gutters**

9. Use one gutter, measured in the final crop after any wrapper. The gutter is the inset of the hero from the stage edge, and every other edge distance in the frame matches it. The exception is a satellite that straddles in the wider column. A phone counts as a satellite.
10. Every edge distance is a full gutter or well past it. Crossing an edge by under 24px, or stopping a few pixels short, is a mistake. Content near the bottom of a container follows the same rule.
11. On a coloured stage, inset the hero 8 to 20% from the sides and run it off the bottom, so the ground frames it on three sides.
12. Leave no dead corners, at rest or anywhere in the loop. Fix the crop or layout first. Add a satellite only when it has a role. Fill a reserved column from the first frame.
13. A small illustration may need more air than the app itself.

**Satellites**

14. A satellite straddles the edge of the hero, about half outside. It never sits fully inside or floats apart. When it sits fully outside, tie it back with a 1px leader that ends in a dot.
15. A satellite covers chrome, not content. Straddle where the window has a sidebar, header or margin.
16. Two satellites are two kinds, not a stack: a card and a small system object (a notification at true size, a chip, a receipt). Two cards of one width on one edge read as a pile, and film flags them as `framing: twin satellites`. A system banner sits where the system puts it, small, with the system shadow. When the second object only points at something, use an annotation with a connector (`annotations.md`).
17. Anchored UI (a popover, menu or toast) is not a satellite. It sits where the product would put it.
18. Related surfaces get different jobs and weights. The result sits in the quiet margin of the hero and never hides the settings, trigger or payoff.

**Depth**

19. Depth is distinct: `--ss-shadow-satellite` on a satellite that sits on the hero, `--ss-shadow-ground` for a lone surface, a hairline on light edges. Put the shadow on the outlined shape, never on a wrapper (`examples/story`).
20. Start flat and frontal. A tilt must beat the straight version at final size. Get depth from shadow, z-order, scale and opacity. Use perspective only when asked.

## The layouts

| Layout | Hero | Satellite | Use for | Example |
|---|---|---|---|---|
| Pinned, bottom bleed | Inset 8 to 12% left, right and top. 15 to 35% past the bottom. Centred | Optional, straddling a side | Feature cards and bento tiles (first choice) | `static-card` |
| Corner bleed | Inset 10% top and left. 15 to 35% past right and bottom | Straddling the left or bottom edge | Heroes beside copy (first choice) | `hero-demo` |
| Stage with gutters | Inset 8 to 20% each side on a coloured stage, off the bottom | Straddling one side, hero stays centred | Brand moments | `raycast` |
| Satellite focus | Cropped hard, mostly context | Large, 30 to 40% of hero width, straddling, carries the story | One small thing: a notification, a receipt, a diff | `share` |
| Wide hero | A window of 900 to 1100px at 1:1, inset top, off the bottom and often both sides, realistic fidelity | A card or thread on its lower edge | Full-width homepage heroes | `linear` |
| Row of windows | Three or four at one height, the outer ones off both sides | None | Agents, tabs or sessions side by side | `window-row` |
| Device pair | Desktop inset top and left, about 75 to 80% wide, off the bottom | Phone straddling the right edge, about a third outside, top in the upper half, present from frame one. Use `LockScreen stack="top"` if its bottom is cropped | Cross-device stories | `device-pair` |
| Many of one | A grid of one small thing at one size, off every edge | None. One tile in focus by depth (hero shadow, accent ring), the only one with words | Previews, deploys, templates: scale shown as repetition | `many-of-one` |
| Fade crop | A window inset top and sides, fading out over its last third | Optional | A stage edge would cut the window at an arbitrary line | `fade-crop` |
| Close-up | The whole window scaled 1.3 to 1.6x, chrome included, inset top and sides, off the bottom, the subject row whole | None | A feature card about one control | `close-up` |
| Panel over product | The product inset top and left, off the bottom, its focal control whole | A settings panel straddling the right edge over the margin, never over the form. One leader in neutral ink from the panel edge to the thing it changed, through empty ground | A setting and its effect | `panel-annotation` |
| Overlapping windows | A window inset top, off the bottom, its words clear of the stage edges | A smaller card with no chrome in front. Its edge lands on a structural line of the window, and it covers only filler | Two views of one event | `overlap` |
| Stacked cards | Two components at one width and left edge, 12px apart, centred, the lower one off the bottom | None | A setting over the detail it drives | `stacked-cards` |
| Opposite corners | Copy bottom-left at the tile inset. The product in a panel hung off the top-right corner, its words clear of the cut | None | Bento tiles with a line of copy | `opposite-corners` |
| Tilted stack | Three same-size cards in one cell at -6, 4 and -2 degrees, offset 12 to 20px. The straightest is on top and is the only one with words | None | Paper: receipts, tickets, cards. The one place tilt pays | `tilted-stack` |
| Corner chip | A window inset top-left, off the bottom | A small pill centred on the corner of the window, half outside, over chrome only | One live fact about the whole product | `corner-chip` |
| Monochrome row | Three windows at one height, whole across, grayscale, faded at the foot by a mask | None | Customers or integrations whose brand colours would fight | `monochrome` |

## Recipes and shadow tokens

Position the hero with plain CSS inside the `Stage` render. Reserve a wider column so the satellite straddles the hero edge evenly: the gutter plus half the satellite width.

```tsx
<Stage width={656} height={340} initial={{}} className="my-well">
  {() => (<>
    <Window url="dashboard.northwind.co" className="hero" style={{ position: 'absolute', left: 129, top: 24, width: 720, height: 420 }} />
    <div className="satellite" style={{ position: 'absolute', left: 24, top: 150, width: 210 }} />
  </>)}
</Stage>
```

```css
.my-well .ss-stage { overflow: hidden; background: var(--ss-well); border-radius: 12px; }
.my-well .hero { box-shadow: var(--ss-shadow-hero); }
.my-well .satellite { box-shadow: var(--ss-shadow-satellite); border-radius: 10px; background: var(--ss-surface); }
```

Every theme sets these shadow tokens (`kit/stage.css`):

| Token | Use |
|---|---|
| `--ss-shadow-hero` | The one shadow for the hero windows of a page |
| `--ss-shadow-window` | The default of `Window`. Quieter, for a window that is not the hero |
| `--ss-shadow-satellite` | Tight on purpose, because a wide blur smears on a white window |
| `--ss-shadow-ground` | A hairline and a long faint fall, for a small window or card on the ground |
| `--ss-shadow-float` | Popovers |
| `--ss-shadow-card` | Small raised cards |
| `--ss-shadow-lift` | A carried thing |

## Fades

Fades are for moving or stacked content: a 32px edge mask on a sliding track, or the last 25 to 30% of a stack or chart. Use `.ss-fade-b` and `.ss-fade-r`. Their length is `--ss-fade`, 64px by default, so set `--ss-fade: 32px` for a track.

One crop may fade: a window at its foot. The top and sides stay whole and hard-edged. The fade covers the last third, with only filler under it. Fade with a mask, never a colour overlay, so the window dissolves into whatever it sits on. Never fade a side, the focal content, or more than one window in a scene.

## Small formats and the page

- **The page is the ground.** "White page" means a transparent stage: no plate and no panel behind the device. The window of a hero bleeds or fills. Whole and centred with air on four sides, it floats.
- **Unframed is the developer's call.** When asked for no framing, set `unframed` on the Stage and drop the ground. The window, card or phone sits whole and centred, with an even margin at least as deep as its shadow. Never choose this yourself, because a floating window is the fault this file exists to fix.
- **`compact` is a second design.** Every demo that can sit in a phone column gets one at the column width: 358 in a 390 viewport. Switch it on below the host width where the wide design stops fitting, for example `compact={{ below: 560, width: 358, height: 320 }}`. Switch composition on `layout`: crop closer, drop or stack a satellite, keep action and payoff whole. A card that already fits at 358 needs none.
- **Small formats crop harder.** A 400px card holds a third of a dashboard at full size, not all of it at a third.
- **The stage is the shot.** The tile is cut to the shape of the stage, and the stage fills it edge to edge. Never box a stage inside another ground.
- **Size the design for the slot.** A lone card in a 680px column wants 500 to 560 wide, so its text reads at 15 to 20px.
- **A lone phone in a column of figures** keeps the column width, centred at design size on the ground of the stage.
- **A moved window keeps its bleed.** After any move or resize, check again what the crop cuts and what overlaps, remove sliced placeholder actions, and film the whole loop again.

## Phones

- A satellite phone starts at 40% of the visible window width and is at least 220px wide. Let it run off the bottom instead of shrinking it.
- Notifications stay at true iOS proportion (Live Activities excepted). A phone so small that its notification needs enlarging is too small.
- A phone cropped at the top loses its status bar and nav bar together. The crop falls inside the content below the nav, never between the island and the nav.
- In a 400px host a phone is cropped: pinned a gutter from one edge, off the other, screen at 1:1, stage a little taller than wide. It is never whole (`examples/phone-touch`).
- A banner is native width and never cut. A notification spans the screen minus 18pt each side, at the scale of the phone. Compose a side-cropped phone so the banner shows whole. Film flags a cut banner as `cut by the crop`.

## Checks

`film.mjs` prints `framing:` and `cut by the crop:` lines on every shot. Clear them on the still before any motion work, or say why a line is deliberate. Film judges boxes in flight where they settle. Under a `Camera`, it judges the wide shot as usual, skips moving frames, and judges a settled zoom against the crop of the camera.

Ask of the still:

- Is the top-left of the hero visible?
- Is each bleed a deliberate crop and not a sliver?
- Does each satellite connect to its hero with clear depth?
- Is a faded window faded only at its foot, over filler, with a mask?
- Is the phone readable at the real width of the host, and does a wide scene have its `compact` design?

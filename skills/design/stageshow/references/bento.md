# Bento

Contents:

- The rules
- Kinds of tile
- Layouts
- Planning a grid

A bento grid is one picture made of tiles, not five demos side by side. Most of its quality is decided before any tile is built: which tiles show UI at all, which one is the hero, and what sits beside what. A grid where every tile is a cropped window reads as generated, however well each window is made.

These are starting recipes for mixed feature grids. Framing of a single tile is in `framing.md`.

## The rules

1. **Not every tile is UI.** About a third to a half of the tiles show product UI. The rest are other kinds (table below).
2. **One hero.** One tile is bigger (two columns or two rows) and carries the richest picture or the main idea. Equal tiles need a clear difference in content and weight.
3. **A UI tile shows one thing, not a window.** Crop to the single component the tile is about, at real size or larger, so a third of the tile can be one control. Window chrome appears at most once in a grid, on the hero.
4. **Neighbours contrast.** Alternate kinds like a checkerboard, across and down: a picture beside a number, dense beside calm. Two window crops never sit side by side.
5. **Big type is a tile.** A stat tile holds one real number at display size (48 to 72px as shown), a short lead ("Up to"), a one-line label and at most one coloured glyph. A short statement in large type is a tile too. Use real figures, never "10x" filler. The number sits close under its copy or fills the tile. A stat pinned to the bottom of a tall tile under a void reads as missing content.
6. **Copy is short and outside the picture.** A title of one to four words or one sentence, with at most one supporting sentence. Two patterns work: a bold lead with a gray continuation at one size ("**Stay in sync.** Your files stay up to date."), or a large title alone. Tile copy is page type at 17 to 24px, never the 12px of the UI inside the tile.
7. **One frame, varied contents.** Tiles share radius, gap, padding and copy position (all top or all bottom). Pick one family: rounded tiles on a gap, or a ruled grid with fine lines and no gap. The gap equals the inner padding of the tiles or a clear fraction of it. Align left-led UI and diagrams to the copy gutter. Do not centre each by habit.
8. **Use the tile edge deliberately.** The outer tile owns the bleed. An inner fixed-width Stage must not slice a window halfway across a wider tile and leave a blank strip. Measure the picture slot and match its width at every breakpoint. `scripts/layout.mjs` reports this as `nested-composition-crop`. A UI fragment with no chrome can dissolve into the tile ground. A solid window crops at a clear boundary. The boxed failure is a whole screen shrunk until it is unreadable, not a margin.
9. **Say each thing once across the set.** No real string, avatar, colour mark or chrome repeats from tile to tile.
10. **Compose the grounds together.** A quiet feature grid can share one surface, with one photo, accent or inverted tile as punctuation. An expressive hero grid can use several grounds when their lightness, temperature and saturation make a rhythm. Keep neighbours distinct and give one tile the lead (`backgrounds.md`, `examples/hero-grid/`).
11. **Give motion one place to lead.** In a supporting grid, a tile does one small thing: a number ticks, a bar fills, a button settles. It plays once as the grid scrolls in, staggered 80 to 120ms across tiles in reading order, or on hover for that tile alone. A hero grid can give its lead tile a short cursor story while the others hold still.
12. **Show at 1:1, one Stage per tile.** Each picture is its own `Stage`. The copy is page HTML beside it, never inside the stage. Never wrap the whole grid in one Stage, because that scales every tile's type down with the grid: a 1000px grid in a 630px column draws 15px titles at 9.5px. Measure the picture slot, use that native width for a bleeding Stage, and recompose its contents for compact slots.
13. **Narrow, it recomposes.** Keep two columns only while each tile stays readable and deliberately framed. An article column of about 550px may hold two. A phone column usually stacks, hero first. Pick the breakpoint from the content. Important text stays at least 10px at a 320px host.
14. **A stat is one line.** The number and its unit sit together and never wrap. Size the number to the tile with the unit on (`white-space: nowrap`), or move the unit into the lead line. Film names the fault `unit wrapped:`.

## Kinds of tile

| Kind | What it holds |
|---|---|
| One component | A single control or panel at real size or larger, cropped by the tile |
| Hero UI | The one tile with a real screen: a window or phone, cropped per `framing.md` |
| Stat | One big number, a lead, a label, maybe one coloured glyph |
| Statement | One sentence in large type, with a coloured icon beside or above |
| Object | A product, a card, a chip, an isometric drawing |
| Diagram | An abstract picture of what the feature does: a grid, a heatmap, nodes and lines |
| Collection | Logos, app icons, file tiles, emoji: many small marks that bleed off |
| Photo | A real licensed photo with type over its quiet part |

A grid of five usually wants one hero UI, one or two components, one stat or statement, and one object, diagram or collection.

For a photo tile, never draw a scene in SVG or CSS to stand in for a photograph. It reads as generated. With no licensed photo, pick another kind. A landscape photo rarely fits a tall tile with copy on top. An illustration in its place is either purely graphic (a pattern, a motif) or drawn in smooth continuous curves, and it holds still.

## Layouts

| Layout | Shape | Use for |
|---|---|---|
| Hero and strip | A row of 2/3 + 1/3, then three equal tiles | The default for five or six features |
| Staggered pair | Two columns, tall and short tiles alternating, offset between columns | Four to six claims with photos |
| Even grid | 3 x 2 equal tiles | Only when every neighbour is a different kind |
| Big square | Four columns, a 2 x 2 hero, small tiles round it | Many products, one flagship |
| Ruled | One rounded container, 1px rules, no gaps, mixed spans | Technical or developer pages |

Every width is its own design. Check the grid at each width it will meet, down to an article column (about 550, so half tiles near 270). At each width every picture lines up with the copy of its tile: left edge on the copy gutter, and a matching gutter on the right or a clear crop off the right or bottom. Never centre a picture that is about as wide as the tile, so that it touches both edges or loses a few pixels to each.

## Planning a grid

Write the tile list before you build anything:

| Tile | Span | Kind | The one thing | Words |
|---|---|---|---|---|
| Inbox | 2 x 1 | Hero UI | One conversation arriving, selected | "Shared inbox" + one sentence |
| SLAs | 1 x 1 | Stat | "14m" left, in the warning colour | "Never miss a reply." |
| Assign | 1 x 1 | Component | The assignee menu, Maya checked | "Assignments" |
| AI drafts | 1 x 2 | Component | The draft reply and its Send button | "Drafts that sound like you." |
| Integrations | 1 x 1 | Collection | App marks bleeding off the right | "Works with your tools." |

Check the plan against rules 1, 2, 3, 4 and 9: how many tiles are UI, which is the hero, whether any tile sits beside the same kind, whether any real string appears twice. Then inspect the built grid and each crop at the widest and narrowest host. A good tile can still be the wrong neighbour.

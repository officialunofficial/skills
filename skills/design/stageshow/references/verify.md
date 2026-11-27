# Verify

Contents:

- Gate
- Framing
- Hierarchy and density
- Motion
- Polish
- What you see, what you do
- Hand over

The last pass. Answer every question from a frame you looked at, never from the code. Fix the largest visible failure first, film again and return to the top. Repeat until every answer is yes. The rules are in `framing.md`, `craft.md` and `motion.md`.

## Gate

- Does `film.mjs [url] --gate` on the wide loop end `rehearsal passed`? For a still, use `--still --gate`.
- Does it pass at `--width 390`, and at the width the brief names?
- Does `--states --gate` (one sheet of the opening, every mark settled, and the end) show nothing you would send back?

## Framing

Framing comes first, because nothing else matters when it is wrong.

- Is there one gutter, and does the window or phone bleed off at least one edge, or sit whole because the brief wants that?
- Is anything with words on it, or anything the eye needs whole, cut by the crop?
- Is the ground the page the brief named, with no plate behind the device on a white or dark page?
- Is any corner of the stage empty for no reason?
- Are the panes full: no void under a list (`empty pane:`), rows at their own pitch (`loose list:`)?
- On a phone: is nothing under the island, does a sheet start below the status bar, and does a cropped phone lose status bar and nav together?

## Hierarchy and density

- Put the still of the closest gold beside yours and say the one difference. Is yours the sparser, flatter or smaller one, and why?
- In a still, is the subject real words and values, with bars only beside it and on what the crop cuts?
- Are label and value both words or both bars?
- Are named avatars coloured, with gray discs only for filler?
- At realistic fidelity, does a list of six or more rows have at most as many placeholders as real rows?
- Does the heaviest mark sit on what the story is about?
- Does a date range have air between weeks, fade where it continues, and cap only on its real start and end days?
- In a bento, is every tile a specific moment with its words on it, with no tile that is a title over bars, and each stat and unit on one line?

## Motion

For animated scenes:

- Did you film each beat at 40 to 80ms with `--at` and look at it: presses, morphs, hand-offs, exits, the seam?
- Does everything have an entrance and an exit, except `Bubble` and `Fly` with a visible hand-off?
- Does a swipe land, press, flick a third of the screen and lift while moving, with the page carrying on as one motion?
- Does a reaction grow from the corner of the bubble, with the room opening on the same clock?
- Are the marks of a terminal glyphs in the grid, each line owning its own, swapped in place?
- Do rolling numbers roll in the right direction and settle once?
- Does the loop end where it began, or reset with a visible cause?

## Polish

- Zoom every hand-drawn thing at 4x. Would a stranger know what it is? Is any stroke clipped by its box?
- Is there no translucent icon, no onion skin, and no hand-drawn mark where the kit has one?
- Is spacing even: words 12px from edges, stacks 4 to 6px of ink apart, dots 6px clear?
- Is no type under 10px on the phone, and does nothing wrap that should not?

## What you see, what you do

| You see | You do |
|---|---|
| A void under a list or pane (`empty pane:`) | Put more product into it until it runs off the crop, or crop the pane. Never spread the rows |
| A one-line row three times taller than its words (`fat row:`) | Use padding of 12px (8px dense) and more rows. Never add air inside the row |
| Rows spaced wider than their height (`loose list:`) | Tighten the pitch to the row padding and add rows |
| A whole window floating with even margins on a hero | Bleed it off two edges with one gutter, or fill the stage with it |
| Gray bars where the eye lands | Put words there. Bars beside it and off the crop stay |
| A label beside a real value drawn as a bar | Make both words, or drop the row |
| A unit on its own line (`unit wrapped:`) | Set nowrap on the pair, size the number to the tile, or move the unit to the lead |
| A phone drawn small, or whole, in a narrow host | Crop it: a gutter from one edge, off the other, screen at 1:1 |
| A grabber or sheet under the island | Start the sheet below the status bar |
| A popover that shifts while open (`anchor drift:`) | Pin it by the edge it opened from and reserve the height |
| An emoji where an icon belongs (`emoji icon:`) | Use a glyph from one icon family. Emoji stay in messages and reactions |
| An icon cut by its box (`clipped glyph:`) | Fit the drawing in its viewBox, or use the kit glyph |
| A reaction, dot or mark on the words | Move it to the edge or gutter the kit gives it |
| A gate line you think is intentional | Look again. If it still looks right, say so in `REHEARSAL.md` with the frame. Never clear it by hiding the thing |
| Ten film runs, a green gate, an unchanged frame | Stop and get a fresh eye |

## Hand over

Write `REHEARSAL.md` beside the component, and say what you did not watch:

```md
# Rehearsal: [demo]
Gold: [example] (what you kept, what you changed)
Beats: 1 ... 2 ... 3 ... payoff, loop [n]s
Captured: widths [wide, 390], looks, states, reduced motion
Film: [each gate line] -> [frame] -> [fix or why it stands]
Review: [reviewer's list] -> [your response]
Assumptions:
Unresolved:
Not checked:
```

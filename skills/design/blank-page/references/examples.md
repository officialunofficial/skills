# Before and after

Contents:

1. Medium unstated
2. Magnitude without a phase
3. Mechanism described by adjective
4. Addition without the style lock
5. Batch without a dedupe rule
6. Image feedback
7. Sequence beat
8. Bare brief
9. Missing motion, art direction and asset

Each "before" is a real first draft with the follow-ups it needed. Each "after" is what the expansion should produce from the first draft plus the conversation.

## 1. Medium unstated (four rounds)

Before: `in file-a, create a realistic eye blinking in front of a klein blue background, everything is in risograph texture`

Follow-ups switched the eye to vector and back, added a porcelain pattern from an image, asked for a boil and a grow-out, and set a 2 s zoom.

After:

```
in file-a, create the following, everything in riso (3-ink halftone, grain, slight misregistration):

1. a realistic eye (photo/footage based, not vector) centered on a klein blue #002FA7 field, blinking naturally [? 2 blinks over the comp]
2. around the eye, white porcelain-vase patterns [img: shape + motif only, not the colour]; the ring around the iris turns clockwise, the field outside it counter-clockwise; the whole pattern boils slightly and grows out bottom-up from 0s
3. camera starts 1x, steep quadratic ease-out zoom in over the first 2s

1:1, ~5s [?]
expose params for zoom end, pattern growth speed, blink timing
```

## 2. Magnitude without a phase (four rounds)

Before: `make the orb's entrance velocity 5x faster`

Follow-ups: the orb got slower, then the user explained that the entrance should stay and the roll after it should be fast and constant.

After:

```
1. entrance: use the fastest entrance speed we have had so far (the v3 one), keep it
2. after landing: constant roll speed, no decel, 1.5x the current; more bounce height
3. at 1.2s exactly: zoom in onto the orb and track it, camera moves with the orb but does not turn
keep the splash and the structure as they are
```

## 3. Mechanism described by adjective

Before: `make 23 more editorial, like a new image with white border with either a side or a corner being dragged to reveal the new stuff`

It was built as a slide-in, twice.

After:

```
for 23: the new image is already underneath, full frame; the current image is peeled away from a random corner or side (varies per transition) like a page being dragged off, revealing the new one beneath. not a slide-in. thin white border on each image, no scale on the image
```

## 4. Addition without the style lock

Before: `in riso-tunnel in file-a, add a series of square decoration frames in the style of the pattern in riso-blink, have them twist and turn within the tunnel`

Follow-ups fixed the colour, the source region of the pattern and an over-literal tunnel.

After:

```
in riso-tunnel in file-a, add a series of individual decorative frames in the white porcelain pattern from the outer field of riso-blink (not the ring):
- purely white, still riso
- each frame is its own flat shape, roughly square but it need not contain a literal square
- the frames line up along the tunnel axis so together they read as a tunnel; they only rotate about that axis as the camera passes, no other motion
keep the existing colour tunnel and camera as they are
```

## 5. Batch without a dedupe rule

Before: `in the carousel project, create the following 25 variations based on the existing comps / keep the new comps tight, around 5-7s / for all of them use white bg and 3 place holder images @a.jpg @b.jpg @c.jpg`

Follow-ups rejected 1-to-1 copies, reversed directions and mirrors, then asked for a naming format.

After:

```
in the carousel project, create 25 new carousel comps as variations of the existing ones:
- not 1-to-1: a valid variation changes the mechanic, orientation, layout or treatment; reversing direction or mirroring is not a variation
- stay within the current sensibilities (flat, white bg)
- each ~5-7s, the same 3 placeholder images @a.jpg @b.jpg @c.jpg
- expose expressive params for each
- name them "Carousel: [5 word max description]"
```

## 6. Image feedback (stays short, gains a pointer)

Before: a pasted contact sheet plus `make the splash's top brim a lot bigger and the background color in this [img] and background texture in this [img]`

After:

```
frame 3-4 (the splash peak): make the top brim ~2x bigger and more irregular
background: colour from [img a] (palette only), texture from [img b] (texture only)
keep the orb and camera as they are
```

## 7. Sequence beat mid-timeline

Before: `in file-b, create the following on main comp / at 3.5s mark, have many small jack-o-lantern versions of the mascot [img] crawl from the bottom of the screen up all over the skeleton covering it, / then, they crawl down and back to exit, leaving one bone dropping on the ground`

Follow-ups asked for the mascot to keep its shape and for glowing eyes.

After:

```
in file-b, main comp, at 3.5s:
1. many small mascots (the silhouette as-is [img], pumpkin texture + glowing eyes, same 16bit quantisation as the scene) crawl in from the bottom edge and up over the skeleton until it is covered [? ~1.5s]
2. they crawl back down and exit the bottom edge, leaving one bone that drops to the ground and stays
keep the sigil, skeleton dance and flames as they are; the beat ends by [? 7s] so the next scene can start
```

## 8. Bare brief

Before: `in file-d, make a video of our issue tracker app where the tasks show up nicely`

A spec-shaped expansion produced a dark list with rows that stagger in 60 ms apart and rise 8 px, a 20 degree tilt, and fill-ins about duration and loop. An unassisted agent built the same thing. Nothing in it was a decision.

After, with references chosen first (the motion reference is a stop-motion paper gif, the look a tile from a Printed Matter channel):

```
the brief says "our issue tracker app" and nothing is attached: attach a screenshot of the real issues list, or it gets rebuilt from u1 below.

in file-d, create the following, in the look of printed matter (riso-ish ink on uncoated stock, two spot colours, visible grain), the ui rebuilt as paper:

1. an empty issues list on a sheet of paper, camera top-down. each task slides in from the right edge as its own paper slip and lands with a stop-motion snap, one after another like m1, the stack getting thicker as they land
2. at ~2.5s a hand (real footage cutout, c1) reaches in and ticks the top three with a marker; each tick is one stroke, the slip turns from the dark ink to the accent ink as it is done
3. the camera pulls up and out to reveal the sheet is one of dozens pinned on a wall, every sheet filling with slips at its own pace
4. hold on the wall, slips still landing

it should look physically printed, not a flat vector of paper; very snappy, stop-motion timing throughout, no eases
white paper on a [? cork / grey] wall; ~7s
expose params for slip count, tick timing, the two ink colours

refs:
- a1 .context/refs/tracker/a1.jpg: look, the whole piece's finish: riso ink on uncoated stock, sets beat 1's frame (are.na/block/[id], channel printed-matter)
- a2 .context/refs/tracker/a2.jpg: palette, the two spot inks (dark + accent), used everywhere (same channel)
- a3 .context/refs/tracker/a3.jpg: material, the slip paper's grain and torn edge, beats 1-2 (same channel)
- a4 .context/refs/tracker/a4.jpg: composition, the pinned wall grid of beat 3 (same channel)
- a5 .context/refs/tracker/a5.jpg: detail, the marker tick stroke of beat 2 (same channel)
- m1 .context/refs/tracker/m1.gif: motion, beat 1: the slide-in and snap landing, the stack thickening, 0.0-2.0s at 1.2x slower, subject swapped (are.na/block/[id], channel mo-graph-1uxjlkjqqhc)
- m2 .context/refs/tracker/m2.mp4: motion, beat 2: one-stroke tick with the colour flip on completion (are.na/block/[id], channel motion-inspo-tfrw-gidqfw)
- m3 .context/refs/tracker/m3.gif: motion, beat 3 (the turn): the pull-up-and-out to a wall of many, its ease-out and hold (are.na/block/[id], channel design-moving-l9-xt3sxtne)
- u1 [? screenshot of the real issues list]: ui, layout and the row anatomy one-to-one
- c1 .context/refs/tracker/c1.mp4: copy, the hand and marker, footage cutout (pexels.com/[id])
assets: none beyond c1
```

Fill-ins: printed matter beat the safe dark-UI look because it makes "tasks show up" physical, and the runner-up was a Baroque User Interface channel. The pull-out wall reveal is the turn, so drop it if the piece must stay a single screen. The hand is footage, so it reads as real.

## 9. Missing motion, art direction and asset

Before: `in file-b, for the main comp, do the following at 7s: / have an inventory/equipment interface move in like stone blocks [img] / the inventory interface is that for a macbook, the controller keeps adding stickers onto the laptop, the stickers eventually overflow the inventory screen and the computer is completely covered in stickers / the whole sequence should be around 3-4s`

Eight follow-ups all concerned how stickers land and how dense the cover gets. A motion reference and an art direction reference supply exactly that.

The search kept one photo of a real sticker-bombed laptop. It rejected a printed laptop skin, a "sticker" gif that showed vinyl records and a dead pin. No moving reference passed. The stone-block image is a still, so it is art direction, not motion. The laptop has a lid that must close, so it is a Sketchfab asset, not procedural geometry.

After:

```
in file-b, main comp, at 7s, ~3.5s total:

1. an inventory/equipment interface slides in as stone blocks (a1), ~0.5s
2. the inventory is for a macbook: laptop open by default, then closes; a highlighted cursor adds stickers to the lid one at a time, each landing exactly under the cursor with a hit impact (slight screen shake on the first ~4)
3. the cursor accelerates until it is a blur with light trails; stickers land at random positions and rotations, overlapping like a2 (no spiral, no pattern), spilling past the laptop and the inventory frame until the whole screen is covered, lid, keyboard and all

stickers: [? exact list]
same 16bit quantisation and palette as the rest of the comp
keep everything before 7s as is

refs:
- a1 .context/attachments/[id]/image.png: art direction, stone-block material + chunky entrance only
- a2 .context/refs/stickerbomb/a2.jpg: art direction, density, random overlap and white die-cut borders only, not the brands (pinterest.com/pin/[id])
assets:
- sketchfab.com/3d-models/[uid] (Macbook Pro 13, [author], CC-BY, 77k faces, rotating hinge animation): the laptop, one-to-one, lid hinge drives the open-to-close, quantised to 16bit on top [? download]
- [? logos as svg from each brand's own site]
```

Fill-ins: the sticker list, the logo assets and the model download. No motion reference passed vetting, so the slap is described in words.

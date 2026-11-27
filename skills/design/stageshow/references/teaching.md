# Teaching pairs

Contents:

- How to use a pair
- Motion pairs
- Motion between neighbours
- Still pairs: UI details
- Still pairs: whole scenes
- Still pairs: style
- Detail pairs
- Making a comparison
- What a pair cannot show

`teaching/` holds bad and good pairs: one scene twice, with one thing wrong in the bad half. Open Comparisons in the playground (`?example=contrasts`) and pick a principle.

## How to use a pair

Use a pair to diagnose a fault in your own demo. Find the pair that looks like your bug, then read why the good half works. Never start from a bad half.

Watch at normal speed first, then pause and step through the transition. Under reduced motion the motion pairs show matching end states, because the difference is in the transition.

## Motion pairs

Both halves share one stage and one timeline, so each gets the same input at the same moment.

| Failure | Look at | Correction |
| --- | --- | --- |
| Instant label replacement | "Open preview" becoming "Back to editor" | A stable button and a clipped label slot. The old words leave as the new words enter (`Roll`) |
| Result without press feedback | "Save changes" before "Saved" appears | A small press and surface response first. Change state after `a.click` completes |
| New row shoves its neighbours | The line below a delivery note | Animate the containing track of the note, or reserve the space |
| Object loses its identity | A plus becoming a close icon | Keep the strokes and rotate them |
| Exit is skipped | "Link copied" when its close control is pressed | Keep the message mounted for its 320ms exit, then remove it |
| Interrupted motion restarts | A highlight heading to Month, redirected to Week after 200ms | Keep the highlight mounted and retarget from where it is |
| Landing jumps at handoff | A 24px avatar when the flyer becomes the assignee | Measure the avatar itself with `rect()`, not its padded wrapper. The bad flight lands four pixels off |
| Loop erases accumulated work | Three files clearing after they were added | Give the reset a visible cause: the good side presses Clear |
| Added content shifts its neighbour | A status icon appearing beside a label | Open the width and gap of the icon together while the label travels |
| A list jumps around a new row | Existing rows during insertion and removal | Animate their space as the new row enters whole. Let it exit before its space closes |
| A changing action shoves another | The secondary action beside a growing label | Carry the neighbour with the changing width |
| Surface and content resize separately | A popup opening its details and reversing | One coordinated geometry, with text that never stretches |
| Drag starts from the wrong point | A file just after an off-centre grab | Keep the pointer offset inside the object through travel and release |
| Spinner begins after appearing | The first frames of a saving state | Start rotation before the spinner is visible |
| Text shifts as it settles | A changed label and the word beside it | Move the label by transform inside a stable grid. Margin travel on overlapping inline-grid items moves the shared baseline |
| A label hits a hard edge | Letters crossing the top and bottom of a label slot | Soften the moving boundary locally. Resting text stays sharp and inside the control |
| Scrolling reveals a harsh crop | Rows crossing the viewport edge | Start with whole rows. After scrolling, fade only the edges that hide content |
| Dependent changes start together | Currency, price, method and address in one checkout | Offset the related starts while their movements overlap (`choreography.md`) |

Sources: neighbour pairs in `teaching/relationships.tsx`, drag and spinner pairs in `teaching/continuity.tsx`, label and scroll edges in `teaching/edges.tsx`, the baseline bug in `teaching/text-settle.tsx`.

## Motion between neighbours

An insertion changes two things: the arriving object, and the space of what was already there. Animate both. An icon that fades in while its label jumps still breaks the relationship.

For a changing control, a measured `Roll variant="fade"` resizes its label. Keep the actions beside it in normal flex flow so they follow. A transform that moves only the new label cannot move its neighbour.

Watch the unchanged neighbour through an insertion and a removal. Then watch a popup reverse before its first move finishes. Matching end screenshots prove nothing about the frames between.

## Still pairs: UI details

Thirteen pairs in `teaching/composition.tsx`, with the same content on both sides.

| Pair | Lesson |
|---|---|
| Framing | Clear gutters around the useful part. A cropped title or a status that covers a row hides the story |
| Anatomy | Headings, values, metadata and actions read as different roles. Related rows share columns |
| Emphasis | Nested borders, shadows and accents make every part compete. Quieten the support before you add a container |
| Compact | Reflow before shrinking. A scaled desktop screen passes an overflow check while its text is unreadable |
| Edges | No near-tangents. Check corners too |
| Nested spacing | Carry the inset round the bottom |
| Control alignment | Label and icons on one balanced row. Judge the visible glyph, not its SVG box |
| Density | Whitespace groups information |
| Contrast | Quiet is not faint |
| Icons | One construction, one stroke, one optical size |
| Decoration | A gradient or glow serves the story or goes |
| Task anatomy | Chrome for the task |
| Unread gutter | An unread dot never pushes its row in |

## Still pairs: whole scenes

Nine pairs in `teaching/scenes.tsx`, each 540 wide with a compact composition down to 280.

| Pair | Lesson |
|---|---|
| Dashboard and phone | Each device gets a readable role. The phone never covers the amount it explains |
| Window and satellite | The result sits in the quiet margin of the hero. A product's own popup is not a satellite |
| Several windows | Choose the active step. Three equally loud surfaces compete even when all fit |
| Coloured grounds | The background frames the product. Choose surface, text and accent against it |
| Dark and light materials | A light document over a dark workspace stays readable |
| Action and payoff | Crop to the useful content at reading size and let chrome run off |
| Result weight | Ask what the eye lands on first. Fewer, larger rows make the new file the heaviest thing in the frame |
| Crop filler, never the story | Move the window or narrow the column until the last value that matters is whole |
| One tile leads | Four equal tiles of heading and bars read as a template |

## Still pairs: style

One deploys card in every pair. Each bad side has one fault.

| Fault | Correction |
|---|---|
| Purple slop: a violet-to-pink gradient, gradient text, a tinted card | The product's own neutrals, one accent on the thing that matters |
| Tiny text: 9 to 10px type | Names at 13 to 14px, metadata at 11 to 12px, fewer rows |
| Over-detailed: branch, hash, author, duration and badge on every row | Real detail on the one row the story is about |
| Glow: coloured light on the card, button or status | One soft neutral shadow |
| Capitals: tracked caps on headings, labels and buttons | Sentence case, unless the product capitalises |
| Invented icons: drawn glyphs in rainbow tiles | The product's own set or one pack, one stroke, colour only for status |
| AI shorthand: sparkles, wands, gradient "AI" chips | The product's own mark, or a plain label that says what happens |
| Onion skin: an icon in translucent ink | One opaque colour. A lighter opaque gray for a quieter icon |

## Detail pairs

Six small pairs in `teaching/details.tsx`.

- **Throw a swipe at the speed of the finger.** On release, the row carries on at its current speed and the gap closes in one ease. A pause at the hand-over or an ease-in from rest reads as harsh.
- **Draw a reaction as the app does.** The real emoji in a small pill on the lower corner of the bubble, scaling in from that corner.
- **Draw a chart on from its start.** The line draws left to right, the area follows, and the end dot lands when the line reaches it.
- **Balance a top bar.** One control and an empty side reads as unfinished. Put what the product puts there, or drop the bar.
- **Choose copy that fits.** Unless the brief fixes them, pick names, emails and values whose length suits the layout.
- **Pin a changing label to its icon.** In a fixed-width control, the label sits against its chevron and grows away from it.

## Making a comparison

Change one thing. Keep the content, layout, end states and input timing the same. Add no extra cards, status marks or decorative backgrounds. State the exact difference under each side, give the pair a replay, and make it readable at normal speed. If the lesson shows only at slow speed, rework the pair.

## What a pair cannot show

Some faults need the real demo:

- **Story continuity.** Does the reset make sense for what the viewer just did? Compare `examples/story/`.
- **Handoff timing.** Does the flying object vanish before its destination takes over? Compare `examples/subscriptions/` on the frame where ownership changes.
- **Desktop at phone width.** Can you read the important labels? A recognisable silhouette is not readable UI.
- **Motion without hierarchy.** See `motion.md`, "Story".

A checker can flag a jump and still miss a wrong path, an implausible gesture, a bad story or an unreadable crop. Say what the tools covered and what you watched yourself.

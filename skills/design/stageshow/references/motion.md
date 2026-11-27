# Motion

Contents:

- Story
- Loops
- Pace and easing
- Changing text and values
- Things that appear, travel and leave
- The cursor
- Drags and selection
- Scrolling and the camera
- Phones in motion
- Recipes

The rules for everything that moves. The still frame is in `craft.md`. The props of each kit part are in `kit.md`. A name in parentheses such as (`anchor drift`) is the film line that flags the fault.

## Story

Pick the shape from what the product is valued for. A demo forced into the wrong shape gets busier, not better.

| Shape | What happens | Example |
|---|---|---|
| How it feels to use | The gesture is the story. A cursor does one satisfying thing and the result appears under its hand | `hero-demo` |
| A flow in an app | A few screens told as one continuous object, payoff on the last. No second device bolted on | `phone-touch` |
| What the system does | The consequence lands somewhere else. Make the link visible: a value on a connector, a card that flies into a list. Usually no cursor | `subscriptions` |

- Beauty decides. The calmer, fuller, better-framed version beats the one with more story.
- A hero loop runs 10 to 16 seconds. A repeat is a short beat, never the whole flow twice.
- Use three to five beats that build to a payoff. One gesture and a response can be enough.
- Open on a finished screen that works as a still. The first real content is on screen before the first beat. A thread opens with a real message, not bars.
- A short history sits at the top of its pane under the header, never pinned to the bottom with a void above.
- Between beats, the cursor rests on empty surface near its next move. It never rests on an unused control, and never as an I-beam over a button.
- A satellite arrives at the beat it pays off, carrying its payload. Otherwise it is present from the first frame in a reserved column. Never park an empty object.
- The payoff is visible at the shown size: a panel, a window that comes forward, a clear state change. A 16px avatar at the edge is not a payoff.
- The payoff arrives full. With `Collapse`, put the first lines in before `open`. Never show a blank surface for a quarter second.
- Things connect. A `Connector` draws on over about a second after both ends are placed, routes around cards and ends on a dot.
- Test each moving element: cover it. If the story gets clearer without it, cut it.
- **The poster.** Most people see only the poster: a thumbnail, reduced motion, a screenshot. Set `poster` to the beat that tells the story alone, such as the row mid-swipe with Archive showing. Leave the result on screen after the action. A poster is never caught mid-change: a digit mid-roll or a surface mid-fade reads as a glitch when it holds still.

## Loops

- A reset removes what the loop added as one thing. A reply and its reaction leave together. Use the fewest steps that return the frame.
- A loop keeps a complete product picture. Open on context and return to it. Film the seam at 60ms.
- Every reset has a cause or is invisible. In order of preference: a seen cause (undo with its keycaps, clear, close), an exit around an anchor, a snap while hidden (`act.snap`).
- A loop never plays a navigation backwards. An app opened from a notification does not shrink back into it. Leave as the product leaves (the phone locks, the app goes home), or cut to the opening frame while something covers it.
- Data never rewinds in view. Snap it back while hidden, or bring the data of the next loop in as new.
- Leave no dead air at the seam. The next action begins within about a second of the end of the exit.
- An exit around an anchor: what the story added leaves in one reverse stagger, 40 to 80ms apart, all moving within half a second, while product content stays.
- A story that accumulates runs as a conveyor: exit the built batch, bring a fresh one in from the crop, reset unseen.
- The payoff holds for 2s before the exit. Nothing on screen sits still for more than 3s.
- A second scene earns its length with something new: a different outcome, surface or side.
- A looping video starts on a calm frame.

## Pace and easing

| Job | Value |
|---|---|
| Travel between positions | `cubic-bezier(0.45, 0, 0.1, 1)` |
| Arrival from nowhere | `cubic-bezier(0.25, 0.8, 0.25, 1)` over 0.8 to 1s |
| Stagger within a scene | 40 to 80ms in reading order (`act.stagger` defaults to 60) |
| Stagger between tiles of a grid | 80 to 120ms |
| Colour change between distant hues | about 200ms, because every route passes through mud |
| In-app response on a phone | `cubic-bezier(0.3, 0.75, 0.1, 1)` over 0.5s |

- Stay unhurried. Judge distance and overlap, not duration.
- Travel has a departure, clear travel and a soft arrival.
- UI feedback stays as quick as the real product, and starts on the input. Only storytelling motion slows down.
- Related responses overlap. A changed setting leads its label, then its dependents, while the frame holds. A confirmation still follows its cause (`choreography.md`).
- One object enters whole. Holds are beats too.
- A small expressive icon may overshoot while its card and text settle without bounce.
- To hold a result, stop. A useful still needs no new pulse.

## Changing text and values

- Every change moves. A submenu slides, text rolls, a surface morphs. Nothing swaps in one frame.
- Change only what changed. `Roll` animates the changed span and moves what follows by its measured width. Pick the anchor on purpose.
- Decide the footprint of a control before its label transition. `States` holds the largest size. `Roll variant="fade"` resizes. Never roll unchanged words.
- Button states share one slot. Keep the button mounted, with the variants in one grid cell. Check the shortest, the longest and the pending state.
- Added content opens its space with its neighbour. The width and gap of an icon open together while the label travels. Both close on removal.
- A right-pinned value changes against that edge (`Roll align="end"`). A status icon beside it keeps a fixed slot.
- Numbers roll with `Count`, last digit first, unchanged digits still. Give it a slot and hold the completed value.
- Typed text becomes a chip in place (`Field chip`): the words stay, the surface grows around them.
- The result follows press feedback. Change state after `a.click` completes.
- An object keeps its identity when it changes. A plus that becomes a close rotates the same strokes.
- A spinner turns before it is visible and keeps turning through its fade out.
- When text shifts as it settles, inspect the glyphs and not only the box. Compare the last moving frame with the first settled frame (`lands on a transform`, `steps in its box`). Causes: a released measured width, a transform that loses its layer, a font that loads late. Keep the transform layer through cleanup. Never set `will-change` over the whole scene.

## Things that appear, travel and leave

**Arrivals and exits**

- Nothing pops. Everything has an entrance and stays mounted until its exit finishes.
- Leave no holes or blank frames. What replaces something arrives as it leaves.
- Solid things do not fade through. Windows, phones and cards arrive by moving, opaque or nearly so. A half-transparent phone is a ghost.
- Cards, toasts, pills and reactions arrive whole from just above (`Collapse reveal="drop"`). Clip only rows of text.
- Content arrives after its container. The number of a pin appears when its circle is nearly full size.
- A moving edge never slices text (`hard edge`). `Collapse` fades before and after the height moves.
- A released marquee fades.

**Neighbours and surfaces**

- Neighbours make room continuously as the newcomer arrives.
- A new row carries the rows below it. Animate the containing track, or reserve the space.
- A resizing surface moves size, position and content as one transition. It never stretches its text, and it retargets from its current geometry when interrupted.
- Replacing content keeps the container, alignment and reading interval, and masks only the moving slot.
- Keep the header, outer surface and action positions steady while variable content changes inside.
- A popup fits before its first frame. It never corrects its size while opening.
- An open surface holds its anchor (`anchor drift`). A popover, palette, menu or sheet is pinned by the edge it opened from. Reserve height for the longest list.
- Overlays close where they were. Keep `{ open, at }` as separate state, never a nullable `menu` point.
- A zone that becomes something else takes its new size, such as a drop zone that becomes an upload card.
- A dashed edge never changes size (`dashed edge resizes`). Draw it at final size on its own layer and only fade it. Border style does not transition, so fade a dashed `::before` layer over a solid hairline.
- A switch between versions morphs in place, or crossfades with the height of the plate eased.

**Flights and landings**

- One object makes one trip and ends in its final place. Open the room (`Collapse`), measure the slot, then `Fly`. Never land and then lay out again around it.
- The ends of a flight are fixed at take-off.
- A thing that grows as it travels takes the long settle: a soft start and a long deceleration, 600ms or more.
- A flyer changes to its resting look during the last third (`.ss-fly[data-go]` with a delayed transition).
- Landings are soft: decelerate over the last third, back to size before arrival, no bounce, no ring pulse.
- After motion, nothing moves. A handoff has the same size, place and look on the swap frame. Measure the landing element itself, never its padded wrapper (`handoff shift`, `settle snap`, `fly size`).
- A value chip grows from the words of the value, gains fill and lift as it departs, and wears one of its two looks, never a third colour (recipe in `kit.md`).
- A selection ring that moves between items uses `Follow`, so it keeps momentum when retargeted.
- Look at every motion finding (`appears, then moves`, `near-empty frames`). Fix the real ones and name the intentional ones. Never cut good motion to quiet a detector.

## The cursor

- No cursor means no stand-in. Never walk a focus ring, halo or spotlight between controls.
- The elements decide the kind of the cursor through `data-cursor`. The kind switches as the cursor crosses the edge, never after it arrives.
- `drag()` closes and reopens the hand itself. A drag over text stays an I-beam. `{ cursor: 'preserve' }` keeps the current kind, for creation with the arrow or a resize edge.
- Native app buttons keep the arrow. `cursor()` is only for kinds that nothing implies, such as `wait`.
- The cursor never covers the words it clicks (`covers`). Aim inside the target but off its text (`x: 0.85, y: 0.6`). Park in the empty space of a menu row.
- The cursor stays where the press happened while the result changes size.
- A cursor changes style by morphing (`examples/cursor-morph`).
- Every move travels to the next action, follows a held object or clears the way. The Stage fades a resting cursor after 4s.
- Keyboard stories show the keys with `act.key('cmd+k')`. The cursor can rest or leave.

## Drags and selection

- A pointer drag is one motion. With a mouse, the row follows the pointer the whole way and leaves on release. The short drag and throw belongs to a finger.
- A drag starts where the thing is. A file from outside enters already held, with a fixed grab offset.
- Pickup belongs to the press. Set `lifted` and the first carried position inside `onMove`, never before `drag()`.
- A carried card is held, not slid: scale 1.03, a deeper shadow, one or two degrees of tilt, following the arc of the hand. The whole card tilts, words included. Keep its text steady with a layer it holds throughout (`will-change: transform`). It settles flat on drop.
- A held item rides with the cursor exactly, from `onMove` on both axes, with no transition. `Fly` is only for flights the cursor does not carry.
- The grab offset is where the hand took hold. Derive it from the pickup fractions, share the `transform-origin`, and keep stage translation outside the lifted transform.
- Constrained controls follow their mechanism. Give `drag` a `{ path }` so a knob turns on a circle.
- Drop targets never travel. The slot appears in a cell and jumps to the next. Use `cellOf` for sticky borders.
- A move between lists uses `Slot`: the source closes on lift, the destination opens in flight, the drop aims at the open slot, then the real card swaps in.
- A text selection reads left to right from a word boundary.
- A text selection stays under the I-beam on every frame. Drive it from `a.drag` with `a.caret(name, at)` in `onMove`, and render from the character count. A highlight grown by time runs ahead of the cursor on one line and behind it on the next. `--gate` fails on `selection drift`.

## Scrolling and the camera

- Nothing scrolls unless the pointer is on it. `a.scroll` moves the cursor in and holds it. Scroll back before the loop ends, never at the seam.
- Scrolling starts with whole rows. Fade only the edges that hide content after scrolling, and clear the fade at the end.
- The camera needs a reason. Push in only when the payoff would be too small to read at the shown size.
- Frame the wide shot as a good still first. A zoom never rescues a weak frame.
- Use one push-in per story, in and back out. The cursor holds still while the view moves.
- `Camera` fits the focus to the aspect of the stage, so widen the focus to the content column.
- Inside an overlay, wrap only the region that zooms, with `pad={0}` when the region is already the frame.

## Phones in motion

- Act where people do. A notification is tapped to open its app, and the reply or purchase happens in the app. Long-press actions are a shortcut few people use.
- Touch uses `cursor={{ style: 'touch' }}`, never the macOS arrow. `Expand` does card-to-screen.
- A swiped row stays in its list. The action is the back of the row: same height, edge to edge, revealed as the row slides off it. The list clips both. Check the frame at the furthest point of the swipe, because people screenshot that frame.
- A swipe is a flick: a third of the screen in about a quarter second, lifting while moving. The page is thrown on over 0.5s with `cubic-bezier(0.25, 1, 0.5, 1)`.
- A reaction is `Bubble tapback`: a white circle on the bottom corner of the bubble that grows from the edge as the room opens, on one clock. It fades before the room closes.
- Dynamic Island: animate the box and radius of the black shape together. Never stretch its contents, which live on a separate unfiltered layer and fade into place.
- Island timing: 500ms underdamped growth, a 380ms shrink delayed 120ms so content clears, a press squeeze to 0.965.
- Island filters (blur 2.6, alpha matrix 9 -4) apply to the black shapes only. Keep the dormant circle inside the pill.

## Recipes

- A page swap inside one window keeps the chrome and crossfades only the body (200ms, an 8px rise). Never slide whole pages sideways.
- A stepped demo keeps its object across steps. Swapping the script of a Stage is a cut. A variant switched from outside gets one stable `play="once"` script. Verify skip, reverse and a change in mid-play.
- Replay remounts at the story boundary with a key (`kit.md`, "Explicit replay").
- Annotations follow `annotations.md`. Motion in a grid follows `bento.md`, rule 11.

# Vocabulary

Contents:

- Easing and pace
- Direction and orientation
- Camera
- Shape, texture, material
- Composition and layout
- Mechanism verbs
- Reference role phrases
- Scope and bookkeeping

These words come from real prompts and each has one settled meaning. Prefer them to synonyms, so the expanded prompt reads as the user's own.

## Easing and pace

| Word | Meaning |
|---|---|
| snappy | short duration, steep ease, no overshoot unless asked |
| smooth | longer ease, no step, no cut after the move |
| steep quadratic ease-out / ease-in | an explicit curve family and steepness |
| sharp ease out | fast start, a long tail still moving at the end |
| ease-out decel into a constant speed | an entrance, then linear travel |
| constant speed | no deceleration in the travel phase |
| natural | physically plausible, no uniform timing |
| overshoot, jiggle only as a result of the impact | secondary motion tied to a cause |
| hold, pause, no hold, pause 1.5s shorter | explicit dwell time |
| tighter | shorter overall, less gap between beats |
| 1.25x faster, 3x faster at top speed, 1.5x more zoomed in | a multiplier with the phase it applies to |
| at 1.2s exactly, ends at 3s | a timeline anchor |
| one continuous motion from the start | no stop-and-go |
| real acceleration with motion blur | a gravity-like fall |

## Direction and orientation

| Word | Meaning |
|---|---|
| clockwise, counter clockwise, 30 degree clockwise | rotation sense and degrees |
| upright, no rotation, straighten, align | the end pose |
| bottom up, top down, from the left end of the screen to right | growth or travel in frame terms |
| inward, outward, radially outward | field direction |
| horizontal, vertical, at 45 degree, 20 degrees from the screen | a plane or angle |
| mirrored | a transform of a reference. Avoid "the other way" and say which. |
| random corner and sides, from all sides of the frame | entry points |
| one direction strictly | no back-and-forth |

## Camera

| Word | Meaning |
|---|---|
| zoom in, zoom out, 1.5x more zoomed in | scale of framing |
| pan fast to the right, fast ease-in into top speed | a lateral move with easing |
| track it, move with the orb but not turn | follow without rotation |
| push in, steep ease-in zoom into the green light | dolly into a point |
| bird's eye view, pov, 45 degrees from a top down angle | viewpoint |
| camera stays still | lock |
| fits each icon and the orb in that frame | a framing constraint |
| perspective sways | repeated viewpoint changes |
| hold on the zoomed out view longer | dwell |
| hard cut, no fade, glow-in, cut to | transition type |

## Shape, texture, material

| Word | Meaning |
|---|---|
| glossy, glass like, crystal, sheen | material family |
| translucent, soft glow, heavy glow in the center | emissive treatment |
| white crisp edges, ultra smooth | edge and surface quality |
| realistic, photoreal, real 3d texture and models | fidelity demand |
| organic, less circular, irregular | de-regularise |
| congruent, one continuous body, connected at all times | topology constraint |
| riso, 3-ink halftone, misregistration, grain | print look |
| embroidery, cross hatch, stitch | textile look |
| pixelation, 16bit, low res | retro quantisation |
| mossy stone, worn and weathered, grunge, desaturated | aging |
| frutiger aero, klein blue #002FA7, green on black, navy on blue | named colour ways |

## Composition and layout

| Word | Meaning |
|---|---|
| take up the entire frame almost | scale in frame |
| center properly, add more white space, more compact | spacing |
| 1:1, 16:9, 4:3 | aspect |
| borderless, filling the entire frame, thin light grey border | edge treatment |
| water line at the top 1/3 | rule-of-thirds anchors |
| one word per row, tighter cluster, more sparse, 2x denser | distribution |
| arranged neatly in grids, scattered, random rotation | order against chaos |
| stays after it grows out, don't fade it | persistence |

## Mechanism verbs

| Verb | Use |
|---|---|
| inflate, deflate, pop in at 70% then finish inflating | balloon |
| bump, impact, slight screen shake | hit |
| bounce, roll, land on a bouncy pad and bounce out of frame | ball physics |
| unravel, unfold, morph, in-process morph | transformation |
| grow out, bleed radially outward, spread like a drop of liquid | reveal field |
| flip, turn, spin | rigid motion |
| drag from a corner to reveal, dissolve, pixel melt, mosaic swap | carousel transitions |
| crawl, swarm, stop motion run cycle, hops | character motion |
| glitch out, flicker, boil | surface disturbance |

## Reference role phrases

| Phrase | Asks for |
|---|---|
| it should look like this [img] | overall look |
| with this type of texture [img] | texture only |
| in the color way of [img] | palette only |
| use this for [object] [glb] | the asset itself, as-is |
| use the same camera as the ref picture but mirrored | camera angle with a transform |
| reference this if it is helpful [repo] | technique, loosely, optional |
| recreate this animation, but make it [subject] | motion with the subject swapped |
| only the spiral form factor, and the scroll animation | a scoped take from a motion reference |
| make it much closer to the og | a fidelity bump. Say it up front instead. |
| make the arrangement and font visually more like this | layout and type |
| the first two patterns in this picture, as indicated here | scoped to a part |
| match the timing to the beats of this [mp3] from 17.15s to 30s | audio sync with a range |
| using [channel] as reference | a family for a batch |

## Scope and bookkeeping

| Phrase | Use |
|---|---|
| for 23, ... | target one comp by number |
| across the board, for all of them | every comp in the file |
| keep the rest the same, keep my new tweaks too | keep-clause |
| unrelated, ... | a different comp inside the same list |
| actually ..., revert | undo the last change |
| create a copy that tries another approach | branch, do not overwrite |
| expose params for ..., current value as the center | tunables |
| no overlap with ..., backward and mirror are not valid variations | batch dedupe |
| check the render properly, one-to-one with the app | verification |

# Evidence behind the rules

The rules come from 38 agent sessions holding 587 prompts by one motion designer. Of those, 31% were a pasted screenshot or contact sheet with no text. The 406 text prompts had a median length of 14 words. The user iterates in many short turns and uses images as the main feedback channel.

## What the prompts contain

17% of the text prompts corrected a misread. That is the cost this skill removes, and nearly every correction maps to an empty slot in the checklist.

The other shares: a "make X more or less" delta 35%, a direction word 22%, a named element 21%, a numbered comp 14%, camera words 13%, a removal 13%, an attached file 12%, easing words 10%, a named style 9%, a keep-clause 7%, a multiplier 6%, a timeline anchor 5%.

## Openers decide the result

The 29 opening briefs are a different genre from the deltas.

| In the opener | Openers |
|---|---|
| a concrete attached reference (image, mp4, URL, GLB) | 21 of 29 |
| a settled aesthetic or medium named up front | 16 of 29 |
| a video or gif as motion reference | 7 of 29 |
| a seconds anchor | 6 of 29 |
| a ms, px, hex or degree value | 3 of 29 |
| a realism demand | 3 of 29 |
| a "no fade, no shadow" ban | 0 of 29 |

The idea lives in the reference, and the beats chain turns: a wave turns the screen into a new texture, the camera zooms out to reveal a landscape painting, the painting unravels into one thread that becomes a running silhouette. No opener picks the safe default look.

All real openers share one skeleton: location, style, numbered beats with inline references, globals after the list, params, a realism demand.

## The first version failed

The first version of this skill was extracted from the deltas. It produced spec-shaped briefs: ms staggers, px rises, bans, pixel-ratio checks, "linear style" and "flat vector" defaults, and references found after the beats to match them. In a before and after test, its results matched an unassisted agent. The current rules exist because of that test.

## Deltas

These landed in one round: `for 60, zoom in more by 1.5x`, `make the final pan 3x faster at top speed`, `in 17, make the squares just rotate 30 degree clock wise to straighten`, `at 2.5s have the camera zoom fast into the pupil, steep quadratic ease-in`.

These needed follow-ups:

| First attempt | Empty slot |
|---|---|
| `make the orb's entrance velocity 5x faster` | which phase, a reference point for the magnitude, a keep-clause |
| `have things rotate the other way` | a direction with a sense |
| `the folder one is upside down` (three times) | which way is up, in frame terms |
| `make 23 more editorial, ... a corner being dragged` | the mechanism: what moves, from where, revealing what |
| `make the rolodex's angle smaller` | the invariant (equal angles), not the symptom |
| `make it faster` | a multiplier and which quantity |
| `btw these are references`, two turns late | a role on every attachment |
| `it doesn't look like the glb i uploaded` | the asset used as-is |

## Correction families

- **Orientation**: upside down, other way, mirror. State axis, sense and what "up" means.
- **Magnitude**: faster, bigger, more zoomed. State multiplier, phase and reference point (`the fastest we have had`).
- **Target**: wrong file, comp or element. Put the location prefix and comp number on every change.
- **Medium**: photo, footage, 3D rebuild, vector or shader. State it up front.
- **Lost state**: params or tweaks removed. Put a keep-clause on every edit.
- **Over-literal reads**: "individual frames rather than a literal tunnel". Describe the composition of parts, not the metaphor alone.
- **Pace**: unwanted pauses. State holds, including "no hold".

## How references were used

From 271 attachments:

1. One reference did one job. No file was asked for both motion and look.
2. Every mp4 and gif was cited for a mechanic or transition. Every still was cited for a subject, palette, texture or detail.
3. Motion references had the subject swapped, and what was kept was named.
4. References were scoped to a part: `the first two patterns in this picture`.
5. The motion references came out of curated channels, which is why the search goes by channel.
6. Copies became loyal only after a correction, which is why fidelity is stated up front.

## Fence failures

The "remarkable, not matching" rule was written for users who name niche aesthetics. Applied to mainstream words, it overrode the request: `minimal` became a graphic score, `stripe` became a conference sizzle reel, `claymation` became a marble run.

The first fix overshot. Agents screenshotted the fence (a docs page, five product-UI screenshots) and fenced the motion too. The builds came out as web pages at browser scale with one small thing moving.

Both runs missed for one reason: the fence was treated as a place to copy from, not as a query.

---
name: blank-page
description: "Expands a one-line motion, animation or design brief into the full prompt: one committed look grounded in five reference images, three motion references, numbered beats with a turn, and the references and assets attached. Also tightens edit notes into exact deltas. Use when the user says 'expand this prompt', 'make this prompt more specific', 'what is missing from this prompt' or 'help me write the prompt for X', or when a short animation, composition or design brief is about to be handed to an agent."
license: MIT
metadata:
  upstream-author: "Cekura, Inc."
  upstream-source: "playful-design/router"
---

# Blank page

Turn a short draft into the brief its author would have written. The method was built on composition work (motion, 3D, shaders, footage) and applies to any generative brief.

A good brief is references plus beats. The idea lives in the thing pointed at (`recreate this [mp4]`, `in the texture of embroidery [img]`), and the beats say what turns into what. So the output commits to one look, copies one striking move, uses real things, and contains a turn. It does not add words or numbers for their own sake, because a capable agent already picks sensible easing. What it does not do alone is commit to a look, copy a move, use a real asset and add a turn.

Write in the user's voice: lowercase, imperative, numbered, no filler. Keep a new brief under about 150 words above `refs:` and an edit note under about 50. Over the cap, drop the optional lines first (realism, params, a frame line that restates a default). Keep every beat and the turn.

Reference files:

- [references/finding-references.md](references/finding-references.md): reference roles, the fence, where to search and how to vet. Read it before step 2.
- [references/vocabulary.md](references/vocabulary.md): pace, direction, camera and material words with their meanings. Read it while writing beats and deltas.
- [references/examples.md](references/examples.md): before and after pairs. Read it when unsure of the output shape.
- [references/patterns.md](references/patterns.md): the evidence and past failures behind the rules. Read it when a rule seems wrong for the case.

## Procedure

### 1. Classify the draft

| Mode | Signal | Output shape |
|---|---|---|
| brief | "create", "recreate", a new comp or scene | look line, numbered beats, frame line, refs, assets |
| batch | "create N comps", "variations", "fill the gaps" | brief, one line per item, a dedupe rule, shared constraints |
| delta | "make X more/less Y", "get rid of", "fix", "move to" | target, change, magnitude, direction, keep-clause |
| image feedback | a screenshot or contact sheet is attached | one line per observation, each naming its frame or time |
| sequence | "at Ns", "after the X exits" | brief with a time anchor on every beat and a duration cap |
| housekeeping | rename, push, export, "check the render" | leave as is, add the exact format or target |

Brief, batch and sequence run steps 2 to 8. Delta and image feedback skip to step 6 and search only when the change brings in a new look or move.

### 2. Ground the look: five images, before any beat

Pick one aesthetic, look at its contact sheets, and take five stills that each do one job: overall look, palette, material, composition, detail. Use one aesthetic only. If a second keeps winning tiles, switch to it wholesale. Its name goes in the first line of the prompt.

- No fence (the draft says nothing about the look): browse the menu of named aesthetics and pick the remarkable one, not the one that matches the draft's words.
- A fence (the draft names a style, a brand or a medium, or attaches a reference): the word is the search query, and the pick is the best instance inside it. The fence limits palette, material, type and components. It does not limit layout, scale, camera or the move. Never answer a fence with a different aesthetic or a screenshot of the named thing. The first line names a child of the user's word (`in stripe-gradient dark`).

### 3. Ground the motion: three moving references

Take three gif or mp4 clips from curated motion channels. Each must be a move worth copying on its own, and together they cover three jobs: the main mechanic, the turn, and the exit or camera. If no exit or camera move passes after three channels, give m3 another beat and write the camera in words. The fence never applies to motion, because a flat look with a flat move is a screenshot.

Then add what the beats need: a copy reference or asset for anything recognisable (a real UI, product, artwork, 3D model) and a ui reference for interfaces. A user attachment fills its own slot. Look at every candidate before it gets a role.

### 4. Assign each reference, then write the beats

For all eight references, state which beat it feeds and exactly what is taken: `a3's wet-stone texture is the canvas surface`, `m1 0.0-1.6s is beat 1 at 1.5x slower, subject swapped for cards`. Cut a reference that feeds no beat. The motion references set the order and timing of the beats. Each image sits on the beat where its quality first shows.

Include the turn: a beat where something is revealed, changes medium, zooms out to a larger whole, or becomes something else (`the painting unravels into a single thread which becomes a running silhouette`). Enter, animate, hold is an unfinished brief. When the draft already holds a transformation (`snaps into`, `comes back as`), that verb is the turn. Make it the biggest beat and add no second metaphor.

A clip of 5 s or less carries one idea. Extra ideas go into the material and the camera, not the plot. The action fills the clip: keep the end hold under 1 s. A turn that is over by 1.6 s means compressed beats or a missing second half.

### 5. Add ideas

On a bare draft the user expects additions: a prop that makes the subject specific, a real asset, a camera move tied to a reveal, a second beat that answers the first. Write them as beats. Mark the one or two real forks with `[? ...]`.

### 6. Fill the slots

Use the checklist below. Fill silently what the file, the previous comp, an attachment or the conversation gives. For a missing creative slot, write a `[? best default]` placeholder in the prompt. For a missing routine slot (duration, aspect, file), write the default inline with no marker. When no file is named, write `new file [topic]`.

### 7. Rewrite in the house shape

Use the templates below and keep the user's wording where it exists.

### 8. Output three things

1. The prompt in a fenced block.
2. A "fill-ins" list: at most three creative forks, each with the choice made and the one alternative worth considering. Never list duration, loop or aspect.
3. One line pointing at `.context/refs/[topic]/` and its contact sheets, so the user can veto a pick. `[topic]` is a two or three word kebab slug of the subject (`coffee-menu`).

If a real thing is needed and absent (the user's own app, product, logo), say so in one line above the prompt and name the stand-in. Add no technique notes and no advice.

## Slot checklist

Opener slots come first because they decide the result. Edit slots follow.

| Slot | Ask | Form |
|---|---|---|
| where | tool, file, comp, and for a sequence the time or beat | `in [tool], [file], [comp], at 3.5s:` |
| look | one named aesthetic from a1, a child of the user's word when one exists | `in frutiger aero style` |
| medium | photo or footage, 3D rebuild, vector, shader, real model | `using threejs`, `real 3d texture and train models` |
| move | the mechanic from the motion reference, subject swapped | `recreate this animation, but make it nyc subway` |
| subject | the real thing, by name, with its source | `the famous ukiyo-e painting [img]` |
| beats | numbered, each a subject, an action and what it reveals or becomes | `2. at around 2s, a big wave splats across the screen, turning it into a new texture` |
| turn | the reveal, morph, zoom-out or medium switch | `the camera zooms out to reveal that ...` |
| realism | the fidelity demand, when it matters | `it should be very realistic`, `loyal to the og` |
| camera | move, easing, what it lands on | `camera zooms fast into the pupil, steep quadratic ease-in` |
| pace | the feel in words, seconds only for anchors | `very snappy, ease-in-out` |
| frame | background, aspect, duration, loop, only where they differ from the defaults | `white bg, 1:1, ~5s loop` |
| params | values to expose when the comp will be tuned | `expose params for plumpness, sheen, glow` |
| keep | edits: what stays unchanged | `keep the old entrance speed` |
| magnitude and direction | edits: multiplier, phase, axis and sense | `2x faster at top speed`, `30 degree clockwise` |
| scope | edits: which comps the change touches | `only for 23`, `unrelated: also ...` |

Standing defaults are never written out:

- White background (black for math-graph work).
- No fade, drop shadow, rounded corners, annotation text, UI chrome or guiding lines.
- 1:1 for social posts, 16:9 for graphs and carousels.
- About 5 s for a loop, 3 to 4 s for an inserted beat, under 15 to 20 s for a sequence.
- Real assets for recognisable objects, stylised on top.

The look outranks the defaults. An aesthetic with its own ground (paper stock, dark-mode navy) replaces the white background on the frame line. Light that belongs to the look, such as raking light across paper, is not a drop shadow.

## Templates

Brief:

```
in [tool], [file], [comp,] [at Ns / after beat,] create the following, in [aesthetic from a1][, using technique]:

1. [subject (c1 or asset), its state at 0s] [enters like m1: mechanic]
2. [main action from m1, subject swapped] [at ~Ns]
3. [the turn: reveals / turns into / zooms out to show ...]
4. [exit or end state]

[realism demand if it matters]; [camera if it moves]; [pace in words]
[frame only where it differs from the defaults]; the whole thing ~Ns
[expose params for list]

refs:
- a1 [path]: look, [what it sets] ([url], channel [slug])
- a2 [path]: palette, [used where] ([url], channel [slug])
- a3 [path]: material, [which surface in which beat] ([url], channel [slug])
- a4 [path]: composition, [which beat's frame] ([url], channel [slug])
- a5 [path]: detail, [which element, which beat] ([url], channel [slug])
- m1 [path]: motion, beat n: [mechanic, time range taken, scale factor], subject swapped, not the look ([url], channel [slug])
- m2 [path]: motion, beat n (the turn): [what is taken] ([url], channel [slug])
- m3 [path]: motion, beat n: [what is taken] ([url], channel [slug])
- u1 [path]: ui, [ui type] layout + components, brand-neutral ([url], channel [slug])
- c1 [path]: copy, [subject], one-to-one ([url])
assets:
- [path or url]: use as-is for [what]
- [model page] ([author], [licence], [faces]): [object], one-to-one, [parts that must move] [? download]
```

Beats cite handles inline (`2. the sticker peels from the lower-left corner like m1, on a3's wet stone`). Every handle in `refs:` appears in a beat. Number motion handles in beat order and mark the one that feeds the turn. User attachments go in the same list.

Batch:

```
in [file], create N [things], [one-line shared description], using [channel] as reference:

1. [item: mechanic + orientation + layout]
2. ...

for all of them: [shared constraints]; keep each ~Ns
no overlap with [existing set]; a valid variation changes the mechanic, orientation, layout or treatment, not just direction or mirror
name them "[Prefix]: [k word description]"
```

Delta: one change per line, numbered when several, each naming its target. `unrelated:` marks a different comp.

```
[for comp,] make [element] [change] [magnitude] [direction with axis] [at Ns]
[get rid of element]
keep [what must stay]
```

Image feedback: `[frame or time it points at]: [one observation, quantified]`, one line each.

## Rules

- **Pick for quality, not for match.** The most striking move or look that can carry the subject beats a keyword hit that shows the right object.
- **Compose a film frame, not a web page.** One hero element takes at least 40% of the frame height at the beat where it matters. The smallest text is at least 24 px at 1080p. Rebuild nothing at 1:1 browser scale. Judge contact sheets at thumbnail size.
- **One reference, one job.** Moving media supplies motion and stills supply look. A motion reference implies a subject swap. List a file twice when it serves two roles, each entry scoped.
- **Use assets, read references.** Real footage, a real GLB, the real UI or the real painting, stylised on top. State the fidelity up front and never re-interpret an uploaded asset. Go procedural only for primitives, orbs, blobs, extrusions, noise fields and things that must grow or morph.
- **Treat each thing as a contraption.** Animate its special mechanism (a lid closes, an envelope seals, a checkbox ticks) instead of a default draw-in. A transformation is an in-process morph, not a teardown and rebuild.
- **Describe the mechanism, not the adjective.** "Editorial page-drag" was built as a slide-in. "The current image is peeled from a corner to reveal the new one already underneath" was built right the first time.
- **Use numbers where the user would.** Seconds for anchors and length, multipliers and degrees in edits, a hex only when the colour is the point (klein blue #002FA7). An opener carries no ms staggers and no px offsets.
- **Edits name an axis, a sense and a phase.** "The other way" is not a direction. "Entrance 5x faster" needs "the fastest entrance we have had, constant speed after".
- **Keep the voice.** "get rid of", "tho", "~5s" and "plz" are fine. Put no greetings, rationale or headings inside the prompt.

## Script

`scripts/find_refs.py` searches are.na channels, resolves Pinterest pins, searches and downloads Sketchfab models, downloads files and builds contact sheets for stills and video. It needs Python 3, `curl` and `ffmpeg`. Run it with no arguments for the command list.

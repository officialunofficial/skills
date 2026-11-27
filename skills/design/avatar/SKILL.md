---
name: avatar
description: Draws any object as a flat character with two capsule eyes, then animates its whole body so it glances, blinks, breathes, follows the pointer and falls asleep.
disable-model-invocation: true
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Avatar

Turn an object into a small living character: one flat silhouette, two capsule eyes, and one loop that moves the whole body.

The gaze, eye, and blink values in [face.js](face.js) were measured off reference footage, so keep them exact. The moods past idle are tuned starting points. Eyes that move while the body holds still are a finding.

Related work belongs elsewhere: gathering references to `gather`, taking a reference animation apart frame by frame to `deconstruct`, offering silhouette variants to the engineering skill `prototype`, interface motion and its 300ms budget to `motion`, frame cost to `frames`, and opening the result to `verify`.

## 1. Study the reference

When the user names a reference character, open its source and step its recording at 10fps. Measure eye size, tilt, spacing, and blink timing off the frames (`avatar-measure-the-reference`).

Keep measured values as measured. A `15.5` degree eye spacing stays 15.5 and a 180ms blink stays 180ms (`avatar-keep-the-measurements`). With no reference, start from `face.js`.

## 2. Draw the silhouette

**One flat shape.** Reduce the object to one solid shape in one saturated colour, with no outline, shading, mouth, or nose (`avatar-flat-silhouette`).

**Small grid.** The character must read at its shipped size, usually 28 to 40px. Draw on a small grid, such as a 14 by 17 viewBox, and crop the viewBox tight to the ink. A part that moves on its own, such as a lid, gets its own path.

**Iconic view.** Pick the view whose outline alone names the object: the side for vessels and tools, the front for devices. Given a role or a hobby, draw its single most iconic object (`avatar-iconic-view`).

**The face part leads.** The part that carries the face is the main mass. Grow it in place until the `head` ellipse, plus one eye width of margin, sits on calm solid fill. Size it for the widest mood: happy eyes are nearly twice as wide as idle eyes. Do not add a block to hold the face or shrink the eyes to fit (`avatar-face-part-leads`).

**Size by outline.** Size every other part by its outline, enclosed space included, not by its fill. Keep it clearly smaller than the face part and extend it only as far as recognition needs (`avatar-size-by-outline`).

**Few details.** Keep the steps that name the object, such as a neck, a lid, or a lip. Drop the rest. Build the shape from one to seven soft primitives that overlap into one outline.

**Clean joins.** Every join is a clear step or a smooth flow. A step is at least half an eye width. A flow runs one edge straight on and buries the inner corners. A part joined at two points stays joined at both. Edges that nearly line up leave a sliver or a notch (`avatar-clean-joins`).

**Holes are openings.** Cut a hole only for a real opening, such as a mug handle or a ring, and wind it against its outline so the fill leaves it open. Slots, buttons, and decorative cut-outs stay solid (`avatar-holes-are-openings`).

**Toy proportions.** No part is thinner than an eye is wide, every corner is rounded, and every taper ends in a soft tip. An organic part, such as a leaf or a flame, keeps its curve and direction (`avatar-toy-proportions`).

**Balance.** Centre the mass on a flat or gently rounded base. Then look at the whole shape at 28px, at rest and mid-lean. If it reads as another object or a broken one, rebalance the parts or change the view, even when every rule above holds.

**Colour.** Colour comes from two variables, `--avatar-body` and `--avatar-eyes`, checked in both themes (`avatar-colour-variables`).

## 3. Put the eyes on a sphere

Draw two white capsules, each about 2.2 times as tall as wide. At rest they sit high and to the right and lean like a backslash, with the head tilted about 12 degrees.

The eyes sit on a sphere behind the face. Yaw, pitch, and roll place them, so they narrow near the edge and fade as they turn behind. `drawEyes` in `face.js` does the projection. Eyes that slide flat across the face are a finding (`avatar-eyes-on-a-sphere`).

Clip both eyes to the silhouette path, inside the group that moves the body (`avatar-clip-to-the-body`).

## 4. Give the whole body life

Nothing holds still.

- **Gaze.** It drifts on layered sine waves and glances to a new spot every 1.5 to 4s. Big glances bring a blink (`avatar-never-still`).
- **Blinks.** Each takes 180ms and closes in the first 45% of that time. Blinks land 1.9 to 4.6s apart, and 18% are doubles (`avatar-irregular-blinks`).
- **Body.** It breathes 1.2% on a 3.4s cycle, floats slightly, and leans toward its gaze a beat late. Eyes settle in about 60ms and the body in 220ms (`avatar-whole-body`).

## 5. Make moods from eye shapes

A mood is one row of numbers: eye width, height, tilt, spacing, openness, and a gaze offset. Moods blend over about 90ms on an exponential ease-out and never overshoot. Do not swap in a separate drawing per mood (`avatar-moods-as-numbers`).

Start from idle, attentive, excited, happy, sleepy, and asleep. Add one or two moves only this object can make, such as a lid that lags behind a hop (`avatar-object-move`).

## 6. Wire the reactions

Each reaction answers one input from the page (`avatar-react-to-the-page`).

| Input | Reaction |
| --- | --- |
| Pointer enters after 6s away | Eyes spin 360 degrees round the back over 1.1s, then follow the pointer |
| Pointer rests on the primary action | Eyes widen and the body bounces slightly |
| Press on the action or the character | A 750ms hop with squash and stretch, then a happy squint back out |
| No input for 24s | Sleepy at 24s, asleep at 30s with slow deep breaths, wakes with a spin |

Clamp the followed gaze to 45 degrees of yaw either side so the eyes stay on the face. Ignore touch pointers for following.

When the character is the main toy on its page, it may also react to distance: curious inside 640px, wary inside 260px, recoiling inside 100px. A poked eye shuts while the other stays open.

## 7. Run it from one loop

- **One loop.** One `requestAnimationFrame` loop steps `createAvatar` from `face.js` and writes SVG attributes through refs. Cap the step at 64ms so a returning tab does not jump. Per-frame state updates are a `frames` concern.
- **Pause offscreen.** Start and stop the loop with an `IntersectionObserver` (`avatar-pause-offscreen`).
- **Render the rest.** Render the resting pose on the server from `restingEyes`, so the first paint already has eyes (`avatar-render-the-rest`).
- **Reduced motion.** Under `prefers-reduced-motion: reduce`, hold the resting pose and start no loop (`avatar-still-when-reduced`).
- **Decorative.** The SVG takes `aria-hidden="true"`.

## 8. Prove it on a contact sheet

One screenshot cannot show motion, and a hidden tab throttles the loop. Run [sheet.js](sheet.js) through the browser's evaluate call, then:

1. Call `window.__avatarSheet.start({ selector })`.
2. Drive each mood with pointer events: idle, enter, hover, press, leave.
3. Call `window.__avatarSheet.stop()` and screenshot the sheet it lays out (`avatar-contact-sheet`).

A `warning` in the result means the tab was hidden or the loop stalled, so frames repeat or gaps widen. Keep the tab visible and sample again. Sleep needs 30s without input, so sample it once on its own.

Finish with the character at its shipped size in both themes, then call `window.__avatarSheet.clear()`.

## Rules and reporting

Read [RULES.md](RULES.md) when reviewing a character or writing findings. It pairs each rule id with a broken case and its replacement, and holds the severity ladder and the finding format.

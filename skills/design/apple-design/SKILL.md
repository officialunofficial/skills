---
name: apple-design
description: Applies Apple's approach to fluid, physical interfaces on the web. Use when building or reviewing gesture-driven UI, spring animation, drag, swipe or sheet interactions, momentum, interruptible transitions, rubber-banding, translucent materials and depth, type tracking and leading, reduced motion, or when a design needs Apple's design principles as a frame.
license: MIT
metadata:
  upstream-author: "Emil Kowalski"
  upstream-source: "emilkowalski/skills"
---

# Apple design on the web

These rules come from Apple's WWDC design talks, mainly Designing Fluid Interfaces (2018), translated to CSS, Pointer Events, `requestAnimationFrame` and spring libraries such as Motion.

An interface feels fluid when it behaves like a physical object. Motion starts from the value on screen, takes the velocity of the user, projects momentum forward, and can be grabbed and reversed at any instant. Springs make this natural, because a spring is interruptible and knows its velocity.

For the build order of a web animation use `animate`. For React Native use `animate-expo`.

## Response

Lag ends the feeling of directness, so remove it first.

- Respond on pointer-down. Highlight a button the instant it is pressed, and commit on release.
- Audit the input path: debounces, timers, transition waits, and the 300ms tap delay. Remove each one that is not essential.
- Give feedback during the interaction, not only at the end. A drag, slider or drawer follows the pointer 1:1 the whole way.

```css
.button:active {
  transform: scale(0.97);
  transition: transform 100ms ease-out;
}
```

## Direct manipulation

A dragged element stays under the finger, at the offset where the user grabbed it. A snap to the element center on grab breaks the illusion.

- Use Pointer Events with `setPointerCapture`, so tracking continues when the pointer leaves the element.
- Keep a short history of position and time from the last few `pointermove` events. You need velocity at release.

```js
el.addEventListener('pointerdown', (e) => {
  el.setPointerCapture(e.pointerId);
  const grabOffset = e.clientY - el.getBoundingClientRect().top;
  // record position and timestamp on each pointermove
});
```

## Interruption

This is the most important rule. The user can grab a moving element mid-flight and reverse it. A modal that is closing follows the finger when grabbed. It does not finish closing first.

- Accept input during every transition.
- Start each animation from the value on screen, not from the target value. On an interruption, read the live transform. A start from the logical value causes a visible jump.
- Do not use CSS transitions or `@keyframes` for motion that a gesture drives. They cannot be grabbed and reversed smoothly.
- When a gesture reverses, carry the velocity into the new animation. A hard cut creates a stop that reads as a wall. Pick a spring library that re-targets from the current velocity.
- Animate X and Y with separate springs. One spring on a 2D distance goes out of sync when the two velocities differ.

## Springs

A scripted animation with a fixed duration cannot respond to new input. A spring can: new input changes the target and the motion stays continuous. Use a spring for anything the user can touch.

Think in two parameters, not in mass, stiffness and damping:

- **Damping ratio** sets overshoot. `1.0` settles with no bounce. Below `1.0` it overshoots, and lower is bouncier.
- **Response** sets how fast the value reaches the target, in seconds. It is not a duration. The settle time comes from both parameters.

Default to damping `1.0`. Add bounce (damping about `0.8`) only when the gesture carried momentum: a flick, a throw, a drag release. Overshoot suits a card the user flicked, not a menu that faded in.

| Interaction | Damping | Response |
| --- | --- | --- |
| Move or reposition, for example picture in picture | `1.0` | `0.4` |
| Rotation | `0.8` | `0.4` |
| Drawer, sheet | `0.8` | `0.3` |

In Motion, the `bounce` and `duration` spring options map closely to damping and response:

```js
import { animate } from 'motion';

// Default: no overshoot
animate(el, { y: 0 }, { type: 'spring', bounce: 0, duration: 0.4 });

// After a flick: a little bounce
animate(el, { y: target }, { type: 'spring', bounce: 0.2, duration: 0.4 });
```

## Velocity handoff

When the gesture ends, the animation continues at the velocity of the finger. No seam shows between the drag and the animation. This detail does the most to separate fluid from adequate.

Pass the release velocity to the spring as its initial velocity. Motion takes absolute px/s in the `velocity` option. Some APIs want relative velocity:

```
relativeVelocity = gestureVelocity / (targetValue - currentValue)
```

Example: the element is at `y=50`, the target is `y=150` and the finger moves at 50px/s. The initial velocity is `50 / 100 = 0.5`.

## Momentum projection

Do not snap to the boundary nearest the release point. Project where the gesture was going, as scroll deceleration does, and snap to the target nearest that point. A flick then throws the element.

```js
// decelerationRate: 0.998 for a normal scroll feel, 0.99 for a snappier one
function project(initialVelocity /* px/s */, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

const projectedEnd = currentPosition + project(releaseVelocity);
const target = nearestSnapPoint(projectedEnd);
animateSpringTo(target, { velocity: releaseVelocity });
```

Use this exponential decay form, not the textbook `v^2 / (2 * decel)`. At release, decide between reverse and commit from the sign of the velocity, not from the position.

## Rubber-banding

At an edge, resist more as the drag goes further. A hard stop reads as frozen. Resistance reads as responsive with nothing more to show.

```js
function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
```

## Spatial consistency

- Enter and exit on the same path. A panel that slides in from the right leaves to the right.
- Anchor a menu, popover or sheet to its trigger. Set `transform-origin` to the trigger, so the relation between button and content is clear.
- Mirror the easing on a reversible transition. Use inverse cubic-bezier control points for the two directions.
- Make the frames in between point at the outcome. People predict the final state from the trajectory. Control Center modules grow up and out toward the finger.

## Gesture details

- **Tap:** highlight on touch-down, commit on touch-up. Add about 10px of hit padding. Let the user cancel by dragging away, and resume by dragging back.
- **Drag or swipe:** wait for about 10px of movement before you commit to a direction, then track 1:1.
- **Several gestures:** detect every plausible gesture from the first move, then cancel the losers when intent is clear. Avoid recognizers that report only a final state, such as a `swipeleft` event. They discard the tracking that feedback needs.
- **Double tap:** its detection delays every single tap. Pay that cost only where a double tap exists.

## Smooth frames

- Keep the position change per frame small enough that the motion does not strobe.
- For very fast motion, a slight motion blur or stretch shows speed better than a sharp streak.
- Animate `transform` and `opacity`, driven by `requestAnimationFrame` or the compositor. Add `will-change` where motion is about to start.

## Motion, sound and haptics

- **Causality:** fire feedback on the event that caused it, such as the toggle flip or the item snap. Match its character to the action.
- **Harmony:** the visual, the sound and the haptic land on the same frame. A CSS transition that lags the Vibration API breaks the effect.
- **Utility:** keep sound and haptics for moments with meaning: success, error, commit, snap. Feedback on everything teaches users to ignore it.

## Reduced motion

Reduced motion means a gentler equivalent, not the absence of feedback. Build these three signals into each component:

- `prefers-reduced-motion: reduce`: replace slides, springs and parallax with short cross-fades. Drop overshoot. Keep the opacity and color changes that explain a state.
- `prefers-reduced-transparency: reduce`: make translucent surfaces solid. Raise the background opacity and drop the blur.
- `prefers-contrast: more`: use near-solid backgrounds with a clear border.

```css
@media (prefers-reduced-motion: reduce) {
  .sheet { transition: opacity 200ms ease; transform: none !important; }
}
@media (prefers-reduced-transparency: reduce) {
  .toolbar { background: white; backdrop-filter: none; }
}
```

For every user, avoid backgrounds that move across the full viewport, slow loops near one cycle per 5 seconds, and sudden brightness jumps. Ease a change between dark and light themes. Make a large object semi-transparent while it travels.

## More reference

- Read [MATERIALS-AND-TYPE.md](MATERIALS-AND-TYPE.md) when the work involves translucent surfaces, blur, depth, scrims, or type tracking, leading and hierarchy.
- Read [PRINCIPLES.md](PRINCIPLES.md) when you judge a whole design, write a critique, or need Apple's eight principles and its process rules.

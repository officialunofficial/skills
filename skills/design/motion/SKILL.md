---
name: motion
description: Sets how interface elements move, with exact values for what animates, easing curves, durations, springs, gestures, exits, motion blur and reduced motion. Use when writing or reviewing a transition, a CSS or Motion animation, a drag or swipe, the entrance or exit of a dialog, menu, popover or drawer, tooltip timing, an icon swap, or `prefers-reduced-motion` handling.
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Motion

These rules set how things move on every screen. Use the project's motion tokens where they exist. Where none exists, the values here are exact. In any visual style, motion that the user starts and that runs past 300ms is a finding.

Neighbouring skills own the rest. `restraint` decides whether an animation should exist. `deconstruct` takes an existing animation apart. `frames` checks frame rate. `defaults` owns surfaces, loading, hover styles and sound.

Each rule ends with its rule id. Cite that id in a finding.

- Read [checks.md](checks.md) when you review motion. It pairs each id with a broken line, its replacement and a severity.
- Read [recipes.md](recipes.md) when you write the code for a rule that points to it.
- Read [motion-blur.md](motion-blur.md) before you add or review a blur streak on a moving element.

## What animates

- App chrome fades. Page switches, panels and loading states animate `opacity` only, with no slide and no scale (`motion-opacity-for-chrome`).
- Animate only the axis that changes. If only the height changes, leave the width alone (`motion-changing-axis-only`).
- Entrances do not replay on a page switch. Set `initial={false}` on the route-level `AnimatePresence` and on any that wraps a state swap (`motion-no-replay-on-entry`). Recipe: [route transitions](recipes.md#route-transitions).
- A cached view renders at once, with no fade and no skeleton flash (`motion-no-flash-on-return`).
- Frequent actions do not animate: typing, keyboard shortcuts, keyboard navigation and fast toggles. A command palette opened from the keyboard appears at once. A context menu appears at once and may fade out (`motion-no-motion-on-repeat`).
- Hover colour changes are instant, with no transition (`motion-instant-hover-color`).

## How a transition is built

- List the properties a transition animates, usually `opacity` and `transform`. Do not write `transition: all` (`motion-name-the-properties`).
- Use a transition or a spring for a toggled state, because both retarget when the user reverses. Keep keyframes for a sequence that runs once (`motion-transitions-for-state`).
- Start motion where it comes from. A dropdown or popover scales from its trigger, with `transform-origin` set to that edge. A modal stays centred, because no trigger anchors it (`motion-origin-from-trigger`).
- Start an entrance from `scale(0.95)` or higher together with `opacity: 0`. Nothing grows from `scale(0)` (`motion-no-scale-from-zero`).

## Curves

- A system change such as a toast uses easing, not a spring.
- Entrances and exits ease out. A change of view eases in and out. Linear is for progress bars and clocks only (`motion-ease-by-direction`).
- The `ease-out` keyword is too weak. Use `cubic-bezier(0.23, 1, 0.32, 1)` to enter and exit. Use `cubic-bezier(0.77, 0, 0.175, 1)` for movement on screen (`motion-strong-ease-out`).

## Durations

| Motion | Duration |
| --- | --- |
| Hover colour | Instant |
| Press and hover movement | 120 to 180ms |
| Small state change | 180 to 260ms |
| Anything else the user starts | 300ms at most |
| Full panel or drawer | 400ms at most |

- A dropdown that takes 500ms is `motion-under-300ms`.
- A close runs shorter than its open, for example 200ms in and 150ms out. Nothing delays a close or a hover-out (`motion-close-faster`).
- Under `mode="wait"` the exit and the entrance play in series, so halve each.
- When motion feels slow, shorten it before you change the curve.

Sample values for each kind of motion are in [curves and durations](recipes.md#curves-and-durations).

## Gestures

- Drag, swipe and any motion the user can reverse mid-flight use a spring. On release, pass the pointer velocity into the spring (`motion-spring-for-gestures`). Recipe: [drag release](recipes.md#drag-release).
- A swipe dismisses on distance or on speed. Above about `0.11` px per millisecond, a short flick is enough (`motion-flick-dismisses`).
- A drag past a boundary meets growing friction, not a wall (`motion-friction-at-edges`). Recipe: [flick to dismiss](recipes.md#flick-to-dismiss).
- Capture the pointer when a drag starts, and ignore extra touches.
- Every drag, swipe or pinch also works with a click and with the keyboard. A list that reorders only by drag fails (`motion-gesture-alternative`).

## Tooltips, icons and cross-fades

- The first tooltip in a group opens after a delay. While one shows, its neighbours open at once with no animation. Every tooltip closes instantly (`motion-tooltip-delay`).
- An icon that swaps in place, such as copy to copied, cross-fades. Scale runs `0.25` to `1`, opacity `0` to `1` and blur `4px` to `0` (`motion-icon-crossfade`). Recipe: [icon swap](recipes.md#icon-swap).
- Two icons in the morph form from `icons` morph instead. Animate the `d` of each path as a small state change on the movement curve. Under reduced motion they cross-fade (`motion-icon-morph`). Recipe: [icon morph](recipes.md#icon-morph).
- When a cross-fade still reads as two objects, add `filter: blur(2px)` while it runs. Keep blur under 20px, because larger values are expensive in Safari (`motion-blur-the-crossfade`).

## Presses and stagger

- A pressed control scales to `0.98`. Squash and stretch stay within `0.95` to `1.05` (`motion-press-scale`).
- List items stagger by less than 50ms each (`motion-short-stagger`).
- A staged entrance that plays once, such as a title, text and actions, staggers by 100ms.
- Routine interactions do not stagger, and a stagger never blocks input.

## Exits and size

- A conditional element with an `exit` sits inside `AnimatePresence`. Key it by a stable id, and exit to its `initial` values (`motion-exit-in-presence`). Recipe: [exits](recipes.md#exits).
- A dialog from a component library stays mounted and toggles its `open` prop. A dialog behind `open &&` loses its close animation (`motion-dialogs-stay-mounted`).
- To animate the width or height of a container, measure an inner element with a `ResizeObserver` and animate the outer one. Do not measure and animate the same node (`motion-measure-inner`). Recipe: [container bounds](recipes.md#container-bounds).
- While a panel collapses, its content keeps its open width, so nothing reflows mid-animation (`motion-hold-content-size`).

## Reduced motion

When `prefers-reduced-motion: reduce` matches, every slide, scale and blur becomes an opacity cross-fade (`motion-reduced-motion`).

## Reporting

Write one finding per root cause:

```
file:line - [rule-id] what is wrong
```

Then add a `Rule | Count | Severity` summary. Take the severity from [checks.md](checks.md). The verdict is `Block` while any `HIGH` finding remains, and `Approve` otherwise.

Approve only files you read. Play the motion when a check depends on timing. Mark each check you could not run as `Not verified`.

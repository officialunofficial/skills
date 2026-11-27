---
name: animate
description: Builds a web animation from scratch and writes the code. Decides in order whether it should animate at all, its purpose, the tool, the properties, the easing and duration or spring, how it interrupts and exits, and reduced motion. Use when asked to animate something, add motion, build a transition, or make a component feel alive. For React Native or Expo use animate-expo. To critique existing motion use review-animations. To audit a whole codebase use improve-animations.
license: MIT
metadata: {upstream-author: "Emil Kowalski", upstream-source: "emilkowalski/skills"}
---

# Animate

Turn a request for motion into code that passes `review-animations` on the first try. Make each decision yourself, give the reason in one line, and write the code. Offer one answer, not a menu.

Two things go wrong. The worse one is animating something that should stay still, so step 1 sometimes ends the task with zero lines of animation, and that is a good result. The other is the right animation built from the wrong parts: `ease-in` on an entrance, `scale(0)`, keyframes on a toast, a dropdown that takes 400ms.

Ground rules:

- Run the steps in order. Steps 1 and 2 decide whether anything gets built.
- Take every curve, duration and spring config from this file. Do not type one from memory.
- Use the easing and duration tokens the codebase already has. Add to that set instead of starting a second one.
- Reduced motion and hover gating land in the same change as the animation.
- Use the cheapest tool that does the job. A fade does not need a motion library.

Out of scope: auditing a codebase (`improve-animations`), critiquing a diff (`review-animations`), finding places to animate (`find-animation-opportunities`), React Native (`animate-expo`).

## 1. Should it animate?

| How often the user sees it | Decision |
| --- | --- |
| 100+ times a day (keyboard shortcuts, command palette toggle) | No animation. Stop here. |
| Tens of times a day (hover, list navigation) | Fast and barely visible, or nothing |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare or first-time (onboarding, success, celebration) | Delight is allowed here |

A keyboard-initiated action never animates. Raycast opens and closes with no animation, which is right for something used hundreds of times a day: any duration reads as lag.

If the request fails here, say so and offer the still alternative: an instant state change or a static affordance.

## 2. What is the purpose?

Name one before continuing:

- **Feedback**: the interface confirms it heard the user.
- **Spatial consistency**: shows where something came from or went.
- **State indication**: makes a state change readable.
- **Preventing a jarring change**: bridges content that would otherwise teleport.
- **Explanation**: shows how a feature works. Marketing and onboarding only.
- **Delight**: only at the rare or first-time tier.

If none fits, do not build it. "It looks cool" on something seen often is a reason to stop. Data the user is reading or acting on does not move for style: a mouse-tracking effect suits a marketing page, not a chart in a banking app.

## 3. Pick the tool

Take the first row that fits.

| Need | Tool |
| --- | --- |
| Hover, press, color, a state toggled by a class or attribute | CSS transition |
| Entry on mount with no JS state | CSS `@starting-style` |
| Fixed motion that must stay smooth while the page loads | CSS animation |
| Programmatic control without a library | WAAPI (`element.animate()`) |
| Springs, layout animation, exit animation, gesture-driven values | Motion (`motion.dev`) |

CSS animations run off the main thread. A `requestAnimationFrame` loop drops frames while the browser loads, runs scripts or paints. So use CSS for motion known in advance and JS for dynamic, interruptible motion.

If the request is really for a component (toast, drawer, command menu, dropdown), stop and use `pick-ui-library`. A hand-rolled one usually lacks focus management.

## 4. Pick the properties

- Animate `transform` and `opacity`. They skip layout and paint. `width`, `height`, `margin`, `padding`, `top` and `left` trigger both. `clip-path` is also fine. `height` is acceptable only for an accordion, which has no transform equivalent.
- Start an entrance from `scale(0.9)` to `scale(0.97)` with `opacity: 0`, never from `scale(0)`. Nothing real appears from nothing.
- Popovers, dropdowns, menus and tooltips grow from their trigger: `transform-origin: var(--transform-origin)` in Base UI. A modal has no trigger anchor, so it stays centered.
- Percentages in `translate()` are relative to the element's own size. `translateY(100%)` moves it by its own height whatever the content, so prefer it to fixed pixels.
- Set `transform` on the element that moves. A CSS variable on a parent that a child's transform reads recalculates styles for every child on every frame.
- Motion's `x`, `y`, `scale` and `rotate` props are hardware accelerated from version 14.2. On older versions, use the string form when the page is busy:

```jsx
<motion.div animate={{ x: 100 }} />                          // accelerated from motion 14.2
<motion.div animate={{ transform: "translateX(100px)" }} />  // accelerated in every version
```

## 5. Easing and duration, or a spring

| Situation | Easing |
| --- | --- |
| Entering or exiting | `ease-out` |
| Moving or morphing on screen | `ease-in-out` |
| Hover or color change | `ease` |
| Constant motion (marquee, progress) | `linear` |
| Anything else | `ease-out` |

Do not use `ease-in` on UI. It starts slow, which delays the moment the user is watching. At the same 200ms, `ease-out` feels faster.

The built-in CSS keywords are too weak for deliberate motion. Use these curves:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* UI entrances and exits */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* movement on screen */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* iOS-like drawer */
```

For any other curve, take one from easing.dev or easings.co.

| Element | Duration |
| --- | --- |
| Button press | 100-160ms |
| Tooltip, small popover | 125-200ms |
| Dropdown, select | 150-250ms |
| Modal, drawer | 200-500ms |
| Marketing, explanation | Can be longer |

Keep UI animation under 300ms. A 180ms dropdown feels more responsive than a 400ms one.

Use a spring instead of a duration for drag with momentum, a gesture the user can interrupt or reverse, an element that should feel alive, or decorative mouse tracking:

```js
{ type: "spring", duration: 0.5, bounce: 0.2 }            // default
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }  // when you need physical control
```

Keep `bounce` between 0.1 and 0.3. Reserve visible bounce for drag-to-dismiss and playful moments.

## 6. Interruption and exit

- Use a transition, not keyframes, for anything the user can trigger twice in a second (toasts, toggles). A transition retargets from the current value. Keyframes restart from zero.
- Use a spring for gestures. It carries velocity through an interruption.
- Exit along the entry path. A toast that slides up from the bottom leaves through the bottom. That symmetry is what makes swipe-to-dismiss obvious.
- Make timing asymmetric where the user is deciding. A hold-to-confirm fill runs 2s linear on press and snaps back in 200ms `ease-out` on release.

## 7. Reduced motion and pointer gating

```css
@media (prefers-reduced-motion: reduce) {
  .element { animation: fade 0.2s ease; } /* keep opacity and color, drop movement */
}

@media (hover: hover) and (pointer: fine) {
  .element:hover { transform: scale(1.05); } /* a tap on touch fires a false hover */
}
```

```jsx
const reduce = useReducedMotion();
const closedX = reduce ? 0 : "-100%";
```

Reduced motion means fewer and gentler animations, not none. Keep the transitions that aid understanding and remove position changes.

## Recipes

Read [RECIPES.md](RECIPES.md) when the request is a button press, dropdown, tooltip, modal, drawer, toast, accordion, stagger, hold-to-confirm, tab indicator, scroll reveal, drag-to-dismiss, or a crossfade that will not settle. Start from the recipe and adapt it.

## Self-check

Each row blocks a change in `review-animations`.

| Do not write | Write instead |
| --- | --- |
| `transition: all` | The exact properties |
| `scale(0)` entrance | `scale(0.95)` with `opacity: 0` |
| `ease-in` on UI | `ease-out` or `--ease-out` |
| Built-in `ease-out` on a deliberate animation | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Animation on a keyboard shortcut or a 100+ a day action | No animation |
| UI duration over 300ms without a reason | 150-250ms |
| `transform-origin: center` on a trigger-anchored popover | `var(--transform-origin)` |
| Keyframes on toasts and toggles | CSS transitions |
| Animated `width`, `height`, `margin`, `padding`, `top`, `left` | `transform` and `opacity` |
| Motion `x`, `y`, `scale` on a busy page before 14.2 | Upgrade, or the `transform` string |
| Ungated `:hover` motion | `@media (hover: hover) and (pointer: fine)` |
| No `prefers-reduced-motion` branch | A gentler variant |
| A group that enters all at once | A 30-80ms stagger |

## Output

Write the code. Then add at most a few lines:

- **Gate**: the frequency tier and the purpose. If you rejected part of the request, say which part and why.
- **Parts**: tool, properties, curve, and duration or spring config.
- **Feel check**: if the result depends on feel that code cannot show (a crossfade, a spring's bounce, opacity against height in a list), say so. Point at the check: play it at 2x to 5x duration or in the DevTools animation inspector, step through frames, test gestures on a real device, and look again the next day.

The code is the deliverable, so keep the notes short.

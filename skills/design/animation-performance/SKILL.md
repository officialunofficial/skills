---
name: animation-performance
description: Diagnoses and fixes web animations that drop frames. Covers the layout, paint and composite pipeline, cheaper property swaps, CSS and WAAPI against requestAnimationFrame, the accelerated path in Motion, React re-renders per frame, inherited CSS variables, blur cost, and when will-change helps. Use when an animation is janky, choppy or stutters, when choosing which property to animate, or when reaching for will-change or GPU layers. For easing, duration or whether to animate at all, use animate.
license: MIT
metadata: {upstream-author: "Emil Kowalski", upstream-source: "emilkowalski/skills"}
---

# Animation performance

Make each frame finish in time. The question here is not "does it look right?" but "does the browser hit the frame deadline on a slow device?". Easing and duration belong to `animate`, whether motion should exist belongs to `review-animations`, and React Native threads belong to `animate-expo`.

Good motion at 30fps reads as bad motion. Performance is what lets the easing and timing register at all.

## Rules

- Animate `transform` and `opacity` by default. If a cheaper property gives the same picture, use it, even when the expensive one seems fine on your machine.
- Name the cause before changing code. Every fix states which cause below it addresses. "Added `will-change`, seems smoother" is not a diagnosis.
- A fast laptop hides almost every problem here. The bar is a mid-range phone. Say which findings you confirmed from code and which need a recording on a real device.
- List exact properties in a transition. `transition: all` animates whatever changes next, including layout properties nobody meant to animate.
- Choose properties first. Hardware acceleration is something the browser may grant. The property you animate is something you control.
- `will-change` is the last step. Most jank comes from the wrong property or a busy main thread, and `will-change` fixes neither.

## Symptoms

Match what the user sees, then read the matching section.

| Symptom | Fix |
| --- | --- |
| Animation stutters | Animate `transform` or `opacity` instead of `width`, `height`, `top`, `margin` |
| Shadow animation is choppy | `filter: drop-shadow()` |
| Jank only during navigation or loading | Move the animation to CSS or WAAPI |
| Motion `x` or `y` drops frames | Upgrade to `motion` 14.2+, or animate the full `transform` string |
| Hand-rolled animation drops frames in React | Write to `ref.current.style`, not state |
| Drag gets slower as the list grows | Set `transform` directly instead of through an inherited CSS variable |
| Blur transition lags, most of all in Safari | Keep animated `blur()` under 20px |
| Unexpected properties animate | Replace `transition: all` with explicit properties |
| Element shifts 1px as motion starts or ends | `will-change: transform` |

## The frame budget

At 60fps the browser has 16.7ms per frame. At 120Hz, which most phones and many laptops now run, it has 8ms. Design for 8ms. For scale, one layout pass on a complex page can exceed 100ms, which is a dozen missed frames.

Two things decide whether a frame fits: what you animate (the cost per frame) and where it runs (whether other work can block it).

## What you animate

The browser runs up to three steps per visual change: layout (size and position of every element), paint (draw into layers), composite (put layers on screen).

| Tier | Properties | Cost |
| --- | --- | --- |
| Composite only | `transform`, `opacity`. In current Chrome and Firefox also `filter`, `clip-path`, `background-color` | Lowest. The element gets its own layer. |
| Paint and composite | `box-shadow`, `border-radius`, `color` | A redraw every frame |
| Layout, paint and composite | `width`, `height`, `padding`, `margin`, `top`, `left`, `border-width` | Highest. One growing element can move everything near it. |

Test anything in the first tier other than `transform` and `opacity` across browsers. Support is uneven.

Swap down a tier:

| Instead of | Animate |
| --- | --- |
| `width`, `height`, `padding` to grow or shrink | `scale()` |
| `top`, `left`, `margin` to move | `translate()` |
| `display` or `visibility` swaps | `opacity` |
| `box-shadow` | `filter: drop-shadow()` |

The shadow swap is the one people miss: an animated `box-shadow` repaints the element every frame.

A layout animation does not always drop frames. An absolutely positioned element with few children may animate `padding` at no visible cost. But `padding` and `scale()` look the same, and only `scale()` cannot regress on a slower device. Layout properties also move neighbours: a sidebar that animates `margin-left` re-lays out the dashboard beside it 60 times a second, and `translateX` does not.

## Where it runs

| Driver | Thread |
| --- | --- |
| JS with `requestAnimationFrame` (GSAP, Motion layout animations) | Main thread, always |
| WAAPI (`element.animate()`, Motion's `animate()` and `motion/react` components) | Can run off the main thread |
| CSS transitions and keyframes | Can run off the main thread |

An animation off the main thread stays smooth whatever JavaScript is doing. "JS" does not mean "main thread": a library that hands off to WAAPI can be accelerated, and a rAF loop cannot. `transform` and `opacity` accelerate reliably. `filter`, `clip-path` and `background-color` are gaining support.

Watch for motion that plays while the page does heavy work: page transitions, tab indicators during navigation, anything next to data fetching or hydration. Example: a dashboard tab indicator built as a Motion shared layout animation dropped frames because the browser was loading the next page at that moment. A CSS animation fixed it.

Motion hands `opacity`, `transform`, `clip-path` and `filter` to WAAPI. The `x`, `y`, `scale` and `rotate` props depend on the version:

```jsx
<motion.div animate={{ x: 100 }} />                          // 14.2+: accelerated. Before: main thread
<motion.div animate={{ transform: "translateX(100px)" }} />  // accelerated in every version
```

From 14.2, keep the props. On older versions, use the string form when the animation must survive a busy main thread. In every version these stay on the main thread: `layout`, `layoutId`, `onUpdate`, `transformTemplate`, inertia, and values a motion value drives each frame (drag, `useTransform`).

Acceleration is progressive enhancement. Browsers decline it under conditions that change between versions. Chrome, for example, did not accelerate percentage transforms for a long time. Keep `translateY(100%)` anyway. Percentages are correct for elements of unknown size, and a correct layout beats a best-effort optimization.

## React: write styles, not state

Animation libraries run outside the render cycle. A hand-rolled animation that calls `setState` each frame re-renders the component every 16.7ms, and the render alone exceeds the budget.

```jsx
setY(nextY);                                            // one re-render per frame
ref.current.style.transform = `translateY(${nextY}px)`; // no re-render
// or with a motion value: y.set(nextY)
```

Look for state updates inside `requestAnimationFrame`, `pointermove`, `scroll` and drag handlers.

## Two traps that use transform and still drop frames

**Inherited CSS variables.** A drawer's drag got slow once it held more than about 20 items, with no re-renders. The drag distance went into a CSS variable that `translateY()` read:

```js
const style = { "--swipe-amount": `${draggedDistance}px` };          // restyles every descendant, every frame
const style = { transform: `translateY(${draggedDistance}px)` };     // touches this element only
```

Variables inherit, so a change on a parent recalculates styles for every child. Suspect this whenever a `transform` animation degrades as content grows.

**Blur.** `filter: blur()` gets expensive fast, most of all in Safari. Keep animated blur under 20px. 2-5px is enough to soften a crossfade.

## will-change

A browser can move an animation from CPU to GPU mid-flight, and that hand-off can shift the element by a pixel at the start or end. `will-change: transform` promotes the element up front, so no hand-off happens.

Add it only after you see the shift or measure dropped frames. Browsers already promote elements that animate `transform` or `opacity`, so on the common path it does nothing, and every promoted layer costs GPU memory. Put it on the element that animates, never on `*` or a large container. It pays off on an expensive paint such as a large blurred element: promote it and keep the layer small.

## JS animation is fine

Main-thread animation suffers only when the page is busy during it. Motion gives you what CSS cannot: real springs, shared layout animation, exit animation for unmounted components, momentum gestures. Default split: CSS for simple motion and anything that plays while the page is busy, Motion for complex, interruptible, gesture-driven motion.

## Workflow

**1. List what animates.** One row per animation in scope: element, driver, properties, and what else is happening while it plays (route change, drag, hover). Expand `transition: all` and Motion props into the properties they really animate.

**2. Diagnose.** Work down this list. It is ordered by how often each is the cause.

1. Which properties animate? Anything other than `transform` and `opacity` is the first suspect. Check layout properties, then `box-shadow` and `border-radius`, which are easy to miss.
2. Does the jank coincide with navigation, fetching, hydration or a long task? Move the animation to CSS or WAAPI.
3. Does React re-render per frame?
4. Does it get worse as content grows? Look for an inherited CSS variable, or too many nodes animating at once.
5. Is a CSS variable animated at all, or Motion `x`, `y`, `scale` on a version before 14.2?
6. Is any animated `blur()` above 20px?
7. Still shifting or stuttering? Now add `will-change: transform` to the animating element.

Confirm with a recording: the DevTools Performance panel for dropped frames and long tasks, the Animations panel to slow motion down. Profile a real mid-range phone over remote debugging. Desktop CPU throttling models a slow CPU, not a weak GPU or a small memory budget.

**3. Report.** One block per finding, ordered by cost (layout before paint, busy main thread before idle):

```
**[Element]**: file.tsx:42
Cause: [one of the causes above]
Before: transition: all 200ms (animates padding, triggers layout)
After: transition: transform 200ms with scale(0.97)
Verified: from code | needs a device recording
```

Then stop. Apply the fixes when asked.

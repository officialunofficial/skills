# Techniques

Code and detail for the rules in SKILL.md.

## Contents

- Component CSS: tooltip, toast entrance, blur crossfade, stagger
- Transforms: percentages, scale, 3D, origin
- clip-path: inset, tabs, hold to delete, scroll reveal, comparison slider
- Gestures: momentum dismissal, boundary friction, pointer capture, multi-touch
- Performance: CSS variables, Motion, CSS against JS, WAAPI
- Reduced motion
- Debugging
- Building a component people adopt

## Component CSS

### Tooltip

The first tooltip waits. While one is open, the next opens with no delay and no animation.

```css
.tooltip {
  transition: transform 125ms ease-out, opacity 125ms ease-out;
  transform-origin: var(--transform-origin);
}

.tooltip[data-starting-style],
.tooltip[data-ending-style] {
  opacity: 0;
  transform: scale(0.97);
}

.tooltip[data-instant] {
  transition-duration: 0ms;
}
```

### Entrance with @starting-style

`@starting-style` animates an element on entry with no JavaScript. It replaces the React pattern that sets `mounted` in `useEffect` and styles `data-mounted`. Use that pattern only where browser support requires it.

```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;

  @starting-style {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

The toast uses a transition, not keyframes, because toasts arrive fast and a transition re-targets from its current value.

### Blur for a crossfade

When a crossfade between two states looks wrong after you tried other easings and durations, add `filter: blur(2px)` during the transition. Without blur the eye sees two objects that overlap. Blur blends them into one change.

```css
.button-content {
  transition: filter 200ms ease, opacity 200ms ease;
}

.button-content.transitioning {
  filter: blur(2px);
  opacity: 0.7;
}
```

### Stagger

```css
.item {
  opacity: 0;
  transform: translateY(8px);
  animation: fadeIn 300ms ease-out forwards;
}

.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
.item:nth-child(4) { animation-delay: 150ms; }

@keyframes fadeIn {
  to { opacity: 1; transform: translateY(0); }
}
```

### Opacity with height

When an item enters or leaves a list, its opacity change must suit its height animation. No formula exists for this pair. Adjust by eye, then look again the next day.

## Transforms

- **Percentages are relative to the element.** `translateY(100%)` moves an element by its own height at any size. Sonner places toasts this way, and Vaul hides the drawer this way before it enters. Use percentages before pixel values.
- **`scale()` scales the children.** The text and icons of a pressed button shrink with it. That is the intended effect.
- **`transform-origin` is the anchor of each transform.** The default is the center. Set it to the trigger.
- **3D needs `transform-style: preserve-3d` on the wrapper.** With `rotateX()` and `rotateY()` you get orbits and coin flips in CSS alone:

```css
.wrapper { transform-style: preserve-3d; }

@keyframes orbit {
  from { transform: translate(-50%, -50%) rotateY(0deg) translateZ(72px) rotateY(360deg); }
  to   { transform: translate(-50%, -50%) rotateY(360deg) translateZ(72px) rotateY(0deg); }
}
```

## clip-path

`clip-path: inset(top right bottom left)` clips a rectangle. Each value cuts in from that side. It animates on the compositor and needs no extra elements.

```css
.hidden  { clip-path: inset(0 100% 0 0); } /* hidden from the right */
.visible { clip-path: inset(0 0 0 0); }
```

- **Tabs with an exact color change.** Duplicate the tab list and style the copy as active. Clip the copy so only the active tab shows. Animate the clip when the tab changes. Separate color transitions cannot match this.
- **Hold to delete.** Put a colored overlay on the button with `inset(0 100% 0 0)`. On `:active` it fills over 2s linear. On release it returns in 200ms ease-out. Add `scale(0.97)` on the button.

```css
.overlay {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 200ms ease-out;   /* release: fast */
}
.button:active .overlay {
  clip-path: inset(0 0 0 0);
  transition: clip-path 2s linear;        /* press: slow and deliberate */
}
```

- **Image reveal on scroll.** Start at `inset(0 0 100% 0)` and animate to `inset(0 0 0 0)` when the element enters the viewport. Use `IntersectionObserver`, or `useInView` from Motion with `{ once: true, margin: "-100px" }`.
- **Comparison slider.** Stack two images. Clip the top one with `inset(0 50% 0 0)` and set the right value from the drag position.

## Gestures

### Momentum dismissal

Do not require a drag past a distance threshold alone. A quick flick is enough. Dismiss when the distance passes the threshold or the velocity passes about 0.11 px/ms.

```js
const timeTaken = new Date().getTime() - dragStartTime.current.getTime();
const velocity = Math.abs(swipeAmount) / timeTaken;

if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
  dismiss();
}
```

### Boundary friction

When the user drags past a boundary, such as a drawer pulled up at its top position, let the element move less the further the drag goes. Real things slow down before they stop. Do not block the drag. `apple-design` has the rubber-band function.

### Pointer capture

When a drag starts, capture the pointer on the element. The drag then continues when the pointer leaves the element bounds.

### Multi-touch

Ignore more touch points after the drag starts. Without this guard, a change of finger makes the element jump.

```js
function onPress() {
  if (isDragging) return;
  // start the drag
}
```

## Performance

### CSS variables inherit

A change to a CSS variable on a parent recalculates styles for every child. In a drawer with many items, an update to `--swipe-amount` on the container is expensive. Set `transform` on the element.

```js
// Recalculates every child
element.style.setProperty('--swipe-amount', `${distance}px`);

// Affects this element only
element.style.transform = `translateY(${distance}px)`;
```

### Motion and hardware acceleration

From `motion` 14.2, the shorthand props (`x`, `y`, `scale`, `rotate`) are hardware-accelerated on HTML elements. Before 14.2 they run on the main thread and drop frames under load. On those versions, pass the full `transform` string:

```jsx
<motion.div animate={{ transform: "translateX(100px)" }} />
```

These run on the main thread in every version: layout animations (`layout`, `layoutId`), animations with `onUpdate` or `transformTemplate`, inertia, and values a motion value drives each frame (drag, `useTransform`).

### CSS against JS under load

When the browser loads a page, anything on `requestAnimationFrame` drops frames, and that includes Motion layout animations. CSS animations stay smooth. The Vercel dashboard tab animation used shared layout animation and dropped frames during page loads. A change to CSS animation fixed it.

### WAAPI

The Web Animations API gives JavaScript control at CSS performance. It is hardware-accelerated and interruptible, and needs no library.

```js
element.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }], {
  duration: 1000,
  fill: 'forwards',
  easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
});
```

## Reduced motion

Animation can cause motion sickness. Reduced motion means fewer and gentler animations, not none.

```css
@media (prefers-reduced-motion: reduce) {
  .element {
    animation: fade 0.2s ease; /* no transform movement */
  }
}
```

```jsx
const shouldReduceMotion = useReducedMotion();
const closedX = shouldReduceMotion ? 0 : '-100%';
```

## Debugging

- **Slow it down.** Raise the duration to 2 to 5 times normal, or slow playback in the DevTools animation inspector. Check four things: colors change smoothly with no overlap of two states, the easing does not start or stop abruptly, the transform origin is correct, and the animated properties stay in sync.
- **Step frame by frame** in the Chrome DevTools Animations panel. This shows timing errors between coordinated properties.
- **Look again the next day.** Fresh eyes find what you missed.
- **Test touch on a phone.** Connect it by USB, open the dev server by IP address, and use Safari remote devtools. The Xcode Simulator works, but hardware is better for gestures. `mobile-native` has the full steps.

## Building a component people adopt

These lessons come from Sonner and apply to any component library.

1. **Keep adoption cheap.** No hooks, no context, no setup. Insert `<Toaster />` once and call `toast()` from any file.
2. **Defaults matter more than options.** Most users never customize, so the default easing, timing and look are the product.
3. **A name gives identity.** "Sonner" is more memorable than "react-toast". Trade some discoverability for a name people remember.
4. **Handle edge cases with no visible sign.** Pause toast timers when the tab is hidden. Fill the gaps between stacked toasts with pseudo-elements so hover holds. Capture the pointer during a drag.
5. **Use transitions for dynamic UI.** See the toast entrance above.
6. **Build a documentation site people can touch.** Interactive examples with code to copy lower the cost of a first try.
7. **Keep it cohesive.** The easing, duration, visual design and name fit one mood.

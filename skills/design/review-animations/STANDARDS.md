# Animation standards

The exact values and rules behind the review. Cite these in findings.

## Contents

- Should it animate?
- Easing
- Duration
- Physicality
- Springs
- Interruptibility
- Asymmetric timing
- Performance
- Transforms and clip-path
- Gestures and drag
- Crossfades
- Stagger
- Accessibility
- Debugging
- Cohesion

## Should it animate?

| Frequency | Decision |
| --- | --- |
| 100+ times a day (keyboard shortcuts, command palette toggle) | No animation |
| Tens of times a day (hover, list navigation) | Remove or reduce sharply |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare or first-time (onboarding, feedback, celebration) | Delight is allowed |

Keyboard-initiated actions never animate. They repeat hundreds of times a day, and animation makes them feel slow and disconnected. Raycast opens and closes with none.

Valid purposes: spatial consistency, state indication, explanation, feedback, preventing a jarring change.

## Easing

| Situation | Easing |
| --- | --- |
| Entering or exiting | `ease-out` |
| Moving or morphing on screen | `ease-in-out` |
| Hover or color change | `ease` |
| Constant motion (marquee, progress) | `linear` |
| Anything else | `ease-out` |

No `ease-in` on UI. It starts slow and delays the moment the user is watching. At the same 200ms, `ease-out` feels faster.

The built-in keywords are too weak. Use:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* UI entrances and exits */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* movement on screen */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* iOS-like drawer */
```

Take other curves from easing.dev or easings.co.

## Duration

| Element | Duration |
| --- | --- |
| Button press | 100-160ms |
| Tooltip, small popover | 125-200ms |
| Dropdown, select | 150-250ms |
| Modal, drawer | 200-500ms |
| Marketing, explanation | Can be longer |

UI animation stays under 300ms. A 180ms dropdown feels more responsive than a 400ms one. A faster spinner makes the same load feel shorter. After the first tooltip in a toolbar, the rest open with no delay and no animation.

## Physicality

- Start from `scale(0.9)` to `scale(0.97)` with `opacity: 0`, never `scale(0)`.
- Popovers scale from the trigger: `transform-origin: var(--transform-origin)` in Base UI. Modals appear centered and keep `transform-origin: center`.
- Press feedback on any pressable element: `transform: scale(0.97)` on `:active` with `transition: transform 160ms ease-out`. Keep the scale between 0.95 and 0.98.

## Springs

A spring simulates physics and has no fixed duration. Use one for drag with momentum, elements that should feel alive (the Dynamic Island), gestures the user can interrupt, and decorative mouse tracking.

```js
{ type: "spring", duration: 0.5, bounce: 0.2 }            // default
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }  // physical control
```

Keep bounce between 0.1 and 0.3, and keep visible bounce for drag-to-dismiss and playful interactions. A spring keeps its velocity when interrupted, which suits gestures the user may reverse.

For decorative mouse tracking, interpolate through `useSpring`. A value tied straight to the pointer has no momentum and feels artificial.

## Interruptibility

A CSS transition can be interrupted and retargeted. Keyframes restart from zero. For anything triggered rapidly, such as toasts and toggles, use a transition.

```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;
  @starting-style { opacity: 0; transform: translateY(100%); }
}
```

`@starting-style` gives entry without JS. Older fallback: `useEffect(() => setMounted(true), [])` with a `data-mounted` attribute.

## Asymmetric timing

Slow where the user decides, fast where the system responds.

```css
.overlay { transition: clip-path 200ms ease-out; }            /* release */
.button:active .overlay { transition: clip-path 2s linear; }  /* press */
```

## Performance

- Animate `transform` and `opacity` only. They skip layout and paint. `padding`, `margin`, `height`, `width`, `top` and `left` trigger all three steps.
- Set `transform` on the element itself. A CSS variable on a parent recalculates styles for every child:

```js
element.style.setProperty("--swipe-amount", `${d}px`); // restyles all children
element.style.transform = `translateY(${d}px)`;        // this element only
```

- Motion's `x`, `y` and `scale` props are hardware accelerated from `motion` 14.2. Before that they run on the main thread and drop frames under load, so upgrade or use the string form. `layout` and `layoutId` run on the main thread in every version.

```jsx
<motion.div animate={{ x: 100 }} />                          // accelerated from 14.2
<motion.div animate={{ transform: "translateX(100px)" }} />  // accelerated in every version
```

- CSS animations run off the main thread and beat rAF-based JS while the browser loads, runs scripts or paints. Use CSS for motion known in advance and JS for dynamic, interruptible motion.
- WAAPI gives JS control at CSS cost, with no library:

```js
element.animate(
  [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }],
  { duration: 1000, fill: "forwards", easing: "cubic-bezier(0.77, 0, 0.175, 1)" }
);
```

## Transforms and clip-path

- `translate` percentages are relative to the element's own size. `translateY(100%)` moves by the element's height whatever its content, which is how Sonner and Vaul place toasts and drawers. Prefer it to fixed pixels.
- `scale()` scales children too (text, icons). That is what makes press feedback look physical.
- `rotateX`, `rotateY` and `transform-style: preserve-3d` give depth, orbit and flip effects without JS.
- `clip-path: inset(top right bottom left)` cuts in from each side. Uses: scroll reveal (`inset(0 0 100% 0)` to `inset(0 0 0 0)`), a hold-to-delete overlay, tab color transitions (duplicate the list and clip the active copy), comparison sliders.

## Gestures and drag

- **Momentum dismissal**: compute velocity as `Math.abs(distance) / elapsedMs` and dismiss above about 0.11. A flick is enough, with no distance threshold.
- **Damping at boundaries**: past a natural edge, the element moves less the further it goes.
- **Pointer capture** once the drag starts, so it continues outside the element.
- **One finger only**: ignore new touch points after the drag begins (`if (isDragging) return`).
- **Friction instead of a wall**: allow over-drag with rising resistance.

## Crossfades

When a crossfade shows two overlapping states after easing and duration are tuned, add `filter: blur(2px)` during the transition so they read as one change. Keep animated blur under 20px. It is expensive, most of all in Safari.

## Stagger

Stagger a group entrance by 30-80ms per item. Longer feels slow. A stagger is decoration, so it never blocks interaction.

```css
.item { opacity: 0; transform: translateY(8px); animation: fadeIn 300ms ease-out forwards; }
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
@keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
```

## Accessibility

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

Reduced motion means fewer and gentler animations, not none. Keep transitions that aid understanding and remove position changes.

## Debugging

Recommend these when feel is uncertain.

- **Slow motion**: raise the duration 2x to 5x or use the DevTools animation inspector. Check that colors crossfade cleanly, the easing does not stop abruptly, the origin is right, and coordinated properties stay in sync.
- **Frame by frame**: the Chrome DevTools Animations panel shows timing drift between coordinated properties.
- **Real device** for gestures: connect a phone, open the dev server by IP, and use Safari remote devtools.
- **Next day**: flaws that are invisible during development show up with fresh eyes.

## Cohesion

Match motion to the component's personality. Playful can bounce more. A professional dashboard is crisp and fast. Sonner uses `ease` and a slightly slower duration so that its motion matches its calm design. For opacity against height in lists that grow and shrink, no formula exists: adjust until it feels right.

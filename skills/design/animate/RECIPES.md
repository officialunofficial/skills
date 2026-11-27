# Animation recipes

Starting points for common cases. The curves are the `--ease-out`, `--ease-in-out` and `--ease-drawer` tokens from SKILL.md.

## Contents

- Button press
- Dropdown, popover, menu, select
- Tooltip
- Modal
- Drawer
- Toast
- Accordion
- Stagger
- Hold to confirm
- Tab indicator
- Scroll reveal
- Drag to dismiss
- Crossfade that will not settle
- WAAPI

## Button press

```css
.button { transition: transform 160ms var(--ease-out); }
.button:active { transform: scale(0.97); }
```

`scale()` scales the label and icons too, which is why it reads as a physical press. `:active` is a real press on touch, so it needs no hover gate.

## Dropdown, popover, menu, select

```css
.popover {
  transform-origin: var(--transform-origin); /* supplied by Base UI */
  transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out);
}
.popover[data-starting-style],
.popover[data-ending-style] {
  opacity: 0;
  transform: scale(0.95);
}
```

The origin does the work: the panel looks like it came out of the thing the user clicked.

## Tooltip

```css
.tooltip {
  transform-origin: var(--transform-origin);
  transition: transform 125ms var(--ease-out), opacity 125ms var(--ease-out);
}
.tooltip[data-starting-style],
.tooltip[data-ending-style] {
  opacity: 0;
  transform: scale(0.97);
}
.tooltip[data-instant] { transition-duration: 0ms; }
```

The first tooltip keeps its delay, which prevents accidental opens. Once one is open, its neighbours skip both the delay and the animation, and the toolbar feels faster.

## Modal

```css
.modal {
  transform-origin: center; /* no trigger anchor */
  transition: opacity 250ms var(--ease-out), transform 250ms var(--ease-out);
}
.modal[data-starting-style],
.modal[data-ending-style] {
  opacity: 0;
  transform: scale(0.96);
}
.backdrop { transition: opacity 250ms var(--ease-out); }
```

Fade the backdrop on the same timing so the two read as one surface.

## Drawer

```css
.drawer {
  transform: translateY(0);
  transition: transform 500ms var(--ease-drawer);
}
.drawer[data-closed] { transform: translateY(100%); }
```

This is how Vaul parks a drawer off screen. Once the drawer can be dragged, see "Drag to dismiss".

## Toast

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

Sonner uses `ease` and a slower 400ms on purpose: the motion is tuned to the component's calm personality, not to the general UI budget.

Without `@starting-style`, set a mount flag and style on it:

```jsx
useEffect(() => { setMounted(true); }, []);
// <div data-mounted={mounted}>
```

When toasts stack and the list reflows, opacity and height compete. No formula exists for that pair. Tune it by eye and check again the next day.

## Accordion

```css
.content {
  overflow: hidden;
  transition: height 200ms var(--ease-out), opacity 200ms var(--ease-out);
}
```

This costs layout on every frame, so keep it short. Measure the content height in JS, or use a headless primitive that supplies it. Do not animate to `auto`.

## Stagger

For a list or grid the user sees occasionally, not one they scroll past all day.

```css
.item {
  opacity: 0;
  transform: translateY(8px);
  animation: fadeIn 300ms var(--ease-out) forwards;
}
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
.item:nth-child(4) { animation-delay: 150ms; }

@keyframes fadeIn {
  to { opacity: 1; transform: translateY(0); }
}
```

Keep the step between 30 and 80ms. A stagger is decoration, so the items stay interactive while it plays.

## Hold to confirm

For a destructive action where a plain click fires too easily.

```css
.overlay {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 200ms var(--ease-out); /* release */
}
.button:active .overlay {
  clip-path: inset(0 0 0 0);
  transition: clip-path 2s linear;             /* press */
}
.button:active { transform: scale(0.97); }
```

`linear` is right here: the fill is a progress indicator, and progress does not ease.

## Tab indicator

Timing separate color transitions across a tab list never quite lines up. Clip instead. Duplicate the tab list, style the copy as the active state, clip the copy so only the active tab shows, and animate the clip:

```css
.tabs-active-copy {
  clip-path: inset(0 60% 0 20%); /* set from the active tab's position */
  transition: clip-path 250ms var(--ease-in-out);
}
```

Text and background change in sync because one element is revealed, instead of two colors being interpolated.

## Scroll reveal

Marketing pages only. Do not add this to UI a user visits daily.

```css
.reveal {
  clip-path: inset(0 0 100% 0);
  transition: clip-path 600ms var(--ease-in-out);
}
.reveal[data-visible] { clip-path: inset(0 0 0 0); }
```

Trigger it with `IntersectionObserver`, or Motion's `useInView` with `{ once: true, margin: "-100px" }`. Play it once. A reveal that replays on every pass fights the reader.

## Drag to dismiss

Use a spring, because the user can reverse mid-motion.

```js
// Dismiss on a flick as well as on distance
const timeTaken = Date.now() - dragStartTime.current;
const velocity = Math.abs(swipeAmount) / timeTaken;

if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
  dismiss();
}

// Write the transform on the dragged element itself
element.style.transform = `translateY(${distance}px)`;
```

Four details make the drag feel right:

- **Pointer capture** once the drag starts, so it continues when the pointer leaves the element.
- **One finger only**: `if (isDragging) return` on a new touch point. Otherwise a second finger makes the element jump.
- **Damping past an edge**: the further past a natural boundary, the less the element moves.
- **Friction instead of a wall**: allow the over-drag with rising resistance.

Settle with `{ type: "spring", duration: 0.5, bounce: 0.2 }` so an interrupted drag keeps its velocity.

## Crossfade that will not settle

When two states overlap visibly and no easing or duration fixes it, blur the seam:

```css
.content { transition: filter 200ms ease, opacity 200ms ease; }
.content.transitioning {
  filter: blur(2px);
  opacity: 0.7;
}
```

Without blur the eye sees two objects swapping. With it, they read as one object changing. Keep animated blur under 20px. It is expensive, most of all in Safari.

## WAAPI

For motion that needs JS control but no dependency:

```js
element.animate(
  [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }],
  { duration: 1000, fill: "forwards", easing: "cubic-bezier(0.77, 0, 0.175, 1)" }
);
```

It is hardware accelerated, interruptible, and adds nothing to the bundle.

# Animation audit categories

What to look for in each category, and the exact target values to cite in findings and plans. Copy a value from here. Do not approximate it.

## Contents

1. Purpose and frequency
2. Easing and duration
3. Physicality and origin
4. Interruptibility
5. Performance
6. Accessibility
7. Cohesion and tokens
8. Missed opportunities

## 1. Purpose and frequency

Every animation answers "why does this animate?" with one of: spatial consistency, state indication, feedback, explanation, preventing a jarring change. "It looks cool" on something seen often is not a purpose.

| Frequency | Decision |
| --- | --- |
| 100+ times a day (keyboard shortcuts, command palette toggle) | No animation |
| Tens of times a day (hover, list navigation) | Remove or reduce sharply |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare or first-time (onboarding, feedback, celebration) | Delight is allowed |

Look for: animation on keyboard-initiated actions, a command palette with an open or close transition (Raycast has none), decorative motion on list items or hover states the user hits constantly. The strongest fix is often to delete the animation.

## 2. Easing and duration

| Situation | Easing |
| --- | --- |
| Entering or exiting | `ease-out` |
| Moving or morphing on screen | `ease-in-out` |
| Hover or color change | `ease` |
| Constant motion (marquee, progress) | `linear` |
| Anything else | `ease-out` |

`ease-in` on UI is always a finding. It starts slow and delays the moment the user is watching. The built-in keywords are too weak for deliberate motion, so plans introduce these curves as tokens, in the repo's own token style:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* UI entrances and exits */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* movement on screen */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* iOS-like drawer */
```

UI animation stays under 300ms.

| Element | Duration |
| --- | --- |
| Button press | 100-160ms |
| Tooltip, small popover | 125-200ms |
| Dropdown, select | 150-250ms |
| Modal, drawer | 200-500ms |
| Marketing, explanation | Can be longer |

Look for: `ease-in` anywhere, bare `ease` or `linear` on an entrance, UI durations over 300ms, a delay and animation on every tooltip in a toolbar (after the first, the rest open at once).

## 3. Physicality and origin

- No `scale(0)`. Target `scale(0.9)` to `scale(0.97)` with `opacity: 0`.
- Popovers, dropdowns and tooltips scale from their trigger: `transform-origin: var(--transform-origin)` in Base UI. Modals appear centered, so `transform-origin: center` is correct there and is not a finding.
- Press feedback: `transform: scale(0.97)` on `:active` with `transition: transform 160ms ease-out`. Keep the scale between 0.95 and 0.98.

Look for: `scale(0)`, a pure-fade entrance with no starting transform, `transform-origin: center` or no origin on a trigger-anchored element, pressable elements with no press feedback.

## 4. Interruptibility

A CSS transition retargets from the current state. Keyframes restart from zero. Anything triggered rapidly or reversible mid-motion (stacking toasts, toggles, drags, expand and collapse) uses transitions or springs.

- Entry without JS: `@starting-style`. Older fallback: a `data-mounted` attribute set in `useEffect`.
- Gesture motion uses springs, which carry velocity through an interruption.
- Spring target: `{ type: "spring", duration: 0.5, bounce: 0.2 }`. Keep bounce between 0.1 and 0.3, and keep visible bounce for drag-to-dismiss and playful moments.
- Asymmetric timing: the deliberate phase (press, hold, destructive confirm) is slow and the system's response snaps. Symmetric timing on press and release is a finding.

Look for: `@keyframes` on toasts, toggles and other rapid UI, gesture handlers that tween with fixed durations, drags with a distance threshold only (dismiss when `Math.abs(distance) / elapsedMs > 0.11`), hard stops at drag boundaries where rising friction belongs.

## 5. Performance

- Animate `transform` and `opacity` only. `width`, `height`, `margin`, `padding`, `top` and `left` trigger layout, paint and composite.
- `transition: all` animates unintended properties and is always a finding.
- Motion's `x`, `y` and `scale` props run on the main thread before `motion` 14.2 and drop frames under load. Target: upgrade to 14.2+, or on an older version use `animate={{ transform: "translateX(100px)" }}`. `layout` and `layoutId` run on the main thread in every version.
- A CSS variable on a parent that drives a child's transform recalculates styles for all children. Set `transform` on the element.
- CSS and WAAPI beat rAF-based JS under load. Use CSS for motion known in advance and JS or springs for dynamic, gesture-driven motion.
- Keep animated `filter: blur()` under 20px. It is expensive, most of all in Safari.

Look for: `transition: all`, animated layout properties, Motion props or layout animations on busy pages, `setProperty('--x', ...)` that drives child transforms, rAF loops that do what CSS could.

## 6. Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  .element { animation: fade 0.2s ease; } /* keep opacity and color, drop movement */
}
@media (hover: hover) and (pointer: fine) {
  .element:hover { transform: scale(1.05); } /* a tap on touch fires a false hover */
}
```

Reduced motion means fewer and gentler animations, not none. Keep transitions that aid understanding and remove position changes. In JS, branch transform values on `useReducedMotion()`.

Look for: movement with no `prefers-reduced-motion` handling, ungated `:hover` motion, a reduced-motion branch that removes all feedback.

## 7. Cohesion and tokens

- Motion matches the product's personality. Playful can bounce more, and a dashboard stays crisp. One component with a different personality is a finding.
- Curves and durations live as shared tokens. Five hand-typed cubic-beziers that almost match is a consolidation finding.
- A group that enters all at once where a 30-80ms stagger belongs. A stagger is decoration, so it never blocks interaction.
- A crossfade that shows two overlapping states can take `filter: blur(2px)` during the transition.

Look for: near-duplicate easings and durations, one bouncy component in a crisp app, list and grid entrances with no stagger, crossfades that double-expose.

## 8. Missed opportunities

Places that do not animate and should:

- A state change that teleports (content swap, layout jump) where a short transition would bridge it.
- Spatially linked UI, such as a panel that opens from a trigger, with no motion to show where it came from.
- A rare, emotional moment (first run, success, celebration) with none of the delight it is allowed.

Tools for these: `translate` percentages (`translateY(100%)` is the element's own height) and `clip-path: inset()` reveals, not fixed pixel offsets.

Report a handful at most, each tied to a seam you saw in the UX.

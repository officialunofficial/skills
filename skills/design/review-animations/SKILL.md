---
name: review-animations
description: Reviews animation and motion code against a strict craft standard and returns a findings table with a block or approve verdict.
disable-model-invocation: true
license: MIT
metadata: {upstream-author: "Emil Kowalski", upstream-source: "emilkowalski/skills"}
---

# Review animations

Review the animation and motion code in a diff. The standard is motion that feels right, not motion that merely runs: a transition that works but feels sluggish, starts from the wrong origin, fires too often or drops frames is a regression. Flag by default. Approval is earned.

This skill reviews motion only. For other code, decline and point to a general review skill such as `code-review`.

Read [STANDARDS.md](STANDARDS.md) whenever a finding needs an exact curve, duration, spring config or code pattern. Cite the value from there.

## The ten standards

Measure every animation in the diff against these. A violation is a finding.

1. **Justified.** Each animation answers "why does this animate?" with spatial consistency, state indication, feedback, explanation, or preventing a jarring change. "It looks cool" on something seen often blocks.
2. **Matched to frequency.** Keyboard-initiated and 100+ a day actions get no animation. Tens a day gets reduced motion. Occasional gets standard motion. Rare or first-time may have delight.
3. **Responsive easing.** Entrances and exits use `ease-out` or a strong custom curve. `ease-in` on UI blocks, because it delays the moment the user watches most. Expect custom cubic-beziers, since the built-in keywords are weak.
4. **Under 300ms.** A slower UI animation needs a stated reason.
5. **Correct origin and physics.** Popovers, dropdowns and tooltips scale from their trigger through `transform-origin`. Entrances start from `scale(0.9)` to `scale(0.97)` with opacity, never `scale(0)`. Modals stay centered and are exempt.
6. **Interruptible.** Rapidly triggered or gesture-driven motion (toasts, toggles, drags) uses CSS transitions or springs, which retarget from the current state. Keyframes restart from zero.
7. **Composited properties.** Animate `transform` and `opacity`. Animated `width`, `height`, `margin`, `padding`, `top` or `left` is a performance finding. So are Motion `x`, `y`, `scale` props under load before version 14.2.
8. **Accessible.** `prefers-reduced-motion` gets a gentler variant that keeps opacity and color and drops movement. Hover motion sits behind `@media (hover: hover) and (pointer: fine)`.
9. **Asymmetric timing.** A deliberate action (press, hold, destructive confirm) animates slowly and the system's response snaps. Equal timing on press and release is a finding.
10. **Cohesive.** Motion fits the component and the product: playful can bounce more, a dashboard stays crisp. A mismatched personality is a finding, and so is a harsh crossfade that a slight blur would bridge. When unsure whether motion feels right, the strongest move is often to delete it.

## Flag on sight

- `transition: all`
- `scale(0)`, or a pure-fade entrance with no starting transform
- `ease-in` on any UI interaction, or a weak built-in keyword on a deliberate animation
- Animation on a keyboard shortcut, command palette toggle or 100+ a day action
- UI duration over 300ms with no stated reason
- `transform-origin: center` on a trigger-anchored popover, dropdown or tooltip
- Keyframes on toasts, toggles or anything triggered rapidly
- Animated layout properties
- Motion `x`, `y`, `scale` props before 14.2, or layout animations, on motion that plays while the page is busy
- A CSS variable on a parent that drives a child's transform
- Movement with no `prefers-reduced-motion` handling
- Ungated `:hover` motion
- Equal enter and exit timing on a press-and-release or hold interaction
- A group that enters all at once where a 30-80ms stagger belongs

## Which fix to propose

Prefer the earliest fix in this list that solves the finding:

1. **Delete** the animation: high-frequency, no purpose, or keyboard-triggered.
2. **Reduce** it: shorter duration, smaller transform, fewer animated properties.
3. **Fix the easing**: `ease-in` to `ease-out` or a strong cubic-bezier.
4. **Fix the origin**: correct `transform-origin`, and `scale(0)` to `scale(0.95)` with opacity.
5. **Make it interruptible**: keyframes to transitions, or a spring for gestures.
6. **Move it off layout**: layout properties to `transform` and `opacity`, a Motion upgrade or the full `transform` string, WAAPI for programmatic motion.
7. **Make timing asymmetric**: slow the deliberate phase and snap the response.
8. **Polish**: blur on a crossfade, a stagger for groups, `@starting-style` for entry, a spring for elements that should feel alive.
9. **Accessibility and cohesion**: reduced motion, hover gating, personality.

## Output

Two parts, in this order.

### 1. Findings table

One Markdown table with one row per issue. Cite `file:line` in the Before cell.

| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 200ms ease-out` | `all` animates properties nobody intended |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing real appears from nothing |
| `ease-in` on a dropdown | `ease-out` with a custom curve | `ease-in` delays the moment the user watches |
| `transform-origin: center` on a popover | `var(--transform-origin)` | A popover scales from its trigger |

### 2. Verdict

Group the remaining commentary by tier, highest first, and omit empty tiers:

1. **Feel-breaking regressions**: sluggish easing, appears from nowhere, fires on high-frequency or keyboard actions.
2. **Missed simplifications**: animations to remove or reduce sharply.
3. **Performance**: layout properties, dropped-frame risks, style recalculation across children.
4. **Interruptibility and timing**: keyframes where transitions or springs belong, equal timing that should be asymmetric.
5. **Origin, physics and cohesion**: wrong origin, mismatched personality, harsh crossfades.
6. **Accessibility**: reduced motion and hover gating.

End with one decision:

- **Block**: any feel-breaking regression, animation on a keyboard or high-frequency action, `scale(0)` or `ease-in` on UI, or a layout-property animation with an easy `transform` fix.
- **Approve**: none of the above, no motion that should be deleted, durations and easing in bounds, interruptibility handled where needed, reduced motion honored.

When you cannot tell from code whether motion feels right, do not guess. Recommend a look in slow motion, frame by frame, and again the next day.

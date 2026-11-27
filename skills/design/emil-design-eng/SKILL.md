---
name: emil-design-eng
description: Applies Emil Kowalski's design engineering rules for UI polish, component design and animation decisions. Use when building or reviewing interface code where feel matters, such as buttons, popovers, tooltips, toasts, drawers, easing and duration choices, springs, clip-path effects, drag gestures, or when the user asks why an interface feels off. Reviews come back as a Before, After, Why table.
license: MIT
metadata:
  upstream-author: "Emil Kowalski"
  upstream-source: "emilkowalski/skills"
---

# Design engineering

Most details in a good interface go unnoticed, and that is the goal. When a feature behaves as the user assumes, the user does not think about it. Many such details together make software people prefer, so treat each rule below as one small part of that sum.

Taste is a trained skill, not a preference. Study why the best interfaces feel right: inspect their interactions and reverse engineer their animations.

To build one animation step by step use `animate`. On React Native use `animate-expo`. This skill is the wider rule set for web components and for reviews.

## Review format

When you review UI code, report every finding in one Markdown table with these three columns, one row per issue. A table lets the reader compare the change and its reason in one line.

| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Name the exact properties |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing real appears from nothing |
| `transform-origin: center` on a popover | `transform-origin: var(--transform-origin)` | A popover scales from its trigger |

## Animation decisions

Answer these four questions in order before you write animation code.

### 1. Should it animate?

| How often the user sees it | Decision |
| --- | --- |
| 100+ times a day: keyboard shortcuts, command palette | No animation |
| Tens of times a day: hover effects, list navigation | Remove it or reduce it a lot |
| Occasional: modals, drawers, toasts | Standard animation |
| Rare or first time: onboarding, feedback forms, celebration | Delight is welcome |

Do not animate an action the keyboard starts. The user repeats it hundreds of times a day, and animation makes it feel slow. Raycast opens and closes with no animation for this reason.

### 2. What is the purpose?

A valid purpose is one of these:

- **Spatial consistency:** a toast enters and exits in one direction, so swipe to dismiss makes sense.
- **State indication:** a button morphs to show its new state.
- **Explanation:** a marketing animation shows how a feature works.
- **Feedback:** a button scales down on press.
- **Preventing a jarring change:** an element that appears with no transition looks broken.

If the only purpose is that it looks good and the user sees it often, do not animate.

### 3. Which easing?

| Situation | Easing |
| --- | --- |
| Entering or exiting | ease-out |
| Moving or morphing on screen | ease-in-out |
| Hover or color change | ease |
| Constant motion: marquee, progress bar | linear |
| Default | ease-out |

Do not use ease-in on UI. It starts slow, at the moment the user watches most closely, so a 300ms ease-in dropdown feels slower than a 300ms ease-out one.

The built-in CSS curves are too weak. Use these:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);       /* UI interactions */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);   /* movement on screen */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);    /* iOS-like drawer */
```

For another curve, pick a stronger variant from easing.dev or easings.co. Do not invent one.

### 4. How fast?

| Element | Duration |
| --- | --- |
| Button press feedback | 100 to 160ms |
| Tooltip, small popover | 125 to 200ms |
| Dropdown, select | 150 to 250ms |
| Modal, drawer | 200 to 500ms |
| Marketing or explanation | Can be longer |

Keep UI animation under 300ms. Speed changes how fast the whole app seems: a 180ms select feels more responsive than a 400ms one, and a spinner that turns faster makes the same load feel shorter.

Make the exit faster than the entrance. Be slow where the user decides and fast where the system responds: hold-to-delete fills over 2s linear and releases in 200ms ease-out.

## Springs

A spring has no fixed duration. It settles from physical parameters and keeps its velocity when interrupted, where a CSS animation restarts from zero. Use a spring for:

- A drag with momentum.
- A gesture the user can interrupt or reverse.
- An element that should feel alive, such as Apple's Dynamic Island.
- Decorative mouse tracking.

Configure it with duration and bounce. This form is the easiest to reason about:

```js
{ type: "spring", duration: 0.5, bounce: 0.2 }
```

Avoid bounce in most UI. When you use it, for drag to dismiss or a playful interaction, keep it at 0.1 to 0.3.

A value tied directly to the mouse position feels artificial, because it has no motion of its own. Pass it through `useSpring` from Motion:

```jsx
const springRotation = useSpring(mouseX * 0.1, { stiffness: 100, damping: 10 });
```

This suits decoration only. A functional chart in a banking app is better with no animation.

## Component rules

- **Buttons respond to press.** Add `transform: scale(0.97)` on `:active` with `transition: transform 160ms ease-out`. Any pressable element gets this, at a scale of 0.95 to 0.98.
- **No entrance from `scale(0)`.** Start at `scale(0.9)` or more with `opacity: 0`.
- **Popovers scale from their trigger.** Set `transform-origin: var(--transform-origin)` (Base UI) or the trigger position. Modals are the exception: a modal has no trigger anchor and stays centered.
- **Tooltips skip the delay after the first.** The first tooltip waits, to prevent accidental opens. While one is open, its neighbors open at once with no animation.
- **Transitions for UI that changes fast.** A CSS transition can be interrupted and re-targeted. A keyframe animation restarts from zero. Toasts and toggles use transitions.
- **Name the properties.** Write `transition: transform 200ms ease-out`, not `transition: all`.
- **Gate hover.** Put hover animation inside `@media (hover: hover) and (pointer: fine)`, because a tap triggers hover on a touch device. `mobile-native` covers the other touch fixes.
- **Stagger a group.** When several elements enter together, delay each by 30 to 80ms. Do not block interaction while the stagger plays.
- **Match motion to personality.** A playful component can bounce. A professional dashboard is crisp and fast. Sonner is a little slower than typical UI and uses `ease`, which fits its design.
- **Respect reduced motion.** Keep opacity and color changes that explain a state. Remove movement.

## Performance rules

- Animate `transform` and `opacity` only. `padding`, `margin`, `height` and `width` run layout, paint and composite.
- Use CSS for a predetermined animation and JS for a dynamic, interruptible one. CSS animation runs off the main thread and stays smooth while the page loads.
- Keep blur under 20px. Heavy blur is expensive, most of all in Safari.

## Review checklist

| Issue | Fix |
| --- | --- |
| `transition: all` | Name the properties |
| `scale(0)` entrance | `scale(0.95)` with `opacity: 0` |
| `ease-in` on a UI element | `ease-out` or a custom curve |
| `transform-origin: center` on a popover | The trigger position. Modals stay centered. |
| Animation on a keyboard action | Remove it |
| Duration over 300ms on a UI element | 150 to 250ms |
| Hover animation with no media query | `@media (hover: hover) and (pointer: fine)` |
| Keyframes on an element that triggers fast | CSS transition |
| Motion `x` or `y` props under load before 14.2 | Upgrade, or use `transform: "translateX()"` |
| The same speed for enter and exit | A faster exit |
| A group that appears all at once | Stagger of 30 to 80ms |

## More reference

Read [TECHNIQUES.md](TECHNIQUES.md) when you build or debug one of these: tooltip or toast CSS, `@starting-style` entrances, blur for a crossfade, percentage and 3D transforms, `clip-path` effects (tabs, hold to delete, reveals, comparison sliders), drag and swipe gestures, Motion and CSS variable performance traps, WAAPI, reduced-motion code, slow-motion debugging, or the design of a component library.

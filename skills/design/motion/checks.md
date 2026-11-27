# Motion checks

Each row pairs a rule id with a broken line, the line that replaces it and the severity of a finding. The motion blur checks are in [motion-blur.md](motion-blur.md#checks).

## Contents

- [Severity](#severity)
- [What animates](#what-animates)
- [How a transition is built](#how-a-transition-is-built)
- [Curves and durations](#curves-and-durations)
- [Gestures](#gestures)
- [Tooltips, icons and cross-fades](#tooltips-icons-and-cross-fades)
- [Presses and stagger](#presses-and-stagger)
- [Exits and size](#exits-and-size)
- [Reduced motion](#reduced-motion)

## Severity

- `HIGH` breaks use or access.
- `MEDIUM` is motion that is wrong in kind: the wrong property, the wrong curve, too long, or not interruptible.
- `LOW` is motion that is right in kind and off in polish.

## What animates

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `motion-opacity-for-chrome` | `initial={{ x: 20, scale: 0.95 }}` on a page | `initial={{ opacity: 0 }}` | `MEDIUM` |
| `motion-changing-axis-only` | `animate={{ width, height }}` when only the height changes | `animate={{ height }}` | `LOW` |
| `motion-no-replay-on-entry` | `<AnimatePresence>` around routes, so entrances replay | `<AnimatePresence initial={false}>` | `MEDIUM` |
| `motion-no-flash-on-return` | A cached view that flashes a skeleton | The cached view, rendered at once | `MEDIUM` |
| `motion-no-motion-on-repeat` | `animate={{ scale: [1, 1.02, 1] }}` on each keystroke | An input with no motion | `MEDIUM` |
| `motion-instant-hover-color` | `transition: background-color 200ms` on a button | The hover colour, applied at once | `LOW` |

## How a transition is built

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `motion-name-the-properties` | `transition: all 200ms` | `transition: opacity 200ms, transform 200ms` | `MEDIUM` |
| `motion-transitions-for-state` | `.open { animation: slide-in 200ms }` | `transition: transform 200ms` on the toggled property | `MEDIUM` |
| `motion-origin-from-trigger` | A dropdown that scales from `center` | `transform-origin: top left` under a left-aligned trigger | `LOW` |
| `motion-no-scale-from-zero` | `initial={{ scale: 0 }}` on a popover | `initial={{ scale: 0.95, opacity: 0 }}` | `MEDIUM` |

## Curves and durations

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `motion-ease-by-direction` | A modal that enters on `ease-in` | Ease-out in and out, with a shorter exit | `MEDIUM` |
| `motion-strong-ease-out` | `transition: transform 200ms ease-out` | `transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1)` | `LOW` |
| `motion-under-300ms` | `transition={{ duration: 0.5 }}` on a dropdown | `duration: 0.2` | `MEDIUM` |
| `motion-close-faster` | A modal at `200ms` in and `200ms` out | `200ms` in, `150ms` out | `LOW` |

## Gestures

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `motion-spring-for-gestures` | A drag release on `duration: 0.3, ease: "easeOut"` | `type: "spring"` with `velocity: info.velocity.x` | `MEDIUM` |
| `motion-flick-dismisses` | A sheet that dismisses only past a fixed distance | Dismiss past the distance or above `0.11` px per ms | `MEDIUM` |
| `motion-friction-at-edges` | A drawer that stops dead at its top | Movement that slows the further the drag goes | `LOW` |
| `motion-gesture-alternative` | Rows that reorder only by drag | `Move Up` and `Move Down` in the row menu | `HIGH` |

## Tooltips, icons and cross-fades

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `motion-tooltip-delay` | Each toolbar tooltip waits the full delay | The first waits, and its neighbours open at once | `LOW` |
| `motion-icon-crossfade` | `{copied ? <CheckIcon /> : <CopyIcon />}` | Both icons cross-fade with scale and blur | `LOW` |
| `motion-icon-morph` | Two morph-form icons that cross-fade | Each `motion.path` animates `d` to its partner | `LOW` |
| `motion-blur-the-crossfade` | Two button labels that overlap mid-swap | `filter: blur(2px)` while the swap runs | `LOW` |

## Presses and stagger

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `motion-press-scale` | `whileTap={{ scale: 0.8 }}` | `whileTap={{ scale: 0.98 }}` | `LOW` |
| `motion-short-stagger` | `staggerChildren: 0.15` | `staggerChildren: 0.03` | `LOW` |

## Exits and size

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `motion-exit-in-presence` | `{open && <motion.div exit={{ opacity: 0 }} />}` | The same element inside `<AnimatePresence>` | `HIGH` |
| `motion-dialogs-stay-mounted` | `{open && <Dialog.Root open>}` | `<Dialog.Root open={open} onOpenChange={setOpen}>` | `MEDIUM` |
| `motion-measure-inner` | `ref` and `animate={{ height: bounds.height }}` on one node | The outer node animates, and the inner node holds the `ref` | `HIGH` |
| `motion-hold-content-size` | `w-full` content inside a sidebar that collapses | `w-64` content that keeps its width | `MEDIUM` |

## Reduced motion

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `motion-reduced-motion` | A drawer that slides under reduced motion | An opacity cross-fade | `MEDIUM` |

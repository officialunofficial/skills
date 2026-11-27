---
name: frames
description: "Records one interaction on a throttled CPU, names what drops frames or delays input, then proves the fix with a second recording."
disable-model-invocation: true
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Frames

Measure whether one interaction stays smooth. Record it on a throttled CPU, trace each slow frame to its cause, fix the cause, then record again to prove the fix.

## Budgets

A development laptop hides the stutter a phone shows, so judge smoothness from recorded numbers at a throttle. A claim of "smooth" with no recording is a finding in itself.

| Measure | Budget |
| --- | --- |
| Gap between frames | One refresh interval: 16.7ms at 60Hz |
| One animation frame while something moves | 50ms at most |
| Input to painted response | 200ms at most |

`motion` owns what a motion's values should be. `deconstruct` takes a motion apart frame by frame. `verify` opens the running result.

## Steps

1. **Name the interaction.** Write the route, the steps and the moment that matters, for example "open the command palette and type three letters".
2. **Throttle the CPU 4x.** Use the browser's CPU emulation (CDP `Emulation.setCPUThrottlingRate` with `rate: 4`). 4x stands in for a mid-range phone.
3. **Record.** Evaluate [observe.js](observe.js) in the page. Call `window.__frames.start()`, perform the interaction three times, then call `window.__frames.stop()` and keep the object it returns. Keep the tab visible, because a hidden tab throttles `requestAnimationFrame`.
4. **Read the budget.** Compare the recording with the three budgets. For a slow interaction, say where the time went: input delay, processing or presentation.
5. **Find the cause.** For each long animation frame, read its `scripts` and `forcedLayout`, then open the code they name. When a long frame names no script, record a full performance profile as well. Match what you find against the causes below.
6. **Fix, then record again.** Use the same steps and the same throttle. Report both recordings side by side, then set the throttle back to 1.

The work is done when the second recording holds every budget, or the report names each budget it still misses with numbers.

## Reading the recording

`start()` returns which entry types the browser supports. `stop()` returns:

- `budget`, `refresh`: the measured frame interval in ms and the refresh rate in Hz.
- `frames`, `dropped`, `worstGap`: frame count, frames missed, and the longest gap in ms.
- `longAnimationFrames`: slowest first. Each has `duration`, `blocking`, `forcedLayout` and `scripts` (`source`, `function`, `invoker`, `duration`, `forcedLayout`).
- `interactions`: slowest first. Each has `name`, `target`, `duration`, `inputDelay`, `processing` and `presentation`.
- `layoutShift`: the summed shift that no input caused.

A browser without long animation frame support returns no script attribution. Mark that part `Not verified`.

## Causes

- **A layout property animated across a large subtree.** `top` or `width` on a full-page panel reflows the subtree every frame. Animate `transform` and `opacity`, which the compositor handles without layout.
- **A layout read after a style write.** Reading `offsetHeight` or `scrollHeight` after setting a style forces layout in the middle of the frame. Read every value first, then write.
- **A state update per frame.** `setState` inside a `requestAnimationFrame` loop or a scroll handler re-renders the component tree each frame. Drive the value through a motion value, a CSS variable or a ref.
- **A large surface repainted per frame.** `backdrop-filter` on a moving full-screen layer repaints the whole layer. Shrink the painted area, or keep the effect on a static layer and move a panel above it.

## Checks

| Rule | Broken | Replacement |
| --- | --- | --- |
| `frames-throttle-the-cpu` | A trace on an unthrottled laptop | A trace at 4x CPU throttle |
| `frames-trace-not-feel` | "The drawer feels smooth" | "Drawer open: 0 dropped frames, worst gap 17ms at 4x" |
| `frames-hold-the-budget` | 14 dropped frames while the sheet opens | 0 dropped, no animation frame over 50ms |
| `frames-answer-in-200ms` | A keystroke that paints after 340ms, 280ms of it processing | 90ms, with the filter moved off the keystroke |
| `frames-compositor-properties` | `animate={{ width: 320 }}` on the full-page sidebar | `animate={{ x: 0 }}` with a fixed width |
| `frames-no-forced-layout` | `el.style.height = el.scrollHeight + "px"` in a loop over rows | All heights read, then all written |
| `frames-animate-outside-render` | `setProgress(p)` on every frame | `progress.set(p)` on a motion value |
| `frames-small-paint` | `backdrop-filter: blur(20px)` on a moving full-screen layer | The blur on the static backdrop, the panel moving above it |
| `frames-before-and-after` | "Should be faster now" | "Before 14 dropped, after 0, same steps at 4x" |

## Reporting

When the skill runs as a review, write one finding per root cause, with the measured numbers:

```
1. file:line - [rule-id] what is wrong (dropped, worst gap, duration)
```

Severity:

- `HIGH`: an interaction over 200ms at the throttle, or smoothness reported with no recording.
- `MEDIUM`: dropped frames during motion, a layout property animated on a large subtree, forced layout, a state update per frame, or a trace taken with no throttle.
- `LOW`: a large repaint that still holds the budget, or a fix reported with no second recording.

Close with a `Rule | Count | Severity` summary and a verdict: `Block` while any `HIGH` remains, `Approve` otherwise.

---
name: pick-ui-library
description: Picks one library for a frontend task from a curated list: UI primitives, toasts, OTP inputs, charts, command menus, virtualization, drag and drop, animation, state and styling.
disable-model-invocation: true
license: MIT
metadata:
  upstream-author: "Emil Kowalski"
  upstream-source: "emilkowalski/skills"
---

# Pick UI Library

Match the task to the list below and recommend one library. The list is a deliberate set of picks, so stay inside it unless the user asks for an alternative or the task is not covered.

## Steps

1. **Name the task, not the library the user mentioned.** "I need to show a dropdown" is a UI primitives task, whatever library came up in the question.
2. **Read `package.json`.** If the project already has a listed library, use it. If it has a competitor (for example react-window where the list says Virtuoso), mention the pick and leave the dependency alone unless the user asks to switch.
3. **Recommend one library** with one sentence on what it does. Install and wire it when the request includes that.
4. **When the list does not cover the task,** say so, then recommend from your own knowledge.

## The list

### UI components and primitives

| Task | Library |
| --- | --- |
| Unstyled, accessible components: dialogs, popovers, menus, selects | [base-ui](https://base-ui.com) |
| Command menus (Cmd+K palettes) | [cmdk](https://cmdk.paco.me) |
| Toasts and notifications | [Sonner](https://sonner.emilkowal.ski). See `ask-sonner` |
| One-time password and verification code inputs | [input-otp](https://input-otp.rodz.dev) |
| Control panels for tuning values | [Leva](https://github.com/pmndrs/leva). [dialkit](https://joshpuckett.me/dialkit) is the alternative |

### Motion and visuals

| Task | Library |
| --- | --- |
| General animation: springs, layout animations, enter and exit | [motion](https://motion.dev) (Framer Motion) |
| Animated numbers: counters, prices, stats | [NumberFlow](https://number-flow.barvian.me) |
| Animated text | [torph](https://torph.lochie.me/) |
| 3D globes | [Cobe](https://cobe.vercel.app) |
| Dynamic OG images from HTML and CSS | [Satori](https://github.com/vercel/satori) |
| Syntax highlighting | [shiki](https://shiki.style) |

Use motion for springs, layout animations, exit animations, and gesture-driven values. A plain hover or fade needs only a CSS transition.

### Charts

| Task | Library |
| --- | --- |
| Real-time, streaming charts | [Liveline](https://github.com/benjitaylor/liveline) |
| Every other chart, static or interactive | [recharts](https://recharts.org) |

Use Liveline when points arrive live and the chart scrolls with time.

### Interaction and performance

| Task | Library |
| --- | --- |
| Drag and drop | [dnd kit](https://dndkit.com) |
| Virtualized long lists and large tables | [Virtuoso](https://virtuoso.dev) |

### State and styling

| Task | Library |
| --- | --- |
| State management | [zustand](https://zustand.docs.pmnd.rs) |
| Conditional `className` strings | [clsx](https://github.com/lukeed/clsx) |
| Typed variants for Tailwind components | [cva](https://cva.style) |
| Theme switching with no flash on load | [next-themes](https://github.com/pacocoursey/next-themes) |

Use clsx for ad hoc conditional classes. Use cva when a component has real variants, such as size, intent, or state, that deserve a typed API. cva accepts clsx-style inputs, so the two compose.

## Mismatches to catch

| You find | Recommend |
| --- | --- |
| Toasts built by hand or with a modal library | Sonner |
| A `<div>` dropdown or dialog with manual focus handling | base-ui, which handles accessibility, focus trapping, and dismissal |
| A number animated by re-rendering text | NumberFlow |
| A list of 1,000+ rows rendered directly | Virtuoso |
| Shared state passed through `useState` and props across many components | zustand |
| `className` template literals with ternaries three deep | clsx, or cva when the conditions are variants |

---
name: animate-expo
description: Builds animations in React Native and Expo with Reanimated, Gesture Handler, Expo Router and expo-haptics. Decides in order whether to animate, which tool, which properties, spring or timing, and how to stay on the UI thread. Use when animating anything in an Expo app, adding gestures, sheets, screen transitions, press feedback or haptics, or fixing motion that stutters on a device. For web animation use `animate`.
license: MIT
metadata:
  upstream-author: "Emil Kowalski"
  upstream-source: "emilkowalski/skills"
---

# Animate in Expo

Turn a request for motion into code that holds up on a release build on the slowest phone you support. Make the call, give the reason in one line, and write the code. Give one answer, not a menu of options.

Three facts about mobile drive every rule here:

- **No hover.** Every affordance lives in press, position, or nowhere.
- **Two runtimes.** React renders on the RN runtime. Worklets run each frame on the UI runtime. Motion that touches the RN runtime stutters when the app does anything else.
- **The finger is on the element.** Interruption and velocity handoff are the baseline, not polish.

The two ways to fail: animating something that should not animate, and animating the right thing on the wrong thread. The second looks fine in dev on a new phone and drops to 20fps on a three-year-old Android.

Work through the steps in order. Steps 1 and 2 can end the work with zero lines of code.

## 1. Should it animate?

| How often the user sees it | Decision |
| --- | --- |
| 100+ times a day: tab switches, keyboard, scrolling, settings toggles | No animation. Platform default or nothing. |
| Tens of times a day: press feedback, list navigation, row selection | Under 150ms, or nothing |
| Occasional: sheets, modals, toasts, onboarding steps | Standard animation |
| Rare or first time: success states, empty states, celebration | Delight belongs here |

Tabs never slide. Tabs are peers, and a slide implies a depth that does not exist. Set `animation: 'none'`.

If the request fails this step, say so and write nothing.

## 2. Name the purpose

Name it in one word: feedback, spatial consistency, state indication, preventing a jarring change, explanation, or delight (rare tier only). With no name, do not build it.

## 3. Pick the tool

Take the first row that fits.

| Need | Tool |
| --- | --- |
| A state change with no gesture: press, toggle, color | Reanimated CSS transition (`transitionProperty` in the style) |
| A loop, several stages, or play on mount | Reanimated CSS animation (`animationName` keyframes) |
| An element mounts or unmounts, or a list reflows | Layout animations (`entering`, `exiting`, `itemLayoutAnimation`) |
| A finger touches it, or it follows scroll | `useSharedValue` + `Gesture` + `useAnimatedStyle` |
| Screen to screen | Native stack options in Expo Router |
| A bottom sheet that is its own screen | `presentation: 'formSheet'` |
| Tab bar | `NativeTabs` from `expo-router/unstable-native-tabs` |
| Context menu, press-and-hold preview | `Link.Menu` and `Link.Preview` (iOS only) |
| Header that collapses into a large title | `headerLargeTitleEnabled` on the native stack (iOS only) |
| Pull to refresh | `RefreshControl` |
| UI that follows the keyboard | `react-native-keyboard-controller` |
| Illustration, celebration, empty state | Lottie. Never for UI state. |
| A very large animated scene or freeform drawing | `@shopify/react-native-skia` |

Use a shared value only when the value is continuous or can be interrupted. A press scale is a CSS transition. A drag is a shared value.

Use Reanimated, not core `Animated`. A gesture cannot drive core `Animated` without crossing to the RN runtime, and worklets keep running while JS is busy.

Install packages with `npx expo install` so each version matches the project SDK.

## 4. Pick the properties

- Animate `transform` and `opacity`. `width`, `height`, `margin`, `padding`, `flex`, `top`, `left` and `gap` run layout each frame for the node and its siblings.
- One exception: an absolutely positioned element with no children, such as a tab pill or a progress fill. Nothing else moves, and `width` keeps the corner radius that `scaleX` distorts.
- Enter from `scale: 0.95` with `opacity: 0` (the range is 0.9 to 0.97), never from `scale: 0`. Nothing real appears from nothing.
- `transform` is an ordered array. Put translate first: `[{ translateY }, { scale }]`. In the other order the scale multiplies the translate.
- Do not animate Android `elevation` or `BlurView` intensity. Both render again each frame. Crossfade the opacity of a static layer.
- A percentage in `translate` is relative to the element. `translateY: '100%'` moves a sheet by its own height.

## 5. Spring or timing

If a finger was involved, use a spring. A spring carries velocity through an interruption, and a timing curve restarts. Everything else uses timing.

Use the duration and damping form of `withSpring`, not mass, stiffness and damping:

| Interaction | Config |
| --- | --- |
| Default settle, no overshoot | `{ duration: 400, dampingRatio: 1 }` |
| Snap back after a drag | `{ duration: 400, dampingRatio: 0.8, velocity }` |
| Sheet, drawer | `{ duration: 300, dampingRatio: 0.8, velocity }` |
| Must not pass a hard edge | add `overshootClamping: true` |

Add bounce only when the gesture carried momentum. Overshoot suits a card the user flicked, not a menu that faded in.

For timing, the default easing is ease-out. Use ease-in-out for an element that moves across the screen, and linear for constant motion such as progress. Do not use ease-in on UI: it delays the moment the user watches. The built-in curves are weak, so use these:

```js
import { Easing } from 'react-native-reanimated';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);      // enter, exit, default
const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);  // movement on screen
const EASE_SHEET = Easing.bezier(0.32, 0.72, 0, 1);    // iOS sheet curve
```

| Element | Duration |
| --- | --- |
| Press feedback | 100 to 150ms |
| Toggle, chip, small state change | 150 to 200ms |
| Sheet, modal, drawer | spring, about 300ms |
| Screen transition | platform default, not overridden |

Keep UI animation under 300ms. Take every curve and spring config from these tables, not from a guess.

## 6. Stay on the UI runtime

Most React Native motion fails here.

- Do not call `setState` from a gesture handler or a scroll handler. One render per frame is the largest cause of jank. Write a shared value and read it in `useAnimatedStyle`.
- Do not call `scheduleOnRN` in `onUpdate` or a scroll handler. That is 60 to 120 calls a second. Call it in `onEnd`, or in a `useAnimatedReaction` that fires when a value crosses a threshold.
- `scheduleOnRN(fn, ...args)` from `react-native-worklets` replaces the deprecated `runOnJS(fn)(...args)`.
- Do not read or write a shared value during render. A read is a stale snapshot, and a write repeats on each render. Use shared values in worklets, handlers and effects.
- Use `.get()` and `.set()`, not `.value`. The React Compiler cannot see through `.value`. `set` also takes an update function.
- A function called from a worklet needs `'worklet'` as its first line. Without it the call throws on a device.

## 7. Press, not hover

- Show feedback on press-in and commit on press-out.
- Scale a pressable to 0.97 in 100 to 150ms with `Pressable` and a CSS transition. The label and icons scale too, and that reads as physical.
- The touch target is at least 44x44pt (48dp on Android). For a smaller visual, add `hitSlop`.
- Set `pressRetentionOffset` so a small finger drift does not cancel the press.
- Use the Android ripple only in a Material-styled app.

## 8. Haptics

| Moment | Call |
| --- | --- |
| A value passes a step: picker, slider detent, segmented control | `Haptics.selectionAsync()` |
| Something snaps home, a detent catches, a drag commits | `Haptics.impactAsync(ImpactFeedbackStyle.Light)` |
| A heavy object lands, a destructive action fires | `Haptics.impactAsync(ImpactFeedbackStyle.Medium)` |
| An operation succeeded or failed | `Haptics.notificationAsync(...)` with `Success` or `Error` |

- Fire the haptic on the frame of its cause, such as the detent catch, not when the animation ends. A late haptic reads as a glitch.
- Fire one haptic per user action. None on scroll, per frame, or on an entrance the user did not cause.
- Pair each haptic with a visual. Many users have haptics off, and most Android hardware is silent.
- From a worklet: `scheduleOnRN(Haptics.selectionAsync)`.

## 9. Reduced motion and text size

Reduced motion ships with the animation. It means fewer and gentler changes, not none: keep opacity and color, drop translation, scale, parallax and overshoot. Screen transitions become `animation: 'fade'`.

```jsx
const reduced = useReducedMotion();
const y = useSharedValue(reduced ? 0 : SHEET_HEIGHT);

// or let one animation follow the system setting
withSpring(0, { duration: 300, dampingRatio: 0.8, reduceMotion: ReduceMotion.System });
```

Text scales with the system setting, so a height measured at the default size is wrong at 200%. Measure with `onLayout` or animate a transform.

## When the animation does not run

- In an Expo project, `babel-preset-expo` configures the worklets plugin. A bare React Native project adds the plugin by hand, last in the list. A missing plugin throws `Failed to create a worklet`.
- `GestureHandlerRootView` must wrap the app. Without it gestures do nothing and report no error.
- Reanimated 4 needs the New Architecture.
- On ProMotion iPhones, animations run at 60fps unless `CADisableMinimumFrameDurationOnPhone` is `true` in `expo.ios.infoPlist`. Recent Expo SDKs set it. Confirm it. At 120fps the frame budget is 8ms.

## Recipes

Read [RECIPES.md](RECIPES.md) when the request matches one of these, and start from the recipe: press feedback, drag-to-dismiss sheet, swipe to delete, collapsing header, list entrance, keyboard-synced UI, tab indicator, screen transitions, toast, or an action at a threshold.

## Check before you finish

| Found in the code | Replace with |
| --- | --- |
| `PanResponder`, or core `Animated` under a finger | `Gesture.Pan()` and Reanimated |
| `entering` on a row of a virtualized list | Animate the container, or use `itemLayoutAnimation` |
| A screen transition built in JS | Native stack `animation` |
| A dismissal that needs distance only | Velocity or distance. A flick is enough. |
| A hard stop at a boundary | Rubber-band resistance |
| `Easing.in(...)` on UI | `EASE_OUT` |

## Report

Write the code, then add a few lines:

- The step 1 tier and the step 2 purpose, and what you rejected.
- The tool, properties, spring or curve with duration, and the runtime.
- What to try on a device: flick it, interrupt it mid-flight, reverse it, and run it on the slowest Android available.

Code cannot prove feel. Expo Go, the simulator and a dev build hide the problems, so say that the result needs a release build on the slowest supported device. `verify` covers the check in the running app.

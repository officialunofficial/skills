# Expo animation recipes

Start from the matching recipe and adapt it. The step numbers refer to SKILL.md.

## Contents

- Shared setup
- Two worklets: project and rubberband
- Press feedback
- Drag-to-dismiss sheet
- Swipe to delete
- Collapsing header
- List entrance
- Keyboard-synced UI
- Tab indicator
- Screen transitions
- Toast
- An action at a threshold

## Shared setup

Packages: `react-native-reanimated`, `react-native-worklets`, `react-native-gesture-handler`, `expo-haptics`. Add `react-native-keyboard-controller` for the keyboard recipe only. Install each with `npx expo install`.

Wrap the app once in the root `_layout`:

```jsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack />
    </GestureHandlerRootView>
  );
}
```

Every recipe uses these imports and constants:

```js
import { useState, useEffect, useMemo } from 'react';
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, useAnimatedReaction,
  withSpring, withTiming, interpolate, Extrapolation, Easing,
  FadeInDown, FadeOutDown, LinearTransition,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import * as Haptics from 'expo-haptics';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);
const EASE_SHEET = Easing.bezier(0.32, 0.72, 0, 1);
```

Each gesture sits in `useMemo`. A gesture that is built again on each render can attach its recognizer again and drop a drag in progress.

Expo installs Gesture Handler v2, and the recipes use its `Gesture.Pan()` builder. On v3 each gesture is a hook with one config object. `onStart` becomes `onActivate`, `onEnd` becomes `onDeactivate`, and `event.canceled` (inverted) replaces the `success` flag. The hook keeps its own identity, so remove the `useMemo`:

```jsx
const pan = usePanGesture({
  activeOffsetY: [-10, 10],
  onActivate: () => { context.set(translateY.get()); },
  onUpdate: (e) => { translateY.set(context.get() + e.translationY); },
  onDeactivate: (e) => { /* settle with withSpring, as in the sheet recipe */ },
});
```

## Two worklets: project and rubberband

`project` says where a flick was going, so a short fast swipe commits and a long slow one does not. `rubberband` makes a boundary resist instead of stop.

```js
// The rest position if the finger kept decelerating.
// This is Apple's exponential decay, not v^2 / 2a.
function project(velocity, decelerationRate = 0.998) {
  'worklet';
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

// The further past the edge, the less the element follows.
function rubberband(overshoot, dimension, constant = 0.55) {
  'worklet';
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
```

## Press feedback

Use this for every pressable. It passes step 1 only because it is near-imperceptible: 120ms and a 3% scale is the limit for an element touched this often. A CSS transition is the whole implementation.

```jsx
import Animated from 'react-native-reanimated';
import { Pressable, StyleSheet } from 'react-native';

function PressableScale({ onPress, children }) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      hitSlop={12}
      pressRetentionOffset={16}
    >
      <Animated.View style={[styles.box, pressed && styles.pressed]}>{children}</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    transform: [{ scale: 1 }],
    transitionProperty: 'transform',
    transitionDuration: '120ms',
    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
  },
  pressed: { transform: [{ scale: 0.97 }] },
});
```

`setState` is correct here: it runs twice per press, not once per frame.

## Drag-to-dismiss sheet

If the sheet is its own destination, use `presentation: 'formSheet'` (see Screen transitions). Build this recipe only when the sheet lives inside an existing screen.

```jsx
const translateY = useSharedValue(0);
const context = useSharedValue(0);

const pan = useMemo(() => Gesture.Pan()
  .activeOffsetY([-10, 10])   // a horizontal swipe wins; the drag needs intent
  .onStart(() => {
    context.set(translateY.get());   // start from the value on screen, not from 0
  })
  .onUpdate((e) => {
    const next = context.get() + e.translationY;
    // down is free; up past the top resists
    translateY.set(next >= 0 ? next : rubberband(next, HEIGHT));
  })
  .onEnd((e) => {
    const projected = translateY.get() + project(e.velocityY);
    if (projected > HEIGHT * 0.4) {
      translateY.set(withSpring(HEIGHT, {
        duration: 300, dampingRatio: 1, velocity: e.velocityY, overshootClamping: true,
      }, (finished) => { if (finished) scheduleOnRN(onClose); }));
    } else {
      translateY.set(withSpring(0, { duration: 300, dampingRatio: 0.8, velocity: e.velocityY }));
      scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Light);   // it snapped home
    }
  }), [onClose]);

const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.get() }] }));
```

Four details make this drag feel right:

- `onStart` saves the current value. Without it, a sheet that is grabbed mid-animation jumps.
- The projection decides, not the distance. A quick flick dismisses from a few pixels down. A rule of 40% travel alone makes the sheet feel heavy.
- The spring receives the release velocity, so no seam shows between the drag and the animation.
- `overshootClamping` on dismissal stops the sheet from passing the bottom edge and showing a gap.

The backdrop reads the same value, so it stays in sync:

```jsx
const backdropStyle = useAnimatedStyle(() => ({
  opacity: interpolate(translateY.get(), [0, HEIGHT], [1, 0], Extrapolation.CLAMP),
}));
```

## Swipe to delete

For a row that reveals action buttons, use `ReanimatedSwipeable` from Gesture Handler. Build this recipe only for a swipe that commits by momentum.

```jsx
const x = useSharedValue(0);
const context = useSharedValue(0);

const pan = useMemo(() => Gesture.Pan()
  .activeOffsetX([-10, 10])   // declare the axis, or the pan fights the vertical scroll
  .onStart(() => { context.set(x.get()); })
  .onUpdate((e) => { x.set(Math.min(0, context.get() + e.translationX)); })
  .onEnd((e) => {
    const projected = x.get() + project(e.velocityX);
    if (projected < -SWIPE_THRESHOLD) {
      x.set(withTiming(-WIDTH, { duration: 200, easing: EASE_OUT }, (f) => {
        if (f) scheduleOnRN(onDelete, id);
      }));
    } else {
      x.set(withSpring(0, { duration: 300, dampingRatio: 1, velocity: e.velocityX }));
    }
  }), [onDelete, id]);
```

The list closes the gap, not the row:

```jsx
const ROW_CLOSE = LinearTransition.duration(200);   // module scope

<Animated.FlatList data={items} itemLayoutAnimation={ROW_CLOSE} ... />
```

A pan inside a scroll view with no `activeOffsetX` takes vertical scrolls. The result looks like a scroll bug, not a gesture bug.

## Collapsing header

```jsx
const scrollY = useSharedValue(0);
const onScroll = useAnimatedScrollHandler((e) => { scrollY.set(e.contentOffset.y); });

const titleStyle = useAnimatedStyle(() => ({
  opacity: interpolate(scrollY.get(), [0, 60], [1, 0], Extrapolation.CLAMP),
  transform: [{ translateY: interpolate(scrollY.get(), [0, 60], [0, -12], Extrapolation.CLAMP) }],
}));

<Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16}>
```

Do not animate the header `height`. That runs layout for the header and everything below it on each scroll frame. Give the container a fixed height, translate the content inside it, and clip with `overflow: 'hidden'`.

Keep `Extrapolation.CLAMP`. Without it the opacity goes negative past 60 and the header shows again, inverted, far down a long list.

## List entrance

```jsx
// Build layout animations outside the component or in useMemo.
// A delay per index cannot live at module scope, so the row memoizes it.
function Row({ item, index }) {
  const entering = useMemo(() => FadeInDown.duration(250).delay(index * 40), [index]);
  return <Animated.View entering={entering}>{/* ... */}</Animated.View>;
}

{items.map((item, i) => <Row key={item.id} item={item} index={i} />)}
```

- Stagger by 30 to 80ms. More feels slow, and less reads as simultaneous.
- Do not put `entering` on a row of `FlatList`, `FlashList` or another virtualized list. Rows are recycled, so the animation fires each time a row scrolls into view. Animate the container once on mount, or use `itemLayoutAnimation` for reflow only.
- Use an entrance for content the user asked for and waits on. A list the user scrolls all day has no entrance.

## Keyboard-synced UI

Add the provider once in the root `_layout`, next to `GestureHandlerRootView`. The hook does nothing without it.

```jsx
import { KeyboardProvider, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';

<KeyboardProvider>
  <Stack />
</KeyboardProvider>

const { height } = useReanimatedKeyboardAnimation();   // 0 to -keyboardHeight, on the UI runtime
const footerStyle = useAnimatedStyle(() => ({ transform: [{ translateY: height.get() }] }));
```

Do not build this from `Keyboard.addListener` and a timing animation. The keyboard follows a private system curve, and the event arrives on the RN runtime after the keyboard starts to move. Any duration you pick lags or leads it.

## Tab indicator

Measure once with `onLayout`, then animate.

```jsx
const [layouts, setLayouts] = useState({});
const x = useSharedValue(0);
const w = useSharedValue(0);

useEffect(() => {
  const l = layouts[active];
  if (!l) return;
  x.set(withTiming(l.x, { duration: 250, easing: EASE_IN_OUT }));
  w.set(withTiming(l.width, { duration: 250, easing: EASE_IN_OUT }));
}, [active, layouts]);

const pillStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: x.get() }],
  width: w.get(),
}));
```

This is the allowed `width` animation from step 4: the pill is absolute and has no children. The easing is ease-in-out because the pill moves across the screen. Fire `Haptics.selectionAsync()` on the press, not when the pill lands.

## Screen transitions

Configure the native stack. The native transition keeps the interactive back gesture and matches the other apps on the device.

```jsx
<Stack screenOptions={{ animation: reduced ? 'fade' : 'default' }}>
  <Stack.Screen name="settings" options={{ animation: 'slide_from_right', animationMatchesGesture: true }} />
  <Stack.Screen name="compose" options={{ presentation: 'modal' }} />
  <Stack.Screen name="filter" options={{
    presentation: 'formSheet',
    sheetAllowedDetents: 'fitToContents',
    sheetGrabberVisible: true,
  }} />
</Stack>
```

| Navigation | Option |
| --- | --- |
| Deeper into a hierarchy | `animation: 'default'` |
| A self-contained task the user can abandon | `presentation: 'modal'` |
| A short interruption: picker, filter, share | `presentation: 'formSheet'` with detents |
| Between tabs | `animation: 'none'` |
| Reduced motion | `animation: 'fade'` |

Set `animationMatchesGesture: true` with each custom `animation`. The iOS back swipe then runs that transition in reverse under the finger.

`formSheet` differs between the platforms:

- Android allows three detents at most and drops the rest without an error. Design for three.
- `sheetGrabberVisible` is iOS only. Give Android another sign that the sheet drags.
- An Android form sheet cannot hold a native header or a nested stack. If the content needs navigation, use `presentation: 'modal'`.
- `fitToContents` needs content with an explicit size. A `flex: 1` root has no height to fit.

## Toast

```jsx
// Module scope.
const TOAST_ENTER = FadeInDown.duration(300).easing(EASE_OUT);
const TOAST_EXIT = FadeOutDown.duration(250).easing(EASE_OUT);

<Animated.View
  entering={TOAST_ENTER}
  exiting={TOAST_EXIT}
  style={{ position: 'absolute', bottom: insets.bottom + 16, left: 16, right: 16 }}
/>
```

- Keep it at 300ms or less. The user did not ask for a toast, so it is quiet and quick.
- It exits the way it entered. A different exit direction reads as a second element.
- The exit is about 20% faster than the entrance. The user has finished reading.
- Add the safe area inset. `bottom: 16` alone sits under the home indicator.

When toasts stack and the list reflows, add `itemLayoutAnimation`. Tune the opacity against the reflow by eye, and look again the next day.

## An action at a threshold

Use this for a detent, a snap, or pull-to-refresh arming.

```jsx
const armed = useSharedValue(false);

useAnimatedReaction(
  () => pullDistance.get() > REFRESH_THRESHOLD,
  (isArmed, wasArmed) => {
    if (isArmed !== wasArmed) {
      armed.set(isArmed);
      scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Light);
    }
  }
);
```

The comparison runs on the UI runtime each frame. The RN runtime call happens twice per pull.

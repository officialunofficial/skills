# Motion blur

Rules, recipes and checks for a blur streak on a moving element. The streak comes from the package `@web-kits/motion-blur`. Its defaults are exact: a 180 degree shutter, Echo at one copy per 1.5px up to 16 copies, and a smear limit of 1.05.

## Contents

- [When to blur](#when-to-blur)
- [Host and layer](#host-and-layer)
- [Techniques](#techniques)
- [Positions set by hand](#positions-set-by-hand)
- [Custom technique](#custom-technique)
- [Reduced motion](#reduced-motion)
- [Check a streak](#check-a-streak)
- [Checks](#checks)

## When to blur

Blur only what the eye cannot follow. A screen already smears what the eye tracks, so added blur turns text into grey bars while someone reads it.

- Blur a thrown card, a dismissed sheet, a panel that snaps in, or a spinner.
- Do not blur scrolling, a carousel page, a list that slides into place, or text that someone reads (`motion-blur-untracked-only`).

Draw the streak with the package: `useMotionBlur` in React, `motionBlur(element)` elsewhere. The package sizes the streak from speed, frame time and shutter. It follows curves and clears the streak at rest. A hand-written `filter: blur()` or a copy loop on a moving element does none of that (`motion-blur-package`).

## Host and layer

The element that moves is the host. Its first child is the layer, and the package draws the streak into the layer.

```tsx
import { useMotionBlur } from "@web-kits/motion-blur/react";

const blur = useMotionBlur();

<motion.div ref={blur.ref} animate={{ x: open ? 320 : 0 }}>
  <div className="card-face">...</div>
</motion.div>;
```

- Put the ref on the element that moves. The package watches the transform of the host itself, so a ref on a wrapper draws nothing (`motion-blur-ref-on-mover`). With the `MotionBlur` component, animate the component and style what sits inside it.
- Put backgrounds, borders and shadows on the layer or inside it. A background on the host stays sharp under the streak (`motion-blur-transparent-host`).
- Give the layer no transform of its own. The techniques write the transform of the layer, so a tilt or scale there is lost during motion. Put it on an element inside the layer (`motion-blur-bare-layer`).

The package picks up CSS transitions, CSS animations, the Web Animations API and inline transform changes without more code.

`MotionBlurProvider` sets the technique, the shutter and reduced motion for a tree. Options on one blur win over the provider. `shutter={0}` on a provider turns off every blur inside it.

```tsx
import { echo } from "@web-kits/motion-blur";
import { MotionBlurProvider } from "@web-kits/motion-blur/react";

<MotionBlurProvider technique={echo({ spacing: 1 })} shutter={270}>
  <App />
</MotionBlurProvider>;
```

## Techniques

Keep the default `echo()`. It is the only technique shaped like the blur of a camera, and the only one that follows rotation, scale and curves. Change to another technique only when a `frames` trace shows that the copies cost too much.

| Technique | Options | What it draws |
| --- | --- | --- |
| `echo()` | `spacing = 1.5`, `copies = 16` | Copies of the layer along the path, added with `plus-lighter` |
| `squeeze()` | `factor = 16` | One CSS blur, stretched along the motion |
| `svg()` | none | `feGaussianBlur` along one axis, turned to the motion |
| `smear()` | `limit = 1.05` | The layer stretched along the motion, with no blur |

- `squeeze()`, `svg()` and `smear()` blur the whole layer by one amount in one direction. The edges of a spinning element move at different speeds, so a spinner or an orbit uses Echo (`motion-blur-echo-for-turns`).
- Keep the smear limit at 1.05 on anything with text (`motion-blur-smear-limit`).
- `squeeze()` and `svg()` turn the layer and its child in opposite directions, so the layer wraps exactly one element. A layer with two children throws (`motion-blur-one-child`).

## Positions set by hand

For a physics loop or any position you calculate yourself, call `render` once a frame. The first call stops the automatic watch.

```ts
blur.render(previous, current);
```

When the motion bends, pass a path, so the copies sit along the curve. `t` is in frames, so `path(-0.5)` is half a frame back. Two transforms on an orbit draw a straight streak (`motion-blur-follow-path`).

```ts
element.style.transform = at(angle).toString();
blur.render((t) => at(angle + t * speed * frameTime));
```

A demo played at a quarter of its speed needs four times the shutter. `shutter: 720` keeps the streak of the full speed (`motion-blur-slowdown-shutter`).

## Custom technique

A custom technique returns a painter. Its `clear` removes every style that `paint` set. Its `destroy` removes anything it added to the page. A technique built inside a render also sets `key`, so an equal technique does not rebuild the painter (`motion-blur-custom-technique`).

```ts
import { sigmaFor, type Technique } from "@web-kits/motion-blur";

const soft: Technique = ({ layer }) => ({
  paint({ dx, dy }) {
    layer.style.filter = `blur(${sigmaFor(Math.hypot(dx, dy))}px)`;
  },
  clear() {
    layer.style.removeProperty("filter");
  },
});
soft.key = "soft";
```

Each frame carries `path(t)`, `matrix`, `dx` and `dy` in the px of the element, `streak` in screen px, and `origin`, `width` and `height`.

## Reduced motion

The package drops the streak under `prefers-reduced-motion: reduce` while `reducedMotion` stays at its default `"user"`. Do not set `reducedMotion: "never"` (`motion-blur-reduced-motion`).

## Check a streak

Freeze the motion at its fastest point, with a quarter-speed control or a paused timeline. Check in a focused tab, because a background tab throttles `requestAnimationFrame` and stretches every streak. At the frozen point:

- Sideways motion keeps sharp top and bottom edges. Only the leading and trailing edges soften.
- Echo shows no steps at the streak length you use.
- The streak at 60Hz is twice as long as the streak at 120Hz.
- Nothing stays blurred after the element stops.

`onFrame` reports the streak length in px each frame.

## Checks

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `motion-blur-untracked-only` | Blur on a carousel page swipe, or on text that someone reads | No blur, or blur only on the flung card | `HIGH` on text, else `MEDIUM` |
| `motion-blur-package` | `filter: blur(8px)` while a card flies | `useMotionBlur()` on the card | `MEDIUM` |
| `motion-blur-ref-on-mover` | `ref={blur.ref}` on a wrapper around the `motion.div` | `ref={blur.ref}` on the `motion.div` | `MEDIUM` |
| `motion-blur-transparent-host` | `bg-white rounded-xl` on the host | The same classes on its first child | `MEDIUM` |
| `motion-blur-bare-layer` | `rotate-3` on the layer | `rotate-3` on an element inside the layer | `MEDIUM` |
| `motion-blur-echo-for-turns` | `technique: squeeze()` on a spinner | `technique: echo()` | `MEDIUM` |
| `motion-blur-smear-limit` | `smear({ limit: 1.3 })` on a card with text | `smear()` at its 1.05 default, or `echo()` | `MEDIUM` |
| `motion-blur-one-child` | `squeeze()` on a layer that holds an icon and a label | The icon and the label inside one element | `HIGH` |
| `motion-blur-follow-path` | `blur.render(previous, current)` on an orbit | `blur.render((t) => at(angle + t * speed * frameTime))` | `LOW` |
| `motion-blur-slowdown-shutter` | A quarter-speed demo at `shutter: 180` | `shutter: 720` | `LOW` |
| `motion-blur-custom-technique` | An empty `clear() {}`, or an inline technique with no `key` inside a render | A `clear()` that removes every style `paint` set, and a `key` | `LOW` |
| `motion-blur-reduced-motion` | `reducedMotion: "never"` | The default `"user"` | `MEDIUM` |

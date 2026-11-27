---
name: mobile-native
description: Makes a web app feel native on a phone with small CSS and meta tag fixes. Covers stuck hover states, tap highlight flash, the 100vh bug, inputs that zoom the page, slow taps, pull-to-refresh that takes over scroll, content under the notch, long-press text selection, carousels that scroll the wrong way and status bar color. Use when a web app is built for or reviewed on mobile, when a page works in Chrome but feels wrong on a phone, or for a PWA, bottom sheet, carousel or touch interaction. For motion use `animate`. For React Native use `animate-expo`.
license: MIT
metadata:
  upstream-author: "Emil Kowalski"
  upstream-source: "emilkowalski/skills"
---

# Mobile native feel

Remove the signs that a web app is a website in a browser. This skill covers the platform layer: viewport, touch, scroll, safe areas and browser chrome. It does not design motion (`animate`) and does not cover React Native (`animate-expo`).

Most reports that an app feels janky on mobile are not animation problems. They are a tap delay, a gray flash on tap, or a hover state that stays on.

## Rules

- **Apply a fix where its reason applies.** `user-select: none` is correct on a button and a defect on body text.
- **Ask the platform, do not guess.** Use `(hover: hover)`, `(pointer: fine)`, `env()` and `dvh`. Do not branch on the user agent or the screen width to detect touch.
- **Write for touch and mouse together.** An iPad has a trackpad and a laptop has a touchscreen. Gate by capability, not by device.
- **Use CSS or a meta tag before JavaScript.** Almost every fix here is one declaration. A media query hides hover styles. A `useIsTouchDevice()` hook is the wrong tool.
- **Keep zoom on.** `user-scalable=no` and `maximum-scale=1` fail accessibility. The cause of the zoom is the input font size, so fix that.
- **Check on a phone.** Device emulation does not reproduce stuck hover, tap delay, rubber-banding, safe areas or the keyboard.

## Match the symptom

Find the symptom, apply the fix, and read the linked section of [FIXES.md](FIXES.md) when you need the reason, the full code or the edge cases.

| Symptom | Fix | Section |
| --- | --- | --- |
| Hover state stays after a tap | Wrap hover styles in `@media (hover: hover) and (pointer: fine)` | Hover |
| Gray or blue flash on tap | `-webkit-tap-highlight-color: transparent` on `html`, plus an `:active` state | Tap highlight |
| Layout has the wrong height | `100dvh` for an app shell, `100svh` for a hero | Viewport height |
| Page zooms into an input | Input font size of 16px or more | Input zoom |
| Tap feels slow | Feedback on pointer-down, plus `touch-action: manipulation` | Tap delay |
| Pull-to-refresh takes over scroll | `overscroll-behavior: none` on `html, body`, `contain` on inner scrollers | Overscroll |
| Content stops at the notch | `viewport-fit=cover` plus `env(safe-area-inset-*)` | Safe areas |
| Long press selects button text | `user-select: none` on controls only | Selection |
| Carousel scrolls the page | `touch-action: pan-y` on the gesture surface | Touch action |
| Status bar color does not match | One `theme-color` per color scheme | Theme color |
| Correct in Chrome, wrong on a phone | Test on hardware | Hardware |

## Baseline

Ship this before the first component of a mobile-facing app.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
```

```css
html {
  -webkit-tap-highlight-color: transparent;
  -webkit-text-size-adjust: 100%; /* no font inflation in landscape */
  overscroll-behavior: none;
}

input, textarea, select {
  font-size: 16px;
}

button, a, [role="button"] {
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
}

@media (hover: hover) and (pointer: fine) {
  /* every :hover rule goes here */
}
```

`interactive-widget=resizes-content` makes the Android keyboard shrink the layout viewport, so `100dvh` and bottom-pinned inputs react as they do on iOS. Remove `overscroll-behavior: none` from `html` when the app is a scrolling document that wants pull-to-refresh.

## Check before you finish

| Found in the code | Replace with |
| --- | --- |
| `user-scalable=no` or `maximum-scale=1` | 16px inputs |
| A `:hover` rule with no media query | `@media (hover: hover) and (pointer: fine)` |
| `100vh` on an app shell or bottom-pinned UI | `100dvh` |
| `100dvh` on a marketing hero | `100svh`, which does not shift on scroll |
| Press feedback on `click` only | `:active` or `pointerdown` |
| `touchmove` with `preventDefault()` to stop overscroll | `overscroll-behavior` |
| `user-select: none` on `body` | The same rule on controls only |
| `touch-action: none` on an element the user scrolls past | `pan-x` or `pan-y` |
| `env(safe-area-inset-*)` with no `viewport-fit=cover` | Add the meta tag. Without it each inset is 0. |
| One `theme-color` for both schemes | One per `prefers-color-scheme` |
| User agent checks for touch | `(hover)` and `(pointer)` media queries |

## Report

Apply the fixes, then report in a few lines:

- **What was wrong:** the symptom and its cause in one line.
- **What changed:** the file and the declaration, one line each.
- **What needs a phone:** which fixes you confirmed from code, and which the user must confirm on hardware.

If you cannot run the app on a device, say so. Do not report a fix as confirmed from device emulation. `verify` covers the check in the running app.

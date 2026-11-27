# Mobile fixes: reasons and code

Each section gives the cause, the code and the edge cases for one row of the symptom table in SKILL.md.

## Contents

- Hover
- Tap highlight
- Viewport height
- Input zoom
- Tap delay
- Overscroll
- Safe areas
- Selection
- Touch action
- Theme color
- Hardware

## Hover

Touch has no hover, so the browser simulates it. The first tap applies `:hover`, and the state stays until the user taps another element. A button that grows on hover stays large after a tap.

```css
@media (hover: hover) and (pointer: fine) {
  .button:hover {
    background: var(--gray-3);
    transform: scale(1.02);
  }
}
```

Use both conditions. `(hover: hover)` says the primary input can hover. `(pointer: fine)` says the input is precise, which excludes a stylus and the Android devices that report hover in error.

In Tailwind v4 the `hover:` variant compiles to `@media (hover: hover)`. In v3, set `future.hoverOnlyWhenSupported`.

Touch users still need press feedback. Give it with `:active` (see Tap delay), which works for every input type.

## Tap highlight

iOS Safari and Android Chrome paint a translucent highlight on a tapped element that has a click handler. It is the clearest sign of a website, and it conflicts with your own press feedback.

```css
html {
  -webkit-tap-highlight-color: transparent;
}
```

Set it once for the page. Then give every tappable element an `:active` state, because the highlight was the only feedback the browser gave.

## Viewport height

On mobile, `100vh` is the largest viewport: the height with the browser chrome collapsed. On page load the URL bar shows, so a `100vh` element overflows by the height of the bar and a bottom-pinned button sits under it.

```css
/* App shell, drawer, anything that follows the visible area */
.app { height: 100dvh; }

/* Hero or first screen: the smallest viewport, so nothing is cut off */
.hero { min-height: 100svh; }
```

- `dvh` changes as the URL bar collapses. That is correct for an app shell and causes layout shift on marketing content during scroll.
- `svh` is stable and does not overflow. That is correct for a hero.
- `lvh` equals the old `vh`. You almost never want it.

Add a `100vh` line above as a fallback only when the project supports browsers that need it.

## Input zoom

iOS Safari zooms the page when focus lands on an input with a font size under 16px. It does not zoom out on blur, so the user sees a cropped layout.

```css
input, textarea, select {
  font-size: 16px; /* the minimum; 1rem at the default root size */
}
```

If the desktop design needs smaller input text, raise the size only for touch:

```css
@media (pointer: coarse) {
  input, textarea, select { font-size: 16px; }
}
```

Set the keyboard in the same pass:

| Field | Attribute |
| --- | --- |
| Code | `inputmode="numeric"` |
| Amount | `inputmode="decimal"` |
| Email, phone | `type="email"`, `type="tel"` |
| Username, code | `autocapitalize="none"` and `autocorrect="off"` |
| Any | `enterkeyhint="send"`, `"search"` or `"done"`, so the return key names its action |

## Tap delay

Two causes add up.

**The 300ms click delay.** The browser waits after a tap for a second tap, because a double tap zooms. A viewport of `width=device-width` removes the wait in most cases, but iOS Safari still delays on some elements. `touch-action: manipulation` says the element never zooms on double tap, so `click` fires at once.

```css
button, a, [role="button"], .tappable {
  touch-action: manipulation;
}
```

**Feedback on release.** A native button responds when the finger lands. A web button that changes on `click` responds when the finger leaves, and that reads as lag at any speed. Style `:active`. In JavaScript, listen for `pointerdown`, not `click`.

```css
.button {
  transition: transform 100ms var(--ease-out), background 100ms;
}
.button:active {
  transform: scale(0.97);
  background: var(--gray-4);
}
```

Keep press feedback at 100 to 160ms with ease-out. If the codebase has easing tokens from `animate`, use them.

## Overscroll

A scroll past the top of the page starts pull-to-refresh on Android Chrome and the page rubber band on iOS. That suits a document. It is wrong for an app with its own scroll containers, a drawer the user drags down, or a canvas.

```css
html, body {
  overscroll-behavior: none;
}

.sheet-content {
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

Use `none` on the root and `contain` on inner scrollers such as sheet content, a chat list or a sidebar. `contain` keeps the bounce of the container, which feels native, and stops the page behind it from moving.

Do not use a `touchmove` listener with `preventDefault()`. It blocks all scrolling and makes the listener non-passive, which costs frames.

## Safe areas

By default the browser fits the page inside the safe area. The notch, Dynamic Island and home indicator zones show the body background. A native app paints edge to edge and pads its content away from those zones.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

```css
.app-header { padding-top: env(safe-area-inset-top); }
.bottom-bar { padding-bottom: env(safe-area-inset-bottom); }
.sheet      { padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px)); }
```

- `viewport-fit=cover` lets the page under the notch. Without the meta tag each `env()` inset is `0px`.
- Fixed headers, bottom tab bars, toasts and sheets need the insets. Normal page content gets them through the header padding.
- Give `env()` a fallback value when you use it in a `calc()`.

## Selection

A long press on a web button selects its label on iOS, and a long press on a link opens the copy and share callout. Native controls do neither. Text that is a control is not selectable. Text that is content stays selectable.

```css
button, [role="button"], .tab, .chip, .drag-handle {
  user-select: none;
  -webkit-user-select: none;   /* Safari needs the prefix */
  -webkit-touch-callout: none; /* no callout on links and images used as controls */
}
```

Do not set this on `body`. Users copy addresses, error messages and order numbers.

## Touch action

The browser cannot tell whether a horizontal swipe on a carousel scrolls the page or the track. It guesses, and the page often moves up while the carousel moves. Tell the browser which axes it keeps.

```css
.carousel              { touch-action: pan-y; } /* browser keeps vertical; the carousel takes horizontal */
.vertical-sheet-handle { touch-action: pan-x; } /* browser keeps horizontal; the sheet takes vertical */
.drag-surface          { touch-action: none;  } /* a custom gesture owns every axis */
```

The value names what the browser may still do. Use `none` only on an element that handles every axis, or the user cannot scroll past it.

For a carousel on native scroll, use `scroll-snap-type: x mandatory` on the track and `scroll-snap-align: start` on each slide. The browser physics are better than a hand-written spring, and `touch-action` is not needed.

## Theme color

The status bar and browser chrome take their color from `theme-color`. With one value, light mode gets a dark bar or dark mode gets a white one.

```html
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
<meta name="color-scheme" content="light dark" />
```

- Match the color at the top of the page: the header background, not the brand color.
- In Next.js, set it in the `viewport` export: `themeColor: [{ media, color }]`.
- If the app changes theme with a class, update the tag from JavaScript on each change.
- For an installed PWA, `apple-mobile-web-app-status-bar-style` and the manifest `theme_color` and `background_color` take the same decision.

## Hardware

None of the behaviors above appear in device emulation: stuck hover, the tap highlight, the URL bar effect on `vh`, input zoom, the click delay, overscroll, safe areas and the software keyboard.

1. Connect the phone by USB. Run the dev server on `0.0.0.0` and open it by the LAN IP of the machine.
2. Attach the inspector. iOS: Safari, Develop menu, the device. Android: `chrome://inspect`.
3. Test on a phone that is a few years old. Test with the keyboard open. Test landscape once.
4. If a PWA is a target, test the installed app. Standalone mode changes the viewport, the safe areas and the status bar.

The Xcode Simulator is better than emulation but does not reproduce touch feel.

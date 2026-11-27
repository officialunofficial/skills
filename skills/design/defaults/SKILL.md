---
name: defaults
description: Applies the interface defaults that every screen needs, with exact values for scroll edges, shadows and surfaces, focus, hit areas, mobile viewport and touch, forms, type, loading states, sound, hotkeys and dialogs. Use when building or reviewing a screen, a form, a dialog or overlay, a scroll container, a loading state or a mobile layout, or when asked to polish a UI or check accessibility basics.
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Defaults

These defaults apply on every screen. Use the project's token wherever one exists for a value below. Where none exists, the values here are exact. In any visual style, a hard scroll cut or a clipped shadow is a finding.

Neighbouring skills own the rest. `copy` owns words and punctuation. `reuse` owns building these with the project's primitive. `restraint` decides whether a sound or an animation should exist. `motion` owns how things move. `color` owns colour and contrast. `alignment` owns concentric radii, optical nudges and icon alignment.

Each rule ends with its rule id. Cite that id in a finding.

- Read [checks.md](checks.md) when you review a screen. It pairs each id with a broken line, its replacement and a severity.
- Read [recipes.md](recipes.md) when you write the code for a rule marked "recipe".

## Scroll

- A scroll container fades at its ends with a `mask-image` gradient, not a hard cut (`defaults-fade-not-cut`, recipe).
- Give a scroller enough padding that the shadows of its children fit inside it (`defaults-no-clipped-shadow`, recipe).
- Code blocks and data tables scroll sideways with a hidden scrollbar. They do not wrap (`defaults-scroll-not-wrap`, recipe).
- Scrollable dialogs, drawers, menus and side panels set `overscroll-behavior: contain`, so the page behind stays still (`defaults-contain-overscroll`).
- A sticky header or footer takes a 1px border against the content that scrolls under it (`defaults-sticky-border`).
- Set `scroll-padding-block-start` to the height of the sticky header, so anchors and focused fields land below it (`defaults-clear-sticky-chrome`).

## Surfaces

- A floating popover, menu or card pairs its shadow with a translucent 1px ring inside the shadow stack, not an opaque `border`. Keep `border: 1px solid transparent` under the ring, so forced-colours mode still draws an edge (`defaults-ring-not-border`).
- Use the project's elevation token. Without one, layer three shadows, all offset downward, with blur that grows and opacity that falls (`defaults-layered-shadows`, recipe).
- To raise a surface on hover, fade in a pseudo-element that holds the raised shadow. Do not transition `box-shadow` (`defaults-fade-the-shadow`, recipe).
- Photos and screenshots take a 1px outline inset by 1px: black at 10% in light mode, white at 10% in dark. Skip logos and transparent artwork (`defaults-image-outline`, recipe).
- A card does not sit inside a card. Put the heading outside, and let one surface hold the content (`defaults-no-nested-cards`).
- Buttons and chips use the radius token, not `border-radius: 9999px` (`defaults-rounded-not-pill`).
- Drop decorative gradients, glows, blur and depth effects (`defaults-no-decoration`).

## Theme

- A dark theme sets `color-scheme: dark` on the root, so scrollbars and native controls follow it. Set one `theme-color` tag per colour scheme, matched to the top of the page (`defaults-color-scheme`).
- A theme switch turns transitions off for one frame, so the colours do not all fade at once (`defaults-quiet-theme-switch`, recipe).

## Focus and targets

- Show the focus ring with `:focus-visible` and `outline`, so a click does not draw it (`defaults-focus-keyboard-only`).
- A dialog moves focus inside on open, keeps Tab inside, and returns focus to its trigger on close. A native `<dialog>` opened with `showModal()` handles the trap (`defaults-trap-and-return-focus`).
- Every interactive target is at least 24px on its shorter side. Aim for 40px with a mouse and 44px on touch. When the glyph is smaller, a pseudo-element with a negative inset carries the hit area. Extended hit areas do not overlap (`defaults-hit-area`, recipe).
- An icon-only button carries an `aria-label` that says what it does (`defaults-name-icon-buttons`).
- Status does not rest on colour alone. Pair the colour with an icon or a word (`defaults-not-color-alone`).

## Navigation

- Navigation uses `<a href>`, so new-tab clicks, middle clicks and copy link all work (`defaults-links-are-links`).
- Filters, tabs, pagination and open panels write to the URL, so refresh, share and Back keep them (`defaults-state-in-url`).
- Open one dialog at a time. From inside a dialog, use a menu, a popover or a new page (`defaults-no-stacked-dialogs`).

## Mobile and touch

The viewport tag and the base CSS for this section are in the [mobile baseline](recipes.md#mobile-baseline).

- Leave zoom on. Do not set `maximum-scale=1` or `user-scalable=no` (`defaults-allow-zoom`).
- Set `-webkit-tap-highlight-color: transparent` once on the root, and give every tappable element its own `:active` state (`defaults-no-tap-highlight`).
- Buttons and links set `touch-action: manipulation`, so a tap fires without a 300ms wait for a second tap (`defaults-fast-tap`).
- Wrap hover-only styles in `@media (hover: hover) and (pointer: fine)`. Without it, a tap leaves them stuck on a touch screen (`defaults-hover-capable-only`).
- An app shell or a bottom-pinned bar uses `100dvh`. A first screen uses `min-height: 100svh`. With `100vh`, the URL bar hides the bottom controls (`defaults-dynamic-viewport`).
- Add `viewport-fit=cover` to the viewport tag. Then pad fixed headers, tab bars, toasts and sheets with `env(safe-area-inset-*)` (`defaults-safe-areas`).
- Buttons, tabs, chips and drag handles set `user-select: none`, so a long press does not select the label. Content text stays selectable (`defaults-controls-not-selectable`).

## Keyboard and forms

- Hotkeys do not fire while an input, a textarea or an editable element has focus (`defaults-keys-ignore-inputs`, recipe).
- Enter submits a form with one field, and submits from the last field of a longer form. In a textarea, Enter adds a line, and Cmd or Ctrl with Enter submits (`defaults-enter-submits`).
- A field accepts input the way people type or paste it, such as spaces in a card number. Strip the formatting in code and show the clean value. Do not block paste, and trim the trailing space that some keyboards add (`defaults-accept-messy-input`).
- Every field sets `type`, `inputmode` and `autocomplete`, so the keyboard and autofill fit it (`defaults-input-types`).
- On mobile, an input renders at 16px or larger. Below that, iOS zooms the page on focus (`defaults-input-16px`).
- Every control has a label, and a click on the label works the control (`defaults-label-hit-area`).
- Submit stays enabled until the request starts. On submit, show each error beside its field and focus the first one (`defaults-validate-on-submit`).
- A busy button keeps its label, shows an indicator and disables itself (`defaults-loading-button`).
- Offer undo after a destructive action. Where undo is impossible, confirm in place with a menu or a popover (`defaults-undo-destructive`).

## Type and content

- Prices, counts, timers and table columns use `font-variant-numeric: tabular-nums` (`defaults-tabular-numbers`).
- Headings take `text-wrap: balance`. Body paragraphs take `text-wrap: pretty` (`defaults-balanced-wrap`).
- Set `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` once, on the root (`defaults-antialiased-root`).
- Monospace inside running text drops to `0.9em` (`defaults-inline-mono`).
- Truncated text that the user needs opens in full through a tooltip, an expand control or a detail view. File names and paths truncate in the middle, where they differ. Numbers, amounts and dates do not truncate (`defaults-truncate-with-way-back`).
- Test every field with the longest realistic value. Text columns take `min-width: 0`. Fixed boxes such as avatars take `flex-shrink: 0`. Emails and URLs take `overflow-wrap: anywhere` (`defaults-survives-long-content`).
- A missing optional field drops its line. It does not show a placeholder dash (`defaults-omit-empty-fields`).
- Format numbers, dates and plurals through `Intl.NumberFormat`, `Intl.DateTimeFormat` and `Intl.PluralRules` (`defaults-locale-format`).

## Feedback

- Toasts, result counts and inline validation sit in a polite live region, `role="status"`. Render the region empty before its text changes (`defaults-announce-updates`).
- An action responds within 400ms, or shows feedback at once: an optimistic value, a skeleton or a progress bar. A loading branch does not return `null` (`defaults-instant-feedback`).
- Hold a spinner or skeleton back 150 to 300ms. After it shows, keep it up at least 300 to 500ms. A skeleton matches the layout it stands in for (`defaults-no-flicker-loading`, recipe).

## Sound

- Sound fits a confirmation, such as a payment, an upload or a submit, and an error that the user must not miss. Every cue has a visible twin, such as a status change (`defaults-sound-has-a-twin`).
- Typing, hover, scroll and keyboard navigation make no sound (`defaults-no-sound-on-repeat`).
- The user can turn sound off, and volume starts at `0.3` (`defaults-sound-optional`, recipe).

## Reporting

Write one finding per root cause:

```
file:line - [rule-id] what is wrong
```

Then add a `Rule | Count | Severity` summary. Take the severity from [checks.md](checks.md). The verdict is `Block` while any `HIGH` finding remains, and `Approve` otherwise.

Approve only files you read. Open the screen when a check depends on layout. Mark each check you could not run as `Not verified`.

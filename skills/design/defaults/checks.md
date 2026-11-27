# Defaults checks

Each row pairs a rule id with a broken line, the line that replaces it and the severity of a finding.

## Contents

- [Severity](#severity)
- [Scroll](#scroll)
- [Surfaces](#surfaces)
- [Theme](#theme)
- [Focus and targets](#focus-and-targets)
- [Navigation](#navigation)
- [Mobile and touch](#mobile-and-touch)
- [Keyboard and forms](#keyboard-and-forms)
- [Type and content](#type-and-content)
- [Feedback](#feedback)
- [Sound](#sound)

## Severity

- `HIGH` breaks use or access: the user cannot see, reach, read or undo something.
- `MEDIUM` makes the screen behave wrongly without blocking the user.
- `LOW` is a surface or type detail that is off.

## Scroll

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `defaults-fade-not-cut` | `overflow: auto` with a hard cut | A `mask-image` fade at both ends | `HIGH` |
| `defaults-no-clipped-shadow` | A card shadow cut by `overflow: hidden` | `padding: 8px` on the scroller | `HIGH` |
| `defaults-scroll-not-wrap` | A code line that wraps to two lines | `white-space: nowrap` and `overflow-x: auto` | `MEDIUM` |
| `defaults-contain-overscroll` | A drawer list that scrolls the page at its end | `overscroll-behavior: contain` on the drawer | `MEDIUM` |
| `defaults-sticky-border` | A sticky header with no edge | `border-bottom: 1px solid var(--gray-a4)` | `LOW` |
| `defaults-clear-sticky-chrome` | A focused field under a 56px sticky header | `scroll-padding-block-start: 56px` | `MEDIUM` |

## Surfaces

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `defaults-ring-not-border` | `border: 1px solid #e5e5e5` plus `box-shadow` on a popover | `0 0 0 1px var(--gray-a4)` first in the shadow, over a transparent border | `LOW` |
| `defaults-layered-shadows` | `box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2)` | Three downward layers, with more blur and less opacity each | `LOW` |
| `defaults-fade-the-shadow` | `transition: box-shadow 200ms` | `opacity` on an `::after` that holds the raised shadow | `LOW` |
| `defaults-image-outline` | A photo with no edge on a white card | `outline: 1px solid rgba(0, 0, 0, 0.1)` at `outline-offset: -1px` | `LOW` |
| `defaults-no-nested-cards` | A card that holds a heading and another card | The heading above one card | `MEDIUM` |
| `defaults-rounded-not-pill` | `border-radius: 9999px` on a button | `border-radius: var(--radius-2)` | `MEDIUM` |
| `defaults-no-decoration` | A gradient glow behind a card | A flat background | `LOW` |

## Theme

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `defaults-color-scheme` | A dark theme with light scrollbars | `color-scheme: dark` on the root | `LOW` |
| `defaults-quiet-theme-switch` | Every colour transition fires on a theme switch | Transitions off for one frame | `LOW` |

## Focus and targets

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `defaults-focus-keyboard-only` | `.button:focus { box-shadow: 0 0 0 2px var(--accent) }` | `.button:focus-visible { outline: 2px solid var(--accent) }` | `MEDIUM` |
| `defaults-trap-and-return-focus` | Tab reaches the page behind a dialog | Focus stays inside, then returns to the trigger | `HIGH` |
| `defaults-hit-area` | A 16px icon button with a 16px hit box | `inset: -12px` on its `::before`, for a 40px target | `HIGH` |
| `defaults-name-icon-buttons` | `<button><TrashIcon /></button>` | `<button aria-label="Delete">` | `HIGH` |
| `defaults-not-color-alone` | A red dot as the only error cue | The dot with an icon or the word `Failed` | `HIGH` |

## Navigation

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `defaults-links-are-links` | `<div onClick={() => router.push("/settings")}>` | `<a href="/settings">` | `HIGH` |
| `defaults-state-in-url` | A filter held only in `useState` | `?status=open` in the URL | `MEDIUM` |
| `defaults-no-stacked-dialogs` | A confirm dialog opened from a settings dialog | A menu or a popover inside the dialog | `HIGH` |

## Mobile and touch

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `defaults-allow-zoom` | `maximum-scale=1, user-scalable=no` | `width=device-width, initial-scale=1` | `HIGH` |
| `defaults-no-tap-highlight` | The grey flash of the browser on every tap | `-webkit-tap-highlight-color: transparent` and an `:active` style | `MEDIUM` |
| `defaults-fast-tap` | A button that responds 300ms after the tap | `touch-action: manipulation` | `MEDIUM` |
| `defaults-hover-capable-only` | `.card:hover { transform: translateY(-2px) }` | The same rule inside `@media (hover: hover) and (pointer: fine)` | `MEDIUM` |
| `defaults-dynamic-viewport` | `height: 100vh` on the app shell | `height: 100dvh` | `HIGH` |
| `defaults-safe-areas` | A tab bar under the home indicator | `padding-bottom: env(safe-area-inset-bottom)` with `viewport-fit=cover` | `HIGH` |
| `defaults-controls-not-selectable` | A long press that selects the label of a tab | `user-select: none` on the tab | `MEDIUM` |

## Keyboard and forms

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `defaults-keys-ignore-inputs` | `J` moves the selection while the user types in search | Hotkeys skip `input`, `textarea` and `[contenteditable]` | `HIGH` |
| `defaults-enter-submits` | A search field with no `form` around it | A `form` whose `onSubmit` runs the search | `MEDIUM` |
| `defaults-accept-messy-input` | A phone field that rejects `+1 (555) 010-2030` | Accepted, stored as `+15550102030`, shown formatted | `HIGH` |
| `defaults-input-types` | `<input type="text">` for an email | `type="email" autocomplete="email"` | `MEDIUM` |
| `defaults-input-16px` | `font-size: 14px` on a mobile input | `font-size: 16px` | `MEDIUM` |
| `defaults-label-hit-area` | A checkbox beside a bare `span` | The checkbox and its text inside one `label` | `MEDIUM` |
| `defaults-validate-on-submit` | `disabled={!isValid}` on submit | Enabled, with errors shown and the first one focused on submit | `HIGH` |
| `defaults-loading-button` | A spinner in place of the label | The label, a spinner beside it, the button disabled | `MEDIUM` |
| `defaults-undo-destructive` | A delete that happens at once with no way back | A toast with `Undo` | `HIGH` |

## Type and content

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `defaults-tabular-numbers` | A timer that shifts width as it ticks | `font-variant-numeric: tabular-nums` | `MEDIUM` |
| `defaults-balanced-wrap` | One word alone on the last line of a heading | `h1 { text-wrap: balance }` and `p { text-wrap: pretty }` | `LOW` |
| `defaults-antialiased-root` | Default subpixel smoothing on light text | `-webkit-font-smoothing: antialiased` on the root | `LOW` |
| `defaults-inline-mono` | `<code>` at the size of its sentence | `font-size: 0.9em` | `LOW` |
| `defaults-truncate-with-way-back` | A truncated file name and nothing else | A tooltip with the full name | `HIGH` |
| `defaults-survives-long-content` | A long email that pushes the row menu off screen | `min-width: 0` on the text, `flex-shrink: 0` on the menu | `HIGH` |
| `defaults-omit-empty-fields` | A dash where a missing role would be | No role line | `LOW` |
| `defaults-locale-format` | `{count} members` with `count` at `1` | `Intl.PluralRules` picks `member` or `members` | `MEDIUM` |

## Feedback

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `defaults-announce-updates` | A toast mounted with its text and no role | An empty `role="status"` region whose text updates | `MEDIUM` |
| `defaults-instant-feedback` | `if (isLoading) return null` | `if (isLoading) return <Skeleton />` | `HIGH` |
| `defaults-no-flicker-loading` | A spinner shown for a 40ms response | Shown after 200ms, held for at least 400ms | `MEDIUM` |

## Sound

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `defaults-sound-has-a-twin` | `playSound("success")` with no status change | `setStatus("success")` beside the sound | `HIGH` |
| `defaults-no-sound-on-repeat` | `playSound("keystroke")` inside `onChange` | No sound on typing | `MEDIUM` |
| `defaults-sound-optional` | `audio.volume = 1` and no off switch | A sound setting, with volume `0.3` by default | `HIGH` |

---
name: color
description: Holds text and control contrast to exact WCAG ratios measured on screen, routes colour through role tokens, keeps neutrals translucent, gives dark mode its own palette and limits the accent to action. Use when choosing or reviewing colours, checking contrast or readability, adding or auditing a dark theme, placing text over an image, or adding colour tokens to a component.
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Color

These colour rules apply on every screen. The contrast ratios are exact and apply in every theme. In any visual style, a ratio under its threshold is a finding.

Neighbouring skills own the rest. `reuse` owns the search for an existing token. `defaults` owns `color-scheme`, `theme-color`, the theme switch and status shown by colour alone. `restraint` decides whether a colour should be there at all.

Each rule ends with its rule id. Cite that id in a finding.

## Contrast

- Text under 24px, or under 18.66px when bold, meets 4.5:1 against what sits behind it. Larger text meets 3:1. Placeholders and secondary text count. Disabled controls do not (`color-text-contrast`).
- The edge that shows where a field is, the track of a toggle, and an icon that carries meaning meet 3:1 against their surround. Dividers and the ring on a floating surface are decoration and are exempt (`color-ui-contrast`).
- Text on a photo or a video sits on a gradient scrim or a solid plate. The ratio holds at the lightest point of the image under the text (`color-scrim-under-text`).

## Measure the drawn colour

Read a ratio from the colour the screen draws, not from the name or the hex of a token. Translucent colours and `opacity` composite over every layer behind them, and that changes the ratio. Measure each theme, and each surface the text appears on (`color-measure-composited`).

Run [contrast.js](contrast.js) in the page through the evaluate call of the browser. It returns `{ findings, unverified }`, with the composited contrast of each visible text run and each field edge. Treat each result as a candidate. Confirm it in a zoomed crop before you report it.

## Tokens

- A component references a token named for its role, such as `--text-secondary` or `--surface-raised`. Only the theme file maps a role to a palette step (`color-role-tokens`).
- Borders, dividers, hover fills and pressed fills use alpha neutrals, so they show on any surface beneath them (`color-alpha-neutrals`).

## Dark mode

Dark mode is its own palette, not the light palette inverted.

- A dark surface rises by getting lighter, because a shadow barely shows on a dark page (`color-dark-raises-lighter`).
- Accents and status colours take dark values tuned for contrast (`color-dark-tuned-accents`).

## Accent and status

- The accent colour marks the primary action, the selection and focus. It does not decorate headings or icons (`color-one-accent`).
- Each status colour keeps one meaning. Red marks errors and destructive actions only (`color-status-meaning`).

## Checks

Each row pairs a rule id with a broken line, the line that replaces it and the severity of a finding.

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `color-text-contrast` | `color: #999` on white, 2.8:1 | `color: #737373`, 4.7:1 | `HIGH` on a primary surface |
| `color-ui-contrast` | A field edged by `#e5e5e5` on white, 1.3:1 | `border-color: #8a8a8a`, 3.5:1 | `HIGH` |
| `color-scrim-under-text` | White text straight over a bright sky | `linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)` under the text | `HIGH` |
| `color-measure-composited` | "The token is `#171717`, so it passes", while the text sits at `opacity: 0.6` | The ratio of the drawn colour, read on screen | `MEDIUM` |
| `color-role-tokens` | `color: var(--gray-500)` in `Card` | `color: var(--text-secondary)` | `MEDIUM` |
| `color-alpha-neutrals` | `background: #f5f5f5` on hover, which vanishes on a grey card | `background: var(--gray-a3)` on hover | `MEDIUM` |
| `color-dark-raises-lighter` | A dark popover at the `#0a0a0a` of the page, raised by shadow alone | The popover at `#1a1a1a` over the `#0a0a0a` page | `MEDIUM` |
| `color-dark-tuned-accents` | `#2563eb` links on `#0a0a0a`, 3.8:1 | `#60a5fa` in the dark theme, 7.8:1 | `MEDIUM` |
| `color-one-accent` | Section headings in the accent colour | Headings in `--text-primary`, the accent on the primary button | `LOW` |
| `color-status-meaning` | A red "New" badge | A neutral or accent badge | `LOW` |

## Reporting

Write one finding per root cause, with the ratio you measured:

```
file:line - [rule-id] what is wrong (measured ratio)
```

Then add a `Rule | Count | Severity` summary. The verdict is `Block` while any `HIGH` finding remains, and `Approve` otherwise.

Approve only themes you opened. Mark text over canvas, video and cross-origin frames as `Not verified`, because the script cannot read those pixels.

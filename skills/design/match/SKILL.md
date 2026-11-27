---
name: match
description: "Rebuilds a named reference from its real source and measured values, then compares reference and rebuild side by side in every state. Use when the user points at another app, site, URL, screenshot or design file and says make it like this, one to one, exact, copy this menu, or inspired by."
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Match

Rebuild something the user pointed at in another app, site or design. Work from the real source and its measured values, not from memory of how it looks.

## One to one means exact values

When the user says "one to one", "exact" or "like this", every value comes from the reference, and a guessed value is a finding. When the user says "inspired by", carry the concept and use the project's own tokens.

`reuse` owns building with the project's existing parts. `verify` checks the running result.

## Steps

1. **Open the real source.** Open the reference itself: the live page, the installed app, the design file or the screenshot. When the reference is a native or desktop app, look at that app, not at its website, because a marketing page shows a different interface.
2. **Read the values.** Read computed styles, design tokens or measurements from the source. Write down sizes, spacing, radius, colours, type, durations and easing. A radius chosen by eye is usually wrong by a few pixels, and those pixels are what the user sees.
3. **Inventory the states.** List every state the reference has: hover, pressed, focus, open, empty, loading, error, selected and disabled. Then list its transitions. A rebuild of the resting state alone is incomplete.
4. **Copy the named part.** Rebuild the part the user named and nothing around it. Carry the idea, not the brand: their logo, product names and colours stay behind unless the user asked for them.
5. **Compare side by side.** Capture the reference and the rebuild in every state from step 3, at one size and one device scale factor. Name every difference that remains.

## The compare page

Copy [compare.html](compare.html) to `.match/[part]/index.html`. Keep `.match/` out of version control and out of the source tree. Write `compare.js` beside the page in the shape that its header comment shows, put the captures in `img/`, then open the page.

The page is part of the skill, so write data only. Mark each value `Match`, `Differs` or `Not Verified`. The user sends the remaining differences back with Copy Differences.

## Checks

| Rule | Broken | Replacement |
| --- | --- | --- |
| `match-inspect-the-source` | A menu rebuilt from memory | The live menu opened and inspected |
| `match-same-platform` | A desktop app judged by its website | The installed app opened |
| `match-read-computed-values` | `border-radius: 8px` by eye | The `6px` read from computed styles |
| `match-inventory-states` | The resting state only | Hover, pressed, open, empty and error rebuilt |
| `match-copy-the-named-part` | The whole layout copied for "the sidebar" | The sidebar only |
| `match-concept-not-brand` | Their logo and accent colour in the rebuild | The pattern in the project's tokens |
| `match-side-by-side` | "Looks close" | Both at one size, differences listed |
| `match-shipped-compare` | A compare page written from scratch | `compare.html` copied, only `compare.js` written |

## Reporting

When the skill runs as a review, write one finding per root cause:

```
file:line - [rule-id] what is wrong
```

Severity:

- `HIGH`: a rebuild made without opening the source, or a missing state that the user named.
- `MEDIUM`: a guessed value under "one to one", a part copied beyond the request, or a hand-written compare page.
- `LOW`: a remaining difference that was found and named.

Close with a `Rule | Count | Severity` summary and a verdict: `Block` while any `HIGH` remains, `Approve` otherwise. Mark every value you could not read from the source as `Not verified`.

# Worst-case catalog

Realistic values that break UI, grouped by the kind of value a component renders. Use the rows that match the fields in your surface map. Each note says what the value tends to break.

Use `example.com`, `example.org`, or `.test` domains so a fixture never points at a real inbox or site.

## Contents

- People and names
- Emails, URLs, identifiers
- Labels, titles, and copy from data
- Numbers and money
- Collections
- Time
- Images and media
- States
- Environment

## People and names

| Value | Breaks |
| --- | --- |
| `Aleksandra Wiśniewska-Kowalczyk` | Long, hyphenated, with diacritics. Wraps to two lines, and the hyphen is a break point |
| `Christopher Alexander Montgomery III` | Long with a suffix. First plus last initials give `CI` |
| `Konstantin Oberhauser-Wettstein` | Long compound name. Overflows single-line rows |
| `Jo` | Two letters. The name column looks empty, and naive initials give `J` |
| `J` | One letter. Single-character initials, and a tiny click target when the name is the link |
| `Ólafur Darri Ólafsson` | Accented capital first. Tests uppercase and sort logic, initials `ÓÓ` |
| `Đặng Thị Ngọc Hân` | Stacked Vietnamese marks. Clipped by tight `line-height` plus `overflow: hidden` |
| `王秀英` | CJK with no spaces. "First plus last word" initials find one word, and the text breaks anywhere |
| `نور الهدى عبد الرحمن` | RTL. Punctuation and icons land on the wrong side without `dir="auto"` |
| `Seán O'Brien-Ó Súilleabháin` | Apostrophe and accents. Tests escaping, initials, search |
| `María José de la Cruz y Fernández` | Lowercase particles. Initials `Md` or `MF`, and "last name" sorting |
| `dana` | All lowercase. Initials still need to be uppercase |
| `🦊 Fox` | Emoji first. `.charAt(0)` returns half a surrogate pair (U+FFFD) |
| `👩🏽‍💻 Priya` | ZWJ emoji sequence. `.length` is 7 or more, and slicing splits it |
| `  Sam   Lee ` | Leading, trailing, and repeated spaces. Initials from empty words, odd gaps |
| no name, only an email | The UI needs a fallback |

## Emails, URLs, identifiers

These strings have no spaces, so the browser has nowhere to wrap them.

| Value | Breaks |
| --- | --- |
| `bartholomew.fitzgerald@northwind-industries-holdings.example.com` | Pushes every sibling off the row without `overflow-wrap: anywhere` |
| `a@b.co` | Shortest realistic email. A layout sized for long emails looks empty |
| `first.last+billing-notifications@example.com` | Plus addressing. Validation that rejects `+`, truncation that hides the meaningful part |
| `ops@sub.department.region.example.co.uk` | Many subdomains and a two-part TLD. Breaks domain extraction |
| `https://example.com/workspaces/acme/projects/q3-launch/docs/9f8e7d6c5b4a?tab=comments&filter=unresolved` | Long URL. Overflows, and end truncation hides the part that differs |
| `9f8e7d6c-5b4a-4c3d-8e2f-1a0b9c8d7e6f` | UUID. Monospace width, a candidate for middle truncation |
| `Q3 Board Deck - FINAL (revised) v12 [approved by legal].pdf` | File name. End truncation hides the version and extension. Brackets and dashes in paths |
| `IMG_20250914_183022_HDR_portrait_edited_edited.HEIC` | Camera file name. Unbreakable, uppercase extension |
| `@a` and `@thisisaverylongusernamethatisallowed` | Both handle extremes |

## Labels, titles, and copy from data

| Value | Breaks |
| --- | --- |
| `Senior Product Design Engineer, Platform Infrastructure` | Long job title. Wraps to three lines in a secondary slot |
| `Invitation expired 12 days ago` | Long status badge. Wraps, or squeezes the name column |
| `Benachrichtigungseinstellungen` | German compound, 30 characters, no spaces. Unbreakable label overflow |
| `Paramètres de confidentialité et de sécurité` | French for "Privacy & security". Translated copy runs about 30% longer |
| Twelve tags on one item (`design`, `frontend`, `q3`, `urgent`, `needs-review`, and more) | Tag rows wrap into a wall. Needs a `+8` overflow |
| A tag named `customer-feedback-from-enterprise-onboarding` | One tag wider than its container |
| `Untitled`, an empty string, or only spaces | Missing title. Collapsed heading, zero-height row |
| `<script>alert(1)</script>`, `&amp;`, `**bold**` | Escaping. Each must render as literal text |
| Two lines joined by a newline | A newline in a single-line field doubles the row height or vanishes |
| A pasted 2,000-character description | Clamps, "show more", and textarea growth |

## Numbers and money

| Value | Breaks |
| --- | --- |
| `0` | Zero states: "0 members", an empty progress bar, division by zero in percentages |
| `1` | Plurals: "1 members", "1 days ago" |
| `1284` | Needs a thousands separator: `1,284` |
| `1000000` | Count badge width. Use the compact form `1M` where precision does not matter |
| `12345678.9` as currency | `$12,345,678.90` overflows totals columns |
| `-42.5` | Negative sign, red colour logic, accounting parentheses |
| `0.1 + 0.2` | `0.30000000000000004` rendered raw |
| `142%` and `-3%` | Progress bars and meters past their bounds |
| `null`, `undefined`, `NaN` | Rendered literally |
| `1.284` in `de-DE` against `1,284` in `en-US` | Hardcoded separators are wrong for half the world |
| A live value going from `99` to `100` | Width jump and jitter without `tabular-nums` |

## Collections

| Value | Breaks |
| --- | --- |
| 0 items | The empty state, and whether one exists |
| 1 item | Grids that look broken with one card, "1 of 1" |
| Exactly the page size, and page size plus 1 | Off-by-one in "Showing 40 of 40", an empty page 2 |
| 1,000+ items, unpaginated | Scroll performance, render time, memory, and "Showing 40 of 1,284" copy |
| One item 10 times the size of the others | Masonry and grid rows stretch to the tallest item |
| Items with identical names | Lists where the name is the only distinguishing field |

## Time

Format with `Intl.RelativeTimeFormat` and `Intl.DateTimeFormat`, not hand-built strings.

| Value | Breaks |
| --- | --- |
| Now | "0 seconds ago" in place of "just now" |
| 12 days, 11 months, 3 years ago | Relative-time thresholds. Switch to an absolute date after about a week |
| A future date | "in 3 days" against "-3 days ago" |
| `1970-01-01` | A zero timestamp shown as a real date |
| `2025-12-31T23:30:00-08:00` | A different day in UTC and in the user's timezone |
| `1,284 hours` | Duration formatting that never rolls up to days |

## Images and media

| Value | Breaks |
| --- | --- |
| Avatar URL that returns 404 | Broken-image icon in place of the initials fallback |
| No avatar | The fallback itself: initials, colour, size parity with real avatars |
| 4000x200 panorama as avatar or cover | Distortion without `object-fit: cover` |
| 200x4000 tall image | Same on the other axis, and it can blow out a card's height |
| Transparent PNG logo, or a dark logo in dark mode | Invisible against the background |
| Slow-loading image | Layout shift without fixed dimensions or `aspect-ratio` |

## States

| Value | Breaks |
| --- | --- |
| Loading | Skeletons that do not match the final layout, spinners that shift content |
| API error | No error state, or a raw message such as `TypeError: Cannot read properties of undefined` |
| Partial data | Some optional fields filled and others not in one list. Rows misalign |
| Every status at once | All enum values in one list (`active`, `invited`, `expired`, `suspended`). Badge widths vary |
| No permission | Disabled actions. Check that the row lays out the same |
| The current user in the list | "You" labels, and actions that should not apply to yourself |

## Environment

These are conditions, not data. Switch to the worst case first, then change each one.

| Condition | Breaks |
| --- | --- |
| Container at 320px | Every overflow above at once |
| Narrow sidebar placement | A full-width component reused in a 280px column |
| 2560px wide | Lines too long to read, content stranded on one side |
| Browser zoom 200% or a large text setting | Fixed heights clip growing text |
| Dark mode | Hardcoded colours, invisible borders and logos |
| `dir="rtl"` | Icons, chevrons, padding, and the order of trailing actions |
| Touch device | Hover-only actions, such as a row menu that appears on hover, cannot be reached |

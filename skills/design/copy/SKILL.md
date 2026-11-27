---
name: copy
description: Writes and reviews the words inside an interface, such as button labels, menu items, headings, setting names, descriptions and status text. Labels take Title Case, use the fewest plain words, show display names not ids, keep descriptions to one line, and use no em dashes or ellipses. Use when writing or reviewing UI copy, microcopy, labels or status messages.
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Copy

These rules cover the words inside an interface: labels, descriptions, status text and their punctuation. For long-form text, use `prose`. Interface that is extra beyond the words belongs to `restraint`.

Casing and punctuation are exact, so a label in sentence case or an em dash is always a finding. Length is a judgement. A label that could lose a word is a finding only when the shorter label still says what happens.

Each rule ends with its rule id. Cite that id in a finding.

## Rules

- Buttons, menu items, tabs, headings and setting names take Title Case. Short articles, conjunctions and prepositions stay lowercase unless they come first (`copy-title-case`).
- Use as few words as still say what happens. The screen already gives context, so do not repeat it (`copy-fewest-words`).
- Show a number alone when the context already names the noun (`copy-number-not-noun`).
- Use plain words. Do not show an internal acronym or an invented persona (`copy-plain-words`).
- Show the display name of a thing, not its id (`copy-display-names`).
- A setting has one line of description or none. Move more detail into a tooltip (`copy-one-line-description`).
- Status text matches the moment: present while the work runs, past when it ends (`copy-state-tense`).
- Use a comma or a full stop where an em dash would go, or drop the break (`copy-no-em-dash`).
- Use no ellipsis, except in a search placeholder (`copy-no-ellipsis`).

## Checks

Each row pairs a rule id with a broken line, the line that replaces it and the severity of a finding.

| Rule | Broken | Replacement | Severity |
| --- | --- | --- | --- |
| `copy-title-case` | `Add to library` | `Add to Library` | `MEDIUM` |
| `copy-fewest-words` | `Start Download` on the download screen | `Start` | `LOW` |
| `copy-number-not-noun` | `12 items` in an item list | `12` | `LOW` |
| `copy-plain-words` | `PDP` | `Product Page` | `HIGH` |
| `copy-display-names` | `instagram_graph` in a select | `Instagram` | `HIGH` |
| `copy-one-line-description` | Two lines under a setting | One line, with the rest in a tooltip | `MEDIUM` |
| `copy-state-tense` | `Searched` while the search runs | `Searching`, then `Searched` | `HIGH` |
| `copy-no-em-dash` | `Synced &mdash; 2 minutes ago` | `Synced 2 minutes ago` | `MEDIUM` |
| `copy-no-ellipsis` | `Loading...` | `Loading` | `MEDIUM` |

## Reporting

Write one finding per root cause:

```
file:line - [rule-id] what is wrong
```

Then add a `Rule | Count | Severity` summary. The verdict is `Block` while any `HIGH` finding remains, and `Approve` otherwise.

Approve only files you read. Mark each check you could not run as `Not verified`.

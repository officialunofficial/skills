---
name: gather
description: "Collects design references from the user's own saves, their boards, pattern libraries and curated galleries onto one linked board before a design is built or reworked. Use when the user asks for inspiration, references, inspo or a moodboard, asks how other products handle a screen, or says a screen looks bad and asks how to improve it."
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Gather

Collect inspiration before a design is built or reworked. Search every source at once, fill one board as results land, and link every reference to its origin with a note that names the part to take.

## Evidence for a choice

A reference shows how one part could work. It is evidence for a decision, not a style to copy. Taking an app's whole look when the user asked about its top bar is the main failure.

With no number given, gather at least 20 references from at least three sources.

The engineering skill `prototype` builds variants from the board. `match` rebuilds one reference value for value.

## Steps

### 1. Name the brief

Write one line that names the surface, its platform and what to look for: layout, navigation, density, type, colour, motion or overall taste.

Split the brief into parts such as "top bar", "empty state" and "row density". Give each part two or three synonyms. Build queries of two or three words from the parts, because one long query can return nothing while its short parts match.

Search on the platform of the work. A desktop or web app takes web and desktop references.

### 2. Start with what the user gave

Open the tabs, screenshots, links and design files already in the thread before you search anywhere. They seed the image searches in step 4.

### 3. Offer to connect what is missing

Check which of Pond, marked.dev, Are.na, Cosmos, Pinterest and Mobbin are connected. Ask once, with each missing source as its own option and "carry on" as another. When none are connected, wait for the answer. [sources.md](sources.md) says how to connect and query each source.

### 4. Search every source at once

Start one agent per connected source, or run the searches as parallel calls where agents are unavailable. Each writes `candidates/[source].json` in the shape that [sources.md](sources.md) shows under "Candidates".

- **Own saves first.** Results from Pond and marked.dev lead each group, because they show the user's own taste.
- **Go wide.** Pull from at least three sources. Pattern libraries show flows and screens, curated galleries show finished work, and boards show taste.
- **Search by image.** Seed image searches from what the user gave and from their closest saves, through Pond `visual` and Cosmos.
- **Capture live.** When the best reference is a shipped product, open its live page and screenshot the part instead of using a gallery thumbnail.
- **Pull twice the number asked, then cut.** When the user asks for more, leave out every url already on the board.
- **Stop at a usage warning.** When Mobbin answers that monthly usage is high, stop calling it, tell the user and carry on with the other sources. Search it again only when the user asks for it by name.

### 5. Collect into one board

Run the collector as soon as the first candidates land, and open the board straight away. It copies the board page, downloads every image and video, and fills the board live as agents finish.

```sh
node [skill]/collect.mjs .gather/[brief] --serve
```

Keep `.gather/` out of version control. Write the title, brief and group order to `.gather/[brief]/board.json`, as [sources.md](sources.md) shows under "Board".

The collector and the board are part of the skill, so a run writes data only. Do not write a board page or a per-run download script.

### 6. Look at every reference

Open each downloaded file and look at the part the brief names. A title, metadata or a preview is not enough to keep a reference.

- Cut only clear misses, by adding their url to `cut` in `board.json`. When two references sit close, keep both, because the choice belongs to the user.
- Give each reference one note that names the part to take, such as "the top bar".
- Keep the source link on every reference.
- Mark each reference `Shipped` or `Concept` under `Kind` in its `details`. A concept shot presented as a shipped product misleads the user.
- Name each group in two or three words of Title Case, such as "Agent Activity". Put the detail in the group description.

When the cut is done, run the collector once more with `--done` so the board stops reloading.

### 7. Act on what comes back

The board copies three prompts for the user to paste:

- **Copy Picks** returns the picks with the user's notes. They become the brief for the next step.
- **More Like This** returns one reference. Seed an image search from that reference, keep to its group, and leave out every url on the board. A text search on its title misses the point.
- **Save Picks** returns the picks to save.

### 8. Save what the user keeps

Send picks where the user says: their library, a channel or a board. Read the naming of the destination first and match it. Check for each item before you add it. When a source needs a login or a CAPTCHA, stop and say which one.

## Checks

| Rule | Broken | Replacement |
| --- | --- | --- |
| `gather-name-the-brief` | "Searching settings pages" | "Desktop settings page, looking for grouping and density" |
| `gather-split-the-brief` | `"desktop settings page with grouped dense options"` | `"settings groups"`, `"preferences list"`, `"dense settings"` |
| `gather-same-platform` | iOS screens for a desktop app | `platform: "web"` and desktop apps |
| `gather-start-with-given` | A pattern-library search while the user's tabs sit open | The open tabs read first |
| `gather-offer-to-connect` | Pond searched alone while marked.dev and Mobbin sit unconnected | "Connect marked.dev or Mobbin, or carry on with Pond?" |
| `gather-parallel-sources` | Pond, then Mobbin, then Cosmos | One agent per source, started together |
| `gather-stop-at-usage-limit` | Mobbin searched again after its usage warning | "Mobbin says monthly usage is high, so I stopped searching it" |
| `gather-own-library-first` | A board of Mobbin screens while Pond holds matches | The user's saves first in each group |
| `gather-go-wide` | Twenty screens from one app | Saves, boards and a pattern library |
| `gather-search-by-image` | Text queries while the user's screenshot sits in the thread | `search_library` with `visual` seeded from it |
| `gather-capture-live` | A gallery thumbnail of linear.app | A screenshot of the live top bar, linked to linear.app |
| `gather-enough-to-choose` | "50 more" returns the first 20 again | 50 new references, earlier urls left out |
| `gather-one-board` | Twenty links pasted in chat | `.gather/settings/` served and opened, grouped by idea |
| `gather-shipped-collector` | A `build.mjs` written for this run | `node collect.mjs .gather/settings --serve` |
| `gather-look-at-every-image` | A screen kept on its title | The downloaded file opened and the top bar looked at |
| `gather-cut-clear-misses` | Two close references, one cut by the agent | Both on the board for the user |
| `gather-name-the-part` | A screenshot with no note | "Take the grouped list, not the colours" |
| `gather-link-every-reference` | An image with no source | The image linked to its original |
| `gather-concept-or-shipped` | A Dribbble concept shown as a product | `details: { Kind: "Concept" }` |
| `gather-short-group-names` | "Activity: thinking, tool calls and steps" | "Agent Activity" |
| `gather-more-from-the-pick` | More Like This searched as "Linear settings" | An image search seeded from the picked screen |
| `gather-match-the-naming` | A new channel named "FW 26" beside `fashion / inspiration / 2026 / fall winter` | A channel that follows the existing pattern |
| `gather-no-duplicates` | The same pin added twice | Existing items checked and skipped |
| `gather-ask-at-login` | A login worked around | "Pinterest needs you to sign in" |

## Reporting

When the skill runs as a review, write one finding per root cause. Cite the request when no file applies:

```
file:line - [rule-id] what is wrong
request 2 - [rule-id] what is wrong
```

Severity:

- `HIGH`: a whole look copied when one part was asked for, or items saved twice or under the wrong name.
- `MEDIUM`: the wrong platform, one source only, sources searched in turn, a board with no links, a hand-written board or build script, a skipped connect question, the user's own saves skipped, a reference kept unseen, a close call settled by the agent, a concept shown as shipped, or a Mobbin call after its usage warning.
- `LOW`: one long query, a text search where an image search fits, a gallery thumbnail of a live site, a reference with no note, a long group name, repeats under "more", or More Like This searched by title.

Close with a `Rule | Count | Severity` summary and a verdict: `Block` while any `HIGH` remains, `Approve` otherwise. Mark every source you could not reach as `Not verified`.

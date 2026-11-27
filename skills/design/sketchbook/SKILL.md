---
name: sketchbook
description: "Generates a batch of small interaction experiments in the project's own stack as live tiles to keep or kill, and learns the user's taste from each choice."
disable-model-invocation: true
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Sketchbook

Generate a fresh batch of small interaction experiments in the project's own stack. The user keeps or kills each live tile, and each choice steers the next batch.

## The numbers

- One run is one new batch of 6 to 9 live experiments.
- 1 or 2 of them are wildcards: they sit outside the current taste, so the batches do not settle on one style.
- The gallery is one temporary route, `/sketchbook`.
- Taste lives in `sketchbook/taste.md` at the project root. Kept components live in `sketchbook/kept/`.

`motion` owns easing, durations, springs and reduced motion. `copy` owns tile names and notes. `defaults` owns surfaces and `color` owns contrast. `reuse` owns reaching for an existing component first. `gather` collects outside references, the engineering skill `prototype` makes variants of one idea, and `lab` forces every state of a component open.

## Steps

1. **Read the project.** Find the framework, the styling, the animation library, the tokens and the fonts before writing anything. Every experiment uses exactly these, because a tile in a second stack cannot be kept.
2. **Read the taste file.** Read `sketchbook/taste.md`. If it is missing, taste is empty and the first choice creates the file. Skip every interaction already listed under Kept or Killed.
3. **Generate the batch.** Write 6 to 9 small interactions. Each is one of: hover, toggle, press, reveal, drag, scroll, cursor, text, loader or transition. Build each one for real in the project's stack, never as an image or a mock-up. Lean the batch toward the summary, and make 1 or 2 tiles wildcards. With an empty summary, the wildcards differ in kind from the rest.
4. **Show one gallery.** Put this batch alone on `/sketchbook` as a grid of live, playable tiles. Each tile has a Title Case name, a one-line note, and Keep and Kill controls.
5. **Open it.** Start the dev server, open `/sketchbook` and play every tile once.
6. **Save each choice** in the same turn the user makes it. See below.
7. **Suggest a clip.** Name the kept tiles worth recording, with one line on why. If nothing was kept, say so.

## Saving a choice

**Keep.** Move the experiment to `sketchbook/kept/` as a clean, reusable component with the gallery chrome removed. Add its name under Kept.

**Kill.** Delete the experiment's code. Add its name and the reason under Killed. Nothing else of it stays.

**Either way.** Rewrite the summary so the next batch leans further toward the kept tiles. The summary covers easing, speed, density, playfulness and colour use.

**Last choice.** When every tile has a choice, delete the `/sketchbook` route. The kept components stay in `sketchbook/kept/`.

The taste file has exactly three headings:

```md
## Kept
- Soft Press

## Killed
- Cursor Trail: distracting on dense screens

## Summary
Easing: soft springs with a small overshoot. Speed: under 200ms. Density: one moving part per tile.
Playfulness: low. Colour: neutral surfaces, accent on press only.
```

## Checks

| Rule | Broken | Replacement |
| --- | --- | --- |
| `sketchbook-read-the-stack` | A batch written before the project is read | Framework, styling, animation library, tokens and fonts read first |
| `sketchbook-read-taste` | A second batch with `sketchbook/taste.md` unread | The summary read and the batch steered by it |
| `sketchbook-never-repeat` | "Press Scale" again after it was killed | A new interaction, the old name still in the file |
| `sketchbook-batch-size` | 4 tiles | 6 to 9 tiles |
| `sketchbook-real-stack` | A PNG that stands in for a hover | The hover built in the project's stack |
| `sketchbook-wildcards` | 9 tiles, all inside the current taste | 7 inside the taste and 2 outside it |
| `sketchbook-one-gallery` | 8 routes, one per experiment | One `/sketchbook` grid of live tiles |
| `sketchbook-keep-or-kill` | A tile with no controls | `Soft Press`, one note, Keep and Kill |
| `sketchbook-open-it` | "Built at `/sketchbook`" | The gallery opened, every tile played |
| `sketchbook-save-the-taste` | "You kept Soft Press" in the reply only | Soft Press under Kept, the summary rewritten |
| `sketchbook-keep-the-component` | Soft Press left inline on the gallery route | `sketchbook/kept/SoftPress`, gallery chrome removed |
| `sketchbook-delete-the-killed` | Cursor Trail commented out in the gallery | The code deleted, the name and reason in the taste file |
| `sketchbook-remove-the-gallery` | `/sketchbook` still routed after every choice | The route deleted, kept components still in `sketchbook/kept/` |
| `sketchbook-suggest-a-clip` | The batch ends with no next step | "Record Soft Press. The settle is worth a clip." |

## Reporting

When the skill runs as a review, write one finding per root cause:

```
file:line - [rule-id] what is wrong
```

Severity:

- `HIGH`: a mock-up batch, a kept component deleted, or a gallery reachable in production.
- `MEDIUM`: a count outside 6 to 9, a missing wildcard, an unread taste file, a repeated experiment, a choice saved only in the reply, a kept tile left on the route, killed code left behind, or a gallery left after the last choice.
- `LOW`: a gallery nobody opened, or a review with no clip suggestion.

Close with a `Rule | Count | Severity` summary and a verdict: `Block` while any `HIGH` remains, `Approve` otherwise. Mark every tile you could not play as `Not verified`.

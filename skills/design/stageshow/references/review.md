# Review

The brief for a fresh-eye review after rehearsal.

## What the reviewer gets

Give the reviewer this file, `verify.md`, the `examples/` folder, the URL of the scene and the frames the builder filmed. Add a one-line brief that names the gold example, with the still of the gold beside the still of the scene.

Give nothing else. The builder's plan, reasons and `REHEARSAL.md` would anchor the reviewer on the builder's view.

## The reviewer's brief

You review a faux product UI scene that someone else built. You judge the picture, so you do not need the intent behind it.

Ask two questions before the checklist:

1. Does this composition answer this product and this page, or could it be any product in its category? A layout that the brief did not shape is a finding, ranked with framing, even when every check passes. Examples: a window pinned with even margins whatever the product, or the phone framing that every phone brief gets.
2. Does the scene give its focal content as much of the frame as the gold does? Judge from the two stills.

Start from the words of the brief. If it says "white page", a tinted plate behind the device is the first item on your list. If it names a size, a look or a page colour, hold the scene to that first.

Then look at the frames as the most exacting designer you know would, the one who screenshots the single wrong thing and sends it back with "what is this?". Answer every item in `verify.md` from a frame, not from the code. If a frame you need does not exist (a beat at 40ms, a 4x zoom of a glyph, the phone width, `--states`), film it with `scripts/film.mjs` before you answer. A predicted failure is not a finding, and a predicted pass is not a pass.

Put the scene beside its closest gold example and state the one difference.

## What to return

Return a ranked list: framing first, then hierarchy and density, then motion, then polish. Each item says what you would screenshot, which frame shows it, and the fix in one line. Say what you could not check. If you find nothing, say "nothing" and list the frames you looked at.

## Rules of the review

- The bar for a finding is a frame. Quote the frame file.
- Rank by how much of the scene the fault spoils, not by how easy the fix is.
- A line the builder judged intentional is not settled. Look at the frame and judge it again.
- Fix nothing. Do not soften a finding because the build is nearly there.
- These are findings even when no film line names them: a whole window that floats with even margins, rows with more air between them than their height, a pane whose content stops well above its bottom, gray bars where the eye lands, a phone drawn small.
- Platform conventions are not placeholders. A Messages thread in blue with the plus and mic in its composer, a macOS window with its lights, an iOS banner at true size: these are the chrome of the product and they stay. Send back an invented accent or a redrawn system control. Never send back the convention.

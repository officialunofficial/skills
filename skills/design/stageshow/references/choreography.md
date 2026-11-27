# Choreography

How to time one change that passes through several parts of an interface.

Start with a readable still and a short account of the change. Name the frame that holds still, the state that starts things, the responses that depend on it, the destination and the hold. Pick timing only after those relationships are clear. A quiet frame gives the moving parts something to move against. When every layer moves at once, that reference is gone.

## A change that passes through an interface

- Keep the header, the outer surface and the action positions steady while the variable content changes inside them.
- Let a setting lead the amount, payment method and form that depend on it.
- Start each dependent movement before the previous one finishes, with offsets that make the order legible.
- Keep old and new content in tracks. Do not replace the whole screen.
- Use a fixed, local soft mask where a track enters and leaves. Settled text sits wholly inside the opaque part, and the border of the control stays outside the mask.
- Do not soften the whole interface, blur every transition, or use a mask to hide bad resting geometry.
- A row that changes height needs a different treatment: fade its content while its space opens or closes, so the moving edge never slices readable ink.

`examples/choreography/` shows a checkout that changes market with no cursor. The frame and product stay put while currency, price, method and address respond. The comparison beside it uses the same layout and movement with every start at once, so timing is the only variable. It is one possible sequence, not a required style or a timing preset.

## Timing by job

| Job | Decision |
| --- | --- |
| Direct feedback | Start on the input. A presentation delay feels unresponsive. |
| Travel between stable positions | A departure, a stretch of clear travel and a soft arrival. Length alone does not make it fluid. |
| Related data updates | Recognition, transfer and the accumulated result may each take a different time. The result still follows its cause. |
| Introducing a composition | A small front-loaded movement may settle for longer than its busy part. Do not scale readable text much. |
| Replacing content | Keep the container, alignment and reading interval. Mask only the moving slot. |
| Holding a result | Stop. A useful still needs no new pulse and no repeated count. |

## Curves

Choose duration and easing together, by job. One duration or easing applied everywhere flattens the hierarchy.

- A retained content track reads well with a slow departure, concentrated travel and a soft arrival.
- A direct press needs quicker feedback.
- A number that accumulates after a transfer may take longer than the transfer.
- A small expressive icon may overshoot while its card and text settle without bounce. Keep that accent local.
- Give the final state time to read.
- In a code demo, use real syntax-highlighted code with sans-serif labels and copy. Monospace belongs to the code, not to the whole scene.

## Review the full change

Watch at normal speed. Then step through the onset, the overlap, the masks, the final cleanup and the hold.

- Check text pixels as well as geometry. A stable rectangle can hide glyph shimmer.
- Check the narrow host, reduced motion, pause, step, replay and the return from offscreen.
- A new scene that starts paused must finish its first measurements without advancing the story.
- If pacing looks uneven, compare independent rAF samples with elapsed time. A smooth export on the virtual clock says nothing about live playback.

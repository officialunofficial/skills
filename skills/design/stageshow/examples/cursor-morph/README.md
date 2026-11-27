# Cursor morph

The cursor changes its own style in sequence: real, large, circle, arrow, then real again. The fifth style, `touch`, is for phones.

How it works:

- The example resamples each silhouette to 72 perimeter points.
- One damped spring morphs between them: damping ratio 0.62, angular frequency 15.
- Geometry may overshoot. Colour and stroke width are clamped.
- A retarget starts from the current outline. An unmount cancels the pending frame.
- The portal rides the kit cursor for position and press feedback. State lives in the Stage, so the shape keeps no second copy of the selected style.
- Reduced motion settles directly.
- The compact layout uses a 318px control in a 358px stage, which preserves 14px labels.

Use this pattern when a cursor changes identity. For ordinary pointer, hand and I-beam changes, use the cursor kinds of the kit.

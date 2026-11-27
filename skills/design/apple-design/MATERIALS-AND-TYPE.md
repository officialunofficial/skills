# Materials, depth and type

## Materials and depth

Apple uses translucent materials as a functional layer that floats above content. The layer gives structure and does not take focus. On the web, use `backdrop-filter`.

- **Build chrome as a translucent layer.** Navigation bars, toolbars and sheets use `backdrop-filter: blur()` with a semi-transparent background, and content scrolls under them. An opaque bar spends a fixed strip of the screen.
- **Material weight shows hierarchy.** Darker, heavier materials separate structural regions such as a sidebar. Lighter materials draw attention to interactive elements. Do not put one light translucent surface on another, because the text stops being legible.
- **A larger surface reads as thicker.** Give it more blur and a deeper shadow than a small chip. Make the shadow heavier over busy content and lighter over a plain background.
- **Dim for a modal task.** Pair the surface with a scrim and push the background back or down. For stacked sheets, dim and push back each parent in turn.
- **Do not dim a parallel panel.** A panel that does not block uses translucency and offset, with no scrim, so the flow continues.
- **Keep text legible over a moving background.** On a blurred surface, use higher contrast, a slightly heavier weight and a small increase in letter spacing, not flat gray. Put color on a solid layer, not on the translucent foreground.
- **Use a scroll edge effect, not a divider.** Replace the 1px border under a sticky header with a small blur or gradient mask, only where floating chrome overlaps content.
- **Materialize, do not only fade.** On enter and exit, animate the blur radius and the scale together. The surface then reads as a material that arrives.

```css
.toolbar {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.4); /* a bright top edge reads as light on the material */
}
```

When the user sets `prefers-reduced-transparency: reduce`, make these surfaces solid. See Reduced motion in SKILL.md.

## Type

Apple designs type to change shape with size (The Details of UI Typography, WWDC 2020). The same rules apply on the web.

- **Tracking depends on size.** Large display text needs negative letter spacing, because letters look too far apart as they grow. Small text needs slightly positive spacing. Tighten headings and leave body text near `0`. One fixed value is wrong at some size.
- **Leading moves against size.** Use tight line height on large headings and looser line height on body text. Increase it for scripts with tall ascenders and descenders. Tighten it for dense UI.
- **Build hierarchy from weight, size and leading together.** For emphasis, use weight. It adds presence and takes no more space.
- **Respect the text size setting of the user.** Set spacing in `rem` or `em`, so the layout scales with the text.
- **Default to the system font.** It ships optical sizing, tracking tables and legibility tuning. Use a custom face only for a reason you can state.

```css
:root { font: 100%/1.5 system-ui, sans-serif; }

.display {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-optical-sizing: auto;
}
```

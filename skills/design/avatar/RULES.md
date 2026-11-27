# Avatar rules and reporting

## Contents

- Rules: each rule id with a broken case and its replacement
- Severity
- Finding format

## Rules

| Rule | Broken | Replacement |
| --- | --- | --- |
| `avatar-measure-the-reference` | Eyes placed from one look at the reference | Size, tilt, spacing, and blinks measured off frames at 10fps |
| `avatar-keep-the-measurements` | `split: 15`, rounded to look tidy | `split: 15.5`, as measured |
| `avatar-flat-silhouette` | A cup with an outline, shading, and a smile | One solid shape and two eyes |
| `avatar-iconic-view` | A watering can from the front, which reads as a box | The side view, where the spout and handle name it |
| `avatar-face-part-leads` | A slab stuck on the mug to hold the eyes, or eyes at half size | The cup widened until the head and its margin fit |
| `avatar-size-by-outline` | A thin handle loop as tall as the cup | A compact handle, clearly smaller than the cup |
| `avatar-clean-joins` | A lid edge 0.3 units past the cup, leaving a sliver | A step of half an eye width, or edges matched exactly |
| `avatar-holes-are-openings` | A cut-out slot for a coin or a button | Holes only where the object is open, such as the handle |
| `avatar-toy-proportions` | A hairline stem, a sharp leaf tip, a leaf flattened into an oval | Parts at least an eye wide, rounded corners, soft tips, curves kept |
| `avatar-colour-variables` | `fill="#c27a3e"` in the path | `fill="var(--avatar-body)"`, set per theme |
| `avatar-eyes-on-a-sphere` | `translate(dx, dy)` on both eyes | `drawEyes(face, gaze, lid, head)` from yaw, pitch, and roll |
| `avatar-clip-to-the-body` | An eye hanging past the outline on a wide glance | Eyes inside a `clipPath` of the body path |
| `avatar-never-still` | Eyes parked at rest between blinks | Layered drift and a glance every 1.5 to 4s |
| `avatar-irregular-blinks` | `animation: blink 5s infinite` | 180ms blinks 1.9 to 4.6s apart, 18% doubles |
| `avatar-whole-body` | Only the eyes move | The body breathes, floats, and leans 220ms behind the gaze |
| `avatar-moods-as-numbers` | `{happy ? <HappyFace /> : <Face />}` | `happy: { eyes: pair(0.522, 0.217, 18) }`, blended over 90ms |
| `avatar-object-move` | A cup that moves like any blob | The lid lifting a beat behind the hop |
| `avatar-react-to-the-page` | One idle loop whatever the pointer does | Spin on enter, follow, widen on hover, hop on press, sleep when left |
| `avatar-pause-offscreen` | A loop running below the fold | The loop started and stopped by an `IntersectionObserver` |
| `avatar-render-the-rest` | Eyes appearing after hydration | `restingEyes(head)` in the server HTML |
| `avatar-still-when-reduced` | Glancing and hopping under reduced motion | The resting pose and no loop |
| `avatar-contact-sheet` | One screenshot of the idle pose | A `sheet.js` sheet through every mood, then shipped size in both themes |

## Severity

| Severity | Findings |
| --- | --- |
| `HIGH` | A body that never moves, eyes escaping the silhouette, motion under reduced motion |
| `MEDIUM` | Flat sliding eyes, a fixed blink, swapped mood drawings, an offscreen loop, a missing reaction, proof from one screenshot, a view that does not name the object, a cramped face, an oversized secondary part |
| `LOW` | A rounded measurement, a fill in the path, a rest pose that pops in, no move of its own, a sliver at a join, a decorative hole, a hairline part |

## Finding format

One finding per root cause:

```
file:line - [rule-id] what is wrong
```

Follow with a `Rule | Count | Severity` summary. The verdict is `Block` while any `HIGH` remains and `Approve` otherwise. Mark a reference you could not open or step through as `Not verified`.

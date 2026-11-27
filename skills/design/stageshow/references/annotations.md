# Annotations, guides and connecting lines

Contents:

- When to add a line
- Kinds of line
- Nodes, badges and colour
- Attach to what is drawn
- Cause first, then hold
- Frame the whole relationship
- Check attachment in motion

An annotation explains one relationship: what a chart point means, how big a selection is, where an event went, which object a note belongs to. The product stays visible.

## When to add a line

A line earns its place when it removes ambiguity. If the layout already makes the relationship obvious, leave the line out. More connections do not make a fuller explanation.

Design the product before its annotations. A line that attaches perfectly cannot rescue faint text or weak hierarchy. Save the stronger colour for the relationship the line explains.

Give related surfaces different jobs and weights. Overlap can tie a composition together, but it never covers record text or forces a line through useful content. At narrow widths, stack the relationship instead of shrinking its type.

`examples/annotations/` holds eight studies. Its picker mounts one at a time:

| Study | Query value | What it shows |
|---|---|---|
| Usage into an invoice | `collect` | Three measured sources join at one junction, then deliver |
| A payout and its detail | `detail` | A dotted record link and a separate solid leader |
| A chart point | `chart` | A point and its label, both measured with `rect()` |
| Selection and dimensions | `measure` | Card, ring and guides share one changing box |
| A request and its reply | `flow` | A solid outbound arrow and a dashed return |
| Following a layer | `follow` | `Follow` owns the object and its note together |
| A shared processing graph | `branch` | One trunk, one spine, each branch from its own junction |
| An ongoing event stream | `stream` | A static route under moving dots |

## Kinds of line

- **A leader explains one visible object or value.** It joins one selected point to one short note, usually with no arrow and no continuing motion. Remove it with the selection.
- **A leader is a fine line with two clear ends.** It is 1px (1.5px at hero scale) in a quiet ink. It leaves the edge of the note and lands 4 to 6px short of the object, ending in a 4px dot or at the object edge with a gap. It runs straight or with one bend. It never passes behind or through another surface.
- **A record link joins two views of one thing.** One row opens its settlement, and a fine dotted link makes that explicit. A quieter solid leader has a different job and a different weight.
- **A collection joins several inputs to one result.** One colour runs through the incoming paths, their junction and the shared output, because they are one relationship. Draw each incoming route once. Start the delivery only after every input has arrived. Never add a junction to fill space.
- **Direction shows transfer.** A request and its response start from different ends, so the return arrow starts at the recipient. Reveal the route before you confirm arrival, and change the status after the transfer.
- **A moving phase shows ongoing work.** Dots move only while data flows: fine, slow enough to follow, on a fixed route. Never animate a finished one-off request. Stop the dots when the connection closes, pause them offscreen, and keep a static directional poster under reduced motion.

Keep four things separate: the geometry of the route, the stroke pattern, the reveal along the route, and any continuing phase. A reveal mask lets a dotted line draw progressively without stretching its dots.

## Nodes, badges and colour

- A small white pill with a fine rim and a tight shadow makes a job or service read as a node. A node is part of the system. Annotation text is the explanation attached to it. Do not turn every label and endpoint into the same pill.
- Centre the visible content of a pill as one group. A hidden status icon reserves no width and no gap. When the icon arrives, its slot and gap open while the label moves with them.
- A short inline badge can name the line itself: `POST`, `200 OK`, a step. It arrives with the completed line and keeps a small footprint.
- Use one colour per relationship, not a hue per input. A saturated colour can still be restrained.
- The default endpoint of the kit is a small coloured centre, a white rim and a subtle shadow. Size it to the stroke. Use it for a specific port or junction, not on every endpoint. A plain cap, a small arrow or no marker may be clearer.
- Line styles carry meaning: a solid request and a dashed acknowledgement. Draw a shared trunk once, or the overlapping paths darken and knot.

## Attach to what is drawn

`Connector` takes points in stage pixels. Derive them from named targets, never from positions guessed off a screenshot.

- Attach to the edge that faces the relationship, with room for the line and its label.
- Check the direction of the final segment, not only where it ends. A line that meets the bottom edge of a label approaches vertically. An endpoint on the right border is wrong when the segment before it runs along that border or underlines the label. `route="h"` travels across first, then rises.
- `rect()` refreshes after state commits and when a CSS transition finishes. It does not track CSS motion on every frame. For continuous movement, update the scene state each frame, or put the object and its annotation in one moving coordinate space.
- `Follow` suits a selection ring that retargets between objects, because it keeps its velocity. Make the leader, note and outline children of the same `Follow` wrapper as the object. A separate line aimed at the destination jumps ahead of the visible layer.
- For a drag, keep the grip offset and use the per-frame point of `a.drag` to size or move the object. Read the displayed dimension from that same geometry.

## Cause first, then hold

- Start the line when selection or delivery begins. `Connector` draws on and fades off intact, and its arrow and label arrive with the line.
- Endpoint markers wait for the visible route to reach them.
- A branching graph propagates outward from its incoming junction. Each branch starts when its junction is reached.
- A sender confirms delivery after the acknowledgement returns.
- Crossfade discrete statuses in stable `States` slots. A measured dimension tracks its box directly, in tabular numerals.
- Hold the result long enough to read, and clear it with an action on screen.

## Frame the whole relationship

Leave room for the guide, arrowhead and label outside the target, clear of the clip of the product frame. On a narrow host, stack the surfaces and move the labels with their lines at normal size. An annotation never covers the result it explains.

If a detail needs a camera, use `Camera` with a focus from `a.rect(name, { layout: true })`. Keep the annotation in the coordinate space of its target. Never feed an already transformed rect back into the focus.

## Check attachment in motion

```sh
node scripts/film.mjs '[url]/?capture=annotations&annotation=follow' --out shots/annotation-follow.png
node scripts/layout.mjs '[url]/?capture=annotations&annotation=measure' --select body
```

Watch the entry, the held result, the exit and the return. During a resize, compare the guide ends with the card edges on every sampled frame. During a follow, compare the end of the leader with the object edge, because a clean start and end can hide separation between them. Check the narrow width too. A contact sheet cannot prove continuous attachment, because the gaps between samples are unchecked.

---
name: stageshow
description: "Builds faux product UI that reads as a real product, as a still illustration or a short animated demo with a cursor: browser and app windows, dashboards, phones, notifications, terminals, bento grids and cursor walkthroughs, framed and cropped for a marketing page, feature card or docs hero. Use when the user asks for a fake or mocked UI, a product demo or walkthrough animation, a hero or feature-card illustration of an app, a polished product shot, or an animated cursor acting in an interface. React and plain CSS."
license: MIT
metadata:
  upstream-author: "Benji Taylor"
  upstream-source: "playful-design/router"
---

# Stageshow

Build miniature product UI: a believable interface, framed in its space, as one still or as a short animation in which one thing happens. The viewer recognises the screen and sees the thing happen.

These are authored illustrations, not browser automation. `a.click()` draws the cursor pressing, and `a.set()` changes the scene.

## The one idea

The scene reads as a real product, simplified to what the viewer needs, framed with intent, and every motion has a cause.

It fails in five ways:

| Failure | What it looks like |
|---|---|
| Too much | Real text in every row and numbers everywhere. More detail makes it look more generated. |
| Wireframe | Two gray blobs and a button. Built too small, or stripped of what made it recognisable. |
| Boxed | A whole window shrunk into a card with even margins: a pasted screenshot, not a product shot. |
| Flat | Every object at one weight in one bordered card. The eye has nowhere to land. |
| Bland | A gray window with a cursor, whatever the brief said. The look and energy of the brief are the point. |

The fix is a full, structured screen in quiet grays. Put real words only on what the story is about and placeholder lines on the rest. Leave room to breathe, and crop so the eye lands where the story is. Simplify the words, not the context. An empty corner, a void under a list, rows spread to fill a pane, or a window that floats on a plate (a backdrop or tinted field) reads as unfinished, not calm.

Two terms recur. The hero is the main object. A satellite is a smaller second object (a receipt, a phone, a detail card) that straddles the edge of the hero.

## The bar

Build it as a product designer builds a launch page they will be judged on. The gold examples in `examples/` are the bar. If yours is emptier, flatter or smaller than the closest gold, fix that first.

Then look at the frame as an exacting designer would, the one who screenshots the one wrong thing and sends it back: a dot off its avatar, a unit on its own line, copy that touches a card. If you can picture that screenshot, you have found the next fix.

## Setup

The skill folder is a self-contained package that needs Node 20.19 or later. Run `npm install` and `npm run dev` in it to serve the playground with every example. Filming needs `playwright-core` and a local Chrome (`CHROME_PATH` picks another).

In a host project, copy `kit/` and import from `kit/index.ts`. The kit needs React 18 or later, react-dom and lucide-react, and no animation runtime. Copy `scripts/` beside it for filming.

## Workflow

Most of the quality is decided before any code. Write the plan first: where the scene sits, the focal object, the action, the payoff and what to leave out.

### 1. Medium and place

Choose a still or an animation (loop, once in view, or hover). Name the page, its ground and its width. Design at the size it will be seen and show it at 1:1:

| Slot | Design size |
|---|---|
| Hero beside copy | about 720 x 340 |
| Full-width hero | 900 to 1100 wide |
| Card | 400 x 300 |
| Phone column (`compact`) | 358 wide |

A demo is never under about 320 wide. A bento tile or a satellite card may be smaller. Every demo that can sit in a phone column gets a `compact` design, which is a redesign and not a squeeze. Plan a grid of tiles as one set with [references/bento.md](references/bento.md).

### 2. Look

With the product's code or site at hand, map its tokens to the kit's ([references/looks.md](references/looks.md)). When the developer asks for their own components, use them inside the stage.

Otherwise pick a theme (light, dark, blueprint, glass), a palette (accent, mono) and a fidelity. `minimal` is all bars. `standard` puts words where they carry meaning. `realistic` puts real content everywhere. The default is light, accent, standard. Go realistic at hero scale, for a named real product, or for a still whose subject is a list or page.

A brief with a style (kawaii, paper, a poster colour) gets that style in full, still built to these rules.

### 3. The story

Pick its shape: how the product feels to use, a flow, or what the system does. Plan three to five beats and a payoff in 10 to 16 seconds. Every cursor move has a reason. Data never rewinds in view without a cause. Between a richer story and a calmer frame, choose the frame. The rules are in [references/motion.md](references/motion.md) under "Story".

### 4. Start from an example

1. Find the closest gold example in [references/examples.md](references/examples.md) and film it: `node scripts/film.mjs "[preview]/?capture=[gold]" --select '#example' --still --out gold.png`.
2. Copy its folder to `examples/[yours]/`. The playground picks it up and `?capture=[yours]` films it. Move it into the host when it passes, and fix its kit import path.
3. Keep its structure: stage size, crop and bleed, row and type sizes, spacing, the beats of the script, the kit parts.
4. Read [references/craft.md](references/craft.md) in full. It holds the still-frame rules that one gold example cannot show.
5. Replace the look and content with the product of the brief: its tokens, icons, chrome and words. A copy that changes only the name is not done.
6. Frame it with [references/framing.md](references/framing.md), judged in the final visible crop.
7. Film one still at both widths beside the gold. If yours is emptier, flatter or more boxed, fix the frame before any motion.

When no gold tells your story, choose in two parts. Take the layout from the table in `framing.md` and copy the example it names. Then borrow the motion from the example whose story is closest.

The short form of the framing rules:

- One gutter. Every edge distance is a full gutter or well past it.
- Only filler bleeds. Everything the story opens stays in frame.
- A window keeps the shape of its device.
- The page is the ground: no plate under a hero on a white or dark page, and no whole window with air on four sides.
- No dead corners.
- `unframed` only when the developer asks.

### 5. The screen

Count the real strings, usually 3 to 7. That is a budget for words, not for elements. Build with the kit's tokens and with `Bar`, `Text` and `Row`. Fit the text of every control before it moves. Mark what the cursor touches with `data-target` and `data-cursor`, and measure with `rect()` instead of hard-coded positions.

### 6. Choreograph

Use the `Act` API. Keep what appears mounted and toggle it, so exits animate. Animate the relationship, not only the object: a new row carries the rows below it, and a surface that resizes never stretches its text. Beats overlap, groups stagger, the payoff holds, and the loop ends where it began or resets with a visible cause.

### 7. Rehearse

1. Set `poster` first. Most people see only that frame (a thumbnail, reduced motion, a screenshot), so it is the beat that tells the story alone. Never pick a frame caught mid-change.
2. Film the loop, not just a still: the contact sheet at the shown width and at 390. Step through every press, menu, morph and the loop seam ([references/rehearse.md](references/rehearse.md)).
3. Read every frame. Fix the largest visible fault first, in this order: framing, hierarchy, motion, polish. Film again.
4. Hold the still next to the closest gold and answer the questions in [references/verify.md](references/verify.md).
5. `film.mjs --gate` must end `rehearsal passed`. That is necessary, not sufficient.
6. Run a fresh-eye review ([references/review.md](references/review.md)) and write `REHEARSAL.md` beside the component, from the template in `verify.md`.

## Faults that come back

Check each one before you hand over:

- Content that swaps instead of moving.
- Gray bars where the eye lands. Filler belongs at the edges.
- A plate behind the window, or a window that floats with air on four sides. The window or phone fills at least two thirds of the stage and runs off an edge.
- Empty bands, cut controls and cut shadows.
- Stock AI decoration and made-up logos: sparkles, purple, a letter in a coloured square.
- Busy rows and uneven insets.
- Long holds, and a reset with no cause.
- A text selection that is not under the I-beam.
- A status bar or home indicator drawn by hand. The `Phone` draws both.
- A centred amount centred together with its currency sign.

## The kit

The kit does the parts that are hard to get right by hand and leaves the look of the product to you. Read the entries in [references/kit.md](references/kit.md) for the parts you use.

- **Stage**: `Stage` holds design size, scale-to-fit, `compact`, scene state, playback, the look and the cursor. The script gets an `Act` (`set`, `wait`, `move`, `click`, `type` and more).
- **Frames**: `Window`, `Phone` with `LockScreen` and `Notification`, `Keyboard`, `Thread` with `Bubble`, `Stamp`, `Receipt`. They carry real geometry, so never draw a window, device or bubble by hand.
- **Motion**: `Collapse`, `Roll`, `Swap`, `Count`, `Connector`, `Fly`, `Follow`, `States`, `Stream`, `Popover`, `Scroll`, `Camera`, `Expand`. They handle the frames that hand-written motion gets wrong.
- **Small parts**: `Bar`, `Text`, `Row`, `Avatar`, `Pin`, `Icon`, `Menu`, `Field`, `Segmented`, `Toggle`, `Tabs`, `Badge`, `Chip`, `BrandMark`, `Code`, `Chart`. Restyle them to the product. Never reshape the geometry of a kit part from outside.
- **`stageshow.css`**: tokens, looks, edge fades, chrome, phones, keycaps.

## References

| File | Read it when |
|---|---|
| [references/examples.md](references/examples.md) | Choosing the example to start from (step 4) |
| [references/framing.md](references/framing.md) | Placing and cropping the hero, satellites and phones |
| [references/craft.md](references/craft.md) | Building the still: restraint, type, spacing, icons, colour, chrome |
| [references/motion.md](references/motion.md) | Planning the story, loop, pace, cursor, drags and phone motion |
| [references/choreography.md](references/choreography.md) | Timing one change that passes through several parts |
| [references/kit.md](references/kit.md) | Using any kit part: props and rules |
| [references/looks.md](references/looks.md) | Matching a product's colours, type, radii and density |
| [references/backgrounds.md](references/backgrounds.md) | Choosing a ground, or drawing object tiles |
| [references/brands.md](references/brands.md) | Showing a real company's logo |
| [references/annotations.md](references/annotations.md) | Adding leaders, connectors, dimensions or flows |
| [references/bento.md](references/bento.md) | Planning a grid of tiles |
| [references/products.md](references/products.md) | Reproducing a recognisable real product |
| [references/teaching.md](references/teaching.md) | Diagnosing a fault from a bad and good pair |
| [references/rehearse.md](references/rehearse.md) | Filming, and reading the film lines |
| [references/verify.md](references/verify.md) | The last checklist and the hand-over template |
| [references/review.md](references/review.md) | Briefing the fresh-eye reviewer |

`NOTICE.md` covers third-party names, marks and artwork in the examples and the kit.

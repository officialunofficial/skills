# The kit

Contents:

- Tiers
- Stage
- Act
- The cursor
- Window
- Phone, LockScreen, Notification
- Thread, Bubble, Receipt, Keyboard
- Motion parts
- Small parts
- Tokens and CSS
- Layout and CSS scope
- Explicit replay

The reference for every part in `kit/`. Read the entries for the parts a demo uses.

## Tiers

| Tier | Files | Rule |
|---|---|---|
| Stage | `stage.tsx`, `cursors.tsx` | The canvas, script, cursor, measuring and playback. Every demo is built on it |
| Frames | `window.tsx`, `phone.tsx`, `ios.tsx`, `messages.tsx` | Windows, devices and system surfaces from real geometry. Never draw a window, phone, bubble, notification, status bar or home indicator by hand |
| Motion | `motion/` | Behaviours that must hold up frame by frame. They bring motion, not a look |
| Small parts | `parts/`, `controls/`, `code.tsx`, `chart.tsx` | Quiet starting points. Restyle them to the product, or build the product's own |

The specimen sheets (`examples/controls`, `glass`, `brand-marks`, `kit-extras`, `parts`, `looks`, `chrome`, `phones`) show how each part behaves, one per tile. They are catalogues, not compositions to copy.

## Stage

The canvas.

| Prop | Purpose |
|---|---|
| `width`, `height` | The design size. The stage scales to fit |
| `compact` | A second design for narrow containers (`framing.md`, "Small formats and the page") |
| `initial` | Scene state, changed by the `Act` of the script |
| children | `(state, rect, layout) => JSX`. `rect(name)` measures any `data-target` and measures again after transitions settle. `layout` is `'wide'` or `'compact'` |
| `play` | `loop`, `once` or `hover`. Hover settles back with a glide when the pointer leaves |
| `poster` | The frame shown under reduced motion |
| `theme`, `palette`, `fidelity` | The look |
| `tokens`, `accent` | Token values for one stage |
| `greys="cool"` | Swaps the warm canvas and well for cool ones, for macOS or a blue ground. Light theme only |
| `ground` | What the scene sits on. `orbs` is a pale tile lit by soft colour orbs, so glass has colour to take. Pass two or three colours to choose them |
| `fill` | Grows past the design size to fill the container, up to 2x, for a hero or docs plate. A host wrapper marked `data-ss-fill` does the same |
| `speed` | Plays the script faster (above 1) or slower |
| `keys` | Where keycaps show: `bottom` (default), `top`, `bottom-left`, `bottom-right`. Also takes `{ wide, compact }`. Keep them clear of anything open |
| `hover` | Targets to show hovered in a still |
| `specimen` | Marks a sheet of parts. The composition checks of film stand down |
| `unframed` | For a developer who asks for no framing. Leave out `ground`. The bleed and floating checks of film stand down |
| `cursor` | See "The cursor" |

Playback: the stage stops and resets unfinished playback offscreen, restarts it on reentry, and preserves a completed `once` scene.

A host wrapper marked `data-ss-wide` scales the wide design only for a slot sized by height. An ordinary tile draws at 1:1.

## Act

What a script gets.

| Group | Methods |
|---|---|
| Scene | `set`, `put`, `snap(patch, scope?)` (no transitions, stage-wide or in one target), `wait` |
| Pointer | `move(to, { duration, path, onMove })`, `click` (`{ double: true }`, `{ right: true }`), `cursor`, `center`, `place` (instant, only behind a cut), `enter(to)` (arrives from past the nearest frame edge, already moving) |
| Drag | `drag` with `duration`, `{ cursor: 'preserve' }`, `{ path: (progress, from, to) => point }` and `onMove` |
| Keys and text | `type` (35ms per character by default), `key` (shows keycaps and resolves as the key comes up) |
| Timing | `stagger(items, fn, gap = 60)`, `mark(name)` to film a beat |
| Measuring | `rect(name, { layout })`, `caret(name, at)` |
| Scrolling | `scroll(name, target)` |

- `onMove(at, from, t)` receives each point of a move, for a scrubbed readout.
- `drag` dips, closes the open hand into `grab` at the bottom of the press, and opens on release. Over text or a canvas it selects and keeps its kind.
- `caret(name, at)` returns the character that a text selection reaches with the pointer at `at`. Call it in the `onMove` of a drag so the highlight tracks the I-beam.
- Start a move without awaiting it to run it alongside other beats.
- Moves travel in a shallow arc, timed by distance. Hovered targets get `data-hover` and pressed targets get `data-pressed`.
- A target can aim inside an element: `{ at: 'apply', x: 0.8, y: 0.6 }`.

## The cursor

`cursor={{ at, kind, style }}`. `at` can be `{ wide, compact }` when the compact design needs another rest point. Leave the cursor out of stills unless pointing is the story.

| Style | What it is |
|---|---|
| `real` | macOS cursors |
| `large` | The same at 1.5x |
| `circle` | The glass pointer of the iPad |
| `touch` | A finger on a phone: a dot only where it taps or drags |
| `arrow` | A solid rounded arrowhead, as illustrated demos draw it. An I-beam only over text |

Never use the macOS arrow on a phone.

- **Kinds** come from `data-cursor` on elements: `pointer`, `ibeam`, `crosshair`, `hand`, `open`, `grab`, `wait`, `resize-ns`, `resize-ew`, `resize-nwse`, `resize-nesw`. The kind switches as the cursor crosses the edge of the element.
- `ripple: true` sends a soft ring out from each click, for small stages.
- `idle` (ms, 4000 by default, `false` to disable) fades a cursor that has rested that long.
- `still: true` keeps the cursor in the reduced-motion poster.

## Window

Props choose the chrome. See `examples/chrome/`.

| Kind | Props |
|---|---|
| Browser | `url`, plus `nav` (back and forward), `tabs`, `urlShape="pill"` |
| App | `title`, centred in a plain bar. With a `toolbar`, the title moves left, 14px after the lights. `lead` is the left toolbar slot. `body` takes props for the content column |
| Sidebar app | `sidebar` runs full height and holds the traffic lights. `sidebarWidth` is 180 by default |
| `chrome="glass"` | A frosted browser for a colourful ground |
| `chrome="terminal"` | A dark terminal on one surface, with `title` dim and centred |
| `chrome="card"` | One white card, pale dots, a wide pale address bar, a long soft shadow |
| `chrome="hairline"` | A small quiet frame over a 1px rule, with the address as bare text, for a window that is a detail |

- **Sidebar heading.** Beside a `sidebar`, the title is the heading of the content column at its 16px inset. Pad the content 16px too, so the heading and the first row line up.
- **Grounds.** The body of a plain or browser window is the canvas (a quiet gray). The content column of a sidebar window is the surface (white). For a white page in a plain window, give its content `background: var(--ss-surface)`. Keep the content of one window one colour.
- **Lights.** They sit in the same spot in every kind. `lights` is `color`, `grey` (the glass default) or `white`.
- **Terminal.** Fill it with `<Prompt path="~/app">command</Prompt>` lines, plain divs for output (classes `ok`, `err`, `dim`, used sparingly) and a `<Caret />` on the last prompt. Never style a light window as a terminal by hand. Its colours are tokens: `--ss-term-path`, `--ss-term-sigil`, `--ss-term-ok`, `--ss-term-err`, `--ss-term-dim`, `--ss-term-bg`.
- `receded` fades the window to 40% when something comes forward.
- **macOS 26, each opt-in.** `sidebarStyle="floating"` (a rounded panel inset 8px, on a 24-radius window), `lightsSize="large"` (12px lights, 8px apart), `barSize="tall"` (a 64px toolbar of icons and labels).
- **Precedence.** A non-native `chrome` wins over everything and ignores `sidebar`, `tabs`, `nav` and `lead`. Otherwise `sidebar` wins, then `tabs`. A `url` beside a `sidebar` puts the address in the bar of the content column.

## Phone, LockScreen, Notification

A phone from real geometry at any `width`, with its screen laid out in true points. The framing and sizing rules are in `framing.md`, "Phones".

- `frame`: `photo`, `pro`, `silver`, `bezel`, `android`, `soft` (the pale marketing-page phone, no island), `clay`, `outline`, `bare`.
- `photo` uses a bezel image that the caller supplies through `--ss-phone-photo-light` and `--ss-phone-photo-dark`. No photograph is bundled, and without one it falls back to `pro`.
- Screen: `wallpaper`, `island`, `status`, `dark`. The screen is white by default and black with `dark`. `WALLPAPER` is the default lock-screen gradient. Pass it as `wallpaper` with `dark`.
- Size the phone for its text. A phone that shows app text is 340 wide or more (about 0.85 of true size). Let it run off the stage instead of shrinking it. A bar on the screen sizes to its content.
- `LockScreen` stacks notifications at the bottom, as iOS does. `size="satellite"` is for a phone beside a window: no controls, notifications under the clock. `clock={false}` drops the date and clock.
- `Notification` is always true iOS size, and as a banner it is native width: the screen minus 18pt each side. Size and crop the phone around it. Bodies wrap to three lines. On an unlocked phone, pass `banner` and it drops in at the top under the island.

## Thread, Bubble, Receipt, Keyboard

Messages come from the kit only.

- `Thread` pins a conversation to its bottom, glides older messages up when one arrives, and puts tails on the last bubble of each run. `app` is `imessage` (true iOS bubbles), `sms` or `chat` (AI apps: a quiet bubble for the person, plain text for the reply, paired with `Stream`).
- `Bubble from="me" | "them"` rises in from its tail corner.
  - `avatar` puts a small `Avatar` beside a received bubble, for a group chat.
  - `source` (the selector or target of the composer text) makes it form out of the input, as iMessage sends. Clear the field in the same update.
  - `typing` holds the dots and grows into the message when typing ends, as one object.
  - `tapback={{ emoji, show }}` adds a reaction.
- `Receipt` rolls Delivered to Read and folds away with `show={false}`. Keep it mounted.
- `Keyboard` is the iOS keyboard at true points, full width under the composer. Pass `typed` and it pops each key and follows auto-capitals. It also takes `suggestions` and `dark`. Leave it out by default. Show it only when typing is the story.

## Motion parts

| Part | Use |
|---|---|
| `Collapse` | A height that opens and closes, so what follows moves with it. `reveal="drop"` for a card or message that arrives whole. `from="below"` for a chat message that lands at the foot of a feed. `solid` for a surface unlike the ground, which would otherwise fade through gray. On close, the content dims and dissolves across the whole travel |
| `Fly` | Carries an element along a soft arc from the `rect()` of the source element to the `rect()` of the landing element. It is hidden until `go`. `held` shows it waiting at `from`. `.ss-fly[data-go]` styles it in flight |
| `Toast` | A confirmation that rises in. `--ss-toast-rise` sets how far |
| `Spinner` | A pending arc |
| `Connector` | A line that draws between two points and ends on a dot. `dots` (`none`, `both`), `arrow`, `label` (a word or a step number), `labelAt` (0 to 1). `route="step"` merges several lines into one level run before a target. Leave about 80px between columns. `route="curve"` is the same path as one soft S |
| `Count` | A number whose changed digits roll, last digit first (`duration`, `stagger`). It uses tabular digits but reserves no extra width, so give it a stable slot. A unit sits in `.ss-count__unit`, and `--ss-count-unit-gap` widens its gap |
| `Roll` | Text that animates only its changed span and moves what follows by the measured width. `variant="fade"` for control labels. `align="end"` for a right-pinned value. `delay` holds the old text, so a total changes a beat after its cause |
| `Meter` | A usage bar that fills. `tone` sets its colour |
| `States` | The states of a control (label, spinner, done) stacked in one place and crossfaded, with the box holding the largest. `align` sets alignment. For an icon and label in a full-width button, stack the whole group of each state in one cell |
| `Swap id={step}` | Replaced text that crossfades while its box eases to the new size. For a label whose box resizes in a line of text |
| `Stream` | Text written word by word, with every word already in its final place. `mark` highlights changed words |
| `Popover` | A floating surface that scales a touch from `origin` (`'top left'` by default) while its contents fade. Restyle with `--ss-popover-bg` and `--ss-popover-shadow`. 4px of padding by default |
| `Menu` | Rows with a `value` highlight (the row index) at fixed `--ss-row` height. `targets` makes items highlight under the cursor |
| `Slot` | A gap in a list that opens and closes (`open`, `height`, `gap`, `dashed`), for a card that moves between lists |
| `Scroll` | A scrolling area: `<Scroll name="list">` with `a.scroll('list', 'row-5')` or a px offset. `bar="always"` or `bar="none"` |
| `Camera` | Pushes in on part of the scene and back out. Wrap the scene and set `focus` to `a.rect(name, { layout: true })` or null |
| `Follow` | Springs an overlay onto a rect and keeps momentum when retargeted |
| `cellOf` | Sticky cell borders for drags |
| `Tooltip` | A small dark label centred under a target rect (`side="above"` for over), `gap` from it. Pass `at={rect('archive')}` |
| `Expand` | The iOS card-to-screen open as one element, clipped from `from` (a measured rect). With `face` it is an app launch |

**The Fly handoff.** Measure the element itself, never a slot or wrapper around it, because a slot rect makes it snap in size on landing.

1. Hide the source in the set that turns `go` on.
2. When it lands, show the real element and hide the flyer in one set.
3. `snap({ go: false })` while it is hidden, ready for the next loop.

**The value chip.** `from` is the text rect of the value. Draw the child of the chip transparent, with its words exactly over the words of the value: same size and weight, green, with the + in the padding to its left. The value fades under it. With `held`, it buds in where it sits. On `go`, its surface fades in during the flight. The check or the rolling total comes only after it leaves.

**Popover closing.** While it fades, a `Popover` freezes its children and position as they were when open, so a reset never shows. A change made in the same set as `show: false` does not show either. To change the contents before the close (a row ticked, then the menu goes), make the change in one set and close in the next.

**A filtering palette is not a Menu.** Build the list as rows, each in a `Collapse` that is `open` while it matches, so the rows below close up. Keep the highlight on the first match.

**Slot.** The source slot closes as the card lifts, the destination opens (`dashed`) as it travels, and the card lands in it. Draw the dashed mark at the full height of the slot and only fade it. Aim the drop at where the card will sit when the slot is open: measure the column, not the opening slot. Columns have fixed widths (`minmax(0, 1fr)`), or they shift as the card changes column.

**Scroll.** The cursor moves over the area first and holds still while the content moves. The overlay scrollbar shows while it scrolls and fades after. Edges soften only after scrolling.

**Expand in a Phone.** Closed, it still draws its face at `from`, so keep it in a layer that stays hidden until the launch. Put that layer at z-index 1, under the status bar and island. Set the `dark` of the Phone to false as the app covers the top. The window takes `--ss-expand-bg` as it grows.

## Small parts

| Part | Use |
|---|---|
| `Row` | One row of a list. Slots: `lead`, `title`, `subtitle`, `meta`, `preview` (placeholder lines as bar widths), `unread`, `selected`, `pad` |
| `Bar` | A placeholder line, `tone` 1 to 5. A line gives way in a row too narrow for it and never runs past its container. `shrink` overrides |
| `Text` | Real text that becomes a placeholder line at minimal fidelity. Set `w` for an exact width. `Text filler` is the reverse: words only at realistic fidelity, a bar otherwise |
| `Avatar` | Initials avatars. `tone`: `person` (default, a muted opaque colour per name), `ink` (gray), `accent` (the person the story is about), `ios` (the gray-blue monogram). `plain` for a filler disc. `ring` marks status: `pending`, `waiting`, `confirmed`, `declined` |
| `Facepile` | Overlapping avatars, each cut out of the next: `names`, `size`, `overlap` |
| `Check` | A status check. `pending` turns an arc in the ring. `on` grows a solid disc and draws the tick. One mark from pending to done |
| `Icon` | A few line icons (including the `chip` and `contactless` arcs of a card) and `Icon filled` system glyphs |
| `Pin` | A comment pin: a rounded square with one square corner (`corner`: `bl`, `br`, `tl`, `tr`), an initial or `src`, `tone`, `selected`. Place the square corner on the thing the comment is about |
| `Field` | A text field: label, a focus ring that never moves the text, a placeholder that leaves on the first character, a caret, `password`, `status`, `chip` (commits typed text as a filter chip in place) with `remove`. Put `data-target` on `box` |
| `Segmented`, `Tabs` | A sliding highlight. `items`, `value` (the selected index), `targets` |
| `Toggle`, `Badge` | A switch. A status pill with `dot` or `icon` |
| `Chip` | A filter chip that opens and closes its own width. `remove` names its x for the cursor |
| `Code` | Real code lines with numbers, quiet syntax colour and diff lines (`kind: 'add'` or `kind: 'del'`). `count` streams lines in without reflow |
| `Chart` | A smooth line with a soft area and an end dot, or `kind="bars"`. It draws in on `show` and eases between datasets. `chartPoints(props)` returns where each point draws, for a tooltip or hairline |
| `BrandMark` | A real product mark from the local registry (`brands.md`) |
| `inset`, `box`, `between`, `contains` | Rect helpers. A `Rect` is `{ x, y, width, height }`. Use `width` and `height`, not `w` and `h` |

**Row anatomy is fixed.** The lead and dot centre on the title and subtitle. The title sits 4 to 6px above its subtitle. Children (a `Toggle`, a chevron, a badge) trail at the end of the title line. Extra preview lines go inside `subtitle`. A title with no subtitle is a one-line row, with no second line reserved. Inside a `Phone`, a row takes iOS sizes (17pt name, 15pt lines, 10pt dot). Never restyle its `.ss-row__*` parts.

**The unread dot** hangs in the margin left of the lead, so the row never moves. Give the list a few px of padding for it. Follow the product: Mail and Messages reserve a dot column on every row, and Gmail puts the dot by the time. Never pad only the unread rows.

## Tokens and CSS

- **Look tokens.** Shape (`--ss-radius-sm`, `-md`, `-lg`, `-window`, `-pill`) and density (`--ss-control`, `--ss-row`) sit beside the colour and type tokens. Every rounded part reads them. Set a look with a class over `.ss-stage` or with `Stage tokens` (`looks.md`).
- **Layer.** All kit CSS is in `@layer stageshow`, so the unlayered CSS of a demo always wins. Restyle a part with a plain class, never `!important`.
- **Guards.** A few unlayered guards keep host CSS out of a stage: host element rules roll back to browser defaults, and a universal reset such as Tailwind preflight is handed back to the kit. A host rule with a class (`.article p`) still reaches in. Exclude stages with `:not(:where(.ss-stage *))`.
- **Edge fades.** `.ss-fade-b`, `-r`, `-br`, with `--ss-fade`.

## Layout and CSS scope

In render code, use the third `layout` argument. In a script, use `a.layout`. Both are `'wide'` or `'compact'`. Do not infer layout from the measured width of a child, because that element can be narrow in either composition.

`<Stage className="demo">` puts the class on the outer `.ss-fit` wrapper. The inner `.ss-stage` owns `data-layout` and the design dimensions:

```css
.demo .ss-stage { background: #f5f5f5; }
.demo .ss-stage[data-layout="compact"] .card { width: 300px; }
```

`.demo[data-layout="compact"]` matches nothing. Scope the other selectors of the scene under `.demo` too. Measure the host width before you choose the compact design size. The example dimensions are not defaults.

## Explicit replay

`Stage` has no imperative replay handle. Put a real, accessible Replay button in the host and remount the demo at that story boundary:

```tsx
const [run, setRun] = useState(0)
return <>
  <button onClick={() => setRun(n => n + 1)}>Replay</button>
  <InviteDemo key={run} />
</>
```

The click explains the return to the starting picture. Keep the size of the wrapper fixed. For a soft restart, hide the scene before the key changes and reveal the fresh one after.

Use a changing key only for replay. Ordinary state, text and variant changes keep the identity of the moving object. Set `play="once"` for a scene that waits for Replay after its payoff, with a meaningful `poster`.

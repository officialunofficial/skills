# Craft

Contents:

- Restraint
- Type
- Spacing and alignment
- Icons and logos
- Colour and looks
- Density
- Chrome and devices
- A page of demos
- Recipes

The rules for the still frame. Framing is in `framing.md`. Everything that moves is in `motion.md`. A name in parentheses such as (`fat row`) is the film line that flags the fault.

## Restraint

**Words and filler**

- Count the real strings: the title, the thing acted on, what is typed, the result. That is usually 3 to 7. The rest is `Bar`.
- A word budget is not an element budget. A calendar needs a populated week, a search needs a collection, a filter needs enough rows.
- Build lists from `Row`. Hand-built rows are where lists go wrong.
- Bars are filler and the subject is words. Bars where the eye lands read as unfinished. A sidebar of bars beside a real subject is fine.
- Where the story touches a list, use two or three real rows and at most as many bars (`skeleton ladder`, at realistic fidelity only).
- In a popover, card or tile, a row is one line: avatar, name, value. Put no gray bar under a real name there.
- Label and value match: both words or both bars. A blank pill beside a real control is dead, so leave it out.
- Vary placeholder widths row to row (60, 45, 70, 52).
- Named avatars take their own colour, which is the kit default. Gray discs are filler only.
- Keep only the text needed to recognise the product and follow the beat.

**Subject**

- Keep the signature content of the domain: album art, thumbnails, avatars. Without it the screen is a generic list (`examples/dark-bento`).
- When the output is the subject (a log, a diff, a terminal), real lines are the content. Keep them short and few, with the rest of the screen quiet.
- A terminal is a character grid. A spinner and a text tick share one `1ch` cell, and each line owns its mark, swapped in place.
- One number gets to be big. The rest are lines.
- Say it once: one clear link for the feature, not its signal in the header, the satellite and every row.
- Use no masthead for a fictional name: no monogram, logo, sidebar and nav in every crop.
- The product name appears only when the brief leans on it and the real product would show it there, such as the app name of a notification.
- A date-range band runs week by week with air between rows. It fades where the range continues. Cap it only on the real start and end days, each a solid accent disc with the day in white.

**Composition**

- Simplify before you polish: the fewest surfaces and strings that explain the product, then borders and badges only where earned.
- Simplification keeps the character. Cut repeated framing before meaningful imagery. An empty white card is not the cure.
- Judge the silhouette before the details. At thumbnail size, the subject, the support and the empty space make one picture.
- Compose objects, not an inventory of cards. Hierarchy comes from proportion, space, material and ground.
- The heaviest marks sit on what the story is about.
- Space follows the story. The payoff gets the room. Leave no empty band in the middle of a window, no gap above a card, no void between the label of a stat and its number.
- Dots, halos, badges and focus rings sit fully inside the content edge.
- Check imagery at its smallest size and over every surface it crosses.
- Nothing is outsized. The hero element stays in proportion to a real screen.
- At `fidelity="realistic"`, or when asked, put plausible content everywhere and still leave room to breathe (`examples/wikipedia`).
- A styled brief gets its colours, radii, mascot and motion in full.

## Type

- Fit the text before you fix the box. The border-box of a control holds content, padding and border. Flex centring does not make text fit.
- Small text gets a line height of at least 1.3 and insets on every side.
- Use real sizes, then scale: UI text of 11 to 15px, scaled by the stage. Never 7px type.
- Use one family: the product's, or the system stack. Monospace is for code, identifiers and aligned numbers only.
- Use sentence case unless the real product has caps. Hierarchy comes from spacing and one weight step.
- Use no real headings. The title of a faux app is a `div`, never `h1` to `h6`, because the demo lives in the page outline of the host.

## Spacing and alignment

**Insets and gaps**

| Thing | Value | Film line when broken |
|---|---|---|
| Words from the edge of a window, card, panel or hovered row | 12px (flagged under 8px) | `tight inset` |
| Row padding | 12px, or 8px for a dense list | `fat row` when a one-line row is 3x taller than its words |
| Title over its subtitle | 4 to 6px of ink between (line height 1.3 plus a 2px gap) | `tight stack`, `loose stack` |
| Button to the field, line or card edge above it | 8px or more | `tight control` |
| Text to a neighbouring box | A fixed `gap` of 8 to 12px, never leftover `space-between` | `touching` |
| A dot, badge or ring to the avatar or text | 6px clear, inside the row inset | `tight mark` |
| Two edges that nearly meet | Exactly aligned, or apart by the gutter and never under 8px | `near-tangent` |

- Bars may bleed. Words do not.
- Bars sit in the line box of the text they replace, so a skeleton row keeps the pitch of the real row. Bars of 6 and 5px want 7px between them.
- A placeholder bar follows the text rules. It never touches or runs under an avatar, badge, icon or bar.
- Carry the inset round the bottom. A comfortable top does not excuse a cramped action.
- The first heading of a page sits at least the side inset below the rule of a toolbar or title bar.
- Whitespace groups. A title sits closer to its metadata than to the next record. Never spread lines equally to fill a frame.
- Do not end just short of an edge. Give real room, or move the thing down and crop it.

**Centring**

- Centre a label on its letters, not on its line box. Capitals sit low in a plain line box, so trim the label with `text-box: trim-both cap alphabetic`. `Badge`, `Avatar` and `Field` already do.
- Nested shapes pad evenly: the same distance from every edge. The outer radius equals the inner radius plus that padding.
- Centre on the visible face. Take tracking back with a negative `margin-right`. A pair centres as a pair.
- A centred amount centres its digits. `$45` centred as one string sits right of centre to the eye. Hang the currency sign off the left: the digits are the centred box, and the sign is placed absolutely at `right: 100%` inside it. A rolling amount rolls only the digits.
- Shift a play triangle toward its point by a sixth of its width.

**Rows and controls**

- Align the reading edge, then the visible ink. A small icon aligns with the first line of the title.
- A control hugs its content. Never use `flex: 1` with the contents at one end (`lopsided`).
- Fix overflow by fitting the content, not by widening the container. Measure the padding again afterwards (`uneven`).
- Columns line up. Every row shares one grid template with fixed tracks. Optional content keeps its track empty.
- A dot, badge or ring is not a column. It sits in the gutter or on the avatar.
- A popup under a field draws its ring inset, so its sides line up with the field.
- Links have no hover surface. A control has a surface that is visible at rest.
- Hover and selection fills are inset and rounded. Negative margins go on the list, not on the row.
- A trigger whose popover is open keeps its pressed look: `data-open`, styled like `[data-hover]`.
- Clone the menu of a real product from its computed styles.

## Icons and logos

- Icons come from a set, never from your hand. Use the product's own pack first. Otherwise choose a set on purpose and use it at one size and one stroke width. A hand-drawn glyph never matches the weight of its neighbours (`mixed icons`).
- Choose the set by platform: kit `Icon filled` for Apple, Material Symbols for Android, otherwise Phosphor, Iconoir, Radix, Tabler or Heroicons. Use Lucide deliberately, not by reflex. Apple chrome uses SF-style glyphs.
- Draw no marks by hand (pin, cursor, badge, ringed dot, chip, contactless arcs). Take them from the kit or the product assets, or leave them out.
- Use one family, one stroke weight and one size (14 to 16px) per scene.
- Small icons are filled. At 14px and under, and in tinted tiles, thin outlines go wiry.
- Icons are one opaque colour (`--ss-icon`, `--ss-icon-faint`). Fade with `opacity` on the svg. No duotone.
- Put even glyphs in even boxes. An odd icon in an even box snaps when motion ends (`half-pixel glyph`).
- Fixed boxes do not shrink. Give an icon button or chip in a flex row `flex: none` (`squeezed`).
- Emoji are content, never icons (`emoji icon`).
- Imagery earns its place: real imagery or a good icon, never invented illustration. Gray art is for empty states only.
- Logos of other products come from `BrandMark` or a project asset, in original proportions and colours (`brands.md`).
- Invent no logo. A letter or glyph in a coloured square is not the mark of the product (`invented mark`). Use the real mark or a plain text wordmark.
- AI features get no sparkle, wand or star, and no purple as the AI colour. Show what the AI does. The product's own icon is fine even when it is a sparkle.

## Colour and looks

- Use one neutral family for window, sidebar and cards. A coloured ground or another material differs on purpose.
- Start with five inks and one accent. Status colours mean status.
- Add no redundant tonal borders. Try the fill alone. Add a border for separation, for state, or because the product draws it.
- Quiet is not faint. Check text, actions and surface against the real ground.
- A gradient or glow serves the story or goes.
- Do not outline the hero to point at it. An accent ring with a halo reads as a focus state. Lift it as the product would: its own surface, the raised shadow, a label in the accent.
- A filled button keeps its colour under the pointer: one step of its own colour, never a gray swap.
- In mono, mark the thing acted on with a solid step in surface and weight, never a translucent wash.
- Nothing translucent overlaps (`onion skin`). Overlapping avatars are `Facepile`. Stacked chips or cards take opaque fills.
- On dark themes, depth comes from a lighter surface, not from shadow. Satellites go on `--ss-raised`.
- A light document over a dark workspace stays a readable light document, with its own foreground and edge.
- The light inks are tuned for white cards on a gray canvas. On white, step them up a tone.
- Status colour stays legible: success, pending and disabled are distinct.
- Contrast has a purpose. A near-black strip for no reason is a hole.
- Build once and check every look the request names. A light pass does not prove dark. `--dark` films the dark theme.

## Density

- Density follows the story. Ask whether a person would do this here. There is no element quota, and empty space can be hierarchy. Enlarge content before you add anatomy.
- Below about 320 wide, keep the action and readable type and drop the desktop anatomy.

## Chrome and devices

**Windows**

- Ask whether the frame helps. Use browser chrome only when the browser is part of the picture. A desktop app gets its real chrome.
- Choose chrome for the task. A sharing panel needs a document, permissions and an action. A browser bar explains nothing there.
- Never draw platform chrome from memory. Open the real app or a screenshot first.
- Columns run the full height of their window (`Window sidebar`).
- Window chrome is fixed at 38px. Use `barSize="tall"` (64px) only for a real toolbar of icons and labels.
- macOS 26 Finder: a solid white window, only the floating sidebar is glass, gray glyphs, the selected row on a gray pill.
- A quiet browser window centres its content and carries a rounded, centred URL pill.
- A document that is not the hero is content: a ruled page with real margins, not another window.
- With several windows, choose the active step. Quieter contrast and shadow push the others back.

**Phones**

- Phones come from the kit. `photo` falls back to `pro`, never to an empty bezel.
- System surfaces keep their real proportions. Never shrink the iOS clock.
- A notification is one bold title over its message, with the geometry of `Notification` and a real app icon.
- Nothing sits under the island. A sheet or grabber starts below the status bar.
- The status bar and home indicator come from the `Phone`. A second indicator inside the app shows as a sliver under the real one. An app that covers a dark screen turns the `dark` of the Phone off as its surface arrives.
- A phone is lit from its first frame: never dimmed, blacked out or faded up.
- A phone background has a job. Use `LockScreen` for notification and island stories. Never invent home-screen icons.
- A phone may straddle a window. It never covers the amount it explains.
- A messaging app on an iPhone keeps the conventions of Messages unless the brief gives it a look: blue sent bubbles, gray received, the plus and mic in the composer, reactions on the bubble. An invented accent and composer make it read as a fake.

## A page of demos

- Use one figure language: one ground, one gutter, one window shadow (`--ss-shadow-hero`), one radius set. A different shadow says something or is a mistake.
- Prefer fewer, stronger demos. Add no labelled containers or text tiles when the demo says it.
- A comparison pair shows a different demo from the one just above it.
- Mark a bad example in the annotation style of the page, never with crosses or scrawls.

## Recipes

- Scope the CSS to the demo. Nest the stylesheet under its root class, with `@keyframes` outside. A prefix is not enough. A host that styles prose by class excludes stages with `:not(:where(.ss-stage *))`.
- Check a fresh load at each width and a resize between them: targets, clips, overlays, poster.
- Plan a grid of cards with `bento.md`.

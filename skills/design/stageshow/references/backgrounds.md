# Backgrounds and the whole picture

The supplied looks are examples, not a menu of allowed styles. Start with the product and the feeling you want. Typography, content, layout, imagery, material and motion all support one idea. A new accent colour alone does not make a new identity.

## Choose the ground for its job

| Ground | Job | Rule |
|---|---|---|
| Quiet solid or tint | Gives dense UI room to read | Separate the foreground with a clear step in value before you add a shadow |
| Colour field or graphic pattern | Makes a sparse picture distinctive | Keep a calm area behind useful text. Let the pattern give direction or scale |
| Colourful gradient | Carries a brand moment | Choose its direction and colour relationships on purpose. Keep strong colour behind an opaque surface, or give glass enough density to keep its text readable. A vivid ground does not also need vivid controls, a coloured shadow and a glow |
| Material (paper, glass, metal, plastic) | Gives the scene a physical character | Each needs its own edges, highlights and shadows, used consistently. Texture supports a material. It never sits over text or stands in for hierarchy |
| Photography or artwork | Leads with an image | Use a licensed local asset, keep its subject, credit it where required. Never present a CSS landscape as a photograph |
| Dark | A dark product or a dark page | Choose text, borders and raised surfaces together. Black behind a white mockup and a coherent dark product are different compositions |

Crisp bands show what a glass surface blurs. A glow everywhere shows nothing. Give banded grounds a hierarchy: a dominant field, a supporting colour and an optional narrow highlight.

`examples/backgrounds/` holds one small interface across twenty grounds: tint, fields, light, linework, material, six vivid gradients and six textures. They show relationships. They are not presets.

## Compose the set before the tiles

The rules of a set are in `bento.md` (rules 2, 4, 6 and 10). `examples/hero-grid/` shows them with several grounds held together by shared 8px gaps and 12px corners. Orange returns in the artwork and violet links the glass to the dark sleeve. Borrow the relationships, not the colours.

Judge adjacent colours as a pair and the grid as a silhouette. An image-led hero can skip tile headlines when the pictures carry the idea.

## Objects and drawings as tiles

The tiles that stop a grid from being five windows are rarely UI: a payment card lit from one side, a folded corner of paper, a chip, a keycap, a line drawing of a stack.

- Give an object one light source, a real material and a shadow that agrees with the tiles around it. A matte card has a soft falloff. A glass pane has a rim.
- A line drawing uses one stroke weight and the ink of the grid, and it holds still.
- Neither needs a label inside the picture. The tile copy does that.
- A stack of objects is one object. Centre the whole silhouette with equal air on each side of the tile, and keep the back cards clear of the copy.
- A payment card keeps its real anatomy at any size. The chip is about an eighth of the card width and sits a third of the way down. The contactless arcs sit beside it at about half the chip height. The name and number run along the bottom edge, and the network mark sits in the bottom-right corner. A chip the size of an icon gives a drawn card away first.

## Recompose for the host

Recomposition and motion follow `bento.md` (rules 11, 12 and 13). A crop may take a blank keycap edge, album artwork or a window margin. It never takes the label or result the viewer needs.

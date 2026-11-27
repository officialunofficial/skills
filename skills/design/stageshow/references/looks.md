# Looks

Contents:

- Built-in looks
- Tokens
- Define a look
- From a codebase
- From a public site
- What a look does not change
- Check it

A look is a set of design tokens: colour, type, shape and density. The kit parts read them, so one look restyles every window, field, menu and badge at once. The motion, framing and craft rules stay the same.

Use the product's own look whenever one exists. A demo in the real colours, radii and type of the product reads as the product, not as a generic mock.

## Built-in looks

`Stage` takes `theme` (`light`, `dark`, `blueprint`, `glass`), `palette` (`accent`, `mono`) and `fidelity`. A custom look sits on top of one of them, usually `light` or `dark`.

## Tokens

| Group | Tokens | Default |
|---|---|---|
| Surfaces | `--ss-canvas`, `--ss-surface`, `--ss-chrome`, `--ss-well`, `--ss-raised` | warm grays, white |
| Lines | `--ss-line`, `--ss-line-faint` | translucent black |
| Text | `--ss-text-strong`, `--ss-text`, `--ss-text-faint` | three grays |
| Icons | `--ss-icon`, `--ss-icon-faint` | opaque grays |
| Accent | `--ss-accent`, `--ss-accent-2`, `--ss-accent-soft`, `--ss-accent-text` | blue |
| Status | `--ss-success`, `--ss-danger`, `--ss-warning`, each with `-soft` and `-text` | green, red, amber |
| Type | `--ss-font`, `--ss-mono` | the system stacks |
| Shape | `--ss-radius-sm` (6), `-md` (8), `-lg` (10), `-window` (12), `-pill` (999) | px |
| Density | `--ss-control` (34, a text field), `--ss-row` (26, a menu row or segment) | px |
| Shadows | `--ss-shadow-hero`, `-satellite`, `-ground`, `-window`, `-float`, `-lift`, `-card` | see `framing.md` |

The placeholder inks (`--ss-ink-1` to `-5`) belong to the kit, not to the product. Leave them alone unless the product grays have a different temperature. In that case use `Stage greys="cool"`, or set the inks from the same gray family.

## Define a look

As a stylesheet, which can also carry a dark variant:

```css
.look-acme .ss-stage {
  --ss-accent: #5b5bd6;
  --ss-font: "Inter", system-ui, sans-serif;
  --ss-radius-md: 6px;
  --ss-control: 32px;
}
.look-acme .ss-stage[data-theme="dark"] { --ss-surface: #18181b; }
```

Then `<Stage className="look-acme" theme="light">`. For one stage, pass values: `<Stage tokens={{ '--ss-accent': '#5b5bd6' }}>`.

Keep the look of a product in one file beside its demos, and use it on every stage of that product.

`examples/looks/` has nine studies. Three invitation variants isolate token choices. Five more (a dark console, a financial overview, a creative canvas, a conversation, a research notebook) also change anatomy, density and hierarchy. The last is a skeuomorphic transfer receipt with layered paper and coherent lighting. Skeuomorphic here means restrained material depth with clear information, not an imitation appliance. Borrow the decisions, not the layout of an unrelated product.

## From a codebase

When the product code is at hand, its look is already written down. Read it before you build.

1. **Find the tokens.** Look for CSS custom properties, a Tailwind config (`theme.extend.colors`, `borderRadius`, `fontFamily`), theme files, or the provider of a component library. Failing that, read the computed styles of a real button, input, menu and card.
2. **Map them.**

   | Product value | Kit token |
   |---|---|
   | Primary colour | `--ss-accent` |
   | Page and card backgrounds | `--ss-canvas`, `--ss-surface` |
   | Text scale | the three text tokens |
   | Borders | `--ss-line` |
   | Font stack | `--ss-font` |
   | Button or input radius | `--ss-radius-md` |
   | Menu item radius | `--ss-radius-sm` |
   | Popover or card radius | `--ss-radius-lg` |
   | Input height | `--ss-control` |
   | Menu row height | `--ss-row` |

3. **Write the look file** and use it for every stage of that product.

By default the demo is its own code, styled to match: the small kit parts restyled with the product tokens. When the developer asks for their own components, import those inside the stage in place of the small kit parts. The stage, frames, cursor and motion parts still work around them. Mark what the cursor touches with `data-target` and measure it with `rect()`.

Real components bring real density, so the restraint rules still apply. If a component fetches data or needs app context, give it fixed props or a small wrapper. A demo never calls a live service.

## From a public site

For another company's product, approximate the look from its public site. Read the computed styles of a button, an input, a menu and a card, and map them the same way. Take the values, not the assets: no unlicensed fonts or images. Use the local brand marks of the kit where they fit (`brands.md`).

## What a look does not change

A look sets visual tokens only. The scene still takes on the motion and interaction habits of the product, and the timing and framing of the kit are defaults. Keep real interaction timing where it helps recognition, then give the audience reading time. Causality, continuous identity, legibility and reduced motion hold in every style.

## Check it

Put a still of the demo beside a screenshot of the real product at the same scale. The accent, the temperature of the grays, the radii and the type match at a glance. If a control looks foreign, read its real computed styles again instead of nudging by eye.

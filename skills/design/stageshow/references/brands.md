# Brand marks

When a scene shows a known product or payment method, use its current real artwork. Check the official brand source before you trust an icon catalogue, because catalogues keep outdated colours and logos.

`BrandMark` reads a small local registry of common integrations and checkout marks. The SVGs live in the kit, keep their original colours and proportions, and never call an icon service at runtime.

```tsx
import { BrandMark } from './kit'

<BrandMark brand="google-calendar" size={28} />
<BrandMark brand="visa" size={20} tile={false} />
<BrandMark name="Your product" src="/assets/product.svg" size={28} />
```

## Props

- `size` is the height of the footprint. App marks get a square footprint. Wide payment marks get a proportionate width.
- `width` overrides the footprint when a product row has a fixed track.
- `tile={false}` removes the tile. Check the bare mark against its real background.
- `surface` follows the light or dark theme of the Stage. Pass `surface="light"` for a white card inside a dark Stage. The kit picks a dark variant where one exists. Full-colour artwork with no dark variant keeps a white tile on a dark surface.
- `name` overrides the accessible label.
- `brandMarks` and `BrandName` are exported for a typed picker or a registry lookup.

## Rules

- The artwork is always `object-fit: contain`, never stretched to fill a square. The bundled marks carry optical scale adjustments, so a narrow Figma mark and a full Gmail mark have the same presence.
- Keep the native colours, even in a monochrome UI. Crypto marks are flat, with no coin bevels or metallic shading.
- Amex uses its white wordmark on a blue card tile, and its official blue-box logo when bare.
- A mark that ships as a glyph on a solid square field (Dropbox) shows as the glyph alone in its brand colour, on the same white tile as the other app marks. A sharp blue square inside a rounded white one is wrong, and a solid blue tile shouts beside the rest of the row.
- A real company named in the scene carries its real mark, never an initial in a brand-coloured tile. Film flags that as `invented mark`. If the kit has no mark for the company, name a company it has, or a fictional one with the neutral initial tile. Never pair a real name with a fake mark.
- A custom `name` with no artwork keeps the neutral initial tile for a fictional product.
- Minimal fidelity hides the artwork along with the other content.
- Use only the integrations or payment methods the scene needs. A small row explains a relationship. It does not fill spare space with logos.
- Keep equal row tracks and align the marks by eye. Different silhouettes do not excuse ragged labels or uneven gaps.

## The registry

| Group | `brand` values |
|---|---|
| Payments | `visa`, `mastercard`, `amex`, `discover`, `paypal`, `stripe` |
| Crypto | `bitcoin`, `ethereum`, `solana`, `usdc`, `tether` |
| Banks | `chase`, `wellsfargo`, `bankofamerica`, `barclays`, `hsbc`, `monzo`, `revolut` |
| Apps | `notion`, `gmail`, `google-calendar`, `google-docs`, `1password`, `figma`, `slack`, `github`, `linear`, `dropbox`, `google-drive`, `google-sheets`, `google-slides`, `google-meet`, `zoom`, `vercel`, `shopify` |

`examples/brand-marks/` shows every bundled mark on light and dark surfaces. `kit/brands/SOURCES.md` lists the pinned artwork sources and licences.

## Check the render

Inspect the rendered artwork, not just its image box. Tall marks need real air above and below, and wide marks must show in full. Give the image a definite box inside a centred flex layout: percentage image dimensions in an intrinsic grid track can grow and leave uneven insets. Check the real light and dark backgrounds, not only the theme attributes.

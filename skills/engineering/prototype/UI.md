# UI Prototype

Produce **several sharply different UI variations** on one route, toggled from a floating bottom bar. The user flips between variants in the browser, picks one (or lifts pieces from each), then discards the rest.

If the question is about logic/state rather than appearance — wrong branch. Use [LOGIC.md](LOGIC.md).

## When this is the right shape

- "What should this page look like?"
- "Show me a few options for this dashboard before I commit."
- "Try a different layout for the settings screen."
- Any time the user would otherwise burn a day choosing between three fuzzy mockups in their head.

## Two sub-shapes — strongly prefer sub-shape A

A UI prototype is far easier to judge when it's **pressed up against the rest of the app** — the real header, real sidebar, real data, real density. A throwaway route standing alone is a vacuum: every variant looks fine with nothing around it. Default to sub-shape A whenever a plausible existing page can host the variants. Only reach for sub-shape B when the prototype has no nearby home at all.

### Sub-shape A — adjustment to an existing page (preferred)

The route already exists. Variants render **on that same route**, gated by a `?variant=` URL search param. The existing data fetching, params, and auth all stay put — only the rendering swaps. This is the default; take it unless there's a specific reason not to.

If the prototype is for something with no page yet but that *would naturally live inside one* (a new dashboard section, a new card on the settings screen, a new step in an existing flow) — that's still sub-shape A. Mount the variants inside the host page.

### Sub-shape B — a new page (last resort)

Only when the thing being prototyped truly has no existing page to sit inside — an entirely new top-level surface, say, or a flow that embeds nowhere sensible.

Create a **throwaway route** following the project's existing routing convention — don't invent a new top-level structure. Name it so it's plainly a prototype (put `prototype` in the path or filename). Same `?variant=` pattern.

Before you settle on sub-shape B, double-check: is there really no existing page this could be embedded in? An empty route hides design problems a populated one would expose.

The floating bottom bar is identical in both sub-shapes.

## Process

### 1. State the question and pick N

Default to **3 variants**. Past 5 they stop being sharply different and become noise — cap there.

Write the plan in one line, in the prototype's location or a top-of-file comment:

> "Three variants of the settings page, toggled via `?variant=`, on the existing `/settings` route."

This holds whether or not the user is here to push back.

### 2. Generate sharply different variants

Draft each variant. Hold each to:

- The page's purpose and the data available to it.
- The project's component library / styling system (TailwindCSS, shadcn, MUI, plain CSS, whatever it is).
- A clear exported component name — `VariantA`, `VariantB`, `VariantC`.

Variants must be **structurally different** — different layout, different information hierarchy, different primary affordance, not just different colours. Three lightly-tweaked card grids isn't a UI prototype, it's wallpaper. If two drafts land too close, redo one with an explicit "no card grid" steer.

### 3. Wire them together

Create a single switcher component on the route:

```tsx
// pseudo-code — adapt to the project's framework
const variant = searchParams.get('variant') ?? 'A';
return (
  <>
    {variant === 'A' && <VariantA {...data} />}
    {variant === 'B' && <VariantB {...data} />}
    {variant === 'C' && <VariantC {...data} />}
    <PrototypeSwitcher variants={['A','B','C']} current={variant} />
  </>
);
```

For sub-shape A (existing page): keep every existing data fetch above the switcher; only the rendered subtree changes per variant.

For sub-shape B (new page): the throwaway route under `/prototype/<name>` mounts the same switcher.

### 4. Build the floating switcher

A small fixed-position bar at the bottom-centre of the screen with three parts:

- **Left arrow** — steps to the previous variant (wraps around).
- **Variant label** — shows the current variant key, plus its exported name if it has one. e.g. `B — Sidebar layout`.
- **Right arrow** — steps forward (wraps around).

Behaviour:

- Clicking an arrow updates the URL search param (via the framework's router — `router.replace` on Next, `navigate` on React Router, etc.) so the variant is shareable and survives reload.
- Keyboard: `←` and `→` also cycle. Don't intercept arrow keys while an `<input>`, `<textarea>`, or `[contenteditable]` is focused.
- Visually distinct from the page (high-contrast pill, subtle shadow) so it's obviously not part of the design under review.
- Hidden in production builds — gate on `process.env.NODE_ENV !== 'production'` or an equivalent check, so a stray prototype merge can't ship the bar to real users.

Put the switcher in one shared component so both sub-shapes reuse it. Locate it wherever shared UI lives in the project.

### 5. Hand it over

Surface the URL and the `?variant=` keys. The user will flip through when they get to it. The most useful feedback tends to be **"I want the header from B with the sidebar from C"** — that's the design they actually want.

### 6. Capture the answer and clean up

Once a variant wins, write down which one and why (commit message, ADR, issue, or a `NOTES.md` beside the prototype when running AFK and the user hasn't replied yet). Then:

- **Sub-shape A** — delete the losing variants and the switcher; fold the winner into the existing page.
- **Sub-shape B** — promote the winner to a real route; delete the throwaway route and the switcher.

Don't leave variant components or the switcher lying around. They rot fast and confuse the next reader.

## Anti-patterns

- **Variants that differ only in colour or copy.** That's a tweak, not a prototype. Real variants disagree about structure.
- **Sharing too much code between variants.** A shared `<Header>` is fine; a shared `<Layout>` defeats the point. Each variant should be free to throw the layout out.
- **Wiring variants to real mutations.** Read-only prototypes are fine. If a variant must mutate, point it at a stub — the question is "what should this look like", not "does the backend work".
- **Promoting the prototype straight to production.** The variant code was written under prototype constraints (no tests, minimal error handling). Rewrite it properly when you fold it in.

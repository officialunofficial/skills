---
name: reuse
description: "Sets the build order for anything new. The project's own components, icons and tokens come first, then a maintained library or a platform feature, and custom code comes last. Use before writing a new component, style, icon or helper, when a control looks hand-built or duplicated, when a fix belongs in a shared primitive and not at each call site, and when deciding whether to add a dependency."
license: MIT
metadata:
  upstream-author: "Raphael Salaja"
  upstream-source: "raphaelsalaja/skills"
---

# Reuse

Before building anything new, look for it in this order:

1. The project's own components, icons and tokens.
2. A maintained library the project can depend on, or a platform feature.
3. Custom code.

A new component, style or icon that duplicates one the project already has is a finding, because two versions drift apart and each fix must then happen twice. Adding a primitive to the shared package and then using it is not a duplicate. A project with no shared package is judged against the libraries it already depends on.

`restraint` owns cutting what nobody asked for. `match` owns copying an outside app.

## Rules

**Search the project first.** Search the shared component package, the icon set and the tokens before writing UI. Name what you found in the reply.

**Use shipped components as shipped.** Use a component's variants and `data-*` attributes. Do not restyle it with a local `className`.

**One style per kind of thing.** Keep one menu, one table and one dialog shell across the product.

**Fix it once, in the primitive.** When a fix applies to every instance, make it inside the shared component, not at each call site. Then search for every sibling, remove its local fix and list the files you changed. A fix on the cited line alone leaves the siblings broken.

**Then a library or the platform.** When the project has nothing, prefer a maintained library or a platform feature to custom code. `Intl` formats dates and numbers. The native context menu handles right-click.

**Check that a library is maintained.** When it is not, port its pattern into the project and do not install it.

**Read the docs before the props.** Read a primitive's documentation before you use it, and use its current API. A guessed prop fails silently.

**Icons from the set, at native size.** Use the project's icon set at the size each icon was drawn for. Do not generate an SVG, and do not scale an `18px` icon to `12px`. When the set lacks a glyph, `icons` draws it and adds it to the shared icon package. That is not a finding.

## Checks

| Rule | Broken | Replacement |
| --- | --- | --- |
| `reuse-house-component-first` | `<input className={styles.search} />` | The project's `<Input />` |
| `reuse-no-local-restyle` | `.menu { border-radius: 6px }` beside the shared `Menu` | `Menu` as shipped |
| `reuse-one-standard` | Three dropdown styles on three screens | One `Menu` |
| `reuse-fix-in-the-primitive` | A scroll fade added at five call sites | The fade inside `ScrollArea` |
| `reuse-sweep-siblings` | The cited line fixed, its siblings left | Every sibling fixed, the files listed |
| `reuse-library-before-custom` | A hand-written relative date formatter | `Intl.RelativeTimeFormat` |
| `reuse-no-stale-dependency` | An unmaintained package installed | Its pattern ported into the project |
| `reuse-read-the-docs` | `render={<button />}` on a trigger that is already a button | The prop the docs describe, or none |
| `reuse-icon-set-native-size` | An `18px` icon at `width: 12px` | The `12px` icon from the set |

## Reporting

When the skill runs as a review, write one finding per root cause:

```
file:line - [rule-id] what is wrong
```

Severity:

- `HIGH`: a duplicate of an existing shared component, or a hand-built control that a primitive covers.
- `MEDIUM`: a local restyle, an icon from outside the set, or a shared fix applied at one call site.
- `LOW`: a library chosen with no check that it is maintained.

Close with a `Rule | Count | Severity` summary and a verdict: `Block` while any `HIGH` remains, `Approve` otherwise. Approve only files you read. Mark every check you could not run as `Not verified`.

---
name: migrate-to-shoehorn
description: Convert `as` type assertions in test files to @total-typescript/shoehorn helpers. Use when the user mentions shoehorn, wants to remove `as` from tests, or needs to pass partial data to a typed function under test.
---

# Migrate to shoehorn

## Why shoehorn

`shoehorn` (published as `@total-typescript/shoehorn`) lets a test hand a function partial data without the compiler complaining. It swaps casts for helpers that stay type-checked, so the test still fails when the real shape drifts.

**Tests only.** Keep shoehorn out of production code.

What `as` costs you in tests:

- It defeats the compiler you are trying to lean on
- You restate the target type by hand at every call site
- Deliberately wrong fixtures need the double cast `as unknown as Type`

## Install

```bash
npm i @total-typescript/shoehorn
```

## Migration patterns

### A large object where the test needs a couple of fields

Before:

```ts
type Request = {
  body: { id: string };
  headers: Record<string, string>;
  cookies: Record<string, string>;
  // ...20 more properties
};

it("gets user by id", () => {
  // The test only reads body.id, yet has to fabricate a whole Request
  getUser({
    body: { id: "123" },
    headers: {},
    cookies: {},
    // ...fake all 20 properties
  });
});
```

After:

```ts
import { fromPartial } from "@total-typescript/shoehorn";

it("gets user by id", () => {
  getUser(
    fromPartial({
      body: { id: "123" },
    }),
  );
});
```

### `as Type` becomes `fromPartial()`

Before:

```ts
getUser({ body: { id: "123" } } as Request);
```

After:

```ts
import { fromPartial } from "@total-typescript/shoehorn";

getUser(fromPartial({ body: { id: "123" } }));
```

### `as unknown as Type` becomes `fromAny()`

Before:

```ts
getUser({ body: { id: 123 } } as unknown as Request); // wrong type on purpose
```

After:

```ts
import { fromAny } from "@total-typescript/shoehorn";

getUser(fromAny({ body: { id: 123 } }));
```

## Which helper to reach for

| Function        | Use case                                            |
| --------------- | --------------------------------------------------- |
| `fromPartial()` | Supply partial data that still type-checks          |
| `fromAny()`     | Supply deliberately wrong data (autocomplete stays) |
| `fromExact()`   | Require the full object (swap for fromPartial later) |

## Workflow

1. **Scope the change** — ask the user:
   - Which test files carry the problematic `as` assertions?
   - Are these large objects where the test reads only a few fields?
   - Do any tests intentionally pass malformed data to exercise error paths?

2. **Install, then migrate**:
   - [ ] Install: `npm i @total-typescript/shoehorn`
   - [ ] Locate the casts: `grep -r " as [A-Z]" --include="*.test.ts" --include="*.spec.ts"`
   - [ ] Turn `as Type` into `fromPartial()`
   - [ ] Turn `as unknown as Type` into `fromAny()`
   - [ ] Import the helpers from `@total-typescript/shoehorn`
   - [ ] Run the type checker to confirm the tests still compile

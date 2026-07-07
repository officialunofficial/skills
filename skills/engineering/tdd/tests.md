# Good and Bad Tests

## Good Tests

**Integration-style**: exercise real interfaces rather than mocks of internal pieces.

```typescript
// GOOD: checks observable behavior
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

What makes it good:

- Checks behavior that users or callers actually care about
- Touches only the public API
- Comes through internal refactors intact
- Says WHAT, not HOW
- Carries one logical assertion

## Bad Tests

**Implementation-detail tests**: welded to internal structure.

```typescript
// BAD: checks implementation details
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

Warning signs:

- Mocking internal collaborators
- Reaching into private methods
- Asserting on call counts or call order
- Breaking on a refactor that left behavior unchanged
- A name describing HOW instead of WHAT
- Confirming results through a side channel rather than the interface

```typescript
// BAD: sidesteps the interface to verify
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: verifies through the interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

**Tautological tests**: the expected value re-derives the implementation, so the test can only ever pass.

```typescript
// BAD: expected value recomputed with the code's own method
test("calculateTotal sums line items", () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// GOOD: expected value is an independent, known literal
test("calculateTotal sums line items", () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```

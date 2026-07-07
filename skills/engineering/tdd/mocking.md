# When to Mock

Reach for a mock only at **system boundaries**:

- External APIs (payments, email, and the like)
- Databases (occasionally — a real test DB is usually better)
- Time and randomness
- The file system (occasionally)

Leave these unmocked:

- Classes and modules you wrote
- Internal collaborators
- Anything under your own control

## Designing for Mockability

Where you do cross a system boundary, shape the interface so mocking is painless:

**1. Inject dependencies**

Hand external dependencies in rather than constructing them inside:

```typescript
// Easy to mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. Favor SDK-shaped interfaces over one generic fetcher**

Give each external operation its own named function instead of routing everything through a single call with branching inside:

```typescript
// GOOD: every function mocks independently
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: the mock has to branch on its arguments
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

Why the SDK shape wins:

- Each mock returns exactly one shape
- Test setup carries no conditional logic
- The endpoints a test touches are visible at a glance
- Types stay precise per endpoint

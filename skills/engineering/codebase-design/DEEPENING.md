# Deepening

How to safely deepen a cluster of shallow modules given the dependencies they carry. Builds on the vocabulary in [SKILL.md](SKILL.md) — **module**, **interface**, **seam**, **adapter**.

## Dependency categories

Before deepening a candidate, sort its dependencies into one of these categories. The category dictates how you test the deepened module across its seam.

### 1. In-process

Pure computation, in-memory state, no I/O. Always deepenable — fold the modules together and test straight through the new interface. No adapter required.

### 2. Local-substitutable

Dependencies with a local test stand-in (PGLite for Postgres, an in-memory filesystem). Deepenable when the stand-in exists. Test the deepened module with the stand-in running inside the suite. The seam stays internal; no port shows at the module's external interface.

### 3. Remote but owned (Ports & Adapters)

Your own services reached across a network boundary — microservices, internal APIs. Define a **port** (interface) at the seam. The deep module keeps the logic; the transport is injected as an **adapter**. Tests use an in-memory adapter; production uses an HTTP/gRPC/queue adapter.

Shape of the recommendation: *"Put a port at the seam, write an HTTP adapter for production and an in-memory adapter for tests, so the logic stays in one deep module even though it's deployed across a network."*

### 4. True external (Mock)

Third-party services you don't control (Stripe, Twilio, and the like). The deepened module takes the external dependency as an injected port; tests supply a mock adapter.

## Seam discipline

- **One adapter is a hypothetical seam; two adapters make it real.** Introduce a port only when at least two adapters are justified (usually production plus test). A single-adapter seam is just indirection.
- **Internal seams vs external seams.** A deep module may hold internal seams (private to its implementation, used by its own tests) as well as the external seam at its interface. Don't push an internal seam out through the interface merely because tests lean on it.

## Testing strategy: replace, don't layer

- Once tests exist at the deepened module's interface, the old unit tests on the shallow modules are dead weight — delete them.
- Write the new tests at the deepened module's interface. The **interface is the test surface**.
- Assert on outcomes observable through the interface, never on internal state.
- Good tests survive internal refactors — they describe behaviour, not implementation. A test that has to change when the implementation changes is testing past the interface.

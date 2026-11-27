---
name: write-swift
description: Guides modern Swift through Swift 6.3, with value types, Swift 6 data-race safety, the Swift 6.2 concurrency model (main actor by default, @concurrent, actors, task groups), some and any, API design, performance and ARC, Swift Testing, macros and current syntax. Use when writing, reviewing or migrating Swift, or when fixing a concurrency error, a hang, a data race, a retain cycle or a performance problem.
license: MIT
metadata:
  upstream-author: "Emil Kowalski"
  upstream-source: "emilkowalski/skills"
---

# Write Swift

Start with the simplest, most static, most single-threaded code that works. Add concurrency, reference semantics, existentials or unsafe pointers only where you can state the reason. Every rule below applies that one idea.

The baseline is Swift 6.3. Items marked "6.4" need a Swift 6.4 toolchain, so check the project toolchain before you write one. The concurrency rules assume the Swift 6.2 model. On Swift 6.1 or earlier, the rules about `async` and `@concurrent` do not apply.

## Defaults

Use the first column. Move to the right only for the stated reason.

| Need | Default | Move on only when |
| --- | --- | --- |
| Data | `struct` or `enum` | you need identity, sharing or inheritance |
| Abstraction | a concrete type | code repeats across types |
| Polymorphism | `some P` | you need mixed storage, then `any P` |
| Execution | main actor, synchronous | a profile shows a hang: `async`, then `@concurrent`, then `actor` |
| Memory | `Array`, `String` | a profile shows the cost: `InlineArray`, `Span` |
| Safety | safe API | C interop or a measured hot path: `Unsafe*` |

## Data

- Default to `struct` and `enum`. Use `class` for identity, shared mutable state, inheritance or resource lifetime. A window or a database connection has identity. A `Point` does not.
- Write `let`. Change to `var` only when you mutate.
- Model exclusive states as one `enum`, not as several optional properties. Invalid combinations then cannot exist, and a state change is one assignment.
- A struct that stores a mutable class instance has neither value nor reference semantics: copies share the object. Keep the class immutable, or hide it behind copy-on-write.
- Throw for a recoverable error. Use `precondition` or `fatalError` for a programmer mistake.

Read [TYPES-AND-API.md](TYPES-AND-API.md) for copy-on-write, noncopyable types, error design, protocols, `some` against `any`, API naming and macros.

## Concurrency

Agents get this wrong most often, because the model changed in Swift 6.2: **an `async` function runs on the actor of its caller. It does not leave the main thread.**

Take these steps in order, and take the next one only when a profile gives the reason:

1. **Single-threaded on the main actor.** Most apps need nothing more.
2. **`async`/`await`** to wait on the network or the disk. SDK calls such as `URLSession.data(from:)` move the work off the thread for you.
3. **`@concurrent`** on your own expensive function, after Instruments shows a hang.
4. **`actor`** to move state off the main actor, when main actor state forces tasks to hop back all the time.

Set the build first. Enable Approachable Concurrency in every project. For app and UI modules, set Default Actor Isolation to MainActor (in a package: `.defaultIsolation(MainActor.self)`). Do not set it for a general library: a library ships `nonisolated` APIs so the caller decides where work runs.

| Annotation | Where the function runs |
| --- | --- |
| `@concurrent` | Always on the concurrent pool. For your CPU-heavy work. |
| `nonisolated` | Where the caller runs. The default for library APIs. |
| neither | On the actor of the caller |

```swift
nonisolated struct PhotoProcessor {
  @concurrent
  func process(_ data: Data) async -> ProcessedPhoto {
    async let sticker = extractSticker(data)   // two independent jobs in parallel
    async let colors  = extractColors(data)
    return await ProcessedPhoto(sticker: sticker, colors: colors)
  }
}
```

Rules that prevent most bugs:

- Each `await` is a suspension point. State can change across it, so check your assumptions again after it. Do not hold a lock across an `await`.
- An actor gives mutual exclusion, not transactions. Mutate actor state in synchronous methods, and keep async actor methods thin.
- Use structured tasks: `async let` for a fixed count, `withTaskGroup` for a dynamic count. Use `Task { }` only for work that starts from a UI event or callback. Almost never use `Task.detached`.
- Cancellation sets a flag and stops nothing. Check it before expensive work.
- Keep most model classes non-`Sendable` on purpose.

When the compiler reports a data race, try these fixes in order:

1. Stop sharing the object. Give each concurrent job its own instance. This fixes most real errors.
2. Make it a `Sendable` value type, so sharing is copying.
3. Isolate it to an actor: the main actor or your own.
4. Only then use `Mutex` or `Atomic` from `Synchronization`, or `@unchecked Sendable`.

Read [CONCURRENCY.md](CONCURRENCY.md) before you write actors, task groups, cancellation, continuations or `AsyncStream`, when you fix a `Sendable` or isolation error, for concurrency in SwiftUI, and to migrate a codebase to Swift 6.

## Abstraction

- Do not start with a class, and do not start with a protocol. Write concrete types, find the repeated code, then extract a protocol and write generic code against it.
- Write `some P`. Change to `any P` when you store mixed types.
- A method that conformers customize is a protocol requirement. A method that exists only in an extension is statically dispatched, so a conformer shadows it and does not override it.
- Compose small values in place of class inheritance.

## Performance and memory

Do the algorithm work first, then profile with Instruments, then change code. Know the cost of each call: `remove(at:)` in a loop is O(n^2), and `removeAll(where:)` is O(n).

Use `weak` and `unowned` only to break a reference cycle. A better fix is to remove the cycle: move the shared data into a third type, so the graph is a tree.

Read [PERFORMANCE.md](PERFORMANCE.md) when a profile shows a problem, when you tune a hot path, for ARC and object lifetime, and before you write unsafe code or C interop.

## Tests and tools

Write new tests with Swift Testing: `@Test`, `#expect`, `try #require`, and `@Test(arguments:)` in place of a loop. Log with `Logger` from `os`, not `print`.

Read [TESTING-AND-TOOLS.md](TESTING-AND-TOOLS.md) when you write or migrate tests, add logging, or debug tasks in LLDB.

## Current syntax

Agents often write an older, longer form. Read [MODERN-SYNTAX.md](MODERN-SYNTAX.md) before you write a nested ternary, `ObservableObject`, `NotificationCenter` with `userInfo`, `Process` with pipes, string index arithmetic, or `withUnsafeBufferPointer`.

## Quick reference

| Need | Use | Not |
| --- | --- | --- |
| Shared mutable state | `actor`, or a `@MainActor` class | a class with a lock you must remember |
| Work off the main thread | `@concurrent func ... async` | `Task.detached`, `DispatchQueue.global()` |
| Isolation of a library API | `nonisolated` | `@MainActor`, `@concurrent` |
| Fixed number of parallel jobs | `async let` | several unstructured `Task`s |
| Dynamic number of parallel jobs | bounded `withTaskGroup` | one task per element with no limit |
| Children that return nothing | `withDiscardingTaskGroup` | a `withTaskGroup` you never drain |
| Work tied to a UI event | `Task { }` inside the callback | an `async` callback |
| A shared model class | non-`Sendable`, or `@MainActor` | `Sendable` with manual locks |
| A wait across `await` | restructure the code | `DispatchSemaphore`, `NSCondition` |
| Mixed collection | `[any P]` | a class hierarchy |
| Shared behavior with no customization | a constrained `extension` | a new protocol |
| Breaking a reference cycle | restructure to a tree | `weak` plus `withExtendedLifetime` |
| Contiguous memory access | `.span` | `withUnsafeBufferPointer` |
| Fixed-size buffer in a hot path | `InlineArray<N, T>` | `Array` |
| A test that fails for now | `withKnownIssue` | `.disabled`, or a commented-out test |
| Stopping a test on failure | `try #require` | `continueAfterFailure = false` |
| Diagnostics in shipped code | `Logger` with a correlation ID | `print` |
| A decision to optimize | Instruments on a profiled test | intuition |

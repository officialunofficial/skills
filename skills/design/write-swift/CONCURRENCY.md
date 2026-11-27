# Concurrency

The rules assume the Swift 6.2 model, with Approachable Concurrency on.

## Contents

- Before you add concurrency
- Actor reentrancy
- Sendable
- Globals and statics
- Bridging old callback APIs
- Structured concurrency
- Cancellation
- Continuations and AsyncSequence
- SwiftUI
- Migrating to Swift 6

## Before you add concurrency

- Profile first with Instruments (Time Profiler, hangs). If the code can be faster with no concurrency, do that. Concurrency costs task allocation, scheduling and reasoning.
- Do not start a task for trivial work. A child task that reads one `UserDefaults` value costs more than it saves.
- Use one task for one end-to-end operation. Work that must run in order goes in one task. Independent operations get separate tasks.
- After an `await` you can resume on a different thread. Do not rely on thread-local storage across one.
- `nonisolated` on a type makes all its members nonisolated (Swift 6.1 and later).

## Actor reentrancy

Between two `await`s on one actor, other work runs.

- Synchronous code on an actor runs to completion with no interruption. That is your transaction boundary, so put mutations there.
- Build each async actor method from synchronous operations, and leave the actor consistent at every `await`.
- The classic bug: check the cache, `await` a download, write the cache. Two tasks both miss, both download, and the second overwrites the first. Check again after the `await`, or share the in-flight work.
- An actor is not FIFO. It runs the highest priority work first, to avoid priority inversion. For ordered work, use one task or an `AsyncStream`.

## Sendable

`Sendable` marks a type that is safe to share across isolation domains. The compiler checks it at each task boundary and actor boundary.

- A value type is `Sendable` when its storage is. The compiler infers this for non-public types only. On a public type you write `Sendable` yourself, because it is a promise to clients.
- Actors and `@MainActor` classes are `Sendable` implicitly, because their state is isolated.
- Keep most model classes neither `@MainActor` nor `Sendable`. That prevents one half of the model changing on the main thread while the other half changes in the background. If a model class must leave the main actor, make it `nonisolated`.
- You can send a non-`Sendable` object to another domain when the sender stops using it. Make every mutation before the handoff. Use after the handoff is the error.
- Mark a function type `@Sendable` only when it crosses domains.
- `@unchecked Sendable` is a promise the compiler cannot check. Use it only for a type with real internal synchronization, such as a `Mutex`. The same holds for `nonisolated(unsafe)` on a global. Neither is a way to silence a warning.
- Store a `Mutex` or `Atomic` in a `let` property.

## Globals and statics

Global and static variables cause the most errors. Fix one with the first option that fits:

1. Make it a `let`.
2. Put it on `@MainActor`.
3. Wrap it in a `Mutex`.
4. Mark it `nonisolated(unsafe)`.

Swift initializes a global lazily and atomically.

## Bridging old callback APIs

- If you own a delegate protocol, annotate it with `@MainActor`.
- If you do not own it, mark the method `nonisolated` and call `MainActor.assumeIsolated { }`. It asserts and does not hop, so a wrong assumption traps and does not race. `@preconcurrency` on the conformance is the short form.
- `@preconcurrency import` silences sendability warnings from a module that has not migrated. The warnings return when it migrates.

## Structured concurrency

A structured task (`async let`, a task group) has the scope of a local variable. It cannot outlive its block, the block awaits it, and it inherits cancellation, priority and task-local values. An unstructured task gives none of that for free.

| Tool | Use it when |
| --- | --- |
| `async let` | The number of children is fixed and known |
| `withTaskGroup` | The number is dynamic. A group is an `AsyncSequence`, so iterate results as they arrive. |
| `withDiscardingTaskGroup` | Children return nothing. It frees each child at once and cancels the siblings on the first error. |
| `Task { }` | The lifetime fits no scope: a delegate callback, a button tap, a view that appears. It inherits isolation and priority. You manage cancellation. |
| `Task.detached` | Almost never. It inherits no isolation, priority or task-locals. If you need a detached root, put a task group inside it. |

Limit the width. Do not start one child per item of an unbounded list. Start N children, and add one each time one finishes.

`@TaskLocal` values carry context, such as a request ID or a trace span, down the task tree with no extra parameters. Make them optional so an unbound read has a default.

## Cancellation

Cancellation is cooperative.

- Check `Task.isCancelled` or call `try Task.checkCancellation()` before expensive work, in synchronous helpers too.
- For work that is suspended, such as `next()` on an `AsyncSequence`, use `withTaskCancellationHandler`. The handler runs at once and concurrently with the body. Guard the state it touches with an atomic or a lock, not an actor, because an actor cannot guarantee the order.
- 6.4: a `Task` cancellation shield (SE-0504) lets a write finish.

## Continuations and AsyncSequence

- Wrap a callback with `withCheckedContinuation` or `withCheckedThrowingContinuation`. Resume exactly once on every path. No resume hangs the caller for good. Two resumes are a fatal error.
- For a delegate that fires later, store the continuation and set it to `nil` when you resume.
- 6.4: a `Continuation` type checks single resumption at compile time.
- Iterate an `AsyncSequence` with `for await` or `for try await`.
- Adapt a handler or delegate API with `AsyncStream` or `AsyncThrowingStream`. Create the source inside the closure, `yield` from the handler, and clean up in `onTermination`.

## SwiftUI

- `View` is `@MainActor`, and so is everything inside it, including `@State`. You almost never write `@MainActor` on a view or a view model.
- SwiftUI runs some of your closures off the main thread to keep frames cheap. The sign is `@Sendable` in the signature: `visualEffect`, `Shape.path(in:)`, `Layout` requirements, `onGeometryChange`. For an isolation error in one of these, copy the one value you need into the capture list. Do not send `self`.

```swift
.visualEffect { [pulse] effect, proxy in    // copy the Bool, do not capture self
  effect.blur(radius: pulse ? 2 : 0)
}
```

- Action callbacks are synchronous on purpose. A UI update that answers a gesture or scroll event must land on the frame of the event. Put the `withAnimation` state change in the synchronous callback, and open a `Task` only for the long work that follows.
- Put one piece of state between the UI and the async work. The view starts a task, the async layer makes a synchronous mutation when it finishes, and the UI reacts. View logic stays synchronous, and the async logic is testable with no SwiftUI import.

## Migrating to Swift 6

Keep the steps separate and in this order.

1. Enable Approachable Concurrency and, for app modules, main actor by default. Both cut the number of errors.
2. Build with the new compiler in Swift 5 mode. This works as is.
3. For one target, enable complete concurrency checking (Swift 5 mode with all Swift 6 warnings). Start with the UI and app layer, not the frameworks below. The SDK already annotates much of it for the main actor, so fixes go fast.
4. Fix the warnings, cheapest first. Hundreds of warnings come from a few causes: a `var` global that should be `let`, a free function that belongs on `@MainActor`, one public struct that needs `Sendable`. One line can clear dozens.
5. Change the target to the Swift 6 language mode to lock the work in.
6. Repeat for the next target.
7. Refactor afterwards, in separate changes. A large refactor combined with data-race safety forces you to back out both.

You can turn strict checking off again and release. Each fix you made stays valid. Xcode has migration tooling that applies many of the changes (swift.org/migration).

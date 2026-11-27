# Performance, ARC and unsafe code

## Contents

- The four costs
- Algorithms first
- Read the profile
- Levers
- Async and actor hops
- ARC and object lifetime
- Unsafe code and interop

## The four costs

Low-level Swift performance comes from four costs. Find out which one you pay.

1. **Function calls:** argument copies, static or dynamic dispatch, call frames, and optimization the call blocks.
2. **Memory layout:** inline or out-of-line storage, and types with a dynamic size.
3. **Allocation:** global is free, the stack is one subtraction, and the heap needs a search and a lock.
4. **Copies:** retains, releases, and recursive struct copies.

## Algorithms first

The largest gains are almost never micro-optimizations. For each loop, look for a standard algorithm that replaces it.

- `Array.remove(at:)` is O(n), so in a loop it is O(n^2). `removeAll(where:)` is O(n) in total.
- A `Data` that you slice again for each byte is O(n^2). `popFirst()` is O(1). Each of these has caused a slowdown of 100 times or more behind clean code.
- Chained `map`, `flatMap` and `filter` allocate one array per stage. In a hot loop per pixel or per element, size the output once and write into it.

## Read the profile

Profile a test with Instruments: secondary-click the run button of the test and choose Profile. You then measure exactly the code in question. Use Time Profiler and Allocations.

| Dominant symbol or pattern | Meaning |
| --- | --- |
| `platform_memmove` | Accidental copies |
| A million transient allocations | Intermediate arrays |
| `swift_beginAccess` | Exclusivity checks at run time |
| `swift_retain`, `swift_release` | Reference counting traffic |

## Levers

Roughly in order of gain:

- **`final`** on a class you do not subclass makes dispatch static and allows inlining. Whole-module optimization proves this for you in many cases and enables generic specialization, which removes the cost of generics.
- **Struct storage is inline, and class storage is out of line.** A small struct is free. A large struct with three class fields costs three retains per copy, where a class costs one. If you copy it often, use copy-on-write.
- **An `any P` existential has an inline buffer of 3 words.** A value that fits stays inline. A larger one is heap-allocated per copy. Give the large type indirect storage with copy-on-write, and it fits.
- **`[MyModel]` is faster than `[any Model]`.** It is densely packed, passes type information once, and specializes.
- **A class constraint on a generic parameter** (`T: AnyObject`) gives the compiler a known representation even with no specialization.
- **`InlineArray<N, T>`** (6.2) stores a fixed number of elements inline: no heap allocation, no reference counting, no uniqueness or exclusivity checks. It is the wrong choice for a value you copy or share.
- **`Span`, `RawSpan`, `OutputSpan`** (6.2) replace `withUnsafeBufferPointer`. They cannot escape, so the compiler ties their lifetime to the container. You get pointer speed with no lifetime bugs, and the retains and releases go away.
- **Stored properties moved from a nested class into the parent struct** lose their run-time exclusivity checks.
- **After a measurement** (6.3): `@inline(always)`, with `final` on methods, and `@specialized(where T == ...)` (SE-0460) to pre-specialize a generic for hot concrete types.
- **6.4:** `borrow` and `mutate` accessors in place of `get` and `set` for large stored values, `UniqueArray` and `UniqueBox`, and `Ref` and `MutableRef` to move a repeated lookup out of a loop.

## Async and actor hops

- An async function keeps its state on a per-task slab allocator and splits into partial functions at each suspension point. A call costs slightly more than a synchronous one. Do not mark a function `async` when it has nothing to await.
- A hop to or from the main actor is a real context switch. Batch the work: move the loop into `loadArticles` and `updateUI` so they take arrays. Do not hop twice per element.

## ARC and object lifetime

- The guaranteed lifetime of an object ends at its last use, not at the closing brace. The lifetime you observe depends on the optimizer and can change. Code that depends on when `deinit` runs has a latent bug.
- A `weak` reference read after the last use of the strong owner can be `nil`. Optional binding there is worse than a force-unwrap: a loud crash becomes a silent wrong answer.
- Fix a cycle in this order. First, do not build it: move the shared data into a third type that both sides reference. Second, redesign the API so the object is reachable only through a strong reference. Last, `withExtendedLifetime`. It works, but it moves correctness to each call site and spreads through the code.
- Keep `deinit` side effects local. A metric or global effect sent from `deinit` depends on optimizer decisions. Use `defer` at the call site, and keep `deinit` for verification.
- The Xcode build setting Optimize Object Lifetimes shortens observed lifetimes toward the guaranteed minimum and exposes these bugs.

## Unsafe code and interop

- "Unsafe" means the API cannot validate its input, so a broken precondition is undefined behavior. It does not mean a crash. A safe API traps on purpose, and a clean fatal error is the safe result.
- Use `Span` before `Unsafe*Pointer`. Keep raw pointers for C interop.
- If you must use pointers: keep the unsafe region small, use buffer pointers (address and count) so bounds are tracked, never let a pointer escape the closure that provides it, and run the Address Sanitizer.
- Enable strict memory safety in security-critical modules. Each unsafe use must then be acknowledged in source, which makes an audit possible. 6.4: `@diagnose` enables it per function.
- Interop works in both directions and step by step. C, Objective-C and C++ types map into Swift, including C++ value semantics, containers as Swift collections, and move-only types as `~Copyable`. The `@c` attribute (6.3) exposes a Swift function to C. Add `@implementation` when a header already declares it. Adopt Swift one file at a time, and do not rewrite.

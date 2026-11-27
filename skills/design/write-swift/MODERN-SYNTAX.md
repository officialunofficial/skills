# Current syntax

Write the form in the second column. The third column is the Swift version that ships it. Check the project toolchain before you use a 6.4 row, and use the older form on 6.3 or earlier.

| In place of | Write | Since |
| --- | --- | --- |
| A nested ternary, or a closure called at once to set a `let` | `if` and `switch` expressions | 5.9 |
| Overloads for 1, 2, 3 arguments | Parameter packs (`each T`), and `for` over a pack | 5.9 |
| `ObservableObject` with `@Published` on each property | `@Observable` | 5.9 |
| Polling an object for changes | `Observations { ... }`, an `AsyncSequence` of transactional updates | 6.2 |
| `NotificationCenter` with a `userInfo` dictionary | Concrete notification types (`MainActorMessage`, `AsyncMessage`) | 6.2 |
| `Process` with pipes | The Subprocess package. `AsyncBufferSequence.strings()` reads line by line. | 6.2 |
| String index arithmetic | Swift Regex: literals for short patterns, `RegexBuilder` for structure | 5.7 |
| A fixed-size array in a hot path | `InlineArray<N, T>` | 6.2 |
| `withUnsafeBufferPointer` | `.span`, `.bytes` (`RawSpan`), `OutputSpan` | 6.2 |
| Binary parsing with pointers | Swift Binary Parsing (`ParserSpan`, initializers that check overflow) | 6.2 |
| Awkward test function names | Raw identifiers: `` @Test func `fruits have a tropical climate`() `` | 6.0 |
| `Rocket.SaturnV` when a type shadows a module | Module selector: `Rocket::SaturnV` | 6.3 |
| `Task.isCancelled` checks to finish a write | `Task` cancellation shield (SE-0504) | 6.4 |
| A dictionary rebuilt by hand to use the key | `mapKeyedValues` | 6.4 |
| `@available(iOS ..., macOS ..., tvOS ..., ...)` | `@available(anyAppleOS ...)` | 6.4 |
| Warnings as errors for the whole module | `@diagnose` per declaration or warning group | 6.4 |
| `@unchecked Sendable` because of a `weak var` | `weak let`, or `~Sendable` to state that a type is not sendable | 6.4 |

## Regex notes

- Regex components compose with the Foundation parsers: `.date(...)`, `.currency(...)`. Do not write date or number parsing by hand inside a regex.
- Pass the locale explicitly. Do not inherit the system locale.
- Use `NegativeLookahead` or `Local` (an atomic group) to stop a pattern from backtracking across the whole input.

# Testing, logging and debugging

## Swift Testing

Use Swift Testing for new tests. XCTest is still required for three cases: UI automation (`XCUIApplication`), performance metrics (`XCTMetric`), and tests written in Objective-C or tests that catch Objective-C exceptions.

- **`@Test`** goes on any function: global, static or instance. `async`, `throws` and global actor isolation all work.
- **`#expect(...)`** takes an ordinary expression: `#expect(a == b)`, `#expect(list.isEmpty)`. On failure it shows the values of the subexpressions.
- **`try #require(...)`** stops the test on failure and unwraps an optional. You choose per expectation.
- **A suite is a `struct`.** Each test function gets a fresh instance, so state cannot leak. Set up in `init`. Use a `class` or `actor` only when you need `deinit` for teardown. Nest suites to group them.
- **Parameterize.** `@Test(arguments: [...])` runs each case on its own, in parallel, and names the failing argument. You can rerun one case. Two argument collections give the full cross product. Use `zip()` for matched pairs.
- **Traits state intent:** `.enabled(if:)` and `.disabled("reason")` for conditions, `.bug(url)` for tracking, `.tags(...)` to relate tests across files, `.timeLimit`, and `.serialized` for a test that cannot run in parallel. Use `@available`, not a run-time `#available` check, so the library knows.
- **Do not comment a test out.** A disabled test still compiles.
- **`withKnownIssue { }`** wraps a failure outside your control. The test still compiles and runs, and it tells you when the issue is fixed.
- **`confirmation`** covers a callback that fires N times. `withCheckedContinuation` covers a single callback with no async overload.
- **Tests run in parallel and in random order.** That exposes hidden dependencies between tests. Remove the dependency before you add `.serialized`.
- **Exit tests:** `#expect(processExitsWith: .failure) { ... }` covers a `precondition` or `fatalError` path in a child process. macOS, Linux, FreeBSD and Windows only.

### Migrating from XCTest

Both frameworks work in one target, so migrate step by step and write new tests in Swift Testing. Test framework interoperability (swift-testing ST-0021, check your Xcode version) lets a helper that wraps `XCTFail` run from a Swift Testing test, and the reverse. Set the mode to complete or strict, not limited or none. Cross-framework issues then stay errors and point to the `Issue.record` replacement.

## Logging

- Use `Logger` from `os`, one per subsystem and category. The system stores messages in a compact form and renders them only for display, so logging is cheap enough to keep in shipped code.
- Interpolated values that are not numbers are redacted by default. Add `privacy: .public` only for data that is not personal. Use `.private(mask: .hash)` to correlate values and not expose them.
- The level sets persistence and cost: `debug` (never stored, and free when nobody streams), `info`, `notice` (the default), `error`, `fault` (stored longest, slowest). Log at `error` or `fault` what a bug report needs.
- Log a correlation ID, such as a task or request UUID. You can then filter the history of one failure from a device log archive with no reproduction: `log collect --device --start ...`, then filter by subsystem in Console.
- `format:` and `align:` are free. Use them for readable columns.

## Debugging

LLDB understands tasks. It steps through an `await` across threads, and `swift task info` shows the priority and the children. A named task appears in the debugger and in the Swift Concurrency template of Instruments.

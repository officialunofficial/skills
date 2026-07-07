# Logic Prototype

A tiny interactive terminal app that lets the user drive a state model by hand. Reach for this when the question is about **business logic, state transitions, or data shape** — the sort of thing that reads fine on paper but only feels wrong once real cases run through it.

## When this is the right shape

- "I'm not sure this state machine handles X happening then Y."
- "Does this data model actually let me represent the case where…"
- "I want to feel out the API surface before I commit to writing it."
- Anything where the user wants to **press keys and watch state move**.

If the question is "what should this look like" — wrong branch. Use [UI.md](UI.md).

## Process

### 1. State the question

Before any code, write down the state model and the question you're testing. One paragraph, in the prototype's README or a comment at the top of the file. A logic prototype aimed at the wrong question is pure waste — spell the question out so it can be checked later, whether the user is watching now or coming back to it AFK.

### 2. Pick the language

Use whatever the host project uses. If the project has no obvious runtime (say, a docs repo), ask.

Follow the project's existing tooling conventions — don't drag in a new package manager or runtime just for the prototype.

### 3. Isolate the logic in a portable module

Put the logic that's answering the question — and only that — behind a small, pure interface that could later be lifted out and dropped into the real codebase. The TUI wrapped around it is disposable; the logic module is not.

The right shape follows from the question:

- **A pure reducer** — `(state, action) => state`. Good when actions are discrete events and state is a single value.
- **A state machine** — explicit states and transitions. Good when "which actions are even legal right now" is part of the question.
- **A small set of pure functions** over a plain data type. Good when there's no implicit current state — just transformations.
- **A class or module with a clear method surface** when the logic genuinely owns ongoing internal state.

Choose the shape that fits the question, *not* the one that's easiest to bolt onto a TUI. Keep it pure: no I/O, no terminal code, no `console.log` driving control flow. The TUI imports it and calls in; nothing flows back the other way.

This purity is what lets the prototype outlive itself. Once the question is answered, the confirmed reducer / machine / function set lifts straight into the real module — and the TUI shell gets deleted.

### 4. Build the smallest TUI that surfaces the state

Build a **lightweight TUI** — on each tick, clear the screen (`console.clear()` / `print("\033[2J\033[H")` / equivalent) and redraw the whole frame. The user should always see one stable view, never an ever-growing scrollback.

Every frame has two parts, in this order:

1. **Current state**, pretty-printed and diff-friendly (one field per line, or indented JSON). Use **bold** for field names or section headers and **dim** for lower-value context (timestamps, IDs, derived values). Raw ANSI escapes are fine — `\x1b[1m` bold, `\x1b[2m` dim, `\x1b[0m` reset. No need for a styling library unless the project already has one.
2. **Keyboard shortcuts** along the bottom: `[a] add user  [d] delete user  [t] tick clock  [q] quit`. Bold the key and dim the label, or the reverse — whichever reads cleanly.

Behaviour:

1. **Initialise state** — one in-memory object/struct. Draw the first frame on launch.
2. **Read one keystroke (or line)** at a time and dispatch to a handler that mutates state.
3. **Redraw** the full frame after every action — replace, don't append.
4. **Loop until quit.**

The whole frame should fit on one screen.

### 5. Make it runnable in one command

Add a script to the project's existing task runner (`package.json` scripts, `Makefile`, `justfile`, `pyproject.toml`). The user should run `pnpm run <prototype-name>` or equivalent — never recall a path.

If the host project has no task runner, put the command at the top of the prototype's README.

### 6. Hand it over

Give the user the run command. They'll drive it themselves, and the payoff moments are when they say "wait, that shouldn't be possible" or "huh, I expected X to differ" — those are bugs in the _idea_, which is the entire point. If they want new actions, add them. Prototypes evolve.

### 7. Capture the answer

When the prototype has done its job, the answer to the question is the only keeper. If the user is around, ask what they took from it. If not, leave a `NOTES.md` beside the prototype so the answer can be recorded (by them, or by you if you watched the session) before the prototype is deleted.

## Anti-patterns

- **No tests.** A prototype that needs tests has stopped being a prototype.
- **No real database.** Use an in-memory store unless the question is specifically about persistence.
- **No generalising.** Skip "what if we later want X." The prototype answers one question.
- **No blurring the logic into the TUI.** The moment the reducer / state machine touches `console.log`, prompts, or escape codes, it's no longer portable. Keep the TUI a thin shell over a pure module.
- **No shipping the TUI shell.** The shell exists to be driven by hand from a terminal. The logic module behind it is the part worth keeping.

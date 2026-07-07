---
name: to-fuzz
description: Distill a fuzzing plan out of the current conversation and codebase — the targets worth fuzzing, each with its entry point, input model, and failure oracle — and write it to an in-repo doc. Use when the user wants to fuzz-test something, harden a parser or decoder against untrusted input, find crashes/panics/UB, turn invariants into fuzz targets, or plan a fuzzing campaign.
argument-hint: "[output-path]  (default: docs/FUZZING.md)"
---

Take the current conversation and codebase understanding and produce a **fuzzing plan**: the set of targets worth fuzzing, each pinned to a concrete failure **oracle**. Do NOT interview the user — synthesize what you already know. Then write the plan and, when the harness is obvious, scaffold the target stubs.

A fuzz target is three things: an **entry point** (the function under test), an **input model** (how bytes become that function's arguments), and an **oracle** (the check that decides a run *failed*). The oracle is the whole game — a fuzzer that only catches segfaults wastes most of its runs. If `/to-invariants` has already produced `docs/INVARIANTS.md`, mine it: every enforceable invariant is a ready-made oracle.

## Process

### 1. Map the attack surface

Find the code that turns untrusted or complex input into internal state — that's where fuzzing pays. Sweep for:

- **Parsers / deserializers / decoders** — anything named `parse`, `decode`, `from_bytes`, `read_*`, or that takes `&[u8]`/`string` from outside. Highest ROI; fuzz these first.
- **State machines** — sequences of operations where the *order* can violate an invariant (a fuzzer drives random valid-ish op sequences).
- **Encoders paired with decoders** — candidates for a round-trip oracle.
- **Arithmetic / indexing / allocation sized by input** — overflow, panic, quadratic blowup, OOM.
- **Trust boundaries** — any input crossing a network, file, or IPC edge.

### 2. Choose an oracle per target

Pick the strongest oracle you can compute cheaply. In rough order of value:

- **Differential** — run two implementations that must agree (a reference vs the optimized one; the old version vs the new; a spec model vs the code) and assert equal outputs. Catches *wrong* answers, not just crashes.
- **Round-trip / inverse** — `decode(encode(x)) == x`, `parse(print(x)) == x`. Cheap, total, catches whole classes of corruption.
- **Invariant** — assert a property from `docs/INVARIANTS.md` holds on the output/state. Reuse it directly.
- **Crash / assertion** — panics, `unwrap`, UB, failed `assert`, memory errors under a sanitizer. The default floor; combine with one of the above rather than relying on it alone.
- **Resource** — a wall-clock/allocation ceiling to catch algorithmic-complexity blowups.

A target with only a crash oracle is weak — say so and note the stronger oracle it *could* have.

### 3. Define the input model

- **Structured** (preferred where the input is typed): derive/implement an `Arbitrary`-style generator so the fuzzer explores valid-shaped inputs and spends fewer runs on the parser rejecting garbage.
- **Raw bytes**: for parsers whose whole job is to survive arbitrary bytes — feed the raw buffer.
- **Seed corpus**: list concrete starting inputs — a minimal valid case, a known tricky case, a past regression. Seeds are the single biggest lever on how fast a fuzzer finds bugs.
- Note a **dictionary** (format keywords/magic bytes) when the format has them.

### 4. Pick the harness

Match the stack (see [HARNESSES.md](HARNESSES.md) for scaffolding per tool): cargo-fuzz/libFuzzer or `Arbitrary` + `proptest` (Rust), native `go test` fuzzing (Go), Jazzer (JVM), Atheris (Python), libFuzzer/AFL++ (C/C++), fast-check or jsverify (JS/TS). If the project already fuzzes with one, use it.

### 5. Write the plan

Write to `{{ARGUMENTS}}` or `docs/FUZZING.md`. Use the template. When the harness is unambiguous, also scaffold each target's stub file (entry point + input model wired up, oracle as a TODO or filled if trivial) and say where you put them.

### 6. Report

List the targets, which oracle each got, and the **surface you chose not to fuzz** with the reason. Offer to run the campaign or wire it into CI (don't unless asked).

<fuzzing-plan-template>

# Fuzzing plan

> Targets worth fuzzing, each with an entry point, an input model, and an oracle.
> Scope: <the module/crate/service these cover>

## Targets

### FUZZ-1: <entry point — the function under test>

- **Oracle:** <differential / round-trip / invariant INV-N / crash / resource> — <the exact assertion that means "failed">
- **Input model:** <structured generator, or raw bytes> — <key bounds/shape>
- **Seeds:** <minimal case; tricky case; past regression>
- **Harness:** <tool + where the target file lives>

## Not fuzzed (and why)

- <surface> — <pure/total/no untrusted input/covered by property tests instead>

## Notes

- <dictionaries, sanitizers to enable (ASan/UBSan), corpus location, time budget>

</fuzzing-plan-template>

## What makes a good fuzz target

- **Strong, total oracle.** It can judge *every* run, and it catches wrong answers, not only crashes. If the only thing that can fail is a segfault, the target is under-powered.
- **Narrow entry point, close to the untrusted input.** Fuzz the parser directly, not the whole app around it — shorter path from bytes to bug, faster iterations.
- **Deterministic.** Same input → same result. No clocks, threads, or network in the loop, or the fuzzer chases ghosts and can't minimize.
- **Seeded.** Ships with a corpus that already reaches interesting states.

<examples>
<good>
FUZZ: decode() on arbitrary bytes; oracle = round-trip encode(decode(x)) re-encodes to the same canonical bytes, AND no panic.
Narrow entry point, total oracle that catches corruption (not just crashes), raw-byte input model — ideal.
</good>
<bad>
FUZZ: run the whole request handler on random bytes; oracle = "doesn't crash".
Entry point too wide (most runs die in the HTTP layer before reaching logic), oracle too weak (silent wrong answers pass). Narrow to the body parser; add a differential or invariant oracle.
</bad>
</examples>

Task: distill the fuzzing plan from the current context and write it to the doc. {{ARGUMENTS}}

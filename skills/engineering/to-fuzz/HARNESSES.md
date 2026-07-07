# Fuzzing harnesses — scaffolding per stack

Reference for [`to-fuzz`](SKILL.md). Pick the tool that matches the project; if the repo already
fuzzes with one, use that. Each target follows the same shape: decode the fuzzer's bytes into the
entry point's input, then assert the oracle.

## Rust — cargo-fuzz (libFuzzer)

`cargo install cargo-fuzz`, then `cargo fuzz add <name>` creates `fuzz/fuzz_targets/<name>.rs`.

```rust
#![no_main]
use libfuzzer_sys::fuzz_target;
use arbitrary::Arbitrary;           // structured input; or take &[u8] directly

fuzz_target!(|input: MyInput| {     // MyInput: derive(Arbitrary) for a structured model
    // round-trip oracle
    if let Ok(decoded) = my_crate::decode(&input.bytes) {
        let re = my_crate::encode(&decoded);
        assert_eq!(re, my_crate::canonicalize(&input.bytes));
    }
    // crash oracle is implicit: any panic/UB fails the run
});
```

Run: `cargo fuzz run <name>`. Seed corpus goes in `fuzz/corpus/<name>/`. Enable ASan/UBSan via the
default `cargo fuzz` sanitizer flags. For pure-logic properties without libFuzzer, `proptest` or
`quickcheck` cover the structured-input case in ordinary tests.

## Go — native testing fuzzing

In `*_test.go`:

```go
func FuzzDecode(f *testing.F) {
    f.Add([]byte("<seed>"))                 // seed corpus
    f.Fuzz(func(t *testing.T, data []byte) {
        v, err := Decode(data)
        if err != nil { return }            // reject-invalid is fine
        if !bytes.Equal(Encode(v), Canonical(data)) {
            t.Fatalf("round-trip mismatch")  // oracle
        }
    })
}
```

Run: `go test -fuzz=FuzzDecode`. Crashers are saved under `testdata/fuzz/`.

## JVM — Jazzer

```java
import com.code_intelligence.jazzer.api.FuzzedDataProvider;

public class DecodeFuzzer {
  public static void fuzzerTestOneInput(FuzzedDataProvider data) {
    byte[] bytes = data.consumeRemainingAsBytes();
    try {
      var v = Decoder.decode(bytes);
      assert Arrays.equals(Encoder.encode(v), Canonical.of(bytes));  // oracle
    } catch (DecodeException ignored) { /* reject-invalid */ }
  }
}
```

## Python — Atheris

```python
import atheris, sys
with atheris.instrument_imports():
    import my_module

def one(data):
    try:
        v = my_module.decode(data)
    except my_module.DecodeError:
        return
    assert my_module.encode(v) == my_module.canonical(data)  # oracle

atheris.Setup(sys.argv, one); atheris.Fuzz()
```

For property-style fuzzing without native instrumentation, `hypothesis` covers structured inputs.

## C / C++ — libFuzzer or AFL++

```c
int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    obj_t *v = decode(data, size);
    if (!v) return 0;                    // reject-invalid
    /* round-trip / invariant oracle here */
    free_obj(v);
    return 0;                            // crash/ASan/UBSan is the implicit oracle
}
```

Build with `-fsanitize=fuzzer,address,undefined`. AFL++ wraps the same entry point.

## JavaScript / TypeScript — fast-check (property-based)

```ts
import fc from "fast-check";
test("decode round-trips", () => {
  fc.assert(fc.property(fc.uint8Array(), (bytes) => {
    let v; try { v = decode(bytes); } catch { return; }   // reject-invalid
    expect(encode(v)).toEqual(canonical(bytes));           // oracle
  }));
});
```

## Cross-cutting

- **Seeds beat cleverness.** A handful of real inputs in the corpus finds bugs faster than any
  generator tuning.
- **Turn on the differential oracle whenever a second implementation exists** — reference vs
  optimized, previous release vs current. It's the only oracle that catches silently-wrong output.
- **Minimize and commit crashers** as regression seeds so a fixed bug stays fixed.

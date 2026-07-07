# Technical writing — reference

The detailed mechanics behind [`technical-writing`](SKILL.md). Consult a section
when the specific question comes up; the SKILL.md holds the rules you apply on
every write.

## Punctuation

- **Double quotes in prose.** Set the field named "name", not 'name'.
- **Oxford commas** in running prose. In a heading you may drop it for brevity.
  If a sentence drowns in commas, split it, or swap a comma for an em dash or
  colon &mdash; don't drop the Oxford comma to fix it.
- **Possessives.** Singular noun takes apostrophe-s regardless of the final
  consonant ("the class's fields"). Plural ending in s takes just the apostrophe
  ("the callers' keys"). Pronoun possessives take no apostrophe (its, yours,
  theirs); indefinite pronouns do (one's own).
- **No space around a slash.** "working-tree/index state", not "working-tree /
  index state".
- **Splitting clauses.** Prefer two sentences. To keep one structure, join with an
  em dash or a connecting word, never a comma between two independent clauses.

## Capitalization and naming

- **Sentence case** for headings, labels, buttons, and table headers. Title case
  only for real proper nouns.
- **Follow external product casing** exactly as the vendor does: BLAKE3, Ed25519,
  secp256k1, P-256, SHA-256, in-toto, DSSE, SLSA, GitHub, GitLab, S3, MinIO,
  Linux, macOS, Windows, Rust, Cargo, Clippy, rustdoc, WebAssembly, PKCS#11.
- **Don't capitalize for emphasis.** The exception is a canonical product phrase
  ("in-toto v1 Statement", "DSSE envelope").
- **Order platforms alphabetically** when listing: "Linux, macOS, and Windows".

## Abbreviations

- Expand an abbreviation in parentheses on first use per page: "Distinguished
  Encoding Rules (DER)".
- Common ones need no expansion: HTML, HTTP, HTTPS, URL, SSH, JSON, CBOR, TLS,
  mTLS, CI, CLI, API, RPC, OS, npm, JPEG, PNG, CSV.
- **Avoid Latin abbreviations.** Write "that is" and "for example", not "i.e." and
  "e.g.".
- Prefer "URL" over "URI" everywhere unless you have a specific reason.

## Numbers, bytes, and bits

- **Capital B for bytes, lowercase b for bits.** Insert a space between number and
  unit ("10 MiB").
- Powers of two (buffers, chunk sizes): binary units &mdash; kiB, MiB, GiB, TiB
  (and kibit, Mibit for bits).
- Powers of ten (disk capacity, transfer rates): decimal units &mdash; kB, MB, GB,
  TB (and kbit, Mbit). Be explicit that "kB" means 1,000 bytes when it matters.
- A bare "kilobyte" is ambiguous (1,000 vs 1,024). Name the unit instead.

## Links and accessibility

- Link the descriptive noun phrase; the text names the destination and acts as a
  call to action. Never link the word "here".
- Use relative links between files in one repo. Link a term to its canonical
  definition on first use.
- **Alt text describes what an image conveys, not how it looks.** "Hash throughput
  chart" is useful; "blue and orange bar chart" is not.
  `![Hash throughput at 1 MiB chunk size](charts/hashing-1_mib.svg)`

## Keyboard shortcuts

Render each key in its own `<kbd>` tag, plus sign outside the tags, space around
the plus.

- macOS: the ⌘ symbol prefixed `Cmd`.
- Windows and Linux: spelled-out modifiers (`Ctrl`, `Alt`, `Shift`).
- Capitalize the letter: <kbd>Ctrl</kbd> + <kbd>T</kbd>.

## Terminal transcripts and code blocks

- Fence terminal sessions and label the language `sh` or `console`. Prefix
  interactive commands with `$ `.
- Prefer a transcript over a screenshot for a CLI tool; it's copyable and
  diffable. Reach for a diagram when the topic is a structure (an object graph, a
  handshake) that prose describes slowly.

## Words and workflows to avoid

- Strike **please**, **sorry**, **unfortunately**, **simply**, **easy**. The last
  two blame the reader for any difficulty.
- Avoid terminology for removed or renamed workflows. Use the current name; link
  the CHANGELOG only while a deprecation window is open.
- Put instructions that edit files outside the tool-managed area inside a
  collapsible block labeled "Manual setup" or "Advanced".
- When a collapsible holds a single paragraph, don't wrap it in a bullet.

## Code and API documentation

These conventions are written with Rust's rustdoc in mind; the principles carry to
any doc-comment system.

- **Third-person declarative, not imperative.** "Hashes the given bytes and writes
  the object", not "Hash the given bytes and write the object".
- **Document the iceberg below the signature.** The parameters and return type are
  readable from the signature; spend the prose on failure modes, side effects,
  preconditions, and concurrency safety.
- **Prefer first-class doc sections** over ad-hoc headings:
  - `# Errors` &mdash; required on any function returning a `Result`; describe the
    variants and what triggers them.
  - `# Panics` &mdash; required on anything that can panic; state the precondition
    the caller must uphold.
  - `# Safety` &mdash; required on every `unsafe fn`; state the invariants the
    caller must maintain.
  - `# Examples` &mdash; a self-contained, runnable block; a doctest that CI runs
    beats an example that can rot.
- **Teach in field and parameter docs, or leave them off.** If you'd only restate
  the name, rely on the name and type. Quality over coverage.
- **Prefer intra-doc links** (`` [`Type`] ``) over raw URLs; they survive renames
  and the doc builder validates them.
- **Deprecate with the attribute**, not prose: `#[deprecated(since = "...", note =
  "...")]` surfaces in tooling and compiler warnings.
- End a single-phrase description without a period; use periods once it's more
  than one sentence.

## Precision on terms that trip authors

- **Concurrency vs parallelism.** Concurrent tasks logically overlap; parallel
  tasks physically run at once. You can have concurrency without parallelism (two
  async tasks on one thread).
- **Hash / digest / key / signature.** Name the hash function (BLAKE3, SHA-256);
  the digest is its output over an input. "Signing key" is the private half,
  "verifying key" the public half. A verification returns a
  `Result<(), VerifyError>`, not a bool, so the caller can tell "invalid" from
  "could not verify".
- **Show real-looking examples.** For a hash, use a plausible 64-hex digest, not
  `xxxxxxxx`.

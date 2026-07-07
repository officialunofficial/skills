---
name: mkit-attest
description: >
  Produce and verify mkit attestations — in-toto v1 Statements wrapped in DSSE
  envelopes, attached to a signed commit. Use when attaching provenance, review,
  or SBOM claims to a commit, verifying attestations against a trust-roots
  registry, setting up co-signers, or wiring attestation into CI. Assumes a
  `.mkit/` repo; for general mkit CLI use see the `mkit` skill.
---

# mkit-attest

An mkit **attestation** is an in-toto v1 Statement (a typed predicate about a
subject) sealed in a **DSSE** envelope and attached to a commit. Downstream
consumers verify it against a **trust-roots registry** — the set of public keys
they're willing to trust. The subject is always a commit (its BLAKE3 id); the
predicate is your claim (provenance, code review, SBOM, test results, …).

The chain is: **signed commit → one or more DSSE attestations → verify against
trust roots**. A commit must already be signed (`mkit keygen` first); attestation
adds claims *on top* of the commit signature.

## Attestation signer keys

Attestation signers are **separate** from the Ed25519 commit key and are written
by `keygen --algorithm`:

```sh
mkit keygen --algorithm ed25519      # → .mkit/keys/ed25519.key
mkit keygen --algorithm p256         # → .mkit/keys/p256.key
mkit keygen --algorithm secp256k1    # → .mkit/keys/secp256k1.key
```

> These do **not** create a commit key. If `commit` then reports "no signing
> key", run plain `mkit keygen` for the Ed25519 commit key. Keep the two roles
> distinct in your head: one key signs the commit, another signs the attestation.

## Produce an attestation

```sh
# Attest HEAD (or --commit <hash>) with a predicate document:
mkit attest --algorithm ed25519 \
            --predicate-type https://example.com/review/v1 \
            --predicate-file review.json

# Multiple co-signers — all-or-nothing (any signer failure aborts; no partial
# envelope is written). Multi-signer is shell-only:
mkit attest --algorithm ed25519 \
            --additional-signer "algorithm=p256,signer=repo-key" \
            --predicate-type https://example.com/provenance/v1 \
            --predicate-file provenance.json
```

The predicate file is your claim as JSON; `--predicate-type` is the URI that
tells a verifier how to interpret it. Omit both to attest the bare subject.

## Verify attestations

```sh
mkit verify-attest --commit <hash> \
                   --trust-roots ~/.config/mkit/trust-roots.toml
```

**Security gate — always pass `--trust-roots` explicitly.** `verify-attest`
refuses an *in-repo* trust-roots file, because a hostile clone could ship its own
roots and make verification falsely print "ok". The default path is
`$XDG_CONFIG_HOME/mkit/trust-roots.toml`. Exit codes:

| Exit | Meaning |
|------|---------|
| `0`  | every attestation has ≥1 verified signature |
| `65` | at least one attestation failed verification |
| `1`  | the commit carries no attestations |

Branch on these codes, not on stderr text — `1` (nothing to verify) is a
different decision from `65` (present but invalid).

## Prefer MCP when available

Through the mkit MCP server (`mkit mcp --repository <path>`), `mkit_attest` and
`mkit_verify_attest` are stricter and safer than the shell — use them for
single-signer flows:

- The `attest` predicate file **must resolve inside** the repo.
- The `verify_attest` trust-roots path **must resolve outside** it (in-repo roots
  always rejected — the hostile-clone defense).
- Signing is pinned to ed25519 with the repo key; ambient `attest.*` config never
  steers it.

Multi-signer and external-signer attestation (`--additional-signer`,
`--signer external`) are **shell-only** — the MCP tool is single-signer by design.

## In CI

- Generate or provision the attestation signer out of band; never commit private
  keys. In an agent/CI context, pass the predicate via `--predicate-file` (no
  interactive paths).
- Verify with a trust-roots file that lives **outside** the checked-out repo
  (e.g. a runner-level config path), so a malicious PR can't smuggle its own
  roots into the verification.
- Gate the pipeline on the exit code: treat `65` as failure, and decide
  deliberately whether `1` (no attestations) should block or pass.

For the wire format and predicate details, see `docs/specs/SPEC-ATTESTATIONS.md`
and `docs/specs/SPEC-SIGNING.md` (or `get_spec ATTESTATIONS` / `SIGNING` via the
mkit docs MCP).

---
name: kit-attest
description: >
  Produce and verify kit attestations — in-toto v1 Statements wrapped in DSSE
  envelopes, attached to a signed commit. Use when attaching provenance, review,
  or SBOM claims to a commit, verifying attestations against a trust-roots
  registry, setting up co-signers, or wiring attestation into CI. Assumes a
  `.kit/` repo; for general kit CLI use see the `kit` skill.
---

# kit-attest

A kit **attestation** is an in-toto v1 Statement (a typed predicate about a
subject) sealed in a **DSSE** envelope and attached to a commit. Downstream
consumers verify it against a **trust-roots registry** — the set of public keys
they're willing to trust. The subject is always a commit (its BLAKE3 id); the
predicate is your claim (provenance, code review, SBOM, test results, …).

The chain is: **signed commit → one or more DSSE attestations → verify against
trust roots**. A commit must already be signed (`kit keygen` first); attestation
adds claims *on top* of the commit signature.

## Attestation signer keys

An `ed25519` attestation signs with the Ed25519 commit key. `p256` and `secp256k1`
signers are **separate** keys, written by `keygen --algorithm`:

```sh
kit keygen                          # → .kit/keys/default.key (the commit key, also the ed25519 signer)
kit keygen --algorithm p256         # → .kit/keys/p256.key
kit keygen --algorithm secp256k1    # → .kit/keys/secp256k1.key
```

> The `p256` and `secp256k1` commands do **not** create a commit key. If `commit`
> then reports "no signing key", run plain `kit keygen` for the Ed25519 commit key.
> Keep the roles distinct in your head: one key signs the commit, and the
> attestation can use that key or another.

## Produce an attestation

```sh
# Attest HEAD (or --commit <hash>) with a predicate document:
kit attest --algorithm ed25519 \
           --predicate-type https://example.com/review/v1 \
           --predicate-file review.json

# Multiple co-signers — all-or-nothing (any signer failure aborts; no partial
# envelope is written). Multi-signer is shell-only:
kit attest --algorithm ed25519 \
           --additional-signer "algorithm=p256,signer=repo-key" \
           --predicate-type https://example.com/provenance/v1 \
           --predicate-file provenance.json
```

The predicate file is your claim as a JCS-canonical (RFC 8785) JSON object. kit
checks that it is a UTF-8 JSON object, then passes the bytes through without
canonicalizing them. `--predicate-type` is the URI that tells a verifier how to
interpret it. Omit both to attest the bare subject.

## Verify attestations

```sh
kit keygen --print-pubkey           # prints ed25519:<hex>
kit trust add ed25519:<hex> <hex>   # adds the key to your user-level trust roots

kit verify-attest --commit <hash> \
                  --trust-roots ~/.config/kit/trust-roots.toml
```

**Security gate — keep trust roots outside the repo.** The default path is
`$XDG_CONFIG_HOME/kit/trust-roots.toml`. `verify-attest` refuses an *in-repo*
trust-roots file unless you pass `--trust-roots` explicitly, because a hostile
clone could ship its own roots and make verification falsely print "ok". An
explicit `--trust-roots` passes that gate, so never point it at a file from the
checkout. Exit codes:

| Exit | Meaning |
|------|---------|
| `0`  | every attestation has ≥1 verified signature |
| `65` | at least one attestation failed verification |
| `1`  | the commit carries no attestations |
| `78` | refused an in-repo trust-roots path (no explicit `--trust-roots`) |

Branch on these codes, not on stderr text — `1` (nothing to verify) is a
different decision from `65` (present but invalid).

## Prefer MCP when available

Through the kit MCP server (`kit mcp --repository <path>`), `kit_attest` and
`kit_verify_attest` are stricter and safer than the shell — use them for
single-signer flows:

- The `kit_attest` predicate file **must resolve inside** the repo.
- The `kit_verify_attest` trust-roots path **must resolve outside** it (in-repo
  roots always rejected — the hostile-clone defense).
- `kit_attest` always passes `algorithm` (`ed25519` by default, or `p256` /
  `secp256k1`) and `signer` (`repo-key` by default, or `keystore`) explicitly, so
  ambient `attest.*` config never steers it.

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
and `docs/specs/SPEC-SIGNING.md`.

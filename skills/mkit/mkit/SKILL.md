---
name: mkit
description: >
  Drive the `mkit` CLI — a content-addressed version control tool with BLAKE3
  object IDs, Ed25519-signed commits, and native in-toto/DSSE attestation. Use
  when working in a `.mkit/` repository, making signed commits, managing signing
  keys, inspecting content-addressed objects, or syncing over
  mkit+ssh/https/s3/file transports. mkit mirrors git's CLI/UX, so git reflexes
  apply — this skill covers only the parts that are *not* git.
---

# mkit

`mkit` is a git-like CLI that produces **signed, content-addressed** objects.
Every commit is Ed25519-signed and named by its BLAKE3 hash, so an object chain
is self-verifying wherever it's stored, and any commit can carry **attestations**
(in-toto v1 Statements in DSSE envelopes). If you know git, drive
`add`/`commit`/`log`/`branch`/`merge`/`rebase`/`diff`/`status` by reflex and
spend your attention on the four differences and the differentiator commands.
For the attestation workflow specifically, reach for [`/mkit-attest`](../mkit-attest/SKILL.md).

## Setup

```sh
cargo install mkit-cli        # install mkit-cli, NOT mkit — a different, unrelated crate
mkit --version                # prints: mkit <X.Y.Z>

mkit init                     # creates .mkit/ in the current directory
mkit keygen                   # Ed25519 commit key → .mkit/keys/default.key
mkit add hi.txt
mkit commit -m "first commit" # commits are ALWAYS Ed25519-signed
```

A signing key is mandatory — `commit`, `tag -s`, and `attest` fail without one.
Omitting `-m`/`-F` opens `$EDITOR`, so **always pass `-m` or `-F`** in a headless
or agent context or the command blocks.

## The four differences that matter

1. **Object IDs are 64-hex BLAKE3, not 40-hex SHA-1.** A git SHA never resolves.
   Abbreviate with `--short[=N]` / `rev-parse --short`; short-prefix lookups work.
2. **The repo marker is `.mkit/`, not `.git/`** — parallel layout (`objects/`,
   `refs/`, `HEAD`, `config`).
3. **Safety guards over git's destructive defaults.** Data-losing ops refuse
   without `-f` and usually accept `-n`/`--dry-run` to preview: `reset --hard`,
   `clean`, `restore`, `branch -D`, `push --force` (prefer `--force-with-lease`),
   `gc`.
4. **Authorship is cryptographic.** The signed author defaults to your signing
   key's public key (`ed25519:<hex>`). `user.identity` overrides it; `user.name`
   / `user.email` are accepted as git-compat aliases but never set who signed.

Non-goals so you don't wait on them: `log --graph` is an accepted no-op;
submodules, hooks, `git notes`, and `.git/`-format interop are out of scope.
Linked worktrees **are** supported (`mkit worktree add/list/remove/prune`).

## Signing keys

```sh
mkit keygen [--algorithm ed25519|secp256k1|p256] [--force] [--print-pubkey]
mkit verify <rev>                 # check a commit/tag signature
mkit tag -s <name> -m "msg"       # signed tag (always pass -m)
mkit key generate                 # OS-keystore Ed25519 key: Keychain/libsecret/YubiKey/…
```

> `keygen --algorithm secp256k1|p256` writes a separate **attestation** signer
> (`.mkit/keys/<alg>.key`), NOT a commit key. Committing after one fails with
> "no signing key" — run plain `mkit keygen` for the Ed25519 commit key.

## Inspect content-addressed objects

```sh
mkit hash <file>                  # store a blob → print its id
mkit cat <hash>                   # dump an object
mkit cat-file -t|-s|-p <object>   # type | size | pretty
mkit ls-tree -r <tree-ish>        # list tree entries (-r recurse, -z NUL)
mkit rev-parse --short <rev>      # resolve to an (abbreviated) id
mkit rev-list --count <rev>       # count reachable commits
mkit merge-base [--is-ancestor] <a> <b>
```

## Remotes & transports

Remote URLs use the **strict `mkit+<scheme>://` form only** (anything else is
hard-rejected):

| Scheme | Form |
|--------|------|
| `mkit+file`  | `mkit+file:///abs/path` |
| `mkit+https` | `mkit+https://host[:port]/path` |
| `mkit+s3`    | `mkit+s3://endpoint/bucket[/prefix]` |
| `mkit+ssh`   | `mkit+ssh://user@host[:port]:path` (uses `SSH_AUTH_SOCK`) |

```sh
mkit remote add origin mkit+https://gateway.example/repo
mkit clone [--depth N] [--sparse <pattern>...] <url>
mkit push [--all] [--force-with-lease] [--dry-run]
mkit pull                         # or: mkit fetch (download without merging)
```

## Prefer MCP over raw shell (when available)

The CLI ships a local MCP server — register it and drive repos through validated
tool calls instead of shelling out (no interactive paths; destructive guards
can't be overridden):

```sh
claude mcp add mkit-repo -- mkit mcp --repository /path/to/repo
```

It covers the everyday flow plus the differentiators (`mkit_verify`,
`mkit_attest`, `mkit_verify_attest`). It deliberately does **not** expose remotes,
history surgery (merge/rebase/cherry-pick/revert), tags, destructive worktree ops,
or multi-/external-signer attestation — use the shell for those.

## Rules for agents

- **`mkit keygen` before the first commit**, or commits/tags/attestations fail.
- **Never invoke interactive variants** — they hang on `$EDITOR`/stdin: plain
  `commit` (pass `-m`), `tag -a`/`-s` (pass `-m`), `rebase -i`, `add -p`.
- **No pager, ever** — `log`/`diff`/`show`/`blame` print to stdout and exit.
- **Parse machine output**: `--format=json` (`log`, `branch`, `blame`, `remote`,
  `config`, `reflog`), `status --porcelain[=v1|v2]`, `-z` for NUL paths. Some
  commands put prose on **stderr** and machine output on **stdout**.
- **Branch on exit codes, not stderr text** (table below).
- **Preview destructive ops with `-n`/`--dry-run`, commit with `-f`.**
- **Treat ids as 64-hex** — don't assume 40-char SHAs. `NO_COLOR=1` disables ANSI.

## Exit codes (BSD `sysexits`)

| Code | Meaning | Code | Meaning |
|------|---------|------|---------|
| 0 | success | 69 | transport could not connect |
| 1 | general error / no attestations | 73 | cannot create output |
| 64 | wrong args / unknown subcommand | 75 | transient — retry is safe |
| 65 | malformed input (corrupt object/bad hash) | 76 | bad URL scheme / server response |
| 66 | missing / unreadable input | 77 | permission denied |
| | | 78 | unknown config key / invalid value |

## Going deeper

If the **mkit docs MCP** (`mcp.mkit.sh`) is connected, prefer it: `get_command
<name>` for a subcommand's full flags, `list_specs` / `get_spec <NAME>` for wire
& on-disk formats, `search_docs`/`search_code`. In a checkout: `docs/CLI.md` and
`man mkit` (full reference), `docs/PARITY.md` (git-parity scope & divergences),
`docs/specs/SPEC-*.md` (formats), `docs/INSTALL.md` (install channels).

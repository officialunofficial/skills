---
name: kit
description: >
  Drive the `kit` CLI — a content-addressed version control tool with BLAKE3
  object IDs, Ed25519-signed commits, and native in-toto/DSSE attestation. Use
  when working in a `.kit/` repository, making signed commits, managing signing
  keys, inspecting content-addressed objects, or syncing over
  kit+ssh/https/s3/file transports. kit mirrors git's CLI/UX, so git reflexes
  apply — this skill covers only the parts that are *not* git.
---

# kit

`kit` is a git-like CLI that produces **signed, content-addressed** objects.
Every commit is Ed25519-signed and named by its BLAKE3 hash, so an object chain
is self-verifying wherever it's stored, and any commit can carry **attestations**
(in-toto v1 Statements in DSSE envelopes). If you know git, drive
`add`/`commit`/`log`/`branch`/`merge`/`rebase`/`diff`/`status` by reflex and
spend your attention on the four differences and the differentiator commands.
For the attestation workflow specifically, reach for [`/kit-attest`](../kit-attest/SKILL.md).

## Setup

```sh
cargo install kit-bin         # install kit-bin, NOT kit — a different, unrelated crate
kit --version                 # prints: kit <X.Y.Z>

kit init                      # creates .kit/ in the current directory
kit keygen                    # Ed25519 commit key → .kit/keys/default.key
kit add hi.txt
kit commit -m "first commit"  # commits are ALWAYS Ed25519-signed
```

A signing key is mandatory — `commit`, `tag -s`, and `attest` fail without one.
Omitting `-m`/`-F` opens `$EDITOR`, so **always pass `-m` or `-F`** in a headless
or agent context or the command blocks.

## The four differences that matter

1. **Object IDs are 64-hex BLAKE3, not 40-hex SHA-1.** A git SHA never resolves.
   Abbreviate with `rev-parse --short[=N]` or `log --abbrev[=N]`; short-prefix lookups work.
2. **The repo marker is `.kit/`, not `.git/`** — parallel layout (`objects/`,
   `refs/`, `HEAD`, `config`).
3. **Safety guards over git's destructive defaults.** Data-losing ops refuse
   without `-f`: `reset --hard`, `restore`, `clean`, `rm`, `mv`, `worktree remove`.
   Preview with `clean -n`, `gc -n`, `push --dry-run`, or `worktree prune --dry-run`.
   For `push`, prefer `--force-with-lease` over `--force`.
4. **Authorship is cryptographic.** The signed author defaults to your signing
   key's public key (`ed25519:<hex>`). `user.identity` (user-scoped) overrides
   it; `user.name` / `user.email` are unknown config keys, and kit rejects them.

Non-goals so you don't wait on them: submodules and subtrees, hooks, `git notes`,
shallow clone (`clone --depth` is a usage error), and `.git/`-format interop
(`kit git import` / `kit git export` translate objects between the stores instead).
`log --graph` is a deferred flag that kit rejects; `docs/PARITY.md` lists the others.
Linked worktrees **are** supported (`kit worktree add/list/remove/prune`).

## Signing keys

```sh
kit keygen [--algorithm ed25519|secp256k1|p256] [--force] [--print-pubkey]
kit verify <rev> [--trusted]      # check a commit/tag signature; --trusted also checks the signer against trust roots
kit tag -s <name> -m "msg"        # signed tag (always pass -m)
kit key generate [--backend B]    # keystore key: software (default), software-raw, macos-keychain, linux-secret-service, systemd-creds, yubikey (as the build enables them)
```

> `keygen --algorithm secp256k1|p256` writes a separate **attestation** signer
> (`.kit/keys/<alg>.key`), NOT a commit key. Committing after one fails with
> "no signing key" — run plain `kit keygen` for the Ed25519 commit key.

## Inspect content-addressed objects

```sh
kit hash <file>                   # store a blob → print its id
kit cat <hash>                    # dump an object
kit cat-file -t|-s|-p <object>    # type | size | pretty
kit ls-tree -r <tree-ish>         # list tree entries (-r recurse, -z NUL)
kit rev-parse --short <rev>       # resolve to an (abbreviated) id
kit rev-list --count <rev>        # count reachable commits
kit merge-base [--is-ancestor] <a> <b>
```

## Remotes & transports

Remote URLs use the **strict `kit+<scheme>://` form only** (anything else is
hard-rejected, including plain `https://` and bare paths):

| Scheme | Form |
|--------|------|
| `kit+file`  | `kit+file:///abs/path` |
| `kit+https` | `kit+https://host[:port][/path]` (the path names the repo as `<namespace>/<name>`) |
| `kit+s3`    | `kit+s3://endpoint/bucket[/prefix]` (needs a build with `--features s3`; release binaries omit it) |
| `kit+ssh`   | `kit+ssh://user@host[:port]/path` (`user@` is required; uses `SSH_AUTH_SOCK`) |

The default remote is named `default`, not `origin`. Its tracking refs live under
`refs/remotes/default/`.

```sh
kit remote add kit+https://gateway.example/<namespace>/<name>   # sets the default remote
kit remote add origin <url>       # adds a named remote; push it with: kit push origin
kit clone <url> [--sparse <pattern>...]   # --sparse needs a build with --features sparse-checkout
kit push [<remote>] [--all] [--force-with-lease] [--dry-run]
kit pull [<remote>]               # or: kit fetch (download without merging)
```

## Prefer MCP over raw shell (when available)

The CLI ships a local MCP server — register it and drive repos through validated
tool calls instead of shelling out (no interactive paths; destructive guards
can't be overridden):

```sh
claude mcp add kit-repo -- kit mcp --repository /path/to/repo
```

It covers the everyday flow (`kit_status`, `kit_diff_unstaged`, `kit_diff_staged`,
`kit_diff`, `kit_log`, `kit_show`, `kit_branch`, `kit_cat_object`, `kit_add`,
`kit_unstage`, `kit_commit`, `kit_create_branch`, `kit_checkout`, `kit_init`,
`kit_keygen`) plus the differentiators (`kit_verify`, `kit_attest`,
`kit_verify_attest`, `kit_prove`, `kit_verify_proof`, `kit_closure_verify`). It
deliberately does **not** expose remotes, history surgery
(merge/rebase/cherry-pick/revert), tags, `worktree` commands, destructive ops
(`reset --hard`, `clean`, `rm`), or multi-/external-signer attestation — use the shell for those.

The default server speaks stdio. A build with `--features mcp-v2` (release binaries
omit it) also serves streamable HTTP with `kit mcp --http <addr>`. The listener
refuses to start without a bearer token: pass `--token-file <path>` or set
`KIT_MCP_TOKEN`, not both. `<addr>` binds exactly as given, so use a loopback
address. `--unsafe-allow-any-http-peer` turns the token check off; use it only for
local development.

## Rules for agents

- **`kit keygen` before the first commit**, or commits/tags/attestations fail.
- **Never invoke interactive variants** — they hang on `$EDITOR`/stdin: plain
  `commit` (pass `-m`), `tag -a`/`-s` (pass `-m`), `rebase -i`, `add -p`.
- **No pager, ever** — `log`/`diff`/`show`/`blame` print to stdout and exit.
- **Parse machine output**: `--format=json` (`log`, `branch`, `tag`, `blame`,
  `remote`, `config`, `reflog`, `stash`, `fetch`, `pull`, `push`, `merge`, and more
  in `docs/CLI.md`), `status --porcelain[=v1|v2]`, `-z` for NUL paths. Some
  commands put prose on **stderr** and machine output on **stdout**.
- **Branch on exit codes, not stderr text** (table below).
- **Preview with `-n`/`--dry-run` where the command has it, then force with `-f`.**
- **Treat ids as 64-hex** — don't assume 40-char SHAs. `NO_COLOR=1` disables ANSI.

## Exit codes (BSD `sysexits`)

| Code | Meaning | Code | Meaning |
|------|---------|------|---------|
| 0 | success | 69 | transport could not connect |
| 1 | general error / no attestations | 70 | internal consistency error (a bug, not bad input) |
| 64 | wrong args / unknown subcommand | 73 | cannot create output |
| 65 | malformed input (corrupt object/bad hash) | 75 | transient — retry is safe |
| 66 | missing / unreadable input | 76 | bad URL scheme / server response |
| | | 77 | permission denied |
| | | 78 | unknown config key / invalid value |

## Going deeper

In a checkout: `docs/CLI.md` and `man kit` (full reference), `docs/PARITY.md`
(git-parity scope & divergences), `docs/GUIDE-GIT-WORKFLOWS.md` (git users and git
upstreams), `docs/specs/SPEC-*.md` (formats), `docs/INSTALL.md` (install channels).

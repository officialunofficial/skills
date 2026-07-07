---
name: git-guardrails-claude-code
description: Install a Claude Code hook that stops destructive git commands (push, reset --hard, clean, branch -D, and friends) before they run. Use when the user wants to guard against dangerous git operations, add git safety hooks, or block git push/reset inside Claude Code.
---

# Git guardrails for Claude Code

Wire up a `PreToolUse` hook that inspects every Bash command Claude is about to run and refuses the destructive git operations before they touch the repository.

## What the guard refuses

- `git push` in any form, including `--force`
- `git reset --hard`
- `git clean -f` and `git clean -fd`
- `git branch -D`
- `git checkout .` and `git restore .`

When a command matches, the hook exits with code 2 and Claude receives a message stating it is not permitted to run that command, so it stops rather than retrying.

## Steps

### 1. Confirm the scope

Ask whether the guard should cover **this project only** (`.claude/settings.json`) or **every project** (`~/.claude/settings.json`). The answer decides where the script and the hook entry go.

### 2. Place the hook script

The bundled script lives at [scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh). Copy it to match the chosen scope:

- **Project**: `.claude/hooks/block-dangerous-git.sh`
- **Global**: `~/.claude/hooks/block-dangerous-git.sh`

Then mark it executable with `chmod +x`.

### 3. Register the hook in settings

Add the hook to the settings file for the chosen scope.

**Project** (`.claude/settings.json`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

**Global** (`~/.claude/settings.json`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

When the settings file already exists, merge this entry into the existing `hooks.PreToolUse` array and leave the rest of the file untouched.

### 4. Offer to tune the pattern list

Ask whether any patterns should be added or dropped, then edit the `DANGEROUS_PATTERNS` array in the copied script to match.

### 5. Confirm it works

Feed a sample command through the script and check the result:

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | <path-to-script>
```

A working guard exits with code 2 and prints a `BLOCKED` line to stderr.

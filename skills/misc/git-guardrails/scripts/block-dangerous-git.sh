#!/bin/bash
# PreToolUse guard for Bash commands. Reads the tool-call JSON on stdin,
# extracts the shell command, and refuses to let destructive git operations
# run. Exit 2 (with a message on stderr) tells Claude Code the command is
# blocked; exit 0 lets it through.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

# Each entry is an extended-regex fragment matched against the command text.
# Add or remove lines here to tune what counts as dangerous.
DANGEROUS_PATTERNS=(
  "git push"
  "git reset --hard"
  "git clean -fd"
  "git clean -f"
  "git branch -D"
  "git checkout \."
  "git restore \."
  "push --force"
  "reset --hard"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "BLOCKED: '$COMMAND' matches the guarded pattern '$pattern'. You are not permitted to run this command." >&2
    exit 2
  fi
done

exit 0

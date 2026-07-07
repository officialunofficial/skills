---
name: setup-pre-commit
description: Add a Husky pre-commit hook backed by lint-staged (Prettier), plus type checking and tests, to the current repo. Use when the user wants pre-commit hooks, wants to set up Husky or lint-staged, or wants Prettier, typecheck, and tests to run at commit time.
---

# Set up pre-commit hooks

## What you end up with

- A **Husky** pre-commit hook
- **lint-staged** running Prettier over the staged files
- A **Prettier** config, if the repo lacks one
- **typecheck** and **test** scripts invoked from the hook

## Steps

### 1. Detect the package manager

Look for a lockfile: `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (yarn), or `bun.lockb` (bun). Use whichever is present, and fall back to npm when none is clear.

### 2. Install the dev dependencies

Add as devDependencies:

```
husky lint-staged prettier
```

### 3. Initialize Husky

```bash
npx husky init
```

This creates the `.husky/` directory and adds a `prepare: "husky"` script to package.json.

### 4. Write `.husky/pre-commit`

Husky v9+ needs no shebang:

```
npx lint-staged
npm run typecheck
npm run test
```

**Adapt it**: swap `npm` for the detected package manager. If package.json has no `typecheck` or `test` script, drop the matching line and tell the user it was left out.

### 5. Write `.lintstagedrc`

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. Write `.prettierrc`, only if none exists

Skip this when the repo already has a Prettier config. Otherwise use these defaults:

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. Confirm the setup

- [ ] `.husky/pre-commit` exists and is executable
- [ ] `.lintstagedrc` exists
- [ ] package.json has `"prepare": "husky"`
- [ ] A Prettier config is present
- [ ] `npx lint-staged` runs cleanly

### 8. Commit

Stage everything you created or changed and commit with: `Add pre-commit hooks (husky + lint-staged + prettier)`. The commit itself flows through the new hook, which doubles as the first smoke test.

## Notes

- Husky v9+ hook files do not take a shebang.
- `prettier --ignore-unknown` passes over files Prettier cannot parse, such as images.
- The hook runs lint-staged first — fast, staged-only — before the full typecheck and tests.

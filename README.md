# skills

[![skills.sh](https://skills.sh/b/officialunofficial/skills)](https://skills.sh/officialunofficial/skills)

**In Claude Code**, run:

```
/plugin marketplace add officialunofficial/skills
/plugin install officialunofficial-skills@officialunofficial-skills
```

Or from any shell:

```sh
npx skills@latest add officialunofficial/skills
```

Agent skills for [Official Unofficial, Inc.](https://github.com/officialunofficial) &mdash; small, composable
slash commands and behaviors for doing real engineering with a coding agent (Claude Code, or any
harness that loads skills). Each skill is a directory with a **SKILL.md** the agent reads to gain a
capability; some carry sibling reference files and scripts.

The guiding idea: keep skills **small, adaptable, and composable**, and keep *you* in control of the
process. They lean on software-engineering fundamentals &mdash; deep modules, tight feedback loops,
red-green-refactor, a shared domain language &mdash; rather than owning your workflow end to end. Fork
them, rename them, make them yours.

## Layout

```
skills/
  <category>/
    <skill-name>/
      SKILL.md        # required: YAML header (name, description) + instructions
      *.md            # optional: reference disclosed from SKILL.md, loaded on demand
      scripts/        # optional: deterministic helpers
```

A skill's `name` is the slash command that invokes it (`/to-invariants`). Skills split on one axis &mdash;
who can invoke them:

- **User-invoked** (`disable-model-invocation: true`) &mdash; only you, by typing the name. These
  orchestrate; they cost no context and don't fire on their own.
- **Model-invoked** &mdash; the agent can reach them autonomously when the task fits, and other skills can
  compose them. These hold the reusable discipline.

New here? Run **`/setup-skills`** once per repo, then **`/which-skill`** to route to the right tool.

## Skills

### Engineering

Daily code work. The backbone is a single **idea → ship** flow &mdash; `/which-skill` maps it.

**Flow and orchestration**

| Skill | | What it does |
| --- | --- | --- |
| [`which-skill`](skills/engineering/which-skill/SKILL.md) | user | Router: picks the skill or flow that fits your situation. |
| [`setup-skills`](skills/engineering/setup-skills/SKILL.md) | user | Configure a repo for the engineering skills: issue tracker, triage labels, domain-doc layout. Run once. |
| [`grill-with-docs`](skills/engineering/grill-with-docs/SKILL.md) | user | Relentless interview that sharpens a plan while writing the domain model (**CONTEXT.md**, ADRs) down as you go. |
| [`to-prd`](skills/engineering/to-prd/SKILL.md) | user | Turn the conversation into a PRD and publish it to the issue tracker &mdash; no interview. |
| [`to-issues`](skills/engineering/to-issues/SKILL.md) | user | Break a plan, spec, or PRD into independently-grabbable issues via vertical slices. |
| [`implement`](skills/engineering/implement/SKILL.md) | user | Build a piece of work from a PRD or issue, driving `/tdd` then `/code-review`. |
| [`triage`](skills/engineering/triage/SKILL.md) | user | Move incoming issues and external PRs through a state machine of triage roles. |

**Loops** &mdash; cycles of work that repeat until a stop condition is met, instead of a single turn.

| Skill | | What it does |
| --- | --- | --- |
| [`designing-loops`](skills/engineering/designing-loops/SKILL.md) | user | Reference for the four loop shapes (turn/goal/time/proactive), writing completion criteria, and managing token usage across a loop's lifetime. |
| [`dependency-update-loop`](skills/engineering/dependency-update-loop/SKILL.md) | user | Recurring pass over automated dependency-bump PRs: rebase, relock, verify, report what's ready. |
| [`stacked-pr-loop`](skills/engineering/stacked-pr-loop/SKILL.md) | user | Recurring check-in on a stack of dependent PRs: rebase children, surface CI state, flag human-only gates. |
| [`deploy-verify-loop`](skills/engineering/deploy-verify-loop/SKILL.md) | user | Post-deploy loop: poll the rollout to healthy, then run one smoke check against a real user path. |

**Verification** &mdash; turn a design or spec into checks that keep an implementation honest. They compound: invariants become fuzz oracles; both sharpen the conformance suite.

| Skill | | What it does |
| --- | --- | --- |
| [`to-invariants`](skills/engineering/to-invariants/SKILL.md) | model | Distil the properties that must always hold: system invariants plus enforceable ones, each mapped to a check or flagged as a GAP. |
| [`to-fuzz`](skills/engineering/to-fuzz/SKILL.md) | model | Distil a fuzzing plan: the targets worth fuzzing, each with an entry point, input model, and failure oracle. |
| [`to-conformance`](skills/engineering/to-conformance/SKILL.md) | model | Distil a spec's normative requirements into implementation-independent conformance tests, with traceability. |

**Design, build, and review**

| Skill | | What it does |
| --- | --- | --- |
| [`tdd`](skills/engineering/tdd/SKILL.md) | model | Test-driven development: a red-green-refactor loop, one vertical slice at a time. |
| [`code-review`](skills/engineering/code-review/SKILL.md) | model | Two-axis review of the diff since a fixed point: Standards and Spec, as parallel passes. |
| [`diagnosing-bugs`](skills/engineering/diagnosing-bugs/SKILL.md) | model | Diagnosis loop for hard bugs and regressions: reproduce → minimize → hypothesize → instrument → fix → regression-test. |
| [`codebase-design`](skills/engineering/codebase-design/SKILL.md) | model | Vocabulary and principles for designing deep modules: a lot of behavior behind a small interface. |
| [`domain-modeling`](skills/engineering/domain-modeling/SKILL.md) | model | Build and refine a project's domain language; keep **CONTEXT.md** and ADRs current. |
| [`improve-codebase-architecture`](skills/engineering/improve-codebase-architecture/SKILL.md) | user | Scan for deepening opportunities, present them as a visual report, then grill the one you pick. |
| [`resolving-merge-conflicts`](skills/engineering/resolving-merge-conflicts/SKILL.md) | model | Work through an in-progress git merge or rebase conflict. |

**Standalone**

| Skill | | What it does |
| --- | --- | --- |
| [`prototype`](skills/engineering/prototype/SKILL.md) | model | Build a throwaway prototype to answer one design question: a runnable terminal app, or several UI variations. |
| [`research`](skills/engineering/research/SKILL.md) | model | Background agent that investigates a question against primary sources and leaves a cited Markdown file. |

### Productivity

Workflow tools, not code-specific.

| Skill | | What it does |
| --- | --- | --- |
| [`grill-me`](skills/productivity/grill-me/SKILL.md) | user | Relentless, one-decision-at-a-time interview that sharpens any plan or design. |
| [`grilling`](skills/productivity/grilling/SKILL.md) | model | The reusable interview primitive behind `grill-me` and `grill-with-docs`. |
| [`handoff`](skills/productivity/handoff/SKILL.md) | user | Compact the current conversation into a handoff document another agent can pick up. |
| [`teach`](skills/productivity/teach/SKILL.md) | user | Teach a concept across sessions, using the current directory as a stateful workspace. |
| [`technical-writing`](skills/productivity/technical-writing/SKILL.md) | model | House style for docs, specs, release notes, and user-facing copy: clear, direct, specific. |
| [`writing-great-skills`](skills/productivity/writing-great-skills/SKILL.md) | user | Reference for writing and editing skills well: the vocabulary that makes a skill predictable. |

### Misc

| Skill | | What it does |
| --- | --- | --- |
| [`git-guardrails-claude-code`](skills/misc/git-guardrails-claude-code/SKILL.md) | model | Install a Claude Code hook that blocks destructive git commands. |
| [`setup-pre-commit`](skills/misc/setup-pre-commit/SKILL.md) | model | Add a Husky pre-commit hook (lint-staged plus Prettier), type checking, and tests. |
| [`scaffold-exercises`](skills/misc/scaffold-exercises/SKILL.md) | model | Scaffold an exercise directory tree: sections, problems, solutions, explainers. |
| [`migrate-to-shoehorn`](skills/misc/migrate-to-shoehorn/SKILL.md) | model | Convert `as` assertions in tests to `@total-typescript/shoehorn` helpers. |

### mkit

Skills for [mkit](https://github.com/officialunofficial/mkit) &mdash; the content-addressed,
Ed25519-signed VCS. Two for *using* mkit, three for *developing* it.

| Skill | | What it does |
| --- | --- | --- |
| [`mkit`](skills/mkit/mkit/SKILL.md) | model | Drive the `mkit` CLI: BLAKE3 object IDs, signed commits, transports &mdash; the parts that aren't git. |
| [`mkit-attest`](skills/mkit/mkit-attest/SKILL.md) | model | Produce and verify in-toto/DSSE attestations on a commit against a trust-roots registry. |
| [`new-mkit-spec`](skills/mkit/new-mkit-spec/SKILL.md) | model | Scaffold a `SPEC-*.md` in the repo's format, register it in the index, and wire git-parity. |
| [`mkit-release`](skills/mkit/mkit-release/SKILL.md) | model | Cut a signed, attested release &mdash; one `v` tag drives the GitHub, crates.io, and npm channels. |
| [`mkit-ci-preflight`](skills/mkit/mkit-ci-preflight/SKILL.md) | model | Confirm a PR is genuinely green across the GitHub gates *and* the GCB `mkit-*-pr` checks before merge. |

## Installing

**In Claude Code**, this repo is a plugin marketplace &mdash; add it once, then install the whole
collection as a single plugin:

```
/plugin marketplace add officialunofficial/skills
/plugin install officialunofficial-skills@officialunofficial-skills
```

`/plugin update officialunofficial-skills` pulls new skills as they land.

Working in another agent, or want to pick individual skills instead of the whole set? Use the
[skills.sh](https://www.skills.sh) installer &mdash; pick the skills and the agents (Claude Code,
Cursor, Copilot, and more) to install them on:

```sh
npx skills@latest add officialunofficial/skills
```

For the full engineering flow, include `setup-skills` and `which-skill`, then run `/setup-skills`
once in your agent to configure the issue tracker, triage labels, and doc layout.

Prefer to wire it up by hand? Clone the repo and symlink individual skills:

```sh
git clone git@github.com:officialunofficial/skills.git
ln -s "$PWD/skills/skills/engineering/to-invariants" ~/.claude/skills/to-invariants
```

Then invoke a skill by name (for example `/to-invariants`, optionally with an output path).

Every `SKILL.md` here follows the [Agent Skills](https://agentskills.io) open standard, so the same
file works unmodified on other agents that support it &mdash; for Codex CLI, symlink into
`.agents/skills/<name>` (project-local) or `~/.agents/skills/<name>` (personal) instead of
`~/.claude/skills/<name>`.

## Adding a skill

1. Create the skill directory `skills/<category>/<name>/` with a `SKILL.md` inside.
2. The YAML header needs a `name` (equal to the directory) and a `description`. For a model-invoked
   skill, write the description in third person: the first sentence says what it does, then "Use
   when …" names the distinct triggers. For a user-invoked skill, set `disable-model-invocation:
   true` and keep the description to a one-line human summary.
3. Keep **SKILL.md** tight; disclose long reference into sibling **.md** files, loaded on demand.
4. See [`writing-great-skills`](skills/productivity/writing-great-skills/SKILL.md) for the craft, and
   [`technical-writing`](skills/productivity/technical-writing/SKILL.md) for the prose style.

## Releasing

Releases use CalVer &mdash; `vYYYY.M.MICRO` (for example **v2026.7.0**, then **v2026.7.1**, then
**v2026.8.0**). MICRO resets to 0 each calendar month.

To cut one, run the [release workflow](.github/workflows/release.yml) from the Actions tab. It
derives the next version from the date and the existing tags, generates notes from the
conventional-commit history, bumps **package.json**, updates **CHANGELOG.md**, tags, and publishes a
GitHub Release. Run it with the dry-run input first to preview the version and notes.

## License

This project is dual-licensed under either of

- the [Apache License, Version 2.0](LICENSE-APACHE)
- the [MIT license](LICENSE-MIT)

at your option. Unless you state otherwise, you license any contribution you submit for inclusion
under these same terms, without additional conditions.

## Credits

Many of these skills are adapted from [`mattpocock/skills`](https://github.com/mattpocock/skills) (MIT), with thanks.

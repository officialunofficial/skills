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
| [`audit-issue`](skills/engineering/audit-issue/SKILL.md) | user | Audit an issue tree against HEAD: verify its claims, teach back what it affords, then recommend keep / rescope / close with drafted comments. |

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
| [`to-primitives`](skills/engineering/to-primitives/SKILL.md) | model | Abstract a feature into behavior-named capability primitives, graded against the codebase (exists / partial / missing), with a build-order graph. |
| [`improve-codebase-architecture`](skills/engineering/improve-codebase-architecture/SKILL.md) | user | Scan for deepening opportunities, present them as a visual report, then grill the one you pick. |
| [`resolving-merge-conflicts`](skills/engineering/resolving-merge-conflicts/SKILL.md) | model | Work through an in-progress git merge or rebase conflict. |

**Standalone**

| Skill | | What it does |
| --- | --- | --- |
| [`prototype`](skills/engineering/prototype/SKILL.md) | model | Build a throwaway prototype to answer one design question: a runnable terminal app, or several UI variations. |
| [`research`](skills/engineering/research/SKILL.md) | model | Background agent that investigates a question against primary sources and leaves a cited Markdown file. |
| [`best-practices`](skills/engineering/best-practices/SKILL.md) | model | Foreground check of a stack's current idiomatic patterns against its own docs; answer or review code against them. |
| [`latest-docs`](skills/engineering/latest-docs/SKILL.md) | model | Foreground check of a library's current docs and changelog against what training data or code assumes. |
| [`typesafe-ai`](skills/engineering/typesafe-ai/SKILL.md) | model | Build with TypeSafe's Jev decision model: turn a prompt-and-parse step into typed judgments code can compose. Vendored from [typesafe-ai/skills](https://github.com/typesafe-ai/skills), MIT. |

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

### Design

Interface work: motion, layout, copy, color, accessibility and craft review. Start with
[`design-router`](skills/design/design-router/SKILL.md): it picks the skills for a UI task and sets the
order of work. Most of these skills are rewrites of open-source skills by Emil Kowalski, Raphael Salaja,
Benji Taylor, Jakub Krehel, Vercel and others; see [NOTICE.md](NOTICE.md) and each skill's `LICENSE.txt`.

| Skill | | What it does |
| --- | --- | --- |
| [`alignment`](skills/design/alignment/SKILL.md) | user | Measures a running page for edges, gaps, centres and radii that miss by a pixel or two, judges visual weight, and returns a numbered report with |
| [`animate`](skills/design/animate/SKILL.md) | model | Builds a web animation from scratch and writes the code. |
| [`animate-expo`](skills/design/animate-expo/SKILL.md) | model | Builds animations in React Native and Expo with Reanimated, Gesture Handler, Expo Router and expo-haptics. |
| [`animation-performance`](skills/design/animation-performance/SKILL.md) | model | Diagnoses and fixes web animations that drop frames. |
| [`animation-vocabulary`](skills/design/animation-vocabulary/SKILL.md) | model | Names a web animation or motion effect from a loose description, for example "the bouncy thing when a popover opens" is Pop in and "the iOS scroll |
| [`apple-design`](skills/design/apple-design/SKILL.md) | model | Applies Apple's approach to fluid, physical interfaces on the web. |
| [`ask-sonner`](skills/design/ask-sonner/SKILL.md) | model | Guides work with Sonner, the React toast library: mounting the Toaster, choosing the right toast() call, promise and loading toasts, updating, |
| [`audit`](skills/design/audit/SKILL.md) | user | Reviews a change, a session or a whole codebase against every design skill in this collection and returns one ranked, numbered report. |
| [`avatar`](skills/design/avatar/SKILL.md) | user | Draws any object as a flat character with two capsule eyes, then animates its whole body so it glances, blinks, breathes, follows the pointer and |
| [`blank-page`](skills/design/blank-page/SKILL.md) | model | Expands a one-line motion, animation or design brief into the full prompt: one committed look grounded in five reference images, three motion |
| [`break-ui`](skills/design/break-ui/SKILL.md) | model | Stress-tests a component or screen with realistic worst-case data (long names, unbreakable emails, one-letter names, missing fields, huge counts, |
| [`color`](skills/design/color/SKILL.md) | model | Holds text and control contrast to exact WCAG ratios measured on screen, routes colour through role tokens, keeps neutrals translucent, gives dark |
| [`copy`](skills/design/copy/SKILL.md) | model | Writes and reviews the words inside an interface, such as button labels, menu items, headings, setting names, descriptions and status text. |
| [`deconstruct`](skills/design/deconstruct/SKILL.md) | user | Breaks an animation or interaction into a state machine and a timeline of every property, on a page you can scrub and edit. |
| [`defaults`](skills/design/defaults/SKILL.md) | model | Applies the interface defaults that every screen needs, with exact values for scroll edges, shadows and surfaces, focus, hit areas, mobile |
| [`design-router`](skills/design/design-router/SKILL.md) | model | Routes interface work to the right design skill in this set and sets the order of work. |
| [`emil-design-eng`](skills/design/emil-design-eng/SKILL.md) | model | Applies Emil Kowalski's design engineering rules for UI polish, component design and animation decisions. |
| [`find-animation-opportunities`](skills/design/find-animation-opportunities/SKILL.md) | model | Sweeps a codebase or UI for places that do not animate but should, rejects the ones that should stay still, and proposes motion with exact values. |
| [`frames`](skills/design/frames/SKILL.md) | user | Records one interaction on a throttled CPU, names what drops frames or delays input, then proves the fix with a second recording. |
| [`gather`](skills/design/gather/SKILL.md) | model | Collects design references from the user's own saves, their boards, pattern libraries and curated galleries onto one linked board before a design |
| [`icons`](skills/design/icons/SKILL.md) | model | Draws the icons a project's set lacks, in that set's own style: measures stroke, grid, radii and padding from every existing icon, writes each new |
| [`improve-animations`](skills/design/improve-animations/SKILL.md) | model | Surveys the animation and motion code of a whole codebase, then writes a prioritized audit and self-contained implementation plans that another |
| [`keyboard`](skills/design/keyboard/SKILL.md) | user | Walks a running page with the keyboard alone, records every focus stop and reports controls it cannot reach, see or operate. |
| [`lab`](skills/design/lab/SKILL.md) | user | Builds a temporary page that shows every variant and state of real components at once, each linked to its source. |
| [`match`](skills/design/match/SKILL.md) | model | Rebuilds a named reference from its real source and measured values, then compares reference and rebuild side by side in every state. |
| [`mobile-native`](skills/design/mobile-native/SKILL.md) | model | Makes a web app feel native on a phone with small CSS and meta tag fixes. |
| [`motion`](skills/design/motion/SKILL.md) | model | Sets how interface elements move, with exact values for what animates, easing curves, durations, springs, gestures, exits, motion blur and reduced |
| [`pick-ui-library`](skills/design/pick-ui-library/SKILL.md) | user | Picks one library for a frontend task from a curated list: UI primitives, toasts, OTP inputs, charts, command menus, virtualization, drag and |
| [`prose`](skills/design/prose/SKILL.md) | model | Writes and reviews long-form text about design and engineering work, such as blog posts, breakdowns, case studies and design notes. |
| [`remove-animations`](skills/design/remove-animations/SKILL.md) | model | Finds the animations an interface does not need and removes or reduces them, then cleans up the code they leave behind. |
| [`restraint`](skills/design/restraint/SKILL.md) | model | Cuts a change down to the ask. |
| [`reuse`](skills/design/reuse/SKILL.md) | model | Sets the build order for anything new. |
| [`review-animations`](skills/design/review-animations/SKILL.md) | user | Reviews animation and motion code against a strict craft standard and returns a findings table with a block or approve verdict. |
| [`rule`](skills/design/rule/SKILL.md) | model | Turns a correction into a short written project rule with a broken line and the line that replaces it, puts the rule in the one file that owns its |
| [`scope`](skills/design/scope/SKILL.md) | model | Holds an edit to the request. |
| [`sketchbook`](skills/design/sketchbook/SKILL.md) | user | Generates a batch of small interaction experiments in the project's own stack as live tiles to keep or kill, and learns the user's taste from each |
| [`stageshow`](skills/design/stageshow/SKILL.md) | model | Builds faux product UI that reads as a real product, as a still illustration or a short animated demo with a cursor: browser and app windows, |
| [`verify`](skills/design/verify/SKILL.md) | model | Checks a UI or behaviour change in the running app before calling it done, then tells the user where to see it. |
| [`viewports`](skills/design/viewports/SKILL.md) | model | Renders one page at 320, 375, 768, 1024 and 1440 wide, at each side of every breakpoint, on a short landscape phone and at 200% text, then reports |
| [`web-design-guidelines`](skills/design/web-design-guidelines/SKILL.md) | model | Reviews UI code against the Vercel Web Interface Guidelines, fetched fresh for each review, and reports findings as terse file:line lines. |
| [`write-swift`](skills/design/write-swift/SKILL.md) | model | Guides modern Swift through Swift 6.3, with value types, Swift 6 data-race safety, the Swift 6.2 concurrency model (main actor by default, |

### Misc

| Skill | | What it does |
| --- | --- | --- |
| [`git-guardrails`](skills/misc/git-guardrails/SKILL.md) | model | Install a Claude Code hook that blocks destructive git commands. |
| [`setup-pre-commit`](skills/misc/setup-pre-commit/SKILL.md) | model | Add a Husky pre-commit hook (lint-staged plus Prettier), type checking, and tests. |
| [`scaffold-exercises`](skills/misc/scaffold-exercises/SKILL.md) | model | Scaffold an exercise directory tree: sections, problems, solutions, explainers. |
| [`migrate-to-shoehorn`](skills/misc/migrate-to-shoehorn/SKILL.md) | model | Convert `as` assertions in tests to `@total-typescript/shoehorn` helpers. |

### kit

Skills for [kit](https://github.com/officialunofficial/kit) &mdash; the content-addressed,
Ed25519-signed VCS. Two for *using* kit, three for *developing* it.

| Skill | | What it does |
| --- | --- | --- |
| [`kit`](skills/kit/kit/SKILL.md) | model | Drive the `kit` CLI: BLAKE3 object IDs, signed commits, transports &mdash; the parts that aren't git. |
| [`kit-attest`](skills/kit/kit-attest/SKILL.md) | model | Produce and verify in-toto/DSSE attestations on a commit against a trust-roots registry. |
| [`new-kit-spec`](skills/kit/new-kit-spec/SKILL.md) | model | Scaffold a `SPEC-*.md` in the repo's format, register it in the index, and wire git-parity. |
| [`kit-release`](skills/kit/kit-release/SKILL.md) | model | Cut a signed, attested release &mdash; one `v` tag drives GitHub and npm, and crates.io goes out by hand from that tag. |
| [`kit-ci-preflight`](skills/kit/kit-ci-preflight/SKILL.md) | model | Confirm a PR is genuinely green across the GitHub gates *and* the GCB `kit-*-pr` checks before merge. |

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
2. The YAML header needs a `name` (equal to the directory; lowercase letters, digits and hyphens; no
   "claude" or "anthropic") and a `description`. For a model-invoked skill, write the description in
   third person: say what the skill does, then when to use it, with concrete trigger words. Keep it under
   600 characters. For a user-invoked skill, set `disable-model-invocation: true` and keep the description
   to a one-line human summary.
3. Keep **SKILL.md** tight; disclose long reference into sibling **.md** files, loaded on demand.
4. Test the skill before you ship it: run two or three realistic prompts with and without the skill, and
   check that the description triggers on the right requests and stays quiet on the wrong ones.
5. Run `python3 scripts/check-skills.py`. It checks names, descriptions, size limits, links, the plugin list and
   this README. The same check runs on every pull request.
6. See [`writing-great-skills`](skills/productivity/writing-great-skills/SKILL.md) for the craft, and
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

# Changelog

All notable changes to `@ravn/ui-kit` are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/) — see `CONTRIBUTING.md`
for the specific policy this repo follows for what bumps major/minor/patch.

## [Unreleased]

### Fixed

- **The published token tables rendered as raw `|` characters. They are tables now.** This
  Storybook's MDX pipeline had no `remark-gfm`, and GFM tables are not part of core Markdown, so
  a pipe table was not a badly-styled table — it was a paragraph, published verbatim on the live
  site. `colors.mdx`'s alias table and `typography.mdx`'s type scale were both affected, and the
  colour alias table is exactly what a consumer opens that page to read.

  `remark-gfm` is now configured on `@storybook/addon-docs` in `.storybook/main.ts`. Verified by
  rendering, not by building — a green build is what this bug survived for its whole life.
  `colors.mdx` now renders three real `<table>` elements with 13, 7 and 3 body rows, and
  `typography.mdx` one with 7; both pages show zero lines of visible pipe text.

  Chosen over converting both pages to literal `<table>` markup on measured grounds: there are
  only four `.mdx` pages, and across all of them there are zero tildes, zero bare URLs, zero
  footnote references and zero task-list markers — so tables are the only GFM construct the kit
  contains, and the parser change cannot alter anything else. All four were re-rendered and read
  afterwards regardless. `introduction.mdx`, which has no tables, renders to a character-identical
  4621-character document before and after. The alternative would also have left the trap armed
  for the next person to write a pipe table.

  `@storybook/addon-docs` is now a direct devDependency, pinned to exactly `8.6.14` rather than a
  caret range. Configuring MDX options requires naming the addon, and the version must match what
  `@storybook/addon-essentials` pins internally — a caret resolves to a newer patch and npm then
  installs a second copy alongside the one essentials carries.

- **The Claude Code hooks copied in `7514d38` were inert, and now are not.** Nothing in this
  release changes `dist/`; it is repository tooling only, so consumers are unaffected.
  - `.claude/hooks/block-dangerous.sh` read its command from `$1`. Claude Code passes the tool
    call as JSON on stdin, so the pattern match ran against an empty string and **every one of
    the 13 commands this repo claimed to block was permitted** — verified against the pre-fix
    script in this worktree, not inherited from the app's report. Its exit code was wrong
    independently: a non-zero exit that is not exactly `2` is a _non-blocking_ error, so the
    refusal printed and the command then ran. It now returns `permissionDecision: "deny"`.
  - The two `PostToolUse` formatter commands interpolated `$FILE_PATH`, which Claude Code never
    sets, so `eslint --fix` and `prettier --write` ran against an empty argument on every edit
    and `|| true` swallowed it. They are replaced by `.claude/hooks/format-file.sh`, which reads
    `.tool_input.file_path` from stdin and skips files outside `CLAUDE_PROJECT_DIR`.
  - `.claudeignore` is not a file Claude Code reads. Removed, and replaced with
    `permissions.deny` entries in `.claude/settings.json` that actually deny.
- **The documented breakpoint floor was "never measured". It is 833px.** `CLAUDE.md` and the
  published **Decisions** page both stated no floor had ever been measured, and `CLAUDE.md` went
  further and forbade quoting one. Measured on `layout-appshell--dashboard` by reading
  `document.documentElement.scrollWidth` across viewport widths: 833 at every width below 833;
  832 overflows, 833 does not. Both documents now state it, with the method and a table.
  **The decision is unchanged** — the kit stays desktop-only and the consuming app keeps its own
  shell permanently. What changes is that a consumer deciding whether to adopt `AppShell` can
  have the number, and that a session which measures 833 correctly is no longer told by its own
  instructions that it must have erred. Note that 833 is where `AppShell` stops fitting; the
  separately documented 1436px is where the _table view_ stops fitting.
- `CLAUDE.md` cited `.claudeignore` as the mechanism keeping `dist/` out of context. It now names
  the `permissions.deny` `Read(./dist/**)` entry that actually does it.

### Added

- `scripts/hooks.test.mjs` — 33 cases that drive each hook exactly as Claude Code drives it, with
  the payload as JSON on stdin. Vitest collects it, so it runs inside `npm run gate`. Restoring
  the pre-fix `.claude/` and running it there: **22 of the 34 cases it collects fail** (34 rather
  than 33 because the old `settings.json` wired three hook commands where the fix wires two).
  Two cases exist only to pin the removed shapes, so a revert to argv or `$FILE_PATH` goes red
  rather than quiet, and three check that `settings.json` still points at a script that exists
  and is executable — a hook that works but is wired to nothing fails in exactly the original
  way. Coverage is unaffected: the metric includes `src/**` alone, so the ratchet in
  `vitest.config.ts` neither moves nor needs to.

### Changed

- Three of the safety patterns changed shape. They had never run, so there was no behaviour to
  preserve: `rm` now requires recursive-and-force flags _and_ a root or home target, so
  `rm -rf ./dist` — routine here, since `dist/` is committed — is allowed; `--force` no longer
  matches `--force-with-lease` by substring, while a `git push origin +branch` refspec now
  matches where it never did.
- `eslint.config.js` gives `scripts/**/*.mjs` the Node globals it already gave root-level config
  files.

## [0.4.0] - 2026-08-06

**The first release that can be installed at all, and the first anyone installs by tag.**
Until now the only consumer got this package by committing a copy of `dist/` into its own
repository. `dist/` is committed _here_ now, `LICENSE` ships in the tarball, and the
install is:

```bash
npm install github:f3r21/ravn-ui-kit#v0.4.0
```

**Breaking, despite the minor version bump.** `AddTaskModal`'s `initialTitle`,
`initialDueDate`, `initialPoints`, `initialAssignee` and `initialLabel` props are now
`defaultTitle`, `defaultDueDate`, `defaultPoints`, `defaultAssignee` and `defaultLabel`.
**No alias is kept** — a consumer passing the old names gets a type error, and at runtime
the seed values are simply ignored. This lands as a minor bump under SemVer's pre-1.0
carve-out, per `CONTRIBUTING.md`'s versioning policy, which requires calling it out
explicitly either way. Full rationale under **Changed**, below.

Also note under **Changed**: `clsx` and `tailwind-merge` are no longer bundled into
`dist/index.js`. They are declared `dependencies`, so a normal install resolves them — but
a consumer vendoring the built output by hand, rather than installing the package, now has
two unresolved bare imports.

### Added

- **The package installs straight from GitHub, and `dist/` is committed to make that
  possible.** The consuming app held a copy of this repo's build output at
  `vendor/ravn-ui-kit` and installed it as `file:./vendor/ravn-ui-kit`. Measured in that
  repository at `af790e0`, that copy is **50.4% of all line churn in it** — 22,859 of
  45,346 lines, across 11 commits, because minified output reflows on any change. It was
  also unverifiable: the app's lockfile entry is
  `{"resolved": "vendor/ravn-ui-kit", "link": true}`, carrying no version and no integrity
  hash, so `@ravn/ui-kit@0.3.0` names **three** mutually different `dist/` trees in that
  repo's history — and `0.2.0` names **eight** — with nothing able to detect it.

  Vendoring was originally chosen because this repository was private and reaching it from
  the app's CI would have needed a cross-repo PAT secret. It is public now, so `npm ci`
  clones it anonymously — no secret, no permission widening.

  What still blocked a git install was `.gitignore`. **A git install runs no build**: npm
  clones, looks for a `prepare` script, finds none, and packs whatever `package.json`'s
  `files` names. With `dist/` ignored, that tarball shipped an exports map whose four
  entries all pointed at files that were not in it.

  `"prepare": "npm run build"` would have fixed that and was rejected: it makes every
  consumer install — their CI, every preview deploy, every worktree — pull this repo's
  dependency tree (614 distinct `name@version`, 432 MB of `node_modules`) and run a full
  build. Committing 275 KB of generated output (281,596 bytes across the four files) keeps
  installs as fast as they are and keeps the build in the repo that owns it.
  `.gitattributes` already marked `dist/**` as `linguist-generated -diff`, so GitHub
  collapses it in review and local diffs skip it.

  The build was confirmed byte-identical across two consecutive runs before anything was
  committed, because the freshness guard below would otherwise fail on every pull request
  forever. It has since been confirmed byte-identical **across machines** too, which two
  runs on one machine cannot show: the guard passed on `ubuntu-latest` against a `dist/`
  built on macOS. Same Node major, from `.nvmrc`, which is why that pin is a precondition
  for this whole arrangement rather than housekeeping.

- **A CI step that fails when the committed `dist/` is stale** (`Check committed dist/ is
fresh`, immediately after `Build library`). A committed build artifact is worth nothing
  unless it matches the source beside it, and nothing checked that — a stale `dist/` would
  surface on the app's deploy rather than here.

  It runs `git add --intent-to-add dist/ && git diff --exit-code dist/`. The
  `--intent-to-add` half is load-bearing: a bare `git diff --exit-code dist/` sees tracked
  files only, so a build emitting a **new** chunk leaves it untracked and invisible — empty
  diff, green guard, tarball missing the chunk, which is the exact failure the guard exists
  to prevent. Because of the `-diff` attribute a failure prints "Binary files differ"
  instead of a six-figure patch; the exit code is still non-zero, and
  `.github/workflows/ci.yml` says so, since the obvious "fix" is to drop the attribute and
  reintroduce the review noise it removes.

- **A `Decisions` page in the published Storybook** (`src/styles/decisions.mdx`), beside
  `Introduction`. Four decisions this kit is built around had no version-controlled home
  a reader could reach: two lived only in host-local agent memory (the kit is
  deliberately desktop-only; the remaining axe contrast findings are accepted rather than
  outstanding), and two were recorded only in scattered call-site comments (WCAG AA
  outranks Figma fidelity, with the measured ratio written down; field labels are
  `sr-only` by default). They are now in `CONTRIBUTING.md`'s "Design values" for someone
  about to write a component, and on that page for someone who has only ever seen
  https://f3r21.github.io/ravn-ui-kit/.

  Every figure on the page names a tracked file. That is the point of it: the same pass
  removed three figures from `CLAUDE.md` that could not be derived from anything in this
  repository — see below.

- **`CONTRIBUTING.md` now states where a documentation page goes.** Its four Storybook
  buckets only ever covered component stories; `Introduction` has sat outside them since
  it was written, unexplained. Prose pages are top level, and adding one means adding its
  title to `storySort.order` too, or it sorts below `Layout/`. The section also records
  two MDX traps a green build does not reveal: pipe tables do not render (no
  `remark-gfm`, which `typography.mdx` and `colors.mdx` demonstrate today), and
  `{/* … */}` comments do not survive `npm run format`.

- **An MIT `LICENSE`, and a matching `license` field in `package.json`.** The repo is
  public and had neither, which is not "permissively licensed by omission" — default
  copyright reserves every right, so the app consuming this as a git dependency had no
  grant to do so.
- **`.nvmrc`** (`22`). The CI workflow now reads it via `node-version-file` rather than
  repeating the number, so the two cannot drift.
- **`.github/dependabot.yml`** — grouped, weekly, in the shape the consuming app already
  uses, plus two groups the app has no need of (`storybook`, whose addons must move in
  lockstep with the core package, and `build-tooling`, which decides what `dist/` looks
  like) and a `github-actions` ecosystem block.

  That last block settles a rule the consuming app had written the other way. What is
  locked across the two repositories is the **Node version** — it decides the bytes
  `npm run build` produces, which is the whole basis of the `dist/` freshness check.
  `actions/checkout` and `actions/setup-node` majors govern the runner-side runtime of the
  action wrapper, not the toolchain that builds the code, so holding them identical buys
  nothing the Node pin does not already buy and costs currency. Both are three majors
  behind current; Dependabot is expected to close that. The same principle governs which
  actions get SHA-pinned: privilege, not version. The rule is stated in
  `.github/workflows/ci.yml` in both repositories rather than in a review thread.

- **A dependency-review gate on `pull_request`** (`actions/dependency-review-action`). It
  diffs the base commit's dependency graph against the head commit's and fails when a pull
  request _introduces_ a dependency carrying a known advisory. `npm audit` structurally
  cannot do that: it sees the tree the branch produces, so a vulnerability inherited from
  `main` and one this PR added are indistinguishable to it. Held at the audit step's
  `fail-on-severity: high` rather than the action's `low` default, so the two gates cannot
  disagree about what is acceptable. CodeQL was considered and skipped — on a component
  library with no server-side logic it finds approximately nothing.
- **`.github/pull_request_template.md`** — what changed, why, and how it was verified as a
  checklist of commands actually run. Its "Second-session review:" line holds the review
  permalink, which is the only evidence of review this repo can produce (see below).
- **An accessibility gate in CI** — `@storybook/test-runner` + `axe-playwright` run axe
  over all 144 stories in headless Chromium (`npm run test:a11y:ci`), failing the build on
  any finding not listed in `.storybook/a11y-allowlist.ts`. `@storybook/addon-a11y` was
  already installed and registered, but it only paints violations in the Storybook UI: CI
  ran `gate` + `build` + `build:storybook` and never rendered a story in a browser, so
  everything the 0.3.0 palette pass fixed was guarded by nothing but memory.

  The allowlist is keyed to **story id x rule id**, not to a count or a threshold, because
  a bare budget lets a new violation move in the moment an old one is fixed. A rule firing
  on a story that does not list it fails; a rule listed for a story that no longer reports
  it also fails. The list can only be paid down. `incomplete` is ratcheted alongside
  `violations` for the reason the `Card` entry in 0.3.0 records: axe files exact 1:1 text
  under `incomplete`, so a violations-only sweep is blind to invisible text.

  This does not replace `src/styles/contrast.test.ts`, and could not. That test checks
  pairings no story renders — hover fills, placeholders, surfaces a component may be
  dropped onto. This one catches what two individually-fine tokens compose into once a
  component is actually painted. Neither sees the other's cases.

  **The measured baseline, which corrects the figure previously repeated in `CLAUDE.md`:**
  **21 violation nodes across 16 of 144 stories, plus 5 `incomplete`.** Not "16, all
  `TextButton`". 16 is the `color-contrast` node count specifically, and 14 of those are
  `TextButton variant="primary"` — mostly appearing as other components' story triggers,
  which is why fixing one component would clear twelve entries. The other 2 come from
  `FloatingPopover`'s story, which hand-rolls its trigger instead of using `TextButton`
  and so reproduces the same 3.83:1 pairing on markup this package does not ship. Every
  contrast ratio matches what `contrast.test.ts` already asserts, measured independently
  by a browser: 3.83:1 on `primary-4`, 2.83:1 on `primary-3`.

  The remaining **5 violation nodes are not contrast at all**, and are the first thing
  this gate found that no previous audit had: `aria-prohibited-attr` on `TaskMetaBadges`,
  which renders each badge as `<span aria-label>` with both children `aria-hidden`. A
  `<span>` with no role is `generic`, `aria-label` is prohibited there and therefore
  dropped, and both children are hidden — so attachment, subtask and comment counts
  contribute nothing whatsoever to the accessibility tree. They are silent to a screen
  reader today. Recorded in the allowlist as open debt rather than fixed here, because the
  fix is a component change that wants its own test; the allowlist comment says so and
  says which lines to delete when it lands.

  The 5 `incomplete` findings are all one element — `SidebarItem`'s active label on its
  gradient wash, which axe cannot measure a ratio against at all (`bgGradient`). It has
  been measured by hand at 6.67:1 and 6.02:1, and `sidebar-item.tsx` carries the
  arithmetic; pinning them means a sixth one nobody has looked at fails the build.

### Changed

- **`actions/upload-pages-artifact` and `actions/deploy-pages` are pinned to full commit
  SHAs.** Everything else in the workflow stays on a floating major, and the comments state
  that as one rule rather than two unrelated calls: what is placed under control is
  **privilege, not version**.

  The Pages publish path is the only privileged thing this workflow does.
  `deploy-storybook` is the sole holder of `pages: write` + `id-token: write`, so a moved
  tag on `deploy-pages` buys an OIDC-authenticated publish to the live documentation site.
  `upload-pages-artifact` holds no scope itself — it runs in the `ci` job under the
  workflow's `contents: read` — but it decides the bytes the privileged job publishes, so
  pinning only the half holding the token would be theatre. **This corrects the premise
  the work was filed under**, which had both actions running inside the privileged job;
  they do not, and the conclusion survives the correction rather than depending on it.

  `actions/checkout` and `actions/setup-node` stay floating under the same rule: no write
  scope, and they govern the runner-side JS runtime of the action wrapper rather than the
  toolchain that builds the code, where an outdated major is the live risk. That is the
  position `.github/dependabot.yml` and `ci.yml` already take on cross-repository lockstep
  — the Node version is what is locked, action-wrapper majors float to current.

  Pinned at the tags in use (`v3.0.1`, `v4.0.5`), not bumped. Both actions have a v5 and
  Dependabot's `github-actions` group is expected to propose it, updating the SHA and its
  trailing comment together; the pin records what runs today rather than holding a version
  back. Moving a major on the deploy path inside a supply-chain change would leave no way
  to tell which of the two broke a deploy.

- **CI runs Node 22, not 20.** The consuming app runs 22 and declares
  `engines.node: >=22.13.0`; a package and its only consumer testing on different majors
  is a difference waiting to be discovered downstream. It also has to be settled before
  `dist/` becomes a verified build artifact, since a rebuild-and-diff freshness check only
  means something if every machine produces the same bytes.
- **`main` is protected, and CI is now a merge gate rather than a report.** There was no
  branch protection, no ruleset and no required status check, so a red build did not stop
  a merge — and all four previous PRs merged with zero reviews. `main` now requires a pull
  request, requires the `CI` check to pass, enforces all of that on admins, and refuses
  force-pushes and deletion.

  Three details are load-bearing. The required context is **`CI` and only `CI`** — that is
  the job's check-run name, and the workflow's second job (`Publish Storybook`) reports
  `skipped` on `pull_request` events, so requiring it would mean no PR could ever merge.
  **No approvals are required**: there is one account and GitHub forbids approving
  your own PR, so a required approval would deadlock the repo outright. Review is a
  comment-only review from a separate session, recorded in the PR template — configured
  as `required_approving_review_count: 0` on a _present_ `required_pull_request_reviews`
  object, because that object's presence is what requires a pull request at all. Setting
  it to `null` does not mean "no approvals needed", it means no pull request needed, which
  would remove half the gate while appearing to comply.

  And the branch is **deliberately not required to be up to date before merging**
  (`strict: false`). One writer means the up-to-date rule prevents no real race, while
  `dist/` is about to become a committed build artifact — and generated output has no
  merge driver, so a forced branch update over it is not hand-resolvable. The only correct
  resolution there is always "rebuild and commit". Turning `strict` on would convert that
  into a recurring obstacle in exchange for nothing.

  Merged branches are now deleted automatically (`deleteBranchOnMerge`), which had been
  off since the repo was created.

- **`AddTaskModal`'s `initial*` props are now `default*`** — `initialTitle`,
  `initialDueDate`, `initialPoints`, `initialAssignee` and `initialLabel` become
  `defaultTitle`, `defaultDueDate`, `defaultPoints`, `defaultAssignee` and `defaultLabel`.
  **This is a breaking rename with no alias kept**, landing as a minor bump under SemVer's
  pre-1.0 carve-out, per `CONTRIBUTING.md`'s versioning policy.

  `initial*` was the only place in the kit using that prefix. Every other uncontrolled seed
  is `default*` — `defaultValue`, `defaultSelected`, `defaultSelectedKey`, `defaultOpen` —
  following React Aria, and one component spelling it differently is a reason to go and read
  the source instead of trusting the pattern. The semantics are the `default*` ones: read
  when the widget opens, then owned by the field. Opening is this widget's mount, because a
  closed one renders nothing.

  Done now rather than deferred because the props' behaviour changed in the same release
  anyway (see the reopen fix below), and because the cost is at its lowest it will ever be:
  the one consumer imports `Menu`, `Modal`, `MultiSelect` and `Select` and nothing else.

### Fixed

- **`README.md`'s install command, which has never worked.** Step one was
  `npm install @ravn/ui-kit`. Nothing publishes this package and `@ravn` is not a scope this
  project owns, so the command either fails or installs a stranger's code. It now shows the
  git install, and states the two things that make it keep working: pin a tag rather than a
  branch, because a branch re-resolves on every `npm ci` behind an unchanged lockfile entry;
  and `dist/` is committed, so what installs is the tagged artifact rather than a rebuild.

- **Three figures in `CLAUDE.md` that no reader could check.** All three came from planning
  documents that are gitignored, so they read as authoritative and resolved to nothing.
  - "Current compliance is 99.2%" for JSDoc — `99.2` appears nowhere else in the repo and
    nothing computes it. The rule (every exported prop carries JSDoc) stands without it.
  - "Measured 833px floor" — every tracked occurrence of `833` is a Figma line range
    (`L552-833`) or the hex `#fe833d`. No such measurement exists. The `232px` in the same
    sentence does: `application-sidebar.tsx:48` is `w-[232px] shrink-0`, so it is kept and
    cited, and the Decisions page derives what is derivable (328px of `AppShell` chrome, a
    1436px fitting width for the table view) from class names instead.
  - "16 axe contrast violations, all `TextButton variant="primary"`" — the count was right
    by accident (16 nodes) but "all" was not. `.storybook/a11y-allowlist.ts` accepts
    `color-contrast` on 14 stories: 12 rendering `TextButton`, and 2 rendering a trigger
    `floating-popover.stories.tsx` hand-rolls with the same pairing. The allowlist is also
    not uniformly "accepted" — its `aria-prohibited-attr` entries are open debt with an
    issue attached — which a bare count erased.

- **`README.md` and `introduction.mdx` no longer cite `UI_KIT_MASTER_PLAN.md`.** It is
  gitignored (`.gitignore:30`), so "see it for the ground-truth audit log this library was
  built against" resolved to nothing for every reader but its author — and the
  `introduction.mdx` copy was published. Both now point at `Decisions`, and
  `introduction.mdx` says plainly that the audit log is not part of this repository and
  that the per-value citations live at the call site in each component.

- **`clsx` and `tailwind-merge` were compiled into `dist/index.js`.** Both are declared in
  `dependencies` but neither was in `rollupOptions.external`, so Rollup inlined them — the
  bundle opened with clsx's source verbatim and carried tailwind-merge's class-group config
  inline — while npm separately installed the real packages, which nothing imported. A
  consumer shipped two copies of each.

  For `tailwind-merge` that costs more than bytes. A Tailwind v4 app near-certainly has its
  own instance, and a consumer calling `extendTailwindMerge` to teach it about custom class
  groups can only reach that one; the copy sealed inside this bundle would go on resolving
  the kit's `cn()` calls under the stock config and disagree with the app about which of
  two conflicting classes wins. Left external, `cn()` imports the consumer's copy.

  **`dist/index.js`: 183,908 → 103,225 bytes, a 44% cut**, which is the whole of it —
  `dist/ui-kit.css` is byte-identical, and both packages now appear as bare imports. They
  resolve for the one consumer that exists: the app declares `clsx` and `tailwind-merge` as
  its own direct dependencies (`^2.1.1`, `^3.6.0`), and npm would install them transitively
  from this package's `dependencies` in any case.

- **The published prop table was hiding most of the API.** `.storybook/main.ts`'s
  `propFilter` dropped every prop whose declaring interface resolved out of `node_modules`.
  Every interactive component here extends a React Aria props interface, so that removed
  most of what a consumer can actually pass: `Button`'s autodocs listed `variant`,
  `isSelected`, `children`, `aria-label` and `className`, and hid `onPress`, `isDisabled`,
  `autoFocus` and `excludeFromTabOrder` — the entire interaction API.

  Measured across the component tree: **236 of 534 props reached a reader**, with ten
  components affected — `Button`, `TextButton`, `Input`, `Datepicker`, `Select`,
  `MultiSelect`, `Menu`, `ListBox`, `FloatingPopover`, `FormField`. (`TextButton`, not
  `Card`, which the work was filed against: `Card` extends only `React.HTMLAttributes`, so
  everything it hides is DOM noise and it is correctly unchanged at 2 props.) This is worth
  more than a tidier table — `CONTRIBUTING.md` mandates JSDoc on every exported prop
  _because_ autodocs publishes it, and `README.md` sends consumers to that Storybook as the
  API reference, so one line was withholding documentation already written.

  Replaced with an allowlist keyed on `react-aria`, `react-stately`, `@react-types/*` and,
  defensively, the scoped `@react-aria/*`/`@react-stately/*` names. **The umbrella packages
  are the load-bearing part.** This kit imports from `react-aria`/`react-stately` per
  CONTRIBUTING.md's hooks-only rule, so docgen resolves parents to
  `node_modules/react-aria/dist/types/**` — an allowlist of the scoped names alone, which
  is the obvious form of this fix, matches nothing here and would go on hiding `isDisabled`
  while looking correct.

  `@types/react`'s 531 DOM attributes stay hidden; that is what the original filter was
  for. React Aria documents its own props, so nothing restored here renders as a blank row:
  **zero of the 534 are undocumented.** Verified in a real `build:storybook` rather than
  from the config — `Button`'s emitted docgen block carries 43 props including all four
  named above, and no `accessKey`/`contentEditable`/`onAnimationStart`.

- **`src/index.ts`'s `import './styles/theme.css'` is annotated as build-time only.** It
  reads like "importing the barrel gives you styles", and it does not: `@tailwindcss/vite`
  extracts it to `dist/ui-kit.css` and emits no `.css` import into `dist/index.js`, so
  nothing resolves at a consumer's runtime and `sideEffects: ["*.css"]` is correct but
  moot. `README.md` §2 documents the real, manual two-path step.

  Annotated rather than removed, and the comment says why: this import is the only thing
  pulling `tailwindcss` and `tokens.css` into the library build graph, which makes it the
  sole reason `dist/ui-kit.css` is emitted at all. Deleting it as dead code takes that file
  with it, and with it `package.json`'s `"./ui-kit.css"` export and README §2's Path B.

- **A CI comment described a vulnerability that had been fixed.** The `Audit dependencies`
  step claimed one known, accepted moderate `uuid` advisory via
  `@storybook/addon-essentials`, and that clearing it meant downgrading to Storybook 7.0.6.
  It was cleared instead, by `"overrides": { "uuid": "^11.1.1" }` in `package.json`, and the
  comment outlived the fix — `npm audit` reports **0 vulnerabilities even at `moderate`**.
  Every reader since had been told there was an open hole.

  Replaced rather than deleted, because `--audit-level=high` needs a reason now that its
  stated one is gone: it is a policy about what stops a merge, not a record of anything
  accepted.

- **`EstimateModal`'s header label overflowed its own popover on every machine without
  Apple's system font** — which is every Linux and Windows one, CI included.
  `whitespace-nowrap` is now `truncate`.

  `--font-sans` is `'SF Pro Display', system-ui, sans-serif` and this package ships none
  of the three, so the rendered width of a label depends on the machine. macOS is saved by
  the _second_ entry — `system-ui` resolves to the SF system font, and "Estimate" at
  20px/600 measures 86.5px, inside the 88px content box that `w-[122px]` plus `px-4`
  leaves. A Linux runner has neither of the first two, falls through to `sans-serif` ->
  DejaVu Sans, and renders the same string at 105.5px — past the popover's own border.
  `whitespace-nowrap` supplies only half of what was needed here; `truncate` adds
  `overflow: hidden`, which both clips the label inside the card and drops the flex item's
  automatic minimum size from min-content to 0 so it can clip at all. `LabelModal` and
  `AssigneeModal` render the identical header and already used `truncate`; `EstimateModal`
  was the outlier, and neither of the other two has enough text to overflow anyway.

  This surfaced as an accessibility failure rather than a visual one, because axe refuses
  to compute a contrast ratio for text whose background box does not contain it: it
  reported `color-contrast` as `incomplete`/`elmPartiallyObscured` on
  `Components/Modal/Estimate`'s two stories in CI and reported nothing at all on macOS.
  The colour was never in question — the pairing measures **5.11:1**, and does so in both
  environments now. A 0.5px overflow was.

  The gate is what caught it, and the shape of the catch is worth keeping: because the
  ratchet is bidirectional, an environment-specific finding has no valid allowlist entry —
  listing it fails locally as `GONE`, omitting it fails CI as `NEW`. There was no way to
  record this and no way to avoid fixing it. `.storybook/a11y-allowlist.ts` and
  `CONTRIBUTING.md` now say so, and `CONTRIBUTING.md` gives the one-line devtools override
  that reproduces the runner's wider font locally.

- **`TaskTableRow` could not be opened from the keyboard at all.** Its `onClick` sat on the
  `<tr>` with no `role`, no `tabIndex` and no `onKeyDown`, so opening a task from the table —
  the primary task surface in the consuming app — required a pointer. The title now renders
  as a real `<button>` when the row is clickable, named by the task title, and the row-wide
  handler stays beside it as a pointer convenience. The `<tr>` itself could not become the
  control: `role="button"` on it strips the `row` role the table depends on.

  The row's own controls no longer open the task either. The select checkbox and the
  "Details" link bubbled their clicks into the row handler, so ticking a checkbox opened the
  task you were trying to select — and that only gets more reachable now that the row's
  controls sit in a keyboard sequence, since activating a control synthesises a click that
  bubbles the same way.

- **`TaskCard` was one giant ARIA button.** It solved the same problem correctly — `role="button"`
  - `tabIndex={0}` + Enter/Space on the card container — but at the container's expense: the
    control's accessible name was the card's entire text content ("Fix bug 5 Pts OVERDUE BUG
    Fernando Ramirez 12 comments"), and every interactive child it may hold sat inside a button,
    which is invalid. It now uses the same explicit title button as the table row, via a new
    optional `onTitleClick` on `ProjectInfo`.

  That container role was also masking real findings. A button's descendants are
  _presentational children_ in ARIA, so axe stopped evaluating roles inside the card and never
  reached `TaskMetaBadges`' `aria-prohibited-attr` defect — which its own stories have been
  reporting all along. Two `TaskCard` stories now report it too. Nothing about the badges
  changed; the mask came off. Both new allowlist entries carry the same pointer to the issue
  that closes all four.

- **`AddTaskModal` came back up holding the previous task's values.** `isOpen` gates rendering
  _below_ the hooks, so the widget is never unmounted and keeps its state across a close/open
  cycle, and Cancel blanked the title rather than restoring it. Open on "Foo", cancel, reopen
  on "Bar" and the field came up empty — which is exactly the edit-reuse case those seed props
  exist for, and the case the component's own doc comment advertises. A consumer could not fix
  it with a `key`, because nothing tells it the widget is holding stale state.

  Every field is now re-seeded on the closed → open edge, during render rather than in an
  effect, so the first frame is already correct instead of painting the previous task's values
  and correcting them. It is bound to that edge and not to the props, so a parent re-render
  cannot throw away a half-typed title. Cancel and submit both return the form to the props'
  values: for the create flow those are empty and it clears exactly as before; for the edit
  flow it is the task as it was opened, which is the only defensible reading of "reset" there.

## [0.3.0] - 2026-08-05

### Added

- **`isLabelVisible` on `Input`, `Datepicker`, `Select` and `FormField`**, defaulting to
  `false`. The design draws no field labels anywhere — not in the Add/Edit Task modal, not
  on the search bar, nowhere across 100 export files — so a label is now `sr-only` unless
  a consumer opts in. It still names the control for assistive tech either way, so this is
  a visual change only. **Consumers that relied on a painted label must pass
  `isLabelVisible`**; in practice that is a change from labels nobody asked for
  (`BoardFiltersBar`'s filter pills grew a row of them when it adopted `Select`).
- **`--color-muted-on-light`, `--color-muted-on-dark`, `--color-interactive-text` and
  `--color-danger-text`** — text roles for surfaces where the existing alias is unsafe.
  `--color-muted`, `--color-interactive` and `--color-danger` are now documented as what
  they are good for (dark-surface text of known placement, fills, borders) rather than
  used everywhere.
- **A contrast guard** (`src/styles/contrast.test.ts`). Parses `tokens.css` and asserts
  every sanctioned foreground/surface pairing against WCAG AA, so a colour change fails
  the suite instead of shipping. It found two failures in the very fix it was written to
  verify, plus one in a doc comment claiming a border cleared 3:1 everywhere when it does
  so on one side only.
- **A shared form-field surface** (`FormField`, `FieldMessages`, `RequiredIndicator`).
  Only `Input` and `Datepicker` accepted an `error` at all — `Select`, `MultiSelect` and
  `LabelCheckbox` had no way to report one, so a consuming form could reject a field it
  then could not mark. All five now take `error` and `description`, rendering the same
  markup with the same `aria-describedby` association, built on react-aria's `useField`
  rather than a parallel hand-rolled one. `Input`, `Datepicker`, `Select` and
  `LabelCheckbox` also take `isRequired` and render a shared `*` indicator, which is
  `aria-hidden` because react-aria already carries required-ness in the accessibility
  tree. `FormField` wraps controls the kit does not own.

  Three things this pass deliberately did _not_ do, each verified rather than assumed:
  `Select`/`MultiSelect` triggers get **no** `aria-invalid`/`aria-required`, because
  neither is a supported state of `role="button"` and emitting them would be invalid
  ARIA (the same class of bug this kit already fixed on `SegmentedControl`);
  `MultiSelect` therefore exposes no `isRequired` at all; and `DatePickerMenu` gets no
  error surface, because it is a floating calendar with no label or trigger of its own —
  a message rendered inside it would vanish on dismiss. `Select`'s `isRequired` is
  visual-only in this react-aria version (`HiddenSelectProps` has no `isRequired`), which
  is documented at the call site and pinned by a test that will fail on upgrade.

- **A toast/notification system** — `ToastProvider` plus a `useToast()` hook, built on
  react-aria's `useToastState`/`useToastRegion`/`useToast` and portalled via
  `createPortal`. Tones come from the shared `StatusTone` vocabulary; `duration`,
  `maxVisibleToasts`, `label` and `closeLabel` are all configurable, and an individual
  toast can pass `{ timeout: null }` to stay until dismissed — right for an error the
  user must acknowledge, wrong for anything else.

  Ported from the consuming app, carrying across the correctness the app had already
  paid for: **a toast has to survive an open modal**. React Aria hides everything
  outside a modal from the accessibility tree, walking out from `document.body`, and
  notifications sit outside the modal by necessity. Two things together fix it and
  neither alone is enough — the region is marked as a top layer by `useToastRegion`,
  _and_ portalled to the body so it is a sibling of the modal rather than a descendant
  of the page being hidden. The `ToastRegion` doc comment spells this out; do not
  "simplify" it by keeping one half.

  No Figma source: the design file draws no notification surface anywhere.

- **A z-index scale** in `tokens.css` — `--z-index-nested` (10), `--z-index-overlay`
  (100), `--z-index-popover` (200), `--z-index-toast` (300), yielding `z-nested`,
  `z-overlay`, `z-popover` and `z-toast`. `Modal`'s backdrop and `FloatingPopover` both
  hardcoded a bare `z-50` with no documented relationship, so a `Select` or `Menu` opened
  from inside a `Modal` tied with it and resolved on DOM order — which is to say, on
  luck. `AddTaskModal`'s four raw `z-10`s are on the scale too.

  `popover` deliberately outranks `overlay`: a surface has to clear whatever opened it,
  and a portalled popover is a _sibling_ of the modal rather than a descendant, so
  nothing else would put it on top. Gaps are 100 wide so a consumer can slot a layer
  between two kit layers without renumbering.

  Namespaced `--z-index-*` rather than `--z-*` because Tailwind v4 derives `z-<name>`
  utilities from that namespace specifically — a `--z-*` name compiles to no class and
  no error, which was caught by grepping the built `ui-kit.css` rather than assumed.

- **`EmptyState`** — a labelled `role="group"` with title/description/icon/action slots.
  The kit previously shipped two hardcoded English strings for exactly this ("No tasks in
  this view." in `TaskListView`, "No tasks yet." in `TaskTable`), which a consumer could
  neither translate, restyle, nor attach a "create the first task" action to. Both call
  sites now render an `EmptyState`, and both components gained `emptyTitle`,
  `emptyDescription` and `emptyAction` props.

  Ported from the consuming app's own `EmptyState`, including the reasoning that keeps it
  from being a live region: it used to carry `role="status"`, but a live region announces
  _changes_ to its contents and this mounts with its text already inside, so it announced
  nothing. That is pinned by a test now, not just a comment. No Figma source — the design
  file draws no empty state anywhere; the doc comment says so.

- **One named type per colour axis** (`src/types/color-variants.ts`, exported from the
  package root): `AccentColor`, `StatusTone`, `DueDateUrgency`, plus the shared
  `DUE_DATE_URGENCY_COLOR` map. Four small colour unions had grown up independently and
  two of them reused the same words for different things — `variant="primary"` meant
  "this is the primary action" on a `Button` and "this chip is red" on a `Tag`, and
  `warning` meant one thing on a `Badge` and another on a due date. Nothing in either
  name said which system you were in.

- **An icon set** (`src/components/icons/`), exported from the package root — 21
  glyphs covering every icon the kit draws internally plus every icon the
  consuming app maintained separately. Previously the kit shipped **zero** icons
  while baking ad-hoc inline `<svg>` literals into eleven of its own components,
  and typed every icon slot (`SidebarItemProps.icon`, `TagProps.icon`,
  `TaskMetaBadge.icon`, ...) as `React.ReactNode` — pushing the whole glyph
  vocabulary onto the consumer with no shared source of truth.

  Each icon is a separate export rather than one `<Icon name="..." />`, so an
  unused glyph tree-shakes out and a typo is a compile error instead of a blank
  render. Icons are decorative by default (`aria-hidden`), and promote themselves
  to `role="img"` when given an `aria-label`/`aria-labelledby`. Sizing is the
  caller's job via `className` — see the module doc comment for why the artboards
  are deliberately _not_ normalised to square viewBoxes.

  Every glyph records its provenance in one of three tiers: Figma-exported
  (verbatim path data, 15 icons), reconstructed from Figma layout metrics
  (`ChevronLeftIcon`/`ChevronRightIcon`, derived from the recorded box, stroke
  width and percentage insets in `Date Picker.md`), or no Figma source at all
  (`ChevronDownIcon`, the double chevrons, `CloseIcon` — engineering additions for
  controls the design never drew, each with its reason stated).

- Prettier (`format`, `format:check`), coverage reporting (`coverage`), and a
  `gate` script composing typecheck → lint → format:check → coverage. CI now runs
  the single `gate` command so it cannot drift from what `CONTRIBUTING.md` asks a
  developer to run. Coverage thresholds were seeded at the suite's actual numbers
  (79/80/73/79) rather than an aspirational figure, and have only moved upward
  since — see Changed for where they stand now.
- `"./ui-kit.css"` package export (`dist/ui-kit.css`), documented as the fallback
  integration path for consumers not running their own Tailwind CSS v4 build.
  Previously the file was built but had no `exports` map entry, so
  `import '@ravn/ui-kit/ui-kit.css'` threw `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- `sideEffects` field in `package.json` so bundlers that respect it can
  tree-shake unused component modules; scoped to `*.css` since the token/theme
  imports are this package's only real side effects.
- `CHANGELOG.md` (this file).
- `vitest.setup.ts`, wired via `vitest.config.ts`'s `test.setupFiles`, polyfills
  `CSS.escape` — jsdom doesn't implement it, and react-aria's collection-
  selection internals (used by `Tabs`/`useTabList`, and any future
  collection-based component) call it to build `[data-key="..."]` selectors.
- `Popover`, a new shared internal floating-surface primitive (react-aria's
  `useOverlay` + `DismissButton` + `FocusScope`, non-modal, `role="dialog"` by
  default) — see that component's doc comment for the design decision.
  `DatePickerMenu`, `AssigneeModal`, `EstimateModal`, and `LabelModal` are now
  built on it instead of each being an independent plain `<div>` with no
  Escape/outside-click dismissal, focus management, or role at all.
- `@internationalized/date` peer dependency, alongside the existing
  `react-aria`/`react-stately` peers — needed for `DatePickerMenu`'s new
  `useCalendarState`-based day grid (see Fixed, below).
- `Menu`, a new dropdown/action-menu component (react-stately's
  `useMenuTriggerState`/`useTreeState` + react-aria's
  `useMenuTrigger`/`useMenu`/`useMenuItem`, composing the existing
  `FloatingPopover`) — e.g. a task card's three-dot options menu. Generic
  over item type via the same Collection/`<Item>` composition `Select`/
  `ListBox`/`Tabs` use. See the component's doc comment for why it bakes in
  no default trigger chrome and exposes no selection or "destructive item"
  API.

### Changed

- **`TextButton variant="primary"` is documented as a deliberate WCAG AA failure**, not
  fixed. `text-main` on `bg-primary-4` measures **3.83:1**; `isSelected`'s `primary-3`
  fill is 2.83:1 and the disabled/hover `primary-2` is 2.02:1. Fourteen of the 131
  contrast violations are this button.

  It is the one place in the kit where the design has a definite opinion that fails AA,
  rather than being silent — and unlike `Tag`, `Badge` and `Avatar`, which were fixed in
  this pass, it has nowhere to go. No label colour clears it (the darkest thing in the
  palette, `neutral-5`, reaches 4.02:1) and no fill in the ramp clears it (`primary-4` is
  already its darkest step). The only fix is a darker red Figma does not contain —
  continuing the ramp's own arithmetic lands on `#D13323` at 4.99:1 — and inventing a
  value is what CONTRIBUTING.md's first design value forbids. Changing it would also
  leave two different reds side by side, or repaint `--color-primary-4` itself and with
  it every brand surface in both repos.

  The error-colour precedent does not transfer: the design draws no error state at all, so
  that ramp step was a free choice constrained only by contrast. `contrast.test.ts`
  asserts the current state so it cannot be mistaken for passing.

  The **icon** `Button`'s `variant="primary"` shares the fill and is unaffected — an icon
  is non-text, so 1.4.11's 3:1 applies and 3.83:1 clears it. Same for
  `Button variant="secondary" isSelected`'s `primary-4` border and icon, which are
  recorded as failing 3:1 on `surface-overlay` only (2.86:1) and likewise left as drawn.

- **BREAKING — `Tag`'s colour variants are renamed to the design's own names.**
  `primary` → `red`, `secondary` → `green`, `tertiary` → `yellow`; `neutral` and
  `blue` are unchanged. Figma's "Tag" COMPONENT_SET carries a `Type` property whose
  values are literally `General`/`Green`/`Blue`/`Yellow`/`Red` (Tags00.md, Tags01.md);
  the kit had renamed those to ramp positions, which both obscured the source and
  collided with `Button`'s hierarchy words. **No colour values changed** — `red` is
  still `primary-4` (`#DA584B`), not the `danger` ramp. Affects `Tag.variant`,
  `TaskCard.tags[].variant`, `TaskTableRow.tags[].variant`, `TagCell.labels[].variant`,
  `LabelModal`'s `Label.variant`, and `TaskTableRow.indicatorColor` (whose default
  moves from `'secondary'` to the identical `'green'`).

  Landing this now rather than after the consuming app migrates is deliberate: the app
  does not yet use the kit's `Tag`, so today this touches call sites once instead of
  twice. Per `CONTRIBUTING.md`'s pre-1.0 carve-out this ships as a **minor** bump
  (0.2.0 → 0.3.0), called out explicitly here as required.

- **BREAKING — due-date urgency `'warning'` is renamed `'soon'.`** Affects
  `TaskCard.dueDateUrgency`, `TaskTableRow.dueDateUrgency` and `DueDateCell.urgency`.
  `warning` collided with `StatusTone`'s `warning` while meaning something unrelated
  and resolving to a different ramp; `soon` also matches the consuming app's existing
  `DueDateTone`, so the two sides no longer need a translation table for this concept.
  All three components now read the shared `DUE_DATE_URGENCY_COLOR` map instead of
  each keeping a private copy.

- `TaskCard.tags[].variant` gains `'blue'`, which `TaskTableRow.tags[].variant` already
  accepted — the two lists had silently diverged.
- `Badge.variant` is now the exported `StatusTone` and `Button`/`TextButton`'s `variant`
  is unchanged, both deliberately: status tones resolve to the palette's separate
  `Success`/`Warning`/`Danger` ramps (not the brand ramps), and a button's variant is
  an action-hierarchy axis where colour is a consequence. Merging either into
  `AccentColor` would have recreated the collision this change removes.
- **Eleven components now render the design's real glyphs** instead of hand-drawn
  approximations, as a side effect of adopting the icon set above. This is a
  visual change, not just a refactor: the kit's local `AlarmIcon` was a drawn
  clock face where the design uses `remix-icons/line/system/alarm-line`, and the
  "estimate" trigger in `AddTaskModal`/`EstimateModal` was a flag where the design
  uses its points glyph. Affected: `TaskCard`, `TaskTable`, `DatePickerMenu`,
  `AddTaskModal`, `EstimateModal`, `Modal`, `Select`, `MultiSelect`, `SearchBar`,
  `TopNav`. The date picker's navigation chevrons also drop from a 2.5px stroke to
  the 2px the design records.
- `TaskTable`'s internal `CheckIcon` renamed to `CheckboxBoxIcon` — it draws a
  rounded square and has never contained a checkmark. It stays inline rather than
  joining the icon set, as does `LabelCheckbox`'s box: both are renderings of a
  control's state, not glyphs from the design's vocabulary. (The duplication
  between the two is real and remains tracked in `MIGRATION_GAPS.md` Section 3 —
  the fix there is one shared checkbox control, not one shared icon.)
- Coverage thresholds ratcheted 79/80/73/79 → 85/83.8/79.5/85, following the new
  test suites for the icon set, `Tag` (previously untested — a `MIGRATION_GAPS.md`
  Section 5 gap), `EmptyState` and the toast system. Statements now match the consuming
  app's own 85% bar. Per `CONTRIBUTING.md` these only ever move upward.
- `README.md` and `src/styles/introduction.mdx` now document both CSS
  integration paths (`theme.css` for Tailwind consumers, `ui-kit.css` as the
  fallback) instead of only the `theme.css` step, which alone leaves a
  non-Tailwind consumer with zero component styling.
- Declaration-file generation now uses `vite-plugin-dts`'s `rollupTypes: true`
  to produce a single bundled `dist/index.d.ts`, and the separate
  `tsc --emitDeclarationOnly` build step has been removed. Previously both
  `vite-plugin-dts` and the `tsc` pass independently mirrored the full `src/`
  tree into `dist/src/**/*.d.ts` (including `.stories.d.ts`/`.test.d.ts` files
  and a leaked `dist/.storybook/decorators.d.ts`), inflating the published
  package to 82 files / 260.9 kB. The published package now ships 6 files.
- **Breaking:** renamed the `Modal` module's `useModal` convenience hook to
  `useModalState`. It never conflicted with react-aria's own `useModal` hook at
  runtime (the real one wasn't imported), but now that `Modal` itself uses
  `useModalOverlay` — which composes react-aria's `useModal` — keeping the name
  was confusing API surface.
- **Breaking:** `AssigneeModal`, `EstimateModal`, and `LabelModal` now require
  a new `onClose: () => void` prop (called on Escape or an outside click) and
  accept an optional `triggerRef` (excludes the trigger button from
  outside-click dismissal, so re-clicking it to close doesn't immediately
  reopen it — see `Popover`'s doc comment). `AddTaskModal`, the only consumer
  in this repo, is already updated; any other direct consumer of these three
  components needs to pass `onClose` too.
- **Breaking:** `DatePickerMenu` now also requires `onClose: () => void` and
  accepts an optional `triggerRef`, for the same reason as above. Lead/trail
  days from adjacent months in its calendar grid are now non-interactive
  (`isOutsideMonth` cells are disabled per react-aria's `useCalendarCell`)
  instead of independently clickable/selectable — see the component's doc
  comment for why this is a net accessibility improvement, not a regression
  against verified Figma spec (only the dimmed _styling_ of those cells was
  ever spec-confirmed, never their interactivity).
- `AddTaskModal`'s four trigger buttons (Estimate/Assignee/Label/Due date) now
  carry `aria-haspopup="dialog"` and `aria-expanded`, previously absent.

### Fixed

- **The `Card` story's heading was invisible.** `text-neutral-1` — pure white — on `Card`'s
  own white surface, **1.00:1**, on the two lines whose sibling `<p>` this pass edited
  without noticing. It survived because **axe files exact 1:1 text under `incomplete`, not
  `violations`** (messageKey `equalRatio`: it cannot tell invisible text from deliberately
  hidden decorative text, so it asks for a human). A `resultTypes: ['violations']` sweep is
  therefore blind to the worst pairing there is. The audit harness now collects `incomplete`
  too, which also surfaced `SidebarItem`'s badge above under `shortTextContent`.

- **Stories render on the surfaces their components actually live on.** Fifteen of the 131
  violations were Storybook artifacts rather than kit defects — components drawn on the
  light default canvas when every real consumer surface is dark. `TaskListView` and
  `TaskTable` take `withSurface('neutral-5')` (they sit on the app shell) and `SidebarItem`
  takes `withSurface('neutral-4')` (it only ever renders inside `ApplicationSidebar`, whose
  fill is `bg-surface-panel`) — the same fix `Input` and `Datepicker` took earlier. Three
  more came from story bodies rather than decorators: `Card`'s sample paragraph now uses
  `text-muted-on-light` inside the white card, `Modal`'s uses `text-muted-on-dark`, and
  `Icons`' colour demo applies its tone to the icon instead of to the whole column, which
  had been tinting the caption in two colours documented as unsafe for text.

- **Marking a field invalid silently downgraded its focus ring.** `Input`, `Datepicker`,
  `Select` and `MultiSelect` each write `focus-visible:outline-danger-5` on their
  `error &&` line — and because `cn()` is tailwind-merge, that override _replaces_ the base
  ring rather than adding to it. So an invalid field's focus ring was **2.55:1** on an
  overlay, worse than the 5.43:1 it replaced, on exactly the surface a form is most likely
  to sit on. All four are now `--color-danger-text` (5.65 / 6.94 / 7.95:1), which is also
  the token `Select`'s invalid _ring_ already used two lines above.

  This is why the previous entry's claim of "every focus ring" was wrong: the recolour
  swapped `outline-primary-4`, and these four say `outline-danger-5`. `contrast.test.ts`
  now asserts both the fixed ring and the fact that danger-5 measured worse than what it
  replaced, and its prose no longer claims a number it cannot prove.

- **`ListBox` and `Menu` had no visible keyboard focus.** The arrow-key focus indicator was
  a `bg-neutral-4` fill drawn on a `surface-overlay` popover — **1.23:1**, and 1.00:1 for a
  bare `ListBox` on a panel — with `outline-none` on the item removing any other
  affordance. Both now draw an inset `--color-interactive-text` ring (5.43:1) and keep the
  fill as a quieter secondary cue. This matters most on `Menu`, which is the sole entry
  point to Edit/Delete in the consuming app, and which this kit has already lost a focus
  indicator on once.

- **The `danger` toast's message text was 4.29:1.** It was the only tone in the map
  inverting the pattern — a dark fill with white text — and the only one that failed.
  Moving the label to `neutral-5` on the same fill does not clear it either (3.59:1), so
  the fill moved to `danger-4`: **6.01:1**, and danger now matches `success` and `warning`
  as a saturated fill with dark text. No audit had ever measured a toast, because the kit
  renders none without a click.

- **Three more the ranked table never contained.** `LabelCheckbox`'s invalid box was
  `danger-5` at 2.55:1 — a stroked outline with `fill="none"`, so the "white field
  interior" argument that keeps `danger-5` on `Input`'s border does not apply to it, the
  same reasoning that already moved `Select`. `SidebarItem`'s active count badge was white
  on `primary-4` at 3.83:1, the CTA pairing on text the CTA's exemption does not cover, and
  fixable outright because `badgeCount` has no ground truth in the design at all. And
  `Tag`'s remove button dimmed its "×" with `hover:opacity-75`, which composites the glyph
  into its own chip and put yellow at 3.39 / 3.97 / 4.43:1 — failing on all three surfaces;
  it now darkens the background behind the glyph instead, which moves every variant the
  right way (nothing below 5.93:1).

- **`LabelCheckbox` and `TaskTable`'s row-select checkbox had no visible focus indicator
  at all.** Both hide the real `<input>` with `sr-only` and draw the ring on the wrapping
  `<label>` via `has-[:focus-visible]:`. Under that variant, `outline-2`'s
  `outline-style: var(--tw-outline-style)` does not resolve to `solid` the way it does
  under `focus-visible:` — so the width and the colour computed and **nothing painted**.
  That is 2.4.7 (Focus Visible), not a contrast failure: there was no indicator to
  measure. Both now carry an explicit `has-[:focus-visible]:outline-solid`.

  Found by counting pixels in a real browser, because every DOM API lied about it:
  `getComputedStyle` reported an `outline-color` for an outline that was never drawn —
  the exact trap the `outline-none` bug set for this kit once already. Zero ring pixels
  before on both; 1604 and 291 after. All 18 focusable controls sampled now paint a ring,
  and both classes are pinned by a test.

- **Every focus ring clears 3:1 on a modal.** All 39 rings across 24 files move from
  `--color-interactive` (`primary-4`) to `--color-interactive-text` (`primary-2`). A ring
  is `outline-offset-2`, so it is drawn clear of the control, on the container — it has
  exactly one adjacent colour, and the "passes against the field's white interior"
  argument that carries the invalid border does not apply to it. `primary-4` managed
  4.02:1 on the shell and 3.51:1 on a panel but only **2.86:1** on `surface-overlay`,
  which is a modal or a popover: exactly where a form is most likely to be and where
  losing the focus indicator costs the most. `primary-2` clears all three at
  5.43 / 6.67 / 7.63:1.

  This was recorded in `contrast.test.ts` as a known failure for one release because
  recolouring every ring is a visual change. Nothing was traded to fix it — the design
  file draws no focus state anywhere, so the ring was an engineering addition from the
  start and there was no Figma pairing to deviate from.

  **One caveat for consumers:** `primary-2` measures 2.02:1 on white, worse than the
  `primary-4` it replaces (3.83:1). No kit surface is light — `Input` and `Datepicker`
  have white _interiors_, but the offset puts the ring on the dark container outside them,
  and `Card`/`Badge` are the only light surfaces and neither is focusable — so a consumer
  placing a kit control on a light container of its own must override the ring colour.
  `contrast.test.ts` asserts that limit rather than leaving it to be discovered.

- **White labels on a solid `neutral-2` pill are now `neutral-5`.** At full strength
  `neutral-2` is a mid grey, and the white label the design draws on it measures
  **2.94:1**; `neutral-5` clears **5.25:1**. The fills are unchanged — the same trade
  `Tag` and `Badge` take.

  Five sites, only **two** of which axe could see: `SegmentedControl`'s active segment and
  `EstimateModal`'s selected row were visible, while the hover fills on `TextButton`
  secondary, `EstimateModal`'s unselected rows and both `AddTaskModal` triggers were not —
  a static story has no hover. `contrast.test.ts` pins the pairing so the arithmetic
  covers what the browser pass structurally cannot.

  This does cost `SegmentedControl` the spec's "identical label colour in both states,
  selection carried by the fill alone". The fill still carries selection; the label now
  agrees with it instead of being the one thing at 2.94:1.

- **The accent colour is no longer used as text.** `--color-interactive` (`primary-4`) is
  documented as a fill and border colour precisely because it fails as text on every dark
  surface — 2.86 / 3.51 / 4.02:1 over overlay / panel / shell — and four call sites were
  still painting labels with it: `Tabs`' selected tab, `SidebarItem`'s active and hover
  label, and `TaskTable`'s "overdue" due date. All now use `--color-interactive-text`
  (`primary-2`) at 5.43 / 6.67 / 7.63:1, except the due date, which takes `primary-2`
  as a raw ramp class because it is a status signal rather than an interactive
  affordance — the same reasoning that kept it off the alias before, and now in step with
  `Tag`'s red label.

  `TaskTable`'s "Details" button had the same problem in its **hover** state, which no
  static-story axe pass can see; it was found by reading. `Tabs`' 2px selection indicator
  and `SidebarItem`'s gradient wash keep `primary-4` — non-text, and neither is the only
  signal for its state.

- **`Tabs`, `EmptyState` and `SearchBar` take `--color-muted-on-dark` too**, on the rule
  rather than on a measured failure: none of the three paints a background of its own, so
  each renders on whatever a consumer puts it in, and `--color-muted` is only safe where
  that surface is known to be a panel or the shell (4.58 / 5.25:1 — but 3.73:1 on an
  overlay). A tab strip in a modal, or "no tasks match your filters" inside one, is an
  ordinary thing to build. axe reported none of these because every current story renders
  them on a panel; they were found by applying the rule the same pass had already used to
  justify `UserRow`.

  `TaskCard`, `TaskTable`, `TopNav`, `Modal` and `DatePickerMenu` are deliberately left on
  `--color-muted`: each paints its own surface and so knows what its text sits on.
  `SidebarItem` is left too — it has no fill either, but an item only ever renders inside
  `ApplicationSidebar`, which is a panel. Icons are untouched throughout: non-text, so
  1.4.11's 3:1 applies and `muted` clears it on all three surfaces (3.73 / 4.58 / 5.25:1),
  now asserted rather than assumed.

- **Secondary text on a popover uses `--color-muted-on-dark`.** `--color-muted`
  (`neutral-2`) clears AA on a panel (4.58:1) and on the shell (5.25:1) and measures
  **3.73:1** on `surface-overlay` — which is exactly what makes it easy to ship: a
  component built and reviewed on a panel is fine right up until it is dropped into a
  modal. Eight of the 131 violations were this one pairing: the `Assignee`, `Estimate` and
  `Label` popover headers, and `UserRow`'s role text rendered in a list inside them. All
  now measure 5.12 / 5.96 / 6.55:1.

  `AddTaskModal`'s title placeholder is swapped too, and axe never reported it — the story
  renders that field with a value, and a placeholder only exists while the field is empty.
  That is a general blind spot in a static-story audit, and the reason `contrast.test.ts`
  rather than the browser pass is what carries it.

- **`Badge`'s status labels clear AA on their own fills.** The same defect as `Tag`, on
  light fills instead of dark tints, and the only group the audit's ranked table missed —
  it missed them because `Badge` renders in few stories, not because they were close.
  `success-4` on `success-1` measured **1.69:1**, `warning-5` on `warning-1` **2.34:1**,
  `danger-5` on `danger-1` **3.90:1**. Fills and borders are unchanged.

  Warning and danger needed nothing invented: their ramps already carry a step 6 for
  exactly this, and `tokens.css` has had both all along — `warning-6` clears **6.10:1**
  and `danger-6` **7.04:1**. Success has no step 6, and there is no other dark green in
  the palette (`secondary-4`, the nearest, manages 2.50:1), so its label falls back to
  `neutral-4` — the colour the `neutral` variant already uses, at **13.09:1** — and the
  green fill carries the status alone. That is a palette gap, not a component decision,
  and `MIGRATION_GAPS.md` records it as one: the honest fix is a `success-6` from design.

  Adds `badge.test.tsx`, pinning both the fills (the design's, and they must not move) and
  the labels (three of four deliberate deviations, so a refactor cannot quietly restore
  the same-hue label).

- **`Tag`'s labels clear AA on their own tints.** The design paints label and fill from
  one swatch (`bg-X/10 text-X`), which is structurally incapable of clearing 4.5:1 — a
  10% tint of a colour is never far from that colour. Red measured 2.61 / 3.17 / 3.61:1
  over overlay / panel / shell and green 3.66 / 4.44 / 5.08, together 27 of the 131
  violations. **The fills are unchanged**; only the labels moved, because no choice of
  fill rescues them: `primary-4` as text clears 4.5:1 against nothing in this palette
  (best case 4.02:1, on the shell).

  | variant   | fill             | label                         | was                    | now                     |
  | --------- | ---------------- | ----------------------------- | ---------------------- | ----------------------- |
  | `red`     | `primary-4/10`   | `primary-4` → `primary-2`     | 2.61 / 3.17 / 3.61:1   | 4.98 / 6.02 / 6.86:1    |
  | `green`   | `secondary-4/10` | `secondary-4` → `secondary-2` | 3.66 / 4.44 / 5.08:1   | 5.50 / 6.67 / 7.64:1    |
  | `blue`    | `blue/10`        | `blue` → `main`               | 1.77 / 2.14 / 2.43:1   | 10.38 / 12.53 / 14.25:1 |
  | `yellow`  | `tertiary-4/10`  | unchanged                     | 4.73 / 5.74 / 6.58:1   | unchanged               |
  | `neutral` | `neutral-2/10`   | unchanged                     | 9.52 / 11.54 / 13.20:1 | unchanged               |

  `blue` is the one the palette cannot serve on its own terms: `--color-blue` is a
  standalone accent with no ramp, so there is no lighter step to reach for, and
  CONTRIBUTING.md's first design value rules out inventing one. Its tint alone now carries
  the variant. The outline style takes the same colour for border and label, except blue,
  whose border stays `--color-blue` — a white border would make it indistinguishable from
  the neutral outline tag. That border does not clear 1.4.11's 3:1 on any surface
  (1.87 / 2.29 / 2.63) and `contrast.test.ts` records it as the known limit.

  Visually, chips keep their hue and their exact Figma fill; red and green labels read a
  shade paler, and blue's label is white. **Consumers with committed screenshots of a
  board will need to retake them.**

- **`Avatar`'s initials are readable.** `bg-primary-1 text-primary-4` measured **2.61:1**,
  and was the largest single accessibility defect in the kit — 46 of the 131
  colour-contrast violations an axe pass over the built Storybook reports came from that
  one class, because an avatar renders in nearly every composed story. The initials are
  now `text-neutral-5` on the unchanged tint: **10.50:1**. Nothing was traded away for it
  — the design draws no initials state at all (every exported `Avatar` frame is
  image-filled), so the old pairing was invented rather than transcribed, and `neutral-5`
  is already this kit's text colour on a light surface.

- **`npm run build:storybook` works from a clean checkout.** Storybook's Vite builder
  loads the root `vite.config.ts` and inherits every plugin in it, so the Storybook build
  was also running the two that exist purely to produce the published package. Both then
  failed on a checkout where `npm run build` had not already run: `copy-theme-tokens`
  wrote into a `dist/` nothing had created (`ENOENT: ./dist/theme.css`), and once that
  was fixed, `vite:dts`'s `rollupTypes` step handed api-extractor a
  `mainEntryPointFilePath` that did not exist either. Only the first was known; the
  second was behind it. `.storybook/main.ts` now filters both out in `viteFinal`, which
  also stops the Storybook build from writing into `dist/` and drops ~2.5s of declaration
  rollup from it. CI had been passing on step ordering, not correctness.

- **The `Select` and `MultiSelect` triggers are the design's chip again**, not a white
  field. Both hardcoded `bg-surface-neutral` — `#FFFFFF` — so the consuming app's dark
  board carried four near-white 40px `rounded-md` pills, and its create/edit modal four
  more. (This entry said five. The fifth chip in that row is the app's own due-date filter
  markup, not a kit trigger — established in the app's PR #20 and never propagated back
  here.) Figma draws every dropdown trigger in this system as the same `Tag` atom:
  `rgba(148, 151, 154, 0.1)` over the dark surface, 4px radius, 32px tall, 4px/16px
  padding, white 15px/600 label (`Dashboard Add Task/Add Task Modal00.md:78-140`, and the
  same chip again filled in the Edit Task modal). The triggers now use `Tag`'s own
  `variant="neutral"` values, so a trigger and the chips beside it line up at 32px.

  The white surface came from the contrast fix above, which correctly repaired invisible
  white-on-white _value_ text by moving the trigger's interior to `Input`'s light-surface
  colours — but took `Input`'s **surface** along with its text colours without checking it
  against the design. `Input` is genuinely a light field; a dropdown trigger is not.

  Measured on the composited chip (overlay / panel / shell), all of it now pinned by
  `contrast.test.ts`:

  |                     | was               | now                                                                              |
  | ------------------- | ----------------- | -------------------------------------------------------------------------------- |
  | Trigger value       | `neutral-5`       | `text-main`, 9.52 / 11.54 / 13.20:1                                              |
  | Trigger placeholder | `muted-on-light`  | `text-muted-on-dark`, 4.61 / 5.33 / 5.88:1                                       |
  | Invalid boundary    | `danger-5` border | `danger-text` ring, 4.91:1 on the chip and 5.65:1 on the surface at the tightest |

  Two things fell out of the surface change rather than being chosen freely.
  `--color-muted` is the obvious placeholder colour and is what the app used before it
  migrated; on the chip it measures 3.24 / 3.93 / 4.49:1 and fails AA on all three
  surfaces, so `--color-muted-on-dark` carries the empty state. And the invalid boundary
  is a `ring-1` in `--color-danger-text`, not the `border-danger-5` `Input` and
  `Datepicker` use: their border clears 1.4.11 on the strength of the white field
  interior it separates from the container, an argument a chip has no interior to make,
  and `danger-5` measures 2.55:1 on `surface-overlay`. A `ring` also costs no layout,
  which a border on a control the design fixes at 32px would.

- **`MultiSelect` renders its selection as the trigger's value**, comma-separated, the
  way `Select` renders its single one — not as nested `Tag` chips. The chips were fine on
  a 40px field and incoherent on the chip that replaced it: a `Tag` is itself exactly
  32px, so two of them filled the trigger edge to edge and the control read as two loose
  tags beside a stray chevron. Only a browser could show that; the arithmetic and the
  jsdom suite were both happy. The design agrees — every filled picker in the Edit Task
  modal is one chip with plain white value text, never a chip inside a chip.

- **Nine WCAG AA contrast failures across the form surface.** Phase 1 measured three and
  deferred them because fixing meant choosing a colour the design does not define; a full
  audit found nine. Measured, before → after:

  |                                                | was    | now                                                   |
  | ---------------------------------------------- | ------ | ----------------------------------------------------- |
  | Field label (`neutral-3` on the shell)         | 1.41:1 | `sr-only` by default; `#FFFFFF` at 11.60:1 when shown |
  | Error text and required marker                 | 3.59:1 | `danger-3`, 5.65:1 on the tightest surface            |
  | Helper text on a modal card                    | 3.73:1 | `transparent-light-65`, 5.11:1                        |
  | Placeholder in a light field                   | 2.94:1 | `transparent-dark-65`, 5.64:1                         |
  | `ListBox`'s selected option                    | 2.86:1 | `primary-2`, 5.43:1                                   |
  | `ListBox`'s focused option                     | 3.51:1 | 5.43:1                                                |
  | `DatePickerMenu`'s "Today"                     | 4.02:1 | 7.64:1                                                |
  | `MultiSelect`'s chips over the white trigger   | 3.39:1 | 13.6:1                                                |
  | `Input`/`Datepicker` stories on a light canvas | —      | now dark, like every real consumer                    |

  The design has no labels and no error state at all, so several of these were invented
  rather than inherited: `#393D41` as label text appears nowhere in the exports as a
  `color`, and at 12px — a size the design system uses exactly once, on an iOS specimen.
  Where AA and the design conflict the colour deviates and the doc comment says so with
  the ratio, per the repo's flag-rather-than-guess rule.

  Two failures were **left open and asserted as such**: a focus ring on a
  `surface-overlay` measures 2.86:1, which would mean recolouring all 23 rings in the kit
  — a visual decision, not a bug fix — and `MultiSelect`'s light trigger contradicts the
  design's own dark chip treatment. The second is closed by the chip entry above. The
  focus ring is still open, still asserted, and still tracked in `MIGRATION_GAPS.md`.

- **The last two focusable elements with no focus affordance at all.**
  `AddTaskModal`'s task-name input and `SearchBar`'s search input each carried a bare
  `outline-none` and nothing else, so a keyboard user had no way to tell where they were.
  Both now use the kit's standard `focus-visible:outline-2 outline-primary-4
outline-offset-2` with no `outline-none` in front of it.

  This closes the sweep begun with the 32-site focus-ring fix. The four remaining
  standalone `outline-none` uses — the `<ul>`/`<li>` in `ListBox` and `Menu` — stay, and
  are correct: those show focus via `bg-neutral-4` instead. Verified by browser
  screenshot, since jsdom cannot evaluate `:focus-visible`; the tests pin the class
  pairing that broke.

- **Focus rings now actually render.** Every focusable component paired
  `outline-none` with `focus-visible:outline-*`, which in Tailwind v4 resolves
  to `outline-style: none` — the ring computed a width and a colour and painted
  nothing (32 sites across 21 components). Removing the redundant `outline-none`
  restores it, since `--tw-outline-style` has an initial value of `solid`. Note
  for consumers: because the offending class sat in the `utilities` layer, it
  also suppressed a consuming app's own `@layer base { :focus-visible { … } }`
  rule, so this could remove a focus indicator an app was otherwise providing
  for itself.
- `Popover`'s doc comment pointed at a file in the consuming app that has since
  been deleted; it now points at this kit's own `FloatingPopover`.
- `Modal` now uses react-aria's `useModalOverlay` instead of composing
  `useOverlay` + `useDialog` directly. Background page content is now
  `inert`/`aria-hidden` to assistive tech while a modal is open, and body
  scroll is locked — neither happened before, so a screen reader or keyboard
  user could still reach content behind an open dialog.
- `SegmentedControl`'s wrapper role is now `role="radiogroup"` instead of the
  invalid `role="group"` around `role="radio"` children. Also added arrow-key
  navigation (Left/Right/Up/Down/Home/End) with roving tabindex, matching the
  WAI-ARIA APG radiogroup pattern — previously each segment was an
  independent tab stop with no keyboard way to move between them.
- `Tabs` now uses react-stately's `useTabListState` + react-aria's
  `useTabList`/`useTab`/`useTabPanel` instead of a hand-rolled
  `role="tablist"`/`role="tab"`/`role="tabpanel"` implementation. Gets WAI-ARIA
  APG arrow-key navigation (Left/Right, Home/End) and roving tabindex for
  free — previously each tab was click-only with no keyboard way to move
  between them.
- `DatePickerMenu`'s day grid now uses react-stately's `useCalendarState` +
  react-aria's `useCalendar`/`useCalendarGrid`/`useCalendarCell` instead of a
  fully hand-rolled 42-individually-tabbed-button grid. Gets `role="grid"`/
  `role="gridcell"` and full keyboard navigation (arrow keys, Home/End,
  PageUp/PageDown, Shift+PageUp/PageDown) for free — previously a keyboard
  user had to Tab through up to 42 elements to reach a given date. The
  double-chevron year-nav buttons (no react-aria equivalent) call
  `state.focusPreviousSection(true)`/`focusNextSection(true)` directly.
- `AssigneeModal`, `EstimateModal`, `LabelModal`, and `DatePickerMenu` all
  gained real Escape-to-close, click-outside-to-close, and focus management
  by moving onto the new shared `Popover` primitive (see Added, above) —
  previously each was a plain `<div>` a parent conditionally mounted/
  unmounted with no dismissal affordance other than re-clicking the trigger.
- `FloatingPopover` now wraps its content in `FocusScope restoreFocus`.
  Previously, closing it (Escape, an outside click, selecting an option) left
  focus on `<body>` instead of returning it to the trigger — found while
  adding `Menu`'s Escape-returns-focus test, and confirmed as a pre-existing
  gap affecting `Select`/`MultiSelect` too, not something new to `Menu`.

## [0.2.0] - 2026-08-04

First version tracked by this changelog. Changes before this entry were not recorded
individually here — see `git log` for the full development history up to this point.

This section is a stub and stays one. It was written pointing at a planning document
(`UI_KIT_MASTER_PLAN.md`) which is gitignored, so the citation reaches no reader of this
repository — `README.md` and `introduction.mdx` carried the same dangling reference until
it was removed from both. Reconstructing the entries after the fact would mean inventing
them, which is worse than saying so here.

<!--
Compare links, per Keep a Changelog.

`v0.2.0` and `v0.3.0` are retro-tags, created with the packaging work and placed on
`main`'s existing history rather than invented: `v0.2.0` on `cd767cd`, the commit that
introduced `"version": "0.2.0"` (`b98dd0a` bumped it to 0.3.0), and `v0.3.0` on `ad3b5ad`,
`main`'s tip, still at 0.3.0. Before that these links pointed at refs that did not exist.

`v0.4.0` is cut by the reviewer on the merge commit, so the `[0.4.0]` link 404s until the
pull request merges — a release tag must not sit on an integration branch, where a squash
merge would orphan it. `v0.4.0-rc.1` exists at the branch tip in the meantime and is what
the consuming app pins while the switch-over is verified. See `CLAUDE.md`'s tagging
checklist.
-->

[unreleased]: https://github.com/f3r21/ravn-ui-kit/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/f3r21/ravn-ui-kit/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/f3r21/ravn-ui-kit/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/f3r21/ravn-ui-kit/releases/tag/v0.2.0

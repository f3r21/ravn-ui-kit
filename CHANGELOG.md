# Changelog

All notable changes to `@ravn/ui-kit` are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/) — see `CONTRIBUTING.md`
for the specific policy this repo follows for what bumps major/minor/patch.

## [Unreleased]

### Added

- **The prop surface is measurable now, and the two scripts that measure it are tested.**
  Repo tooling only; nothing ships and `dist/` is unchanged. **Patch.**

  `scripts/prop-surface.mjs` resolves the public API through the TypeScript checker and splits
  every prop by where it is _declared_: 307 the kit declares in `src/` against 1408 it inherits
  from `node_modules`, across 49 components, with the 21 icons reported apart because each takes
  `React.SVGProps<SVGSVGElement>` and inherits 488 props on its own —
  `node scripts/prop-surface.mjs`.

  That split is the point rather than a presentation choice. A prop the kit declares is one it
  owns and could remove; a prop it inherits arrives whether anyone decided anything or not, and
  `ButtonProps extends AriaButtonProps` brings 38 with it that no regex over the interface body
  will ever find — `node scripts/prop-surface.mjs --by-component | grep ' Button '`. Counting
  the two together answers no question worth asking, which is how an audit came to report "302
  props across 46 components": both readings were correct when taken, at `fa451a7` and `9ab508e`,
  and `6bc133f` moved them to 307 and 49 in a single commit.

  `scripts/consumer-prop-usage.mjs` is the other half — which of those props the sole consumer
  actually passes, parsed out of a checkout of the app rather than guessed. **Its figures are not
  reproducible from this repo alone** and the script's own header says so: the answer depends on
  which app ref you point it at, so a figure taken from it has to name one.

  Both are driven by `scripts/prop-surface.test.mjs`, which Vitest collects, so they run inside
  `npm run gate`. That is the point of it existing: `.claude/hooks/` shipped inert for a release
  and a line-based story probe reported six broken files where seven were, and both exited 0. So
  the classifier is asserted in both directions — `Button` declares `variant` and inherits
  `onPress`, `Tag` inherits nothing at all — and a separate case fails if the classifier collapses
  everything into one bucket, which the direction checks alone cannot see. Sabotaged five ways
  before being trusted; each one failed the cases it should and no others.

  One of those five found a case with no teeth. `ignores identically-named imports from other
packages` asserted that `Button` did not carry `'ignored'` from
  `<Other variant="ignored" />` — but `'ignored'` is the attribute's _value_ and `variant` its
  name, so it tested for a string the script cannot emit and passed with the package filter
  deleted. The fixture prop is now named `fromAnotherPackage`, which nothing else can produce.
  Recorded because a control aimed at a value the instrument never reports is indistinguishable
  from a working one until something breaks.

  Written for #129, which uses these figures to decide whether the prop surface should be cut
  before #11, #14 and #16 rewrite it. No component, prop, story or token changed.

## [0.8.0] - 2026-08-09

### Fixed

- **`release.yml` and `tag-check.yml` both said there were no `v*` rulesets; there is one.**
  Repo tooling only; nothing shipped. **Patch.**

  Both headers instruct the reader to re-derive rather than assume, which is what made the stale
  claims worth fixing rather than ignoring. Now measured:

  ```bash
  gh api repos/f3r21/ravn-ui-kit/rulesets -q length          # 1
  id=$(gh api repos/f3r21/ravn-ui-kit/rulesets -q '.[0].id')
  gh api "repos/f3r21/ravn-ui-kit/rulesets/$id" -q '[.rules[].type]'   # ["update","deletion"]
  gh api repos/f3r21/ravn-task-management-challenge/rulesets -q length # 1 — control
  ```

  **It forbids moving and deleting published tags, not creating them**, so #59 stays open — its
  title is the stale part, not its goal. `release.yml` also claimed #56 was "NOT built yet";
  `tag-check.yml` has existed and has fired twice on a real tag push.

  **The `GITHUB_TOKEN` argument against switching to a PAT is kept and strengthened**, not
  deleted: it is _more_ likely to be reached for now, because the next reader finds a backstop
  that visibly never runs for released tags rather than no backstop at all.

  Recorded in `tag-check.yml`: the `deletion` rule narrows its own remedy. "Delete it and
  re-cut" now requires the one repository role holding `bypass_mode: always` — which is exactly
  what #100 found missing when `v0.5.0` was deleted with no record.

### Fixed

- **Published doc comments no longer cite documents that exist on one machine** (#49, #50).
  Comments only; no behaviour change. **Patch.**

  **Twelve citations across ten source files** named `MIGRATION_GAPS.md` or
  `UI_KIT_MASTER_PLAN.md` — `icons.tsx` and `popover.tsx` carry two each — and **nine of those
  citations survived the build into `dist/index.d.ts`** — which is what a consumer installs, and
  which the consuming app's own `CLAUDE.md` names as the way to answer "what does this component
  do". Both files are gitignored (`.gitignore:42-43`) and exist in exactly one working
  directory, so the documented reading path terminated in a reference the reader cannot resolve
  or even tell had existed. Worse than a stale pointer: a stale one is falsifiable.

  **Each citation was replaced by what it was carrying, not repointed at another document.**
  Where the substance was already in the sentence the pointer was removed; where the pointer was
  the only support, the fact is now stated in the comment.

  `dist/index.d.ts` goes **9 → 0**:

  ```bash
  git show v0.7.0:dist/index.d.ts | grep -cE 'MIGRATION_GAPS|UI_KIT_MASTER_PLAN'   # 9
  git show HEAD:dist/index.d.ts   | grep -cE 'MIGRATION_GAPS|UI_KIT_MASTER_PLAN'   # 0
  ```

  A CI step greps the built output so this cannot regress. Deliberately **not** a source-side
  lint: citing these files in a comment is legitimate during a transition, and it is their
  survival into the published artifact that is the defect.

  **Six mentions in released `CHANGELOG.md` sections are left alone**, on purpose — those are a
  record of what was written at the time, not live citations, and editing a released section
  would make the history false.

  This entry names the files too, and so does its re-derivation command above. That is the
  point of the distinction rather than an exception to it: **the defect is a citation offered as
  retrievable authority, not the string appearing anywhere.** `CHANGELOG.md` ships in no
  artifact, and a changelog describing which citations were removed has to name them.

### Fixed

- **Nineteen story files did not comply with the `Playground` convention, and nothing checked**
  (#storybook-conventions). Stories, docs and a new test; no component source changed. **Patch.**

  Twelve files had a canonical story and **no `Playground`**; seven had a `Playground`
  byte-identical to another story — `menu.stories.tsx` had `export const Default: Story = {};`
  and `export const Playground: Story = {};`, both empty. A `Playground` identical to the story
  beside it exposes nothing.

  All nineteen now expose real controls. `scripts/stories-compliance.test.mjs` enforces it with a
  TypeScript AST, and `CONTRIBUTING.md` is updated so the prose and the test agree.

  **The ruling this encodes:** `Playground` is required everywhere and must differ from every
  other story in the file. The canonical example may be `Default` **or a descriptive name** —
  `AppShell` ships `Dashboard`, `Icons` ships `AllIcons`, `ViewSwitcher` ships `LeftSelected`,
  and all three are correct. The check deliberately does **not** assert a story named `Default`.

  Four new `.storybook/a11y-allowlist.ts` entries, each an **existing accepted pairing on a new
  story key** rather than a new finding: the new `Playground`s reuse their siblings' story-local
  `primary-4` triggers, and the allowlist is keyed story × rule.

### Fixed

- **Two tests failed under machine load at an undeclared 5000ms timeout** (#63). Test config
  only; no shipped code, `dist/` byte-identical. **Patch.**

  `testTimeout` is now **declared** in `vitest.config.ts` at its existing 5000ms — the value is
  unchanged; the bound is simply written down, so a lane meeting `Test timed out in 5000ms` has
  something in the repo to read.

  The two cases in `scripts/hooks.test.mjs` that spawn a real Prettier process get a declared
  `{ timeout: 20000 }` on their `describe`, sized from measurement rather than raised until
  nothing failed:

  |                                  | idle            | at load avg ~78              |
  | -------------------------------- | --------------- | ---------------------------- |
  | the two hook cases               | 614ms / 356ms   | **5965ms / 6125ms** — failed |
  | datepicker navigation / timeZone | 108 / 84 / 47ms | 1574 / 1302 / 828ms — passed |

  **Not raised globally**, deliberately: the other ~790 tests keep the tight bound, and a
  suite-wide raise is indistinguishable from removing it for them.

  Proven to change the reproduction, which a timeout fix otherwise cannot claim — at comparable
  load the previously-failing case now takes **5213ms**, above the old bound and below the new
  one. And proven still to be a bound: a deliberately hanging test fails in **20011ms**.

### Fixed

- **`release.yml` and `CLAUDE.md` both claimed `v0.5.0` was left in place; it does not exist**
  (#100). Documentation only; no shipped code, `dist/` byte-identical. **Patch.**

  The tag was pushed — #54 read it over the API and quoted `"version": "0.4.0"` from it — and
  #54's comment records the decision to keep it. It was deleted anyway, after
  2026-08-07T19:03Z, by nobody recorded; the events API window has expired, so who and why are
  not recoverable.

  `release.yml` offered it as the proof of "a tag is not moved or deleted in this project",
  which made the strongest evidence for that norm an example of the norm being broken. **The
  rule and the check are unchanged** — what is replaced is the example, with the concrete cost:
  #54's own re-derivation commands no longer run.

  Also records that **`v0.5.1` has a tag but no GitHub release**. It predates the Release
  workflow's first run, so it was cut by hand when a matching release was not yet automatic.
  The app pins tags rather than releases, so nothing consuming this package is affected.

### Fixed

- **The changelog-placement check reported nested bullets as corruption** (#107). Tooling only;
  no shipped code. **Patch.**

  `entrySections` tests a line unindented, so a nested bullet is never recorded as an entry.
  `misplacedEntries` trimmed first and then tested, which promotes the same line to a top-level
  entry — one it then could not find in the file it came from, reported as "the diff and the
  file disagree". They agreed. The two halves of one check disagreed about what an entry is.

  It fired on #97's PR, the first to _add_ a nested bullet since the check shipped. Nine already
  sit in this file untouched (`grep -c '^  - ' CHANGELOG.md`), so the shape is ordinary here and
  only an added one reaches that code path.

  Both directions are pinned now: a nested bullet is not an added entry in either half, and a
  top-level entry that really did relocate into a released section is still caught.

  **The step also moved to last in the CI job**, which is worth more than the predicate fix. It
  sat between "Build library" and the `dist/` freshness check, so a failure ended the job and
  `dist/` freshness, the Storybook build and the axe pass never ran — a PR tripping it got a red
  tick and no coverage of the two checks `npm run gate` structurally cannot do. It also broke
  the `dist/` check's documented "the build ran immediately above". A cheap heuristic check
  placed ahead of irreplaceable ones converts its own wrongness into their silence. It stays
  blocking; last-and-blocking costs nothing when right and only itself when wrong.

### Changed

- **BREAKING: `Card` now renders the kit's own card surface, and gains `Header`/`Body`/`Footer`**
  (#98).

  `Card` rendered **a white card** — `bg-surface-neutral` resolves to `#ffffff`, measured at
  `rgb(255, 255, 255)` with a 24px radius by reading computed style on its own story — in a kit
  whose every other surface is neutral-4 or neutral-5. It was scaffolding from `f0b1445`
  ("initialize repo, snapshot pre-refactor baseline"), predating the Figma work, and it survived
  because nothing rendered it.

  It now renders `bg-surface-panel rounded-sm p-4` — `#2C2F33` / 8px / 16px, which
  `Cards01.md L246` pins for "Task Card". Nothing in the exports backed the old values: the only
  `border-radius: 24px` in the card files sits on an element filled `#DA584B`, a red chip.

  **`TaskCard` composes `Card` instead of restating its chrome**, which is #15's actual
  complaint — two card surfaces that could drift apart independently. They now cannot, and
  `card.test.tsx` compares the two **against each other** rather than pinning each to a literal.

  **New:** `Card.Header`, `Card.Body`, `Card.Footer`, plus `as` (`div`/`article`/`section`/`li`)
  and `isInteractive`. The header is deliberately **not** a heading — a card's heading level
  depends on the page it sits in.

  **Migration.** If you rendered `Card` and relied on the white surface, pass
  `className="bg-surface-neutral rounded-lg p-5"` to restore it exactly. Measured at the time of
  writing, **no consumer did** — the app imports `TextButton`, `CloseIcon`, `Menu`, `Modal`,
  `MultiSelect` and `Select`:

  ```bash
  grep -rn "from '@ravn/ui-kit'" src/     # in ravn-task-management-challenge
  ```

  That is a claim with a date on it. Re-run the command rather than trusting it.

### Added

- **`TaskTable.columns` — the column schema is no longer frozen** (#97). Additive; omitted, the
  table renders exactly what it did before. **Minor.**

  The schema lived in two module constants, so a consumer could not add a Status column, drop
  Estimation, reorder any of it, or set a width. `columns` takes a list of built-in keys —
  `name`, `tags`, `estimation`, `assignee`, `dueDate` — each with an optional `label` and
  `width`, or a **custom column** supplying its own `label`, `width` and
  `renderCell(row)`.

  **`renderCell` receives the row's own typed props**, which is what keeps this additive:
  `TaskTableRowProps` stays typed field-by-field rather than becoming a generic bag, so nothing
  existing breaks and `columnLabels` (#90) keeps working. Precedence is `columns[].label` →
  `columnLabels[key]` → the default.

  **Two properties an override path would otherwise have destroyed, both now enforced:**

  - **The four renderers still agree.** The header row, the `<colgroup>`, `TaskTableRow` and
    `TaskTableRowSkeleton` used to agree because all four read the same two constants. They now
    all iterate `resolveColumns`, so agreement is structural rather than remembered. Proven by
    sabotage: drifting the skeleton, and drifting the `colgroup`, each go red.
  - **The 1108px width sum stopped being emergent.** It was a property of two constants that
    nothing asserted, and `width` becoming settable is exactly what kills that. A test pins the
    default set to 1108; changing a default width now fails rather than drifts.

  `min-w-[1108px]` is now computed from the columns in play, so dropping a column no longer
  forces a scrollbar for space it does not use.

### Added

- **The kit's remaining visible English copy is now overridable** (#90). Additive; every default
  is the exact string it replaced. **Minor.**

  #13 made every hardcoded _accessible name_ overridable and deliberately left the visible copy,
  because it is a different and larger surface. This is that surface.

  | Component        | New prop        | Covers                                                                                     |
  | ---------------- | --------------- | ------------------------------------------------------------------------------------------ |
  | `AddTaskModal`   | `copy`          | the title placeholder and its accessible name, the four trigger chips, and the button pair |
  | `AddTaskModal`   | `formatDueDate` | how a chosen date is written on its chip                                                   |
  | `DatePickerMenu` | `todayLabel`    | the footer action                                                                          |
  | `TaskTableRow`   | `detailsLabel`  | the trailing link                                                                          |
  | `TaskTable`      | `columnLabels`  | the five column headers                                                                    |

  **`formatDueDate` is the one that fixes a wrong output rather than an untranslated one.** The
  default was `d.toLocaleDateString('en-US')`, which renders `3/15/2026` where most of the world
  reads `15/3/2026` — a consumer outside the US was shown a _different date_, not merely an
  English one.

  `AddTaskModal` takes one `copy` object rather than seven props: the strings are a cohesive set,
  and #13's per-string precedent produces `labelLabel` here. It is named `copy` and not `labels`
  because `labels` on that component already means the selectable `Label[]`.

  `copy.title` drives the placeholder **and** the input's accessible name from one key — they
  were two copies of the same string, and splitting them would let the announced name drift from
  the visible one, which is the WCAG 2.5.3 failure the anchored popovers avoid the same way.

  **`TaskTable.columnLabels` renames columns; it does not reorder or remove them.** A
  consumer-defined column set is #97, which would supersede this and carries an unresolved
  question of its own — the five widths sum to the spec's 1108px row.

  `EstimateModal`'s pluralisation, which #90 also listed, was solved separately in #94: it needs
  a formatter rather than a string, because `points === 1` is English's rule and not every
  language's.

- **`TaskTableRow`'s props now appear in the published API reference** (#91). Documentation only
  — no source change, `dist/` byte-identical. **Patch.**

  `task-table.stories.tsx` registers `component: TaskTable` only, so autodocs generated a table
  for `TaskTableProps` and nothing else. A row is only ever constructed through
  `TaskTable`'s `groups[].rows`, typed `TaskTableRowProps[]`, so **all 22 of its props are part
  of `TaskTable`'s public surface** — and a consumer's only way to discover them was to read the
  source of a package installed from git.

  `TaskTableRow` now has its own `Meta` with `tags: ['autodocs']` and a decorator supplying the
  `<table><colgroup><tbody>` a `<tr>` needs to be valid DOM at its real column widths.

  **`subcomponents: { TaskTableRow }` is still not the fix**, and this is now measured rather
  than remembered: it renders no second prop table under Storybook 10.5.7 either, verified by
  building and rendering with and without it (#113).

  7 new stories, **0 new `.storybook/a11y-allowlist.ts` entries** — axe goes 161 → 168 tests,
  all passing.

### Fixed

- **An unassigned task announced "Unassigned" on a card and nothing at all in a table row**
  (#111). **Minor** — one new optional prop, and one visual change described below.

  `TaskCard` renders its `Avatar` unconditionally, so `fallbackLabel` carries the no-assignee
  state — the behaviour #47 established. `TaskTableRow` rendered the whole assignee cell
  conditionally, so the same task produced an empty cell with **no indication in the
  accessibility tree that the column was even about an assignee**.

  A consumer could not fix it: passing `assigneeName: 'Unassigned'` puts a false name into the
  data, and the row then reads as assigned to a person called Unassigned — with the consumer's
  own filtering and sorting on that field wrong too.

  `AssigneeNameCell` now renders unconditionally and `name` is optional, with a new
  `unassignedLabel` on it and on `TaskTableRow`, defaulting to `'Unassigned'` to match
  `Avatar.fallbackLabel`.

  **The design decided this rather than symmetry.** Both `Task Assign Name Cell` instances in
  `Task Column02.md` carry an `Avatar`, and no export anywhere draws an unassigned state — so an
  empty cell has no basis, while an always-present avatar does.

  **Visual change:** a table row with no assignee now shows the initials-fallback avatar (`?`)
  where it previously showed an empty cell. That is the same rendering a board card has always
  used for this state. Rows _with_ an assignee are unchanged, and no `textContent` moves, so a
  consumer querying by person name keeps working.

### Changed

- **Storybook 8.5 → 10.5** (#113). Tooling only; no runtime, published API or `dist/` change.
  **Patch.**

  Storybook 10 deleted `@storybook/addon-essentials`, `@storybook/addon-interactions` and
  `@storybook/test`. This is the half of #28 that could not be a version bump — dependabot's
  group matched the packages that still exist at 10.x and left the removed ones at 8.x, the one
  combination npm cannot install.

  Two mechanical import moves: `@storybook/test` → `storybook/test` (25 files), and
  `@storybook/react` → `@storybook/react-vite` for `Meta`/`StoryObj` (41 files, driven by
  `storybook/no-renderer-packages`: 39 errors before, 0 after). `@storybook/blocks` →
  `@storybook/addon-docs/blocks` in the 4 MDX pages.

  **The `@storybook/addon-docs` exact pin at `8.6.14` is gone, and its reason went with it.**
  383b6d4 recorded why it was exact rather than caret — `addon-essentials` pinned its own
  `addon-docs` exactly, so a caret installed a second copy. Essentials does not exist at 10.x.

  **Rendered and compared against the 8.5 build, not just built.** Table counts, prop-table rows
  and names, and `AppShell`'s `scrollWidth` are all identical; the only thing that moved is the
  `storybook-addon-pseudo-states` CSS-injection errors, **9 across four pages → 0**.

  **`subcomponents` still renders no second prop table** — measured with and without it under
  10.5.7, byte-identical. #91 does not close for free.

### Fixed

- **`TaskCard` rendered "1 Pts"** (#94). The card wrote `` `${points} Pts` `` with no singular
  at all, while `EstimationCell` beside it already said "1 Point" — the same datum, two
  spellings, one ungrammatical. **Minor**: new optional props, and the default output changes
  only for `points === 1`.

  Both now read a shared rule. New exports `formatPointsShort` (`"1 Pt"` / `"4 Pts"`) and
  `formatPointsLong` (`"1 Point"` / `"4 Points"`), plus a `formatPoints` prop on `TaskCard`,
  `EstimationCell`, `TaskTableRow` and `EstimateModal`.

  **The two wordings still differ, and the corpus supports that.** The design exports are not in
  this repo but are reachable one level up, so the question was answerable after all. In
  `Components/`: `Cards00/01` and `Task Column03` carry `Pts` and no `Points`; `Task Column01`
  carries `Points` 19 times and no `Pts`; **no file mixes them**. So keeping them apart is
  contrary evidence, not absence of evidence. What is shared is the rule that decides singular
  from plural, so they cannot drift again.

  Two corrections to what an earlier draft of this entry said. The cell's support is
  **`Task Column01.md`, not `Task Column02.md`** — that file contains neither wording, and a
  reader who checked it would have concluded the wording was unsourced. And **both singulars are
  invented**: `1 Pt` and `1 Point` are each absent from the entire export tree, so flagging only
  the abbreviation implied the long form was sourced.

  The mockups _do_ mix — six files, none in `Components/` — and attributing those occurrences to
  components is inference rather than evidence, since the exports attest strings within frames
  rather than component boundaries. Recorded in `format-points.ts` as the thing that would
  overturn this.

  `formatPoints` is also the seam #90 needs: `points === 1` is English's rule, not every
  language's, and this is the third call site of it.

### Added

- **A CI check that a branch's changelog entries land in `[Unreleased]`** (#107). Repo tooling —
  no consumer-facing change.

  #74 shipped two checks over `CHANGELOG.md` itself and neither catches the case that started
  it: `merge=union` relocates an entry from `[Unreleased]` into a released section during a
  rebase, with no conflict and no warning. The result is unique, well-formed, and in exactly one
  section — so counting inside the file cannot see it. **Whether the entry belongs there is a
  fact about the diff**, and a branch that adds an entry has work that is not released yet.

  `scripts/changelog-placement.mjs` runs on pull requests, with `release/*` branches exempt —
  keyed on the branch name rather than the diff shape, because a union merge produces the same
  shape and would otherwise exempt itself.

  **`ci.yml` gains `fetch-depth: 0`, and that is part of the fix rather than housekeeping.**
  `actions/checkout` defaults to depth 1, where the base ref does not exist; a diff against a
  missing ref is empty, and an empty diff passes. The check would have succeeded silently on
  every PR. The script refuses an unresolvable base rather than returning nothing, so the two
  can never be separated quietly.

  Deletes `release-checks.test.mjs`'s `documents the gap` case, which asserted the blindness
  this closes. A gap pinned by a passing test reads as a live limitation forever.

### Added

- **`TaskMetaBadge` gains a decorative arm, restoring a capability #19 removed by accident**
  (#93). **Minor** — additive, and the existing labelled shape is unchanged.

  `#9` closed the consuming app's "render these badges decoratively" requirement as _already
  met at zero API cost_, on the grounds that `aria-label` on a role-less `<span>` is prohibited
  and therefore dropped — the counts were silent **by accident**. `#19` replaced that with a
  real `sr-only` node, which is the correct fix for #19 and simultaneously deleted the silence
  the requirement rested on. Nothing connected the two records.

  `TaskMetaBadge` is now a union: `{ …, label }` or `{ …, decorative: true }`. A decorative
  badge renders its icon and count and is `aria-hidden`, so it is drawn and not announced —
  a property of the markup rather than a coincidence of what is missing.

  **`label` on a decorative badge does not compile.** `label?: never` on that arm makes
  announced-and-silent unrepresentable rather than merely discouraged, the same habit as
  `Record<DueDateUrgency, …>`. Pinned by a `@ts-expect-error` case, which fails the build if
  the combination ever becomes legal again.

  Use it sparingly: a count a sighted user can read and a screen-reader user cannot is a real
  asymmetry, and it is right only when the alternative is announcing something untrue — which
  is the consuming app's case, where the design draws counters its API has no fields for.

### Fixed

- **`.storybook/a11y-allowlist.ts` claimed a fixed defect was live** (#93). Its
  `aria-prohibited-attr` block still read _"Attachment, subtask and comment counts are silent to
  a screen reader today"_ and described the entries as open debt. The entries were deleted when
  #19 landed; only the prose survived. Corrected, and kept as a record of the fix rather than
  removed — both halves of that defect are easy to reintroduce, including the `TaskCard`
  `role="button"` that used to mask it.

## [0.7.0] — 2026-08-08

### Added

- **Two structural checks on `CHANGELOG.md`, because a union merge defeats every other guard
  in the release path** (#74). Repo tooling only — no consumer-facing change.

  `.gitattributes` sets `merge=union` on this file so parallel branches append without
  conflicting. It also lets them **relocate, duplicate and re-head** without conflicting, and
  every existing guard is aimed at _under_-documentation — union never loses anything, so none
  of them fire. Four separate firings in one day, two of which nearly shipped a bad release.

  `release-checks.mjs` gains `duplicateHeadings()` and `duplicateEntries()`, wired into the
  release preconditions _and_ asserted against the real file by
  `scripts/release-checks.test.mjs`, which Vitest collects — so the gate catches a bad merge on
  the commit that introduces it rather than at release time, when it is already in `main`.

  The severe one is the duplicate heading. `section()` reads to the next `## `, so two
  `## [0.6.0]` headings truncate the published release body to the first block — verified to
  pass the old checks and publish two lines in place of the real section, which is the `v0.5.0`
  empty-body failure reached with the guard green.

  Scope stated honestly: **neither check catches relocation alone.** An entry replayed from
  `[Unreleased]` into a released section is well-formed, unique, and in exactly one place;
  whether it _belongs_ there is a fact about which commits are in the tag, which the file does
  not contain. That needs a branch-diff check and is left as follow-up.

- **`TaskTableRow.actions`, so a list view keeps its per-row Edit/Delete** (#95). **Minor** —
  additive and optional.

  `TaskCard` got an actions slot in #9; `TaskTableRow` never did, and had no `ReactNode` slot
  at all. Migrating a list view onto it therefore _removed_ the per-task overflow menu — a
  functional regression, not a styling one, which is why the consuming app migrated its board
  and left its list view on its own markup.

  A click on the slot does **not** open the row, matching the guarantee `TaskCard` already
  makes: it is one of the row's own controls, like the select checkbox and the "Details" link.
  That holds from the keyboard too, where activating a control synthesises a click that would
  otherwise bubble.

  It renders inside the Task Name cell rather than as a sixth column, deliberately: the five
  column widths sum to the spec's 1108px row, and a new column would break that invariant and
  the `colgroup` with it. A consumer-defined column set is #97.

- **`TaskTableGroup.headingLevel`** (#95). The group header was a hardcoded `<h3>`, so a
  consumer running `<h1>` page → `<h2>` status got `h1 → h3` — a skipped level that axe reports
  as `heading-order`, with no prop able to reach it. Per group, matching where `title` and
  `actions` already live, so it composes with `TaskTableRow.headingLevel` beneath it.
  Defaults to `3`, so existing callers are unchanged.

### Fixed

- **Tag chips on `TaskCard` and in `TaskTable` render in caps again, without mutating the
  label** (#102). A live visual regression on the consuming app's board, filed against the kit.
  **Minor** — the new `className` channel is additive and the casing is a class, not a string
  change.

  `Tag` applies no `text-transform` and `tags` had no styling channel, so a consumer storing
  `"iOS app"` rendered `"iOS app"` with no supported way to say otherwise. The app had been
  passing `uppercase` via `className` to its own chips; migrating onto `TaskCard` dropped that,
  because the prop shape had nowhere to put it.

  `TaskCard` and `TagCell` now render their chips `uppercase`. **The label string is never
  touched**, and that distinction is the entire point: a screen reader spells out a string that
  is literally capitalised and reads a CSS-uppercased one normally, so `label.toUpperCase()`
  would have traded an accessibility property for a visual one. `textContent` is unchanged, so
  a consumer keeps storing and querying natural case.

  New shared `TaskTag` type — `{ label, variant?, className? }` — replacing the inline shape on
  `TaskCard.tags`, `TaskTableRow.tags` and `TagCell.labels`. The per-chip `className` is the
  opt-out (`className: 'normal-case'`; `cn()` is `twMerge`, so the later class wins) and the
  styling channel whose absence made this unfixable from the consumer side.

  **Standalone `Tag` is unchanged** — the casing belongs to the card and the table, which
  reproduce specific designs, not to the chip, which is documented as carrying no meaning of
  its own. Existing callers passing already-capitalised labels see no visual change, since
  `uppercase` on `"IOS APP"` is a no-op.

  **If you pass natural-case labels, your chips change appearance and you must add code to keep
  the old output.** `CONTRIBUTING.md`'s major line covers a changed prop's default behaviour;
  this ships as minor under the pre-1.0 carve-out, which requires saying so explicitly, so:
  `tags={[{ label: 'Android' }]}` rendered `Android` before and renders `ANDROID` now. Pass
  `className: 'normal-case'` on the chip to keep the previous rendering. This is not a
  hypothetical group — storing labels in natural case and uppercasing them in CSS is exactly
  the pattern #102 was filed about, so a consumer doing the accessible thing is the one
  affected.

## [0.6.0] — 2026-08-08

### Added

- **Every hardcoded English `aria-label` in the kit is now an overridable prop** (#13).
  Eleven components baked in an accessible name a consumer could not reach, which made the
  kit unlocalizable and — where two instances can share a page — produced controls a screen
  reader cannot tell apart. All additive, all defaulting to the exact string they replaced.
  **Minor.**

  | Component            | New prop                                                                        | Default                                                                 |
  | -------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
  | `Tag`                | `removeLabel`                                                                   | `'Remove tag'`                                                          |
  | `Modal`              | `closeLabel`                                                                    | `'Close modal'`                                                         |
  | `TopNav`             | `clearSearchLabel`                                                              | `'Clear search'`                                                        |
  | `Tabs`               | `label`                                                                         | `'Tab navigation'`                                                      |
  | `ApplicationSidebar` | `label`                                                                         | `'Main navigation'`                                                     |
  | `DatePickerMenu`     | `label`                                                                         | `'Date picker'`                                                         |
  | `DatePickerMenu`     | `previousYearLabel` / `previousMonthLabel` / `nextMonthLabel` / `nextYearLabel` | `'Previous year'` / `'Previous month'` / `'Next month'` / `'Next year'` |
  | `AssigneeModal`      | `label`                                                                         | `'Assignee'`                                                            |
  | `EstimateModal`      | `label`                                                                         | `'Estimate'`                                                            |
  | `LabelModal`         | `label`                                                                         | `'Label'`                                                               |
  | `TaskTableRow`       | `selectLabel`                                                                   | `` `Select ${title}` ``                                                 |
  | `LabelCheckbox`      | `label`                                                                         | `children` when a string, else `'Checkbox'`                             |

  The collision half is the sharper one. Two `ApplicationSidebar`s — or the kit's plus a
  consuming app's own nav — were two `nav` landmarks both called "Main navigation", which a
  screen-reader user's landmark list cannot separate. Same for two `Tabs`, two
  `DatePickerMenu`s in one form, and two `TaskTable`s holding a task of the same name. This
  is the pattern `EmptyState.label` and `ToastProvider.label` already applied, extended to
  the rest of the kit.

  **On the three anchored popovers, one prop drives two things.** `AssigneeModal`,
  `EstimateModal` and `LabelModal` each rendered their string twice — as the popover's
  `aria-label` _and_ as its visible header. Splitting those into two props would let the
  announced name drift from the visible one, which is a WCAG 2.5.3 (Label in Name) failure
  the components currently avoid only by accident, so `label` moves both together.

  **`LabelCheckbox` keeps its `'Checkbox'` fallback**, now documented rather than silent:
  the name is derived as `typeof children === 'string' ? children : 'Checkbox'`, so any
  non-string child collapses the accessible name to the literal word "Checkbox" with no
  type error and nothing visibly wrong. Flattening arbitrary `ReactNode` into a name is
  guesswork; `label` is the way out of it, and a test now pins the fallback so a future
  change to it is deliberate.

  Three of the thirteen rows in #13's table were **already fixed** before this work —
  `SearchBar.label`, `SegmentedControl.label` and `Avatar` (whose name moved to the wrapper
  in #47). The issue's line numbers had gone stale; the table above is what the tree
  actually needed.

- `ApplicationSidebar` gains its first test file. Coverage thresholds ratcheted
  91.77 → 94.02 statements, 90.29 → 90.90 branches, 86.71 → 88.11 functions.

- **Composition slots where configuration had walled consumers out** (#15). All additive and
  non-breaking. **Minor.**

  | Component      | New prop   | Replaces                                                                  |
  | -------------- | ---------- | ------------------------------------------------------------------------- |
  | `AppShell`     | `sidebar`  | the `ApplicationSidebar` built from `logo`/`sidebarItems`                 |
  | `AppShell`     | `topNav`   | the `TopNav` built from `topNavProps`                                     |
  | `TopNav`       | `userSlot` | the bare `Avatar` built from `userName`/`userAvatar`                      |
  | `TopNav`       | `actions`  | — (new trailing-group slot)                                               |
  | `TaskCard`     | `icon`     | — (forwards to `ProjectInfo`'s existing slot)                             |
  | `TaskListView` | `empty`    | the `EmptyState` built from `emptyTitle`/`emptyDescription`/`emptyAction` |
  | `TaskTable`    | `empty`    | the same trio                                                             |

  `AppShell.sidebarItems` becomes **optional**, which is a widening rather than a break —
  it was required, so the shell was unusable with any navigation but this kit's.

  Where a slot and its configuration are both given, **the slot wins**: rendering both would
  put two navigation landmarks (or two user affordances) in one bar, and ignoring the slot
  would discard what the caller explicitly asked for. `null` and `undefined` mean different
  things on `AppShell.sidebar`/`topNav` — `null` is "none", `undefined` is "build the
  default".

  The flattened `empty*` props are **kept, not replaced**. Removing them would break every
  existing caller and they are a fine shorthand; the slot exists because they flatten three
  of `EmptyState`'s five, leaving `icon` and `label` unreachable — and `label` is the one
  that matters, since a board of three columns otherwise gives a screen-reader user three
  groups all called "No results".

  **Scoped deliberately.** #15 lists six areas; this is four of them. `TaskTable`'s frozen
  column schema and `Card`'s missing sub-components are filed separately — see the PR.

### Fixed

- **Due-date urgency was conveyed by colour alone** (#92). WCAG 2.2 1.4.1. **Minor** — the
  new props are additive and the fix is on by default.

  `TaskCard` rendered its due date as a red `Tag` and `DueDateCell` as `text-primary-2`, and
  that was the entire signal. Nothing in the accessibility tree and nothing in the visible
  text said a task was overdue, so it failed for a screen-reader user and a colour-blind
  sighted user alike. The word never reached the DOM at all — `grep -c '"overdue"'` over
  `dist/index.js` at `v0.5.3` returned **0**, against `grep -c 'jsx-runtime'` → 1 as the
  positive control.

  Both renderers now emit an `sr-only` state node after the date, so a screen reader reads
  "20 July, 2026, overdue". The strings come from a shared `DUE_DATE_URGENCY_LABEL` map
  exported alongside the existing `DUE_DATE_URGENCY_COLOR`, which is what stops the card and
  the table cell drifting on what "overdue" _says_ the same way they cannot drift on what it
  looks like.

  | Component      | New prop                          |
  | -------------- | --------------------------------- |
  | `TaskCard`     | `dueDateUrgencyLabel`             |
  | `TaskTableRow` | `dueDateUrgencyLabel` (forwarded) |
  | `DueDateCell`  | `urgencyLabel`                    |

  Each takes a `Partial<Record<DueDateUrgency, string>>` merged over the defaults, so
  `{ overdue: 'past due' }` changes one and leaves the rest. English defaults are
  overridable rather than baked in — shipping the fix for "consumers cannot override our
  strings" with a string consumers cannot override would have rebuilt #13's defect in a new
  place.

  **`soon` is fixed too**, though the issue is written about `overdue`: yellow-versus-neutral
  is exactly as much a colour-only signal as red-versus-neutral. **`normal` announces
  nothing** and renders no node at all — "not urgent" is the absence of a state, and an empty
  string is what makes that structural rather than a condition each renderer re-implements.

  **The visible text is untouched.** `dueDateText` renders exactly as passed. A _visible_
  affix would additionally serve colour-blind sighted users and is deliberately not done: no
  Figma export draws one, and inventing a design value is forbidden. Measured in a real
  browser rather than reasoned about — the state node computes `position: absolute`,
  `1px × 1px`, `overflow: hidden`, `clip-path: inset(50%)`, and the `Tag` measures 140px wide
  with it and 140px without, so it costs no layout.

## [0.5.3] — 2026-08-07

Two consumer-facing fixes and two to the repo's own tooling.

The one to read is **#82**: switching between `AddTaskModal`'s chips took two clicks and the
first silently did nothing — a defect that was live in every browser and invisible to the test
suite, because jsdom 26 does not implement `PointerEvent` and react-aria branches on exactly
that. It surfaced only when a dependency bump (#32) supplied the missing API.

### Fixed

- **Switching between `AddTaskModal`'s chips took two clicks, and the first did nothing** (#82).
  A shipping defect in a browser, not a test problem.

  react-aria's outside-click handling registers a **capture-phase** `click` listener and calls
  `stopPropagation()` on it. Only the popover's own trigger was exempt, so clicking a _sibling_
  chip dismissed the open popover and that same click never reached the sibling — the user saw
  nothing happen and clicked again.

  `Popover` gains `dismissExemptRef`, a region that does not count as "outside", forwarded by
  `EstimateModal`, `AssigneeModal`, `LabelModal` and `DatePickerMenu`. `AddTaskModal` exempts its
  whole chip row, which makes switching purely state-driven: the sibling's `onClick` runs and the
  previous popover unmounts because its `isOpen` went false. `closePopover` is also identity-aware
  now, so a stale popover cannot clear a newer one whichever order the handlers run in.

  **Invisible under jsdom 26**, which does not implement `PointerEvent`: react-aria takes a
  `NODE_ENV === 'test'` branch without it, so the test passed through a path no browser executes.
  jsdom 30 (#32) provides it. Verified in real Chrome in all three directions — one click
  switches, clicking an open chip still closes it, and a click outside the row still dismisses.
  **Minor** — `dismissExemptRef` is additive and optional.

- **`TaskMetaBadges` was silent to screen readers** (#19). Attachment, subtask and comment
  counts contributed nothing to the accessibility tree at all.

  Each badge was `<span aria-label={label}>` with **both** children `aria-hidden`. `aria-label`
  is prohibited on the implicit `generic` role of a bare `<span>`, so it was dropped — and with
  the icon and the count both hidden, no accessible text remained. The badge announced nothing.

  The label is now real text hidden with `sr-only`, and the wrapper carries no ARIA. That is the
  house pattern rather than an invention (`FormField`, `Input`, `DatePicker`), and it keeps the
  announced text and the visible content as one thing so they cannot drift — `role="img"` would
  also have permitted a name but reintroduces that gap.

  **Four `a11y-allowlist` entries deleted, not two.** #12 removed `TaskCard`'s container
  `role="button"`, and a button's descendants are presentational children in ARIA — so while that
  role was there axe never evaluated the roles beneath it, and the bad container role was masking
  a genuine bug underneath. Both `taskcard` stories reported the same root cause once it lifted.

  No API change: `label` still carries the count, as its doc specified. Composing
  `${count} ${label}` would make every caller already passing `"3 comments"` announce
  `"3 3 comments"`. **Patch** — behaviour is additive to assistive tech only.

- **`figure-audit.mjs` counted command internals as claims, and penalised `pipefail`**
  (#69, #70, #78). Three defects in one family, fixed together because they are one file and
  each one's corpus pass invalidates the next.

  `FENCE` stripped fenced blocks but not **inline code** (#69), so a command's own arguments
  counted as claims the author never made — and `2>&1` parsed as the figures 2 and 1 (#70),
  which appears in nearly every gate-sourced line. Both now stripped before counting, from the
  copy used to count only, never from the copy used to detect sourcing.

  **The headline metric was inflated by exactly the thing it rewards.** A line citing
  `npm run gate 2>&1 | tail -6 ; echo $pipestatus[1]` scored **6** figures where the claim is
  two; the same claim citing `npm run gate` scored 2. Identical rigour, three times the score.
  Corpus-wide: substantive 6609 → 6066, sourced 155 → 93, ratio **2.3% → 1.5%** — so the repo's
  provenance rate is _worse_ than reported, and every percentage quoted from this tool before
  today was measured with an inflated instrument.

  **The falling ratio is the fix working, and it is the one direction nobody reads correctly.**
  Both numerator and denominator were inflated: before, the unsourced list was `2>&1` fragments
  and counts quoted inside prose; after, it is real claims that genuinely carry no command. A
  number going down here means the instrument stopped flattering the thing it measures. Do not
  "restore" it — re-derive it: `node scripts/figure-audit.mjs <bodies>`.

  Separately, `set -o pipefail` is now recognised as status-preserving (#78). It is a different
  mechanism rather than a fourth spelling — it makes a pipeline's status the first non-zero
  member, so nothing is discarded. The consuming app's `figures.md` ships it as a recommended
  form, so without this the two repos disagreed in writing. Repository tooling only; `dist/` is
  untouched.

### Fixed

- **`figure-audit.mjs` no longer flags a pipe that is downstream of a command substitution**
  (#71). `isBlindPipe` tested "contains a verification AND contains a pipe", so
  `out=$(npm run gate 2>&1); echo "$out" | grep 'Tests  '` was reported blind — but that pipe
  masks nothing, because the gate's status is resolved at the `$(...)` boundary. It now blanks
  substitutions, splits on `|`, and flags only a verification in a segment other than the last,
  since `$?` is the last segment's status.

  This was the only one of #71's classes that made the tool give a **wrong** answer about a
  **correct** practice — the rest dilute a number; this one inverted the incentive the tool
  exists to create. Found by running the detector over the repo's own corpus rather than by
  re-reading it: both sabotages tested the _rule_ and passed, and only the corpus tested the
  _implementation_ of the rule. Corpus effect measured, not asserted — sourced 149 → 155 across
  68 documents, with exactly one document moving. Repository tooling only; `dist/` is untouched.

- **`CLAUDE.md` contradicted itself about who cuts tags** (#76). #61 rewrote the top of that file
  for the Release workflow and left the "Who cuts which tag" section describing the pre-workflow
  regime — so `:113` said "Do not cut tags by hand" while `:124` still said "the reviewer who
  merges the PR cuts the real `vX.Y.Z` on the merge commit", which _is_ cutting one by hand. A
  consistent document became a contradictory one, and the contradiction was mine.

  The section now says the workflow cuts tags on `main`, that the orphaned-tag hazard is
  structural rather than remembered because the workflow refuses any other ref, and — the real
  consequence, stated rather than left to be discovered — that **the prerelease-at-a-branch-tip
  escape hatch is gone**. A lane needing to give a downstream consumer unmerged work installs
  from the branch; a tag is a promise about `main`.

## [0.5.2] — 2026-08-07

**The first tag cut by the Release workflow rather than by hand**, and the first with
`tag-check.yml` live as a backstop. Everything below shipped to `main` after `v0.5.1`.

For the consuming app this is the release that closes the last three kit gaps blocking its
migration: `Modal`'s dropped `contentProps` (#64), and — already in `v0.5.1` — `Skeleton`'s
reduced-motion guard and `Button`'s icon frame.

### Build

- **CI actions bumped** (#27): `actions/checkout` and `actions/setup-node` v4 → v7,
  `dependency-review-action` v4 → v5, and both Pages actions to v5.0.0 —
  `upload-pages-artifact` `56afc60` → `fc324d3`, `deploy-pages` `d6db901` → `cd2ce8f`. The two on
  the Pages publish path stay SHA-pinned, which is the rule `ci.yml` explains: what is under
  control there is privilege, not version. `.github/workflows/ci.yml` only — no consumer surface.

- **`@types/node` `^22.13.0` → `^26.1.2`** (#31), devDependency. Not consumer-visible:
  `git show origin/main:dist/index.d.ts | grep -c 'node:'` → **0**, so nothing in the published
  types reaches into it.

### Fixed

- **`figure-audit.mjs` no longer credits a command that cannot detect a failing run** (#53). It
  taught `npm run gate 2>&1 | tail -6` as its own exemplar and scored it as valid provenance. A
  pipeline's `$?` is the _last_ command's status, and `tail` succeeds on empty input, so that
  command cannot tell a passing gate from a failing one — while the coverage summary prints its
  percentages identically either way, so there is no visual cue either.

  The rule is **narrow on purpose**: the hazard is not a pipe, it is a pipe that discards a
  status the figure depends on. `grep -rn foo src/ | wc -l` stays credited, because the figure
  _is_ the output and grep's status carries no claim. What is refused is piping a **verification**
  — a gate, test, build or typecheck — where the figure means nothing unless the thing passed.
  Blind lines are reported separately from unsourced ones, since the fix differs: "add a command"
  versus "that command cannot fail".

  Also the **first test for this script**, which had none despite scoring every issue and PR body
  in the repo — the same shape as the Claude Code hooks `CLAUDE.md` records as installed, running
  and inert. Repository tooling only; `dist/` is untouched.

- **The `dist/` freshness guard now catches a deleted file** (#33). One word:
  `git diff --exit-code dist/` → `git diff HEAD --exit-code dist/`.

  The mechanism is worth knowing, because the two halves of that check pull in opposite
  directions. `git add --intent-to-add dist/` is what lets an unstaged diff see a _newly
  emitted_ file — and it is also what blinded the check to a _deleted_ one, since
  `--intent-to-add` on a directory **stages** the deletion, after which the unstaged diff
  compares worktree to index and finds them agreeing. Measured across all four states: on a
  deletion the old form exits 0 and the new exits 1; on clean, new-file and modified both agree.
  `CLAUDE.md` is corrected to say so. CI only; `dist/` is untouched.

- **The release and tag-check jobs now fail if `release-checks.mjs` printed nothing.** That
  script decides whether to run by testing whether `argv[1]` ends with its own filename, so a
  **rename makes it exit 0 having checked nothing** — the one silent failure mode in the release
  path, where the other three call sites break loudly. Demonstrated: on `v0.5.1`'s tree the
  script emits 18801 bytes and a renamed copy emits 0, both exiting 0. Since a real pass always
  prints the changelog section, empty output is proof it did not run.
- **`CLAUDE.md`'s provenance exemplar taught a command that cannot detect a failing gate** (#61).
  It read `npm run gate 2>&1 | grep -E 'Test Files|Tests  '`, and a pipeline's `$?` is the _last_
  command's status — so it reported `grep`'s. It is now command substitution
  (`out=$(npm run gate 2>&1); rc=$?`), which sidesteps the problem rather than papering over it,
  with both shell spellings given for the piped form because lanes run **zsh**, where the bash
  `${PIPESTATUS[0]}` prints an empty string that looks like provenance and is not.

  This line specifically, because it is the **exemplar** — the thing lanes copy, in the file that
  mandates the convention. Proved on a genuinely failing gate rather than a toy: with
  `statements` set to `99.99`, the old form printed `Tests 595 passed` and `exit=0`, and the new
  form printed the same table and `exit=1`.

  The demonstration in the docs uses a grep that **matches**, which is the real case — a failing
  gate still prints its summary, so the grep succeeds and hides the failure. The obvious
  `( exit 1 ) | grep 'x'` reports `1` on zsh for the wrong reason (grep found nothing) and would
  tell a reader there is no problem.

- **`CLAUDE.md` said tagging is a checklist, not a command.** True until #57/#58 landed the
  Release workflow; the section now describes the workflow, what it verifies rather than
  performs, and what `tag-check.yml` does about a hand-cut tag.
- **`Modal` describes an `alertdialog`, and can be pinned open** (#64). `useDialog` returns three
  things and `contentProps` was dropped, so React Aria generated a description id, pointed
  `aria-describedby` at it, then discarded it in a layout effect because nothing carried it — the
  role was announced and the body text that is the entire reason for choosing `alertdialog` was
  not. `contentProps` now wraps the body specifically, not the dialog, which would otherwise make
  the dialog describe itself including its own title.

  New `isDismissable` prop, `@default true`, so a consumer can stop a modal being dismissed while
  an operation is in flight. **One prop drives two react-aria options**: `isDismissable` governs
  the backdrop only, and Escape is a separate switch (`isKeyboardDismissDisabled`) — a bare
  passthrough still let Escape close a pinned modal, which is exactly the case it exists for.
  Found by the test, not by reading the types; both spellings typecheck.

  This was the last kit gap blocking the consuming app's `dialog` swap. **Minor** — additive, and
  the description is a fix rather than a behaviour change for `role="dialog"`, which React Aria
  deliberately does not describe.

- **`npm run test:a11y:ci` no longer serves a stale Storybook.** `http-server` defaults to
  `Cache-Control: max-age=3600`, so a rebuilt story could keep reading stale for an hour — a
  stale page and a broken component are indistinguishable. This cost three rebuild cycles during
  #47 and produced a _false_ technical conclusion about Storybook arg merging that was about to
  ship as a code comment. `-c-1` closes it. Repository tooling only; `dist/` is untouched.

### Added

- **A tag-push job checks any tag nobody dispatched** (#56).
  `.github/workflows/tag-check.yml` fires `on: push: tags: ['v*']` — the only trigger that
  cannot be skipped, because it fires on the ref existing rather than on someone remembering to
  invoke it. It runs the same two checks as the release job, from the same
  `scripts/release-checks.mjs`, so there is one behaviour with two triggers rather than two
  copies that drift.

  It needs no `npm ci` and no build: that script imports only `node:fs` and `node:path`, and
  reads two files from the tagged tree. It takes the checker from the default branch rather than
  from the tag, so a tag cut on an older commit gets an answer instead of "module not found",
  and a fix to the checker does not need a re-tag.

  It deliberately does **not** fire for tags cut by `release.yml` — a ref pushed with the default
  `GITHUB_TOKEN` triggers no further runs — and that silence is correct rather than a gap, since
  every check here already ran there before the tag existed. Proved to discriminate against the
  real history: it fails on `v0.5.0`'s actual commit and passes on `v0.5.1`'s. Repository
  tooling only; `dist/` is untouched.

- **Tags are cut by a `workflow_dispatch` release job, not by hand** (#57).
  `.github/workflows/release.yml` verifies that `package.json` matches the tag, that
  `CHANGELOG.md` has a section for it, that `[Unreleased]` was rolled, that the gate is green
  and that `dist/` reproduces — and only then creates the annotated tag and the GitHub release.
  The tag message is the changelog section for that version.

  `v0.5.0` is why. Its `package.json` still read `0.4.0` and its `[Unreleased]` was never
  rolled. The check that would have caught it already existed — the app's
  `ui-kit-smoke.test.tsx` — and was not run, so a _detective_ fix would have added a second
  thing to remember. This removes the hand path instead. #56's tag-push job remains the
  backstop for anyone who tags manually anyway; the two compose by not overlapping, since a ref
  pushed with the default `GITHUB_TOKEN` does not trigger further workflows.

  The verification lives in `scripts/release-checks.mjs` with `scripts/release-checks.test.mjs`
  beside it rather than inline in YAML, for the reason this repo already learned about its
  Claude Code hooks: an integration point nobody can run is one nobody notices is inert. Each
  of the three checks is proved to fail _independently_ — three checks that only ever fail
  together are one check wearing a costume. Repository tooling only; `dist/` is untouched.

## [0.5.1] — 2026-08-07

**Supersedes `v0.5.0`, which must not be pinned** (#54). That tag's `package.json` still read
`0.4.0` — it was never bumped — and its `[Unreleased]` was never rolled into a dated section.
Its built `dist/` is correct and contains everything below; only the version metadata was wrong,
which is why the consuming app's `ui-kit-smoke.test.tsx` caught it immediately
(`expected 'v0.4.0' to be 'v0.5.1'`). `v0.5.0` is left in place rather than moved or deleted —
a published tag is never rewritten, and #54 is the record of why nobody should pin it.

Everything in this section shipped in the `v0.5.0` commit too; the version is the only change.

### Fixed

- **`Avatar` has an accessible name in both states** (#47). The name moves onto the wrapper as
  `role="img"` + `aria-label`, and the inner `<img>` becomes `alt=""`.

  Two gaps, and the second is what blocked the consumer's migration. With an image, the name was
  on the `<img>`, so a screen reader announced "image, Alice" — an avatar conveys _who_, not what
  a picture looks like. **Without** an image there is no `<img>` at all, so there was no `alt`
  and nothing else carried a name: a `<div>` holding two letters, with no role and no accessible
  name of any kind. That is not an edge case — `User.avatar` and `Task.assignee` are both
  nullable in the API the consumer talks to, which is exactly why the initials fallback exists.

  New `fallbackLabel` prop, `@default 'Unassigned'`, overridable for the same reason
  `TaskListView`'s `emptyTitle` is: the kit cannot know the consumer's language or domain. The
  visible fallback is still `?` — this names it, it does not relabel it.

  **Breaking for anyone querying the avatar image by its `alt` text**, which the kit's own suite
  did (`getByAltText('User')`); query by `role="img"` and the accessible name instead. Minor bump
  under SemVer's pre-1.0 carve-out.

### Added

- **`ViewSwitcher` is a real radiogroup** (#9). It was two independent buttons: no group, no
  selection state, no keyboard model — which side was active was carried by border colour
  alone, and nothing in the accessibility tree said the two were even related. It now renders
  `role="radiogroup"` over `role="radio"` buttons with `aria-checked`, a roving tabindex (the
  group is one tab stop) and arrow/Home/End navigation, following `SegmentedControl`'s existing
  hand-rolled pattern rather than `useRadio`/`useRadioGroup` — see that component's doc comment
  for why those hooks do not fit an icon-button shape. New `label` prop names the group,
  `@default 'View'`. First test file for this component, which had none: 13 cases,
  `npx vitest run src/components/layout/view-switcher.test.tsx`. **Minor** — a behavioural break
  for any consumer querying the old `button` role, under the pre-1.0 carve-out. The two controls
  answered `getByRole('button', { name })` before and answer `getByRole('radio')` now; the
  `SearchBar` textbox→searchbox change below is called a break on the same standard. No consumer
  is affected today — the app has its own `useRadioGroup` switcher and does not import this one.

- **`Button` can carry radio semantics** (#9), via `role="radio"` and `aria-checked`, applied
  after `useButton`'s props because `useButton` drops both — passed through it they arrive on
  the element as `null`. `button.test.tsx` pins that, and pins that `excludeFromTabOrder` is the
  only route to `tabIndex="-1"` (`useButton` hardcodes `0`). `isSelected` stays visual-only and
  must not reach the accessibility tree. **Minor** — additive, and a plain `Button` is unchanged.

- **`SegmentedControl` and `TopNav` gained the labels they hardcoded** (#9). `SegmentedControl`'s
  group name was fixed at `"View"` — right for a view switcher, wrong for anything else — and is
  now the `label` prop, defaulting to that same string so no existing caller changes. `TopNav`
  gained `searchLabel`, forwarded to `SearchBar`. **Minor** — additive.

- **`TopNav`'s notifications bell can be a real button** (#9), via `onNotificationsClick` and
  `notificationsLabel` (`@default 'Notifications'`). It was a bare `<span>`: not focusable, not
  activatable, no accessible name — the shell's only notifications affordance, absent from the
  accessibility tree entirely. It becomes a button only when given a handler, so a consumer that
  passes none keeps today's decorative icon; it carries the same focus ring as "Clear search",
  since a new keyboard-reachable control without one trades one barrier for another. **Minor**.

- **`SearchBar` gained `label` and `id`** (#9). `aria-label` was hardcoded to `'Search'` with no
  prop past it, so an app whose own field reads "Search tasks" could not say so. The default is
  unchanged. **Minor** — additive.

### Changed

- **`SearchBar` is a `searchbox`, not a `textbox`** (#9). `type="search"` was never set, so the
  input took the default role and `getByRole('searchbox')` found nothing. This is a **behavioural
  break for any consumer querying the old role** — the kit's own suites had six such assertions
  and all six had to change — and it lands as a minor bump under SemVer's pre-1.0 carve-out
  (`CONTRIBUTING.md`). `type="search"` also opts into WebKit's native clear glyph, suppressed
  with `[&::-webkit-search-cancel-button]:appearance-none` because `TopNav` renders its own
  labelled clear button and two of them — one unlabelled — is worse than the one that was there.
- **`TaskCard` gained an `actions` slot, and is an `<article>` named by its own title** (#9).
  There was nowhere to put a per-card overflow menu: the only callback was `onClick`, and
  `ProjectInfo`'s `icon` is a fixed 24×24 box specified for a decorative glyph, so a real
  control passed through it loses its padding and focus ring. `actions` sits beside the title
  and swallows its own clicks, so a menu trigger does not also open the card behind it.

  The `<article aria-labelledby>` is **additive to** the deliberate removal of `role="button"`
  documented at `task-card.tsx:78`, not a reversal of it: an article is a container, not a
  control, so the card gets a name for article navigation without becoming one focusable thing
  whose name is its entire text content. **Minor** — additive.

- **`HeadingLevel` is exported from the package root** (#9, and #14's "export the types
  consumers need"), and `ProjectInfo`, `TaskCard`, `TaskListView` and `TaskTableRow` all take
  a `headingLevel` prop under that one name. Heading level belongs to the document a component
  is dropped into, not to the component: every title here was a hardcoded `<h3>`, so a board's
  column headers and its own card titles were both level 3 and
  `getAllByRole('heading', { level: 3 })` returned them interleaved. `ProjectInfo` also gained
  `titleId`, which is what lets `TaskCard`'s `aria-labelledby` point at its heading.
  `TaskTableRow`'s is opt-in and off by default — a heading in every row of a long table is
  noise for a reader already navigating it as a grid. **Minor** — all additive, defaults
  unchanged.

- **`TaskListView` can render as a named landmark** (#9), via `label`. This is the decision the
  issue asked for rather than a default: a `<section>` is only a landmark once it has a name, a
  board emits one per column, and a consumer that already wraps this in its own `<section>`
  would end up with two nested landmarks. Omitted, the markup is byte-identical to before.
  **Minor**.

- **`TaskTableRow` can omit its select checkbox**, via `isSelectable={false}` (#9). The checkbox
  is `sr-only` and merely `opacity-0` until hover, so it was always in the accessibility tree —
  one extra announced, tabbable checkbox per row for a consumer with no bulk-selection feature,
  and no way to turn it off. **Minor** — defaults to today's behaviour.

- **`DatePickerMenu` takes a `timeZone`** (#9). It read `getFullYear`/`getMonth`/`getDate` — the
  machine's local wall-clock fields — and wrote back through `getLocalTimeZone()`. Self-consistent,
  and still wrong for a consumer that stores and formats in UTC: `2026-03-15T00:00:00Z` read on a
  UTC-9 machine is the 14th, so the calendar highlighted the day before the one the rest of the app
  displayed. All four conversion sites now take the zone, including the month/year header, which
  converted in one zone and formatted in another. Defaults to `getLocalTimeZone()`, so existing
  behaviour is unchanged. **Minor** — additive.

### Fixed

- **`Button` no longer stretches its glyph to fill the icon frame** (#46). Figma's "Icon
  Placeholder" is inset 20% of the 40px button — exactly 24px, and identical on every variant —
  while the "Vector" inside it is inset 20.83% on Primary (**14px**), 12.5% on Secondary
  (**18px**), and 12.5%/16.67% on one `ViewSwitcher` glyph (**18×16, non-square**) —
  `grep -n 'Icon Placeholder' -A6 'UI-Kit/Components/Button, Switch Button01.md'`.
  `[&>svg]:w-full [&>svg]:h-full` flattened all three to 24×24 and distorted the non-square one.

  It also made the frame unarguable: a descendant selector outranks a plain utility, so a
  consumer passing `<PlusIcon className="size-3.5" />` — the spec size — was silently
  overridden. The 24px frame stays and now centres its child; the glyph carries its own size.
  **Breaking for anything that relied on the stretch**, which is any icon passed without a size
  class; the kit's own story fixtures are updated to the spec sizes. Minor bump under SemVer's
  pre-1.0 carve-out.

- **`Skeleton`'s pulse is guarded by `prefers-reduced-motion`** (#45). `animate-pulse` was
  unconditional, so the placeholder kept pulsing for a user who had asked their OS to reduce
  motion — an indefinite looping animation is the central case WCAG 2.2.2 exists for. Now
  `motion-safe:animate-pulse`, which fails _safe_: a browser without the query gets no animation
  rather than an unguarded one. The guard stays in the primitive rather than moving to a
  `motion-reduce:animate-none` per call site, where the next caller omits it silently. This
  blocked the consuming app from migrating its own `Skeleton` at two call sites. **Patch**.

- **Every figure now carries the command that re-derives it.** A number in an issue, commit, PR
  body or `CLAUDE.md` is written once and read by sessions that cannot check it, so the command
  ships beside it. `.github/ISSUE_TEMPLATE/lane-task.md` (new — the repo had no issue template)
  and the PR template both require a **Figures** section or the explicit line "no figures".
  `CLAUDE.md` carries the rule where lanes already load it.

  `scripts/figure-audit.mjs` counts how many figures in a body carry a command, so the metric is
  re-derivable rather than asserted — the rule applied to the thing measuring the rule. Baseline
  across the six issues #23 sampled: **1 of 86 substantive figures, 1.2%** —
  `node scripts/figure-audit.mjs <bodies>`. Repository process only; `dist/` is untouched.

- **`scripts/new-lane.sh` provisions a lane worktree that cannot start subtly broken.** Doing it
  by hand surfaced four silent failures — gitignored `.claude/skills/`, gitignored
  `.claude/settings.local.json`, a worktree nested inside the repo, and a gate nobody ran first.
  None of them fail loudly. The script does all four and prints a checklist read back out of the
  provisioned worktree, because every failure it catches looks like success from the inside.
  Verified end to end on a throwaway lane: `skills 15/15`, `mcp playwright, eslint, context7`,
  `gate exit 0`, then removed with nothing left behind. `scripts/new-lane.test.mjs` pins the
  pre-flight guards. Repository tooling only; `dist/` is untouched.

  Two things the issue asked to check first were checked, and both shrank the script:
  `enabledMcpjsonServers` is set at **user** scope, so no per-worktree MCP write is needed —
  confirmed by removing a worktree's `settings.local.json` and seeing `claude mcp list` still
  resolve all three servers; and this repo has no `.env` and no MCP server wanting one, so that
  step is a guarded no-op rather than a copy.

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

- **Lanes can read issue comments.** `.claude/commands/start-issue.md` told a session to run
  `gh issue view <n>`, which prints the body and a comment _count_ — never the comments. The
  correction channel this project runs on is comments on the issue, so it had been write-only.
  The ritual now specifies one command that returns both halves,
  `gh issue view <n> --json body,comments`, because two commands can be half-followed and one
  cannot. `--comments` is not the fix on its own: it suppresses the body —
  `gh issue view 22 | wc -c` → 3800 with the body present, `gh issue view 22 --comments | wc -c`
  → 8029 with zero occurrences of any body phrase.

  `finish-issue.md` gains a step 0 that re-reads the comments before the gate, so an amendment
  posted mid-work lands at the lane's own checkpoint rather than after its PR is open.

  Also records the ritual hardening that merged in #37 without a changelog entry, contrary to
  this file's own rule: the deadlock, dead-check, figure-provenance and subagent-scoping rules,
  the tagging pointer, and that a red check with no named step executed is infrastructure rather
  than your defect.

- Three of the safety patterns changed shape. They had never run, so there was no behaviour to
  preserve: `rm` now requires recursive-and-force flags _and_ a root or home target, so
  `rm -rf ./dist` — routine here, since `dist/` is committed — is allowed; `--force` no longer
  matches `--force-with-lease` by substring, while a `git push origin +branch` refspec now
  matches where it never did.
- `eslint.config.js` gives `scripts/**/*.mjs` the Node globals it already gave root-level config
  files.

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

[unreleased]: https://github.com/f3r21/ravn-ui-kit/compare/v0.7.0...HEAD
[0.7.0]: https://github.com/f3r21/ravn-ui-kit/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/f3r21/ravn-ui-kit/compare/v0.5.3...v0.6.0
[0.5.3]: https://github.com/f3r21/ravn-ui-kit/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/f3r21/ravn-ui-kit/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/f3r21/ravn-ui-kit/compare/v0.4.0...v0.5.1
[0.4.0]: https://github.com/f3r21/ravn-ui-kit/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/f3r21/ravn-ui-kit/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/f3r21/ravn-ui-kit/releases/tag/v0.2.0

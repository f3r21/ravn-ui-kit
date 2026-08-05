# Changelog

All notable changes to `@ravn/ui-kit` are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/) — see `CONTRIBUTING.md`
for the specific policy this repo follows for what bumps major/minor/patch.

## [Unreleased]

### Added

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
- Coverage thresholds ratcheted 79/80/73/79 → 84.2/83.2/78.6/84.2, following the new
  test suites for the icon set, `Tag` (previously untested — a `MIGRATION_GAPS.md`
  Section 5 gap) and `EmptyState`. Per `CONTRIBUTING.md` these only ever move upward.
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

First version tracked by this changelog. Changes before this entry were not
recorded individually here — see `git log` and `UI_KIT_MASTER_PLAN.md` for the
full development history up to this point.

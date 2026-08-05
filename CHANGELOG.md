# Changelog

All notable changes to `@ravn/ui-kit` are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/) — see `CONTRIBUTING.md`
for the specific policy this repo follows for what bumps major/minor/patch.

## [Unreleased]

### Added

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
  against verified Figma spec (only the dimmed *styling* of those cells was
  ever spec-confirmed, never their interactivity).
- `AddTaskModal`'s four trigger buttons (Estimate/Assignee/Label/Due date) now
  carry `aria-haspopup="dialog"` and `aria-expanded`, previously absent.

### Fixed

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

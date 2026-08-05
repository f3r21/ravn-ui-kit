# Changelog

All notable changes to `@ravn/ui-kit` are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/) — see `CONTRIBUTING.md`
for the specific policy this repo follows for what bumps major/minor/patch.

## [Unreleased]

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
  board carried five near-white 40px `rounded-md` pills, and its create/edit modal four
  more. Figma draws every dropdown trigger in this system as the same `Tag` atom:
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

First version tracked by this changelog. Changes before this entry were not
recorded individually here — see `git log` and `UI_KIT_MASTER_PLAN.md` for the
full development history up to this point.

# @ravn/ui-kit

A standalone, accessible, reusable UI kit built with **React 19, TypeScript, Tailwind CSS v4, React Aria Hooks and Storybook**.

**📖 [Browse the Storybook](https://f3r21.github.io/ravn-ui-kit/)** — every component, its
props and its states, published from `main` on each green CI run. Because it documents
`main`, it can show props the latest tag does not have yet; see
[Known limitations](#known-limitations).

See the **Introduction** page there for the full component catalog and fidelity notes, and **Decisions** for the four calls this kit is built around — why it is desktop-only, why accessibility outranks Figma fidelity, which contrast failures are accepted and why, and why field labels are `sr-only` by default.

Built for, and consumed by, **[ravn-task-management-challenge](https://github.com/f3r21/ravn-task-management-challenge)** ([live app](https://ravn-task-management-challenge.vercel.app)).
The API behind the app went offline in October 2026, so the live app now runs on seeded mock
data, with a banner on the page that says so.

## Product, design and QA

Who the kit is for, how it departs from Figma and how it is tested, read back after the
build and dated 2026-10-06:

- **[Product](docs/product.md)**: the users (assumptions), what was built and cut, the
  go/no-go for the next release, and what comes next.
- **[Design](docs/design.md)**: how the kit reaches an app, which piece covers each screen
  state, and the four places it departs from Figma.
- **[QA](docs/qa/test-plan.md)**: the test plan with entry and exit criteria, a risk
  register, and what each suite proves and does not prove.

---

## 🚀 Installation and usage

### 1. Install the package

This package is not on the npm registry: `npm install @ravn/ui-kit` fails, and `@ravn` is
not a scope this project owns, so anything published there later would be someone else's
code. Install it from this repository, pinned to a tag:

```bash
# Pick a released tag. The latest is:
#   gh release list -R f3r21/ravn-ui-kit --limit 1
npm install github:f3r21/ravn-ui-kit#<tag>
```

The tag is not written here, so this line cannot go stale.

The repository is public, so this clones anonymously: no token, no `.npmrc`, nothing to
configure in CI. Pin a **tag**, not a branch: a branch resolves to a different commit each
time the lockfile is refreshed.

`dist/` is committed here precisely so this works. A git install runs no build step, so
what you get is exactly the artifact that was tagged; CI fails if that artifact does not
match the source beside it.

### 2. Wire up styles

There are two supported paths, depending on whether your app runs its own Tailwind CSS v4 build.

**Path A — your app already uses Tailwind CSS v4 (recommended).** Import the raw
design-token stylesheet and let your own Tailwind build generate the utility classes
components need. This keeps the generated CSS deduplicated against the rest of your
app and lets Tailwind tree-shake unused utilities.

```tsx
import '@ravn/ui-kit/theme.css';
```

Your Tailwind entry CSS also needs a `@source` directive so Tailwind scans this
package's compiled output for the utility classes it references — `node_modules` is
excluded from Tailwind's automatic scanning by default, so without this line, classes
baked into `dist/index.js` as class-name string literals would silently never be
generated (see `ravn-task-management-challenge`'s `src/styles/base.css` for a working
example):

```css
@import 'tailwindcss';
@import '@ravn/ui-kit/theme.css';
@source "../node_modules/@ravn/ui-kit/dist";
```

The `@source` path is relative to the CSS file that holds it. The app's `src/styles/base.css`
is two folders deep, so it uses `../../node_modules/@ravn/ui-kit/dist`.

**Path B — your app does not run Tailwind CSS.** Import the fully-compiled stylesheet
instead. It contains every utility class the components actually use, pre-generated —
no Tailwind build step required on your side:

```tsx
import '@ravn/ui-kit/ui-kit.css';
```

Do **not** import both — `ui-kit.css` already includes the token layer, and Path A's
`@source` scanning already includes every utility class you'd get from `ui-kit.css`.
Pick one path based on whether your app has its own Tailwind build.

### 3. Use the components

```tsx
import { Card, Badge, Input, TextButton } from '@ravn/ui-kit';

export function UserForm() {
  return (
    <Card className="max-w-md mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-neutral-5">User registration</h2>
        <Badge variant="success">Active</Badge>
      </div>

      <Input label="Email" placeholder="user@ravn.co" />

      <TextButton variant="primary" onPress={() => console.log('Saved')}>
        Save
      </TextButton>
    </Card>
  );
}
```

This example targets the latest tag. The next release renames `Badge`'s `variant` to `tone`;
see CHANGELOG `[Unreleased]`.

## Known limitations

- **Not on a registry.** `@ravn/ui-kit` is not published to npm, so `npm install @ravn/ui-kit`
  fails. Install from a git tag of this repository, as above.
- **Storybook documents `main`, not the latest tag.** The published Storybook is rebuilt from
  `main` after every green CI run, and `main` carries breaking prop renames no tag contains
  yet (CHANGELOG, `[Unreleased]`). Until the next release, the latest tag still takes the old
  names: `variant` and `outline` on `Tag` (Storybook: `accent`, `appearance`), `variant` on
  `Badge` (`tone`), `onClick` on `TaskCard` (`onPress`), `onSelect` on `AssigneeModal`,
  `EstimateModal` and `LabelModal` (`onAction`), and `width` on `Modal` (`className`). The
  changelog lists the rest.
- **React 19 only.** Peer dependencies: `react` and `react-dom` ^19.0.0, `react-aria`
  ^3.37.0, `react-stately` ^3.35.0 and `@internationalized/date` ^3.12.0.
- **Desktop only.** No component has a breakpoint. `AppShell` stops fitting below an 833px
  viewport and scrolls, and `TaskTable` needs 1108px with its default columns and scrolls
  sideways inside its own container. Inside a page shell, Chrome can add that width to the
  page as well, so the whole page scrolls sideways (#139). See Storybook, Decisions §1.
- **No font ships with the kit.** `--font-sans` is `'SF Pro Display', system-ui, sans-serif`.
  Off macOS the text falls back to a wider font, so labels in fixed Figma widths can truncate
  or wrap.
- **`ui-kit.css` resets the whole page.** Path B's stylesheet includes Tailwind's preflight,
  which zeroes margin, padding and borders on every element, your app's own markup included.
- **The `@source` path is relative to the CSS file.** A path at the wrong depth generates
  none of the kit's classes, and nothing reports it.
- **The primary button fails AA contrast, on purpose.** `TextButton variant="primary"`
  measures 3.83:1 (2.83:1 when selected) against WCAG's 4.5:1, and no colour in the palette
  fixes it. See Storybook, Decisions §3.
- **Two date pickers that do not compose.** `Datepicker` is a native `<input type="date">`
  and `DatePickerMenu` is a calendar popover. Neither uses the other (#138).
- **Card and row presses use a native click.** `TaskCard` and `TaskTableRow` handle a press
  on the whole surface with a click handler, not React Aria's `usePress`, so touch and pen
  behave differently from `Button`. Keyboard users reach the same action through each title
  button (#147).
- **`Badge` has no design reference.** It paints light pills in a dark kit, and the Figma
  file has no Badge to check them against (#137).
- **Browser coverage.** Unit tests run in jsdom and the axe pass runs in Chromium. Firefox,
  Safari and screens composed from the kit are not tested here.
- **One consumer.** The API was shaped by
  [ravn-task-management-challenge](https://github.com/f3r21/ravn-task-management-challenge)
  alone.

---

## 🛠️ Development commands

Use the Node version in `.nvmrc` (`nvm use`). `.npmrc` sets `engine-strict=true`, so
`npm ci` fails on a Node that a dependency's `engines` field rejects, instead of warning and
installing anyway.

```bash
npm ci                   # Install exactly what package-lock.json records
npm run dev              # Start the interactive Storybook environment (http://localhost:6006)
npm run gate             # typecheck -> lint -> format:check -> coverage, the same command CI runs
npm run build            # Build the library bundle (ESM + d.ts) into dist/
npm run build:storybook  # Build the static Storybook site
npm run test:a11y:ci     # axe over every story, against the Storybook build above
npm run typecheck        # Run TypeScript type checking
npm run test             # Run unit tests with Vitest
```

`test:a11y:ci` needs Playwright's Chromium, installed once with
`npx playwright install chromium`. `dist/` is committed, so commit the output of
`npm run build` with any change to `src/`; CI fails when it does not match the source.
[CONTRIBUTING.md](CONTRIBUTING.md) has the full pre-commit list and the conventions.

---

## Design Tokens Architecture (Tailwind v4)

Design tokens are centralized in `src/styles/tokens.css` (shipped as
`@ravn/ui-kit/theme.css`) via Tailwind v4's `@theme` directive, as raw numbered
ramps plus a small semantic-alias layer on top. Every
value below is verified against a specific ground-truth Figma export, or (for the
type-scale tokens) consolidated from values already shipped in the codebase —
see `colors.mdx`/`typography.mdx` in Storybook for the exact source of each one.

- `--color-neutral-1` … `--color-neutral-5`
- `--color-primary-1` … `--color-primary-4`
- `--color-secondary-1` … `--color-secondary-4`
- `--color-tertiary-1` … `--color-tertiary-4`
- `--color-success-1` … `--color-success-4`
- `--color-warning-1` … `--color-warning-6`
- `--color-danger-1` … `--color-danger-6`
- `--color-transparent-light-*` / `--color-transparent-dark-*` (overlay opacities)
- `--color-blue` (standalone accent, used by Tag's `blue` accent and TaskTableRow's `blue` indicator)
- `--color-main` / `--color-muted` / `--color-interactive` / `--color-danger` / `--color-surface-neutral` / `--color-subtle` (semantic aliases over the ramps above)
- `--color-muted-on-dark` / `--color-muted-on-light` / `--color-interactive-text` / `--color-danger-text` (text-safe aliases)
- `--color-surface-overlay` / `--color-surface-panel` / `--color-surface-shell` (dark-surface-hierarchy aliases: popover/dialog, card/panel, and outermost-shell backgrounds)
- `--font-sans` (verified against real Figma component exports as `'SF Pro Display'`)
- `--text-body-m` / `--text-body-l` / `--text-body-xl` / `--text-body-sm` / `--text-field-label` / `--text-tab-label` / `--text-control-label` (type scale: size + line-height + letter-spacing)
- `--radius-2` / `--radius-4` / `--radius-sm` (8px) / `--radius-10` / `--radius-md` (16px) / `--radius-lg` (24px) / `--radius-full`
- `--shadow-small` / `--shadow-elevation` / `--shadow-nav`
- `--z-index-nested` / `--z-index-overlay` / `--z-index-popover` / `--z-index-toast`

See **Design Tokens → Colors** and **Design Tokens → Typography** in Storybook
for a rendered reference. Both the semantic aliases and the type scale are
now migrated everywhere their role actually applies — a small number of
same-color, different-role usages are deliberately left as raw ramp classes
rather than force-fit; see **Design Tokens → Colors** for exactly which.

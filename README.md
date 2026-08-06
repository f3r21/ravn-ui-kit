# @ravn/ui-kit

A standalone, accessible, reusable UI kit built with **React 19, TypeScript, Tailwind CSS v4, React Aria Hooks and Storybook**.

**📖 [Browse the Storybook](https://f3r21.github.io/ravn-ui-kit/)** — every component, its
props and its states, published from `main` on each green CI run.

See the **Introduction** page there for the full component catalog and fidelity notes, and **Decisions** for the four calls this kit is built around — why it is desktop-only, why accessibility outranks Figma fidelity, which contrast failures are accepted and why, and why field labels are `sr-only` by default.

Built for, and consumed by, **[ravn-task-management-challenge](https://github.com/f3r21/ravn-task-management-challenge)** ([live app](https://ravn-task-management-challenge.vercel.app)).

---

## 🚀 Installation and usage

### 1. Install the package

This package is not on any registry — `npm install @ravn/ui-kit` resolves to something
else entirely. Install it from this repository, pinned to a tag:

```bash
npm install github:f3r21/ravn-ui-kit#v0.4.0
```

The repository is public, so this clones anonymously: no token, no `.npmrc`, nothing to
configure in CI. Pin a **tag**, not a branch — a branch reference re-resolves on every
`npm ci` and gives you a different package on the same lockfile entry.

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

---

## 🛠️ Development commands

```bash
npm run dev             # Start the interactive Storybook environment (http://localhost:6006)
npm run build            # Build the library bundle (ESM + d.ts) into dist/
npm run build:storybook  # Build the static Storybook site
npm run typecheck        # Run TypeScript type checking
npm run test             # Run unit tests with Vitest
```

---

## Design Tokens Architecture (Tailwind v4)

Design tokens are centralized in `src/styles/theme.css` via Tailwind v4's `@theme`
directive, as raw numbered ramps plus a small semantic-alias layer on top. Every
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
- `--color-blue` (standalone accent, used only by Tag's `blue` type)
- `--color-main` / `--color-muted` / `--color-interactive` / `--color-danger` / `--color-surface-neutral` / `--color-subtle` (semantic aliases over the ramps above)
- `--color-surface-overlay` / `--color-surface-panel` / `--color-surface-shell` (dark-surface-hierarchy aliases: popover/dialog, card/panel, and outermost-shell backgrounds)
- `--font-sans` (verified against real Figma component exports as `'SF Pro Display'`)
- `--text-body-m` / `--text-body-l` / `--text-body-xl` / `--text-body-sm` / `--text-field-label` / `--text-tab-label` / `--text-control-label` (type scale: size + line-height + letter-spacing)
- `--radius-2` / `--radius-4` / `--radius-sm` (8px) / `--radius-10` / `--radius-md` (16px) / `--radius-lg` (24px) / `--radius-full`
- `--shadow-small` / `--shadow-elevation` / `--shadow-nav`

See **Design Tokens → Colors** and **Design Tokens → Typography** in Storybook
for a rendered reference. Both the semantic aliases and the type scale are
now migrated everywhere their role actually applies — a small number of
same-color, different-role usages are deliberately left as raw ramp classes
rather than force-fit; see **Design Tokens → Colors** for exactly which.

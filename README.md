# @ravn/ui-kit

A standalone, accessible, reusable UI kit built with **React 19, TypeScript, Tailwind CSS v4, React Aria Hooks and Storybook**.

See the **Introduction** page in Storybook for the full component catalog and fidelity notes, and `UI_KIT_MASTER_PLAN.md` for the ground-truth audit log this library was built against.

---

## 🚀 Installation and usage

### 1. Install the package
```bash
npm install @ravn/ui-kit
```

### 2. Import the design tokens
At your frontend app's entry point (e.g. `src/main.tsx` or `src/index.css`), import the theme stylesheet:

```tsx
import '@ravn/ui-kit/theme.css';
```

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
directive, as raw numbered ramps (no semantic aliases yet). Every value below is
verified against a specific ground-truth Figma export — see `colors.mdx`'s
radius/shadow tables in Storybook for the exact source of each one.

- `--color-neutral-1` … `--color-neutral-5`
- `--color-primary-1` … `--color-primary-4`
- `--color-secondary-1` … `--color-secondary-4`
- `--color-tertiary-1` … `--color-tertiary-4`
- `--color-success-1` … `--color-success-4`
- `--color-warning-1` … `--color-warning-6`
- `--color-danger-1` … `--color-danger-6`
- `--color-transparent-light-*` / `--color-transparent-dark-*` (overlay opacities)
- `--color-blue` (standalone accent, used only by Tag's `blue` type)
- `--font-sans` (verified against real Figma component exports as `'SF Pro Display'`)
- `--radius-2` / `--radius-4` / `--radius-sm` (8px) / `--radius-10` / `--radius-md` (16px) / `--radius-lg` (24px) / `--radius-full`
- `--shadow-small` / `--shadow-elevation` / `--shadow-nav`

See **Design Tokens → Colors** and **Design Tokens → Typography** in Storybook
for a rendered reference. Semantic aliases (e.g. `text-main`, `surface-neutral`)
are a planned follow-up, not yet part of this library.

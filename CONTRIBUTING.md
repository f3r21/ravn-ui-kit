# Contributing to @ravn/ui-kit

## Design values

- Every visual value (color, spacing, radius, typography) must come from a
  verified source — `src/styles/theme.css` tokens, or exact values pasted
  from Figma's Dev Mode / Inspect panel. Never invent or approximate a style.
  If a value is uncertain, flag it in a code comment and leave the existing
  behavior unchanged rather than guessing.
- Accessibility: use React Aria / React Stately hooks for interactive
  components. Do not use `react-aria-components` — this library wires the
  low-level hooks directly.

## Component file conventions

- One component (or a small tightly-coupled family, e.g. a modal shell + its
  variants) per file under `src/components/<folder>/`.
- Every exported `interface`/`type` prop definition must have a JSDoc comment
  on every prop, including `@default` where the prop has a default value
  applied via destructuring. This is what Storybook's autodocs uses to
  generate the prop table — undocumented props render with no description.
- Keep components co-located with their story and test files in the same
  folder; Storybook's sidebar hierarchy is driven entirely by each story's
  `meta.title`, not by file location, so there is no need to mirror the
  Storybook IA in the folder structure.

## Storybook title hierarchy

Every new component's story `title` must go in exactly one of these four
buckets:

| Bucket | Use for |
| --- | --- |
| `Design Tokens/*` | Colors, Typography, and any future raw token reference pages (MDX) |
| `Primitives/*` | Small, single-purpose controls with no internal component dependencies (Button, Input, Badge, Tag, Switch, Tabs, ...) |
| `Components/*` | Composed, self-contained widgets (Avatar, UserRow, Card, TaskCard, DatePicker, Modal, ...) |
| `Layout/*` | App-shell / composition-heavy pieces that arrange other components (ApplicationSidebar, TopNav, TaskColumn, TaskTable, ...) |

If a component is really several facets of one Figma Component Set split into
separate files for tooling reasons (e.g. `DatePicker/Field` + `DatePicker/Menu`,
or `Modal/Base` + `Modal/AddTask` + ...), nest them under a shared prefix.
Otherwise keep titles flat, even for components with an obvious parent/child
relationship (e.g. `Layout/SidebarItem` and `Layout/ApplicationSidebar` stay
siblings, not nested).

## Story file recipe

Every `*.stories.tsx` file should follow this shape (see
`src/components/button/button.stories.tsx` for the canonical example):

```tsx
const meta: Meta<typeof MyComponent> = {
  title: 'Primitives/MyComponent', // per the table above
  component: MyComponent,          // required — autodocs needs this to introspect props
  tags: ['autodocs'],
  argTypes: {
    // { control: 'select', options: [...] } for every string-union prop
    // { control: 'boolean' } for every boolean prop
    // Only document props that actually exist — never invent an axis.
  },
  args: {
    onSomeCallback: fn(), // import fn from '@storybook/test' for every callback prop
  },
};
```

Stories to include, only where the component actually has the corresponding
prop/axis (don't force a story that has nothing real to show):

- `Default` and `Playground` — always. `Playground` exposes every control live.
- `Variants` — only if there's a real variant-like union prop; render all
  values side by side.
- `Sizes` — only if there's a real size union prop; same pattern.
- One state story per meaningful boolean/state prop that actually exists
  (`Disabled`, `Loading`, `Error`, ...).
- `Hover` — via `storybook-addon-pseudo-states`: `parameters: { pseudo: { hover: true } }`.

## Dark surface decorator

If a component's Figma frame renders on a dark app-shell or panel surface, use
the shared decorator instead of an ad-hoc wrapper `<div>`:

```tsx
import { withSurface } from '../../../.storybook/decorators';

const meta: Meta<typeof MyComponent> = {
  // ...
  decorators: [withSurface('neutral-5')], // or 'neutral-4' for the panel shade
};
```

## Accessibility test coverage

Any component wrapping a React Aria/Stately hook (focus management, toggle
state, text fields, dialogs) needs a `*.test.tsx` alongside it, using
`@testing-library/react` + `@testing-library/user-event` with accessible
queries (`getByRole`, `getByLabelText`) — not implementation-detail selectors.
At minimum, cover: the ARIA role/attribute wiring, the callback prop(s) firing
with the right arguments, the `isDisabled` state actually preventing the
interaction, and — for anything with a controlled/uncontrolled prop pair —
that controlled mode doesn't mutate internal state on its own.

## Before committing

```bash
npm run typecheck
npm run test
npm run build
npm run build:storybook
```

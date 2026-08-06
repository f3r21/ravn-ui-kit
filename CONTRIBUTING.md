# Contributing to @ravn/ui-kit

## Design values

- Every visual value (color, spacing, radius, typography) must come from a
  verified source — `src/styles/theme.css` tokens, or exact values pasted
  from Figma's Dev Mode / Inspect panel. Never invent or approximate a style.
  If a value is uncertain, flag it in a code comment and leave the existing
  behavior unchanged rather than guessing.
- **WCAG AA wins where it conflicts with Figma fidelity**, and the deviation
  gets written down at the call site with the ratio that forced it. This is
  the house style rather than an exception — `tag.tsx:47`, `badge.test.tsx:9`
  and `form-field.tsx:45` are the worked examples, and `colors.mdx` collects
  them for readers of the published docs. `src/styles/contrast.test.ts`
  computes the ratios from `tokens.css` itself, so a changed hex fails the
  suite instead of shipping and being found by someone running axe months
  later. Note the rule cuts the other way too: it is AA that wins, not
  "whatever contrasts better" — a passing pairing is never a reason to
  redraw something the design has an opinion about.
- **One conflict has no resolution, and is accepted rather than fixed.**
  `TextButton variant="primary"` paints `text-main` on `bg-primary-4` at
  **3.83:1**, and `isSelected`'s `primary-3` at **2.83:1**, against 1.4.3's
  4.5:1. No label colour in the palette clears `primary-4` (`neutral-5`, the
  darkest thing in it, reaches 4.02:1) and `primary-4` is already its ramp's
  darkest step — so the only fix is a red Figma does not contain, which the
  first rule above forbids. `text-button.tsx:36` carries the full argument.
  It is a judgement call with a measurement behind it, not a bug someone has
  not got to. **`.storybook/a11y-allowlist.ts` is the only place that says
  what is currently accepted**; read it rather than quoting a count from
  prose, and note that not every entry in it is an acceptance — some are
  open debt with an issue number attached.
- **The kit is desktop-only, and that is a decision rather than a gap.**
  Nothing in `src/` carries a Tailwind responsive variant (`sm:`/`md:`/`lg:`)
  or a `@media` query, and the layout pieces are built to fixed widths taken
  from the 1440px Figma canvas: `ApplicationSidebar` is `w-[232px] shrink-0`
  (`application-sidebar.tsx:48`), `TaskTable`'s grid is `min-w-[1108px]`
  (`task-table.tsx:515`), `AddTaskModal` is a hard `w-[578px]`
  (`add-task-modal.tsx:163`). The consuming app keeps its own `AppLayout`
  and `AppSidebar` permanently for this reason. Do not add a breakpoint to
  one component in isolation — it makes that component responsive inside a
  shell that is not, which is worse than either answer on its own.
- **Field labels are `sr-only` by default.** `Input`, `Datepicker`, `Select`
  and `FormField` all default `isLabelVisible` to `false` and render the
  label `sr-only` — never `hidden`/`display:none`, so the accessible name
  survives either way (`form-field.tsx:63-71`). The design draws no field
  labels anywhere across 100 export files; a field's own text carries its
  meaning — the placeholder in the empty state, the value in the filled one.
  A new control follows the same default; a consumer who wants a painted
  label opts in per control.
- Accessibility: use React Aria / React Stately hooks for interactive
  components. Do not use `react-aria-components` — this library wires the
  low-level hooks directly.

The reasoning behind the four decisions above is published, not just tracked
— see the **Decisions** page in [the Storybook](https://f3r21.github.io/ravn-ui-kit/),
which is written for someone who has not cloned this repo.

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

| Bucket            | Use for                                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Design Tokens/*` | Colors, Typography, and any future raw token reference pages (MDX)                                                                      |
| `Primitives/*`    | Small, single-purpose controls with no internal component dependencies (Button, Input, Badge, Tag, Tabs, SegmentedControl, ...)         |
| `Components/*`    | Composed, self-contained widgets (Avatar, UserRow, Card, TaskCard, DatePicker, Modal, ...)                                              |
| `Layout/*`        | App-shell / composition-heavy pieces that arrange other components (ApplicationSidebar, TopNav, TaskListView, TaskTable, AppShell, ...) |

If a component is really several facets of one Figma Component Set split into
separate files for tooling reasons (e.g. `DatePicker/Field` + `DatePicker/Menu`,
or `Modal/Base` + `Modal/AddTask` + ...), nest them under a shared prefix.
Otherwise keep titles flat, even for components with an obvious parent/child
relationship (e.g. `Layout/SidebarItem` and `Layout/ApplicationSidebar` stay
siblings, not nested).

### Standalone documentation pages

Those four buckets govern **story** titles. A pure documentation page — MDX
with a `<Meta>` and no component behind it — does not belong in any of them,
and filing one under `Design Tokens/` would misrepresent it as a token
reference. Such pages sit at the top level of the sidebar instead, one word
each:

| Title          | File                          |
| -------------- | ----------------------------- |
| `Introduction` | `src/styles/introduction.mdx` |
| `Decisions`    | `src/styles/decisions.mdx`    |

`Design Tokens/Colors` and `Design Tokens/Typography` are MDX too but are not
this case — they document tokens, which is exactly what their bucket is for.

Adding another top-level page means adding its title to `storySort.order` in
`.storybook/preview.ts` as well. That order is explicit and an unlisted title
sorts to the bottom, below `Layout/`, which is not where a reader looks for
prose.

Two things about MDX here that a green build will not tell you:

- **Pipe tables render, and that is recent.** `remark-gfm` is configured on
  `@storybook/addon-docs` in `.storybook/main.ts`. Before it, core Markdown had
  no tables at all and a pipe table published as a run-on line of `|`
  characters — `colors.mdx` and `typography.mdx` shipped that way on the live
  site (#21). Write pipe tables now; they are far easier to read and edit than
  the literal `<table>` blocks still in `decisions.mdx`, which are correct and
  are simply not worth churning. If you do write a literal `<table>`, keep each
  `<td>` to a single element — a cell mixing text and an element becomes a `<p>`
  and gains vertical padding the other cells do not have.

  Configure MDX options on `@storybook/addon-docs` by name, listed before
  `@storybook/addon-essentials`. Nesting them under essentials' own `docs` key
  is the obvious spelling and is silently ignored: it builds green and changes
  nothing, which is indistinguishable from the bug it is meant to fix. Verify a
  table by rendering the page and looking for a real `<table>` element, never by
  a green build.

- **`{/* … */}` comments do not survive `npm run format`.** Prettier treats
  `.mdx` as Markdown, rewrites the `*` as emphasis, and leaves `{/_ … _/}`,
  which then fails the Storybook indexer with "Could not parse expression with
  acorn" — a build error nowhere near the file that caused it. Put the note in
  the commit message or here instead. Still true, and still unfixed: it caught
  a comment added while fixing the tables above.

## Story file recipe

Every `*.stories.tsx` file should follow this shape (see
`src/components/button/button.stories.tsx` for the canonical example):

```tsx
const meta: Meta<typeof MyComponent> = {
  title: 'Primitives/MyComponent', // per the table above
  component: MyComponent, // required — autodocs needs this to introspect props
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

## Versioning and changelog policy

This package follows [Semantic Versioning](https://semver.org/):

- **Patch** (`0.2.x`) — bug fixes and visual/behavioral corrections that don't
  change any component's public props or exported API surface.
- **Minor** (`0.x.0`) — new components, new props, or new package exports that
  are additive and don't break an existing consumer's code.
- **Major** (`x.0.0`) — anything a consumer must change code for: a removed or
  renamed export/prop, a changed prop's type or default behavior, or a raised
  peer-dependency floor (e.g. `react`, `react-aria`, `react-stately`). Given
  the package is pre-1.0, breaking changes may also land as a minor bump per
  SemVer's pre-1.0 carve-out — call this out explicitly in the changelog entry
  either way.

Record every user-facing change in `CHANGELOG.md` under `[Unreleased]` as part
of the same PR that makes the change, following [Keep a
Changelog](https://keepachangelog.com/en/1.1.0/)'s `Added`/`Changed`/
`Fixed`/`Removed` grouping. Move `[Unreleased]` into a dated version section
when `package.json`'s version is bumped.

## The accessibility ratchet

CI runs axe over every story in a real browser (`npm run test:a11y:ci`, after
`npm run build:storybook`) and fails on any finding not recorded in
`.storybook/a11y-allowlist.ts`. The allowlist is keyed to **story id × rule id**:
a rule firing on a story that does not list it fails the build, and a rule listed
for a story that no longer reports it _also_ fails, so the list only ever shrinks
on its own. `incomplete` findings are ratcheted alongside `violations` — axe files
exact 1:1 text under `incomplete`, so a violations-only sweep cannot see invisible
text.

If a story of yours trips it, the failure message prints the offending element and
the exact allowlist line that would accept it. Prefer fixing the finding. Accepting
one is a design decision and needs a written reason next to the entry — a measured
ratio and why the palette cannot serve it, or a pointer to the work that closes it.

**If it only fails in CI, do not reach for the allowlist.** Because the ratchet runs
both ways, an environment-specific finding has no valid entry: listing it fails your
machine with `GONE`, omitting it fails CI with `NEW`. That is on purpose — the gap
has to be closed, not recorded.

The cause so far has always been the same one. `--font-sans` is `'SF Pro Display',
system-ui, sans-serif` and the kit ships none of those, so what you measure depends on
the machine: macOS resolves `system-ui` to the SF system font, while a Linux runner
falls through to `sans-serif` — DejaVu Sans, which is appreciably wider. Text that fits
a fixed-pixel box here can overflow it there, and axe will not compute a contrast ratio
for text whose background box does not contain it, so it files `color-contrast` under
`incomplete` with `elmPartiallyObscured`. That is a layout bug wearing a colour bug's
clothes; see `estimate-modal.tsx` for the worked example.

Do not trust a local pass on a story with a fixed pixel width. Check it against a
wider font first — Verdana ships with macOS and is slightly wider than the runner's
DejaVu Sans, so it is a safe stand-in:

```js
// devtools console, on the story's iframe in the built Storybook
document.documentElement.style.setProperty('--font-sans', 'Verdana, sans-serif');
```

If nothing overflows its container under that, the runner will not see it either.

This does not replace `src/styles/contrast.test.ts`, which checks token pairings no
story renders (hover fills, placeholders, surfaces a component may be dropped onto).
Neither check sees the other's cases; a new colour decision usually wants both.

## Starting a lane

```bash
scripts/new-lane.sh <lane-name> [branch]      # branch defaults to int/<lane-name>
```

Provisioning by hand went silently wrong four times, so do not do it by hand. Four
things a `git worktree add` does **not** give you, none of which fail loudly:
`.claude/skills/` is gitignored per skill, so the lane starts with none of them;
`.claude/settings.local.json` is gitignored too and holds accumulated permission
approvals; the worktree must live **outside** the repo, or Vitest, ESLint and
Prettier all collect it and its tests resolve the `@` alias to the outer `src/`;
and the gate must be run **before** you touch anything, or a red tree gets
misattributed to your first change.

The script does all four and then prints a checklist read back out of the new
worktree — skills present versus declared, MCP servers, whether the settings file
arrived, and the gate's exit code. Read it rather than assuming; every failure it
exists to catch looks like success from the inside.

MCP servers need no per-worktree setup: `enabledMcpjsonServers` is set at user
scope in `~/.claude/settings.json` and is inherited. Verified by removing a
worktree's `settings.local.json` and confirming `claude mcp list` still resolved
this repo's three servers.

## Before committing

```bash
npm run gate            # typecheck -> lint -> format:check -> coverage
npm run build
npm run build:storybook
npm run test:a11y:ci    # axe over every story; needs the Storybook build above
```

`gate` is the bar, and it is the same command CI runs. It fails on a coverage
regression as well as on a broken test — the thresholds in `vitest.config.ts` are
a ratchet, so a change that drops coverage below where it already was will not
pass. Raise them when you add tests; never lower them to get green.

`npm run format` rewrites in place if `format:check` fails.

`test:a11y:ci` serves `storybook-static/` and runs the suite against it; it needs
Playwright's Chromium (`npx playwright install chromium`, once). If _every_ story
fails, read the first message rather than the count — a runner that cannot reach the
served Storybook fails identically to a wall of real violations, and the runner says
which of the two it is.

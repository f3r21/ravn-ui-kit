import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

/**
 * Plugins from `vite.config.ts` that exist only to produce the published package, and
 * have no business running during a Storybook build.
 *
 * Storybook's Vite builder loads the root `vite.config.ts` and inherits every plugin in
 * it, so `npm run build:storybook` was also emitting declarations and copying theme
 * tokens into `dist/`. That is wasted work at best, and from a clean checkout it was a
 * hard failure twice over: `copy-theme-tokens` wrote into a `dist/` nothing had created
 * (`ENOENT: ./dist/theme.css`), and `vite:dts`'s `rollupTypes` step then handed
 * api-extractor a `mainEntryPointFilePath` that did not exist either. Both only ever
 * passed in CI because `npm run build` happens to run first in the same job — step
 * ordering standing in for correctness.
 */
const LIBRARY_ONLY_PLUGINS = ['vite:dts', 'copy-theme-tokens'];

/**
 * Packages whose prop declarations are part of this kit's published API even though they
 * are resolved out of `node_modules`.
 *
 * Every interactive component here extends a React Aria props interface — `ButtonProps
 * extends AriaButtonProps`, `InputProps extends AriaTextFieldProps`, and so on — so much of
 * what a consumer can actually pass is declared upstream. The blanket `!/node_modules/`
 * filter this replaces dropped all of it. `Button`'s autodocs table listed `variant`,
 * `isSelected`, `children`, `aria-label` and `className`, and hid `onPress`, `isDisabled`,
 * `autoFocus` and `excludeFromTabOrder` — the entire interaction API. Measured across the
 * component tree, ten components were affected (`Button`, `TextButton`, `Input`,
 * `Datepicker`, `Select`, `MultiSelect`, `Menu`, `ListBox`, `FloatingPopover`, `FormField`)
 * and 236 of 534 props reached a reader.
 *
 * That is worth more than a tidier table. `CONTRIBUTING.md` mandates JSDoc on every
 * exported prop *because* autodocs is what publishes it, and `README.md` sends consumers to
 * the published Storybook as the API reference — so one line here was withholding a large
 * share of documentation that had already been written. React Aria's own types carry JSDoc
 * on every prop restored by this list, so they arrive with descriptions rather than as
 * blank rows: zero of the 534 are undocumented.
 *
 * The entries are the **umbrella** packages, and that is the part to not "simplify". This
 * kit imports from `react-aria`/`react-stately` per CONTRIBUTING.md's hooks-only rule, so
 * docgen resolves parents to `node_modules/react-aria/dist/types/**` and
 * `node_modules/@react-types/shared/**`. An allowlist of the scoped `@react-aria/*` names
 * alone matches nothing here and would go on hiding `isDisabled` while looking correct.
 * The scoped names are listed anyway, against a future direct dependency shortening the
 * resolution path.
 *
 * What stays hidden is `@types/react`: 531 DOM attributes (`accessKey`, `contentEditable`,
 * `onAnimationStart`, ...) inherited by anything extending `React.HTMLAttributes`. That is
 * the noise the original filter was written for and is still right to drop. `Card` is the
 * clean demonstration — everything it was hiding is that, which is why it is unchanged.
 */
const API_PARENT_PACKAGES =
  /node_modules\/(@react-types\/|@react-aria\/|@react-stately\/|react-aria\/|react-stately\/)/;

const config: StorybookConfig = {
  async viteFinal(viteConfig) {
    return {
      ...viteConfig,
      plugins: (viteConfig.plugins ?? []).filter(
        (plugin) =>
          !(
            plugin &&
            typeof plugin === 'object' &&
            'name' in plugin &&
            LIBRARY_ONLY_PLUGINS.includes(plugin.name as string)
          ),
      ),
    };
  },
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)', '../src/**/*.mdx'],
  addons: [
    '@storybook/addon-links',
    {
      // GFM, for tables. Core Markdown has none, so a pipe table was not "styled
      // badly" — it was not a table at all, and published as a run-on line of `|`
      // characters on the live site. `colors.mdx`'s 29-row alias table and
      // `typography.mdx`'s 9-row scale were both prose, and the colour aliases are
      // exactly what a consumer opens that page to read (#21).
      //
      // Configured on `@storybook/addon-docs` directly, and listed *before*
      // essentials. Essentials delivers addon-docs, so the obvious spelling is to
      // nest these under its `docs` key — that builds green and changes nothing,
      // which is the same failure mode as the bug itself. Essentials skips
      // registering addon-docs when it is already present, so naming it here is what
      // gets the options to the MDX compiler rather than a double registration.
      //
      // GFM is more than tables — it also brings autolink literals, strikethrough,
      // footnotes and task lists — so this changes how every `.mdx` page parses, not
      // just the two with tables. That was measured before the change rather than
      // assumed: across all four pages there are zero tildes, zero bare URLs, zero
      // footnote references and zero task-list markers, so tables are the only GFM
      // construct any of them contains. All four were re-rendered and read after it.
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    'storybook-addon-pseudo-states',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      // Show every prop a component declares itself, plus the ones it inherits from the
      // React Aria packages above — those are API. Hide the rest of `node_modules`, which
      // in practice means `@types/react`'s DOM attribute surface.
      propFilter: (prop) => {
        if (!prop.parent) return true;
        const { fileName } = prop.parent;
        return !fileName.includes('node_modules') || API_PARENT_PACKAGES.test(fileName);
      },
    },
  },
};

export default config;

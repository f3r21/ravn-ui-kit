import type { StorybookConfig } from '@storybook/react-vite';

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
      // Hide props inherited from react-aria/DOM types (AriaButtonProps, etc.) so
      // autodocs prop tables only show what each component's own interface declares.
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;

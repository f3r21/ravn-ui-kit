import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import { copyFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

// Consumers running their own Tailwind build (e.g. an app that also uses
// @tailwindcss/vite) need the raw `@theme` tokens on their own, separate from
// the fully-compiled `ui-kit.css` this build produces — see the "./theme.css"
// package.json export. Copied verbatim (not run through @tailwindcss/vite)
// since it's meant to be composed into a *different* Tailwind build
// downstream; a second `@import "tailwindcss"` in that chain would be wrong.
function copyThemeTokens(): Plugin {
  return {
    name: 'copy-theme-tokens',
    closeBundle() {
      // Creates its own output directory rather than assuming something else made one.
      // `vite build` does create `dist/` before `closeBundle`, so under `npm run build`
      // this is a no-op — but this plugin used to be inherited by the Storybook build
      // too, which has no `dist/` output at all, and a clean checkout failed there with
      // `ENOENT: ./dist/theme.css`. `.storybook/main.ts` now filters it out; this keeps
      // the plugin correct on its own terms rather than on that filter holding.
      const dist = resolve(__dirname, 'dist');
      mkdirSync(dist, { recursive: true });
      copyFileSync(resolve(__dirname, 'src/styles/tokens.css'), resolve(dist, 'theme.css'));
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({ include: ['src'], rollupTypes: true }),
    copyThemeTokens(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RavnUIKit',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      // Everything a consumer already resolves for itself. The first six are the
      // declared `peerDependencies`, which is the obvious case. `clsx` and
      // `tailwind-merge` are ordinary `dependencies` and belong here for a different
      // reason: npm installs them into the consumer's tree either way, so bundling
      // them ships a *second*, private copy alongside the one that is already there —
      // and nothing imports the installed one. Left out of this list, `dist/index.js`
      // began with clsx's source verbatim and carried tailwind-merge's config trie
      // inline.
      //
      // The duplication is worse than bytes for `tailwind-merge`. A Tailwind v4 app
      // near-certainly has its own instance (ours does), and a consumer that calls
      // `extendTailwindMerge` to teach it about custom class groups can only reach
      // that instance — a copy sealed inside this bundle would keep resolving the
      // kit's own `cn()` calls under the stock config, silently disagreeing with the
      // app about which of two conflicting classes wins.
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-aria',
        'react-stately',
        '@internationalized/date',
        'clsx',
        'tailwind-merge',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});

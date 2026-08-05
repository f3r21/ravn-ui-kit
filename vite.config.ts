import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import { copyFileSync } from 'fs';
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
      copyFileSync(
        resolve(__dirname, 'src/styles/tokens.css'),
        resolve(__dirname, 'dist/theme.css'),
      );
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
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-aria',
        'react-stately',
        '@internationalized/date',
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

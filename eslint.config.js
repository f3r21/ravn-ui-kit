import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'storybook-static/**', '.playwright-mcp/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Config/tooling files run under Node, not the browser. `scripts/` is here
    // for `hooks.test.mjs`, which spawns the Claude Code hooks as subprocesses
    // and so reads `process.cwd()` and `process.env` — browser globals would
    // leave every one of those an undefined.
    files: ['*.{js,ts}', '.storybook/**/*.ts', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // react-hooks rules-of-hooks/exhaustive-deps: this kit wires react-aria's
    // low-level hooks directly (per CONTRIBUTING.md), so these rules matter.
    // Not spreading the preset object directly: the installed
    // eslint-plugin-react-hooks@7.1.1's `configs['recommended-latest'].plugins`
    // resolves to an array at runtime, not the object flat config requires -
    // declaring `plugins` ourselves and only pulling `.rules` from the preset
    // sidesteps that.
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs['recommended-latest'].rules,
  },
  {
    // jsx-a11y: this is an accessibility-focused component library.
    files: ['src/**/*.tsx'],
    ...jsxA11y.flatConfigs.recommended,
  },
  ...storybook.configs['flat/recommended'],
];

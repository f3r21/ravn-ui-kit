import type { Preview } from '@storybook/react';
import '../src/styles/theme.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      options: {
        light: { name: 'light', value: '#ffffff' },
        'app-dark': { name: 'app-dark (neutral-5)', value: '#222528' },
        'panel-dark': { name: 'panel-dark (neutral-4)', value: '#2C2F33' },
      },
    },
    options: {
      storySort: {
        // Prose pages first, then tokens, then components bottom-up. Titles listed here
        // are top-level and deliberate — see CONTRIBUTING.md's "Standalone documentation
        // pages". An unlisted title sorts below `Layout`, which is not where a reader
        // looks for prose, so a new page has to be added here as well as written.
        order: [
          'Introduction',
          'Decisions',
          'Design Tokens',
          ['Colors', 'Typography'],
          'Primitives',
          'Components',
          'Layout',
        ],
      },
    },
  },
};

export default preview;

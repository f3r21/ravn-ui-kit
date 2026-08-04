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
        order: ['Design Tokens', ['Colors', 'Typography'], 'Primitives', 'Components', 'Layout'],
      },
    },
  },
};

export default preview;

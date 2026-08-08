import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { SearchBar } from './search-bar';

const meta: Meta<typeof SearchBar> = {
  title: 'Layout/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  // Frame 649 has no fill of its own in Figma — it's always composited on the
  // neutral-4 "Search Bar" surface it lives inside (see `TopNav`).
  decorators: [withSurface('neutral-4')],
  args: {
    onChange: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Search tasks, projects...' },
};

export const Playground: Story = {
  args: {},
};

export const WithValue: Story = {
  args: { value: 'Fix auth bug', placeholder: 'Search...' },
};

/**
 * The field is a `searchbox`, and its accessible name is the `label` prop rather than a
 * fixed "Search" — a page with more than one search, or one that simply says something more
 * specific, can now name its own field.
 */
export const CustomLabel: Story = {
  args: { label: 'Search tasks', placeholder: 'Search tasks, projects...' },
};

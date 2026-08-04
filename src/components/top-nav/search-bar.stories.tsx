import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { SearchBar } from './search-bar';

const meta: Meta<typeof SearchBar> = {
  title: 'Layout/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
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

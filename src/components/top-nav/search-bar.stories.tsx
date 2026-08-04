import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './search-bar';

const meta: Meta<typeof SearchBar> = {
  title: 'UI/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Search tasks, projects...' },
  decorators: [(Story) => <div className="bg-neutral-4 p-6 rounded-lg"><Story /></div>],
};

export const WithValue: Story = {
  args: { value: 'Fix auth bug', placeholder: 'Search...' },
  decorators: [(Story) => <div className="bg-neutral-4 p-6 rounded-lg"><Story /></div>],
};

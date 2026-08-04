import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { Tabs } from './tabs';

const items = [
  { id: 'board', label: 'Board' },
  { id: 'list', label: 'List' },
  { id: 'table', label: 'Table' },
];

const panels = {
  board: (
    <div className="p-6 text-neutral-2 font-sans text-sm">
      Board view (Kanban)
    </div>
  ),
  list: <div className="p-6 text-neutral-2 font-sans text-sm">List view</div>,
  table: (
    <div className="p-6 text-neutral-2 font-sans text-sm">Table view</div>
  ),
};

const meta: Meta<typeof Tabs> = {
  title: 'Primitives/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-4', 'rounded-xl overflow-hidden min-w-[400px]')],
  args: {
    items,
    panels,
    onSelectionChange: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultSelectedKey: 'board',
  },
};

export const Playground: Story = {
  args: {
    items,
    panels,
    defaultSelectedKey: 'board',
  },
};

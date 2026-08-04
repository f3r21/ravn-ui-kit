import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './tabs';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { id: 'board', label: 'Board' },
      { id: 'list', label: 'List' },
      { id: 'table', label: 'Table' },
    ],
    panels: {
      board: <div className="p-6 text-neutral-2 font-sans text-sm">Vista Tablero (Kanban)</div>,
      list: <div className="p-6 text-neutral-2 font-sans text-sm">Vista Lista</div>,
      table: <div className="p-6 text-neutral-2 font-sans text-sm">Vista Tabla</div>,
    },
  },
  decorators: [(Story) => <div className="bg-neutral-4 rounded-xl overflow-hidden min-w-[400px]"><Story /></div>],
};

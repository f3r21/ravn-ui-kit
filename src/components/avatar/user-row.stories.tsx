import type { Meta, StoryObj } from '@storybook/react';
import { UserRow } from './user-row';

const meta: Meta<typeof UserRow> = {
  title: 'UI/UserRow',
  component: UserRow,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Jerome Bell',
    role: 'Frontend Developer',
    size: 'md',
  },
  decorators: [(Story) => <div className="bg-neutral-5 p-6 w-64"><Story /></div>],
};

export const Online: Story = {
  args: {
    name: 'Fernando Ramirez',
    role: 'Fullstack Engineer',
    isOnline: true,
    size: 'md',
  },
  decorators: [(Story) => <div className="bg-neutral-5 p-6 w-64"><Story /></div>],
};

export const Small: Story = {
  args: {
    name: 'Jane Doe',
    role: 'Designer',
    size: 'sm',
  },
  decorators: [(Story) => <div className="bg-neutral-4 p-4 w-56"><Story /></div>],
};

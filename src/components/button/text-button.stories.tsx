import type { Meta, StoryObj } from '@storybook/react';
import { TextButton } from './text-button';

const meta: Meta<typeof TextButton> = {
  title: 'UI/TextButton',
  component: TextButton,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'View all tasks', size: 'md' },
  decorators: [(Story) => <div className="bg-neutral-4 p-6"><Story /></div>],
};

export const Small: Story = {
  args: { children: 'Cancel', size: 'sm' },
  decorators: [(Story) => <div className="bg-neutral-4 p-6"><Story /></div>],
};

export const Large: Story = {
  args: { children: 'Forgot password?', size: 'lg' },
  decorators: [(Story) => <div className="bg-neutral-4 p-6"><Story /></div>],
};

import type { Meta, StoryObj } from '@storybook/react';
import { LabelCheckbox } from './label-checkbox';

const meta: Meta<typeof LabelCheckbox> = {
  title: 'UI/LabelCheckbox',
  component: LabelCheckbox,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: { children: 'Show completed tasks', defaultSelected: false },
  decorators: [(Story) => <div className="bg-neutral-5 p-4"><Story /></div>],
};

export const Checked: Story = {
  args: { children: 'High priority only', defaultSelected: true },
  decorators: [(Story) => <div className="bg-neutral-5 p-4"><Story /></div>],
};

export const Indeterminate: Story = {
  args: { children: 'Select all', isIndeterminate: true },
  decorators: [(Story) => <div className="bg-neutral-5 p-4"><Story /></div>],
};

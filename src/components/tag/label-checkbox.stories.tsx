import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { LabelCheckbox } from './label-checkbox';
import { withSurface } from '../../../.storybook/decorators';

const meta: Meta<typeof LabelCheckbox> = {
  title: 'Primitives/LabelCheckbox',
  component: LabelCheckbox,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  argTypes: {
    isSelected: { control: 'boolean' },
    defaultSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isIndeterminate: { control: 'boolean' },
  },
  args: {
    children: 'Show completed tasks',
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultSelected: false },
};

export const Playground: Story = {
  args: { children: 'Checkbox label' },
};

export const Unchecked: Story = {
  args: { children: 'Show completed tasks', defaultSelected: false },
};

export const Checked: Story = {
  args: { children: 'High priority only', defaultSelected: true },
};

export const Indeterminate: Story = {
  args: { children: 'Select all', isIndeterminate: true },
};

export const Disabled: Story = {
  args: { children: 'Unavailable option', isDisabled: true },
};

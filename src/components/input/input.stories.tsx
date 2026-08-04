import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    isDisabled: { control: 'boolean' },
  },
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Task Name',
    placeholder: 'E.g. Design prototype...',
  },
};

export const Playground: Story = {
  args: {
    label: 'Label',
    placeholder: 'Type here...',
  },
};

export const Error: Story = {
  args: {
    label: 'Email',
    placeholder: 'user@ravn.co',
    error: 'The email entered is not valid.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    value: 'Non-editable value',
    isDisabled: true,
  },
};

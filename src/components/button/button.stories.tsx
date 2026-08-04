import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
  args: {
    onPress: fn(),
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'primary', size: 'md' },
};

export const Playground: Story = {
  args: { children: 'Click me' },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {(['primary', 'secondary', 'ghost', 'danger'] as const).map((v) => (
        <Button key={v} {...args} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Button key={s} {...args} size={s}>
          {s}
        </Button>
      ))}
    </div>
  ),
};

export const Loading: Story = {
  args: { isLoading: true, children: 'Loading…' },
};

export const Disabled: Story = {
  args: { isDisabled: true, children: 'Disabled' },
};

export const Hover: Story = {
  args: { children: 'Hover me' },
  parameters: { pseudo: { hover: true } },
};

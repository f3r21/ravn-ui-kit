import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TextButton } from './text-button';
import { withSurface } from '../../../.storybook/decorators';

const meta: Meta<typeof TextButton> = {
  title: 'Primitives/TextButton',
  component: TextButton,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-4')],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isDisabled: { control: 'boolean' },
  },
  args: {
    onPress: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'View all tasks', size: 'md' },
};

export const Playground: Story = {
  args: { children: 'Click me', size: 'md' },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <TextButton key={s} {...args} size={s}>
          {s}
        </TextButton>
      ))}
    </div>
  ),
};

export const Small: Story = {
  args: { children: 'Cancel', size: 'sm' },
};

export const Large: Story = {
  args: { children: 'Forgot password?', size: 'lg' },
};

export const Disabled: Story = {
  args: { isDisabled: true, children: 'Disabled' },
};

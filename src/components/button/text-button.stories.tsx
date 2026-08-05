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
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    isSelected: { control: 'boolean' },
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
  args: { variant: 'primary' },
};

export const Playground: Story = {
  args: { children: 'Click me' },
};

/** State=Default/Hover/Selected/Disable × Type=Primary/Secondary (Button, Switch Button01.md). */
export const StateMatrix: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['primary', 'secondary'] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <TextButton {...args} variant={variant}>
            Default
          </TextButton>
          <TextButton {...args} variant={variant} isSelected>
            Selected
          </TextButton>
          <TextButton {...args} variant={variant} isDisabled>
            Disable
          </TextButton>
        </div>
      ))}
    </div>
  ),
};

export const Selected: Story = {
  args: { variant: 'primary', isSelected: true },
};

export const Disabled: Story = {
  args: { isDisabled: true, children: 'Disabled' },
};

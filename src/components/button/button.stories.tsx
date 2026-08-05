import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './button';
import { withSurface } from '../../../.storybook/decorators';

const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
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
    'aria-label': 'Add',
    children: <PlusIcon />,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'primary' },
};

export const Playground: Story = {
  args: { variant: 'secondary' },
};

/** Property 1=Primary, State=Normal / Property 1=Secondary, State=Selected/Unselected. */
export const States: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} variant="primary" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button {...args} variant="secondary" isSelected aria-label="Selected">
        <PlusIcon />
      </Button>
      <Button {...args} variant="secondary" isSelected={false} aria-label="Unselected">
        <PlusIcon />
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { variant: 'primary', isDisabled: true },
};

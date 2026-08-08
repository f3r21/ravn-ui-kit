import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './button';
import { withSurface } from '../../../.storybook/decorators';

/**
 * Glyph sizes come from the consumer now, not from the button (#46). Figma insets "Vector"
 * 20.83% inside the 24px "Icon Placeholder" on Primary — 14px, i.e. `size-3.5` — and 12.5%
 * on Secondary, which is 18px.
 */
const PlusIcon = ({ className = 'size-3.5' }: { className?: string }) => (
  <svg
    className={className}
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
      {/* 18px on Secondary, per "Vector" inset 12.5% of the 24px frame. */}
      <Button {...args} variant="secondary" isSelected aria-label="Selected">
        <PlusIcon className="size-[18px]" />
      </Button>
      <Button {...args} variant="secondary" isSelected={false} aria-label="Unselected">
        <PlusIcon className="size-[18px]" />
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { variant: 'primary', isDisabled: true },
};

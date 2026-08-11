import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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

/**
 * Drives a real press rather than asserting only that the button renders (#16).
 *
 * `secondary`, not `primary` (#20's precedent): `primary` is the one pairing in this kit's
 * whole palette that fails AA with no fix available, already accepted elsewhere via
 * `.storybook/a11y-allowlist.ts` for call sites with no other option — this story has one.
 */
export const PressFires: Story = {
  args: { variant: 'secondary' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Button' });

    await userEvent.click(button);
    expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};

/**
 * `isDisabled` genuinely blocks a press, not merely styles the button as if it were off —
 * `useButton` renders a real native `disabled` attribute (confirmed in `text-button.test.tsx`
 * already), which is *why* there is nothing further to prove by attempting a click here: a
 * real browser refuses to dispatch a pointer event at all on an element with the
 * `pointer-events: none` this component's `disabled:pointer-events-none` class adds — trying
 * anyway throws `StorybookTestRunnerError`, caught while writing this story, not assumed.
 */
export const DisabledBlocksPress: Story = {
  args: { isDisabled: true, children: 'Disabled' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Disabled' });

    expect(button).toBeDisabled();
    expect(args.onPress).not.toHaveBeenCalled();
  },
};

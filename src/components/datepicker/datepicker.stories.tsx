import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { Datepicker } from './datepicker';

const meta: Meta<typeof Datepicker> = {
  title: 'Components/DatePicker/Field',
  component: Datepicker,
  tags: ['autodocs'],
  // Dark, like every real consumer — see the note in `input.stories.tsx`.
  decorators: [withSurface('neutral-5')],
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
    label: 'Due Date',
  },
};

export const Playground: Story = {
  args: {
    label: 'Date',
  },
};

export const Error: Story = {
  args: {
    label: 'Required Date',
    error: 'The date cannot be in the past.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Date',
    isDisabled: true,
  },
};

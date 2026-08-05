import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { DatePickerMenu } from './datepicker-menu';

const meta: Meta<typeof DatePickerMenu> = {
  title: 'Components/DatePicker/Menu',
  component: DatePickerMenu,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  args: {
    onChange: fn(),
    onClose: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Playground: Story = {
  args: {},
};

export const WithSelectedDate: Story = {
  args: {
    value: new Date(2026, 7, 15),
  },
};

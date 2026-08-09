import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
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

/**
 * Every control live. `timeZone` is the one worth trying: the calendar reads the date in the
 * zone it is given rather than the machine's, so setting it moves "today". The four `*Label`
 * props are the navigation buttons' accessible names.
 */
export const Playground: Story = {
  args: {
    defaultValue: new Date(2026, 2, 15),
    timeZone: 'Asia/Tokyo',
    label: 'Choose a due date',
    todayLabel: 'Today',
  },
};

export const WithSelectedDate: Story = {
  args: {
    value: new Date(2026, 7, 15),
  },
};

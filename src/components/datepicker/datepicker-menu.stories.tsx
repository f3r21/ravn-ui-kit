import type { Meta, StoryObj } from '@storybook/react';
import { DatePickerMenu } from './datepicker-menu';

const meta: Meta<typeof DatePickerMenu> = {
  title: 'UI/DatePickerMenu',
  component: DatePickerMenu,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  decorators: [(Story) => <div className="bg-neutral-5 p-8 flex justify-center"><Story /></div>],
};

export const WithSelectedDate: Story = {
  args: {
    value: new Date(2026, 7, 15),
  },
  decorators: [(Story) => <div className="bg-neutral-5 p-8 flex justify-center"><Story /></div>],
};

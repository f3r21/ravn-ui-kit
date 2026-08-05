import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Tag } from './tag';
import { withSurface } from '../../../.storybook/decorators';

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
    aria-hidden
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const meta: Meta<typeof Tag> = {
  title: 'Primitives/Tag',
  component: Tag,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-4')],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'red', 'green', 'yellow', 'blue'],
    },
  },
  args: {
    children: 'Label',
    onRemove: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'neutral', onRemove: undefined },
};

export const Playground: Story = {
  args: { children: 'New Tag', onRemove: undefined },
};

/** Style=Solid × Type=General/Green/Blue/Yellow/Red (Tags00/01.md). */
export const SolidVariants: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {(['neutral', 'green', 'blue', 'yellow', 'red'] as const).map((v) => (
        <Tag key={v} {...args} variant={v}>
          {v}
        </Tag>
      ))}
    </div>
  ),
  args: { onRemove: undefined },
};

/** Style=Outline × Type=General/Green/Blue/Yellow/Red (Tags00/01.md). */
export const OutlineVariants: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {(['neutral', 'green', 'blue', 'yellow', 'red'] as const).map((v) => (
        <Tag key={v} {...args} variant={v} outline>
          {v}
        </Tag>
      ))}
    </div>
  ),
  args: { onRemove: undefined },
};

/** Icon=Left slot, Style=Solid (Tags00/01.md). */
export const WithIcon: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {(['neutral', 'green', 'blue', 'yellow', 'red'] as const).map((v) => (
        <Tag key={v} {...args} variant={v} icon={<CheckIcon />}>
          {v}
        </Tag>
      ))}
    </div>
  ),
  args: { onRemove: undefined },
};

export const Removable: Story = {
  args: { children: 'REACT 19', variant: 'red' },
};

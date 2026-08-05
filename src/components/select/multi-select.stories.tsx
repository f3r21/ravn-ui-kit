import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { fn } from '@storybook/test';
import { Item, type Selection } from 'react-stately';
import { withSurface } from '../../../.storybook/decorators';
import { MultiSelect, type MultiSelectProps } from './multi-select';

interface LabelOption {
  id: string;
  label: string;
  isDisabled?: boolean;
}

const LABEL_OPTIONS: LabelOption[] = [
  { id: 'bug', label: 'Bug' },
  { id: 'feature', label: 'Feature' },
  { id: 'chore', label: 'Chore' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'wontfix', label: 'Won’t fix', isDisabled: true },
];

function MultiSelectDemo(props: Partial<MultiSelectProps<LabelOption>>) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  return (
    <MultiSelect<LabelOption>
      label="Labels"
      placeholder="Select labels"
      items={LABEL_OPTIONS}
      disabledKeys={LABEL_OPTIONS.filter((item) => item.isDisabled).map((item) => item.id)}
      selectedKeys={selectedKeys}
      onSelectionChange={(keys) => {
        setSelectedKeys(keys);
        props.onSelectionChange?.(keys);
      }}
      {...props}
    >
      {(item) => (
        <Item key={item.id} textValue={item.label}>
          {item.label}
        </Item>
      )}
    </MultiSelect>
  );
}

const meta: Meta<typeof MultiSelect<LabelOption>> = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  argTypes: {
    items: { control: false },
    children: { control: false },
    selectedKeys: { control: false },
  },
  args: {
    onSelectionChange: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <MultiSelectDemo {...args} />,
};

export const Disabled: Story = {
  render: (args) => <MultiSelectDemo {...args} isDisabled />,
};

/**
 * Same proof as `Select`'s equivalent story: the trigger sits inside a
 * small `overflow: hidden` container and the popover still renders fully
 * outside it, because it's portalled via `FloatingPopover` rather than
 * CSS-anchored.
 */
export const InsideOverflowHiddenContainer: Story = {
  render: (args) => (
    <div className="w-56 h-24 overflow-hidden border border-dashed border-neutral-2 p-4">
      <MultiSelectDemo {...args} />
    </div>
  ),
};

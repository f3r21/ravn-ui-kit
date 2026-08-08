import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
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

function MultiSelectDemo({
  onSelectionChange,
  initialSelection,
  ...props
}: Partial<MultiSelectProps<LabelOption>> & { initialSelection?: string[] }) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(initialSelection));

  return (
    <MultiSelect<LabelOption>
      label="Labels"
      placeholder="Select labels"
      items={LABEL_OPTIONS}
      disabledKeys={LABEL_OPTIONS.filter((item) => item.isDisabled).map((item) => item.id)}
      {...props}
      selectedKeys={selectedKeys}
      onSelectionChange={(keys) => {
        setSelectedKeys(keys);
        onSelectionChange?.(keys);
      }}
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

/**
 * The filled state, and the reason it has a story: the selection renders as the
 * trigger's own comma-separated value rather than as nested `Tag` chips. Chips were
 * what this used to do, and a browser is what showed they were wrong — a `Tag` is
 * exactly as tall as the trigger, so two of them filled it edge to edge and the control
 * read as two loose tags next to a stray chevron. jsdom could not have told anyone that.
 */
export const WithSelection: Story = {
  render: (args) => <MultiSelectDemo {...args} initialSelection={['bug', 'feature']} />,
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

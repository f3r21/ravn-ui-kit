import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Item } from 'react-stately';
import { withSurface } from '../../../.storybook/decorators';
import { Menu, type MenuProps } from './menu';

interface ActionOption {
  id: string;
  label: string;
  isDisabled?: boolean;
}

const ACTIONS: ActionOption[] = [
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'archive', label: 'Archive', isDisabled: true },
  { id: 'delete', label: 'Delete' },
];

const DotsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <circle cx="12" cy="5" r="1.75" />
    <circle cx="12" cy="12" r="1.75" />
    <circle cx="12" cy="19" r="1.75" />
  </svg>
);

const meta: Meta<typeof Menu<ActionOption>> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  argTypes: {
    items: { control: false },
    children: { control: false },
  },
  args: {
    label: 'Task options',
    triggerContent: <DotsIcon />,
    triggerClassName:
      'w-10 h-10 rounded-sm inline-flex items-center justify-center text-main hover:bg-neutral-4',
    items: ACTIONS,
    disabledKeys: ACTIONS.filter((item) => item.isDisabled).map((item) => item.id),
    children: (item: ActionOption) => (
      <Item key={item.id} textValue={item.label}>
        {item.label}
      </Item>
    ),
    onAction: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Playground: Story = {};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

/**
 * Proves the trigger sitting inside a small `overflow: hidden` container
 * (standing in for a task card in a scrolling board column) doesn't clip the
 * open menu — the same reason `Select`/`MultiSelect` compose the portalled
 * `FloatingPopover` rather than the Section 2 `Popover`.
 */
export const InsideOverflowHiddenContainer: Story = {
  render: (args) => (
    <div className="w-40 h-24 overflow-hidden border border-dashed border-neutral-2 p-4 flex justify-end">
      <Menu {...(args as MenuProps<ActionOption>)} />
    </div>
  ),
};

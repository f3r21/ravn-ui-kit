import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Item } from 'react-stately';
import { withSurface } from '../../../.storybook/decorators';
import { Select, type SelectProps } from './select';
import { Modal } from '../modal/modal';
import { TextButton } from '../button/text-button';

interface StatusOption {
  id: string;
  label: string;
  isDisabled?: boolean;
}

const STATUS_OPTIONS: StatusOption[] = [
  { id: 'todo', label: 'To do' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'in-review', label: 'In review' },
  { id: 'done', label: 'Done' },
  { id: 'archived', label: 'Archived', isDisabled: true },
];

const meta: Meta<typeof Select<StatusOption>> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  argTypes: {
    items: { control: false },
    children: { control: false },
  },
  args: {
    label: 'Status',
    placeholder: 'Select status',
    items: STATUS_OPTIONS,
    disabledKeys: STATUS_OPTIONS.filter((item) => item.isDisabled).map((item) => item.id),
    children: (item: StatusOption) => (
      <Item key={item.id} textValue={item.label}>
        {item.label}
      </Item>
    ),
    onSelectionChange: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Playground: Story = {
  args: {
    defaultSelectedKey: 'in-progress',
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    defaultSelectedKey: 'todo',
  },
};

/**
 * Proves the trigger sitting inside a small `overflow: hidden` container
 * (standing in for `BoardFiltersBar`'s filter row) doesn't clip the open
 * popover — the whole reason `Select` composes the portalled
 * `FloatingPopover` rather than the Section 2 `Popover`.
 */
export const InsideOverflowHiddenContainer: Story = {
  render: (args) => (
    <div className="w-56 h-24 overflow-hidden border border-dashed border-neutral-2 p-4">
      <Select {...(args as SelectProps<StatusOption>)} />
    </div>
  ),
};

/**
 * Proves the popover paints *above* the modal that opened it.
 *
 * This used to be a coin flip. `Modal`'s backdrop and `FloatingPopover` both hardcoded a
 * bare `z-50` with no documented relationship between them, so which one won came down to
 * DOM order — and a portalled popover is a sibling of the modal rather than a descendant,
 * so nothing reliably put it on top. Both now sit on the documented `--z-index-*` scale in
 * `tokens.css`, where `popover` (200) deliberately outranks `overlay` (100), because a
 * surface has to clear whatever opened it.
 */
export const InsideAModal: Story = {
  render: (args) => {
    function Inner() {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <>
          <TextButton variant="primary" onPress={() => setIsOpen(true)}>
            Open modal
          </TextButton>
          <Modal title="Edit task" isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <Select {...(args as SelectProps<StatusOption>)} />
          </Modal>
        </>
      );
    }
    return <Inner />;
  },
};

import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useButton } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import { withSurface } from '../../../.storybook/decorators';
import { FloatingPopover } from './floating-popover';

function PopoverDemo() {
  const state = useOverlayTriggerState({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(
    { onPress: () => state.toggle(), 'aria-label': 'Open menu' },
    triggerRef,
  );

  return (
    <>
      <button
        {...buttonProps}
        ref={triggerRef}
        type="button"
        className="px-4 py-2 rounded-sm bg-primary-4 text-main text-body-m font-sans"
      >
        Open menu
      </button>
      {state.isOpen ? (
        <FloatingPopover state={state} triggerRef={triggerRef} placement="bottom start">
          <div className="p-4 text-body-m text-main font-sans min-w-40">
            Floating content, portalled to &lt;body&gt;.
          </div>
        </FloatingPopover>
      ) : null}
    </>
  );
}

const meta: Meta<typeof FloatingPopover> = {
  title: 'Primitives/FloatingPopover',
  component: FloatingPopover,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  argTypes: {
    state: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <PopoverDemo />,
};

/**
 * Proves the entire reason `FloatingPopover` exists rather than reusing the
 * Section 2 `Popover`: the trigger sits inside a 120px-tall
 * `overflow-hidden` box (standing in for a filter bar or a table cell), and
 * the popover content still renders fully outside it — because `usePopover`
 * + `Overlay` portal to `document.body` instead of positioning `absolute`
 * inside the clipping ancestor.
 */
export const EscapesOverflowHiddenAncestor: Story = {
  render: () => (
    <div className="w-64 h-32 overflow-hidden border border-dashed border-neutral-2 p-4">
      <PopoverDemo />
    </div>
  ),
};

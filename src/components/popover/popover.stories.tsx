import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { withSurface } from '../../../.storybook/decorators';
import { TextButton } from '../button/text-button';
import { Popover } from './popover';

function PopoverDemo({ contentClassName = 'min-w-40' }: { contentClassName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      {/* `secondary`, not `primary` (#16): `primary` is `bg-primary-4 text-main`, the one
          pairing in this kit's whole palette that fails AA (3.83:1) with no darker red to
          fix it with — accepted elsewhere via `.storybook/a11y-allowlist.ts` because those
          call sites have no other option. This story is new and has one: `secondary` reads
          the same on this surface without reproducing a known-bad pairing on purpose. */}
      <TextButton ref={triggerRef} variant="secondary" onPress={() => setIsOpen((open) => !open)}>
        Open popover
      </TextButton>
      {isOpen ? (
        <Popover
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          triggerRef={triggerRef}
          aria-label="Example popover"
          className={`absolute top-full left-0 mt-1 p-4 bg-surface-overlay border border-subtle rounded-sm text-body-m text-main font-sans ${contentClassName}`}
        >
          Popover content, positioned by the caller's own CSS.
        </Popover>
      ) : null}
    </div>
  );
}

const meta: Meta<typeof Popover> = {
  title: 'Primitives/Popover',
  component: Popover,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5')],
  argTypes: {
    isOpen: { control: false },
    onClose: { control: false },
    triggerRef: { control: false },
    dismissExemptRef: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The shell every anchored, non-portalled popover in this kit builds on
 * (`DatePickerMenu`, `AssigneeModal`, `EstimateModal`, `LabelModal`) — unlike
 * `FloatingPopover`, this one positions via the caller's own CSS rather than
 * `usePopover`'s floating-ui anchoring, so it stays inside a clipping ancestor.
 */
export const Default: Story = {
  render: () => <PopoverDemo />,
};

/**
 * Drives the actual open/close/dismiss cycle rather than asserting it only renders.
 * Escape is the interaction most likely to regress silently — `useOverlay`'s dismissal
 * is easy to lose behind an unrelated change to the trigger or the surrounding markup.
 */
export const OpensAndDismissesOnEscape: Story = {
  render: () => <PopoverDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open popover' });

    await userEvent.click(trigger);
    const dialog = await canvas.findByRole('dialog', { name: 'Example popover' });
    expect(dialog).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

/**
 * Every control live. `isOpen`/`onClose`/`triggerRef` are owned by the demo's own state —
 * the same shape every real consumer uses — so `className` is the only prop a caller edits,
 * demonstrated here with a wider surface than `Default`'s.
 */
export const Playground: Story = {
  render: () => <PopoverDemo contentClassName="min-w-64" />,
};

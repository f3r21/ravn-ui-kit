import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { withSurface } from '../../../.storybook/decorators';
import { ToastProvider, useToast, type ToastTone } from './toast';
import { TextButton } from '../button/text-button';
import { Modal } from '../modal/modal';

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  decorators: [withSurface('neutral-5', 'min-h-[24rem]')],
  args: {
    duration: 5000,
    maxVisibleToasts: 4,
    label: 'Notifications',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const TONES: ToastTone[] = ['neutral', 'success', 'warning', 'danger'];

function ToneButtons() {
  const { show } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      {TONES.map((tone) => (
        <TextButton
          key={tone}
          variant="secondary"
          onPress={() => show(tone, `This is a ${tone} notification`)}
        >
          Show {tone}
        </TextButton>
      ))}
    </div>
  );
}

/** One toast per tone, each on the status ramp its `StatusTone` names. */
export const Default: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <ToneButtons />
    </ToastProvider>
  ),
};

/**
 * **The case this component exists for.** Open the modal, then raise a toast from inside
 * it.
 *
 * React Aria hides everything outside an open modal from the accessibility tree, walking
 * out from `document.body`. Notifications sit outside the modal by necessity, so a
 * naively-placed region is hidden exactly when it matters most — and a confirmation
 * dialog that stays open on failure often makes its toast the *only* report the user
 * gets.
 *
 * Two things together fix it, and neither alone is enough: the region is marked as a top
 * layer by `useToastRegion`, **and** portalled to `document.body` so it is a sibling of
 * the modal rather than a descendant of the page being hidden. The toast below must stay
 * reachable — visible, and present in the accessibility tree — while the modal is open.
 */
export const OverAnOpenModal: Story = {
  render: (args) => {
    function Inner() {
      const { show } = useToast();
      const [isOpen, setIsOpen] = useState(false);

      return (
        <>
          <TextButton variant="primary" onPress={() => setIsOpen(true)}>
            Open modal
          </TextButton>

          <Modal
            title="Delete task"
            role="alertdialog"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <div className="flex flex-col gap-4">
              <p className="text-body-m text-main font-sans">
                This dialog stays open on failure and carries no inline error, so its toast is the
                only report the user gets.
              </p>
              <TextButton
                variant="primary"
                onPress={() => show('danger', 'Could not delete the task', { timeout: null })}
              >
                Simulate a failed delete
              </TextButton>
            </div>
          </Modal>
        </>
      );
    }

    return (
      <ToastProvider {...args}>
        <Inner />
      </ToastProvider>
    );
  },
};

/** Beyond `maxVisibleToasts`, the rest wait their turn rather than burying the screen. */
export const Queueing: Story = {
  args: { maxVisibleToasts: 2 },
  render: (args) => {
    function Inner() {
      const { show } = useToast();
      return (
        <TextButton
          variant="secondary"
          onPress={() => {
            show('neutral', 'First');
            show('success', 'Second');
            show('warning', 'Third');
            show('danger', 'Fourth');
          }}
        >
          Show four at once
        </TextButton>
      );
    }
    return (
      <ToastProvider {...args}>
        <Inner />
      </ToastProvider>
    );
  },
};

/**
 * `timeout: null` keeps a toast until it is dismissed — right for an error the user must
 * acknowledge, wrong for anything else.
 */
export const StaysUntilDismissed: Story = {
  render: (args) => {
    function Inner() {
      const { show } = useToast();
      return (
        <TextButton
          variant="primary"
          onPress={() => show('danger', 'Could not save your changes', { timeout: null })}
        >
          Show a sticky error
        </TextButton>
      );
    }
    return (
      <ToastProvider {...args}>
        <Inner />
      </ToastProvider>
    );
  },
};

export const Playground: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <ToneButtons />
    </ToastProvider>
  ),
};

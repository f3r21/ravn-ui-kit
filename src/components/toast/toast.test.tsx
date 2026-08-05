import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast, type ToastTone } from './toast';

function ShowButton({
  tone = 'neutral',
  message = 'Saved',
}: {
  tone?: ToastTone;
  message?: string;
}) {
  const { show } = useToast();
  return (
    <button type="button" onClick={() => show(tone, message)}>
      Trigger
    </button>
  );
}

async function trigger() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Trigger' }));
  return user;
}

describe('useToast', () => {
  it('throws outside a provider rather than silently doing nothing', () => {
    // A no-op would mean a mutation reporting success into nothing, and the missing
    // provider would only surface when someone wondered why they never see confirmations.
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ShowButton />)).toThrow(/must be used within a ToastProvider/);
    consoleError.mockRestore();
  });
});

describe('ToastProvider', () => {
  it('mounts no region until there is something to show', () => {
    render(
      <ToastProvider>
        <ShowButton />
      </ToastProvider>,
    );
    // An empty region is a landmark a screen-reader user can navigate to and find
    // nothing in.
    expect(screen.queryByRole('region', { name: 'Notifications' })).toBeNull();
  });

  it('shows a queued toast inside the named region', async () => {
    render(
      <ToastProvider>
        <ShowButton message="Task created" />
      </ToastProvider>,
    );
    await trigger();

    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region.textContent).toContain('Task created');
  });

  it('takes a caller-supplied region name', async () => {
    // The kit's own TopNav renders a notifications bell, so a consumer composing both
    // needs to be able to rename this landmark rather than ship two with one name.
    render(
      <ToastProvider label="Alerts">
        <ShowButton />
      </ToastProvider>,
    );
    await trigger();

    expect(screen.getByRole('region', { name: 'Alerts' })).not.toBeNull();
    expect(screen.queryByRole('region', { name: 'Notifications' })).toBeNull();
  });

  it('portals the region to the body, not into the provider position', async () => {
    // Half of "a toast survives an open modal": React Aria's hiding pass walks out from
    // document.body and rejects whole subtrees, so a region nested inside the page it
    // hides is never reached — being marked as a top layer does not save it.
    const { container } = render(
      <ToastProvider>
        <ShowButton />
      </ToastProvider>,
    );
    await trigger();

    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(container.contains(region)).toBe(false);
    expect(document.body.contains(region)).toBe(true);
  });

  it('dismisses a toast from its close button', async () => {
    render(
      <ToastProvider>
        <ShowButton message="Task created" />
      </ToastProvider>,
    );
    const user = await trigger();
    expect(screen.getByText('Task created')).not.toBeNull();

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(screen.queryByText('Task created')).toBeNull();
    // ...and the whole region unmounts once nothing is left in it.
    expect(screen.queryByRole('region', { name: 'Notifications' })).toBeNull();
  });

  it('queues beyond maxVisibleToasts rather than showing everything at once', async () => {
    function ShowThree() {
      const { show } = useToast();
      return (
        <button
          type="button"
          onClick={() => {
            show('neutral', 'First');
            show('neutral', 'Second');
            show('neutral', 'Third');
          }}
        >
          Trigger
        </button>
      );
    }

    render(
      <ToastProvider maxVisibleToasts={2}>
        <ShowThree />
      </ToastProvider>,
    );
    await trigger();

    expect(screen.getAllByRole('alertdialog')).toHaveLength(2);
    // Which end of the queue react-stately keeps is its business; what matters here is
    // that the third one waits its turn rather than all three landing at once.
    const shown = ['First', 'Second', 'Third'].filter((t) => screen.queryByText(t) !== null);
    expect(shown).toHaveLength(2);
  });

  it.each([
    ['success', 'bg-success-4'],
    ['danger', 'bg-danger'],
    ['warning', 'bg-warning-5'],
    ['neutral', 'bg-surface-overlay'],
  ] as const)('paints a %s toast on the matching status ramp', async (tone, expected) => {
    render(
      <ToastProvider>
        <ShowButton tone={tone} message="Message" />
      </ToastProvider>,
    );
    await trigger();

    expect(screen.getByRole('alertdialog').className).toContain(expected);
  });

  it('dismisses itself after the configured duration', async () => {
    // Real timers with a short duration rather than fake ones: react-aria drives its
    // dismiss timers through the same clock userEvent waits on, and mocking it out
    // deadlocks the click before the toast is ever queued.
    render(
      <ToastProvider duration={50}>
        <ShowButton message="Task created" />
      </ToastProvider>,
    );
    await trigger();
    expect(screen.getByText('Task created')).not.toBeNull();

    await waitForElementToBeRemoved(() => screen.queryByText('Task created'));
  });

  it('keeps a toast until dismissed when given a null timeout', async () => {
    function ShowSticky() {
      const { show } = useToast();
      return (
        <button type="button" onClick={() => show('danger', 'Delete failed', { timeout: null })}>
          Trigger
        </button>
      );
    }

    render(
      <ToastProvider duration={50}>
        <ShowSticky />
      </ToastProvider>,
    );
    await trigger();

    // Long enough that the 50ms default would have fired several times over. An error
    // the user must acknowledge should not evaporate while they read it.
    await new Promise((resolve) => setTimeout(resolve, 300));
    await waitFor(() => expect(screen.getByText('Delete failed')).not.toBeNull());
  });
});

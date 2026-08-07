import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

const Icon = () => <svg aria-hidden />;

describe('Button Component', () => {
  it('renders with its accessible name', () => {
    render(
      <Button aria-label="Add">
        <Icon />
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Add' })).toBeDefined();
  });

  it('triggers onPress event handler when clicked', async () => {
    const handlePress = vi.fn();
    const user = userEvent.setup();

    render(
      <Button aria-label="Submit" onPress={handlePress}>
        <Icon />
      </Button>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('disables button when isDisabled prop is true', () => {
    render(
      <Button aria-label="Disabled" isDisabled>
        <Icon />
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it('carries radio semantics onto the element, which useButton alone does not', () => {
    // These are applied after `{...buttonProps}` on purpose. `useButton` returns only the
    // props it knows about, and `role`/`aria-checked` are not among them — routed through
    // it, both land as `null` and `ViewSwitcher`'s radiogroup silently has no radios in it.
    render(
      <Button aria-label="Board view" role="radio" aria-checked>
        <Icon />
      </Button>,
    );
    const radio = screen.getByRole('radio', { name: 'Board view' });
    expect(radio.getAttribute('aria-checked')).toBe('true');
  });

  it('yields tabIndex -1 via excludeFromTabOrder, the only lever useButton leaves open', () => {
    // `useButton` hardcodes tabIndex={0}, so a roving tabindex cannot be built by passing
    // `tabIndex` — it is ignored. This is what a radiogroup's unselected option relies on.
    const { rerender } = render(
      <Button aria-label="Roving">
        <Icon />
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Roving' }).getAttribute('tabindex')).toBe('0');

    rerender(
      <Button aria-label="Roving" excludeFromTabOrder>
        <Icon />
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Roving' }).getAttribute('tabindex')).toBe('-1');
  });

  it('stays a plain button with no checked state when no role is given', () => {
    render(
      <Button aria-label="Plain" isSelected>
        <Icon />
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Plain' });
    expect(button.getAttribute('role')).toBeNull();
    // `isSelected` is visual only — it must not leak into the accessibility tree.
    expect(button.getAttribute('aria-checked')).toBeNull();
  });
});

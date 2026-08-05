import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { LabelCheckbox } from './label-checkbox';

describe('LabelCheckbox Component', () => {
  it('toggles the checkbox when the label is clicked', async () => {
    const user = userEvent.setup();
    render(<LabelCheckbox>Remember me</LabelCheckbox>);
    const checkbox = screen.getByRole('checkbox', { name: 'Remember me' }) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    await user.click(screen.getByText('Remember me'));
    expect(checkbox.checked).toBe(true);
  });

  it('sets the native indeterminate property when isIndeterminate is true', () => {
    render(<LabelCheckbox isIndeterminate>Select all</LabelCheckbox>);
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('does not toggle when isDisabled is true', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <LabelCheckbox isDisabled onChange={handleChange}>
        Locked
      </LabelCheckbox>,
    );
    await user.click(screen.getByText('Locked'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('calls onChange with the new boolean value', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<LabelCheckbox onChange={handleChange}>Subscribe</LabelCheckbox>);
    await user.click(screen.getByText('Subscribe'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  /**
   * The focus ring, which did not paint at all until `outline-solid` was added.
   *
   * The real checkbox is `sr-only`, so the ring has to be drawn on the label via `:has()`
   * — and under the `has-` variant, `outline-2`'s `outline-style: var(--tw-outline-style)`
   * does not resolve to `solid` the way it does under `focus-visible:`. The width and the
   * colour computed; nothing was drawn. That is 2.4.7, not a contrast failure: there was
   * no indicator to measure.
   *
   * jsdom applies no CSS, so this can only assert the class — but the class is exactly
   * what was missing, and this is the same shape of defect as the `outline-none` bug that
   * silently suppressed 21 rings in this kit before. The rendering half is a pixel count
   * in a real browser: zero ring pixels before, 1604 after.
   */
  it('carries the explicit outline-style its ring needs to paint', () => {
    render(<LabelCheckbox>Subscribe</LabelCheckbox>);
    const label = screen.getByText('Subscribe').closest('label')!;
    expect(label.className).toContain('has-[:focus-visible]:outline-solid');
    expect(label.className).toContain('has-[:focus-visible]:outline-2');
    expect(label.className).toContain('has-[:focus-visible]:outline-interactive-text');
    // The trap this component already paid for once — see `button.tsx`.
    expect(label.className).not.toContain('outline-none');
  });
});

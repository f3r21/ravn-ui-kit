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
});

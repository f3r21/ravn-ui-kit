import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Switch } from './switch';

describe('Switch Component', () => {
  it('renders unchecked by default and toggles aria-checked on click', async () => {
    const user = userEvent.setup();
    render(<Switch label="Notifications" />);
    const toggle = screen.getByRole('switch', { name: 'Notifications' });
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    await user.click(toggle);
    expect(toggle.getAttribute('aria-checked')).toBe('true');
  });

  it('calls onChange with the new boolean value', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Switch label="Notifications" onChange={handleChange} />);
    await user.click(screen.getByRole('switch', { name: 'Notifications' }));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when isDisabled is true', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Switch label="Notifications" isDisabled onChange={handleChange} />);
    const toggle = screen.getByRole('switch', { name: 'Notifications' });
    await user.click(toggle);
    expect(handleChange).not.toHaveBeenCalled();
    expect(toggle.getAttribute('aria-checked')).toBe('false');
  });
});

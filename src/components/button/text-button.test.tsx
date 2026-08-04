import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TextButton } from './text-button';

describe('TextButton Component', () => {
  it('renders with its accessible name from children', () => {
    render(<TextButton>Save</TextButton>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeDefined();
  });

  it('triggers onPress event handler when clicked', async () => {
    const handlePress = vi.fn();
    const user = userEvent.setup();

    render(<TextButton onPress={handlePress}>Save</TextButton>);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('disables button when isDisabled prop is true', () => {
    render(<TextButton isDisabled>Save</TextButton>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it('does not trigger onPress when isDisabled and clicked', async () => {
    const handlePress = vi.fn();
    const user = userEvent.setup();

    render(
      <TextButton isDisabled onPress={handlePress}>
        Save
      </TextButton>
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handlePress).not.toHaveBeenCalled();
  });
});

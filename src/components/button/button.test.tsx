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
});

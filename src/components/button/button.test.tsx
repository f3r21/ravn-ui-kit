import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDefined();
  });

  it('triggers onPress event handler when clicked', async () => {
    const handlePress = vi.fn();
    const user = userEvent.setup();

    render(<Button onPress={handlePress}>Submit</Button>);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('disables button when isDisabled prop is true', () => {
    render(<Button isDisabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });
});

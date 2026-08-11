import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input Component', () => {
  it('associates the label with the input via useTextField', () => {
    render(<Input label="Task name" />);
    const input = screen.getByRole('textbox', { name: 'Task name' });
    expect(input).toBeDefined();
  });

  it('marks the input as invalid and links the error message via aria-describedby', () => {
    render(<Input label="Email" error="The email entered is not valid." />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const errorMessage = screen.getByText('The email entered is not valid.');
    expect(errorMessage.id).toBeTruthy();
    expect(input.getAttribute('aria-describedby')).toContain(errorMessage.id);
  });

  it('does not mark the input as invalid when there is no error', () => {
    render(<Input label="Task name" />);
    const input = screen.getByRole('textbox', { name: 'Task name' });
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('calls onChange with the new value', async () => {
    const user = userEvent.setup();
    let value = '';
    render(<Input label="Task name" onChange={(v) => (value = v)} />);
    await user.type(screen.getByRole('textbox', { name: 'Task name' }), 'Design prototype');
    expect(value).toBe('Design prototype');
  });

  it('forwards a ref to the root input element (#11)', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Task name" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Task name' }));
  });
});

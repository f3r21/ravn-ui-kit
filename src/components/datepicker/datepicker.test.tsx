import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Datepicker } from './datepicker';

describe('Datepicker Component', () => {
  it('associates the label with the input', () => {
    render(<Datepicker label="Due date" />);
    expect(screen.getByLabelText('Due date')).toBeDefined();
  });

  it('renders and links an error message via aria-describedby', () => {
    render(<Datepicker label="Due date" error="Required field" />);
    const input = screen.getByLabelText('Due date') as HTMLInputElement;
    const message = screen.getByText('Required field');
    expect(input.getAttribute('aria-describedby')).toContain(message.id);
  });

  it('calls onChange when the user picks a date', () => {
    const handleChange = vi.fn();
    render(<Datepicker label="Due date" onChange={handleChange} />);
    const input = screen.getByLabelText('Due date') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2026-08-10' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('disables the input when isDisabled is true', () => {
    render(<Datepicker label="Due date" isDisabled />);
    const input = screen.getByLabelText('Due date') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('forwards a ref to the input (#11)', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Datepicker label="Due date" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByLabelText('Due date'));
  });
});

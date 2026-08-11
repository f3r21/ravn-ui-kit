import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { EstimateModal } from './estimate-modal';

describe('EstimateModal Component', () => {
  it('renders as a dialog popover listing every point option', () => {
    render(<EstimateModal onAction={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Estimate' })).toBeDefined();
    expect(screen.getByText('1 Point')).toBeDefined();
    expect(screen.getByText('2 Points')).toBeDefined();
    expect(screen.getByText('8 Points')).toBeDefined();
  });

  it('marks the row matching `value` as pressed', () => {
    render(<EstimateModal value={3} onAction={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: '3 Points' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(screen.getByRole('button', { name: '1 Point' }).getAttribute('aria-pressed')).toBe(
      'false',
    );
  });

  it('calls onAction with the clicked point value', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();
    render(<EstimateModal onAction={handleSelect} onClose={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: '5 Points' }));
    expect(handleSelect).toHaveBeenCalledWith(5);
  });

  it('calls onClose when Escape is pressed', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(<EstimateModal onAction={vi.fn()} onClose={handleClose} />);
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on an outside click', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Outside</button>
        <EstimateModal onAction={vi.fn()} onClose={handleClose} />
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renames the header and the popover’s accessible name from one prop', () => {
    // Both halves asserted for the reason spelled out in `assignee-modal.test.tsx`.
    render(<EstimateModal onAction={vi.fn()} onClose={vi.fn()} label="Story points" />);

    expect(screen.getByRole('dialog', { name: 'Story points' })).toBeDefined();
    expect(screen.queryByRole('dialog', { name: 'Estimate' })).toBeNull();
    expect(screen.getByText('Story points')).toBeDefined();
  });

  it('forwards a ref to the popover surface (#11)', () => {
    const ref = createRef<HTMLDivElement>();
    render(<EstimateModal onAction={vi.fn()} onClose={vi.fn()} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByRole('dialog'));
  });
});

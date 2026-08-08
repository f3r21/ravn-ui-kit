import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { LabelModal } from './label-modal';

const LABELS = [
  { id: '1', text: 'Bug' },
  { id: '2', text: 'Feature' },
];

describe('LabelModal Component', () => {
  it('renders as a dialog popover listing every label', () => {
    render(<LabelModal labels={LABELS} onSelect={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Label' })).toBeDefined();
    expect(screen.getByText('Bug')).toBeDefined();
    expect(screen.getByText('Feature')).toBeDefined();
  });

  it('calls onSelect with the clicked label', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();
    render(<LabelModal labels={LABELS} onSelect={handleSelect} onClose={vi.fn()} />);
    await user.click(screen.getByText('Feature'));
    expect(handleSelect).toHaveBeenCalledWith(LABELS[1]);
  });

  it('calls onClose when Escape is pressed', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(<LabelModal labels={LABELS} onSelect={vi.fn()} onClose={handleClose} />);
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on an outside click', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Outside</button>
        <LabelModal labels={LABELS} onSelect={vi.fn()} onClose={handleClose} />
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renames the header and the popover’s accessible name from one prop', () => {
    // Both halves asserted for the reason spelled out in `assignee-modal.test.tsx`.
    render(<LabelModal labels={LABELS} onSelect={vi.fn()} onClose={vi.fn()} label="Category" />);

    expect(screen.getByRole('dialog', { name: 'Category' })).toBeDefined();
    expect(screen.queryByRole('dialog', { name: 'Label' })).toBeNull();
    expect(screen.getByText('Category')).toBeDefined();
  });
});

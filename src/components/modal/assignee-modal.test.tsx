import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AssigneeModal } from './assignee-modal';

const ASSIGNEES = [
  { id: '1', name: 'Jerome Bell' },
  { id: '2', name: 'Courtney Henry' },
];

describe('AssigneeModal Component', () => {
  it('renders as a dialog popover listing every assignee', () => {
    render(<AssigneeModal assignees={ASSIGNEES} onAction={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Assignee' })).toBeDefined();
    expect(screen.getByText('Jerome Bell')).toBeDefined();
    expect(screen.getByText('Courtney Henry')).toBeDefined();
  });

  it('calls onAction with the clicked assignee', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();
    render(<AssigneeModal assignees={ASSIGNEES} onAction={handleSelect} onClose={vi.fn()} />);
    await user.click(screen.getByText('Courtney Henry'));
    expect(handleSelect).toHaveBeenCalledWith(ASSIGNEES[1]);
  });

  it('calls onClose when Escape is pressed', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(<AssigneeModal assignees={ASSIGNEES} onAction={vi.fn()} onClose={handleClose} />);
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on an outside click', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Outside</button>
        <AssigneeModal assignees={ASSIGNEES} onAction={vi.fn()} onClose={handleClose} />
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  /**
   * One prop drives the visible header and the accessible name together (#13). Asserting
   * both halves is the point: a `label` wired only to `aria-label` would pass a
   * `getByRole(… { name })` check while leaving the header reading "Assignee", which is
   * the WCAG 2.5.3 mismatch the single prop exists to prevent.
   */
  it('renames the header and the popover’s accessible name from one prop', () => {
    render(
      <AssigneeModal assignees={ASSIGNEES} onAction={vi.fn()} onClose={vi.fn()} label="Owner" />,
    );

    expect(screen.getByRole('dialog', { name: 'Owner' })).toBeDefined();
    expect(screen.queryByRole('dialog', { name: 'Assignee' })).toBeNull();
    expect(screen.getByText('Owner')).toBeDefined();
    expect(screen.queryByText('Assignee')).toBeNull();
  });
});

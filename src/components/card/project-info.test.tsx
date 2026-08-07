import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ProjectInfo } from './project-info';

describe('ProjectInfo Component', () => {
  it('renders the title as static text when it is not an affordance', () => {
    render(<ProjectInfo title="Working (03)" />);
    expect(screen.getByRole('heading', { name: 'Working (03)' })).toBeDefined();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders the title as a button named by the title when onTitleClick is given', async () => {
    const onTitleClick = vi.fn();
    const user = userEvent.setup();
    render(<ProjectInfo title="Working (03)" onTitleClick={onTitleClick} />);

    const button = screen.getByRole('button', { name: 'Working (03)' });
    expect(button.tagName).toBe('BUTTON');

    await user.click(button);
    expect(onTitleClick).toHaveBeenCalledTimes(1);
  });

  it('does not bubble the title click to an ancestor click handler', async () => {
    const onTitleClick = vi.fn();
    const onAncestorClick = vi.fn();
    const user = userEvent.setup();
    render(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div onClick={onAncestorClick}>
        <ProjectInfo title="Working (03)" onTitleClick={onTitleClick} />
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Working (03)' }));

    // `TaskCard` wires both to the same callback, so a bubbling click would open the task
    // twice off one activation.
    expect(onTitleClick).toHaveBeenCalledTimes(1);
    expect(onAncestorClick).not.toHaveBeenCalled();
  });

  /**
   * `truncate` sets `overflow: hidden`, and a focus ring paints outside the element's box.
   * Leaving it on the heading would clip the button's ring away on all four sides — the
   * same class of bug as the `outline-none` one, invisible to jsdom and to a static axe
   * pass, so it is pinned as a class assertion.
   */
  it('truncates on the button, not on the heading that would clip its focus ring', () => {
    const { rerender } = render(<ProjectInfo title="Working (03)" />);
    expect(screen.getByRole('heading').className).toContain('truncate');

    rerender(<ProjectInfo title="Working (03)" onTitleClick={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Working (03)' });
    expect(screen.getByRole('heading').className).not.toContain('truncate');
    expect(button.className).toContain('truncate');
    expect(button.className).toContain('focus-visible:outline-2');
    expect(button.className).not.toContain('outline-none');
  });

  it('defaults to h3 and renders the level it is given', () => {
    // The level was hardcoded, so a column header and its own cards were both level 3 and
    // `getAllByRole('heading', { level: 3 })` returned them interleaved.
    const { rerender } = render(<ProjectInfo title="Working (03)" />);
    expect(screen.getByRole('heading', { level: 3, name: 'Working (03)' }).tagName).toBe('H3');

    rerender(<ProjectInfo title="Working (03)" headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Working (03)' }).tagName).toBe('H2');

    rerender(<ProjectInfo title="Working (03)" headingLevel={6} />);
    expect(screen.getByRole('heading', { level: 6, name: 'Working (03)' }).tagName).toBe('H6');
  });

  it('puts titleId on the heading, so an ancestor can point aria-labelledby at it', () => {
    render(<ProjectInfo title="Fix auth bug" titleId="task-7-title" />);
    expect(screen.getByRole('heading', { name: 'Fix auth bug' }).id).toBe('task-7-title');
  });
});

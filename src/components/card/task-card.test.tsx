import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TaskCard } from './task-card';

describe('TaskCard Component keyboard accessibility', () => {
  it('exposes the title as a real button, not the whole card as an ARIA one', () => {
    render(<TaskCard title="Test Task" onClick={vi.fn()} />);
    const opener = screen.getByRole('button', { name: 'Test Task' });

    // A native <button>, so focus, Enter and Space come from the platform rather than
    // from a hand-rolled role/tabIndex/onKeyDown trio on the container. The container
    // used to be the button, which named itself from the card's entire text content and
    // would nest any interactive child inside a button.
    expect(opener.tagName).toBe('BUTTON');
    expect(opener.getAttribute('role')).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('does not render an opener when onClick is not provided', () => {
    render(<TaskCard title="Test Task" />);
    expect(screen.queryByRole('button')).toBeNull();
    // The title is still there, just as static text under its heading.
    expect(screen.getByRole('heading', { name: 'Test Task' })).toBeDefined();
  });

  it('calls onClick when the card surface is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onClick={handleClick} assigneeName="Jerome Bell" />);
    await user.click(screen.getByText('Jerome Bell'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick exactly once when the title button itself is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onClick={handleClick} />);
    await user.click(screen.getByRole('button', { name: 'Test Task' }));

    // Both the button and the card surface below it are wired to `onClick`; the button
    // stops the click from bubbling so the task opens once, not twice.
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('reaches the opener by tabbing and fires it with Enter', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onClick={handleClick} />);
    await user.tab();

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Test Task' }));

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('fires the opener with Space', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<TaskCard title="Test Task" onClick={handleClick} />);
    await user.tab();
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is an article named by its own title heading', () => {
    // It was a <div> with no role and therefore no accessible name at all. An <article> is
    // a container, not a control, so this does NOT reinstate the `role="button"` that was
    // deliberately removed — see the comment at the top of task-card.tsx's render.
    render(<TaskCard title="Fix auth bug" />);

    const article = screen.getByRole('article', { name: 'Fix auth bug' });
    const heading = screen.getByRole('heading', { name: 'Fix auth bug' });
    expect(article.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(heading.id).toBeTruthy();
  });

  it('names the card by the title alone, not by every string it renders', () => {
    // The regression this guards: an accessible name computed by concatenation read
    // "Fix auth bug 5 Pts OVERDUE BUG Fernando Ramirez".
    render(
      <TaskCard
        title="Fix auth bug"
        points={5}
        dueDateText="OVERDUE"
        tags={[{ label: 'BUG' }]}
        assigneeName="Fernando Ramirez"
      />,
    );

    // An exact-name match would throw if the name had absorbed the rest of the card.
    const article = screen.getByRole('article', { name: 'Fix auth bug' });
    expect(article.getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('renders an actions slot in the header row', () => {
    render(
      <TaskCard
        title="Fix auth bug"
        actions={<button type="button">Task options for Fix auth bug</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Task options for Fix auth bug' })).toBeDefined();
  });

  it('does not open the card when a control in the actions slot is used', async () => {
    // A menu trigger sitting on a clickable card must not also open the card behind it.
    const onClick = vi.fn();
    const onOptions = vi.fn();
    const user = userEvent.setup();
    render(
      <TaskCard
        title="Fix auth bug"
        onClick={onClick}
        actions={
          <button type="button" onClick={onOptions}>
            Task options
          </button>
        }
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Task options' }));
    expect(onOptions).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards headingLevel so cards nest under their column header', () => {
    render(<TaskCard title="Fix auth bug" headingLevel={4} />);
    expect(screen.getByRole('heading', { level: 4, name: 'Fix auth bug' })).toBeDefined();
  });
});

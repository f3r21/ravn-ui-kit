import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskMetaBadges } from './task-meta-badges';

/**
 * These assert what a screen reader receives, never the markup that produces it (#19).
 *
 * The defect this covers was invisible to a markup assertion: the component *did* carry
 * `aria-label="3 comments"`, so a test reading that attribute would have passed while screen
 * readers heard nothing at all. `aria-label` is prohibited on the implicit `generic` role of a
 * bare `<span>` and is therefore dropped, and both children were `aria-hidden`, so no
 * accessible text remained.
 *
 * Querying the rendered text is what makes these fail if that shape comes back: the attribute
 * would return, and the text would not.
 */
describe('TaskMetaBadges', () => {
  const icon = <svg />;

  it('announces each badge by its label', () => {
    render(
      <TaskMetaBadges
        badges={[
          { icon, count: 3, label: '3 comments' },
          { icon, count: 5, label: '5 subtasks' },
        ]}
      />,
    );

    // `getByText` throws when absent, so reaching the assertion is the assertion.
    expect(screen.getByText('3 comments').textContent).toBe('3 comments');
    expect(screen.getByText('5 subtasks').textContent).toBe('5 subtasks');
  });

  it('announces the count, not merely that the thing exists', () => {
    // "3 comments" is the information; "comments" is not. The visible digit is
    // `aria-hidden`, so the label is the only place the number reaches anyone who
    // is not looking at the screen.
    render(<TaskMetaBadges badges={[{ icon, count: 3, label: '3 comments' }]} />);

    const name = screen.getByText('3 comments');
    expect(name.textContent).toMatch(/\b3\b/);
    expect(name.getAttribute('aria-hidden')).toBeNull();
  });

  it('hides the visible count from assistive tech, so it is not announced twice', () => {
    render(<TaskMetaBadges badges={[{ icon, count: 3, label: '3 comments' }]} />);

    // The digit renders for sighted users; the label carries it for everyone else.
    // Without this the badge announces "3 3 comments".
    const digit = screen.getByText('3', { selector: 'span.tabular-nums' });
    expect(digit.getAttribute('aria-hidden')).not.toBeNull();
  });

  it('names an icon-only badge, which has no count to fall back on', () => {
    // `count` is optional — the leading slot in the design renders icon-only. That badge
    // has no visible text at all, so a dropped label leaves it completely silent rather
    // than merely incomplete.
    render(<TaskMetaBadges badges={[{ icon, label: 'Has attachments' }]} />);

    expect(screen.getByText('Has attachments').textContent).toBe('Has attachments');
  });
});

import { render, screen } from '@testing-library/react';
import { isInaccessible } from '@testing-library/dom';
import { describe, it, expect } from 'vitest';
import { TaskMetaBadges, type TaskMetaBadge } from './task-meta-badges';

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
/**
 * The badges, as the row's own element children.
 *
 * Deliberately **not** `querySelector('span.inline-flex')`, which is what these cases used
 * first: that makes a Tailwind styling class the handle for an accessibility assertion, so a
 * class rename would turn an a11y test into a test of nothing. Raised in review on #109, and it
 * is this issue's own subject arriving one level up — a probe that stops testing what it claims
 * while still passing.
 *
 * "A badge is a direct child of the row" is a structural contract rather than a presentational
 * one, and if it stops holding, the length assertions below fail loudly.
 */
function badgesIn(container: HTMLElement): Element[] {
  const row = container.firstElementChild;
  return row ? [...row.children] : [];
}

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

/**
 * #93. #9 closed "render the badges decoratively" as already-satisfied, on the grounds that
 * `aria-label` on a role-less `<span>` is prohibited and therefore dropped — the counts were
 * silent by accident. #19 fixed the prohibited attribute with a real `sr-only` node, which is
 * the right fix and simultaneously deleted the silence the app's requirement rested on.
 *
 * So this restores the capability deliberately, as a property of the markup rather than a
 * coincidence of what is missing.
 */
describe('decorative badges (#93)', () => {
  /**
   * `isInaccessible` on the badge wrapper — and the first version of this assertion **did not
   * discriminate**, which is recorded because it is the exact failure this issue is about.
   *
   * It asked `queryByText('12', { ignore: '[aria-hidden] …' })` and asserted `null`. That is
   * `null` for a **labelled** badge too: the count span carries `aria-hidden` in both arms, so
   * the probe answered the same way whatever the component did and could never have failed.
   * Found by measuring rather than by reading — rendering a labelled badge against it printed
   * `null (VACUOUS)`.
   */
  it('is not reachable by assistive tech at all', () => {
    const { container } = render(
      <TaskMetaBadges
        badges={[{ icon: <svg data-glyph="true" />, count: 12, decorative: true }]}
      />,
    );

    const [badge] = badgesIn(container);
    expect(isInaccessible(badge)).toBe(true);
  });

  /**
   * The control the case above lacked at first: the same probe, on the same corpus, returning
   * the *other* answer. Without it, `isInaccessible` reporting `true` is indistinguishable
   * from a probe that reports `true` for everything.
   */
  it('control: the same probe reports a labelled badge as reachable', () => {
    const { container } = render(
      <TaskMetaBadges badges={[{ icon: <svg />, count: 12, label: '12 comments' }]} />,
    );

    const [badge] = badgesIn(container);
    expect(isInaccessible(badge)).toBe(false);
    expect(screen.getByText('12 comments')).toBeDefined();
  });

  /**
   * The control, and the reason the case above means something: a fix that silenced every badge
   * would pass it. This is the same suite showing a labelled badge still announcing.
   */
  it('control: a labelled badge in the same row is still announced', () => {
    const { container } = render(
      <TaskMetaBadges
        badges={[
          { icon: <svg />, count: 12, decorative: true },
          { icon: <svg />, count: 3, label: '3 comments' },
        ]}
      />,
    );

    const rendered = badgesIn(container);
    expect(rendered).toHaveLength(2);
    expect(isInaccessible(rendered[0])).toBe(true); // decorative
    expect(isInaccessible(rendered[1])).toBe(false); // labelled
    expect(screen.getByText('3 comments')).toBeDefined();
  });

  it('still draws the count and icon — decorative means silent, not absent', () => {
    const { container } = render(
      <TaskMetaBadges
        badges={[{ icon: <svg data-glyph="true" />, count: 12, decorative: true }]}
      />,
    );

    expect(container.textContent).toContain('12');
    expect(container.querySelector('[data-glyph]')).not.toBeNull();
  });

  it('renders no sr-only node for a decorative badge, and one for a labelled badge', () => {
    const { container, rerender } = render(
      <TaskMetaBadges badges={[{ icon: <svg />, count: 12, decorative: true }]} />,
    );
    expect(container.querySelector('.sr-only')).toBeNull();

    rerender(<TaskMetaBadges badges={[{ icon: <svg />, count: 12, label: '12 comments' }]} />);
    expect(container.querySelector('.sr-only')?.textContent).toBe('12 comments');
  });

  it('renders a row of decorative badges without colliding on React keys', () => {
    // A decorative badge has no `label`, which was the key. Two of them must still render.
    const { container } = render(
      <TaskMetaBadges
        badges={[
          { icon: <svg />, count: 1, decorative: true },
          { icon: <svg />, count: 2, decorative: true },
        ]}
      />,
    );
    expect(container.textContent).toContain('1');
    expect(container.textContent).toContain('2');
  });

  /**
   * The guarantee is a compile error, not a convention (#93's third verification point).
   * Without this the type could be relaxed to `label?: string` and every runtime test above
   * would still pass — the incoherent combination would simply become expressible again.
   *
   * `@ts-expect-error` fails the build if the line it guards ever *stops* being an error, so
   * this case cannot rot into a comment.
   */
  it('the type rejects a decorative badge that also carries a label', () => {
    const badges: TaskMetaBadge[] = [
      // @ts-expect-error — `decorative: true` makes `label` `never`; announced-and-silent is
      // a contradiction and must not compile.
      { icon: <svg />, count: 12, decorative: true, label: '12 comments' },
    ];
    // Rendering it proves the fixture is real rather than a type-only assertion floating free.
    const { container } = render(<TaskMetaBadges badges={badges} />);
    expect(container.textContent).toContain('12');
  });
});

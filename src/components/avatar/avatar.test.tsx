import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from './avatar';

describe('Avatar Component', () => {
  it('renders initials when name is provided without src', () => {
    render(<Avatar name="Fernando Ramirez" />);
    expect(screen.getByText('FR')).toBeDefined();
  });

  it('renders image when src is provided', () => {
    render(<Avatar src="https://example.com/avatar.jpg" name="User" />);
    // Queried through the accessible name rather than `getByAltText`: the `alt` is now `""`
    // on purpose, and the old query was the anti-pattern this fix removes.
    const img = screen.getByRole('img', { name: 'User' }).querySelector('img') as HTMLImageElement;
    expect(img.src).toBe('https://example.com/avatar.jpg');
    expect(img.getAttribute('alt')).toBe('');
  });

  /**
   * #47, and the case with the teeth.
   *
   * A test written against an image-bearing avatar passes on the broken code, because the old
   * `alt={name}` supplied a name in that state. What it could never supply is a name in the
   * *fallback* state — no `<img>`, so no `alt`, so a `<div>` holding two letters with no role
   * and no accessible name of any kind. This asserts that state specifically. Same shape as
   * `animate-pulse` matching inside `motion-safe:animate-pulse` (#45): the assertion has to
   * target the half that was actually broken.
   *
   * Not an edge case either — the consuming API's `User.avatar` and `Task.assignee` are both
   * nullable, which is the reason the fallback exists at all.
   */
  it('has an accessible name in the initials state, where there is no img to carry one', () => {
    render(<Avatar name="Priya Nair" />);

    const avatar = screen.getByRole('img', { name: 'Priya Nair' });
    expect(avatar.querySelector('img')).toBeNull();
    // The initials stay in textContent — `role="img"` makes them presentational, not absent.
    expect(avatar.textContent).toBe('PN');
  });

  it('names an unassigned avatar rather than leaving a bare question mark', () => {
    const { rerender } = render(<Avatar />);
    expect(screen.getByRole('img', { name: 'Unassigned' }).textContent).toBe('?');

    // Overridable, because the kit cannot know the consumer's language or domain — the same
    // reason `TaskListView`'s `emptyTitle` is a prop.
    rerender(<Avatar fallbackLabel="Sin asignar" />);
    expect(screen.getByRole('img', { name: 'Sin asignar' })).toBeDefined();
  });

  it('guards the empty alt: exactly one element carries the name, never two', () => {
    // This IS the guard for the `alt=""` half, and it is the only case that covers it — do not
    // read it as a redundant restatement of the case above.
    //
    // It does pass against the fully-broken component, because there the wrapper has no role
    // and only the `<img>` matches, which is still exactly one. What it catches is the
    // half-fix: keep the wrapper's `role="img"` and put an `alt` back on the image and this
    // returns 2 and goes red. Verified by doing exactly that — `expected [ …(2) ] to have a
    // length of 1 but got 2`.
    render(<Avatar src="https://example.com/a.jpg" name="Grace Stone" />);
    expect(screen.getAllByRole('img', { name: 'Grace Stone' })).toHaveLength(1);
  });

  it('carries a hover tooltip with the same name', () => {
    // Not accessibility — `aria-label` outranks `title` for the accessible name, and nothing
    // asserts on it in the consumer's suite. It is the tooltip a pointer user gets, which the
    // app's own avatar has; without it the swap would quietly drop hover-to-see-who.
    const { rerender } = render(<Avatar name="Grace Stone" />);
    expect(screen.getByRole('img', { name: 'Grace Stone' }).getAttribute('title')).toBe(
      'Grace Stone',
    );

    rerender(<Avatar />);
    expect(screen.getByRole('img', { name: 'Unassigned' }).getAttribute('title')).toBe(
      'Unassigned',
    );
  });

  /**
   * The initials pairing, pinned as a class.
   *
   * `bg-primary-1 text-primary-4` measured 2.61:1 and was 46 of the kit's 131 contrast
   * violations — the largest single defect in the palette, from one class, because an
   * avatar renders in nearly every composed story. `contrast.test.ts` proves
   * `neutral-5` on the tint clears 10.50:1, but arithmetic over `tokens.css` cannot see
   * which token this component reaches for. This can.
   */
  it('keeps the tint and labels the initials in the contrast-checked colour', () => {
    render(<Avatar name="Fernando Ramirez" />);
    const cls = screen.getByText('FR').parentElement!.className;
    expect(cls).toContain('bg-primary-1');
    expect(cls).toContain('text-neutral-5');
    expect(cls).not.toContain('text-primary-4');
  });

  /** #11. */
  it('forwards a ref and spreads unrecognised props onto the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Avatar name="Fernando Ramirez" ref={ref} data-testid="avatar" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId('avatar')).toBeDefined();
  });
});

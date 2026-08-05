import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import * as icons from './icons';

/**
 * `IconProps` is a type-only export, so everything left on the module at runtime is a
 * glyph. Deriving the list rather than hand-writing it means a newly added icon is covered
 * by the whole suite below the moment it is exported — there is no list to forget.
 */
const entries = Object.entries(icons);

describe('icon set', () => {
  it('exports every glyph the kit and the consuming app need', () => {
    // Guards the Phase 2 promise that the app's own `src/ui/icons/icons.tsx` becomes
    // deletable: the first 17 below are exactly what that file exports. Asserting the
    // names rather than the count means dropping one is a failure, not a silent swap.
    expect(entries.map(([name]) => name).sort()).toEqual(
      [
        'AlarmIcon',
        'AssigneeIcon',
        'AttachmentIcon',
        'BellIcon',
        'CalendarIcon',
        'ChevronDownIcon',
        'CloseIcon',
        'CommentIcon',
        'GridViewIcon',
        'LabelIcon',
        'ListViewIcon',
        'LogoMark',
        'MenuDotsIcon',
        'PlusIcon',
        'PointsIcon',
        'SearchIcon',
        'SubtaskIcon',
        // Kit-only additions: the date picker's month/year navigation and the task
        // table's "Details" link have no counterpart in the app's set.
        'ChevronDoubleLeftIcon',
        'ChevronDoubleRightIcon',
        'ChevronLeftIcon',
        'ChevronRightIcon',
      ].sort(),
    );
  });

  describe.each(entries)('%s', (_name, Glyph) => {
    it('is decorative by default', () => {
      const { container } = render(<Glyph />);
      const svg = container.querySelector('svg')!;

      expect(svg.getAttribute('aria-hidden')).toBe('true');
      expect(svg.hasAttribute('role')).toBe(false);
    });

    it('promotes itself to a named image when given an accessible name', () => {
      const { container } = render(<Glyph aria-label="Open menu" />);
      const svg = container.querySelector('svg')!;

      // A named icon is by definition not decorative — `aria-hidden` has to come off, or
      // the name is announced to nobody.
      expect(svg.getAttribute('role')).toBe('img');
      expect(svg.hasAttribute('aria-hidden')).toBe(false);
      expect(svg.getAttribute('aria-label')).toBe('Open menu');
    });

    it('promotes itself when named indirectly via aria-labelledby', () => {
      const { container } = render(<Glyph aria-labelledby="glyph-label" />);
      const svg = container.querySelector('svg')!;

      expect(svg.getAttribute('role')).toBe('img');
      expect(svg.hasAttribute('aria-hidden')).toBe(false);
    });

    it('draws its glyph and takes its colour from the text colour', () => {
      const { container } = render(<Glyph />);
      const svg = container.querySelector('svg')!;

      expect(svg.hasAttribute('viewBox')).toBe(true);
      expect(svg.querySelectorAll('path').length).toBeGreaterThan(0);
      // Either a filled glyph whose paths inherit `currentColor`, or a stroked one whose
      // `<svg>` does. Both routes exist in this set; neither may bake a literal colour,
      // which is the whole reason the design ships the alarm glyph twice and the kit once.
      const inheritsColour =
        svg.getAttribute('stroke') === 'currentColor' ||
        [...svg.querySelectorAll('path')].some((p) => p.getAttribute('fill') === 'currentColor');
      expect(inheritsColour).toBe(true);
      expect(svg.outerHTML).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    });

    it('lets the caller size it and override the defaults', () => {
      const { container } = render(<Glyph className="size-6" aria-hidden={false} />);
      const svg = container.querySelector('svg')!;

      expect(svg.getAttribute('class')).toBe('size-6');
      // Caller props are spread last precisely so an explicit choice beats the default.
      expect(svg.getAttribute('aria-hidden')).toBe('false');
    });
  });
});

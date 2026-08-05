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
    const img = screen.getByAltText('User') as HTMLImageElement;
    expect(img.src).toBe('https://example.com/avatar.jpg');
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
});

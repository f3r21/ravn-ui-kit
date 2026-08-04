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
});

import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ViewSwitcher } from './view-switcher';

const icons = {
  leftIcon: <svg data-testid="board-icon" />,
  rightIcon: <svg data-testid="list-icon" />,
  leftLabel: 'Board view',
  rightLabel: 'List view',
};

/** Controlled host, so "selection follows focus" can be observed the way a consumer wires it. */
function Harness({ initial = 'left' as 'left' | 'right', onChange = vi.fn() }) {
  const [value, setValue] = useState<'left' | 'right'>(initial);
  return (
    <ViewSwitcher
      {...icons}
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange(v);
      }}
    />
  );
}

describe('ViewSwitcher Component', () => {
  it('groups the two buttons as a named radiogroup', () => {
    render(<ViewSwitcher {...icons} value="left" />);
    // Before this, the wrapper was a plain <div>: nothing said the two buttons were related.
    expect(screen.getByRole('radiogroup', { name: 'View' })).toBeDefined();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('lets a consumer name the group, for a page holding more than one', () => {
    render(<ViewSwitcher {...icons} value="left" label="Task layout" />);
    expect(screen.getByRole('radiogroup', { name: 'Task layout' })).toBeDefined();
  });

  it('reports which side is selected via aria-checked, not colour alone', () => {
    const { rerender } = render(<ViewSwitcher {...icons} value="left" />);
    expect(screen.getByRole('radio', { name: 'Board view' }).getAttribute('aria-checked')).toBe(
      'true',
    );
    expect(screen.getByRole('radio', { name: 'List view' }).getAttribute('aria-checked')).toBe(
      'false',
    );

    rerender(<ViewSwitcher {...icons} value="right" />);
    expect(screen.getByRole('radio', { name: 'Board view' }).getAttribute('aria-checked')).toBe(
      'false',
    );
    expect(screen.getByRole('radio', { name: 'List view' }).getAttribute('aria-checked')).toBe(
      'true',
    );
  });

  it('is a single tab stop — only the selected side is tabbable', () => {
    // The roving tabindex. `useButton` hardcodes tabIndex={0}, so a regression here shows up
    // as both buttons reading "0" and the group costing two tab presses to pass.
    render(<ViewSwitcher {...icons} value="right" />);
    expect(screen.getByRole('radio', { name: 'Board view' }).getAttribute('tabindex')).toBe('-1');
    expect(screen.getByRole('radio', { name: 'List view' }).getAttribute('tabindex')).toBe('0');
  });

  it('calls onChange with the side that was clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ViewSwitcher {...icons} value="left" onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: 'List view' }));
    expect(onChange).toHaveBeenCalledWith('right');
  });

  it.each([['{ArrowRight}'], ['{ArrowDown}'], ['{ArrowLeft}'], ['{ArrowUp}']])(
    'moves selection and focus with %s',
    async (key) => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Harness onChange={onChange} />);

      await user.tab();
      expect(screen.getByRole('radio', { name: 'Board view' })).toBe(document.activeElement);

      await user.keyboard(key);
      // With exactly two options every arrow is the same move, and selection follows focus.
      expect(onChange).toHaveBeenCalledWith('right');
      expect(screen.getByRole('radio', { name: 'List view' })).toBe(document.activeElement);
      expect(screen.getByRole('radio', { name: 'List view' }).getAttribute('aria-checked')).toBe(
        'true',
      );
    },
  );

  it('selects the first side on Home and the last on End', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initial="right" onChange={onChange} />);

    await user.tab();
    await user.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith('left');
    expect(screen.getByRole('radio', { name: 'Board view' })).toBe(document.activeElement);

    await user.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith('right');
    expect(screen.getByRole('radio', { name: 'List view' })).toBe(document.activeElement);
  });

  it('ignores keys it does not own', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ViewSwitcher {...icons} value="left" onChange={onChange} />);

    screen.getByRole('radio', { name: 'Board view' }).focus();
    await user.keyboard('{Escape}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders both consumer-supplied icons', () => {
    render(<ViewSwitcher {...icons} value="left" />);
    expect(screen.getByTestId('board-icon')).toBeDefined();
    expect(screen.getByTestId('list-icon')).toBeDefined();
  });

  it('paints a focus ring rather than suppressing one', () => {
    // Same regression pin as every other focusable component here — see button.tsx's doc
    // comment for why `outline-none` in front of `outline-2` paints nothing in Tailwind v4.
    render(<ViewSwitcher {...icons} value="left" />);
    const radio = screen.getByRole('radio', { name: 'Board view' });

    expect(radio.className).not.toContain('outline-none');
    expect(radio.className).toContain('focus-visible:outline-2');
  });

  it('forwards a ref and spreads unrecognised props onto the root element (#11)', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ViewSwitcher {...icons} value="left" ref={ref} data-testid="switcher" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId('switcher')).toBe(ref.current);
  });
});

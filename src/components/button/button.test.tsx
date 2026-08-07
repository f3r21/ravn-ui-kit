import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

const Icon = () => <svg aria-hidden />;

describe('Button Component', () => {
  it('renders with its accessible name', () => {
    render(
      <Button aria-label="Add">
        <Icon />
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Add' })).toBeDefined();
  });

  it('triggers onPress event handler when clicked', async () => {
    const handlePress = vi.fn();
    const user = userEvent.setup();

    render(
      <Button aria-label="Submit" onPress={handlePress}>
        <Icon />
      </Button>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('disables button when isDisabled prop is true', () => {
    render(
      <Button aria-label="Disabled" isDisabled>
        <Icon />
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it('carries radio semantics onto the element, which useButton alone does not', () => {
    // These are applied after `{...buttonProps}` on purpose. `useButton` returns only the
    // props it knows about, and `role`/`aria-checked` are not among them — routed through
    // it, both land as `null` and `ViewSwitcher`'s radiogroup silently has no radios in it.
    render(
      <Button aria-label="Board view" role="radio" aria-checked>
        <Icon />
      </Button>,
    );
    const radio = screen.getByRole('radio', { name: 'Board view' });
    expect(radio.getAttribute('aria-checked')).toBe('true');
  });

  it('yields tabIndex -1 via excludeFromTabOrder, the only lever useButton leaves open', () => {
    // `useButton` hardcodes tabIndex={0}, so a roving tabindex cannot be built by passing
    // `tabIndex` — it is ignored. This is what a radiogroup's unselected option relies on.
    const { rerender } = render(
      <Button aria-label="Roving">
        <Icon />
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Roving' }).getAttribute('tabindex')).toBe('0');

    rerender(
      <Button aria-label="Roving" excludeFromTabOrder>
        <Icon />
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Roving' }).getAttribute('tabindex')).toBe('-1');
  });

  it('stays a plain button with no checked state when no role is given', () => {
    render(
      <Button aria-label="Plain" isSelected>
        <Icon />
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Plain' });
    expect(button.getAttribute('role')).toBeNull();
    // `isSelected` is visual only — it must not leak into the accessibility tree.
    expect(button.getAttribute('aria-checked')).toBeNull();
  });

  it('keeps the 24px frame but does not stretch the glyph to fill it', () => {
    // #46. Figma's "Icon Placeholder" is inset 20% of the 40px button — 24px, identical on
    // every variant — while "Vector" inside it is 14px on Primary, 18px on Secondary, and
    // 18×16 on one ViewSwitcher glyph. `[&>svg]:w-full [&>svg]:h-full` collapsed all three
    // to 24px and stretched the non-square one.
    //
    // Asserting the frame exists is NOT enough — it existed on the broken code too. What
    // has teeth is the absence of the stretch utilities: restore either one and this fails.
    // jsdom applies no stylesheet, so the rendered pixel sizes are proved in a browser
    // against the built Storybook instead; see the PR body.
    const { container } = render(
      <Button aria-label="Add">
        <svg data-testid="glyph" className="size-3.5" />
      </Button>,
    );
    const frame = container.querySelector('span');

    expect(frame?.className).toContain('w-6');
    expect(frame?.className).toContain('h-6');
    expect(frame?.className).not.toContain('[&>svg]:w-full');
    expect(frame?.className).not.toContain('[&>svg]:h-full');
  });

  it('lets a consumer’s own size class reach the glyph', () => {
    // The descendant selector `[&>svg]:w-full` outranked a plain `.size-3.5` utility on
    // specificity, so the app passing `<PlusIcon className="size-3.5" />` had no effect.
    render(
      <Button aria-label="Add">
        <svg data-testid="glyph" className="size-3.5" />
      </Button>,
    );
    expect([...screen.getByTestId('glyph').classList]).toContain('size-3.5');
  });
});

import { useRef } from 'react';
import { Button } from '../button/button';
import { cn } from '../../utils/cn';

export interface ViewSwitcherProps {
  /** Which side is currently active. */
  value: 'left' | 'right';
  /** Called with the side that was pressed. */
  onChange?: (value: 'left' | 'right') => void;
  /** 24×24 icon for the left button (`currentColor`). */
  leftIcon: React.ReactNode;
  /** 24×24 icon for the right button (`currentColor`). */
  rightIcon: React.ReactNode;
  /** Accessible name for the left button. */
  leftLabel: string;
  /** Accessible name for the right button. */
  rightLabel: string;
  /**
   * Accessible name for the group as a whole, announced before the selected option
   * ("View, Board, radio button, 1 of 2"). Without one the two buttons read as an
   * unexplained pair, which is what "board vs list" needs explaining.
   *
   * Defaults to `'View'`, matching `SegmentedControl`'s own group name so the kit's two
   * radiogroups agree; pass something specific when the page holds more than one.
   * @default 'View'
   */
  label?: string;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * ViewSwitcher
 *
 * Figma: "Swicter" (`Button, Switch Button01.md`; confirmed as a real, repeated
 * page-level fixture via the identical in-context "Top Bar" instance on both
 * `Mockups/Dashboard Default View/Dashboard Mockup.md` and `Mockups/Task
 * Default View/My Task Mockup.md`) — an 80×40, `neutral.5` background, 8px-radius
 * wrapper holding exactly two of the existing icon `Button`s (`variant="secondary"`),
 * toggling which one carries `isSelected` (`Property 1=Right Selected` /
 * `Property 1=Left Selected`). Both real page instances render the identical
 * selected side, so nothing in spec ties a given side to a given content type
 * (board vs. table) — `value`/`onChange` stay purely positional (`left`/`right`)
 * rather than baking in an unverified board/list semantic, and both icon slots
 * are consumer-supplied (no default glyph) since the source vector paths aren't
 * legible enough to reproduce faithfully, the same "leave the un-legible glyph
 * unimplemented" discipline used for TaskTable/TaskCard's unglyphed slots.
 *
 * Accessibility: the two buttons are a `role="radiogroup"` of `role="radio"`s, following
 * `SegmentedControl` — read its doc comment for why the roles are hand-rolled rather than
 * taken from `useRadio`/`useRadioGroup` (those hooks drive a real `<input type="radio">`,
 * which this component's icon-button shape has no room for). Selection follows focus, and
 * the group is one tab stop: the selected side is the only tabbable one, arrows and
 * Home/End move between them. Before this, selection was carried by border colour alone —
 * nothing in the accessibility tree said which side was active, or that the two buttons
 * were related at all.
 */
export function ViewSwitcher({
  value,
  onChange,
  leftIcon,
  rightIcon,
  leftLabel,
  rightLabel,
  label = 'View',
  className,
}: ViewSwitcherProps) {
  // A ref per side would need `Button` to forward one, and this kit has no `forwardRef`
  // anywhere (`grep -rn "forwardRef" src/` → 0 hits) — so focus moves via the group's own
  // node instead. Exactly two buttons live here, in source order, so index 0/1 is the left
  // and right side rather than a guess about the DOM.
  const rootRef = useRef<HTMLDivElement>(null);

  const select = (side: 'left' | 'right') => {
    onChange?.(side);
    rootRef.current?.querySelectorAll('button')[side === 'left' ? 0 : 1]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    let next: 'left' | 'right';
    switch (event.key) {
      // With exactly two options, "next" and "previous" are the same move — both wrap, the
      // same way SegmentedControl's modular arithmetic does at length 2.
      case 'ArrowRight':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowUp':
        next = value === 'left' ? 'right' : 'left';
        break;
      case 'Home':
        next = 'left';
        break;
      case 'End':
        next = 'right';
        break;
      default:
        return;
    }

    event.preventDefault();
    select(next);
  };

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      aria-label={label}
      className={cn('flex items-center w-20 h-10 bg-surface-shell rounded-sm', className)}
    >
      <Button
        variant="secondary"
        role="radio"
        aria-checked={value === 'left'}
        // Roving tabindex: the group is one tab stop. `useButton` hardcodes `tabIndex={0}`,
        // so this is the only lever that reaches `-1` — see `ButtonProps['role']`.
        excludeFromTabOrder={value !== 'left'}
        isSelected={value === 'left'}
        aria-label={leftLabel}
        onKeyDown={handleKeyDown}
        onPress={() => select('left')}
      >
        {leftIcon}
      </Button>
      <Button
        variant="secondary"
        role="radio"
        aria-checked={value === 'right'}
        excludeFromTabOrder={value !== 'right'}
        isSelected={value === 'right'}
        aria-label={rightLabel}
        onKeyDown={handleKeyDown}
        onPress={() => select('right')}
      >
        {rightIcon}
      </Button>
    </div>
  );
}

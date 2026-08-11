import { useState } from 'react';
import { useTextField, useObjectRef } from 'react-aria';
import { cn } from '../../utils/cn';
import { SearchIcon } from '../icons/icons';

export interface SearchBarProps {
  /**
   * Ref to the underlying `<input>` (#11), matching the form-control convention
   * `Datepicker`/`Input`/`LabelCheckbox` already follow. Merged with the internal ref
   * `useTextField` needs via `useObjectRef`.
   */
  ref?: React.Ref<HTMLInputElement>;
  /**
   * Placeholder text shown in the input.
   * @default 'Search...'
   */
  placeholder?: string;
  /** Controlled value. */
  value?: string;
  /** Called on every keystroke. */
  onChange?: (value: string) => void;
  /** Called when user submits (Enter). */
  onSubmit?: (value: string) => void;
  /**
   * Accessible name for the input. Was hardcoded to `'Search'` with no way past it, so a
   * consumer whose page holds more than one search — or which simply says something more
   * specific, e.g. `'Search tasks'` — could not name its own field.
   * @default 'Search'
   */
  label?: string;
  /**
   * `id` for the input element. Only needed when something outside this component has to
   * point at the field — an external `<label htmlFor>`, an `aria-controls` on a results
   * region. Left off, React Aria generates one.
   *
   * Note that `label` above still wins as the accessible name: an `aria-label` overrides a
   * `<label>` element. Pass one or the other, not both.
   */
  id?: string;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * SearchBar
 *
 * Figma: "Frame 649" inside the "Search Bar" component (Top Navigation Bar00/01.md,
 * confirmed against the in-context instance in `Dashboard Mockup.md`). This is only
 * the icon+input portion — Frame 649 has a fixed `width: 171px` (24px icon + 24px
 * gap + 123px text) with no fill/padding of its own, so it renders transparently
 * and is meant to be composed inside a container that supplies the neutral-4
 * background (see `TopNav`, which wraps this plus the trailing icon/avatar slot
 * to match the full "Search Bar" component).
 * - Icon: 24x24, neutral-2
 * - Text: Desktop/Body/M/regular — SF Pro Display 15px/24px, letter-spacing 0.75px, neutral-2
 */
export function SearchBar({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onSubmit,
  label = 'Search',
  id,
  className,
  ref: forwardedRef,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const ref = useObjectRef(forwardedRef);

  const { inputProps } = useTextField(
    {
      value,
      onChange: (v) => {
        if (!isControlled) setInternalValue(v);
        onChange?.(v);
      },
      onKeyDown: (e) => {
        if (e.key === 'Enter') onSubmit?.(value);
      },
      'aria-label': label,
      id,
      // Makes the element a `searchbox` rather than a `textbox`, which is what a screen
      // reader announces and what a consumer's `getByRole('searchbox')` finds. It also
      // opts the field into the platform's search affordances — including WebKit's native
      // clear button, suppressed below because `TopNav` renders its own.
      type: 'search',
      placeholder,
    },
    ref,
  );

  return (
    <div className={cn('inline-flex items-center gap-6 min-w-0', className)}>
      <SearchIcon className="w-6 h-6 text-muted shrink-0" />

      <input
        {...inputProps}
        ref={ref}
        // `placeholder:text-muted-on-dark`, not `placeholder:text-muted`. The input is
        // `bg-transparent` and the wrapper paints nothing either, so a SearchBar sits on
        // whatever contains it. Inside `TopNav` that is `surface-panel` (4.58:1), but the
        // component is exported on its own and `neutral-2` is 3.73:1 on an overlay. The
        // leading icon keeps `text-muted` — non-text, so 3:1 applies and 3.73 clears it.
        // `[&::-webkit-search-cancel-button]:appearance-none` — `type="search"` gives WebKit
        // a built-in clear glyph inside the field, and `TopNav` already renders a real
        // "Clear search" button beside it. Two clear controls, one of them unlabelled and
        // unstyled, is worse than the one that was there before.
        className="flex-1 bg-transparent text-body-m text-main placeholder:text-muted-on-dark font-sans min-w-0 rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 [&::-webkit-search-cancel-button]:appearance-none"
      />
    </div>
  );
}

import { useRef } from 'react';
import { useListBox, useOption, type AriaListBoxOptions } from 'react-aria';
import type { ListState, Node } from 'react-stately';
import { cn } from '../../utils/cn';

export interface ListBoxProps<T extends object> extends AriaListBoxOptions<T> {
  /**
   * react-stately list state driving this listbox's collection, selection,
   * and focus. `ListBox` never builds its own state — it's built by
   * `useListState` for a standalone list, or by whichever hook a composing
   * component uses (`Select` uses `useSelectState`, `MultiSelect` uses
   * `useListState` with `selectionBehavior: 'toggle'`) — so the same
   * rendering/keyboard logic works no matter which hook produced the state.
   */
  state: ListState<T>;
  /** Ref to the underlying `<ul>` element. */
  listBoxRef?: React.RefObject<HTMLUListElement | null>;
  /** Additional class names applied to the `<ul>`, merged last via `cn()`. */
  className?: string;
}

/**
 * ListBox
 *
 * Headless option list — the `role="listbox"`/`role="option"` surface shared
 * by `Select` and `MultiSelect`'s popovers, and usable standalone. Built on
 * react-aria's `useListBox`/`useOption` over a react-stately `ListState`,
 * populated via the same `items` + `children` render-function
 * `<Item>`/Collection composition pattern `Tabs` uses for its state hook —
 * not a kit-invented flat prop-array shape — so `ListBox` is generic over
 * any item type/shape rather than a hardcoded `{ id, label }`.
 *
 * Keyboard behavior (arrow keys move focus, Home/End jump to the ends,
 * typeahead-to-select, Enter/Space to select) comes from
 * `useListBox`/`useOption` for free; this component only renders what they
 * report.
 */
export function ListBox<T extends object>({
  state,
  listBoxRef,
  className,
  ...props
}: ListBoxProps<T>) {
  const fallbackRef = useRef<HTMLUListElement>(null);
  const ref = listBoxRef ?? fallbackRef;
  const { listBoxProps } = useListBox(props, state, ref);

  return (
    <ul
      {...listBoxProps}
      ref={ref}
      className={cn('max-h-64 min-w-40 overflow-auto py-2 outline-none', className)}
    >
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
}

interface OptionProps<T> {
  item: Node<T>;
  state: ListState<T>;
}

function Option<T>({ item, state }: OptionProps<T>) {
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    ref,
  );

  return (
    <li
      {...optionProps}
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-1.5 text-body-m font-sans cursor-pointer',
        // Focus and selection are independent states with independent
        // styling — merging them would leave a keyboard user with no way
        // to tell which option their arrow keys are actually on.
        //
        // The fill alone was not enough to tell them, though. `bg-neutral-4` on the
        // popover's `surface-overlay` measures **1.23:1**, and 1.00:1 if a consumer puts
        // a bare ListBox on a panel — an invisible keyboard focus indicator, and the `<li>`
        // carried `outline-none` so there was no other affordance either. That is 2.4.7,
        // and it survived a pass whose whole subject was focus rings, because arrow-key
        // focus inside a popover is not something a static story shows.
        //
        // The fill stays as the quiet selection-independent cue and an inset ring carries
        // the visibility (5.43:1 on an overlay). `outline-solid` is explicit for the same
        // reason it is on `LabelCheckbox`; `outline-none` is gone rather than overridden,
        // because it sets `--tw-outline-style: none` and would suppress the ring outright.
        isFocused &&
          'bg-neutral-4 outline-solid outline-2 -outline-offset-2 outline-interactive-text',
        // `-text`, not the bare `text-interactive`: this is the one place the accent is
        // used as *text* on a dark surface, and primary-4 measures 2.86:1 on the
        // popover's `surface-overlay`. See `tokens.css`'s contrast-safe roles.
        isSelected ? 'text-interactive-text font-semibold' : 'text-main',
        isDisabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span>{item.rendered}</span>
      {isSelected ? <span aria-hidden="true">✓</span> : null}
    </li>
  );
}

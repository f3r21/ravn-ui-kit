import { useRef } from 'react';
import { useButton } from 'react-aria';
import { useListState, useOverlayTriggerState, type ListProps } from 'react-stately';
import { cn } from '../../utils/cn';
import { Tag } from '../tag/tag';
import { ListBox } from '../listbox/list-box';
import { FloatingPopover } from '../popover/floating-popover';

export interface MultiSelectProps<T extends object>
  extends Omit<ListProps<T>, 'selectionMode' | 'selectionBehavior'> {
  /** Accessible name for the control, announced on the trigger and the option list. */
  label: string;
  /** Shown inside the trigger when no item is selected yet. */
  placeholder: string;
  /** Optional leading icon rendered in the trigger, ahead of the value. */
  icon?: React.ReactNode;
  /** Disables the whole control, preventing the popover from opening. */
  isDisabled?: boolean;
  /** Additional class names applied to the trigger's wrapping container, merged last via `cn()`. */
  className?: string;
}

/**
 * MultiSelect
 *
 * The tag/multi-value picker the app currently hand-rolls (`TaskFormDialog`'s
 * tags field, `BoardFiltersBar`'s tags filter — `MIGRATION_GAPS.md` Section
 * 4). Composes `ListBox` and `FloatingPopover` like `Select` does, but over
 * react-stately's `useListState` instead of `useSelectState`: there is no
 * native multi-select element or single "selected item" to show in the
 * trigger, and the popover should stay open while the user picks several
 * items rather than closing after one — different enough in kind from
 * `Select` that folding them into one component behind a `selectionMode`
 * prop would leave every branch of it asking which mode it's in. No
 * `HiddenSelect` counterpart here for the same reason: a native
 * `<select multiple>` is a scrolling list box that looks nothing like this
 * design, and the control is never submitted as a form field directly — a
 * consuming form reads the selection from `onSelectionChange`.
 *
 * Selected items render as `Tag` chips in the trigger — visual only, no
 * `onRemove`, so the trigger stays a single real `<button>` rather than a
 * button nesting more buttons (invalid and a screen-reader trap). Removal
 * happens the same way selection does: reopen the list and toggle the item
 * off, where its checkmark already shows which items are selected.
 */
export function MultiSelect<T extends object>({
  label,
  placeholder,
  icon,
  isDisabled,
  className,
  ...props
}: MultiSelectProps<T>) {
  const overlayState = useOverlayTriggerState({});
  const triggerRef = useRef<HTMLButtonElement>(null);

  const listState = useListState<T>({
    ...props,
    selectionMode: 'multiple',
    // Explicit, not the default: a plain click on an item should add it to
    // the selection, not replace it — the behavior a set of checkable tags
    // needs, unlike a file browser's click-to-replace/Ctrl-click-to-add.
    selectionBehavior: 'toggle',
  });

  const { buttonProps } = useButton(
    { onPress: () => overlayState.toggle(), isDisabled, 'aria-label': label },
    triggerRef
  );

  const selectedItems = [...listState.collection].filter((item) =>
    listState.selectionManager.isSelected(item.key)
  );

  return (
    <div className={cn('inline-block', className)}>
      <button
        {...buttonProps}
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={overlayState.isOpen}
        className={cn(
          // See Select's identical note: `bg-surface-neutral` is a light
          // surface, so the placeholder/value text needs `Input`'s
          // light-surface colors (`text-muted`/`text-neutral-5`), not
          // `text-main` (invisible white-on-white once something's picked).
          'inline-flex items-center gap-2 min-h-10 px-3 py-1.5 rounded-md bg-surface-neutral border border-subtle text-body-m font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          selectedItems.length > 0 ? 'text-neutral-5' : 'text-muted'
        )}
      >
        {icon}
        {selectedItems.length > 0 ? (
          <span className="flex flex-wrap items-center gap-1">
            {/* `variant="neutral"`'s solid style is `text-main` (white) — legible
                on the dark surfaces Tag is normally shown on, invisible on this
                trigger's light `bg-surface-neutral`. `primary`'s tinted-red style
                uses `text-primary-4` for its text, which stays legible on both. */}
            {selectedItems.map((item) => (
              <Tag key={item.key} variant="primary">
                {item.rendered}
              </Tag>
            ))}
          </span>
        ) : (
          <span>{placeholder}</span>
        )}
        <ChevronDownIcon />
      </button>

      {overlayState.isOpen ? (
        <FloatingPopover state={overlayState} triggerRef={triggerRef} placement="bottom start">
          {/* autoFocus moves focus into the list on open. Without it, focus
              stays on the trigger — outside the popover — so arrow keys go
              nowhere and Escape/blur dismissal (bound on the popover
              surface) never sees the keydown. useSelect does this
              automatically for Select; a hand-assembled trigger has to do
              it itself. This is react-aria's `ListBoxProps.autoFocus`
              (WAI-ARIA popup focus management), not the raw DOM autofocus
              anti-pattern this rule targets — same justification as
              Modal/Popover's FocusScope `autoFocus`. */}
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <ListBox aria-label={label} state={listState} autoFocus />
        </FloatingPopover>
      ) : null}
    </div>
  );
}

const ChevronDownIcon = () => (
  <svg
    className="w-3 h-3 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

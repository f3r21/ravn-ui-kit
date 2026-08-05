import { useRef } from 'react';
import { useButton, useField } from 'react-aria';
import { useListState, useOverlayTriggerState, type ListProps } from 'react-stately';
import { cn } from '../../utils/cn';
import { Tag } from '../tag/tag';
import { ListBox } from '../listbox/list-box';
import { FloatingPopover } from '../popover/floating-popover';
import { ChevronDownIcon } from '../icons/icons';
import { FieldMessages } from '../form-field/form-field';

export interface MultiSelectProps<T extends object> extends Omit<
  ListProps<T>,
  'selectionMode' | 'selectionBehavior'
> {
  /** Accessible name for the control, announced on the trigger and the option list. */
  label: string;
  /** Shown inside the trigger when no item is selected yet. */
  placeholder: string;
  /** Optional leading icon rendered in the trigger, ahead of the value. */
  icon?: React.ReactNode;
  /** Disables the whole control, preventing the popover from opening. */
  isDisabled?: boolean;
  /**
   * Error message rendered below the trigger. When set, also switches the trigger to its
   * error visual state and marks it invalid to assistive tech.
   */
  error?: string;
  /** Helper text rendered below the trigger. Hidden while `error` is set. */
  description?: string;
  // No `isRequired` here, deliberately. This control's trigger is a real <button>, and
  // `aria-required` is not a supported state of role="button" (ARIA 1.2) — emitting it
  // anyway would be invalid ARIA rather than an accessibility win. Unlike `Select` there
  // is no `HiddenSelect` to carry it either (a native <select multiple> looks nothing
  // like this design; see the component doc comment). A form that needs machine-readable
  // required-ness should validate on submit and pass the result back as `error`, which
  // this control does support and does associate.
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
  error,
  description,
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

  // Unlike Select there is no field hook underneath this control (it is assembled from
  // useListState + a plain button), so useField is what produces the ids and the
  // aria-describedby that ties the trigger to its description/error.
  const { fieldProps, descriptionProps, errorMessageProps } = useField({
    label,
    description,
    errorMessage: error,
    isInvalid: !!error,
  });

  const { buttonProps } = useButton(
    { onPress: () => overlayState.toggle(), isDisabled, 'aria-label': label },
    triggerRef,
  );

  const selectedItems = [...listState.collection].filter((item) =>
    listState.selectionManager.isSelected(item.key),
  );

  return (
    <div className={cn('inline-flex flex-col gap-1.5', className)}>
      <button
        {...buttonProps}
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={overlayState.isOpen}
        aria-describedby={fieldProps['aria-describedby']}
        // No aria-invalid/aria-required here on purpose. Neither is a supported state of
        // role="button" (ARIA 1.2), and emitting unsupported ARIA is its own defect —
        // the same class of bug this kit already fixed on SegmentedControl. What a
        // screen-reader user does get is aria-describedby pointing at the error text,
        // which IS global and supported, plus the visual state below.
        // Unlike Select there is no HiddenSelect here either (see the note above on why),
        // so this control's invalid state is carried by the associated message and the
        // border alone. Wrap it in a native <fieldset>/form control if a form needs
        // machine-readable validity.
        className={cn(
          // See Select's identical note: `bg-surface-neutral` is a light
          // surface, so the placeholder/value text needs `Input`'s
          // light-surface colors (`text-muted`/`text-neutral-5`), not
          // `text-main` (invisible white-on-white once something's picked).
          'inline-flex items-center gap-2 min-h-10 px-3 py-1.5 rounded-md bg-surface-neutral border border-subtle text-body-m font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          selectedItems.length > 0 ? 'text-neutral-5' : 'text-muted-on-light',
          error && 'border-danger-5 focus-visible:outline-danger-5',
        )}
      >
        {icon}
        {selectedItems.length > 0 ? (
          <span className="flex flex-wrap items-center gap-1">
            {/* `Tag` is built for the dark surfaces it normally sits on, and none of
                its variants survive this trigger's light `bg-surface-neutral`:
                `neutral`'s solid style is white-on-white, and every tinted variant
                puts its own accent on a 10%-tint of itself, which over white lands
                at 2.3-3.4:1. `red` measured 3.39:1 — an earlier comment here claimed
                it "stays legible on both", which measurement did not support.

                So the tint carries the colour coding and the text takes the same
                `text-neutral-5` the trigger already uses for its value: 13.6:1 on
                the composited chip, and consistent with everything else on this
                surface. The deeper fix is the light trigger itself — the design's
                own chips are a neutral tint on a dark card — but that is a visual
                redesign, tracked in `MIGRATION_GAPS.md`, not a contrast fix. */}
            {selectedItems.map((item) => (
              <Tag key={item.key} variant="red" className="text-neutral-5">
                {item.rendered}
              </Tag>
            ))}
          </span>
        ) : (
          <span>{placeholder}</span>
        )}
        <ChevronDownIcon className="w-3 h-3 shrink-0" />
      </button>

      <FieldMessages
        description={description}
        error={error}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
      />

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

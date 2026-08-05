import { useRef } from 'react';
import { HiddenSelect, useButton, useSelect, type AriaSelectProps } from 'react-aria';
import { useSelectState } from 'react-stately';
import { cn } from '../../utils/cn';
import { ListBox } from '../listbox/list-box';
import { FloatingPopover } from '../popover/floating-popover';
import { ChevronDownIcon } from '../icons/icons';
import { FIELD_LABEL_CLASS, FieldMessages, RequiredIndicator } from '../form-field/form-field';

export interface SelectProps<T extends object> extends AriaSelectProps<T> {
  /** Shown inside the trigger when no item is selected yet. */
  placeholder?: string;
  /** Optional leading icon rendered in the trigger, ahead of the value. */
  icon?: React.ReactNode;
  /**
   * Error message rendered below the trigger. When set, also switches the trigger to its
   * error visual state and associates the message with it via `aria-describedby`, so a
   * screen-reader user reaching the trigger is told what is wrong.
   *
   * Note the trigger does *not* get `aria-invalid`: it is a `role="button"`, which does
   * not support that state. `Input`, `Datepicker` and `LabelCheckbox` — all real form
   * controls — do set it.
   */
  error?: string;
  /** Helper text rendered below the trigger. Hidden while `error` is set. */
  description?: string;
  /** Additional class names applied to the trigger's wrapping container, merged last via `cn()`. */
  className?: string;
}

/**
 * Select
 *
 * The single-value dropdown the app currently hand-rolls in several places
 * (`BoardFiltersBar`'s status/estimate/owner filters, `TaskFormDialog`'s
 * points/assignee/status fields — `MIGRATION_GAPS.md` Section 4). Composes
 * `ListBox` (the option list) and `FloatingPopover` (the portalled, anchored
 * surface) over react-stately's `useSelectState` and react-aria's
 * `useSelect`. Fully generic over item type via `AriaSelectProps<T>`'s own
 * `items`/`children` Collection composition (the same pattern `Tabs` and
 * `ListBox` use), not a kit-invented `{ id, label }` shape.
 *
 * `HiddenSelect` renders a real `<select>` element off-screen, wired to the
 * same state. That isn't redundant with the visible trigger — it's what
 * makes the control work inside a `<form>`, gives mobile browsers their
 * native picker UI, and lets autofill/password managers see a field they
 * recognize. The visible pill-shaped trigger below is purely presentational.
 */
export function Select<T extends object>({
  placeholder,
  icon,
  error,
  description,
  className,
  ...props
}: SelectProps<T>) {
  const state = useSelectState(props);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // `isInvalid`/`errorMessage`/`description` are what make useSelect emit the
  // descriptionProps/errorMessageProps and the aria-describedby that points at them. The
  // hook already computed all of this before; the component simply never rendered it.
  const { labelProps, triggerProps, valueProps, menuProps, descriptionProps, errorMessageProps } =
    useSelect(
      { ...props, description, errorMessage: error, isInvalid: !!error },
      state,
      triggerRef,
    );
  const { buttonProps } = useButton(triggerProps, triggerRef);

  return (
    <div className={cn('inline-flex flex-col gap-1.5', className)}>
      {props.label ? (
        <span {...labelProps} className={FIELD_LABEL_CLASS}>
          {props.label}
          {props.isRequired ? <RequiredIndicator /> : null}
        </span>
      ) : null}

      {/* Known limitation, verified rather than assumed: with `isRequired` set, this
          version of react-aria emits no required marker anywhere for a Select — not
          `aria-required` on the trigger (role="button" does not support it) and not
          `required` on this native <select> (HiddenSelectProps has no `isRequired` to
          forward). So `isRequired` here renders the visual indicator and feeds
          useSelect's validation, but a form cannot read required-ness off the DOM.
          Validate on submit and pass the result back as `error`, which is fully wired. */}
      <HiddenSelect state={state} triggerRef={triggerRef} label={props.label} name={props.name} />

      <button
        {...buttonProps}
        ref={triggerRef}
        type="button"
        // No aria-invalid/aria-required here on purpose. Neither is a supported state of
        // role="button" (ARIA 1.2), and emitting unsupported ARIA is its own defect —
        // the same class of bug this kit already fixed on SegmentedControl. What a
        // screen-reader user does get is aria-describedby pointing at the error text,
        // which IS global and supported, plus the visual state below.
        className={cn(
          // `bg-surface-neutral` is a light (near-white) surface, matching
          // `Input`'s value/placeholder colors (`text-neutral-5`/`text-muted`)
          // rather than `text-main`/`text-muted`, which assume a dark shell
          // background and would render invisible white-on-white here once
          // something is selected.
          'inline-flex items-center gap-2 h-10 px-3 py-2 rounded-md bg-surface-neutral border border-subtle text-body-m font-sans whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          state.selectedItem ? 'text-neutral-5' : 'text-muted',
          error && 'border-danger-5 focus-visible:outline-danger-5',
        )}
      >
        {icon}
        <span {...valueProps} className="flex-1 text-left truncate">
          {state.selectedItem ? state.selectedItem.rendered : placeholder}
        </span>
        <ChevronDownIcon className="w-3 h-3 shrink-0" />
      </button>

      <FieldMessages
        description={description}
        error={error}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
      />

      {state.isOpen ? (
        <FloatingPopover state={state} triggerRef={triggerRef} placement="bottom start">
          <ListBox {...menuProps} state={state} />
        </FloatingPopover>
      ) : null}
    </div>
  );
}

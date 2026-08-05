import { useRef } from 'react';
import { HiddenSelect, useButton, useSelect, type AriaSelectProps } from 'react-aria';
import { useSelectState } from 'react-stately';
import { cn } from '../../utils/cn';
import { ListBox } from '../listbox/list-box';
import { FloatingPopover } from '../popover/floating-popover';
import { ChevronDownIcon } from '../icons/icons';
import { fieldLabelClass, FieldMessages, RequiredIndicator } from '../form-field/form-field';

export interface SelectProps<T extends object> extends AriaSelectProps<T> {
  /**
   * Renders `label` visibly above the trigger instead of `sr-only`.
   *
   * Defaults to `false` — the design draws no field labels; see `FIELD_LABEL_CLASS`.
   * `label` still names the trigger for assistive tech either way.
   * @default false
   */
  isLabelVisible?: boolean;
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
 * recognize. The visible chip-shaped trigger below is purely presentational.
 */
export function Select<T extends object>({
  isLabelVisible = false,
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
        <span {...labelProps} className={fieldLabelClass(isLabelVisible)}>
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
          // The design's chip, not a light field. Figma draws every dropdown trigger in
          // this system as the same "Tag" atom — `rgba(148,151,154,0.1)` (neutral-2 at
          // 10%), 4px radius, 32px tall, 4px/16px padding, white 15px/600 label — over a
          // dark surface (`Dashboard Add Task/Add Task Modal00.md:78-140`: the four
          // pickers on the `#393D41` card, and the same chip again in the Edit Task
          // modal). These are `Tag`'s own `variant="neutral"` values, so a trigger and
          // the chips beside it line up at exactly 32px.
          //
          // This was `bg-surface-neutral` — white — which put five near-white pills on
          // the consuming app's dark board. It came from `1afb406`, which correctly
          // fixed invisible white-on-white *value* text by moving the trigger's interior
          // to `Input`'s light-surface colours; the surface underneath that fix was
          // borrowed from `Input` rather than checked against the design. `Input` is
          // genuinely a light field. A dropdown trigger is not.
          //
          // Contrast recomputed for this surface — the 10% fill composites, so every
          // ratio is against the composited chip, not the bare token, on
          // overlay/panel/shell. `styles/contrast.test.ts` pins all of it:
          //   value       `text-main`           9.52 / 11.54 / 13.20:1
          //   placeholder `text-muted-on-dark`  4.61 /  5.33 /  5.88:1
          // `text-muted` is the obvious choice for a dimmed placeholder and is what the
          // consuming app used pre-migration; it measures 3.24 / 3.93 / 4.49:1 here and
          // fails AA on all three. `muted-on-dark` composites against whatever it lands
          // on, so it carries the empty state instead.
          'inline-flex items-center gap-2 h-8 px-4 rounded-4 bg-neutral-2/10 text-body-m font-semibold font-sans whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          state.selectedItem ? 'text-main' : 'text-muted-on-dark',
          // A `ring`, not a `border`: the design gives this chip no boundary at all, so
          // an invalid one has to appear out of nothing. A border would add 2px to a
          // control whose height the design fixes at 32px, nudging the whole filter row
          // at the moment a form is reporting an error. `ring-1` is a box-shadow and
          // costs no layout.
          //
          // `danger-text` (danger-3), not the `danger-5` `Input` and `Datepicker` use.
          // Their invalid border survives 1.4.11 on the strength of the white field
          // interior it separates from the container (4.29:1) — see `FIELD_ERROR_CLASS`,
          // which says so explicitly. This trigger has no white interior any more, and
          // danger-5 measures 2.55:1 on `surface-overlay`, the modal card a task form
          // actually sits on. danger-3 clears 3:1 on both adjacent colours everywhere:
          // 4.91:1 against the chip and 5.65:1 against the surface, at the tightest.
          //
          // The invalid *focus ring* is `danger-text` too, and used to be `danger-5` on
          // this very line — the same 2.55:1 the paragraph above rejects, one line later.
          // It hid because `cn()` is tailwind-merge: `focus-visible:outline-danger-5` here
          // silently drops the `focus-visible:outline-interactive-text` set in the base
          // string, so the error state quietly *downgraded* the ring from 5.43:1 to
          // 2.55:1. Four controls had it — this one, `MultiSelect`, `Input`, `Datepicker`
          // — and all four are `danger-text` now, 5.65 / 6.94 / 7.95:1.
          error && 'ring-1 ring-danger-text focus-visible:outline-danger-text',
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

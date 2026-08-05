import { useRef } from 'react';
import { HiddenSelect, useButton, useSelect, type AriaSelectProps } from 'react-aria';
import { useSelectState } from 'react-stately';
import { cn } from '../../utils/cn';
import { ListBox } from '../listbox/list-box';
import { FloatingPopover } from '../popover/floating-popover';

export interface SelectProps<T extends object> extends AriaSelectProps<T> {
  /** Shown inside the trigger when no item is selected yet. */
  placeholder?: string;
  /** Optional leading icon rendered in the trigger, ahead of the value. */
  icon?: React.ReactNode;
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
export function Select<T extends object>({ placeholder, icon, className, ...props }: SelectProps<T>) {
  const state = useSelectState(props);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { labelProps, triggerProps, valueProps, menuProps } = useSelect(props, state, triggerRef);
  const { buttonProps } = useButton(triggerProps, triggerRef);

  return (
    <div className={cn('inline-flex flex-col gap-1.5', className)}>
      {props.label ? (
        <span
          {...labelProps}
          className="text-field-label font-semibold text-neutral-3 uppercase font-sans"
        >
          {props.label}
        </span>
      ) : null}

      <HiddenSelect state={state} triggerRef={triggerRef} label={props.label} name={props.name} />

      <button
        {...buttonProps}
        ref={triggerRef}
        type="button"
        className={cn(
          // `bg-surface-neutral` is a light (near-white) surface, matching
          // `Input`'s value/placeholder colors (`text-neutral-5`/`text-muted`)
          // rather than `text-main`/`text-muted`, which assume a dark shell
          // background and would render invisible white-on-white here once
          // something is selected.
          'inline-flex items-center gap-2 h-10 px-3 py-2 rounded-md bg-surface-neutral border border-subtle text-body-m font-sans whitespace-nowrap transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          state.selectedItem ? 'text-neutral-5' : 'text-muted'
        )}
      >
        {icon}
        <span {...valueProps} className="flex-1 text-left truncate">
          {state.selectedItem ? state.selectedItem.rendered : placeholder}
        </span>
        <ChevronDownIcon />
      </button>

      {state.isOpen ? (
        <FloatingPopover state={state} triggerRef={triggerRef} placement="bottom start">
          <ListBox {...menuProps} state={state} />
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

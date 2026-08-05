import { useRef, type ReactNode } from 'react';
import {
  useButton,
  useMenu,
  useMenuItem,
  useMenuTrigger,
  type AriaMenuOptions,
  type AriaMenuProps,
} from 'react-aria';
import { useMenuTriggerState, useTreeState, type Node, type TreeState } from 'react-stately';
import { cn } from '../../utils/cn';
import { FloatingPopover } from '../popover/floating-popover';

export interface MenuProps<T extends object> extends Omit<
  AriaMenuProps<T>,
  // A `Menu` fires actions, it does not track a selection — `onAction` is
  // the one callback this component exposes. Exposing the full
  // `MultipleSelection` surface (`selectionMode`, `selectedKeys`, ...)
  // would mean rendering selection affordances (checkmarks, `aria-checked`
  // items) this component doesn't implement, the same reasoning `Select`
  // and `MultiSelect` split apart rather than folding into one component
  // behind a mode flag. `onClose` is also omitted: it exists in
  // `AriaMenuProps` for composition layers that don't own their own
  // trigger state, but `Menu` does (via `useMenuTriggerState` below), so a
  // public `onClose` would just be a second, redundant way to close it.
  | 'selectionMode'
  | 'selectedKeys'
  | 'defaultSelectedKeys'
  | 'onSelectionChange'
  | 'disallowEmptySelection'
  | 'onClose'
> {
  /** Accessible name for the trigger button. Required — an icon-only trigger has no name without it. */
  label: string;
  /** Content rendered inside the trigger button — an icon for the common icon-only case, but any content is accepted. */
  triggerContent: ReactNode;
  /** Disables the trigger, preventing the menu from opening. */
  isDisabled?: boolean;
  /**
   * Additional class names applied to the trigger button, merged last via
   * `cn()`. No default background/size/radius is applied — see the
   * component doc comment for why.
   */
  triggerClassName?: string;
}

/**
 * Menu
 *
 * A dropdown/context menu of actions — e.g. the task card's three-dot
 * options menu (`MIGRATION_GAPS.md` Section 4). Composes `FloatingPopover`
 * (the same portalled, anchored surface `Select`/`MultiSelect` use) over
 * react-stately's `useMenuTriggerState`/`useTreeState` and react-aria's
 * `useMenuTrigger`/`useMenu`/`useMenuItem`. Fully generic over item type via
 * the same Collection/`<Item>` composition `Select`/`ListBox`/`Tabs` use, not
 * a kit-invented `{ id, label }` shape.
 *
 * Unlike `Select`'s pill trigger, this component bakes in no default visual
 * chrome for the trigger button beyond focus/disabled affordances — only
 * interaction states, reusing the `primary-4`/`opacity-50` values already
 * established everywhere else in the kit, not new ones. There is no verified
 * Figma source for a kit-generic menu-trigger surface (the task card's
 * three-dot button lives in the consuming app, not this kit), and trigger
 * content is fully consumer-supplied rather than a fixed icon+value shape —
 * baking in fixed dimensions would fight arbitrary content. `triggerClassName`
 * is expected to supply size/background/radius per call site.
 *
 * This also deliberately does not offer a way to mark an item "destructive"
 * (the reference implementation this was built from special-cased a
 * `'delete'`-keyed item with `text-danger`). That's app-specific convenience
 * tied to one consumer's key naming, not something a generic kit component
 * should assume — a consumer wanting a destructive-looking item can style it
 * directly in the `<Item>`'s own children, the same way `MenuItem` below
 * always renders `item.rendered` untouched.
 */
export function Menu<T extends object>({
  label,
  triggerContent,
  isDisabled,
  triggerClassName,
  ...menuProps
}: MenuProps<T>) {
  const state = useMenuTriggerState({});
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { menuTriggerProps, menuProps: triggerMenuProps } = useMenuTrigger<T>(
    { isDisabled },
    state,
    triggerRef,
  );
  const { buttonProps } = useButton(
    { ...menuTriggerProps, isDisabled, 'aria-label': label },
    triggerRef,
  );

  return (
    <>
      <button
        {...buttonProps}
        ref={triggerRef}
        type="button"
        className={cn(
          'cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          triggerClassName,
        )}
      >
        {triggerContent}
      </button>

      {state.isOpen ? (
        <FloatingPopover state={state} triggerRef={triggerRef} placement="bottom end">
          <MenuList
            {...triggerMenuProps}
            {...menuProps}
            // react-aria's `MenuProps.autoFocus` (WAI-ARIA popup focus
            // management: which item to land focus on when the menu opens),
            // not the raw DOM autofocus anti-pattern this rule targets —
            // same justification as `MultiSelect`'s `ListBox` `autoFocus`.
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={menuProps.autoFocus ?? state.focusStrategy ?? true}
            onClose={() => state.close()}
          />
        </FloatingPopover>
      ) : null}
    </>
  );
}

interface MenuListProps<T extends object> extends AriaMenuOptions<T> {
  children: AriaMenuProps<T>['children'];
  onClose: () => void;
}

function MenuList<T extends object>({ children, onAction, onClose, ...props }: MenuListProps<T>) {
  const state = useTreeState<T>({ ...props, children, selectionMode: 'none' });
  const ref = useRef<HTMLUListElement>(null);
  // `children` is deliberately not forwarded here: the collection has
  // already been built into `state`, and `useMenu` only wants the ARIA
  // options.
  const { menuProps } = useMenu<T>({ ...props, onAction, onClose }, state, ref);

  return (
    <ul {...menuProps} ref={ref} className="max-h-64 min-w-40 overflow-auto py-2 outline-none">
      {[...state.collection].map((item) => (
        <MenuItem key={item.key} item={item} state={state} onClose={onClose} />
      ))}
    </ul>
  );
}

interface MenuItemProps<T extends object> {
  item: Node<T>;
  state: TreeState<T>;
  onClose: () => void;
}

function MenuItem<T extends object>({ item, state, onClose }: MenuItemProps<T>) {
  const ref = useRef<HTMLLIElement>(null);
  // `onAction` is deliberately not passed here — it's already registered
  // once with `useMenu` above, which stores it in a `WeakMap` keyed by
  // `state` and fires it for whichever item is activated. `useMenuItem`
  // fires both its own `onAction` prop *and* that stored one unconditionally
  // (unlike `onClose`, which prefers one over the other), so passing it in
  // both places double-invokes the callback.
  const { menuItemProps, isFocused, isDisabled } = useMenuItem<T>(
    { key: item.key, onClose },
    state,
    ref,
  );

  return (
    <li
      {...menuItemProps}
      ref={ref}
      className={cn(
        'text-body-m font-sans cursor-pointer px-4 py-1.5 outline-none text-main',
        isFocused && 'bg-neutral-4',
        isDisabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {item.rendered}
    </li>
  );
}

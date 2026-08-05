import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useButton, useToast as useAriaToast, useToastRegion } from 'react-aria';
import { useToastState, type QueuedToast, type ToastState } from 'react-stately';
import { cn } from '../../utils/cn';
import { CloseIcon } from '../icons/icons';
import type { StatusTone } from '../../types/color-variants';

/** What a toast is reporting. Uses the kit's shared `StatusTone` vocabulary. */
export type ToastTone = StatusTone;

/** The payload the queue carries for each toast. */
export interface ToastContent {
  /** What the toast is reporting, driving its colour. */
  tone: ToastTone;
  /** The message text. Becomes the toast's accessible name. */
  message: string;
}

/** Per-toast overrides accepted by `show`. */
export interface ShowToastOptions {
  /**
   * How long this toast stays before dismissing itself, in milliseconds. Pass `null` to
   * make it stay until dismissed — appropriate for an error the user must acknowledge,
   * and inappropriate for anything else.
   */
  timeout?: number | null;
}

export interface ToastApi {
  /** Queues a toast. Safe to call from an event handler; returns the queued toast's key. */
  show: (tone: ToastTone, message: string, options?: ShowToastOptions) => string;
}

const ToastContext = createContext<ToastApi | null>(null);

/**
 * Access the toast queue from anywhere inside a `ToastProvider`.
 *
 * Throws rather than returning `undefined` outside a provider. A silent no-op would mean
 * a mutation reporting success into nothing, and the missing provider would only be
 * noticed when someone eventually wondered why they never see confirmations.
 */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return api;
}

/** Default dismiss delay, in milliseconds. */
const DEFAULT_TOAST_DURATION_MS = 5000;

const TONE_STYLES: Record<ToastTone, string> = {
  neutral: 'bg-surface-overlay text-main border border-subtle/10',
  success: 'bg-success-4 text-neutral-5',
  warning: 'bg-warning-5 text-neutral-5',
  danger: 'bg-danger text-main',
};

function Toast({
  toast,
  state,
  closeLabel,
}: {
  toast: QueuedToast<ToastContent>;
  state: ToastState<ToastContent>;
  closeLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { toastProps, contentProps, titleProps, closeButtonProps } = useAriaToast(
    { toast },
    state,
    ref,
  );
  // `closeButtonProps` is an `AriaButtonProps` — it carries `onPress`, not DOM handlers.
  // Spread straight onto a `<button>` it renders a button that does nothing; `useButton`
  // is what turns it into something clickable.
  const { buttonProps: closeProps } = useButton(closeButtonProps, closeRef);

  return (
    <div
      {...toastProps}
      ref={ref}
      className={cn(
        'pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-sm shadow-elevation',
        'text-body-m font-semibold font-sans',
        TONE_STYLES[toast.content.tone],
      )}
    >
      <div {...contentProps}>
        <span {...titleProps}>{toast.content.message}</span>
      </div>
      <button
        {...closeProps}
        ref={closeRef}
        aria-label={closeLabel}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2"
      >
        <CloseIcon className="size-4" />
      </button>
    </div>
  );
}

/**
 * The notification region.
 *
 * Built on `useToastRegion` rather than a hand-rolled `aria-live` container, because the
 * region has to survive a modal. React Aria hides everything outside an open modal from
 * the accessibility tree, walking out from `document.body` — and notifications sit
 * outside the modal by necessity, so they were hidden exactly when they mattered most.
 * The case that found this in the consuming app: a delete confirmation that stays open
 * on failure and carries no inline error by design, which made its toast the only report
 * the user got, delivered where assistive tech could not reach it.
 *
 * `useToastRegion` marks itself as a top layer, which is the exemption that hiding pass
 * checks for. Relying on the hook rather than writing that attribute by hand is
 * deliberate: it is React Aria's own internal contract, untyped and unpublished, so the
 * supported way to depend on it is through the hook that owns it.
 *
 * **The marker alone is not enough**, which is the part that is easy to get wrong. The
 * hiding pass walks out from `document.body` and hides whole subtrees at the highest
 * level it can; an exempt node nested inside a hidden ancestor is never reached, because
 * the ancestor was already rejected. So the region is portalled to the body as well —
 * marked *and* a sibling of the modal rather than a descendant of the page it hides.
 * Either half on its own leaves the notification unreachable. Do not "simplify" this by
 * dropping the portal and keeping the hook, or vice versa.
 *
 * The hook also brings a close button and pauses dismiss timers while the region is
 * hovered or focused — a toast that vanishes mid-read is its own defect.
 */
function ToastRegion({
  state,
  label,
  closeLabel,
}: {
  state: ToastState<ToastContent>;
  label: string;
  closeLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { regionProps } = useToastRegion({ 'aria-label': label }, state, ref);

  return createPortal(
    <div
      {...regionProps}
      ref={ref}
      className="pointer-events-none fixed right-4 bottom-4 z-toast flex flex-col gap-2"
    >
      {state.visibleToasts.map((toast) => (
        <Toast key={toast.key} toast={toast} state={state} closeLabel={closeLabel} />
      ))}
    </div>,
    document.body,
  );
}

export interface ToastProviderProps {
  /** The app (or subtree) that can queue toasts. */
  children: React.ReactNode;
  /**
   * How long a toast stays before dismissing itself, in milliseconds. Individual calls
   * can override it via `show`'s options.
   * @default 5000
   */
  duration?: number;
  /**
   * How many toasts are on screen at once; the rest queue behind them.
   * @default 4
   */
  maxVisibleToasts?: number;
  /**
   * Accessible name for the notification landmark.
   *
   * Worth overriding when the surrounding app already has something called
   * "Notifications" — the kit's own `TopNav` renders a notifications bell, and two
   * landmarks sharing one name is a worse thing to hand a screen reader than a slightly
   * duller label. The consuming app uses `"Alerts"` for exactly this reason.
   * @default 'Notifications'
   */
  label?: string;
  /**
   * Accessible name for each toast's dismiss button.
   * @default 'Dismiss'
   */
  closeLabel?: string;
}

/**
 * Queues and renders toast notifications.
 *
 * **No Figma source.** The design file draws no notification surface anywhere. It exists
 * because the kit had nothing here at all while the consuming app had already built one
 * and paid for the accessibility lesson documented on `ToastRegion` above — that
 * knowledge belongs in the design system rather than in one of its consumers.
 *
 * Wrap the app once, then call `useToast().show(...)` from anywhere beneath it.
 */
export function ToastProvider({
  children,
  duration = DEFAULT_TOAST_DURATION_MS,
  maxVisibleToasts = 4,
  label = 'Notifications',
  closeLabel = 'Dismiss',
}: ToastProviderProps) {
  const state = useToastState<ToastContent>({ maxVisibleToasts });

  // The state object is rebuilt on each render, so `show` reads it through a ref rather
  // than closing over one. That keeps the context value stable — otherwise every provider
  // render would hand consumers a new object and re-render all of them.
  //
  // Synced in an effect rather than assigned during render, which is not safe under
  // concurrent rendering. Nothing can observe the gap: `show` is only ever called from an
  // event handler, long after the first effect has flushed.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const durationRef = useRef(duration);
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const api = useMemo<ToastApi>(
    () => ({
      show: (tone, message, options) =>
        stateRef.current.add(
          { tone, message },
          // `undefined` in `options.timeout` means "not specified, use the default";
          // an explicit `null` means "stay until dismissed", which react-stately
          // expresses as a timeout of 0.
          {
            timeout: options?.timeout === null ? 0 : (options?.timeout ?? durationRef.current),
          },
        ),
    }),
    [],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Mounted only while there is something to show. An empty region is a landmark a
          screen-reader user can navigate to and find nothing in. */}
      {state.visibleToasts.length > 0 ? (
        <ToastRegion state={state} label={label} closeLabel={closeLabel} />
      ) : null}
    </ToastContext.Provider>
  );
}

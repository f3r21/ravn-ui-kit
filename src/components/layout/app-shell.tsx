import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { ApplicationSidebar, type ApplicationSidebarProps } from '../sidebar/application-sidebar';
import { TopNav, type TopNavProps } from '../top-nav/top-nav';

export interface AppShellProps {
  /** Forwarded to the built-in `ApplicationSidebar`. Ignored when `sidebar` is supplied. */
  logo?: ApplicationSidebarProps['logo'];
  /**
   * Forwarded to the built-in `ApplicationSidebar`. Ignored when `sidebar` is supplied.
   *
   * Optional as of #15 — it used to be required, which is why `AppShell` could not be used
   * with any navigation but this kit's. Widening a required prop to optional is not a
   * breaking change; every existing caller still typechecks.
   */
  sidebarItems?: ApplicationSidebarProps['items'];
  /**
   * Replaces the built-in `ApplicationSidebar` entirely — the escape hatch for a consumer
   * whose navigation is not this kit's (#15).
   *
   * `logo` and `sidebarItems` are configuration for a sidebar this component constructs;
   * this is the slot for one it does not. When both are given **this wins**, rather than
   * rendering two sidebars or silently dropping yours.
   *
   * It is rendered as a direct flex child of the shell row, so it owns its own width — the
   * kit's own sidebar is a rigid `w-[232px] shrink-0` and yours is under no obligation to
   * match it. Pass `null` explicitly for a shell with no sidebar at all.
   */
  sidebar?: ReactNode;
  /** Forwarded to the built-in `TopNav`. Ignored when `topNav` is supplied. */
  topNavProps?: Omit<TopNavProps, 'className'>;
  /**
   * Replaces the built-in `TopNav` entirely, for the same reason `sidebar` exists (#15).
   *
   * `topNavProps` forwards `TopNav`'s whole API as a single prop, which works only for
   * consumers using `TopNav`. When both are given this wins. Pass `null` for a shell with
   * no top navigation.
   */
  topNav?: ReactNode;
  /**
   * Optional content rendered in the row directly below `TopNav` (the real
   * "Top Bar" — a `ViewSwitcher` on the left, a primary action `Button` on
   * the right, per the real mockups). Omit entirely on pages that don't have
   * one; nothing in spec makes it mandatory.
   */
  topBar?: ReactNode;
  /** Main content area (a `Task List View` row, a `TaskTable`, etc). */
  children: ReactNode;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * AppShell
 *
 * Not a named Figma component — the shared page scaffold evidenced by two
 * independent, pixel-identical real mockups: `Mockups/Dashboard Default
 * View/Dashboard Mockup.md` and `Mockups/Task Default View/My Task Mockup.md`
 * both place `Sidebar` (`left:32 top:32`), the `Search Bar`/`TopNav`
 * (`left:296 top:32 right:36 h:64` — flush against the sidebar with the same
 * 32px gap as the page's own left margin), a "Top Bar" row (`top:128 h:48`,
 * `justify-content:space-between`, containing the `Swicter` view-switcher and
 * a lone primary-filled icon `Button`), and the page's main content
 * (`Frame 654`'s Task List View row / the "Table View" list) 16-24px below
 * that — at the exact same offsets on both pages. That page-shell repetition
 * (not a single named component, but a real, consistent composition) is what
 * this promotes into a thin, exported layout — per-component audits (Chunks
 * 8-10) only ever verified `ApplicationSidebar`/`TopNav` in isolation and
 * never cross-checked their combined page position, which is this chunk's
 * (Chunk 17) job.
 *
 * The outer 36px-vs-32px right/left margin asymmetry only exists because the
 * source canvas is a fixed 1440px frame; a fluid page has no equivalent
 * "right edge" to measure against, so this uses one uniform 32px page
 * padding (`p-8`) rather than fabricating a fixed 1440px-wide breakpoint —
 * the same "canvas-fit noise, not a real constraint" judgment call Chunk 7
 * made for Tabs' `px-5`.
 */
export function AppShell({
  logo,
  sidebarItems,
  sidebar,
  topNavProps,
  topNav,
  topBar,
  children,
  className,
}: AppShellProps) {
  // `undefined` means "not supplied, build the default"; an explicit `null` means "no
  // sidebar". `??` distinguishes them and `||` would not — `null || fallback` renders the
  // kit's sidebar for a caller who just asked for none. Same for `topNav` below.
  const sidebarNode =
    sidebar !== undefined ? (
      sidebar
    ) : sidebarItems ? (
      <ApplicationSidebar logo={logo} items={sidebarItems} className="self-stretch" />
    ) : null;

  const topNavNode = topNav !== undefined ? topNav : <TopNav {...topNavProps} />;

  return (
    <div
      className={cn('flex items-start gap-8 w-full min-h-screen bg-surface-shell p-8', className)}
    >
      {sidebarNode}

      <div className="flex flex-col gap-8 flex-1 min-w-0">
        {topNavNode}

        <div className="flex flex-col gap-4">
          {topBar ? <div className="flex items-start justify-between gap-6">{topBar}</div> : null}
          {children}
        </div>
      </div>
    </div>
  );
}

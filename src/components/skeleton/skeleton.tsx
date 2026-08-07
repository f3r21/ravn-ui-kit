import { cn } from '../../utils/cn';

export interface SkeletonProps {
  /**
   * Tailwind size/shape classes (width, height, rounding) — the primitive has no
   * intrinsic size of its own so it can stand in for text lines, avatars, cards, etc.
   */
  className?: string;
}

/**
 * Skeleton
 *
 * No ground-truth Figma spec (static exports have no concept of an in-flight
 * loading state) — this is a standalone, non-contradicted utility primitive
 * in the same vein as `switch.tsx`/`datepicker.tsx` (Chunks 5/16): genuinely
 * useful, and nothing in the exported specs contradicts it existing. A simple
 * pulsing block on the kit's own neutral-3 surface tone, matching the pattern
 * used by comparable production design systems for loading placeholders
 * (pulsing muted block, no skeleton-specific token needed).
 *
 * The pulse is `motion-safe:` guarded (#45). An indefinite looping animation is the
 * central example WCAG 2.2.2 (Pause, Stop, Hide) exists for, and `prefers-reduced-motion`
 * is how a user's request for less of it reaches the browser. `motion-safe:animate-pulse`
 * rather than `animate-pulse motion-reduce:animate-none` because it fails *safe*: a browser
 * that does not support the query gets no animation, instead of an unguarded one.
 *
 * Keeping the guard in the primitive is the point — the alternative, a
 * `motion-reduce:animate-none` on each call site, moves an accessibility property out into
 * every future caller, where the next one omits it and nothing notices.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('motion-safe:animate-pulse rounded-sm bg-neutral-3', className)}
    />
  );
}

import { cn } from '../../utils/cn';

export interface Reaction {
  /** Emoji glyph shown on the pill, also used as its unique key. */
  emoji: string;
  /** Number of reactors, rendered next to the emoji. */
  count: number;
  /** Whether the current user has reacted with this emoji. */
  isActive?: boolean;
}

export interface ReactionsProps {
  /** Ordered list of reaction pills to render. */
  reactions: Reaction[];
  /** Called with the emoji of the pill that was clicked. */
  onToggle?: (emoji: string) => void;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * Reactions
 *
 * Figma: "Reactions" COMPONENT inside "Task Card" (Cards00.md L595-875, Cards01.md L552-833,
 * also cataloged standalone under "utils/sectionHeader" in Cards01.md L895-959).
 * Row of count+emoji reaction counters — used in TaskCard footer ("Frame 653").
 * Every captured instance (6+, across IOS/Android/Desktop variants in both files) renders as
 * plain white text+icon with no fill, border, or radius, and count-before-icon ordering
 * (`order: 0`/`order: 1` in the export) — the inactive state below matches that exactly.
 * Typography is Desktop/Body/M/regular: SF Pro Display, 15px/24px, weight 400, letter-spacing
 * 0.75px (tracking-wider, exact at this size per the Chunk 2/3 convention) — was previously a
 * fabricated `text-xs font-semibold` (12px/700) with no spec basis. Active reaction gets a
 * primary-4 border + background tint; no active-state instance was captured in the export to
 * confirm this against, so it's preserved as-is rather than guessed at.
 */
export function Reactions({ reactions, onToggle, className }: ReactionsProps) {
  return (
    // gap-4 matches Figma's "Frame 653" gap (16px, Cards01.md L614 / Cards00.md L657).
    <div className={cn('flex flex-wrap items-center gap-4', className)}>
      {reactions.map((r) => (
        <button
          key={r.emoji}
          type="button"
          onClick={() => onToggle?.(r.emoji)}
          aria-pressed={r.isActive}
          className={cn(
            'inline-flex items-center gap-1 text-[15px] leading-6 font-normal tracking-wider font-sans transition-all cursor-pointer select-none',
            r.isActive
              ? 'px-2 py-0.5 rounded-full border bg-primary-4/10 border-primary-4/50 text-neutral-1'
              : 'text-neutral-1 hover:text-primary-4'
          )}
        >
          <span className="tabular-nums">{r.count}</span>
          <span>{r.emoji}</span>
        </button>
      ))}
    </div>
  );
}

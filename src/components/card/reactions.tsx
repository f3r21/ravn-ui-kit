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
 * primary-4 border + background tint; confirmed via a full-file Figma structural check (Chunk 24,
 * fileKey `ZUAB3jXFyKFktoAzvN7h1T`) that "Reactions" has no variant set at all — a single static
 * COMPONENT (#53:17490), and every one of its 505 instances across the entire file uses the
 * identical no-fill/no-border template — so there's genuinely no active/pressed state anywhere in
 * spec to confirm this against, not merely an absent sample. Kept unchanged (not contradicted, and
 * functionally necessary for a working toggle), the same bar as Skeleton/Datepicker's native input.
 *
 * Also discovered in that same check: the 3 real reaction instances inside "Task Card" use named
 * icons `remix-icons/line/editor/attachment-2`, `remix-icons/line/editor/node-tree`, and
 * `remix-icons/line/communication/chat-3-line` — not emoji glyphs. This suggests the real row may
 * represent task metadata badges (attachments/subtasks/comments), not user-togglable emoji
 * reactions, which would be a mismatch with this component's `emoji`/`isActive`/`onToggle` API.
 * Flagging as a significant, product-level follow-up decision — not resolved here, since this was
 * a styling-verification pass, not license to redesign the API on a guess.
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
            'inline-flex items-center gap-1 text-body-m font-normal font-sans transition-all cursor-pointer select-none outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-xs',
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

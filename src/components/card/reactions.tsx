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
 * Figma: "Reactions" COMPONENT inside "Cards" frame.
 * Row of emoji reaction pills with count — used in TaskCard footer.
 * Active reaction has primary-4 border + background tint.
 */
export function Reactions({ reactions, onToggle, className }: ReactionsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {reactions.map((r) => (
        <button
          key={r.emoji}
          type="button"
          onClick={() => onToggle?.(r.emoji)}
          aria-pressed={r.isActive}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer select-none border',
            r.isActive
              ? 'bg-primary-4/10 border-primary-4/50 text-neutral-1'
              : 'bg-neutral-3 border-neutral-3 text-neutral-2 hover:border-neutral-2 hover:text-neutral-1'
          )}
        >
          <span>{r.emoji}</span>
          <span className="tabular-nums">{r.count}</span>
        </button>
      ))}
    </div>
  );
}

import { cn } from '../../utils/cn';
import type { HeadingLevel } from '../../types/heading-level';

export interface ProjectInfoProps {
  /** Task/project title. Grows to fill the row and truncates to a single line. */
  title: string;
  /**
   * Which `<h*>` the title renders as. Was hardcoded to `3`, which is why a board's column
   * headers and its card titles were both level 3 and could not be told apart by
   * `getAllByRole('heading', { level: 3 })` — give the header a `2` and its cards the
   * default `3` and the outline nests properly.
   * @default 3
   */
  headingLevel?: HeadingLevel;
  /**
   * `id` placed on the heading element, so something outside can point at it — chiefly a
   * containing `<article aria-labelledby>` (which is exactly what `TaskCard` does). The
   * heading carried no `id`, so that reference was impossible to write.
   */
  titleId?: string;
  /**
   * Turns the title into the row's activation affordance: it renders as a real `<button>`
   * whose accessible name is `title`, so it is tabbable and Enter/Space-activatable with no
   * hand-rolled `role`/`tabIndex`/`onKeyDown`. Pass it wherever the surrounding card or row
   * is clickable — a click handler on the container alone is unreachable without a pointer.
   * The button stops the click from bubbling, so a container handler wired to this same
   * callback fires exactly once.
   */
  onTitleClick?: () => void;
  /**
   * Optional trailing 24×24 icon (Figma "Icon Placeholder" slot). Should use `currentColor`
   * for its fill/stroke — the slot always renders it in neutral.2, matching every captured
   * instance (the icon glyph itself is never legible/labeled in the export).
   */
  icon?: React.ReactNode;
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * ProjectInfo
 *
 * Figma: "Project Info" COMPONENT (Cards00.md/Cards01.md, also recurring inside
 * "Task Column03.md"). A single row: title text (flex-grow, truncates) + an optional
 * trailing 24×24 icon. Every real instance across both files shares this exact shape —
 * there is no name/description/status-badge/progress-bar variant anywhere in spec (that
 * was a prior fabrication with zero ground-truth basis and zero consumers).
 *
 * `onTitleClick` renders the title as a button rather than static text. That is how a
 * clickable card or row gets a keyboard path: one real control named by the title, with the
 * container's own click handler left as a redundant pointer target beside it.
 */
export function ProjectInfo({
  title,
  icon,
  onTitleClick,
  headingLevel = 3,
  titleId,
  className,
}: ProjectInfoProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <div className={cn('flex items-center gap-2 w-full', className)}>
      {/* Desktop/Body/L/bold: SF Pro Display, 18px/32px, weight 600, letter-spacing 0.75px.
          tracking-wider (0.05em) is only exact at 15px (the Chunk 2/3 convention) — at 18px
          that resolves to 0.9px, so an arbitrary value is used here instead for pixel accuracy.

          `truncate` moves onto the button when there is one, instead of staying here: it sets
          `overflow: hidden`, and a focus ring is painted *outside* the element's box, so a
          truncating <h3> would clip the button's ring away on all four sides. The button
          inherits this element's typography (Tailwind's preflight sets `font: inherit` on
          form controls), so the two render identically. */}
      <Heading
        id={titleId}
        className={cn(
          'flex-1 min-w-0 text-body-l font-semibold text-main font-sans',
          !onTitleClick && 'truncate',
        )}
      >
        {onTitleClick ? (
          <button
            type="button"
            // Stops here rather than reaching an ancestor row/card handler wired to the same
            // callback — otherwise activating the title would open the task twice.
            onClick={(e) => {
              e.stopPropagation();
              onTitleClick();
            }}
            className="inline-block max-w-full truncate align-bottom text-left cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:outline-offset-2"
          >
            {title}
          </button>
        ) : (
          title
        )}
      </Heading>
      {icon ? (
        <span className="flex items-center justify-center w-6 h-6 shrink-0 text-muted">{icon}</span>
      ) : null}
    </div>
  );
}

import { cn } from '../../utils/cn';

export interface ProjectInfoProps {
  /** Task/project title. Grows to fill the row and truncates to a single line. */
  title: string;
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
 */
export function ProjectInfo({ title, icon, className }: ProjectInfoProps) {
  return (
    <div className={cn('flex items-center gap-2 w-full', className)}>
      {/* Desktop/Body/L/bold: SF Pro Display, 18px/32px, weight 600, letter-spacing 0.75px.
          tracking-wider (0.05em) is only exact at 15px (the Chunk 2/3 convention) — at 18px
          that resolves to 0.9px, so an arbitrary value is used here instead for pixel accuracy. */}
      <h3 className="flex-1 min-w-0 truncate text-[18px] leading-8 font-semibold tracking-[0.75px] text-neutral-1 font-sans">
        {title}
      </h3>
      {icon ? (
        <span className="flex items-center justify-center w-6 h-6 shrink-0 text-neutral-2">
          {icon}
        </span>
      ) : null}
    </div>
  );
}

import { cn } from '../../utils/cn';

export interface AvatarProps {
  /** Image URL to render. Falls back to initials derived from `name` when omitted. */
  src?: string;
  /**
   * Full name of the person. This is the avatar's **accessible name** in both states — with
   * an image and without one — and the source of the fallback initials.
   */
  name?: string;
  /**
   * Accessible name used when `name` is absent, e.g. an unassigned task.
   *
   * Overridable rather than hardcoded for the same reason `TaskListView`'s `emptyTitle` is:
   * the kit cannot know the consumer's language or domain. The visible fallback stays `'?'`
   * — this names it, it does not relabel it.
   * @default 'Unassigned'
   */
  fallbackLabel?: string;
  /**
   * Controls the avatar's width, height, and initials font size.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class names, merged last via `cn()` so they can override defaults. */
  className?: string;
}

/**
 * Circular user avatar that shows an image, or initials derived from `name` when no `src` is
 * provided.
 *
 * **The accessible name lives on the wrapper, not on the `<img>`** (#47), and the image is
 * `alt=""`. Two reasons, and the second is why this was a migration blocker:
 *
 * - An avatar conveys *who*, not what a picture looks like. With the name on the image, a
 *   screen reader announces "image, Alice" — the "image" part is noise and "Alice" is the
 *   whole point.
 * - Without an image there is no `<img>`, so there was no `alt` and nothing else carried a
 *   name: the component became a `<div>` holding two letters, with **no role and no
 *   accessible name at all**. That is not an edge case — the consuming API's `User.avatar`
 *   and `Task.assignee` are both nullable, which is why the initials fallback exists.
 *
 * `role="img"` makes the wrapper's contents presentational, so the initials are not announced
 * on top of `aria-label`; they remain in `textContent` for anyone asserting on them.
 */
export function Avatar({
  src,
  name,
  fallbackLabel = 'Unassigned',
  size = 'md',
  className,
}: AvatarProps) {
  // Sizes match the Figma "Avatar" component variants (Property 1=Default/Variant2/Variant3):
  // 32px / 40px / 48px. Initials font-size per variant has no dedicated Figma spec (exported
  // examples are all image-filled), so existing text sizes are kept as-is.
  const sizes = {
    sm: 'w-8 h-8 text-xs font-semibold',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-bold',
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Falsy rather than nullish, matching `getInitials` below: an empty-string name is not a
  // name, and it would otherwise produce an avatar labelled with nothing at all.
  const label = name || fallbackLabel;

  return (
    <div
      role="img"
      aria-label={label}
      // Same string as `aria-label`, deliberately, and not a second prop. This is the hover
      // tooltip a pointer user gets — an avatar is a picture of a name, and without it the
      // only way to find out whose is to hover something else. `aria-label` outranks `title`
      // in the accessible-name computation, so this adds a tooltip without touching what a
      // screen reader announces or announcing anything twice. The consuming app's own avatar
      // carries the same `title`, so the swap keeps its tooltips rather than dropping them.
      title={label}
      className={cn(
        // The initials are `neutral-5` on the `primary-1` tint, **not** the `primary-4`
        // they used to be. That pairing measured 2.61:1 and was the single largest
        // accessibility defect in the kit: 46 of the 131 colour-contrast violations an
        // axe pass over the built Storybook reported came from this one class, because
        // an avatar renders in almost every composed story.
        //
        // Unlike the kit's other AA deviations there is nothing to trade away here. The
        // design has **no** initials treatment at all — every exported Avatar frame is
        // image-filled (see the size note below), so `bg-primary-1 text-primary-4` was an
        // engineering invention rather than something Figma draws. `neutral-5` is the
        // colour this kit already uses for text on a light surface (`Input`'s value,
        // `--color-surface-neutral` at 15.40:1), and it clears **10.50:1** on the tint.
        //
        // The tint itself is unchanged, so an avatar still reads as the same pink circle.
        // `text-neutral-5` stays a raw ramp class rather than `text-surface-shell`: that
        // alias names a *background* role, and this is a foreground.
        'relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-1 text-neutral-5 select-none shrink-0',
        sizes[size],
        className,
      )}
    >
      {src ? (
        // `alt=""`, deliberately. The wrapper above already carries the name; an `alt` here
        // would have the avatar announced twice, and as "image, Alice" rather than "Alice".
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}

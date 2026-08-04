import React from 'react';
import { cn } from '../../utils/cn';


export interface TabItem {
  /** Unique identifier for the tab; used to key the tab button, its panel, and their ARIA relationships. */
  id: string;
  /** Text label displayed inside the tab button. */
  label: string;
  /** Optional icon to show before the label */
  icon?: React.ReactNode;
}

export interface TabsProps {
  /** Tab item definitions */
  items: TabItem[];
  /** Content to render per tab (keyed by tab id) */
  panels?: Record<string, React.ReactNode>;
  /** Default selected tab id (uncontrolled) */
  defaultSelectedKey?: string;
  /** Controlled selected tab id */
  selectedKey?: string;
  /** Called when selected tab changes */
  onSelectionChange?: (key: string) => void;
  /** Additional class names applied to the root container, merged last via `cn()`. */
  className?: string;
}

/**
 * Tabs
 *
 * Figma: "Tabs" COMPONENT_SET inside "Button, Switch Button" frame
 * (Property 1=Selected / Variant2). Frame 299: flex column, padding
 * 12px 0px 8px, gap 8px, label + 2px indicator strip below it.
 * Label: Android/Body/S/regular (13px/20px, weight 400, letter-spacing
 * 0.25px, centered) -- per the Chunk 1 precedent, mobile-labeled Figma
 * text styles (Android/Roboto here, iOS/SF Pro elsewhere) don't get a
 * separate font-family token, they render on the shared `--font-sans`.
 * Active tab: text + indicator primary-4. Inactive: text neutral-2,
 * indicator same as background (i.e. invisible) -- hover:text-neutral-1
 * is a spec-free, non-contradicted addition. The full-width `border-b`
 * previously under the tablist had no grounding in spec (only the
 * per-tab indicator strip is real) and has been removed.
 *
 * @remarks
 * This is a hand-rolled `role="tablist"`/`role="tab"`/`role="tabpanel"`
 * implementation with click-based selection only — it does not use
 * react-aria's `useTabListState`/`useTabList`/`useTab`/`useTabPanel` hooks
 * and does not yet support the WAI-ARIA APG's arrow-key tab navigation.
 * Tracked as a follow-up accessibility improvement, not a Figma-fidelity
 * issue.
 */
export function Tabs({
  items,
  panels,
  defaultSelectedKey,
  selectedKey: controlledKey,
  onSelectionChange,
  className,
}: TabsProps) {
  // Build state manually: track selected key locally when uncontrolled
  const [internalKey, setInternalKey] = React.useState(
    defaultSelectedKey ?? items[0]?.id ?? ''
  );
  const isControlled = controlledKey !== undefined;
  const selectedKey = isControlled ? controlledKey : internalKey;

  const handleSelect = (key: string) => {
    if (!isControlled) setInternalKey(key);
    onSelectionChange?.(key);
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Tab list — role="tablist" */}
      <div
        role="tablist"
        aria-label="Tab navigation"
        className="flex items-end"
      >
        {items.map((item) => {
          const isSelected = selectedKey === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${item.id}`}
              id={`tab-${item.id}`}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={cn(
                // Figma "Tabs" Frame 299: padding 12px 0px 8px (asymmetric
                // vertical padding around the label) -- was symmetric py-3.5.
                // Horizontal padding (px-5) is kept: Figma's own value there
                // is 0px, but that's an artifact of a fixed-width (120px)
                // demo box, not a real horizontal-padding spec for
                // arbitrary-length labels.
                'relative flex items-center justify-center gap-2 px-5 pt-3 pb-2 text-[13px] leading-5 font-normal tracking-[0.25px] text-center font-sans transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2',
                isSelected
                  ? 'text-primary-4'
                  : 'text-neutral-2 hover:text-neutral-1'
              )}
            >
              {item.icon ? (
                <span className="text-base leading-none">{item.icon}</span>
              ) : null}
              {item.label}
              {/* 2px bottom indicator — matching Figma */}
              {isSelected ? (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-4" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      {panels ? (
        <div
          role="tabpanel"
          id={`panel-${selectedKey}`}
          aria-labelledby={`tab-${selectedKey}`}
          className="flex-1"
        >
          {panels[selectedKey] ?? null}
        </div>
      ) : null}
    </div>
  );
}

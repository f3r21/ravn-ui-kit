import React, { useMemo, useRef } from 'react';
import { useTabListState, Item } from 'react-stately';
import type { TabListState } from 'react-stately';
import { useTabList, useTab, useTabPanel } from 'react-aria';
import type { Node } from '@react-types/shared';
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
 * Uses react-stately's `useTabListState` + react-aria's
 * `useTabList`/`useTab`/`useTabPanel` for `role="tablist"`/`role="tab"`/
 * `role="tabpanel"` wiring, which gets WAI-ARIA APG arrow-key navigation
 * (Left/Right, Home/End) and roving tabindex for free — matching how
 * `Input`/`Datepicker`/`SearchBar` already lean on react-aria hooks rather
 * than hand-rolled ARIA. Previously this was a hand-rolled, click-only
 * implementation with no arrow-key support.
 */
export function Tabs({
  items,
  panels,
  defaultSelectedKey,
  selectedKey,
  onSelectionChange,
  className,
}: TabsProps) {
  const itemsById = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);

  const state = useTabListState<TabItem>({
    items,
    selectedKey,
    defaultSelectedKey: defaultSelectedKey ?? items[0]?.id,
    onSelectionChange: (key) => onSelectionChange?.(String(key)),
    children: (item) => (
      <Item key={item.id} textValue={item.label}>
        {item.label}
      </Item>
    ),
  });

  const tabListRef = useRef<HTMLDivElement>(null);
  const { tabListProps } = useTabList<TabItem>(
    { 'aria-label': 'Tab navigation' },
    state,
    tabListRef,
  );

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Tab list — role="tablist" */}
      <div {...tabListProps} ref={tabListRef} className="flex items-end">
        {[...state.collection].map((item) => (
          <Tab
            key={item.key}
            item={item}
            state={state}
            icon={itemsById.get(String(item.key))?.icon}
          />
        ))}
      </div>

      {/* Tab panel */}
      {panels ? <TabPanel state={state} panels={panels} /> : null}
    </div>
  );
}

interface TabProps {
  item: Node<TabItem>;
  state: TabListState<TabItem>;
  icon?: React.ReactNode;
}

function Tab({ item, state, icon }: TabProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { tabProps, isSelected } = useTab({ key: item.key }, state, ref);

  return (
    <button
      {...tabProps}
      ref={ref}
      type="button"
      className={cn(
        // Figma "Tabs" Frame 299: padding 12px 0px 8px (asymmetric
        // vertical padding around the label) -- was symmetric py-3.5.
        // Horizontal padding (px-5) is kept: Figma's own value there
        // is 0px, but that's an artifact of a fixed-width (120px)
        // demo box, not a real horizontal-padding spec for
        // arbitrary-length labels.
        'relative flex items-center justify-center gap-2 px-5 pt-3 pb-2 text-tab-label font-normal text-center font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-interactive-text focus-visible:-outline-offset-2',
        // `-text`, not the bare `text-interactive`: a tab label is text, and primary-4 as
        // text clears 4.5:1 on no surface in this palette (2.86 / 3.51 / 4.02 over
        // overlay / panel / shell). `primary-2` clears all three at 5.43 / 6.67 / 7.63.
        // The 2px indicator below stays primary-4 — that is a non-text boundary at 3:1,
        // and it is no longer the only selection signal anyway.
        isSelected ? 'text-interactive-text' : 'text-muted hover:text-main',
      )}
    >
      {icon ? <span className="text-base leading-none">{icon}</span> : null}
      {item.rendered ?? item.textValue}
      {/* 2px bottom indicator — matching Figma */}
      {isSelected ? <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-4" /> : null}
    </button>
  );
}

interface TabPanelProps {
  state: TabListState<TabItem>;
  panels: Record<string, React.ReactNode>;
}

function TabPanel({ state, panels }: TabPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { tabPanelProps } = useTabPanel({}, state, ref);
  const selectedKey = state.selectedKey != null ? String(state.selectedKey) : '';

  return (
    <div {...tabPanelProps} ref={ref} className="flex-1">
      {panels[selectedKey] ?? null}
    </div>
  );
}

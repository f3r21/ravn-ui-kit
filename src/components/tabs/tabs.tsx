import React from 'react';
import { cn } from '../../utils/cn';


export interface TabItem {
  id: string;
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
  className?: string;
}

/**
 * Tabs
 *
 * Figma: "Tabs" COMPONENT_SET inside "Button, Switch Button" frame.
 * - Active tab: text primary-4 + 2px bottom border primary-4
 * - Inactive: text neutral-2, hover text neutral-1
 * - Uses react-aria useTabList + useTab + useTabPanel (low-level hooks)
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
        aria-label="Navegación por tabs"
        className="flex items-end border-b border-neutral-3/50"
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
                'relative flex items-center gap-2 px-5 py-3.5 text-sm font-semibold font-sans transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-4',
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

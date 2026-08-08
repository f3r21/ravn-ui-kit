import type { Decorator } from '@storybook/react-vite';
import { cn } from '../src/utils/cn';

// Literal class map — Tailwind's scanner needs full literal utility strings
// (not template-literal-constructed ones like `bg-${bg}`), or the CSS never
// gets generated for the dynamic class.
const SURFACE = {
  'neutral-5': 'bg-neutral-5', // #222528 — app shell surface (Sidebar, TopNav, Modal)
  'neutral-4': 'bg-neutral-4', // #2C2F33 — panel/card surface (TaskCard, DatePickerMenu)
} as const;

type Surface = keyof typeof SURFACE;

/**
 * Wraps a story in a padded container matching one of the two dark Figma
 * surfaces, for components whose canvas needs both a background color and
 * layout padding (not just a canvas color swap — use the `backgrounds`
 * toolbar parameter for that instead).
 */
export function withSurface(bg: Surface = 'neutral-5', className?: string): Decorator {
  return (Story) => (
    <div className={cn(SURFACE[bg], 'p-6', className)}>
      <Story />
    </div>
  );
}

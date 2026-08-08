// ─── Styles ───────────────────────────────────────────────────────
// **Build-time only — importing this barrel does not give a consumer any styles.**
// `@tailwindcss/vite` extracts this to `dist/ui-kit.css` and emits no `.css` import into
// `dist/index.js` at all, so nothing resolves at a consumer's runtime. `sideEffects:
// ["*.css"]` in package.json is correct and moot for the same reason. Wiring the CSS up is
// a manual step either way; README.md §2 documents the two paths.
//
// **Do not delete this line.** `src/styles/theme.css` is two imports — `tailwindcss` and
// `./tokens.css` — and this is the only thing that pulls either into the library build
// graph, which makes it the sole reason `dist/ui-kit.css` is emitted. Removing it takes
// that file with it, and with it package.json's `"./ui-kit.css"` export and README.md
// §2's Path B, the integration path for consumers not running their own Tailwind v4 build.
import './styles/theme.css';

// ─── Utilities ────────────────────────────────────────────────────
export * from './utils/cn';
export * from './utils/format-points';

// ─── Shared colour vocabularies ───────────────────────────────────
// One named type per axis (categorical accent / semantic status / due-date
// urgency), so a consumer can tell which system a prop belongs to. See the
// module doc comment for why `Button`'s `variant` is deliberately not here.
export * from './types/color-variants';
export * from './types/heading-level';

// ─── Icons ────────────────────────────────────────────────────────
export * from './components/icons/icons';

// ─── Button family ────────────────────────────────────────────────
export * from './components/button/button';
export * from './components/button/text-button';

// ─── Inputs ───────────────────────────────────────────────────────
export * from './components/input/input';
export * from './components/form-field/form-field';

// ─── Top Navigation ───────────────────────────────────────────────
export * from './components/top-nav/search-bar';
export * from './components/top-nav/top-nav';

// ─── Tabs & Segmented Control ─────────────────────────────────────
export * from './components/tabs/tabs';
export * from './components/tabs/segmented-control';

// ─── Cards & Kanban ───────────────────────────────────────────────
export * from './components/card/card';
export * from './components/card/task-card';
export * from './components/card/task-list-view';
export * from './components/card/task-table';
export * from './components/card/task-meta-badges';
export * from './components/card/project-info';

// ─── Popover (shared floating-surface shell) ──────────────────────
export * from './components/popover/popover';
export * from './components/popover/floating-popover';

// ─── ListBox (headless option list) ───────────────────────────────
export * from './components/listbox/list-box';

// ─── Select ────────────────────────────────────────────────────────
export * from './components/select/select';
export * from './components/select/multi-select';

// ─── Menu ─────────────────────────────────────────────────────────
export * from './components/menu/menu';

// ─── Modals ───────────────────────────────────────────────────────
export * from './components/modal/modal';
export * from './components/modal/add-task-modal';
export * from './components/modal/assignee-modal';
export * from './components/modal/estimate-modal';
export * from './components/modal/label-modal';

// ─── Feedback ─────────────────────────────────────────────────────
export * from './components/badge/badge';
export * from './components/skeleton/skeleton';
export * from './components/empty-state/empty-state';
export * from './components/toast/toast';

// ─── Data display ─────────────────────────────────────────────────
export * from './components/avatar/avatar';
export * from './components/avatar/user-row';
export * from './components/tag/tag';
export * from './components/tag/label-checkbox';

// ─── Datepicker ───────────────────────────────────────────────────
export * from './components/datepicker/datepicker';
export * from './components/datepicker/datepicker-menu';

// ─── Navigation ───────────────────────────────────────────────────
export * from './components/sidebar/sidebar-item';
export * from './components/sidebar/application-sidebar';

// ─── Layout ───────────────────────────────────────────────────────
export * from './components/layout/view-switcher';
export * from './components/layout/app-shell';

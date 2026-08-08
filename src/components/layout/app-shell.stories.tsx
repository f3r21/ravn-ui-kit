import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShell } from './app-shell';
import { ViewSwitcher } from './view-switcher';
import { Button } from '../button/button';
import { TaskListView } from '../card/task-list-view';
import { TaskTable } from '../card/task-table';

const GridIcon = () => (
  <svg
    className="size-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ListIcon = () => (
  <svg
    className="size-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="size-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const navItems = [
  { label: 'DASHBOARD', isActive: true },
  { label: 'MY TASKS', isActive: false, badgeCount: 5 },
  { label: 'PROJECTS', isActive: false, badgeCount: 12 },
  { label: 'TEAM', isActive: false },
  { label: 'SETTINGS', isActive: false },
];

const logo = (
  <span className="font-bold text-xl text-neutral-1 font-sans tracking-tight">RAVN</span>
);

const topBar = (
  <>
    <ViewSwitcher
      value="right"
      leftIcon={<GridIcon />}
      rightIcon={<ListIcon />}
      leftLabel="Board view"
      rightLabel="List view"
    />
    <Button variant="primary" aria-label="Add task">
      <PlusIcon />
    </Button>
  </>
);

const meta: Meta<typeof AppShell> = {
  title: 'Layout/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    logo,
    sidebarItems: navItems,
    topNavProps: { searchPlaceholder: 'Search tasks, projects...', userName: 'Jerome Bell' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const boardTasks = [
  {
    title: 'Set up project',
    points: 3,
    dueDateText: '2 DAYS',
    dueDateUrgency: 'soon' as const,
    tags: [{ label: 'FRONTEND', variant: 'green' as const }],
    assigneeName: 'Jerome Bell',
  },
  {
    title: 'Fix auth bug',
    points: 8,
    dueDateText: 'OVERDUE',
    dueDateUrgency: 'overdue' as const,
    tags: [{ label: 'BUG', variant: 'red' as const }],
    assigneeName: 'Jane Doe',
  },
];

/**
 * `Mockups/Dashboard Default View/Dashboard Mockup.md` — `Sidebar` + `Search
 * Bar` + a `Top Bar` (`ViewSwitcher` + primary "add" `Button`) + `Frame 654`'s
 * row of 3 `Task List View`s (`gap: 32px`), all at the real offsets encoded in
 * `AppShell`.
 */
export const Dashboard: Story = {
  render: (args) => (
    <AppShell {...args} sidebarItems={args.sidebarItems ?? navItems} topBar={topBar}>
      <div className="flex flex-row items-start gap-8">
        <TaskListView title="Working (03)" tasks={boardTasks} className="w-[348px]" />
        <TaskListView title="In review (01)" tasks={[boardTasks[0]]} className="w-[348px]" />
        <TaskListView title="Done (14)" tasks={[]} className="w-[348px]" />
      </div>
    </AppShell>
  ),
};

/**
 * `Mockups/Task Default View/My Task Mockup.md` — the same `AppShell` (same
 * `Sidebar`/`Search Bar`/`Top Bar` offsets, `Table View` content starting
 * 8px lower than the Dashboard's card row, treated as canvas-measurement
 * noise rather than a real distinct offset) with a `TaskTable` in place of
 * the card board, confirming this page is table- not card-based.
 */
export const TaskDefaultView: Story = {
  args: {
    sidebarItems: navItems.map((item) => ({ ...item, isActive: item.label === 'MY TASKS' })),
  },
  render: (args) => (
    <AppShell {...args} sidebarItems={args.sidebarItems ?? navItems} topBar={topBar}>
      <TaskTable
        groups={[
          {
            title: 'To Do (05)',
            rows: [
              {
                index: 1,
                title: 'Create wireframe',
                indicatorColor: 'red',
                estimationPoints: 4,
                assigneeName: 'Amelia Nellson',
                dueDate: 'Yesterday',
                dueDateUrgency: 'overdue',
              },
              {
                index: 2,
                title: 'Slack Logo Design',
                indicatorColor: 'green',
                tags: [{ label: 'IOS APP', variant: 'green' }],
                estimationPoints: 2,
                assigneeName: 'Jonah Doe',
                dueDate: 'Today',
                dueDateUrgency: 'soon',
              },
            ],
          },
          {
            title: 'In Progress',
            rows: [
              {
                index: 1,
                title: 'Dashboard Design',
                assigneeName: 'Amelia Nellson',
                dueDate: '6 July, 2020',
              },
            ],
          },
        ]}
      />
    </AppShell>
  ),
};

/**
 * The escape hatch from #15. `sidebarItems` used to be required and `topNavProps` forwarded
 * `TopNav`'s whole API as one prop, so the shell a consumer most wants to adopt was the one
 * most welded to the kit's own parts.
 *
 * Here both are replaced with plain markup that is not this kit's. The `sidebar` slot owns its
 * own width — the kit's sidebar is a rigid `w-[232px] shrink-0` and yours need not match.
 */
export const WithNonKitNavigation: Story = {
  args: {
    sidebar: (
      <nav
        aria-label="Product navigation"
        className="flex flex-col gap-2 w-[200px] shrink-0 self-stretch p-4 bg-surface-panel rounded-lg font-sans text-body-m text-main"
      >
        <span className="font-semibold text-muted-on-dark">A consumer’s own nav</span>
        <a
          href="#overview"
          className="rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text"
        >
          Overview
        </a>
        <a
          href="#reports"
          className="rounded-xs focus-visible:outline-2 focus-visible:outline-interactive-text"
        >
          Reports
        </a>
      </nav>
    ),
    topNav: (
      <header className="flex items-center justify-between px-6 py-3 bg-surface-panel rounded-md font-sans text-body-m text-main">
        <span className="font-semibold">A consumer’s own top bar</span>
      </header>
    ),
    children: <TaskListView title="Working (01)" tasks={[{ title: 'Fix auth bug' }]} />,
  },
};

/**
 * `null` is not the same as omitting the prop: it means "no sidebar", where omitting means
 * "build the default one". The shell still lays out correctly with only its main column.
 */
export const NoSidebar: Story = {
  args: {
    sidebar: null,
    children: <TaskListView title="Working (01)" tasks={[{ title: 'Fix auth bug' }]} />,
  },
};

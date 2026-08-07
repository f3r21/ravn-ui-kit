import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      // Without this a failing run prints no report, which makes "which
      // component dropped?" needlessly hard to answer in CI.
      reportOnFailure: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        // `exclude` REPLACES the defaults rather than merging with them. Drop
        // this spread and colocated `*.test.tsx` files start counting as
        // source, inflating every metric and turning the thresholds below into
        // a rubber stamp.
        ...coverageConfigDefaults.exclude,
        // Storybook stories are documentation, not source under test. They
        // would otherwise be counted as almost-entirely-uncovered files and
        // drag the number down by how many stories a component has, which is
        // not a signal about how well the kit is tested.
        'src/**/*.stories.tsx',
        // The public barrel: re-exports only, no logic to cover.
        'src/index.ts',
        // Types-only, so it emits no JavaScript at all. v8 still lists it and reports 0%,
        // which reads as an untested file rather than as one there is nothing to test.
        // `color-variants.ts` is deliberately NOT here — it ships a real runtime map.
        'src/types/heading-level.ts',
      ],
      // A ratchet, not a target. These are set just under the numbers the suite
      // actually produced when coverage was first wired up, so the gate starts
      // green and can only be moved upward. Setting them at the consuming app's
      // 85% would have failed on day one and made the honest move — writing the
      // missing tests — look like a config problem.
      //
      // What is holding them down is known and specific: 6 of 40 component files
      // ship no test of their own — `UserRow`, `Card`, `TaskMetaBadges`,
      // `AppShell`, `ApplicationSidebar` and `SidebarItem`. Re-derive rather than
      // trust this list, which ages every time one gains a test:
      //
      //   T=$(git ls-tree -r HEAD --name-only)
      //   for f in $(echo "$T" | grep -E '^src/components/.*\.tsx$' \
      //       | grep -vE '\.(test|stories)\.tsx$'); do
      //     echo "$T" | grep -qx "${f%.tsx}.test.tsx" || echo "$f"
      //   done
      //
      // Raise these as that closes; do not lower them.
      //
      // Ratcheted up by the palette-contrast pass, which added `badge.test.tsx`
      // plus class-level guards on `Tag` and `Avatar`, then the completeness audit
      // added guards for the two :has()-drawn focus rings. 85.94 -> 86.56.
      //
      // Then the two-defect fix (`TaskTableRow`'s missing keyboard path,
      // `AddTaskModal`'s stale reopen) added `project-info.test.tsx` and covered
      // the row and widget branches those fixes introduced. 86.56 -> 88.76.
      //
      // Then the shell-readiness pass (#9's shell half) gave `ViewSwitcher` its
      // first test file at all, and added cases to `Button`, `SegmentedControl`,
      // `SearchBar` and `TopNav`. 88.76 -> 90.18.
      //
      // Then the board-readiness pass (#9's board half, #48) added
      // `task-list-view.test.tsx` and `skeleton.test.tsx`, and extended
      // `ProjectInfo`, `TaskCard`, `TaskTable` and `DatePickerMenu`. 90.18 -> 90.68.
      //
      // Then `Avatar`'s accessible name (#47) replaced the `getByAltText` case with
      // role-based ones and added the fallback-state and unassigned cases.
      // 90.68 -> 90.71, branches 89.44 -> 89.69.
      //
      // Branches is set from three consecutive runs, not one. A single run here read
      // 89.72% (358/399) and every run since reads 89.69% (357/398) — note the
      // *denominator* moves, so it is v8 instrumentation variance rather than a test
      // that sometimes covers more. A threshold taken from the lucky run fails the
      // gate on the next commit for a reason that has nothing to do with the change.
      thresholds: {
        statements: 90.71,
        branches: 89.69,
        functions: 84.89,
        lines: 90.71,
      },
    },
  },
});

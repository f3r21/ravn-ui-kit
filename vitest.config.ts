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
      ],
      // A ratchet, not a target. These are set just under the numbers the suite
      // actually produced when coverage was first wired up, so the gate starts
      // green and can only be moved upward. Setting them at the consuming app's
      // 85% would have failed on day one and made the honest move — writing the
      // missing tests — look like a config problem.
      //
      // What is holding them down is known and specific: 10 of 38 component
      // files ship no test at all (`ApplicationSidebar` and `SidebarItem` are
      // at 0%, `Skeleton` at 50%), which is `MIGRATION_GAPS.md` Section 5's
      // open item. Raise these as that closes; do not lower them.
      thresholds: {
        statements: 85.94,
        branches: 84.92,
        functions: 80.15,
        lines: 85.94,
      },
    },
  },
});

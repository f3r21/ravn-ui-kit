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
      // What is holding them down is known and specific: 4 of 40 component files
      // ship no test of their own — `UserRow`, `Card`, `AppShell` and
      // `SidebarItem`. Re-derive rather than trust this list, which ages every
      // time one gains a test and had already aged before #13 read it: it said
      // "6 of 40" and named `TaskMetaBadges`, which by then had a test, so the
      // true count on `main` was 5. #13 gave `ApplicationSidebar` its first, which
      // is the step from 5 to the 4 above. Run the loop rather than trusting
      // either number — including this one:
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
      // Branches is set from three consecutive runs, not one. A single run read
      // 89.72% (358/399); roughly ten runs since have all read 89.69% (357/398), and the
      // outlier has never reproduced.
      //
      // An earlier version of this comment called that v8 instrumentation variance. That
      // was a guess stated as a cause and it is withdrawn: the outlier came immediately
      // after a rebase, so a stale Vitest cache is at least as likely, and nothing here
      // distinguishes them. What is measured is that the *denominator* moved; what is not
      // measured is why.
      //
      // The operating rule survives either way, and it is the point: take a ratchet number
      // from three runs rather than one, because a threshold set from the lucky run fails
      // the gate on the next commit for a reason that has nothing to do with that change.
      // And check the exit status — `out=$(npm run gate 2>&1); rc=$?` — because the
      // coverage summary prints identical percentages whether or not the thresholds passed.
      // Then #13's overridable accessible names gave `ApplicationSidebar` its first
      // test file at all, and added override cases to `Tag`, `Modal`, `TopNav`,
      // `Tabs`, `DatePickerMenu`, the three anchored pick-one popovers,
      // `TaskTableRow` and `LabelCheckbox`. 91.77 -> 94.02, branches 90.29 -> 90.90.
      //
      // Set from the exact ratios rather than the printed table, which rounds to one
      // decimal: branches reads "90.9" and is 390/429 = 90.909091, so a threshold of
      // 90.91 would fail the run that produced it. Three consecutive runs were
      // byte-identical on all four metrics, denominators included.
      //
      //   npx vitest run --coverage --coverage.reporter=json-summary
      //   node -e "const t=require('./coverage/coverage-summary.json').total;
      //     for (const k of ['statements','branches','functions','lines'])
      //       console.log(k, t[k].covered+'/'+t[k].total, (t[k].covered/t[k].total*100).toFixed(6))"
      //
      // Then #92 gave due-date urgency a spoken state, adding `DueDateUrgencyState` plus 18
      // cases across `TaskCard` and `TaskTable`. 94.02 -> 94.33, branches 90.90 -> 91.30.
      //
      // Then #15's composition slots gave `AppShell` its first test file and added slot cases
      // to `TopNav`, `TaskCard`, `TaskListView` and `TaskTable`. 94.33 -> 95.29, branches
      // 91.30 -> 91.75. `functions` did not move: the new slots are props on existing
      // components, not new functions, so 128/144 is unchanged and stays the tightest of the
      // four.
      //
      // These are set exact, with no deliberate headroom. Review on #89 raised this for
      // `branches`; it is true of **all four**, and `functions` is the tightest of them —
      // losing a single covered unit fails every one:
      //
      //   metric       covered    margin        one fewer     verdict
      //   statements   2611/2740  0.001971pp    95.255474     FAIL
      //   branches      412/449   0.009465pp    91.536748     FAIL
      //   functions     128/144   0.008889pp    88.194444     FAIL
      //   lines        2611/2740  0.001971pp    95.255474     FAIL
      //
      // Compute that table, do not transcribe it. Three of these margins were hand-copied
      // from a terminal across #92 and #15 and three were wrong the same way — a dropped
      // leading 8, turning 0.008889 into 0.000889. Review on #99 caught one; recomputing
      // caught the rest:
      //
      //   node -e "for (const [n,c,t,thr] of [['statements',2611,2740,95.29],
      //     ['branches',412,449,91.75],['functions',128,144,88.88]])
      //     console.log(n, (c/t*100-thr).toFixed(6))"
      //
      // The margin does not trend — it wanders, because a threshold truncated to two decimals
      // sits somewhere in **[0, 0.01)pp** below the true ratio depending only on where that
      // ratio lands. `statements` read 0.003756pp at #89, 0.008235pp at #92 and 0.001971pp
      // here: up, then back down. Do not read a small margin as decay or a larger one as
      // safety. What is constant, and what actually matters, is that **one uncovered unit
      // fails every one of the four** — `functions` included, where 127/144 reads 88.194
      // against a threshold of 88.88.
      //
      // Re-derive with the json-summary command above rather than trusting this table.
      // That tightness is chosen, and it has a consequence somebody will hit — recorded
      // here rather than in a PR thread that will be hard to find.
      //
      // **A dependency bump can move the denominator without anyone's coverage regressing.**
      // Open right now: #32 bumps jsdom 26 -> 30, a major. This repo already knows that bump
      // changes which code runs — #82's CHANGELOG entry says jsdom 26 lacks `PointerEvent`,
      // so react-aria takes a `NODE_ENV === 'test'` branch without it and jsdom 30 supplies
      // it. Per-branch CI cannot see the interaction: #32 is green alone, this was green
      // alone, and `main` goes red only once both land, with `git bisect` pointing at
      // dependabot.
      //
      // So, for the lane that meets that red `main`: **re-derive before you conclude
      // anything.** If the denominator moved, the measurement basis changed and the honest
      // response is to set the new exact value — even when it is a lower number. That is not
      // the "lowering to go green" `CLAUDE.md` forbids, which means slackening a threshold to
      // hide tests you did not write. Distinguish them by the denominator: same denominator
      // and fewer covered is a real regression, so write the test. Different denominator is a
      // new basis, so re-derive and say which bump moved it in the commit message.
      thresholds: {
        statements: 95.29,
        branches: 91.75,
        functions: 88.88,
        lines: 95.29,
      },
    },
  },
});

import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    /**
     * Vitest's own default, **written down** (#63).
     *
     * It was undeclared, so a lane meeting `Test timed out in 5000ms` had nothing in the repo
     * to read: no number to weigh their test against and no statement that 5s is deliberate.
     * The value is unchanged — this is the bound becoming visible, not a bump.
     *
     * **It is deliberately not raised globally.** Five tests failed under load and the honest
     * fix is a declared allowance on the two that do genuinely slow work, not a suite-wide
     * number chosen until nothing fails. A global raise is indistinguishable from removing the
     * bound for the other 799 tests, and that difference only shows up the day one really hangs.
     *
     * Measured on this machine at load average ~78 (six concurrent suites), against idle:
     *
     *   scripts/hooks.test.mjs        614ms / 356ms idle  ->  5965ms / 6125ms  FAILED
     *   datepicker navigation/tz   108/84/47ms idle       ->  1574/1302/828ms  passed
     *
     * The two that fail spawn a real Prettier process per case; the datepicker cases are pure
     * in-process work and keep 3x headroom even under that load. So the allowance goes on the
     * process-spawning file only — see the `describe` in `scripts/hooks.test.mjs`.
     */
    testTimeout: 5000,
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
      // Then #98 repainted `Card` onto the kit's own surface and had `TaskCard` compose it
      // instead of restating the chrome, adding 11 cases in `Card`'s first test file.
      //
      // **Neither branch's numbers survive the merge, and neither dominates the other.** #97
      // alone read 97.56/93.10/91.33 and #98 alone read 96.39/93.02/91.39 — #98 is *higher* on
      // functions and lower on the other three. So even the per-column maximum is a guess here,
      // which is the sharpest form of the hazard #95/#102 record below: it passes the gate while
      // silently loosening the ratchet. Re-derived on the tree that has both.
      //
      // Then #97 replaced the frozen column schema with a `columns` prop, adding 11 cases. Its
      // jump was large mostly because of deletion rather than new tests: five hardcoded `<td>`s
      // in the row and five more in the skeleton became one map each, so the denominator fell as
      // the numerator rose. A ratchet reading a big rise should be checked for exactly that.
      //
      // Then #90 made the kit's remaining visible copy overridable — `AddTaskModal.copy` and
      // `formatDueDate`, `DatePickerMenu.todayLabel`, `TaskTableRow.detailsLabel`,
      // `TaskTable.columnLabels` — adding 12 cases, on top of #111's 6.
      //
      // **The values below are re-derived on the tree that has both**, for the reason #95/#102
      // are recorded below: #111 alone measured 95.88/92.50/90.47 and #90 alone measured
      // 95.90/92.75/90.54, and neither is the merged truth. Taking a side — or the per-column
      // maximum — passes the gate while quietly leaving the ratchet slack.
      //
      // Then #111 made the assignee cell render unconditionally so an unassigned row announces
      // the state, adding 6 cases. Branches and functions held on that branch — the change
      // removes a conditional rather than adding one.
      //
      // Then #94 moved the points wording into shared formatters, adding 11 cases across
      // `format-points`, `TaskCard` and `TaskTable`. 95.64 -> 95.87, branches 91.95 -> 92.50,
      // functions 89.65 -> 90.47. The branch count rose because three inline ternaries became
      // two formatters that the tests exercise on 0, 1 and 4.
      //
      // Then #93 gave `TaskMetaBadge` a decorative arm, adding 7 cases. Only `branches`
      // moves — 91.86 -> 91.95; the others were already at their ceiling for this tree, so
      // they hold rather than rise. Holding is not lowering.
      //
      // Then #95 gave `TaskTableRow` an actions slot and `TaskTableGroup` a heading level,
      // adding 9 cases, and #102 gave the tag chips their casing and a styling channel, adding
      // 5 more. They were cut from the same commit and merged back to back.
      //
      // **The values below are re-derived on the merged tree, and that is the whole point.**
      // Neither branch could measure it: #95 alone read 95.31/91.83/88.96 and #102 alone read
      // 95.62/91.79/89.58, and the truth once both are in is higher than either. Resolving
      // that conflict by taking a side — or even the per-column maximum — would have **passed
      // the gate**, because every value on both branches sits below the merged ratio.
      //
      // That is the failure mode worth naming: it does not break the ratchet, **it stops it
      // ratcheting**. Nothing reddens, nothing gets bisected, and `functions` quietly acquires
      // ~0.7pp of slack in a file whose convention is pinning within ~0.005pp of measurement.
      // A silent loosening is worse than a red gate, because only one of the two gets noticed.
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
      //   statements   2816/2873  0.006011pp    97.981204     FAIL
      //   branches      464/497   0.000161pp    93.158954     FAIL
      //   functions     141/153   0.006863pp    91.503268     FAIL
      //   lines        2816/2873  0.006011pp    97.981204     FAIL
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
      // ratio lands. `statements` read 0.003756pp at #89, 0.008235pp at #92, 0.001971pp at #15
      // and 0.005228pp here: no direction at all across four readings. Do not read a small margin as decay or a larger one as
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
        statements: 98.01,
        branches: 93.36,
        functions: 92.15,
        lines: 98.01,
      },
    },
  },
});

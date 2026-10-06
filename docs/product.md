# Product

**Ship `v0.9.0` to its one consumer: yes, it already runs there. Cut the next release: not
yet.** `[Unreleased]` holds breaking renames the app has not absorbed (app#157).

Written on 2026-10-06, after the kit was built, from what this repository already says.
Inferred lines say **assumption**.

## The users and the problem

**Proto-personas (assumption).** Two people, neither interviewed:

1. **The developer who consumes the kit.** In practice one app,
   [ravn-task-management-challenge](https://github.com/f3r21/ravn-task-management-challenge).
   They need to install it without a registry, wire its styles once, and get the same bytes
   every time.
2. **The person using screens built from it,** including someone on a screen reader or a
   keyboard.

Built from reasons written while the kit was built:

| What the repository says                                                                 | Where                              | First written         |
| ---------------------------------------------------------------------------------------- | ---------------------------------- | --------------------- |
| `npm install @ravn/ui-kit` fails; pin a tag, not a branch                                | `README.md`, "Install the package" | 2026-08-06, `51f82e3` |
| Hiding field labels entirely "would have left screen-reader users with an unnamed input" | Storybook, Decisions §4            | 2026-08-05, `c6395e2` |
| Due-date urgency is stated in words, not by colour alone                                 | commit `2f7ead5`                   | 2026-08-08            |

**Problem (assumption).** The challenge's Figma file is a component library. Without a
package, its components and tokens would exist only inside one app, and every screen would
re-derive colours and states by eye.

## What was built, and what was cut

49 components and 21 icons, counted from the exported functions in `dist/index.d.ts` (the
command is in the app's `docs/design-system.md`); tokens from Figma; a Storybook published
from `main`.

| Candidate                                        | MoSCoW      | Status | Why                                                                                                |
| ------------------------------------------------ | ----------- | ------ | -------------------------------------------------------------------------------------------------- |
| Every component the app imports, at AA contrast  | Must        | Built  | The app's `ui-kit-smoke.test.tsx` checks each one is exported                                      |
| Tokens from a verified Figma export              | Must        | Built  | The kit's first rule: no design value is invented                                                  |
| Storybook stories for 40 of 41 component files   | Should      | Built  | The consumer reads props and states without cloning                                                |
| Empty state and toast, which Figma does not draw | Could       | Built  | Ported from the app, which paid for their accessibility lessons first                              |
| Mobile layouts                                   | Won't       | Cut    | The design is a fixed 1440px canvas; one responsive piece in a rigid shell is worse (Decisions §1) |
| Visible field labels by default                  | Won't       | Cut    | Figma draws none; labels stay for screen readers and can be shown per control (Decisions §4)       |
| A darker brand red for the main button           | Won't       | Cut    | Figma has no such value, and inventing one breaks the first rule (Decisions §3)                    |
| Publishing to a registry                         | Won't (now) | Cut    | One consumer; a git tag gives it exact bytes with no token or registry                             |

No RICE table: reach, impact and effort were never measured.

## Top three risks

| Risk                                                                                                                           | L × I     | Response                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------ |
| The next release breaks the app: five `tsc` errors and one silent tag-colour regression (app#157)                              | 2 × 3 = 6 | The app pins a tag; the bump is its own pull request with app#157's fixes                        |
| One consumer shapes the whole API, so a second one would meet surprises                                                        | 2 × 2 = 4 | Decisions are written down; one prop name per axis since #148                                    |
| TypeScript 7 cannot land: typescript-eslint, vite-plugin-dts and Storybook's docgen need the compiler API it no longer exports | 3 × 1 = 3 | TypeScript 5.9 keeps working. #155 was closed and Dependabot now skips 7.x, so re-check by hand. |

## The core flow: install, style, render

| Given                 | When                                             | Then                                                       | Checked by                                                                  |
| --------------------- | ------------------------------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| a released tag        | an app installs `github:f3r21/ravn-ui-kit#<tag>` | it gets exactly the built `dist/` that was tagged          | CI step "Check committed dist/ is fresh"                                    |
| the app pins `v0.9.0` | its tests import the kit                         | every component it uses is there, at the pinned version    | app `ui-kit-smoke.test.tsx`: "installed the version the pin names"          |
| any story             | axe runs in Chromium                             | nothing is reported outside `.storybook/a11y-allowlist.ts` | CI step "Accessibility (axe over every story)": 190 passed, run 37490232705 |
| a token's hex changes | the suite runs                                   | a pairing that drops below AA fails                        | `src/styles/contrast.test.ts`                                               |

## Go or no-go

- **`v0.9.0` to the app: go**, and already live. CI on `main` on 2026-10-06, after the
  tooling upgrades (run 37490232705): 998 tests in 52 files, coverage 94.61% of statements
  against a 94.61% ratchet, axe clean outside the allowlist, no high or critical advisory.
  vitest 5 counts coverage on a new basis; under vitest 3 the same suite read 98.29%
  (run 37478798834).
- **The next release: no-go** until the app has a pull request ready for app#157.
- **Owner:** Fernando Ramirez. **Rollback:** the app re-pins the previous tag; published
  `v*` tags are protected from moves and deletion by a repository ruleset, which the admin
  can bypass.

## Validated by

No study of the kit on its own. The app's usability pilot on 2026-10-07 drives screens
built from it ([pilot](https://github.com/f3r21/ravn-task-management-challenge/blob/dev/docs/research/usability-pilot.md)).
**Results are pending.**

## Now, next, later

- **Now:** keep `main` green. TypeScript 7 waits for its tools, and nothing automatic will
  raise it again.
- **Next:** release the prop renames together with the app's pull request for app#157.
- **Later:** a second consumer, then a registry. A darker red, if the brand owner adds one
  to Figma.

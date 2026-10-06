# Test plan, risks and test map

**A green `main` means every component behaves, clears AA outside a written allowlist, and
ships the `dist/` that was built from its source.** It does not mean a screen composed from
the kit is accessible; the app owns that.

## Plan

- **Scope.** The components and tokens in `src/`, the built `dist/`, Storybook and the
  release checks. Out: how an app composes the kit, which the app tests.
- **Entry.** A branch with a pull request into `main`; `npm ci` succeeds on the Node version
  in `.nvmrc`.
- **Exit.** Every step of the `CI` job passes. It is the one required check on `main`.

| Criterion                                                                                                | CI step                                                                  | 2026-10-06 (run 37490232705)                                                         |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Typecheck, lint, format; every test passes; coverage at or above the ratchet in `vitest.config.ts`       | Gate                                                                     | 998 of 998 in 52 files; 94.61% statements (ratchet 94.61%), 92.52% branches (92.52%) |
| `dist/` is exactly what the source builds, and cites no gitignored document                              | Check committed dist/ is fresh; Check dist/ cites no gitignored document | Pass                                                                                 |
| axe in Chromium reports nothing outside `.storybook/a11y-allowlist.ts`, and nothing listed has gone away | Accessibility (axe over every story)                                     | 190 stories passed                                                                   |
| No high or critical advisory                                                                             | Audit dependencies                                                       | Pass; 24 moderate remain                                                             |
| A changelog entry lands under `[Unreleased]`                                                             | Check changelog entries land in [Unreleased]                             | Pass                                                                                 |

## Risk register

Probability (P) and impact (I) from 1 to 3. Owner: Fernando Ramirez. Reviewed 2026-10-06.

| #   | Risk                                                                                                                           | P   | I   | Score | Response                                                                        | Known limit                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | --- | --- | ----- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| K1  | The next release breaks the app: five `tsc` errors and one silent tag-colour regression (app#157)                              | 2   | 3   | 6     | The app pins a tag; bump it in one pull request with app#157's fixes            | The colour regression fails no test in either repo                 |
| K2  | TypeScript 7 cannot land: typescript-eslint, vite-plugin-dts and Storybook's docgen need the compiler API it no longer exports | 3   | 1   | 3     | #155 stays open; TypeScript 5.9 keeps working                                   | No release of the three tools supports TypeScript 7 yet            |
| K3  | A new contrast failure hides on a story that already allows `color-contrast`                                                   | 2   | 2   | 4     | The allowlist is keyed story by rule, and a listed rule that stops firing fails | It is per story and rule, not per element                          |
| K4  | A screen built from the kit fails accessibility although every story passes                                                    | 2   | 2   | 4     | Stories cover each component's states; the app owns composed screens            | The app runs no axe of its own                                     |
| K5  | A consumer needs a narrow screen                                                                                               | 2   | 2   | 4     | Desktop only by decision; below 833px the shell scrolls (Decisions §1)          | No mobile layout is planned                                        |
| K6  | Development dependencies carry advisories                                                                                      | 2   | 1   | 2     | CI fails on high or critical; 24 moderate are reported                          | `shell-quote` is held up by an override (#163), not a real upgrade |

## Test map

| Suite                                            | Proves                                                                                 | Does not prove                                                                                |
| ------------------------------------------------ | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Vitest and Testing Library (52 files, 998 tests) | Each component's behaviour, states and accessible names, in jsdom                      | Real layout, focus and rendering in a browser                                                 |
| `src/styles/contrast.test.ts`                    | Every documented colour pairing's ratio, recomputed from the tokens, failures included | Pairings nobody wrote down                                                                    |
| axe over every story (190, Chromium)             | No finding outside the allowlist, story by story                                       | Composed screens; Firefox and Safari; anything axe cannot compute, such as text on a gradient |
| `dist/` freshness                                | What a git install receives matches the source                                         | That a consumer wired the styles correctly; the app's `css:canary` does                       |
| Coverage ratchet                                 | Coverage cannot drop below the last measured level                                     | That the assertions are meaningful                                                            |
| The app's `ui-kit-smoke.test.tsx`                | The pinned tag exports everything the app imports                                      | Anything about tags the app does not pin                                                      |

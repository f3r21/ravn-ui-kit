Run `npm run gate` in the repo root — it chains `typecheck`, `lint`, `format:check` and `coverage`.

If any step fails, read the actual error output, find the root cause in the source, and fix it there. Do not lower a coverage threshold to get green: `vitest.config.ts` pins them as a ratchet and `CONTRIBUTING.md` says to raise them when you add tests, never lower them.

After the gate passes, run `npm run build` and `npm run build:storybook` too if you touched anything that ships — CI runs both, and the Storybook build catches story and MDX errors the unit tests cannot.

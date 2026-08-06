import { getStoryContext, type TestRunnerConfig } from '@storybook/test-runner';
import { configureAxe, getAxeResults, injectAxe } from 'axe-playwright';
import { A11Y_ALLOWLIST, type A11yAllowlistEntry } from './a11y-allowlist';

/**
 * Runs axe over every story in a real Chromium, and fails the build on any finding that is
 * not recorded in `a11y-allowlist.ts`.
 *
 * `@storybook/addon-a11y` has been installed and registered for a while, but it only paints
 * violations in the Storybook UI — nothing in CI ever executed a story in a browser, so the
 * kit's accessibility state was held by whoever last ran the sweep by hand.
 * `src/styles/contrast.test.ts` is the other half of this and does something this cannot:
 * it checks tokens against each other, including pairings no story renders (hover fills,
 * placeholders, surfaces a component may be dropped onto). What it cannot see is what two
 * individually-fine tokens compose into once a component is actually painted. Keep both.
 *
 * ## Reading a failure
 *
 * If *every* story fails, do not read the count — read the first message. A runner that
 * cannot reach the served Storybook, or that is pointed at the wrong URL, fails identically
 * to a wall of real violations. The `#storybook-root` check below exists to make that case
 * say so in words instead of being inferred.
 *
 * Note also that `npm run gate` does not typecheck this file by default: `tsconfig.json`
 * has `include: ["src"]`. `tsconfig.tooling.json` was added so that it does — if you split
 * this file, add it there too.
 */

type AxeResults = Awaited<ReturnType<typeof getAxeResults>>;
type AxeResult = AxeResults['violations'][number];

/** The element `@storybook/addon-a11y` scopes to by default; `parameters.a11y.element` wins. */
const STORY_ROOT = '#storybook-root';

type Bucket = keyof A11yAllowlistEntry;

function ruleIds(results: readonly AxeResult[]): string[] {
  return [...new Set(results.map((r) => r.id))].sort();
}

function describeRule(bucket: Bucket, results: readonly AxeResult[], ruleId: string): string {
  const rule = results.find((r) => r.id === ruleId);
  if (!rule) return `  ${bucket}  ${ruleId}`;

  const nodes = rule.nodes
    .slice(0, 3)
    .map((node) => `      ${node.target.join(' ')}\n      ${node.html.replace(/\s+/g, ' ')}`)
    .join('\n');
  const more = rule.nodes.length > 3 ? `\n      ...and ${rule.nodes.length - 3} more` : '';

  return [
    `  ${bucket}  ${ruleId}  (${rule.impact ?? 'unknown impact'}, ${rule.nodes.length} node${
      rule.nodes.length === 1 ? '' : 's'
    })`,
    `      ${rule.help}`,
    nodes + more,
  ].join('\n');
}

/** Renders the allowlist line that would accept everything this story currently reports. */
function suggestEntry(storyId: string, observed: Record<Bucket, string[]>): string {
  const fields = (['violations', 'incomplete'] as const)
    .filter((bucket) => observed[bucket].length > 0)
    .map((bucket) => `${bucket}: [${observed[bucket].map((id) => `'${id}'`).join(', ')}]`)
    .join(', ');
  return `  '${storyId}': { ${fields} },`;
}

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },

  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);
    const a11y = storyContext.parameters?.a11y;
    if (a11y?.disable) return;

    const root: string = a11y?.element ?? STORY_ROOT;
    if ((await page.locator(root).count()) === 0) {
      throw new Error(
        `Wiring failure, not an accessibility failure: no \`${root}\` on the page for story ` +
          `"${context.id}". The runner reached a document but not a rendered Storybook — check ` +
          `--url, and check that \`npm run build:storybook\` produced the build being served. ` +
          `Every story will report this; fix the runner, not the components.`,
      );
    }

    await configureAxe(page, a11y?.config);
    const results = await getAxeResults(page, root, a11y?.options);

    const observed: Record<Bucket, string[]> = {
      violations: ruleIds(results.violations),
      incomplete: ruleIds(results.incomplete),
    };
    const allowed = A11Y_ALLOWLIST[context.id];

    const added: string[] = [];
    const removed: string[] = [];
    for (const bucket of ['violations', 'incomplete'] as const) {
      const permitted = allowed?.[bucket] ?? [];
      for (const ruleId of observed[bucket]) {
        if (!permitted.includes(ruleId)) added.push(describeRule(bucket, results[bucket], ruleId));
      }
      for (const ruleId of permitted) {
        if (!observed[bucket].includes(ruleId)) removed.push(`  ${bucket}  ${ruleId}`);
      }
    }

    if (added.length === 0 && removed.length === 0) return;

    const message = [`Accessibility ratchet broken by story "${context.id}".`, ''];
    if (added.length > 0) {
      message.push(
        'NEW — reported by axe, absent from .storybook/a11y-allowlist.ts:',
        ...added,
        '',
      );
    }
    if (removed.length > 0) {
      message.push(
        'GONE — allowlisted but no longer reported. Delete these so the finding cannot',
        'come back unnoticed; the allowlist only ever shrinks on its own:',
        ...removed,
        '',
      );
    }
    message.push(
      'Fix the finding, or accept it with a written reason in .storybook/a11y-allowlist.ts:',
      suggestEntry(context.id, observed),
    );

    throw new Error(message.join('\n'));
  },
};

export default config;

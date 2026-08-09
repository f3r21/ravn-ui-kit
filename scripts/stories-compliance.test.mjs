import { describe, it, expect } from 'vitest';
import ts from 'typescript';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every `*.stories.tsx` must export a `Playground` whose initializer differs from every other
 * story in the file.
 *
 * ## The interpretation this encodes, and the one it rejects
 *
 * `CONTRIBUTING.md` said "`Default` and `Playground` — always", directly above a preamble saying
 * "don't force a story that has nothing real to show". Those disagree, and the repo owner ruled:
 *
 * > `Playground` is required everywhere — it has a function, exposing every control live. The
 * > canonical example may be `Default` or a descriptive name where that reads better.
 *
 * **So this asserts `Playground` exists and differs. It deliberately does NOT assert a story
 * named `Default`.** `app-shell` (`Dashboard`), `icons` (`AllIcons`) and `view-switcher`
 * (`LeftSelected`) are compliant, and a test demanding `Default` would have made three
 * deliberate namings into failures. A test freezes whichever reading it encodes, so the rejected
 * alternative is written here rather than left implicit.
 *
 * ## Why "differs" and not merely "exists"
 *
 * Seven files satisfied the letter with a `Playground` byte-identical to another story —
 * `menu.stories.tsx` had `export const Default: Story = {};` and
 * `export const Playground: Story = {};`, both empty. A Playground identical to the story beside
 * it exposes nothing; it is the rule being complied with rather than served.
 *
 * ## Why the comparison is against EVERY story, not against `Default`
 *
 * `top-nav.stories.tsx` is why. Its `Playground` differs from `Default` and is byte-identical to
 * `NoUser`, so a check comparing only against `Default` reports it compliant. That is not
 * hypothetical: it is the difference between the six files a Default-only probe found and the
 * seven that exist.
 *
 * ## Why an AST and not a regex
 *
 * A one-line body — `export const Default: Story = {};` — is exactly what an `awk` range over
 * `/^};/` never terminates on, so `menu.stories.tsx` read as having no stories at all and was
 * missed twice by a line-based probe. The parser has no such blind spot.
 */

const STORIES_ROOT = 'src';

function storyFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) storyFiles(p, out);
    else if (p.endsWith('.stories.tsx')) out.push(p);
  }
  return out;
}

/** Every `export const <Name> = <initializer>` in a file, as source text. */
export function exportedStories(source, fileName = 'x.stories.tsx') {
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true);
  const found = [];
  sf.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    if (!node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) return;
    for (const d of node.declarationList.declarations) {
      if (ts.isIdentifier(d.name) && d.initializer) {
        found.push({
          name: d.name.text,
          init: d.initializer.getText(sf).replace(/\s+/g, ' ').trim(),
        });
      }
    }
  });
  return found;
}

const files = storyFiles(STORIES_ROOT).sort();

describe('story conventions (CONTRIBUTING.md)', () => {
  it('finds the story files at all', () => {
    // Control. Every assertion below is over `files`, so an empty list would make all of them
    // pass vacuously — which is the failure mode this whole suite exists to catch elsewhere.
    expect(files.length).toBeGreaterThan(30);
  });

  it.each(files)('%s exports a Playground', (file) => {
    const names = exportedStories(readFileSync(file, 'utf8'), file).map((s) => s.name);
    expect(names).toContain('Playground');
  });

  it.each(files)('%s: Playground differs from every other story', (file) => {
    const stories = exportedStories(readFileSync(file, 'utf8'), file);
    const playground = stories.find((s) => s.name === 'Playground');
    if (!playground) return; // reported by the case above; not double-counted here
    const twins = stories.filter((s) => s.name !== 'Playground' && s.init === playground.init);
    expect(twins.map((t) => t.name)).toEqual([]);
  });
});

describe('the parser sees what a line-based probe misses', () => {
  /**
   * The regression pin for the probe itself. This exact shape — a story whose whole body is on
   * one line — is what made `menu.stories.tsx` invisible to an `awk` range twice.
   */
  it('reads stories whose body is a single line', () => {
    const src = `
export const Default: Story = {};
export const Playground: Story = { args: { a: 1 } };
`;
    expect(exportedStories(src)).toEqual([
      { name: 'Default', init: '{}' },
      { name: 'Playground', init: '{ args: { a: 1 } }' },
    ]);
  });

  it('does not mistake the default-exported meta for a story', () => {
    // `const meta` is not exported and `export default meta` is not a variable statement.
    const src = `
const meta: Meta<typeof X> = { title: 'X' };
export default meta;
export const Playground: Story = {};
`;
    expect(exportedStories(src).map((s) => s.name)).toEqual(['Playground']);
  });

  it('control: it does report a twin when there is one', () => {
    const src = `
export const Default: Story = { args: {} };
export const Playground: Story = { args: {} };
`;
    const stories = exportedStories(src);
    const pg = stories.find((s) => s.name === 'Playground');
    expect(stories.filter((s) => s.name !== 'Playground' && s.init === pg.init)).toHaveLength(1);
  });
});

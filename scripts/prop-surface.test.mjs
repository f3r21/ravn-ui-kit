import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { measure, isIconFile } from './prop-surface.mjs';
import { analyze, unfollowableImports } from './consumer-prop-usage.mjs';

/**
 * These two scripts exist to produce figures that go into issues, and a figure is trusted in
 * proportion to the instrument behind it. An instrument that silently reports zero is the exact
 * failure this repo has already paid for twice — `.claude/hooks/` shipped inert for a release,
 * and a line-based story probe reported six files where seven were broken. Both exited 0.
 *
 * So every count below is paired with a control that fails if the measurement stops reading, and
 * the classifier is checked in both directions rather than only the one that happens to hold.
 */

// Building a TypeScript Program with a checker over `src/` takes ~1s cold, and this file does it
// once. The suite's default is 5000ms and #63 measured five tests hitting that under parallel
// load, so this gets an explicit allowance rather than sitting just under the default.
const TIMEOUT = 30_000;

describe('prop-surface: the kit measures its own public surface', () => {
  /** @type {ReturnType<typeof measure>} */
  let result;
  beforeAll(() => {
    result = measure(process.cwd());
  }, TIMEOUT);

  it('reads the surface at all', () => {
    // The control. Every assertion below is over `result`, so an empty program would let them
    // all pass vacuously. These floors are deliberately far below the real figures — this asserts
    // that the checker resolved something, not what the current numbers are. The numbers move
    // every time a prop lands; pinning them here would make this file a second source competing
    // with the instrument, which is what `CLAUDE.md` forbids.
    expect(result.totals.components).toBeGreaterThan(30);
    expect(result.totals.declaredProps).toBeGreaterThan(100);
    expect(result.totals.inheritedProps).toBeGreaterThan(100);
  });

  it('every prop it calls "declared" is declared in src/', () => {
    const strays = result.components
      .flatMap((c) => c.declared.map((p) => ({ c: c.name, ...p })))
      .filter((p) => !p.from?.startsWith('src' + '/'));
    expect(strays).toEqual([]);
  });

  it('every prop it calls "inherited" comes from node_modules', () => {
    const strays = result.components
      .flatMap((c) => c.inherited.map((p) => ({ c: c.name, ...p })))
      .filter((p) => !p.from?.includes('node_modules'));
    expect(strays).toEqual([]);
  });

  it('both branches of the classifier are live', () => {
    // Without this, the two assertions above both pass if the classifier collapsed and put
    // everything into one bucket — the emptier bucket would simply have nothing to violate it.
    const nonIcon = result.components.filter((c) => !isIconFile(c.file));
    expect(nonIcon.some((c) => c.inherited.length === 0)).toBe(true);
    expect(nonIcon.some((c) => c.inherited.length > 0)).toBe(true);
  });

  it('Button declares `variant` and inherits `onPress`', () => {
    // The sharpest single case, and it is tied to the record rather than invented: CHANGELOG's
    // v0.5.x entry reports Storybook's `propFilter` hiding exactly `onPress`, `isDisabled`,
    // `autoFocus` and `excludeFromTabOrder` on `Button` because they resolve out of
    // node_modules, while listing `variant` because it does not. If the classifier ever
    // inverted, this single test flips in both directions at once.
    const button = result.components.find((c) => c.name === 'Button');
    expect(button.declared.map((p) => p.name)).toContain('variant');
    expect(button.inherited.map((p) => p.name)).toContain('onPress');
  });

  it('Tag inherits nothing — it extends no external interface', () => {
    // Button's counterpart. `TagProps` is a bare interface, so a classifier that marked
    // everything "inherited" fails here while Button's case above still passes.
    const tag = result.components.find((c) => c.name === 'Tag');
    expect(tag.inherited).toEqual([]);
    expect(tag.declared.map((p) => p.name)).toContain('variant');
  });

  it('a compound sub-component carries the dotted name a consumer renders', () => {
    // `card.tsx:120-122` does `Card.Header = CardHeader`, so a consumer's source says
    // `<Card.Header>` while this script's export name is `CardHeader`. Joining the two is
    // exact-match, so without the dotted alias the sub-component reads as never imported and its
    // props as never passed — an undercount biased toward "unused", which is the one direction
    // this instrument must not lean, because that is the direction #129's argument runs.
    const header = result.components.find((c) => c.name === 'CardHeader');
    expect(header.names).toContain('CardHeader');
    expect(header.names).toContain('Card.Header');
    // The parent is not a sub-component of anything and must not acquire a dotted name.
    expect(result.components.find((c) => c.name === 'Card').names).toEqual(['Card']);
  });

  it('control: a plain component gets exactly one name', () => {
    // Without this, `names` could be built by appending a dotted form to everything and the case
    // above would still pass.
    expect(result.components.find((c) => c.name === 'Tag').names).toEqual(['Tag']);
  });

  it('no component in this kit has a shape that would make the count silently low', () => {
    // `propsTypeOf` reads `getCallSignatures()[0]`, so a second overload's props are ignored; and
    // `getPropertiesOfType` on a union returns only the properties common to every member, so a
    // discriminated-union props type drops every variant-specific prop. Both are ordinary React
    // patterns that could arrive without anyone thinking about this script, and both fail
    // *quietly* and *low* — the direction that flatters #129's "unused" reading.
    //
    // Probed rather than read: this was raised as an unproven assumption and closing it by eye
    // would leave it unproven the next time someone adds a component.
    const overloaded = result.components.filter((c) => c.shape.signatures > 1).map((c) => c.name);
    const unions = result.components.filter((c) => c.shape.propsIsUnion).map((c) => c.name);
    expect(overloaded).toEqual([]);
    expect(unions).toEqual([]);
    // Control: the shape data is actually populated, so the two assertions above are not passing
    // because `shape` is undefined everywhere.
    expect(result.components.every((c) => c.shape.signatures >= 1)).toBe(true);
  });

  it('icons are counted apart from the components', () => {
    // Each icon takes `React.SVGProps<SVGSVGElement>` and inherits hundreds of props. Folding
    // 20 copies of one decision into the headline total is what this split exists to prevent,
    // so assert the split holds rather than trusting it.
    expect(result.totals.iconComponents).toBeGreaterThan(10);
    expect(result.totals.iconInheritedProps).toBeGreaterThan(result.totals.inheritedProps);
    expect(result.components.filter((c) => isIconFile(c.file)).length).toBe(
      result.totals.iconComponents,
    );
  });
});

describe('the shape probe detects the shapes, rather than reporting none', () => {
  /**
   * The assertion above says the kit has no overloaded or union-props component. On its own that
   * is **unfalsifiable**: hardcode `signatures: 1, propsIsUnion: false` and it stays green, and so
   * does its `signatures >= 1` control, because `1 >= 1`. A check that returns a plausible answer
   * without consulting anything is indistinguishable from one that works — the same defect this
   * whole instrument exists to argue about, and the reason the corpus needs a synthetic case: the
   * kit contains neither shape, so only a fixture can prove the probe can see them.
   */
  let fx;
  let result;
  beforeAll(() => {
    fx = mkdtempSync(join(tmpdir(), 'kit-shapes-'));
    mkdirSync(join(fx, 'src'), { recursive: true });
    writeFileSync(
      join(fx, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'bundler',
          strict: true,
          noEmit: true,
          types: [],
        },
        include: ['src'],
      }),
    );
    // No React import — `isComponent` keys off the return type's *name*, so a local `Element`
    // satisfies it and the fixture needs no dependency tree of its own.
    writeFileSync(
      join(fx, 'src', 'index.ts'),
      `type Element = { __element: true };
       export function Plain(p: { a?: string }): Element { return p as unknown as Element; }
       export function Overloaded(p: { x?: string }): Element;
       export function Overloaded(p: { y?: number }): Element;
       export function Overloaded(p: { x?: string } | { y?: number }): Element { return p as unknown as Element; }
       type UnionProps = { kind: 'a'; a: string } | { kind: 'b'; b: number };
       export function UnionPropped(p: UnionProps): Element { return p as unknown as Element; }`,
    );
    result = measure(fx);
  }, TIMEOUT);
  afterAll(() => rmSync(fx, { recursive: true, force: true }));

  const find = (n) => result.components.find((c) => c.name === n);

  it('detects a component with two call signatures', () => {
    expect(find('Overloaded').shape.signatures).toBe(2);
  });

  it('detects a union props type', () => {
    expect(find('UnionPropped').shape.propsIsUnion).toBe(true);
  });

  it('control: a plain component trips neither', () => {
    // Without this the two above pass against a probe that reports every component as overloaded
    // and union-typed — which would fail the kit's real assertion, but loudly and for the wrong
    // reason. This pins that the probe discriminates.
    expect(find('Plain').shape).toEqual({ signatures: 1, propsIsUnion: false });
  });

  it('shows why the shapes matter: a union props type really does undercount', () => {
    // The reason the kit-level assertion exists at all. `UnionProps` has three properties across
    // its two members — `kind`, `a`, `b` — and `getPropertiesOfType` on a union returns only the
    // ones common to every member. So the surface reads **1** where the component accepts 3, and
    // it reads it silently and low. This is the failure the probe is guarding against, measured
    // rather than described.
    const declared = find('UnionPropped').declared.map((p) => p.name);
    expect(declared).toEqual(['kind']);
    expect(declared).not.toContain('a');
    expect(declared).not.toContain('b');
  });
});

describe('consumer-prop-usage: what a consumer actually passes', () => {
  let app;
  beforeAll(() => {
    app = mkdtempSync(join(tmpdir(), 'kit-consumer-'));
    mkdirSync(join(app, 'src', 'nested'), { recursive: true });
    writeFileSync(
      join(app, 'src', 'page.tsx'),
      `import { Button, Menu, Tag as Chip } from '@ravn/ui-kit';
       import { Button as Other } from 'some-other-package';
       export const Page = () => (
         <>
           <Button variant="primary" onPress={go} />
           <Menu label="x"><Menu.Item id="a" /></Menu>
           <Chip outline />
           <Other fromAnotherPackage />
         </>
       );`,
    );
    writeFileSync(
      join(app, 'src', 'nested', 'spread.tsx'),
      `import { Avatar, Skeleton } from '@ravn/ui-kit';
       export const A = (p) => <Avatar {...p} size="md" />;`,
    );
    writeFileSync(
      join(app, 'src', 'types-only.tsx'),
      `import type { AccentColor } from '@ravn/ui-kit';
       import { type DueDateUrgency, Badge } from '@ravn/ui-kit';
       export const t = (c: AccentColor, d: DueDateUrgency) => <Badge tone="x" />;`,
    );
  });
  afterAll(() => rmSync(app, { recursive: true, force: true }));

  it('records the props passed to each kit component', () => {
    const rows = Object.fromEntries(analyze(app).map((r) => [r.name, r.props]));
    expect(rows.Button).toEqual(['onPress', 'variant']);
    expect(rows.Avatar).toEqual(['size', '…spread']);
  });

  it('resolves an alias back to the kit’s own export name', () => {
    // `import { Tag as Chip }` must be reported as `Tag`, or the result cannot be joined against
    // the prop surface at all — which is the only thing this script's output is used for.
    const rows = analyze(app);
    expect(rows.map((r) => r.name)).toContain('Tag');
    expect(rows.map((r) => r.name)).not.toContain('Chip');
    expect(rows.find((r) => r.name === 'Tag').props).toEqual(['outline']);
  });

  it('records a compound component under its own key', () => {
    const rows = Object.fromEntries(analyze(app).map((r) => [r.name, r.props]));
    expect(rows['Menu.Item']).toEqual(['id']);
    expect(rows.Menu).toEqual(['label']);
  });

  it('counts an imported-but-never-rendered export, with no props', () => {
    // `Skeleton` is imported and never used. It has to appear — "imported 31 components" and
    // "passes 70 props" are two different figures and the first must not silently shrink.
    const rows = Object.fromEntries(analyze(app).map((r) => [r.name, r.props]));
    expect(rows.Skeleton).toEqual([]);
  });

  it('ignores identically-named imports from other packages', () => {
    // `import { Button as Other } from 'some-other-package'` renders `<Other fromAnotherPackage />`.
    // If the package filter came off, `Other` would resolve to the kit's `Button` and that prop
    // would land on it, inflating every usage figure with nothing to say so.
    //
    // The prop is named `fromAnotherPackage` rather than given a kit prop name on purpose. The
    // first version of this test wrote `<Other variant="ignored" />` and asserted `Button` did
    // not carry `'ignored'` — but `'ignored'` is the attribute's *value* and `variant` its name,
    // so the assertion tested for a string the script never emits. It passed with the filter
    // deleted. A control has to be aimed at something the sabotage actually moves.
    const rows = Object.fromEntries(analyze(app).map((r) => [r.name, r.props]));
    expect(rows.Button).toEqual(['onPress', 'variant']);
    expect(Object.values(rows).flat()).not.toContain('fromAnotherPackage');
  });

  it('skips type-only imports — a type cannot receive a prop', () => {
    // Both spellings. Counting `import type { AccentColor }` as an imported component overstates
    // how much of the kit the app renders: the measured app imports 31 names of which 5 are types.
    const names = analyze(app).map((r) => r.name);
    expect(names).not.toContain('AccentColor'); // `import type { X }`
    expect(names).not.toContain('DueDateUrgency'); // `import { type X }`
    // Control: the value import sitting in the same statement as the inline type import survives,
    // so this is skipping type bindings rather than skipping the statement.
    expect(names).toContain('Badge');
  });

  it('reports a namespace or default import instead of silently ignoring it', () => {
    // `import * as Kit` makes every `<Kit.Button>` invisible, and invisible in the same direction
    // as every other gap here — toward "unused". Following it needs a type checker, which this
    // script deliberately does not use, so the blind spot is made loud rather than closed.
    const ns = mkdtempSync(join(tmpdir(), 'kit-consumer-ns-'));
    mkdirSync(join(ns, 'src'), { recursive: true });
    writeFileSync(
      join(ns, 'src', 'n.tsx'),
      `import * as Kit from '@ravn/ui-kit';
       export const N = () => <Kit.Button variant="primary" />;`,
    );
    try {
      expect(analyze(ns)).toEqual([]); // it genuinely cannot see it...
      const hits = unfollowableImports(ns); // ...and says so
      expect(hits).toHaveLength(1);
      expect(hits[0]).toMatchObject({ kind: 'namespace', local: 'Kit' });
    } finally {
      rmSync(ns, { recursive: true, force: true });
    }
  });

  it('control: named imports raise no unfollowable warning', () => {
    // Otherwise the check above passes on a function that flags every file.
    expect(unfollowableImports(app)).toEqual([]);
  });

  it('does not warn on a type-only namespace import', () => {
    // Found by running the warning against the real app: its only `import * as` is
    // `import type * as UiKit` in `board-render-cost.test.tsx`, feeding
    // `importOriginal<typeof UiKit>()`. That renders nothing and passes no props, so flagging it
    // makes the warning wrong on the single instance in the corpus — and a warning that is wrong
    // the one time it fires is worse than no warning.
    const t = mkdtempSync(join(tmpdir(), 'kit-consumer-tns-'));
    mkdirSync(join(t, 'src'), { recursive: true });
    writeFileSync(
      join(t, 'src', 't.ts'),
      `import type * as Kit from '@ravn/ui-kit';
       export type P = Kit.TagProps;`,
    );
    try {
      expect(unfollowableImports(t)).toEqual([]);
    } finally {
      rmSync(t, { recursive: true, force: true });
    }
  });

  it('the CLI warns in --json mode, which is the mode every join calls', () => {
    // The warning first shipped inside the human-readable branch, so it appeared everywhere
    // except the one mode whose numbers get quoted in an issue. Driven through the CLI rather
    // than through `unfollowableImports()` directly, because the defect was the *placement*, not
    // the detection — a unit test on the function passes either way.
    const ns = mkdtempSync(join(tmpdir(), 'kit-consumer-cli-'));
    mkdirSync(join(ns, 'src'), { recursive: true });
    writeFileSync(
      join(ns, 'src', 'n.tsx'),
      `import * as Kit from '@ravn/ui-kit';
       export const N = () => <Kit.Button />;`,
    );
    try {
      const r = spawnSync('node', ['scripts/consumer-prop-usage.mjs', ns, '--json'], {
        encoding: 'utf8',
      });
      expect(r.status).toBe(0);
      expect(r.stderr).toMatch(/WARNING: namespace import `Kit`/);
      // stdout stays parseable — the warning must not corrupt the JSON a join reads.
      expect(() => JSON.parse(r.stdout)).not.toThrow();
    } finally {
      rmSync(ns, { recursive: true, force: true });
    }
  });

  it('control: reports nothing for a tree that imports no kit', () => {
    const bare = mkdtempSync(join(tmpdir(), 'kit-consumer-bare-'));
    mkdirSync(join(bare, 'src'), { recursive: true });
    writeFileSync(join(bare, 'src', 'x.tsx'), `export const X = () => <div className="a" />;`);
    try {
      expect(analyze(bare)).toEqual([]);
    } finally {
      rmSync(bare, { recursive: true, force: true });
    }
  });
});

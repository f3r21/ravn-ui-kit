#!/usr/bin/env node
/**
 * kit#20's verification technique: render every Storybook story twice — once as the running
 * machine naturally resolves `--font-sans` ('SF Pro Display', system-ui, sans-serif; on macOS
 * `system-ui` rescues it to San Francisco), once with `--font-sans` forced to a substitute
 * font via an injected `@font-face`, reproducing what a machine with none of those three
 * installed falls through to. Reports any element whose own `scrollWidth` exceeds its
 * `clientWidth` under the substitute but not under the baseline — a real, currently
 * invisible layout overflow, not a cosmetic width difference between two acceptable renders.
 *
 * Usage: build and serve Storybook first, then
 *   node scripts/font-fallback-sweep.mjs <storybook-url> <regular.ttf> <bold.ttf>
 *
 * `<regular.ttf>`/`<bold.ttf>` are not shipped in this repo — pass paths to a wider,
 * freely-licensed sans-serif (DejaVu Sans is what a Linux runner's own `sans-serif` fallback
 * resolves to, per this issue's own account, and is not currently pinned to a fixed path
 * here because that path was not independently confirmed on this repo's actual CI image;
 * confirm it before wiring this into a workflow rather than assuming a distro's default).
 *
 * Exit code is non-zero when any story shows a new overflow, so this can gate a workflow
 * once the font path above is confirmed.
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const [, , baseUrl, regularPath, boldPath] = process.argv;
if (!baseUrl || !regularPath || !boldPath) {
  console.error('usage: node font-fallback-sweep.mjs <storybook-url> <regular.ttf> <bold.ttf>');
  process.exit(1);
}

const regularB64 = readFileSync(regularPath).toString('base64');
const boldB64 = readFileSync(boldPath).toString('base64');

const FONT_OVERRIDE_CSS = `
  @font-face {
    font-family: 'kit-font-sweep-substitute';
    src: url(data:font/ttf;base64,${regularB64}) format('truetype');
    font-weight: 400;
  }
  @font-face {
    font-family: 'kit-font-sweep-substitute';
    src: url(data:font/ttf;base64,${boldB64}) format('truetype');
    font-weight: 600 700;
  }
  :root { --font-sans: 'kit-font-sweep-substitute', sans-serif !important; }
`;

// Per-element rather than page-level: a wider page (e.g. a deliberately scrollable table
// story) is not a defect, but a fixed-width box whose own content no longer fits inside it
// is exactly the failure class this issue names.
const OVERFLOW_PROBE = `
  Array.from(document.querySelectorAll('*')).reduce((acc, el) => {
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      acc.push({
        tag: el.tagName,
        cls: (el.className || '').toString().slice(0, 120),
        text: (el.textContent || '').trim().slice(0, 60),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      });
    }
    return acc;
  }, [])
`;

async function main() {
  const browser = await chromium.launch();
  const indexRes = await fetch(`${baseUrl}/index.json`);
  const index = await indexRes.json();
  const stories = Object.values(index.entries ?? index.stories ?? {}).filter(
    (e) => e.type === 'story',
  );

  console.log(`Sweeping ${stories.length} stories`);

  const findings = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const story of stories) {
    const url = `${baseUrl}/iframe.html?id=${story.id}&viewMode=story`;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(150);
      const baselineOverflow = await page.evaluate(OVERFLOW_PROBE);

      await page.addStyleTag({ content: FONT_OVERRIDE_CSS });
      await page.evaluate(async () => {
        // Runs inside the Playwright-controlled page, not this Node process — `document`
        // is real there, just not a global this file's own (Node) ESLint environment knows.
        // eslint-disable-next-line no-undef
        await document.fonts.ready;
      });
      await page.waitForTimeout(150);
      const substituteOverflow = await page.evaluate(OVERFLOW_PROBE);

      const baselineKeys = new Set(baselineOverflow.map((o) => `${o.tag}|${o.cls}|${o.text}`));
      const newOverflows = substituteOverflow.filter(
        (o) => !baselineKeys.has(`${o.tag}|${o.cls}|${o.text}`),
      );

      if (newOverflows.length > 0) {
        findings.push({ id: story.id, title: story.title, name: story.name, newOverflows });
      }
    } catch (err) {
      console.error(`ERROR on ${story.id}: ${err.message}`);
    }
  }

  await browser.close();

  console.log(`\n${findings.length} / ${stories.length} stories show a new overflow\n`);
  for (const f of findings) {
    console.log(`${f.id} (${f.title} > ${f.name})`);
    for (const o of f.newOverflows) {
      console.log(
        `  <${o.tag} class="${o.cls}"> "${o.text}" scrollWidth=${o.scrollWidth} clientWidth=${o.clientWidth}`,
      );
    }
  }

  process.exit(findings.length > 0 ? 1 : 0);
}

main();

// axe-core (WCAG 2 A/AA, 2.1, 2.2 AA) + keyboard selection check on the A2 media pages.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';
import { server } from './serve.mjs';
const require = createRequire(import.meta.url);
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4432;
await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const out = { axe: [], keyboard: null };
for (const url of ['/today-ready.html', '/studio.html', '/studio.html?select=rd1', '/studio.html?feed=specimen', '/media-specimens.html', '/today-ready.html?study=narrow']) {
  const narrow = url.includes('narrow');
  const ctx = await browser.newContext({ viewport: narrow ? { width: 390, height: 844 } : { width: 1440, height: 900 }, hasTouch: narrow, isMobile: narrow });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}${url}`, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: AXE });
  const r = await page.evaluate(async () => { const x = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } }); return x.violations.map(v => `${v.id} (${v.impact}) ×${v.nodes.length}: ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')}`); });
  const names = await page.evaluate(() => [...document.querySelectorAll('.vg-card[data-key]')].map(c => c.innerText.replace(/\s+/g, ' ').slice(0, 30) + ' … ' + (c.querySelector('.vg-visually-hidden')?.textContent || '')));
  out.axe.push({ url, violations: r, cardNames: names });
  await ctx.close();
}
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(`http://127.0.0.1:${PORT}/studio.html`, { waitUntil: 'networkidle' });
await page.focus('.vg-card[data-key="rd1"]'); await page.keyboard.press('Enter');
out.keyboard = { selected: await page.getAttribute('.vg-card[data-key="rd1"]', 'aria-pressed'), inspectImageAlt: await page.getAttribute('#context-panel .vg-media--inspect img', 'alt'), trust: await page.textContent('#context-panel .vg-trust') };
await browser.close(); server.close();
fs.writeFileSync(path.resolve(here, '../validation/a2-1-results.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));

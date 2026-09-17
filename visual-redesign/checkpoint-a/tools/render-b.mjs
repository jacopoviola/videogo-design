// Canonical Checkpoint B renders (Instrument Sans, locked tokens).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { server } from './serve.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '../renders/b');
fs.mkdirSync(OUT, { recursive: true });
const PORT = 4440;
await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const only = process.argv[2];
const SHOTS = [
  ['B1_knowledge_1440', '/knowledge.html', 1440, 900],
  ['B2_knowledge_1216', '/knowledge.html', 1216, 1050],
  ['B3_account-settings_1440', '/account.html', 1440, 900, true],
  ['B4_account-settings_1216', '/account.html', 1216, 1050, true],
  ['B5_loading_making_1440', '/making.html', 1440, 900],
  ['B6_empty_week-one_1440', '/week-one.html', 1440, 900],
  ['B7_qa-deferred_first-video-deferred_1440', '/first-video-deferred.html', 1440, 900],
];
const log = [];
for (const [name, url, w, h, full] of SHOTS) {
  if (only && !name.includes(only)) continue;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}${url}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  const facts = await page.evaluate(() => ({
    fontFaces: [...document.fonts].map(f => `${f.family} ${f.status}`),
    brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).length,
    horizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    commentary: /never a recommendation|fake likes|machinery stays internal|Dimmed slots|not part of the main navigation|Day one, after payment|shown here when supported|\(Prototype\)/i.test(document.body.innerText),
  }));
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: !!full });
  log.push({ name, url, viewport: `${w}×${h}`, ...facts });
  await ctx.close();
}
await browser.close(); server.close();
if (!only) fs.writeFileSync(path.join(OUT, 'B_RENDER_LOG.json'), JSON.stringify(log, null, 2));
log.forEach(l => console.log(l.name, JSON.stringify({ f: l.fontFaces, b: l.brokenImages, hs: l.horizontalScroll, c: l.commentary })));

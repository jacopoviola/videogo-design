// Checkpoint A2 renders (system-ui, page title 32/38 v0.1 token held; media is the variable under review).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { server } from './serve.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '../renders/a2');
fs.mkdirSync(OUT, { recursive: true });
const PORT = 4431;
await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const SHOTS = [
  ['A2-1_today-ready-media_1440', '/today-ready.html', 1440, 900],
  ['A2-2_studio-populated-media_1440', '/studio.html?media=fixtures', 1440, 900],
  ['A2-3_studio-selected-media-detail_1440', '/studio.html?media=fixtures&select=rd1', 1440, 900],
  ['A2-4_studio-media-absent-fallback_1440', '/studio.html', 1440, 900],
  ['A2-5_media-component-specimens', '/media-specimens.html', 1440, 900, true],
  ['A2-6_today-ready-media_1216', '/today-ready.html', 1216, 1050],
  ['A2-7_studio-selected-media-detail_1216', '/studio.html?media=fixtures&select=rd1', 1216, 1050],
];
const log = [];
for (const [name, url, w, h, full] of SHOTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}${url}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  const facts = await page.evaluate(() => ({
    brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.getAttribute('src')),
    horizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    cards: [...document.querySelectorAll('.vg-card[data-key]')].map(c => { const r = c.getBoundingClientRect(); const m = c.querySelector('.vg-media--card'); return { key: c.dataset.key, width: Math.round(r.width), crop: m ? m.dataset.crop : 'absent', media: m ? `${Math.round(m.getBoundingClientRect().width)}×${Math.round(m.getBoundingClientRect().height)}` : null }; }),
    actionsBottom: (() => { const a = document.querySelector('#context-panel .vg-actions, .vg-object .vg-actions'); return a ? Math.round(a.getBoundingClientRect().bottom) : null; })(),
    trustBottom: (() => { const t = [...document.querySelectorAll('.vg-trust')].pop(); return t ? Math.round(t.getBoundingClientRect().bottom) : null; })(),
    fixtureLabels: document.querySelectorAll('.vg-media__prov, .vg-media-facts__fixture').length,
    fixtureImages: [...document.images].filter(i => /assets\/media\/fixture_/.test(i.getAttribute('src'))).length,
    playControls: document.querySelectorAll('video, [aria-label*="play" i], .play').length,
  }));
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: !!full });
  log.push({ name, url, viewport: `${w}×${h}`, ...facts });
  await ctx.close();
}
await browser.close(); server.close();
fs.writeFileSync(path.join(OUT, 'A2_RENDER_LOG.json'), JSON.stringify(log, null, 2));
console.log(JSON.stringify(log, null, 1));

// Checkpoint A2.1 renders: Instrument Sans locked typography + approved media system.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { server } from './serve.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '../renders/a2-1');
fs.mkdirSync(OUT, { recursive: true });
const PORT = 4434;
await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const SHOTS = [
  ['A21-1_today-ready-media_1440', '/today-ready.html', 1440, 900],
  ['A21-2_today-ready-media_1216', '/today-ready.html', 1216, 1050],
  ['A21-3_studio-populated-media_1440', '/studio.html', 1440, 900],
  ['A21-4_studio-selected-detail_1440', '/studio.html?select=rd1', 1440, 900],
  ['A21-5_studio-selected-detail-below_1216', '/studio.html?select=rd1', 1216, 1050, { full: true }],
  ['A21-6_feed-specimen-populated', '/feed-specimen.html?mode=populated', 1440, 900, { clip: '.spec-panel', pad: 16 }],
  ['A21-12_feed-specimen-untimed-planned', '/feed-specimen.html?mode=untimed', 1440, 900, { clip: '.spec-panel', pad: 16 }],
  ['A21-7_feed-specimen-empty', '/feed-specimen.html?mode=empty', 1440, 900, { clip: '.spec-panel', pad: 16 }],
  ['A21-10_feed-specimen-partial-failure', '/feed-specimen.html?mode=partial', 1440, 900, { clip: '.spec-panel', pad: 16 }],
  ['A21-11_studio-feed-below_1216', '/studio.html', 1216, 1050, { full: true }],
  ['A21-8_media-states-specimen', '/media-specimens.html', 1440, 900, { clip: '#states', pad: 24 }],
  ['A21-9_media-component-sheet', '/media-specimens.html', 1440, 900, { full: true }],
];
const log = [];
for (const [name, url, w, h, opt = {}] of SHOTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}${url}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  const client = await ctx.newCDPSession(page);
  await client.send('DOM.enable'); await client.send('CSS.enable');
  const { root } = await client.send('DOM.getDocument', { depth: -1 });
  const fonts = new Set();
  for (const sel of ['h1', '.vg-card__title', '.vg-btn', '.vg-status', 'p']) {
    const { nodeId } = await client.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel });
    if (nodeId) (await client.send('CSS.getPlatformFontsForNode', { nodeId })).fonts.forEach(f => fonts.add(`${f.familyName}${f.isCustomFont ? ' [font file]' : ' [platform]'}`));
  }
  const facts = await page.evaluate(() => ({
    title: (() => { const t = document.querySelector('.vg-page-title'); if (!t) return null; const c = getComputedStyle(t); return `${c.fontSize}/${c.lineHeight} · ${c.fontWeight} · ${c.letterSpacing}`; })(),
    brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.getAttribute('src')),
    horizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    panelBelowBoard: (() => { const p = document.getElementById('context-panel'); return p ? !!p.closest('main') : null; })(),
    cards: [...document.querySelectorAll('.vg-card[data-key]')].map(c => { const r = c.getBoundingClientRect(); const m = c.querySelector('.vg-media'); return `${c.dataset.key}:${Math.round(r.width)}px:${m ? (m.dataset.crop || [...m.classList].find(x => /rendering|unavailable/.test(x)) || 'media') : 'absent'}`; }),
    demoFixtureLabels: [...document.querySelectorAll('.vg-media__prov, .vg-media-facts__fixture')].filter(e => e.textContent.trim() === 'Demo fixture').length,
    fixtureImages: [...document.images].filter(i => /fixture_/.test(i.getAttribute('src'))).length,
    playControls: document.querySelectorAll('video, audio, [aria-label*="play" i]').length,
    commentary: /never a recommendation|fake likes|machinery stays internal|Dimmed slots/i.test(document.body.innerText),
  }));
  const file = path.join(OUT, `${name}.png`);
  if (opt.clip) {
    const box = await page.$eval(opt.clip, el => {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: Math.min(r.height, 1800) };
    });
    const pad = opt.pad || 0;
    await page.screenshot({ path: file, clip: { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.width + 2 * pad, height: box.height + 2 * pad }, fullPage: true });
  } else await page.screenshot({ path: file, fullPage: !!opt.full });
  log.push({ name, url, viewport: `${w}×${h}`, renderedFonts: [...fonts], ...facts });
  await ctx.close();
}
await browser.close(); server.close();
fs.writeFileSync(path.join(OUT, 'A21_RENDER_LOG.json'), JSON.stringify(log, null, 2));
log.forEach(l => console.log(l.name, JSON.stringify({ f: l.renderedFonts, t: l.title, b: l.brokenImages.length, hs: l.horizontalScroll, below: l.panelBelowBoard, cards: l.cards, fx: [l.fixtureImages, l.demoFixtureLabels], play: l.playControls, commentary: l.commentary })));

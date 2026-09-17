// Produces the approval-board inputs: full screens, detail crops, rendered-font evidence and
// pixel-sampled state contrast. Output: renders/board/*.png + renders/board/board-data.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { server } from './serve.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '../renders/board');
fs.mkdirSync(OUT, { recursive: true });
const PORT = 4421;
await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const base = `http://127.0.0.1:${PORT}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const data = { chrome: browser.version(), platform: `${process.platform} ${process.arch}`, date: new Date().toISOString(), screens: {}, crops: {}, stateContrast: {} };

async function open(url, { width = 1440, height = 900 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  return { ctx, page };
}

async function renderedFonts(ctx, page) {
  const client = await ctx.newCDPSession(page);
  await client.send('DOM.enable'); await client.send('CSS.enable');
  const { root } = await client.send('DOM.getDocument', { depth: -1 });
  const out = {};
  for (const sel of ['.vg-page-title', '.vg-page-sub', '.vg-btn', '.vg-status']) {
    const { nodeId } = await client.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel });
    if (!nodeId) continue;
    const { fonts } = await client.send('CSS.getPlatformFontsForNode', { nodeId });
    out[sel] = fonts.map(f => `${f.familyName}${f.isCustomFont ? ' [loaded font file]' : ' [platform font]'}`);
  }
  return out;
}

// ---------- full screens (1440×900) ----------
const SCREENS = {
  today_system_44: '/today.html?title=44',
  today_instrument_44: '/today.html?title=44&font=instrument',
  studio_system_44: '/studio.html?select=rd1&title=44',
  studio_instrument_44: '/studio.html?select=rd1&title=44&font=instrument',
  today_system_32: '/today.html',
  today_instrument_32: '/today.html?font=instrument',
};
for (const [name, url] of Object.entries(SCREENS)) {
  const { ctx, page } = await open(url);
  const fonts = await renderedFonts(ctx, page);
  const title = await page.$eval('.vg-page-title', el => { const c = getComputedStyle(el); return `${c.fontSize}/${c.lineHeight} · ${c.fontWeight} · ${c.letterSpacing}`; });
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  data.screens[name] = { url, viewport: '1440×900', deviceScaleFactor: 2, title, fonts };
  await ctx.close();
}

// ---------- crops ----------
async function crop(name, url, selector, { pad = 16, prep, clipFn } = {}) {
  const { ctx, page } = await open(url);
  if (prep) await prep(page);
  const box = clipFn ? await clipFn(page) : await page.$eval(selector, el => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
  const clip = { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.width + pad * 2, height: box.height + pad * 2 };
  await page.screenshot({ path: path.join(OUT, `${name}.png`), clip });
  data.crops[name] = { url, clipCss: clip };
  await ctx.close();
  return { box, clip };
}

await crop('need_with_icon', '/today.html', '.vg-object');
await crop('need_without_icon', '/today.html?needicon=off', '.vg-object');
await crop('ready_authorization', '/studio.html?select=rd1', null, { pad: 8, clipFn: page => page.evaluate(() => {
  const p = document.querySelector('#context-panel').getBoundingClientRect();
  const a = document.querySelector('#context-panel .vg-actions').getBoundingClientRect();
  return { x: p.left + 1, y: p.top, width: p.width - 1, height: a.bottom - p.top + 4 };
}) });
await crop('nav_lockup', '/today.html', null, { pad: 0, clipFn: page => page.evaluate(() => {
  const r = document.querySelector('.vg-rail').getBoundingClientRect();
  const n = document.querySelector('.vg-nav').getBoundingClientRect();
  return { x: r.left, y: r.top, width: r.width, height: n.bottom - r.top + 24 };
}) });
await crop('no_still_40px', '/studio.html', '.vg-card[data-key="rd1"] .vg-card__media', { pad: 6 });

// Card states: same card (Ready), same page, one state each. Pixel sampling is done on the PNGs.
const cardSel = '.vg-card[data-key="rd1"]';
const cardDefault = await crop('card_default', '/studio.html', cardSel, { pad: 7 });
const cardSelected = await crop('card_selected', '/studio.html?select=rd1', cardSel, { pad: 7 });
const cardFocus = await crop('card_keyboard_focus', '/studio.html', cardSel, { pad: 7, prep: async page => {
  for (let i = 0; i < 20; i++) { await page.keyboard.press('Tab'); if (await page.evaluate(() => document.activeElement?.dataset?.key === 'rd1')) break; }
  data.crops.focusVisible = await page.evaluate(() => document.activeElement.matches(':focus-visible'));
} });
data.cardGeometry = { default: cardDefault, selected: cardSelected, focus: cardFocus };

await browser.close();
server.close();
fs.writeFileSync(path.join(OUT, 'board-data.json'), JSON.stringify(data, null, 2));
console.log(JSON.stringify({ screens: Object.fromEntries(Object.entries(data.screens).map(([k, v]) => [k, { title: v.title, fonts: v.fonts }])), focusVisible: data.crops.focusVisible }, null, 2));

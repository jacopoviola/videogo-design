// Renders the Checkpoint A screens with the locally installed Google Chrome (playwright-core, channel "chrome").
// Usage: node render.mjs [--only name]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { server } from './serve.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '../renders');
fs.mkdirSync(OUT, { recursive: true });

const PORT = 4418;
await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const base = `http://127.0.0.1:${PORT}`;

export const SHOTS = [
  // name, url, width, height, options
  ['A1_today-need_1440_title-token', '/today.html', 1440, 900],
  ['A2_today-need_1440_title-optical', '/today.html?title=optical', 1440, 900],
  ['A3_today-need_1216_title-token', '/today.html', 1216, 1050],
  ['A4_today-need_1216_title-optical', '/today.html?title=optical', 1216, 1050],
  ['B1_studio-default_1440', '/studio.html', 1440, 900],
  ['B2_studio-ready-selected_1440', '/studio.html?select=rd1', 1440, 900],
  ['B3_studio-default_1216', '/studio.html', 1216, 1050],
  ['B4_studio-ready-selected_1216', '/studio.html?select=rd1', 1216, 1050],
  ['B5_studio-ready-selected_1440_title-optical', '/studio.html?select=rd1&title=optical', 1440, 900],
  ['C1_narrow-study_today_390', '/today.html?study=narrow', 390, 844, { touch: true, fullPage: true }],
  ['C2_narrow-study_studio-ready-selected_390', '/studio.html?select=rd1&study=narrow', 390, 844, { touch: true, fullPage: true }],
];

const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const version = browser.version();
const log = [];
for (const [name, url, width, height, opt = {}] of SHOTS) {
  if (only && !name.includes(only)) continue;
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, hasTouch: !!opt.touch, isMobile: !!opt.touch });
  const page = await ctx.newPage();
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: !!opt.fullPage });
  log.push({ name, url, viewport: `${width}×${height}`, touch: !!opt.touch, file: path.relative(path.resolve(here, '..'), file) });
  await ctx.close();
}
await browser.close();
server.close();
fs.writeFileSync(path.join(OUT, 'RENDER_LOG.json'), JSON.stringify({ chrome: version, platform: process.platform, deviceScaleFactor: 2, shots: log }, null, 2));
console.log(`Chrome ${version}: ${log.length} renders`);

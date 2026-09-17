// Negative control for validate-responsive.mjs: the in-page detectors must FAIL known-bad layouts.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
import { server } from './serve.mjs';
const src = fs.readFileSync(new URL('./validate-responsive.mjs', import.meta.url), 'utf8');
const inst = src.slice(src.indexOf('const INSTALL = () => {') + 'const INSTALL = '.length, src.indexOf('\n};\n', src.indexOf('const INSTALL = () => {')) + 2);
await new Promise(r => server.listen(4481, '127.0.0.1', r));
const b = await chromium.launch({ channel: 'chrome' });
for (const [name, url, css, scroll] of [
  ['four compressed Studio columns @320', '/studio.html', '.vg-board{grid-template-columns:repeat(4,minmax(0,1fr)) !important} .vg-card__title{overflow-wrap:anywhere !important}'],
  ['sticky composer over cards @320', '/studio.html', '.vg-main__end{position:sticky;bottom:16px}', 900],
  ['tabular Upcoming @320', '/today.html', '.vg-schedule li{display:grid !important;grid-template-columns:6.5rem minmax(0,1fr) minmax(8rem,12rem) auto !important;grid-template-areas:none !important}'],
]) {
  const ctx = await b.newContext({ viewport: { width: 320, height: 640 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); await p.goto('http://127.0.0.1:4481' + url, { waitUntil: 'networkidle' }); await p.addStyleTag({ content: css }); await p.evaluate(`(${inst})()`);
  if (scroll) await p.evaluate(y => window.scrollTo(0, y), scroll);
  console.log(name, JSON.stringify(await p.evaluate(() => ({ midword: __midword().length, clipping: __clipping().length, overlap: __overlap().length, horizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth }))));
  await ctx.close();
}
await b.close(); server.close();

// Responsive composer study: renders + checks (full placeholder visible, bounded height, no horizontal scroll,
// touch targets, focus ring, axe). Output: renders/composer-study/*.png + validation/composer-study.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';
import { server } from './serve.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '../renders/composer-study'); fs.mkdirSync(OUT, { recursive: true });
const AXE = fs.readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const PORT = 4452; await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const CASES = [];
for (const variant of ['textarea', 'input']) {
  for (const [label, w, h, touch, text] of [['1440', 1440, 200, false, ''], ['1216', 1216, 200, false, ''], ['390-touch', 390, 360, true, ''], ['320-touch', 320, 400, true, ''], ['1440-text200', 1440, 400, false, '200']]) {
    for (const state of ['empty', 'long']) CASES.push({ variant, label, w, h, touch, text, state });
  }
}
const results = [];
for (const c of CASES) {
  const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, deviceScaleFactor: 2, hasTouch: c.touch, isMobile: c.touch });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/composer-study.html?${c.variant === 'input' ? 'field=input&' : ''}state=${c.state}${c.text ? '&text=200' : ''}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(() => {
    const t = document.getElementById('composer-text'), cs = getComputedStyle(t), doc = document.documentElement;
    if (t.tagName === 'INPUT') { const c = document.createElement('canvas').getContext('2d'); c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; const avail = t.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); return { textareaHeight: t.clientHeight, lines: 1, placeholderFullyVisible: c.measureText(t.placeholder).width <= avail + 1, placeholderLines: 1, horizontalScroll: doc.scrollWidth > doc.clientWidth + 1, targets: [...document.querySelectorAll('.vg-btn, input')].map(e => { const b = e.getBoundingClientRect(); return { n: e.textContent.trim() || 'input', w: Math.round(b.width), h: Math.round(b.height) }; }) }; }
    const lineH = parseFloat(cs.lineHeight), pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const out = { textareaHeight: t.clientHeight, maxHeight: parseFloat(cs.maxHeight), lines: Math.round((t.clientHeight - pad) / lineH), scrollsInside: t.scrollHeight > t.clientHeight + 1, horizontalScroll: doc.scrollWidth > doc.clientWidth + 1 };
    if (!t.value) {   // is the whole placeholder visible? measure it as content in an identical, unbounded clone
      const k = t.cloneNode(); k.value = t.placeholder; k.style.maxHeight = 'none'; k.style.position = 'absolute'; k.style.visibility = 'hidden'; k.style.width = t.clientWidth + 'px'; t.parentNode.appendChild(k);
      out.placeholderFullyVisible = k.scrollHeight <= t.clientHeight + 1; out.placeholderLines = Math.round((k.scrollHeight - pad) / lineH); k.remove();
    }
    out.targets = [...document.querySelectorAll('.vg-btn, textarea')].map(e => { const b = e.getBoundingClientRect(); return { n: e.textContent.trim() || 'textarea', w: Math.round(b.width), h: Math.round(b.height) }; });
    out.buttonsOrder = [...document.querySelectorAll('.vg-btn')].map(b => b.textContent.trim() + '@' + Math.round(b.getBoundingClientRect().top));
    return out;
  });
  await page.addScriptTag({ content: AXE });
  r.axe = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map(v => v.id));
  if (c.touch) r.smallTargets = r.targets.filter(t => t.h < 44 || t.w < 44);
  const name = `${c.variant}_${c.label}_${c.state}`;
  await page.locator('#composer').screenshot({ path: path.join(OUT, name + '.png') });
  if (c.state === 'empty' && c.label === '1440') { await page.focus('#composer-text'); r.focusRing = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle + ' ' + getComputedStyle(document.activeElement).outlineWidth); await page.locator('main').screenshot({ path: path.join(OUT, name + '_focus.png') }); }
  results.push({ name, ...c, ...r });
  await ctx.close();
}
await browser.close(); server.close();
fs.writeFileSync(path.resolve(here, '../validation/composer-study.json'), JSON.stringify({ chrome: 'Chrome (playwright channel)', date: new Date().toISOString(), results }, null, 2));
for (const r of results) console.log(r.name.padEnd(34), 'h', r.textareaHeight, 'lines', r.lines, r.state === 'empty' ? `placeholder ${r.placeholderFullyVisible ? 'FULL' : 'CLIPPED'} (${r.placeholderLines} lines)` : `scrollsInside ${r.scrollsInside} max ${r.maxHeight}`, 'hs', r.horizontalScroll, 'axe', r.axe.length, r.smallTargets ? 'small ' + JSON.stringify(r.smallTargets) : '', r.focusRing || '');

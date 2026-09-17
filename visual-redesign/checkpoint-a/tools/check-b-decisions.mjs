// Mechanical checks for the Checkpoint B decisions: B-01 trust line, B-02 nav current on Account,
// B-05 account control identical everywhere, B-06 Videogo mark accessible name, feed order and crop basis.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
import { server } from './serve.mjs';
const PORT = 4460; await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const b = await chromium.launch({ channel: 'chrome', headless: true });
const out = { account: {}, touch: {} };
const pages = ['today.html', 'today-ready.html', 'studio.html', 'knowledge.html', 'account.html', 'making.html', 'week-one.html', 'first-video-deferred.html'];
for (const touch of [false, true]) for (const p of pages) {
  const ctx = await b.newContext({ viewport: touch ? { width: 390, height: 844 } : { width: 1440, height: 900 }, hasTouch: touch, isMobile: touch });
  const page = await ctx.newPage(); await page.goto(`http://127.0.0.1:${PORT}/${p}`, { waitUntil: 'networkidle' });
  if (!touch) {
    for (let i = 0; i < 40; i++) { await page.keyboard.press('Tab'); if (await page.evaluate(() => document.activeElement.classList.contains('vg-account'))) break; }
  }
  const r = await page.evaluate(() => { const a = document.querySelector('.vg-account'); if (!a) return null; const cs = getComputedStyle(a), bx = a.getBoundingClientRect(), f = document.activeElement === a;
    return { tag: a.tagName, href: a.getAttribute('href'), title: a.title, h: Math.round(bx.height), w: Math.round(bx.width), visible: !!a.getClientRects().length, font: cs.fontFamily, color: cs.color, focusRing: f ? cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor : 'not focused',
      navCurrent: [...document.querySelectorAll('.vg-nav [aria-current="page"]')].map(n => n.textContent.trim()) }; });
  (touch ? out.touch : out.account)[p] = r;
  if (p === 'account.html' && !touch) out.trustLine = await page.evaluate(() => [...document.querySelectorAll('p')].some(n => n.textContent.trim() === 'VIDEOGO only publishes within permissions you grant.'));
  if (p === 'knowledge.html' && !touch) out.videogoMarks = await page.evaluate(() => [...document.querySelectorAll('.vg-turn__mark')].map(s => ({ role: s.getAttribute('role'), label: s.getAttribute('aria-label'), hidden: s.getAttribute('aria-hidden') })));
  await ctx.close();
}
const ctx = await b.newContext(); const page = await ctx.newPage();
for (const mode of ['populated', 'untimed', 'partial']) {
  await page.goto(`http://127.0.0.1:${PORT}/feed-specimen.html?mode=${mode}`, { waitUntil: 'networkidle' });
  out['feed_' + mode] = await page.evaluate(() => ({
    gridOrder: [...document.querySelectorAll('ul[aria-label="Feed preview"] > li')].map(li => li.querySelector('.vg-ftile__word').textContent + (li.dataset.at ? ' ' + li.dataset.at : '') + ' · crop ' + (li.querySelector('[data-crop]')?.dataset.crop || 'n/a') + ' · ' + (li.querySelector('img')?.style.objectPosition || '')),
    untimedApart: [...document.querySelectorAll('.vg-funtimed li')].map(li => li.querySelector('.vg-ftile__word').textContent + (li.dataset.at ? ' TIMED?' : ''))
  }));
}
await b.close(); server.close();
const accts = Object.values(out.account); const same = k => new Set(accts.map(a => a && a[k])).size === 1;
out.summary = { allLinks: accts.every(a => a && a.tag === 'A' && a.href === 'account.html'), sameHeight: same('h'), sameWidth: same('w'), sameColor: same('color'), sameFont: same('font'), sameFocus: same('focusRing'),
  touchTargetsOk: Object.values(out.touch).every(a => !a || !a.visible || a.h >= 44), accountNavCurrent: out.account['account.html'].navCurrent };
fs.writeFileSync(new URL('../validation/b-decisions.json', import.meta.url), JSON.stringify(out, null, 2));
console.log(JSON.stringify({ summary: out.summary, trustLine: out.trustLine, videogoMarks: out.videogoMarks, focus: out.account['today.html'].focusRing, h: out.account['today.html'].h, feed: [out.feed_populated, out.feed_untimed] }, null, 1));

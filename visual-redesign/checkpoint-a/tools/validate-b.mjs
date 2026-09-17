// Canonical Checkpoint B validation: fonts, axe, rendered contrast, keyboard focus, 320px reflow,
// 200% text, long content. Output: validation/b-results.json (+ stress/reflow renders in renders/b/validation).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';
import { server } from './serve.mjs';
const require = createRequire(import.meta.url);
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..');
const VR = path.join(ROOT, 'renders/b/validation'); fs.mkdirSync(VR, { recursive: true });
const PORT = 4441;
await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const base = `http://127.0.0.1:${PORT}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const PAGES = ['/knowledge.html', '/account.html', '/making.html', '/week-one.html', '/first-video-deferred.html', '/studio.html', '/feed-specimen.html?mode=populated', '/feed-specimen.html?mode=partial', '/feed-specimen.html?mode=untimed', '/feed-specimen.html?mode=empty'];
async function open(url, { w = 1440, h = 900, touch = false, dsf = 1 } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, hasTouch: touch, isMobile: touch });
  const page = await ctx.newPage();
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page };
}
const helpers = () => {
  const lum = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(',').map(Number); const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return { L: 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b), a }; };
  const bg = el => { for (let n = el; n; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; const l = lum(c); if (l && l.a > 0.99) return c; } return 'rgb(245, 245, 247)'; };
  const ratio = (a, b) => { const x = lum(a).L, y = lum(b).L; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  window.__contrast = () => {
    const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { const n = w.currentNode; if (!n.textContent.trim()) continue; const el = n.parentElement; if (!el.getClientRects().length || el.closest('.vg-visually-hidden, .vg-skip, .vg-study-note, [aria-hidden="true"] img')) continue;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden') continue; const size = parseFloat(cs.fontSize), weight = +cs.fontWeight; const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const onMedia = el.closest('.vg-media, .vg-ftile__media:not(.vg-ftile__media--unavailable)'); const back = onMedia && !['vg-media__chip', 'vg-media__prov'].some(c => el.classList.contains(c)) ? null : bg(el);
      if (!back) continue; const r = ratio(cs.color, back); out.push({ t: n.textContent.trim().slice(0, 32), r: +r.toFixed(2), need: large ? 3 : 4.5 }); }
    document.querySelectorAll('input').forEach(i => { const c = getComputedStyle(i, '::placeholder').color; out.push({ t: 'placeholder: ' + i.placeholder.slice(0, 24), r: +ratio(c, bg(i)).toFixed(2), need: 4.5 }); });
    return { min: Math.min(...out.map(o => o.r)), failures: out.filter(o => o.r < o.need) };
  };
  window.__overflow = () => {
    const doc = document.documentElement;
    const over = [...document.querySelectorAll('.vg-btn, .vg-fact__value, .vg-turn__text, .vg-rows dd, .vg-perm__name, .vg-object__title, .vg-stage__name, .vg-stage__desc, .vg-page-title, .vg-onboard__title, .vg-empty__statement, .vg-nav a, .vg-card__title')]
      .filter(e => e.getClientRects().length && e.scrollWidth > e.clientWidth + 1).map(e => `${e.className}: "${e.textContent.trim().slice(0, 30)}"`);
    const clippedPlaceholders = [...document.querySelectorAll('input[placeholder]')].filter(i => i.getClientRects().length).map(i => {
      const c = document.createElement('canvas').getContext('2d'); const cs = getComputedStyle(i); c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const avail = i.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); return c.measureText(i.placeholder).width > avail + 1 ? i.placeholder.slice(0, 30) : null; }).filter(Boolean);
    return { horizontalScroll: doc.scrollWidth > doc.clientWidth + 1, textOverflow: over, clippedPlaceholders };
  };
};
const R = { chrome: browser.version(), date: new Date().toISOString(), pages: {} };
for (const url of PAGES) {
  const r = R.pages[url] = {};
  // fonts, axe, contrast, keyboard @1440 and @1216
  for (const w of [1440, 1216]) {
    const { ctx, page } = await open(url, { w, h: w === 1440 ? 900 : 1050 });
    await page.evaluate(helpers);
    const client = await ctx.newCDPSession(page); await client.send('DOM.enable'); await client.send('CSS.enable');
    const { root } = await client.send('DOM.getDocument', { depth: -1 }); const fonts = new Set();
    for (const sel of ['h1', 'h2', 'p', '.vg-btn']) { const { nodeId } = await client.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel }); if (nodeId) (await client.send('CSS.getPlatformFontsForNode', { nodeId })).fonts.forEach(f => fonts.add(f.familyName + (f.isCustomFont ? ' [font file]' : ' [platform]'))); }
    await page.addScriptTag({ content: AXE });
    const axe = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map(v => `${v.id} ×${v.nodes.length}`));
    const contrast = await page.evaluate(() => window.__contrast());
    const keys = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      const k = await page.evaluate(() => { const el = document.activeElement; if (!el || el === document.body) return null; const cs = getComputedStyle(el); const b = el.getBoundingClientRect();
        const cx = Math.min(Math.max(b.left + b.width / 2, 0), innerWidth - 1), cy = Math.min(Math.max(b.top + b.height / 2, 0), innerHeight - 1); const top = document.elementFromPoint(cx, cy);
        return { el: `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || el.placeholder || '').trim().replace(/\s+/g, ' ').slice(0, 28)}"`, ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2, visible: !!top && (top === el || el.contains(top) || top.contains(el)), h: Math.round(b.height) }; });
      if (!k || (keys.length && k.el === keys[0].el)) break; keys.push(k);
    }
    r[w] = { fonts: [...fonts], axe, contrastMin: contrast.min, contrastFailures: contrast.failures, keyboard: { stops: keys.length, order: keys.map(k => k.el), missingRing: keys.filter(k => !k.ring).map(k => k.el), obscured: keys.filter(k => !k.visible).map(k => k.el), under24px: keys.filter(k => k.h < 24).map(k => k.el) }, overflow: await page.evaluate(() => window.__overflow()) };
    await ctx.close();
  }
  // 200% text @1440
  { const { ctx, page } = await open(url, { w: 1440, h: 900 }); await page.evaluate(helpers); await page.addStyleTag({ content: 'html{font-size:200% !important}' }); await page.waitForTimeout(100);
    r.text200 = await page.evaluate(() => window.__overflow()); await ctx.close(); }
  // 320px reflow (narrow study, touch)
  { const { ctx, page } = await open(url + (url.includes('?') ? '&' : '?') + 'study=narrow', { w: 320, h: 640, touch: true, dsf: 2 }); await page.evaluate(helpers);
    r.reflow320 = await page.evaluate(() => window.__overflow());
    r.touchTargetsUnder44 = await page.evaluate(() => [...document.querySelectorAll('a[href], button, input')].filter(e => e.getClientRects().length && !e.closest('.vg-skip, .vg-rail')).filter(e => { const b = e.getBoundingClientRect(); return e.tagName === 'INPUT' ? b.height < 44 : (b.height < 44 || b.width < 44); }).map(e => (e.textContent || e.placeholder || '').trim().slice(0, 24)));
    await page.screenshot({ path: path.join(VR, `reflow-320_${url.replace(/[^a-z0-9]+/gi, '_')}.png`), fullPage: true }); await ctx.close(); }
}
// Long content (observed stress strings; mixed fixtures, not product states)
const LONG = {
  statement: 'I can do that — though this angle is starting to repeat. I’d try a customer-story video next. Before that, I’ll finish the pricing video and keep intros tighter on comparison videos.',
  owner: 'Never use fear-based selling. No “your boiler could be dangerous” stuff, ever — and say “spesa”, not “investment”.',
  fact: 'Boiler service & repair · heat-pump installs · €89 pre-winter check · emergency call-outs across Varese, Gallarate, Busto Arsizio and Saronno · written quote before any work starts · flat-fee call-out policy since 1998 · condominium maintenance contracts',
  business: 'Farmacia Vitalis di Lumino S.n.c. — Lumino · Design partner',
  email: 'amministrazione.farmaciavitalis.lumino@example-longdomain.it',
  title: 'I recommend answering “how long does a boiler service take?” with short guided clips Luca records on the job',
};
R.longContent = {};
for (const [url, fn, name] of [
  ['/knowledge.html', L => { document.querySelectorAll('.vg-turn__text')[1].lastChild.textContent = L.statement; document.querySelectorAll('.vg-turn__text')[0].lastChild.textContent = L.owner; document.querySelectorAll('.vg-fact__value')[2].textContent = L.fact; }, 'knowledge'],
  ['/account.html', L => { document.querySelectorAll('.vg-rows dd')[0].textContent = L.business; document.querySelectorAll('.vg-rows dd')[1].textContent = 'Luca Moretti · ' + L.email; }, 'account'],
  ['/making.html', L => { document.querySelector('.vg-object__title').textContent = L.title; }, 'making'],
]) {
  for (const w of [1216, 390]) {
    const { ctx, page } = await open(url + (w === 390 ? '?study=narrow' : ''), { w, h: 1050, touch: w === 390, dsf: 2 }); await page.evaluate(helpers); await page.evaluate(fn, LONG);
    R.longContent[`${name}@${w}`] = await page.evaluate(() => window.__overflow());
    await page.screenshot({ path: path.join(VR, `long_${name}_${w}.png`), fullPage: true }); await ctx.close();
  }
}
await browser.close(); server.close();
fs.writeFileSync(path.join(ROOT, 'validation/b-results.json'), JSON.stringify(R, null, 2));
for (const [u, r] of Object.entries(R.pages)) console.log(u, JSON.stringify({ fonts: r[1440].fonts, axe: [r[1440].axe, r[1216].axe], contrast: [r[1440].contrastMin, r[1440].contrastFailures.length], keys: r[1440].keyboard.stops, ring: r[1440].keyboard.missingRing, obscured: r[1440].keyboard.obscured, ov1440: r[1440].overflow, ov1216: r[1216].overflow, t200: r.text200, r320: r.reflow320, touch: r.touchTargetsUnder44 }));
console.log('LONG', JSON.stringify(R.longContent));

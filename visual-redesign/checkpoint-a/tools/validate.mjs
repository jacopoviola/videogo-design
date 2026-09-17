// Automated validation for Checkpoint A. Writes validation/results.json and stress/zoom renders.
// Human visual inspection is recorded separately in 05_VALIDATION.md.
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
const RENDERS = path.join(ROOT, 'renders');
const OUT = path.join(ROOT, 'validation');
fs.mkdirSync(OUT, { recursive: true });

const PORT = 4419;
await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const base = `http://127.0.0.1:${PORT}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = { chrome: browser.version(), platform: `${process.platform} ${process.arch}`, date: new Date().toISOString(), checks: {} };

async function open(url, { width = 1440, height = 900, touch = false, reducedMotion = 'no-preference', dsf = 1 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dsf, hasTouch: touch, isMobile: touch, reducedMotion });
  const page = await ctx.newPage();
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page };
}

// ---------- helpers run in page ----------
const pageHelpers = () => {
  window.__lum = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const [r, g, b, a = 1] = m[1].split(',').map(Number);
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return { L: 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b), a, rgb: [r, g, b] };
  };
  window.__bg = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor; const l = window.__lum(c);
      if (l && l.a > 0.99) return c;
    }
    return 'rgb(255, 255, 255)';
  };
  window.__ratio = (fg, bg) => { const a = window.__lum(fg).L, b = window.__lum(bg).L; return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
  window.__desc = (el) => {
    const t = (el.getAttribute('aria-label') || el.textContent || el.placeholder || '').trim().replace(/\s+/g, ' ').slice(0, 48);
    return `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''} "${t}"`;
  };
};

// ---------- 1. Font loading / rendered face ----------
async function fontCheck(url) {
  const { ctx, page } = await open(url);
  const client = await ctx.newCDPSession(page);
  await client.send('DOM.enable'); await client.send('CSS.enable');
  const { root } = await client.send('DOM.getDocument', { depth: -1 });
  const out = [];
  for (const sel of ['.vg-page-title', '.vg-page-sub', '.vg-nav a', '.vg-btn', '.vg-status', '.vg-object__title, .vg-card__title', '.vg-composer__input']) {
    const { nodeId } = await client.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel });
    if (!nodeId) continue;
    let fonts = [];
    try { fonts = (await client.send('CSS.getPlatformFontsForNode', { nodeId })).fonts; } catch {}
    const declared = await page.$eval(sel, el => getComputedStyle(el).fontFamily);
    out.push({ selector: sel, declared, rendered: fonts.map(f => `${f.familyName}${f.postScriptName ? ' (' + f.postScriptName + ')' : ''} ×${f.glyphCount}${f.isCustomFont ? ' custom' : ''}`) });
  }
  const webFonts = await page.evaluate(() => [...document.fonts].map(f => `${f.family} ${f.status}`));
  const images = await page.$$eval('img', imgs => imgs.map(i => ({ src: i.getAttribute('src'), complete: i.complete, naturalWidth: i.naturalWidth })));
  await ctx.close();
  return { url, nodes: out, webFontsRequested: webFonts, images };
}
results.checks.fonts = [await fontCheck('/today.html'), await fontCheck('/studio.html?select=rd1')];

// ---------- 2. Rendered text contrast (every visible text node) ----------
async function contrast(url, opts) {
  const { ctx, page } = await open(url, opts);
  await page.evaluate(pageHelpers);
  const rows = await page.evaluate(() => {
    const seen = new Map();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode; if (!n.textContent.trim()) continue;
      const el = n.parentElement; const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('.vg-visually-hidden, .vg-skip, .vg-study-note')) continue;
      if (!el.getClientRects().length) continue;
      const fg = cs.color, bg = window.__bg(el), size = parseFloat(cs.fontSize), weight = Number(cs.fontWeight);
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const ratio = window.__ratio(fg, bg); const key = `${fg}|${bg}|${size}|${weight}`;
      if (!seen.has(key) || seen.get(key).ratio > ratio) seen.set(key, { sample: n.textContent.trim().slice(0, 40), fg, bg, size, weight, ratio: +ratio.toFixed(2), required: large ? 3 : 4.5, pass: ratio >= (large ? 3 : 4.5) });
    }
    // placeholder pair (not a text node)
    const input = document.querySelector('.vg-composer__input');
    if (input) {
      const ph = getComputedStyle(input, '::placeholder').color;
      seen.set('placeholder', { sample: 'composer placeholder', fg: ph, bg: window.__bg(input), size: parseFloat(getComputedStyle(input).fontSize), weight: 400, ratio: +window.__ratio(ph, window.__bg(input)).toFixed(2), required: 4.5, pass: window.__ratio(ph, window.__bg(input)) >= 4.5 });
    }
    return [...seen.values()].sort((a, b) => a.ratio - b.ratio);
  });
  await ctx.close();
  return { url, min: rows[0]?.ratio, failures: rows.filter(r => !r.pass), pairs: rows };
}
results.checks.textContrast = [await contrast('/today.html'), await contrast('/studio.html'), await contrast('/studio.html?select=rd1')];

// ---------- 3. Non-text contrast (control boundaries, state graphics, focus ring) ----------
results.checks.nonTextContrast = await (async () => {
  const { ctx, page } = await open('/studio.html?select=rd1');
  await page.evaluate(pageHelpers);
  const r = await page.evaluate(() => {
    const css = getComputedStyle(document.documentElement); const v = n => css.getPropertyValue(n).trim();
    const hex = h => { const x = parseInt(h.slice(1), 16); return `rgb(${x >> 16}, ${(x >> 8) & 255}, ${x & 255})`; };
    const pairs = [
      ['Secondary button / field boundary on content', '--vg-border-control', '--vg-surface-content'],
      ['Secondary button boundary on canvas', '--vg-border-control', '--vg-surface-canvas'],
      ['Scheduled feed tile dashed boundary on content', '--vg-border-control', '--vg-surface-content'],
      ['Selected Studio card boundary (text-primary) on canvas', '--vg-text-primary', '--vg-surface-canvas'],
      ['Selected Studio card boundary vs default card boundary', '--vg-text-primary', '--vg-border-subtle'],
      ['Selected segmented option boundary on subtle', '--vg-border-control', '--vg-surface-subtle'],
      ['Publish fill on content (authorization control)', '--vg-authorization', '--vg-surface-content'],
      ['Primary action fill on content', '--vg-action-primary', '--vg-surface-content'],
      ['Primary action fill on canvas', '--vg-action-primary', '--vg-surface-canvas'],
      ['Focus ring on canvas', '--vg-focus', '--vg-surface-canvas'],
      ['Focus ring on content', '--vg-focus', '--vg-surface-content'],
      ['Focus ring on subtle rail', '--vg-focus', '--vg-surface-subtle'],
      ['Focus ring on selected nav fill', '--vg-focus', '--vg-surface-selected'],
      ['Focus ring adjacent to primary (near-black) fill', '--vg-focus', '--vg-action-primary'],
      ['NEED glyph on NEED surface', '--vg-need', '--vg-need-surface'],
      ['Card default boundary on canvas (decorative)', '--vg-border-subtle', '--vg-surface-canvas'],
    ];
    return pairs.map(([label, a, b]) => { const ratio = window.__ratio(hex(v(a)), hex(v(b))); return { label, fg: v(a), bg: v(b), ratio: +ratio.toFixed(2), required: label.includes('decorative') ? null : 3, pass: label.includes('decorative') ? 'n/a (not essential)' : ratio >= 3 }; });
  });
  await ctx.close();
  return r;
})();

// ---------- 4. axe-core ----------
async function axe(url, opts) {
  const { ctx, page } = await open(url, opts);
  await page.addScriptTag({ content: AXE });
  const r = await page.evaluate(async () => {
    const res = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
    return { violations: res.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(n => n.target.join(' ')).slice(0, 6) })), passes: res.passes.length, incomplete: res.incomplete.map(v => ({ id: v.id, nodes: v.nodes.length })) };
  });
  await ctx.close();
  return { url, ...r };
}
results.checks.axe = [await axe('/today.html'), await axe('/studio.html'), await axe('/studio.html?select=rd1'), await axe('/today.html?study=narrow', { width: 390, height: 844, touch: true }), await axe('/studio.html?select=rd1&study=narrow', { width: 390, height: 844, touch: true })];

// ---------- 5. Keyboard order, focus visibility, focus not obscured ----------
async function keyboard(url, steps, opts) {
  const { ctx, page } = await open(url, opts);
  await page.evaluate(pageHelpers);
  const order = [];
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press('Tab');
    order.push(await page.evaluate(() => {
      const el = document.activeElement; if (!el || el === document.body) return { el: 'body' };
      const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const inView = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
      const top = inView ? document.elementFromPoint(Math.min(Math.max(cx, 0), innerWidth - 1), Math.min(Math.max(cy, 0), innerHeight - 1)) : null;
      return { el: window.__desc(el), outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor} offset ${cs.outlineOffset}`,
        visibleRing: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2,
        notObscured: !!top && (top === el || el.contains(top) || top.contains(el)), size: `${Math.round(r.width)}×${Math.round(r.height)}` };
    }));
  }
  await ctx.close();
  return { url, order };
}
results.checks.keyboard = [await keyboard('/today.html', 9), await keyboard('/studio.html', 14), await keyboard('/studio.html?select=rd1', 16)];

// Studio selection by keyboard: Enter selects, Enter again clears, Back to context returns focus to the card.
results.checks.studioSelectionKeyboard = await (async () => {
  const { ctx, page } = await open('/studio.html');
  const log = [];
  await page.focus('.vg-card[data-key="rd1"]');
  await page.keyboard.press('Enter');
  log.push({ step: 'Enter on Ready card', pressed: await page.getAttribute('.vg-card[data-key="rd1"]', 'aria-pressed'), panelTitle: await page.textContent('#context-panel .vg-panel__title').catch(() => null), focusStaysOnCard: await page.evaluate(() => document.activeElement.dataset.key === 'rd1') });
  await page.focus('.vg-card[data-key="idea1"]');
  await page.keyboard.press('Space');
  log.push({ step: 'Space on Idea card (switch selection)', rd1: await page.getAttribute('.vg-card[data-key="rd1"]', 'aria-pressed'), idea1: await page.getAttribute('.vg-card[data-key="idea1"]', 'aria-pressed'), panelTitle: await page.textContent('#context-panel .vg-panel__title') });
  await page.keyboard.press('Enter');
  log.push({ step: 'Enter again on selected Idea card (toggle off)', idea1: await page.getAttribute('.vg-card[data-key="idea1"]', 'aria-pressed'), panelShowsContext: await page.isVisible('#context-panel .vg-segmented') });
  await page.focus('.vg-card[data-key="rd1"]'); await page.keyboard.press('Enter');
  await page.focus('[data-back]'); await page.keyboard.press('Enter');
  log.push({ step: 'Back to context', rd1: await page.getAttribute('.vg-card[data-key="rd1"]', 'aria-pressed'), focusReturnedToCard: await page.evaluate(() => document.activeElement.dataset.key === 'rd1'), panelShowsContext: await page.isVisible('#context-panel .vg-segmented') });
  await ctx.close();
  return log;
})();

// ---------- 6. Overflow / clipping helper ----------
const overflowProbe = () => {
  const bad = [];
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el); if (!el.getClientRects().length || el.closest('.vg-visually-hidden')) return;
    if (el.matches('input')) return;
    const clips = ['hidden', 'clip'].includes(cs.overflowX) || cs.textOverflow === 'ellipsis';
    if (clips && el.scrollWidth > el.clientWidth + 1 && !el.matches('.vg-object')) bad.push(`clipped: ${el.className} (${el.scrollWidth}>${el.clientWidth})`);
  });
  const doc = document.documentElement;
  const textOverflow = [...document.querySelectorAll('.vg-btn, .vg-card, .vg-object__title, .vg-evidence dd, .vg-schedule li, .vg-nav a, .vg-panel__title')]
    .filter(el => el.scrollWidth > el.clientWidth + 1).map(el => `overflow: ${el.className} "${el.textContent.trim().slice(0, 30)}" (${el.scrollWidth}>${el.clientWidth})`);
  return { pageHorizontalScroll: doc.scrollWidth > doc.clientWidth + 1, scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, clipped: bad, textOverflow };
};

// ---------- 7. Long content (observed stress fixtures) ----------
const STRESS = {
  title: 'I recommend answering “how long does a boiler service take?” with short guided clips Luca records on the job',
  body: "Your question-answering videos are your best performers, and a real technician on camera adds the authority a voiceover can't. Everything is batched into one session: 2 short talking clips + 3 workshop shots. Phone, natural light, no script memorizing — the app guides every take.",
  evidence: "Boiler-check video is your most-saved this month (41 saves). One call mentioned a video — you told me. Business impact beyond that isn't observable this week (no tracked links on these posts).",
  action: 'Send the recording link to my phone',
};
results.checks.longContent = [];
for (const [w, h] of [[1440, 900], [1216, 1050], [390, 844]]) {
  const study = w === 390 ? '&study=narrow' : '';
  let { ctx, page } = await open(`/today.html?stress=1${study}`, { width: w, height: h, touch: w === 390, dsf: 2 });
  await page.evaluate((s) => {
    document.querySelector('.vg-object__title').textContent = s.title;
    document.querySelector('.vg-object__consequence').textContent = s.body;
    document.querySelector('.vg-object .vg-btn').textContent = s.action;
    document.title = 'STRESS — mixed observed fixtures, not a product state';
  }, STRESS);
  results.checks.longContent.push({ screen: `Today NEED stress @${w}`, chars: { title: STRESS.title.length, body: STRESS.body.length, action: STRESS.action.length, placeholder: 65 }, ...(await page.evaluate(overflowProbe)) });
  await page.screenshot({ path: path.join(RENDERS, `D_stress_today_${w}.png`), fullPage: w === 390 });
  await ctx.close();
  ({ ctx, page } = await open(`/studio.html?select=rd1${study}`, { width: w, height: h, touch: w === 390, dsf: 2 }));
  await page.evaluate((s) => {
    document.querySelectorAll('.vg-evidence dd')[2].textContent = s.evidence;
    document.querySelector('.vg-card[data-key="rd1"] .vg-card__title').textContent = s.title;
    document.querySelector('.vg-panel__title').textContent = s.title;
  }, STRESS);
  results.checks.longContent.push({ screen: `Studio READY stress @${w}`, chars: { title: STRESS.title.length, evidence: STRESS.evidence.length }, ...(await page.evaluate(overflowProbe)) });
  await page.screenshot({ path: path.join(RENDERS, `D_stress_studio-ready_${w}.png`), fullPage: w === 390 });
  await ctx.close();
}

// ---------- 8. 200% text scaling and 200% zoom ----------
results.checks.textScale200 = [];
for (const [url, w, h] of [['/today.html', 1440, 900], ['/today.html', 1216, 1050], ['/studio.html?select=rd1', 1440, 900], ['/studio.html?select=rd1', 1216, 1050]]) {
  const { ctx, page } = await open(url, { width: w, height: h, dsf: 1 });
  const before = await page.$eval('.vg-page-title', el => parseFloat(getComputedStyle(el).fontSize));
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await page.waitForTimeout(100);
  const after = await page.evaluate(() => ({ title: parseFloat(getComputedStyle(document.querySelector('.vg-page-title')).fontSize), body: parseFloat(getComputedStyle(document.querySelector('.vg-page-sub')).fontSize), control: parseFloat(getComputedStyle(document.querySelector('.vg-btn')).fontSize) }));
  const probe = await page.evaluate(overflowProbe);
  const name = `E_text-200_${url.includes('studio') ? 'studio-ready' : 'today'}_${w}.png`;
  await page.screenshot({ path: path.join(RENDERS, name), fullPage: true });
  results.checks.textScale200.push({ url, viewport: `${w}×${h}`, titlePx: { before, after: after.title }, bodyPx: after.body, controlPx: after.control, ...probe, render: `renders/${name}` });
  await ctx.close();
}
results.checks.zoom200 = [];
for (const [url, name] of [['/today.html', 'today'], ['/studio.html?select=rd1', 'studio-ready']]) {
  const { ctx, page } = await open(url, { width: 720, height: 450, dsf: 2 }); // 1440×900 at 200% browser zoom
  const probe = await page.evaluate(overflowProbe);
  await page.screenshot({ path: path.join(RENDERS, `E_zoom-200_${name}_1440.png`), fullPage: true });
  results.checks.zoom200.push({ url, cssViewport: '720×450 (1440×900 at 200%)', ...probe, render: `renders/E_zoom-200_${name}_1440.png` });
  await ctx.close();
}

// ---------- 9. 320 CSS px reflow (narrow study) ----------
results.checks.reflow320 = [];
for (const url of ['/today.html?study=narrow', '/studio.html?select=rd1&study=narrow']) {
  const { ctx, page } = await open(url, { width: 320, height: 640, touch: true, dsf: 2 });
  results.checks.reflow320.push({ url, ...(await page.evaluate(overflowProbe)) });
  await page.screenshot({ path: path.join(RENDERS, `F_reflow-320_${url.includes('studio') ? 'studio-ready' : 'today'}.png`), fullPage: true });
  await ctx.close();
}

// ---------- 10. Target sizes (desktop pointer ≥24px WCAG 2.5.8; touch ≥44px product rule) ----------
async function targets(url, opts, min) {
  const { ctx, page } = await open(url, opts);
  await page.evaluate(pageHelpers);
  const r = await page.evaluate((min) => [...document.querySelectorAll('a[href], button, input')].filter(el => el.getClientRects().length && !el.closest('.vg-skip'))
    .map(el => { const b = el.getBoundingClientRect(); return { el: window.__desc(el), w: Math.round(b.width), h: Math.round(b.height), pass: el.matches('input') ? b.height >= min : (b.width >= min && b.height >= min) }; }), min);
  const coarse = await page.evaluate(() => matchMedia('(pointer: coarse)').matches);
  await ctx.close();
  return { url, pointerCoarse: coarse, minimum: min, failures: r.filter(x => !x.pass), measured: r };
}
results.checks.targets = [
  await targets('/today.html', {}, 24), await targets('/studio.html?select=rd1', {}, 24),
  await targets('/today.html?study=narrow', { width: 390, height: 844, touch: true }, 44), await targets('/studio.html?select=rd1&study=narrow', { width: 390, height: 844, touch: true }, 44),
];

// ---------- 11. Reduced motion ----------
results.checks.reducedMotion = await (async () => {
  const { ctx, page } = await open('/studio.html', { reducedMotion: 'reduce' });
  const r = await page.evaluate(() => ({ card: getComputedStyle(document.querySelector('.vg-card')).transitionDuration, button: getComputedStyle(document.querySelector('.vg-btn')).transitionDuration, nav: getComputedStyle(document.querySelector('.vg-nav a')).transitionDuration }));
  await ctx.close();
  return { ...r, pass: Object.values(r).every(v => v.split(',').every(d => parseFloat(d) === 0)) };
})();

// ---------- 12. Lockup: no live text, outlined render vs live Instrument Sans ----------
results.checks.lockup = await (async () => {
  const assets = path.join(ROOT, 'src/assets');
  const files = fs.readdirSync(assets).filter(f => f.endsWith('.svg'));
  const textNodes = Object.fromEntries(files.map(f => [f, (fs.readFileSync(path.join(assets, f), 'utf8').match(/<text/g) || []).length]));
  const fontB64 = fs.readFileSync(path.join(here, 'font-source/InstrumentSans-Bold.ttf')).toString('base64');
  const src = fs.readFileSync(path.resolve(ROOT, '../../assets/videogo-lockup-inverse.svg'), 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<metadata>[\s\S]*?<\/metadata>/, '');
  const outlined = fs.readFileSync(path.join(assets, 'videogo-lockup-inverse-outlined.svg'), 'utf8');
  const ctx = await browser.newContext({ viewport: { width: 980, height: 520 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.setContent(`<style>@font-face{font-family:"Instrument Sans";src:url(data:font/ttf;base64,${fontB64});font-weight:700}
    body{margin:20px;background:#fff;font:13px system-ui} .r{width:940px;height:140px;margin-bottom:24px}</style>
    <div>1 · Source asset as &lt;img&gt; (no font available to the image → fallback)</div><img class="r" src="data:image/svg+xml;base64,${Buffer.from(src).toString('base64')}">
    <div>2 · Source asset inline with licensed Instrument Sans Bold loaded (reference for intent)</div><div class="r" id="live">${src}</div>
    <div>3 · Outlined asset as &lt;img&gt; (no font dependency)</div><img class="r" src="data:image/svg+xml;base64,${Buffer.from(outlined).toString('base64')}">`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  const liveFont = await page.evaluate(() => document.fonts.check('700 143px "Instrument Sans"'));
  await page.screenshot({ path: path.join(RENDERS, 'G_lockup_fallback-vs-live-vs-outlined.png'), fullPage: true });
  await ctx.close();
  return { svgTextElements: textNodes, liveFontLoadedForComparison: liveFont, comparisonRender: 'renders/G_lockup_fallback-vs-live-vs-outlined.png', note: 'Row 2 renders the source <text> in Chrome with the licensed face; row 3 is the outline. Chrome distributes textLength over n characters, SVG 2 over n−1 gaps: see 05_VALIDATION.md.' };
})();

await browser.close();
server.close();
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2));

// ---------- summary ----------
const c = results.checks;
const summary = {
  fonts: c.fonts.map(f => ({ url: f.url, rendered: [...new Set(f.nodes.flatMap(n => n.rendered.map(x => x.split(' ×')[0])))], webFonts: f.webFontsRequested.length, imagesLoaded: f.images.every(i => i.complete && i.naturalWidth > 0) })),
  textContrastMin: c.textContrast.map(t => ({ url: t.url, min: t.min, failures: t.failures.length })),
  nonTextFailures: c.nonTextContrast.filter(x => x.pass === false).map(x => x.label),
  axe: c.axe.map(a => ({ url: a.url, violations: a.violations.map(v => `${v.id} (${v.impact}) ×${v.nodes.length}`) })),
  keyboard: c.keyboard.map(k => ({ url: k.url, order: k.order.map(o => o.el), allRingsVisible: k.order.every(o => o.el === 'body' || o.visibleRing), obscured: k.order.filter(o => o.el !== 'body' && !o.notObscured).map(o => o.el) })),
  studioSelectionKeyboard: c.studioSelectionKeyboard,
  longContent: c.longContent.map(l => ({ screen: l.screen, horizontalScroll: l.pageHorizontalScroll, clipped: l.clipped.length, overflow: l.textOverflow })),
  textScale200: c.textScale200.map(t => ({ url: t.url, viewport: t.viewport, title: t.titlePx, horizontalScroll: t.pageHorizontalScroll, clipped: t.clipped, overflow: t.textOverflow })),
  zoom200: c.zoom200.map(t => ({ url: t.url, horizontalScroll: t.pageHorizontalScroll, overflow: t.textOverflow })),
  reflow320: c.reflow320.map(t => ({ url: t.url, horizontalScroll: t.pageHorizontalScroll, overflow: t.textOverflow })),
  targets: c.targets.map(t => ({ url: t.url, coarse: t.pointerCoarse, min: t.minimum, failures: t.failures })),
  reducedMotion: c.reducedMotion,
  lockup: c.lockup,
};
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));

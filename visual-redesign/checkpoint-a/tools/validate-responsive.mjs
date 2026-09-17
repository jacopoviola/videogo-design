// Responsive + validation layer for Checkpoint B.
// Modes: 1440 · 1216 · 200% text (CDP Page.setFontSizes 32/26 = the browser text-size setting; rem, em media queries and
// container queries all follow it) · 200% zoom (1440×900 window at 200% = 720×450 CSS px, rendered at device scale 2) ·
// 320 complete product shell (touch). A pass requires: no horizontal scroll, no clipping, no overlap, no mid-word breaks,
// full composer placeholder, navigation + account reachable, desktop rail never beside compressed content.
// axe is reported separately and is NOT a reflow result.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';
import { server } from './serve.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..');
const OUT = path.join(ROOT, 'renders/responsive'); fs.mkdirSync(OUT, { recursive: true });
const AXE = fs.readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const PORT = 4470; await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const base = `http://127.0.0.1:${PORT}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });

const MODES = {
  '1440': { viewport: { width: 1440, height: 900 }, dsf: 1 },
  '1216': { viewport: { width: 1216, height: 1050 }, dsf: 1 },
  'text200': { viewport: { width: 1440, height: 900 }, dsf: 1, text: 2 },
  'zoom200': { viewport: { width: 720, height: 450 }, dsf: 2 },
  '320': { viewport: { width: 320, height: 640 }, dsf: 2, touch: true },
};
const PAGES = ['/today.html', '/today-ready.html', '/studio.html', '/studio.html?select=rd1', '/knowledge.html', '/account.html', '/making.html', '/week-one.html', '/first-video-deferred.html'];

async function open(url, mode, { dsf } = {}) {
  const m = MODES[mode];
  const ctx = await browser.newContext({ viewport: m.viewport, deviceScaleFactor: dsf || m.dsf, hasTouch: !!m.touch, isMobile: !!m.touch });
  const page = await ctx.newPage();
  if (m.text) { const c = await ctx.newCDPSession(page); await c.send('Page.enable'); page.__setText = () => c.send('Page.setFontSizes', { fontSizes: { standard: 16 * m.text, fixed: 13 * m.text } }); await page.__setText(); }
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);
  await page.evaluate(INSTALL);
  return { ctx, page };
}

// ---------------- in-page checks ----------------
const INSTALL = () => {
  const vis = el => { if (!el.getClientRects().length) return false; for (let n = el; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.visibility === 'hidden' || cs.display === 'none') return false; } return !el.closest('.vg-visually-hidden, .vg-skip'); };
  const label = el => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''} "${(el.textContent || el.placeholder || el.alt || '').trim().replace(/\s+/g, ' ').slice(0, 36)}"`;
  const textNodes = root => { const out = []; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const n = w.currentNode; if (n.textContent.trim() && n.parentElement && vis(n.parentElement)) out.push(n); } return out; };

  window.__midword = () => {
    const bad = [];
    for (const n of textNodes(document.body)) {
      if (n.parentElement.closest('.vg-breakable, textarea, script, style')) continue;
      const re = /[^\s—–\-\/·]+/g; let m;
      while ((m = re.exec(n.textContent))) {
        const word = m[0]; if (word.length < 2 || /[@:]/.test(word)) continue;
        const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + word.length);
        const tops = [...new Set([...r.getClientRects()].filter(x => x.width > 0).map(x => Math.round(x.top)))];
        if (tops.length > 1) bad.push(`"${word}" in ${label(n.parentElement)}`);
      }
    }
    return [...new Set(bad)];
  };

  window.__clipping = () => {
    const bad = [];
    for (const n of textNodes(document.body)) {
      const el = n.parentElement; if (el.closest('textarea')) continue;
      const r = document.createRange(); r.selectNodeContents(n); const rects = [...r.getClientRects()].filter(x => x.width > 0); if (!rects.length) continue;
      const box = { l: Math.min(...rects.map(x => x.left)), r: Math.max(...rects.map(x => x.right)), t: Math.min(...rects.map(x => x.top)), b: Math.max(...rects.map(x => x.bottom)) };
      for (let a = el; a && a !== document.body; a = a.parentElement) {
        const cs = getComputedStyle(a), ab = a.getBoundingClientRect();
        const clipX = ['hidden', 'clip'].includes(cs.overflowX), clipY = ['hidden', 'clip'].includes(cs.overflowY), scrollX = ['auto', 'scroll'].includes(cs.overflowX);
        if ((clipX || scrollX) && (box.l < ab.left - 1 || box.r > ab.right + 1)) { bad.push(`${scrollX ? 'h-scroll' : 'clipped-x'}: ${label(el)} in ${label(a)}`); break; }
        if (clipY && (box.t < ab.top - 1 || box.b > ab.bottom + 1)) { bad.push(`clipped-y: ${label(el)} in ${label(a)}`); break; }
      }
      const cs = getComputedStyle(el); if (cs.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) bad.push(`ellipsis: ${label(el)}`);
    }
    // placeholders must be fully visible
    for (const f of document.querySelectorAll('textarea[placeholder], input[placeholder]')) {
      if (!vis(f) || f.value) continue; const cs = getComputedStyle(f);
      if (f.tagName === 'INPUT') { const c = document.createElement('canvas').getContext('2d'); c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; if (c.measureText(f.placeholder).width > f.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) + 1) bad.push(`placeholder clipped: ${label(f)}`); }
      else { const k = f.cloneNode(); k.value = f.placeholder; Object.assign(k.style, { position: 'absolute', visibility: 'hidden', maxHeight: 'none', height: 'auto', width: f.getBoundingClientRect().width + 'px', fieldSizing: 'content' }); f.parentNode.appendChild(k); const need = k.scrollHeight; k.remove(); if (need > f.clientHeight + 1) bad.push(`placeholder clipped: ${label(f)} (${need} > ${f.clientHeight})`); }
    }
    return [...new Set(bad)];
  };

  window.__overlap = () => {
    const sel = 'a, button, textarea, input, img, time, h1, h2, h3, p, dt, dd, li > span, .vg-status, .vg-media__chip, .vg-media__prov, .vg-card__title, .vg-card__meta';
    const els = [...document.querySelectorAll(sel)].filter(vis).filter(e => !e.closest('.vg-rail__panel') || getComputedStyle(e.closest('.vg-rail__panel')).display !== 'none');
    const rects = els.map(e => [...e.getClientRects()].filter(r => r.width > 0.5 && r.height > 0.5));
    const allowed = (a, b) => { const m = a.closest('.vg-media, .vg-ftile__media'); return m && m === b.closest('.vg-media, .vg-ftile__media'); };  // chips sit on their own image by design
    const bad = [];
    for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
      const a = els[i], b = els[j]; if (a.contains(b) || b.contains(a) || allowed(a, b)) continue;
      for (const ra of rects[i]) for (const rb of rects[j]) {
        const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
        if (w > 1 && h > 1) { bad.push(`${label(a)} × ${label(b)}`); break; }
      }
    }
    return [...new Set(bad)].slice(0, 40);
  };

  window.__layout = () => {
    const doc = document.documentElement, rail = document.querySelector('.vg-rail'), main = document.getElementById('main');
    const rb = rail && rail.getBoundingClientRect(), mb = main && main.getBoundingClientRect();
    const out = { horizontalScroll: doc.scrollWidth > doc.clientWidth + 1, scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth,
      railCollapsed: rail ? rb.bottom <= mb.top + 1 : null, railBesideContent: rail ? rb.right <= mb.left + 1 && rb.bottom > mb.top + 1 : null };
    const board = document.querySelector('.vg-board');
    if (board) { const cols = board.querySelectorAll('.vg-column'); const tops = [...cols].map(c => Math.round(c.getBoundingClientRect().top)); out.boardColumnsPerRow = tops.filter(t => t === tops[0]).length; out.minCardWidth = Math.round(Math.min(...[...document.querySelectorAll('.vg-card')].map(c => c.getBoundingClientRect().width))); }
    const panel = document.getElementById('context-panel'); if (panel) out.panelPosition = panel.classList.contains('vg-panel--below') ? 'below board' : 'beside board';
    const sched = [...document.querySelectorAll('.vg-schedule li')]; if (sched.length) out.upcoming = sched.map(li => ({ layout: getComputedStyle(li).gridTemplateAreas !== 'none' ? 'stacked' : 'tabular', parts: [...li.children].filter(c => c.textContent.trim()).map(c => vis(c) && c.getBoundingClientRect().right <= doc.clientWidth + 1) .every(Boolean) }));
    const ta = document.querySelector('.vg-composer__textarea'); if (ta) { const f = ta.closest('form').getBoundingClientRect(); out.composer = { position: getComputedStyle(ta.closest('form')).position, height: Math.round(f.height), textareaHeight: ta.clientHeight, bottom: Math.round(f.bottom + scrollY), pageHeight: doc.scrollHeight }; }
    return out;
  };

  window.__touch = () => [...document.querySelectorAll('a[href], button, textarea, input')].filter(vis).filter(e => !e.closest('.vg-skip')).filter(e => { const b = e.getBoundingClientRect(); return b.height < 44 || (e.tagName !== 'TEXTAREA' && b.width < 44); }).map(e => `${label(e)} ${Math.round(e.getBoundingClientRect().width)}×${Math.round(e.getBoundingClientRect().height)}`);
};

async function navAccess(page, mode) {
  const collapsed = await page.evaluate(() => getComputedStyle(document.querySelector('.vg-menu')).display !== 'none');
  const r = { collapsed };
  if (collapsed) {
    r.panelHiddenBeforeOpen = await page.evaluate(() => getComputedStyle(document.getElementById('vg-nav-panel')).display === 'none');
    await page.click('.vg-menu');
    r.expanded = await page.getAttribute('.vg-menu', 'aria-expanded');
    r.openLabel = (await page.textContent('.vg-menu')).trim();
  }
  r.links = await page.evaluate(() => ['Today', 'Studio', 'Knowledge', 'Connections'].map(n => { const a = [...document.querySelectorAll('.vg-nav a')].find(x => x.textContent.trim() === n); const b = a && a.getBoundingClientRect(); return { n, visible: !!a && b.width > 0 && b.right <= document.documentElement.clientWidth + 1, h: b ? Math.round(b.height) : 0 }; })
    .concat([(() => { const a = document.querySelector('.vg-account'); const b = a.getBoundingClientRect(); return { n: 'Account', visible: b.width > 0 && b.right <= document.documentElement.clientWidth + 1, h: Math.round(b.height), href: a.getAttribute('href') }; })()]));
  r.allReachable = r.links.every(l => l.visible) && (mode !== '320' || r.links.every(l => l.h >= 44));
  if (collapsed) {
    r.openChecks = { midword: await page.evaluate(() => __midword()), clipping: await page.evaluate(() => __clipping()), overlap: await page.evaluate(() => __overlap()), layout: await page.evaluate(() => __layout()) };
    await page.click('.vg-menu');
    Object.assign(r, await page.evaluate(() => { const b = document.querySelector('.vg-menu'); return { closedLabel: b.textContent.trim(), closedExpanded: b.getAttribute('aria-expanded'), focusReturned: document.activeElement === b }; }));
    await page.click('.vg-menu'); await page.keyboard.press('Escape');
    r.escapeFocusReturned = await page.evaluate(() => document.activeElement === document.querySelector('.vg-menu') && document.querySelector('.vg-menu').textContent.trim() === 'Menu');
    r.menuStatePass = r.expanded === 'true' && r.openLabel === 'Close' && r.closedLabel === 'Menu' && r.closedExpanded === 'false' && r.focusReturned && r.escapeFocusReturned;
  }
  r.orientation = await page.evaluate(() => ({ primaryCurrent: [...document.querySelectorAll('.vg-nav [aria-current="page"]')].map(a => a.textContent.trim()), accountCurrent: document.querySelector('.vg-account').getAttribute('aria-current') === 'page' }));
  return r;
}

const R = { chrome: browser.version(), date: new Date().toISOString(), method: { text200: 'CDP Page.setFontSizes standard 32px / fixed 26px (browser default text size ×2)', zoom200: '720×450 CSS px viewport at device scale factor 2 (layout-equivalent to a 1440×900 window at 200% browser zoom)' }, pages: {}, scenarios: {}, composer: {}, desktopDiff: {}, renders: [] };

for (const url of PAGES) {
  R.pages[url] = {};
  for (const mode of Object.keys(MODES)) {
    const { ctx, page } = await open(url, mode);
    const r = { layout: await page.evaluate(() => __layout()), midword: await page.evaluate(() => __midword()), clipping: await page.evaluate(() => __clipping()), overlap: await page.evaluate(() => __overlap()) };
    r.nav = await navAccess(page, mode);
    if (['1440', 'text200', '320'].includes(mode)) {
      const keys = [];
      if (r.nav.collapsed) await page.click('.vg-menu');   // traverse with the menu open so destinations and account are covered
      await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
      for (let i = 0; i < 60; i++) {
        await page.keyboard.press('Tab');
        const k = await page.evaluate(() => { const el = document.activeElement; if (!el || el === document.body) return null; const ringEl = el.closest('.vg-composer__box') && el.matches('textarea') ? el.closest('.vg-composer__box') : el; const cs = getComputedStyle(ringEl);
          el.scrollIntoView({ block: 'nearest' }); const b = el.getBoundingClientRect(); const top = document.elementFromPoint(Math.min(Math.max(b.left + b.width / 2, 0), innerWidth - 1), Math.min(Math.max(b.top + b.height / 2, 0), innerHeight - 1));
          return { el: `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || el.placeholder || '').trim().replace(/\s+/g, ' ').slice(0, 28)}"`, ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2, visible: !!top && (top === el || el.contains(top) || top.contains(el) || ringEl.contains(top)) }; });
        if (!k) continue;                       // passing through the document between cycles
        if (keys.length && k.el === keys[0].el) break; keys.push(k);
      }
      r.keyboard = { stops: keys.length, order: keys.map(k => k.el), missingRing: keys.filter(k => !k.ring).map(k => k.el), obscured: keys.filter(k => !k.visible).map(k => k.el) };
      if (r.keyboard.missingRing.length || r.keyboard.obscured.length) r.passKeyboard = false; else r.passKeyboard = true;
    }
    if (mode === '320') r.touchUnder44 = await page.evaluate(() => __touch());
    if (mode === '1440' || mode === '320' || mode === 'text200') { await page.addScriptTag({ content: AXE }); r.axe = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map(v => `${v.id} ×${v.nodes.length}`)); }
    r.pass = !r.layout.horizontalScroll && !r.midword.length && !r.clipping.length && !r.overlap.length && r.nav.allReachable && (!r.layout.composer || r.layout.composer.position === 'static');
    if (['text200', 'zoom200', '320'].includes(mode) && (r.layout.railBesideContent || !r.layout.railCollapsed)) r.pass = false;
    if (r.nav.openChecks && (r.nav.openChecks.clipping.length || r.nav.openChecks.overlap.length || r.nav.openChecks.midword.length || r.nav.openChecks.layout.horizontalScroll)) r.pass = false;
    if (r.touchUnder44 && r.touchUnder44.length) r.pass = false;
    if (r.nav.collapsed && !r.nav.menuStatePass) r.pass = false;
    if (url === '/account.html' && (r.nav.orientation.primaryCurrent.length || !r.nav.orientation.accountCurrent)) r.pass = false;
    R.pages[url][mode] = r;
    await ctx.close();
  }
}

// ---------------- stress scenarios ----------------
const LONG = {
  statement: 'I can do that — though this angle is starting to repeat. I’d try a customer-story video next. Before that, I’ll finish the pricing video and keep intros tighter on comparison videos.',
  owner: 'Never use fear-based selling. No “your boiler could be dangerous” stuff, ever — and say “spesa”, not “investment”.',
  fact: 'Boiler service & repair · heat-pump installs · €89 pre-winter check · emergency call-outs across Varese, Gallarate, Busto Arsizio and Saronno · written quote before any work starts · flat-fee call-out policy since 1998 · condominium maintenance contracts',
  business: 'Farmacia Vitalis di Lumino S.n.c. — Lumino · Design partner',
  email: 'amministrazione.farmaciavitalis.lumino@example-longdomain.it',
  // Stress title (replaces the contradictory “camera-free video” wording): a real technician records guided talking clips.
  title: 'I recommend answering “how long does a boiler service take?” with short guided clips Luca records on the job',
  composer: 'The €89 pre-winter check now ends on November 30, not December 15 — please update both upcoming videos, and mention that Marco joined the team and is happy to be on camera for the boiler service video next week. Also the new showroom opening hours are Monday to Saturday, 8:00 to 18:30, closed on Sundays and public holidays. And please keep the intro under five seconds. Luca can record the guided clips on Tuesday morning at the Gallarate job, and Marco can do the talking parts on Thursday afternoon if the weather is fine — otherwise we move both to next Monday and keep the same captions for Instagram and TikTok.',
};
const SCEN = [
  ['knowledge-long', '/knowledge.html', L => { document.querySelectorAll('.vg-turn__text')[1].lastChild.textContent = L.statement; document.querySelectorAll('.vg-turn__text')[0].lastChild.textContent = L.owner; document.querySelectorAll('.vg-fact__value')[2].textContent = L.fact; }],
  ['account-long', '/account.html', L => { document.querySelectorAll('.vg-rows dd')[0].textContent = L.business; document.querySelectorAll('.vg-rows dd')[1].innerHTML = 'Luca Moretti · <span class="vg-breakable">' + L.email + '</span>'; }],
  ['making-long', '/making.html', L => { document.querySelector('.vg-object__title').textContent = L.title; }],
  ['today-upcoming-long', '/today.html', L => { document.querySelector('.vg-schedule__title').textContent = '“' + L.title + '”'; document.querySelector('.vg-object__title').textContent = L.title; }],
  ['studio-detail-long', '/studio.html?select=rd1', L => { document.querySelector('.vg-card[data-key="rd1"] .vg-card__title').textContent = L.title; document.querySelector('.vg-panel__title').textContent = L.title; }],
  ['studio-idea-detail-field', '/studio.html?select=idea1', () => {}],
  ['composer-five-lines', '/today.html', L => { const t = document.querySelector('.vg-composer__textarea'); t.value = L.composer; t.dispatchEvent(new Event('input')); }],
  ['studio-composer-five-lines', '/studio.html?select=rd1', L => { const t = document.querySelector('.vg-composer__textarea'); t.value = L.composer; t.dispatchEvent(new Event('input')); }],
];
for (const [name, url, fn] of SCEN) {
  R.scenarios[name] = {};
  for (const mode of ['1440', '1216', 'text200', 'zoom200', '320']) {
    const { ctx, page } = await open(url, mode);
    await page.evaluate(fn, LONG); await page.waitForTimeout(60);
    const r = { layout: await page.evaluate(() => __layout()), midword: await page.evaluate(() => __midword()), clipping: await page.evaluate(() => __clipping()), overlap: await page.evaluate(() => __overlap()) };
    if (name.includes('composer')) r.textarea = await page.evaluate(() => { const t = document.querySelector('.vg-composer__textarea'), cs = getComputedStyle(t), lh = parseFloat(cs.lineHeight), pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom); return { visibleLines: Math.round((t.clientHeight - pad) / lh), contentLines: Math.round((t.scrollHeight - pad) / lh), scrollsInside: t.scrollHeight > t.clientHeight + 1 }; });
    r.pass = !r.layout.horizontalScroll && !r.midword.length && !r.clipping.length && !r.overlap.length && (!r.textarea || (r.textarea.visibleLines === 5 && r.textarea.scrollsInside));
    R.scenarios[name][mode] = r;
    if (mode === '320' || name.startsWith('composer')) await page.screenshot({ path: path.join(OUT, `validation_${name}_${mode}.png`), fullPage: true });
    await ctx.close();
  }
}

// ---------------- mobile Studio object view ----------------
R.objectView = {};
for (const mode of ['320', 'zoom200', 'text200']) {
  const { ctx, page } = await open('/studio.html', mode);
  await page.click('.vg-card[data-key="rd1"]'); await page.waitForTimeout(120);
  const o = await page.evaluate(() => { const board = document.querySelector('.vg-studio'), p = document.getElementById('context-panel'), t = document.getElementById('panel-title'), back = p.querySelector('[data-back]');
    return { dedicatedView: document.getElementById('main').classList.contains('vg-main--object'), boardHidden: getComputedStyle(board).display === 'none', backLabel: back && back.textContent.trim(), titleTop: Math.round(t.getBoundingClientRect().top), viewportH: innerHeight, focusOnTitle: document.activeElement === t,
      panelBeforeBoard: !!(p.compareDocumentPosition(board) & Node.DOCUMENT_POSITION_FOLLOWING), liveCardVisibleBeforeDetail: (() => { const l = document.querySelector('.vg-card[data-key="lv1"]'); return !!l.getClientRects().length && l.getBoundingClientRect().top < t.getBoundingClientRect().top; })() }; });
  o.checks = { midword: await page.evaluate(() => __midword()), clipping: await page.evaluate(() => __clipping()), overlap: await page.evaluate(() => __overlap()), layout: await page.evaluate(() => __layout()) };
  if (mode === '320') await page.screenshot({ path: path.join(OUT, 'validation_studio-object-view_320.png'), fullPage: true });
  await page.click('[data-back]'); await page.waitForTimeout(120);
  o.afterBack = await page.evaluate(() => ({ boardVisible: getComputedStyle(document.querySelector('.vg-studio')).display !== 'none', focusOnCard: document.activeElement === document.querySelector('.vg-card[data-key="rd1"]'), cardPressed: document.querySelector('.vg-card[data-key="rd1"]').getAttribute('aria-pressed') }));
  o.pass = mode === '320'
    ? o.dedicatedView && o.boardHidden && o.backLabel === 'Back to Studio' && o.titleTop < o.viewportH && o.focusOnTitle && !o.liveCardVisibleBeforeDetail && !o.checks.midword.length && !o.checks.clipping.length && !o.checks.overlap.length && !o.checks.layout.horizontalScroll && o.afterBack.boardVisible && o.afterBack.focusOnCard
    : !o.dedicatedView && o.backLabel === 'Back to context';   // approved: detail below the board at 200% text / zoom
  R.objectView[mode] = o;
  await ctx.close();
}

// ---------------- mobile object view · browser/system Back ----------------
{
  const { ctx, page } = await open('/studio.html', '320');
  const board = () => page.evaluate(() => ({ view: document.getElementById('main').classList.contains('vg-main--object'), boardVisible: getComputedStyle(document.querySelector('.vg-studio')).display !== 'none',
    scrollY: Math.round(scrollY), focusOnCard: document.activeElement === document.querySelector('.vg-card[data-key="rd1"]'), focusOnTitle: document.activeElement === document.getElementById('panel-title'), url: location.search }));
  await page.evaluate(() => { document.querySelector('.vg-card[data-key="rd1"]').scrollIntoView({ block: 'center' }); });
  await page.waitForTimeout(80);
  const y0 = await page.evaluate(() => Math.round(scrollY));
  await page.click('.vg-card[data-key="rd1"]'); await page.waitForTimeout(120);
  const opened = await board();
  await page.goBack({ waitUntil: 'commit' }); await page.waitForTimeout(200);
  const afterBrowserBack = await board();
  await page.goForward({ waitUntil: 'commit' }); await page.waitForTimeout(200);
  const afterForward = await board();
  await page.click('[data-back]'); await page.waitForTimeout(200);
  const afterBackToStudio = await board();
  const stateAfterButton = await page.evaluate(() => history.state);
  await ctx.close();
  const { ctx: c2, page: p2 } = await open('/studio.html?select=rd1', '320');
  const deepOpened = await p2.evaluate(() => ({ view: document.getElementById('main').classList.contains('vg-main--object'), url: location.search }));
  await p2.goBack({ waitUntil: 'commit' }); await p2.waitForTimeout(200);
  const deepBack = await p2.evaluate(() => ({ view: document.getElementById('main').classList.contains('vg-main--object'), boardVisible: getComputedStyle(document.querySelector('.vg-studio')).display !== 'none', focusOnCard: document.activeElement === document.querySelector('.vg-card[data-key="rd1"]'), url: location.search }));
  await p2.screenshot({ path: path.join(OUT, 'validation_studio-320_after-browser-back.png') });
  await c2.close();
  const near = y => Math.abs(y - y0) <= 2;
  R.historyBack = { boardScrollBefore: y0, opened, afterBrowserBack, afterForward, afterBackToStudio, stateAfterButton, deepOpened, deepBack,
    pass: opened.view && opened.url.includes('select=rd1')
      && !afterBrowserBack.view && afterBrowserBack.boardVisible && near(afterBrowserBack.scrollY) && afterBrowserBack.focusOnCard && !afterBrowserBack.url.includes('select')
      && afterForward.view && afterForward.focusOnTitle
      && !afterBackToStudio.view && near(afterBackToStudio.scrollY) && afterBackToStudio.focusOnCard && !!(stateAfterButton && stateAfterButton.vgBoard)
      && deepOpened.view && !deepBack.view && deepBack.boardVisible && deepBack.focusOnCard && !deepBack.url.includes('select') };
}

// ---------------- composer keys ----------------
for (const mode of ['1440', '320']) {
  const { ctx, page } = await open('/today.html', mode);
  const ta = page.locator('.vg-composer__textarea');
  const state = () => page.evaluate(() => ({ value: document.querySelector('.vg-composer__textarea').value, submitted: +(document.querySelector('form[data-composer]').dataset.submitted || 0) }));
  await ta.click(); await page.keyboard.type('Line one');
  await page.keyboard.press('Shift+Enter'); const afterShift = await state();
  await page.keyboard.type('Line two'); await page.keyboard.press('Enter'); const afterEnter = await state();
  await page.click('.vg-composer .vg-btn--primary'); const afterSend = await state();
  R.composer[mode] = { afterShiftEnter: afterShift, afterEnter, afterSendClick: afterSend,
    pass: mode === '1440' ? (afterShift.value === 'Line one\n' && afterShift.submitted === 0 && afterEnter.submitted === 1 && !afterEnter.value.endsWith('\n')) && afterSend.submitted === 2
                          : (afterEnter.value.endsWith('\n') && afterEnter.submitted === 0 && afterSend.submitted === 1) };
  await ctx.close();
}

// ---------------- required renders (full resolution) ----------------
async function shot(name, url, mode, { full = true, prep, clip, act } = {}) {
  const { ctx, page } = await open(url, mode, { dsf: 2 });
  if (prep) { await page.evaluate(prep, LONG); await page.waitForTimeout(80); }
  if (act) await act(page);
  const file = path.join(OUT, name + '.png');
  // Playwright's fullPage capture re-applies device metrics and drops the CDP text-size setting, so text-size renders
  // grow the viewport to the page height, re-apply the setting and capture the viewport instead.
  if (page.__setText && full && !clip) { const h = await page.evaluate(() => document.documentElement.scrollHeight); await page.setViewportSize({ width: MODES[mode].viewport.width, height: h }); await page.__setText(); await page.waitForTimeout(150); }
  const check = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
  if (clip) await page.locator(clip).screenshot({ path: file }); else await page.screenshot({ path: file, fullPage: full && !page.__setText });
  const after = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
  R.renderTextCheck = R.renderTextCheck || {}; R.renderTextCheck[name] = { rootFontSizeBefore: check, rootFontSizeAfter: after };
  R.renders.push({ name, url, mode, method: MODES[mode], full, clip: clip || null });
  await ctx.close();
}
await shot('R01_today_text200_1440', '/today.html', 'text200');
await shot('R02_studio-ready_text200_1440', '/studio.html?select=rd1', 'text200');
await shot('R03_today_zoom200', '/today.html', 'zoom200');
await shot('R04_studio-ready_zoom200', '/studio.html?select=rd1', 'zoom200');
await shot('R05_today_320_complete', '/today.html', '320');
await shot('R05b_today_320_menu-open', '/today.html?menu=open', '320');
await shot('R06_studio_320_media-and-ready-detail', '/studio.html?select=rd1', '320');
await shot('R06b_studio_320_menu-open', '/studio.html?select=rd1&menu=open', '320', { full: false });
const five = L => { const t = document.querySelector('.vg-composer__textarea'); t.value = L.composer; t.dispatchEvent(new Event('input')); };
await shot('R07a_composer_one-line_1440', '/today.html', '1440', { clip: 'form[data-composer]' });
await shot('R07b_composer_five-lines_1440', '/today.html', '1440', { clip: 'form[data-composer]', prep: five });
await shot('R07c_composer_one-line_320', '/today.html', '320', { clip: 'form[data-composer]' });
await shot('R07d_composer_five-lines_320', '/today.html', '320', { clip: 'form[data-composer]', prep: five });
await shot('R07e_composer_placeholder_text200', '/today.html', 'text200', { clip: 'form[data-composer]' });
const openRd1 = async page => { await page.click('.vg-card[data-key="rd1"]'); await page.waitForTimeout(150); };
await shot('R13_studio_320_object-view_ready', '/studio.html', '320', { act: openRd1 });
await shot('R13b_studio_320_after-back-to-studio', '/studio.html', '320', { full: false, act: async page => { await openRd1(page); await page.click('[data-back]'); await page.waitForTimeout(150); } });
await shot('R14_account_1440', '/account.html', '1440');
await shot('R14b_account_320_menu-open', '/account.html?menu=open', '320', { full: false });
await shot('R08_knowledge_1440', '/knowledge.html', '1440', { full: false });
await shot('R09_account_1440', '/account.html', '1440');
await shot('R10_making_1440', '/making.html', '1440', { full: false });
await shot('R11_week-one_1440', '/week-one.html', '1440', { full: false });
await shot('R12_qa-deferred_1440', '/first-video-deferred.html', '1440', { full: false });

// ---------------- desktop pixel diff against the pre-responsive baseline ----------------
const BASE = path.join(ROOT, 'renders/_baseline-before-responsive');
const DIFFS = [['B1_knowledge_1440', '/knowledge.html', 1440, 900, false], ['B2_knowledge_1216', '/knowledge.html', 1216, 1050, false], ['B3_account-settings_1440', '/account.html', 1440, 900, true], ['B4_account-settings_1216', '/account.html', 1216, 1050, true], ['B5_loading_making_1440', '/making.html', 1440, 900, false], ['B6_empty_week-one_1440', '/week-one.html', 1440, 900, false], ['B7_qa-deferred_first-video-deferred_1440', '/first-video-deferred.html', 1440, 900, false], ['A21-1_today-ready-media_1440', '/today-ready.html', 1440, 900, false], ['A21-3_studio-populated-media_1440', '/studio.html', 1440, 900, false], ['A21-4_studio-selected-detail_1440', '/studio.html?select=rd1', 1440, 900, false], ['A21-5_studio-selected-detail-below_1216', '/studio.html?select=rd1', 1216, 1050, true]];
const cmp = await browser.newPage();
for (const [name, url, w, h, full] of DIFFS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 }); const page = await ctx.newPage();
  await page.goto(base + url, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(250);
  const now = await page.screenshot({ fullPage: full }); await ctx.close();
  const before = fs.readFileSync(path.join(BASE, name + '.png'));
  R.desktopDiff[name] = await cmp.evaluate(async ([a, b]) => {
    const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const W = Math.min(ia.width, ib.width), H = Math.min(ia.height, ib.height);
    const get = img => { const c = new OffscreenCanvas(W, H); const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, W, H).data; };
    const da = get(ia), db = get(ib); let diff = 0, minY = H, maxY = 0;
    for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) > 24) { diff++; const y = Math.floor(i / 4 / W); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    return { sizeBefore: `${ib.width}×${ib.height}`, sizeNow: `${ia.width}×${ia.height}`, changedPixelsPct: +(100 * diff / (W * H)).toFixed(3), changedRowsCssPx: diff ? [Math.round(minY / 2), Math.round(maxY / 2)] : null };
  }, ['data:image/png;base64,' + now.toString('base64'), 'data:image/png;base64,' + before.toString('base64')]);
}

await browser.close(); server.close();
fs.writeFileSync(path.join(ROOT, 'validation/responsive-results.json'), JSON.stringify(R, null, 2));

// ---------------- console summary ----------------
for (const [u, modes] of Object.entries(R.pages)) console.log(u.padEnd(28), Object.entries(modes).map(([m, r]) => `${m}:${r.pass ? 'PASS' : 'FAIL'}${r.pass ? '' : `(hs${+r.layout.horizontalScroll} mw${r.midword.length} cl${r.clipping.length} ov${r.overlap.length} nav${+r.nav.allReachable} rail${+!!r.layout.railBesideContent}${r.touchUnder44 ? ' t' + r.touchUnder44.length : ''})`}`).join('  '));
for (const [s, modes] of Object.entries(R.scenarios)) console.log(s.padEnd(28), Object.entries(modes).map(([m, r]) => `${m}:${r.pass ? 'PASS' : 'FAIL'}${r.textarea ? `[${r.textarea.visibleLines}/${r.textarea.contentLines}]` : ''}${r.pass ? '' : `(hs${+r.layout.horizontalScroll} mw${r.midword.length} cl${r.clipping.length} ov${r.overlap.length})`}`).join('  '));
for (const [u, modes] of Object.entries(R.pages)) console.log('keyboard', u, Object.entries(modes).filter(([, r]) => r.keyboard).map(([m, r]) => `${m}:${r.keyboard.stops} stops ring-missing ${r.keyboard.missingRing.length} obscured ${r.keyboard.obscured.length}; axe ${JSON.stringify(r.axe)}`).join(' | '));
console.log('object view', JSON.stringify(Object.fromEntries(Object.entries(R.objectView).map(([m, o]) => [m, { pass: o.pass, ...o, checks: undefined, cl: o.checks.clipping.length, ov: o.checks.overlap.length, mw: o.checks.midword.length }]))));
console.log('history back', JSON.stringify(R.historyBack));
console.log('composer keys', JSON.stringify(R.composer));
console.log('desktop diff', JSON.stringify(R.desktopDiff));

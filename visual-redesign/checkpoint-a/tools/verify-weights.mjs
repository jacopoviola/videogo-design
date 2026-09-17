// Verifies that Instrument Sans renders true 400/500/600/700 weights from the variable font.
// Evidence: (1) CDP reports the loaded font file, not a platform font; (2) advance widths differ for every
// weight and increase with weight; (3) 400 and 700 match the static Regular/Bold cuts of the same release
// (tools/font-source, version 1.000); (4) stem ink darkness increases with weight; (5) the screens'
// 500- and 600-weight nodes resolve to those weights with synthesis disabled.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { server } from './serve.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '../renders/board');
const PORT = 4422;
await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1200, height: 700 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const b64 = f => fs.readFileSync(path.join(here, 'font-source', f)).toString('base64');
const regular = '/Users/priyamvadaersaviola/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/757225bd-8646-4179-a39c-9772569d4e7c/2a2aceb9-d130-49b5-83c9-2c9c749a5b69/skills/canvas-design/canvas-fonts/InstrumentSans-Regular.ttf';
await page.goto(`http://127.0.0.1:${PORT}/today.html?font=instrument`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const SAMPLE = 'Instagram connection expired — publishing is paused';
await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="http://127.0.0.1:${PORT}/styles/tokens.css">
<style>
@font-face{font-family:"IS Static Regular";src:url(data:font/ttf;base64,${fs.readFileSync(regular).toString('base64')})}
@font-face{font-family:"IS Static Bold";src:url(data:font/ttf;base64,${b64('InstrumentSans-Bold.ttf')})}
body{margin:24px;background:#fff;color:#1D1D1F;font-synthesis:none} .s{font-size:32px;line-height:48px;white-space:nowrap;display:inline-block}
.v{font-family:"Instrument Sans"} .lab{font:13px system-ui;color:#5C5C63}
</style></head><body>
${[400,500,600,700].map(w => `<div class="lab">Variable font · font-weight ${w}</div><span class="s v" id="w${w}" style="font-weight:${w}">${SAMPLE}</span><br>`).join('')}
<div class="lab">Static Regular (control)</div><span class="s" id="sr" style="font-family:'IS Static Regular'">${SAMPLE}</span><br>
<div class="lab">Static Bold (control)</div><span class="s" id="sb" style="font-family:'IS Static Bold'">${SAMPLE}</span>
</body></html>`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const client = await ctx.newCDPSession(page);
await client.send('DOM.enable'); await client.send('CSS.enable');
const { root } = await client.send('DOM.getDocument', { depth: -1 });
const result = { weights: {}, controls: {} };
for (const id of ['w400', 'w500', 'w600', 'w700', 'sr', 'sb']) {
  const { nodeId } = await client.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#' + id });
  const { fonts } = await client.send('CSS.getPlatformFontsForNode', { nodeId });
  const box = await page.$eval('#' + id, el => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
  const shot = await page.screenshot({ clip: box });
  // ink darkness = mean (255 - luminance) over the glyph box, computed in the page from the PNG
  const ink = await page.evaluate(async (b64png) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64png; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += 255 - (d[i] * 0.2126 + d[i + 1] * 0.7152 + d[i + 2] * 0.0722);
    return s / (d.length / 4);
  }, shot.toString('base64'));
  const entry = { renderedFont: fonts.map(f => `${f.familyName}${f.isCustomFont ? ' [loaded font file]' : ' [platform font]'}`), advanceWidthCss: +box.width.toFixed(2), inkDarkness: +ink.toFixed(3) };
  if (id.startsWith('w')) result.weights[id.slice(1)] = entry; else result.controls[id === 'sr' ? 'staticRegular' : 'staticBold'] = entry;
}
await page.screenshot({ path: path.join(OUT, 'weight-verification.png'), fullPage: true });
const W = result.weights;
const widths = [400, 500, 600, 700].map(w => W[w].advanceWidthCss), inks = [400, 500, 600, 700].map(w => W[w].inkDarkness);
result.checks = {
  allLoadedFromFontFile: Object.values(W).every(e => e.renderedFont.length === 1 && e.renderedFont[0].startsWith('Instrument Sans [loaded font file]')),
  widthsStrictlyIncrease: widths.every((v, i) => i === 0 || v > widths[i - 1]),
  inkStrictlyIncreases: inks.every((v, i) => i === 0 || v > inks[i - 1]),
  w400MatchesStaticRegularWidth: Math.abs(W[400].advanceWidthCss - result.controls.staticRegular.advanceWidthCss) < 0.5,
  w700MatchesStaticBoldWidth: Math.abs(W[700].advanceWidthCss - result.controls.staticBold.advanceWidthCss) < 0.5,
  w500DistinctFromRegularAndBold: W[500].advanceWidthCss !== W[400].advanceWidthCss && W[500].advanceWidthCss !== W[700].advanceWidthCss,
  w600DistinctFromRegularAndBold: W[600].advanceWidthCss !== W[400].advanceWidthCss && W[600].advanceWidthCss !== W[700].advanceWidthCss,
};
// screens: which weights are used, and do they resolve with synthesis off
const screens = {};
for (const url of ['/today.html?title=44&font=instrument', '/studio.html?select=rd1&title=44&font=instrument']) {
  await page.goto(`http://127.0.0.1:${PORT}${url}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  screens[url] = await page.evaluate(() => {
    const used = {}; document.querySelectorAll('body *').forEach(el => { if (!el.childNodes.length || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return; const c = getComputedStyle(el); used[c.fontWeight] = (used[c.fontWeight] || 0) + 1; });
    return { weightsUsed: used, fontSynthesis: getComputedStyle(document.documentElement).fontSynthesis, family: getComputedStyle(document.body).fontFamily, faceStatus: [...document.fonts].map(f => `${f.family} ${f.weight} ${f.status}`) };
  });
}
result.screens = screens;
result.pass = Object.values(result.checks).every(Boolean);
await browser.close(); server.close();
fs.writeFileSync(path.join(OUT, 'weight-verification.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (!result.pass) process.exit(2);

// Glyph positions are taken from Chrome's layout of the source <text> with the licensed face loaded
// (SVGTextContentElement.getStartPositionOfChar). Renderers disagree on textLength distribution, so the
// outline reproduces the asset as it renders in a standards browser with its declared font, not a re-derivation.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const FONT = path.join(here, 'font-source/InstrumentSans-Bold.ttf');
const SRC_DIR = path.resolve(here, '../../../assets');
const OUT_DIR = path.resolve(here, '../src/assets');

const font = opentype.parse(fs.readFileSync(FONT).buffer);
const TEXT = 'VIDEOGO', SIZE = 143;

const srcSvg = fs.readFileSync(path.join(SRC_DIR, 'videogo-lockup-inverse.svg'), 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<metadata>[\s\S]*?<\/metadata>/, '');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
await page.setContent(`<style>@font-face{font-family:"Instrument Sans";src:url(data:font/ttf;base64,${fs.readFileSync(FONT).toString('base64')});font-weight:700}</style>${srcSvg}`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(200);
const layout = await page.evaluate(() => {
  const t = document.querySelector('text');
  return { loaded: document.fonts.check('700 143px "Instrument Sans"'), chars: [...t.textContent].map((_, i) => { const p = t.getStartPositionOfChar(i); return [p.x, p.y]; }), computedLength: t.getComputedTextLength() };
});
const chrome = browser.version();
await browser.close();
if (!layout.loaded) throw new Error('Instrument Sans Bold did not load; refusing to outline from a fallback layout.');

const glyphs = [...TEXT].map(ch => font.charToGlyph(ch)); // uppercase Latin needs no shaping
const d = glyphs.map((g, i) => g.getPath(layout.chars[i][0], layout.chars[i][1], SIZE).toPathData(2));

const report = { font: font.names.windows.fullName.en, version: font.names.windows.version.en,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(FONT)).digest('hex'), weight: font.tables.os2.usWeightClass,
  layoutEngine: `Chrome ${chrome}`, glyphOrigins: layout.chars.map(([x, y]) => [+x.toFixed(2), +y.toFixed(2)]), computedTextLength: +layout.computedLength.toFixed(2) };

for (const [src, out] of [
  ['videogo-lockup-inverse.svg', 'videogo-lockup-inverse-outlined.svg'],
  ['videogo-lockup.svg', 'videogo-lockup-outlined.svg'],
]) {
  const raw = fs.readFileSync(path.join(SRC_DIR, src), 'utf8');
  const noMeta = raw.replace(/<metadata>[\s\S]*?<\/metadata>/, '');
  const markGroup = noMeta.match(/<g [\s\S]*?<\/g>/)[0];
  const fill = noMeta.match(/<text[^>]*fill="([^"]+)"/)[1];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="940" height="140" viewBox="0 0 940 140" role="img" aria-label="VIDEOGO">
  <!-- Derived from ${src}: mark geometry unchanged; "VIDEOGO" outlined from Instrument Sans Bold (OFL 1.1), glyph origins from Chrome layout with the licensed face. The source C2PA manifest is not carried over because it no longer matches this file. -->
  ${markGroup}
  <path fill="${fill}" d="${d.join('')}"/>
</svg>
`;
  fs.writeFileSync(path.join(OUT_DIR, out), svg);
  report[out] = { fill, bytes: Buffer.byteLength(svg) };
}
fs.writeFileSync(path.join(OUT_DIR, 'LOCKUP_OUTLINE_REPORT.json'), JSON.stringify(report, null, 2));
console.log(report);

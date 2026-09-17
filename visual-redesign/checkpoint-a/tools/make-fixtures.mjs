// Generates DEMO FIXTURE media for Checkpoint A2. No real Videogo or customer media exists in the
// repositories (see A2_MEDIA_NOTES.md). Every file is flat vector illustration, carries
// <title>/<desc> “DEMO FIXTURE — not customer media” and a fixture_ filename. A2.1: no burned-in mark;
// the interface labels each instance “Demo fixture” exactly once. Illustration style is not Videogo's brand style. All text is outlined (Instrument Sans Bold, OFL) so it never depends on a font.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '../src/assets/media');
fs.mkdirSync(OUT, { recursive: true });
const font = opentype.parse(fs.readFileSync(path.join(here, 'font-source/InstrumentSans-Bold.ttf')).buffer);

function text(str, x, y, size, { anchor = 'start', fill = '#000', track = 0 } = {}) {
  const glyphs = [...str].map(c => font.charToGlyph(c));
  const scale = size / font.unitsPerEm;
  const adv = glyphs.map(g => g.advanceWidth * scale + track);
  const width = adv.reduce((a, b) => a + b, 0) - track;
  let cx = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  // opentype.js can emit NaN in toPathData when scaling: draw glyphs in font units (integer) and scale/translate.
  const parts = glyphs.map((g, i) => { const p = `<path transform="translate(${cx.toFixed(2)} ${Number(y).toFixed(2)}) scale(${(size / font.unitsPerEm).toFixed(5)})" d="${g.getPath(0, 0, font.unitsPerEm).toPathData(0)}"/>`; cx += adv[i]; return p; }).join('');
  if (parts.includes('NaN')) throw new Error('NaN in outlined text: ' + str);
  return `<g fill="${fill}">${parts}</g>`;
}
const mark = (x, y, anchor = 'middle', fill = '#1D1D1F', bg = 'rgba(255,255,255,0.86)') => {
  const w = 300, h = 56, left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return `<rect x="${left}" y="${y - 40}" width="${w}" height="${h}" rx="10" fill="${bg}"/>${text('DEMO FIXTURE', left + w / 2, y, 26, { anchor: 'middle', fill, track: 2 })}`;
};
const head = (w, h, what) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="DEMO FIXTURE — ${what}">
<title>DEMO FIXTURE — ${what}</title><desc>Representative design fixture for the Videogo visual redesign review. Not customer media, not a real Videogo output, not evidence.</desc>`;

// 1 · READY video poster frame · 9:16 · “Heat pump vs new boiler: the honest math” (voiceover + comparison graphics)
fs.writeFileSync(path.join(OUT, 'fixture_ready_heat-pump-vs-boiler_9x16.svg'), `${head(1080, 1920, 'poster frame stand-in for “Heat pump vs new boiler: the honest math”')}
<rect width="1080" height="1920" fill="#EAE3D6"/>
${text('Heat pump', 96, 380, 132, { fill: '#1F2B30' })}
${text('vs new boiler', 96, 530, 132, { fill: '#1F2B30' })}
${text('the honest math', 100, 640, 64, { fill: '#B4533A' })}
<g transform="translate(96 760)">
  <rect width="420" height="560" rx="36" fill="#F7F3EC"/>
  <rect x="60" y="80" width="300" height="220" rx="18" fill="#C9D3D1"/>
  <circle cx="180" cy="190" r="78" fill="none" stroke="#1F2B30" stroke-width="14"/>
  <path d="M180 120v140M110 190h140M130 140l100 100M230 140L130 240" stroke="#1F2B30" stroke-width="10"/>
  <rect x="290" y="120" width="40" height="140" rx="8" fill="#1F2B30" opacity=".85"/>
  <rect x="60" y="340" width="300" height="24" rx="12" fill="#1F2B30" opacity=".15"/>
  <rect x="60" y="384" width="220" height="24" rx="12" fill="#1F2B30" opacity=".15"/>
  ${text('Heat pump', 210, 500, 56, { anchor: 'middle', fill: '#1F2B30' })}
</g>
<g transform="translate(564 760)">
  <rect width="420" height="560" rx="36" fill="#F7F3EC"/>
  <rect x="110" y="60" width="200" height="300" rx="20" fill="#D8CBB6"/>
  <rect x="150" y="110" width="120" height="56" rx="10" fill="#1F2B30"/>
  <rect x="175" y="126" width="40" height="24" rx="4" fill="#E9A93C"/>
  <path d="M160 360v60M210 360v80M260 360v60" stroke="#B4533A" stroke-width="16" stroke-linecap="round"/>
  ${text('New boiler', 210, 500, 56, { anchor: 'middle', fill: '#1F2B30' })}
</g>
</svg>
`);

// 2 · LIVE video poster frame · 4:5 · “The €89 pre-winter check, explained”
fs.writeFileSync(path.join(OUT, 'fixture_live_89-pre-winter-check_4x5.svg'), `${head(1080, 1350, 'poster frame stand-in for “The €89 pre-winter check, explained”')}
<rect width="1080" height="1350" fill="#21393F"/>
<circle cx="820" cy="360" r="260" fill="#2C4A50"/>
<g transform="translate(640 170)">
  <rect width="300" height="400" rx="26" fill="#E8E1D4"/>
  <rect x="50" y="60" width="200" height="80" rx="12" fill="#21393F"/>
  <rect x="80" y="84" width="60" height="32" rx="6" fill="#E9A93C"/>
  <path d="M90 400v70M150 400v90M210 400v70" stroke="#C9D3D1" stroke-width="20" stroke-linecap="round"/>
</g>
${text('€89', 90, 760, 260, { fill: '#F4EFE6' })}
${text('pre-winter check,', 96, 900, 82, { fill: '#F4EFE6' })}
${text('explained', 96, 1000, 82, { fill: '#E9A93C' })}
</svg>
`);

// 3 · IDEA source image · 4:3 landscape · stand-in for one of “your real job photos”
fs.writeFileSync(path.join(OUT, 'fixture_idea_job-photo_4x3.svg'), `${head(1600, 1200, 'illustrative stand-in for a job photo (not a photograph)')}
<rect width="1600" height="1200" fill="#DCD5CA"/>
<rect y="860" width="1600" height="340" fill="#B9AE9E"/>
<rect x="110" y="160" width="360" height="460" rx="8" fill="#EFE9DF"/>
<path d="M110 390h360M290 160v460" stroke="#CFC6B8" stroke-width="12"/>
<g transform="translate(740 170)">
  <rect width="380" height="560" rx="26" fill="#F3EFE8"/>
  <rect x="70" y="80" width="240" height="96" rx="14" fill="#2B3538"/>
  <rect x="104" y="108" width="72" height="40" rx="6" fill="#7FB6A8"/>
  <path d="M110 560v250M190 560v290M270 560v250" stroke="#B87333" stroke-width="30" stroke-linecap="round"/>
  <path d="M110 810h-260M270 810h240" stroke="#B87333" stroke-width="30" stroke-linecap="round"/>
</g>
<g transform="translate(1240 880)">
  <rect width="250" height="150" rx="14" fill="#9C3D2E"/>
  <rect x="80" y="-40" width="90" height="56" rx="12" fill="none" stroke="#2B3538" stroke-width="16"/>
</g>
</svg>
`);

// 3b · Feed component specimen posters (9:16). Titles from CONTENT_REALITY_SET / prototype; component use only.
function poster(file, what, { bg, ink, accent, lines, shape, size = 120 }) {
  const shapes = {
    checklist: `<g transform="translate(120 900)">${[0, 1, 2].map(i => `<rect y="${i * 190}" width="840" height="150" rx="24" fill="${accent}" opacity=".18"/><rect x="40" y="${i * 190 + 45}" width="60" height="60" rx="12" fill="none" stroke="${ink}" stroke-width="10"/><rect x="140" y="${i * 190 + 62}" width="${520 - i * 90}" height="26" rx="13" fill="${ink}" opacity=".55"/>`).join('')}</g>`,
    quote: `<g transform="translate(120 900)"><rect width="840" height="520" rx="30" fill="${accent}" opacity=".2"/><rect x="60" y="80" width="600" height="30" rx="15" fill="${ink}" opacity=".6"/><rect x="60" y="150" width="700" height="30" rx="15" fill="${ink}" opacity=".6"/><rect x="60" y="220" width="480" height="30" rx="15" fill="${ink}" opacity=".6"/><rect x="60" y="360" width="260" height="90" rx="16" fill="${accent}"/></g>`,
    service: `<g transform="translate(300 860)"><rect width="480" height="620" rx="36" fill="${accent}" opacity=".9"/><rect x="90" y="90" width="300" height="110" rx="16" fill="${ink}"/><circle cx="240" cy="360" r="90" fill="none" stroke="${ink}" stroke-width="18"/><path d="M160 620v90M240 620v120M320 620v90" stroke="${ink}" stroke-width="22" stroke-linecap="round"/></g>`,
    radiator: `<g transform="translate(140 920)">${[0,1,2,3,4,5].map(i => `<rect x="${i * 130}" width="100" height="480" rx="30" fill="${accent}"/>`).join('')}<rect x="-20" y="440" width="820" height="40" rx="20" fill="${ink}" opacity=".5"/></g>`,
  };
  fs.writeFileSync(path.join(OUT, file), `${head(1080, 1920, what)}
<rect width="1080" height="1920" fill="${bg}"/>
${lines.map((l, i) => text(l, 110, 340 + i * size * 1.15, size, { fill: ink })).join('\n')}
${shapes[shape]}
</svg>
`);
}
poster('fixture_feed_why-price_9x16.svg', 'feed poster stand-in for “Why we show the price before we start the job”', { bg: '#F2E9DA', ink: '#2A2622', accent: '#C0703A', lines: ['Why we show the', 'price before we', 'start the job'], shape: 'quote', size: 104 });
poster('fixture_feed_3-signs_9x16.svg', 'feed poster stand-in for “3 signs your boiler needs a check”', { bg: '#1E3A4C', ink: '#F2EFE8', accent: '#8CC0D6', lines: ['3 signs your', 'boiler needs', 'a check'], shape: 'checklist' });
poster('fixture_feed_boiler-service_9x16.svg', 'feed poster stand-in for “What a boiler service actually includes”', { bg: '#E4E8E1', ink: '#243128', accent: '#9DB59A', lines: ['What a boiler', 'service actually', 'includes'], shape: 'service', size: 108 });
poster('fixture_feed_radiator-bleeding_9x16.svg', 'feed poster stand-in for “Radiator bleeding in 90 seconds”', { bg: '#3A2C3F', ink: '#F5EEF3', accent: '#D9A6C4', lines: ['Radiator', 'bleeding in', '90 seconds'], shape: 'radiator' });

// 4 · Component specimens (not linked to any Videogo object): ratio + safe-zone guides
function specimen(name, w, h, { titleBox, subjectBox, label }) {
  const [tx, ty, tw, th] = titleBox.map((v, i) => v * (i % 2 ? h : w));
  const [sx, sy, sw, sh] = subjectBox.map((v, i) => v * (i % 2 ? h : w));
  fs.writeFileSync(path.join(OUT, name), `${head(w, h, `component specimen ${label}`)}
<rect width="${w}" height="${h}" fill="#D9DEE3"/>
<path d="M0 0L${w} ${h}M${w} 0L0 ${h}" stroke="#C4CBD2" stroke-width="4"/>
<rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="${Math.min(sw, sh) / 2}" fill="#8FA3B3"/>
${text('SUBJECT', sx + sw / 2, sy + sh / 2 + 18, Math.max(28, Math.round(w / 30)), { anchor: 'middle', fill: '#fff' })}
<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" fill="#465A6A"/>
${text('TITLE-SAFE', tx + tw / 2, ty + th / 2 + 18, Math.max(28, Math.round(w / 30)), { anchor: 'middle', fill: '#fff' })}
${text(label, w / 2, h - 40, Math.max(30, Math.round(w / 26)), { anchor: 'middle', fill: '#465A6A' })}
</svg>
`);
}
specimen('specimen_9x16.svg', 1080, 1920, { titleBox: [0.1, 0.22, 0.8, 0.1], subjectBox: [0.25, 0.42, 0.5, 0.28], label: 'SPECIMEN 9:16' });
specimen('specimen_1x1.svg', 1080, 1080, { titleBox: [0.14, 0.18, 0.72, 0.14], subjectBox: [0.3, 0.38, 0.4, 0.4], label: 'SPECIMEN 1:1' });
specimen('specimen_4x5.svg', 1080, 1350, { titleBox: [0.1, 0.18, 0.8, 0.14], subjectBox: [0.28, 0.36, 0.44, 0.38], label: 'SPECIMEN 4:5' });
specimen('specimen_16x9_wide-title.svg', 1920, 1080, { titleBox: [0.06, 0.12, 0.88, 0.18], subjectBox: [0.4, 0.4, 0.2, 0.36], label: 'SPECIMEN 16:9' });
console.log(fs.readdirSync(OUT));

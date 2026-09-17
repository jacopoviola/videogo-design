// Feed Preview DEMO FIXTURES (addendum): varied visual content so the Feed grid is tested as a real media surface —
// people, hands, interiors, a street, a macro close-up, a before/after carousel — at 9:16, 16:9, 1:1, 4:5 and 3:4.
// Illustrative vector stand-ins, NOT photographs, NOT customer media, NOT Videogo's brand style. Tonal shading and
// grain belong to the fixture image content only; the interface itself stays flat. Text is outlined (Instrument Sans Bold, OFL).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '../src/assets/media');
const font = opentype.parse(fs.readFileSync(path.join(here, 'font-source/InstrumentSans-Bold.ttf')).buffer);

function text(str, x, y, size, { anchor = 'start', fill = '#000' } = {}) {
  const glyphs = [...str].map(c => font.charToGlyph(c));
  const s = size / font.unitsPerEm, adv = glyphs.map(g => g.advanceWidth * s), width = adv.reduce((a, b) => a + b, 0);
  let cx = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  const parts = glyphs.map((g, i) => { const p = `<path transform="translate(${cx.toFixed(2)} ${y}) scale(${s.toFixed(5)})" d="${g.getPath(0, 0, font.unitsPerEm).toPathData(0)}"/>`; cx += adv[i]; return p; }).join('');
  if (parts.includes('NaN')) throw new Error('NaN in outlined text: ' + str);
  return `<g fill="${fill}">${parts}</g>`;
}
const svg = (file, w, h, what, body) => fs.writeFileSync(path.join(OUT, file), `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="DEMO FIXTURE — ${what}">
<title>DEMO FIXTURE — ${what}</title><desc>Representative design fixture for the Videogo visual redesign review. Illustration, not a photograph. Not customer media, not a real Videogo output, not evidence, not Videogo's brand style.</desc>
<defs>
<filter id="soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="softer" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="36"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.10"/></feComponentTransfer></filter>
<radialGradient id="vignette" cx="50%" cy="45%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".35"/></radialGradient>
${body.defs || ''}
</defs>
${body.content}
<rect width="${w}" height="${h}" fill="url(#vignette)"/>
<rect width="${w}" height="${h}" filter="url(#grain)"/>
</svg>
`);

// 1 · Imported Reel · 9:16 · technician speaking to camera in a customer's kitchen
svg('fixture_import_technician-kitchen_9x16.svg', 1080, 1920, 'imported Reel poster stand-in: technician speaking to camera in a kitchen', {
  defs: `<linearGradient id="wall1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E4D3B8"/><stop offset="1" stop-color="#A88B69"/></linearGradient>
<linearGradient id="skin1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9C6848"/><stop offset="1" stop-color="#6E432B"/></linearGradient>
<linearGradient id="shirt1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F4A6B"/><stop offset="1" stop-color="#1B2C42"/></linearGradient>`,
  content: `<rect width="1080" height="1920" fill="url(#wall1)"/>
<g filter="url(#softer)">
  <rect x="-60" y="260" width="380" height="720" rx="10" fill="#FBF4E6"/>
  <rect x="640" y="140" width="520" height="420" rx="8" fill="#7A5E45"/>
  <rect x="660" y="600" width="480" height="40" fill="#5A4636"/>
  <rect x="-40" y="1320" width="1160" height="120" fill="#4B3D33"/>
  <circle cx="860" cy="1190" r="70" fill="#C9A15B"/>
  <rect x="120" y="1180" width="120" height="150" rx="16" fill="#6F8F7A"/>
</g>
<path d="M140 1920 C150 1390 250 1140 540 1120 C830 1140 930 1390 940 1920 Z" fill="url(#shirt1)"/>
<path d="M440 1130 L540 1270 L640 1130" fill="none" stroke="#14202F" stroke-width="18" stroke-linejoin="round"/>
<rect x="690" y="1300" width="120" height="70" rx="10" fill="#E9A93C" opacity=".9"/>
<rect x="468" y="960" width="144" height="200" rx="60" fill="#6A402A"/>
<ellipse cx="540" cy="770" rx="178" ry="222" fill="url(#skin1)"/>
<ellipse cx="366" cy="790" rx="30" ry="54" fill="#7F4E33"/><ellipse cx="714" cy="790" rx="30" ry="54" fill="#6E432B"/>
<path d="M368 720 C360 560 450 520 540 520 C650 520 724 570 712 720 C690 640 620 610 540 612 C460 612 392 640 368 720 Z" fill="#17120F"/>
<path d="M430 740 q40 -22 80 0 M570 740 q40 -22 80 0" stroke="#21150F" stroke-width="14" fill="none" stroke-linecap="round"/>
<ellipse cx="470" cy="786" rx="18" ry="12" fill="#1A120D"/><ellipse cx="610" cy="786" rx="18" ry="12" fill="#1A120D"/>
<path d="M540 800 q-18 60 0 74" stroke="#5A3522" stroke-width="10" fill="none" stroke-linecap="round"/>
<path d="M470 900 q70 44 140 0" stroke="#3C2216" stroke-width="14" fill="none" stroke-linecap="round"/>
<path d="M392 860 C410 980 470 1010 540 1012 C610 1010 670 980 688 860 C660 930 610 960 540 962 C470 960 420 930 392 860 Z" fill="#2A1A12" opacity=".55"/>
<g transform="translate(0 -120) rotate(-18 250 1470)"><rect x="170" y="1380" width="170" height="210" rx="70" fill="#7A4A2F"/><rect x="178" y="1270" width="36" height="140" rx="18" fill="#7A4A2F"/><rect x="220" y="1250" width="36" height="150" rx="18" fill="#7A4A2F"/><rect x="262" y="1262" width="36" height="140" rx="18" fill="#7A4A2F"/><rect x="302" y="1296" width="34" height="120" rx="17" fill="#7A4A2F"/></g>`
});

// 2 · Imported carousel slide 1 · 4:5 · before / after boiler replacement
svg('fixture_import_before-after-install_4x5.svg', 1080, 1350, 'imported carousel slide stand-in: before and after a boiler replacement', {
  defs: `<linearGradient id="old" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E857A"/><stop offset="1" stop-color="#565C53"/></linearGradient>
<linearGradient id="new" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3F1EC"/><stop offset="1" stop-color="#D9D6CE"/></linearGradient>
<linearGradient id="copper" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E5327"/><stop offset=".5" stop-color="#D08A52"/><stop offset="1" stop-color="#8E5327"/></linearGradient>`,
  content: `<rect width="540" height="1350" fill="url(#old)"/><rect x="540" width="540" height="1350" fill="url(#new)"/>
<rect y="1080" width="540" height="270" fill="#46493F"/><rect x="540" y="1080" width="540" height="270" fill="#BDB8AD"/>
<g transform="translate(110 320)"><rect width="320" height="440" rx="18" fill="#C7B68E"/><rect x="0" y="0" width="320" height="440" rx="18" fill="none" stroke="#8C7A55" stroke-width="8"/>
<path d="M40 60 q10 160 -6 320 M250 40 q16 120 4 260" stroke="#8A4B2A" stroke-width="16" opacity=".55" fill="none" stroke-linecap="round"/>
<circle cx="160" cy="120" r="40" fill="#5E5A4D"/><rect x="120" y="300" width="80" height="30" rx="4" fill="#3E3B33"/>
<path d="M70 440v260M160 440v320M250 440v230" stroke="#6F716B" stroke-width="30"/><path d="M70 700h-120M250 670h200" stroke="#6F716B" stroke-width="30"/></g>
<g transform="translate(650 290)"><rect width="320" height="470" rx="40" fill="#FBFBFA"/><rect x="0" y="0" width="320" height="470" rx="40" fill="none" stroke="#D5D2CB" stroke-width="6"/>
<rect x="90" y="90" width="140" height="64" rx="12" fill="#22292C"/><rect x="112" y="108" width="48" height="28" rx="5" fill="#6FC2A6"/>
<path d="M80 470v240M160 470v300M240 470v240" stroke="url(#copper)" stroke-width="26" stroke-linecap="round"/><path d="M80 710h-120M240 710h200" stroke="url(#copper)" stroke-width="26" stroke-linecap="round"/></g>
<rect x="534" width="12" height="1350" fill="#FFFFFF"/>
<rect x="80" y="96" width="220" height="92" rx="46" fill="#1D1D1F"/>${text('Before', 190, 158, 50, { anchor: 'middle', fill: '#FFFFFF' })}
<rect x="620" y="96" width="200" height="92" rx="46" fill="#FFFFFF"/>${text('After', 720, 158, 50, { anchor: 'middle', fill: '#1D1D1F' })}`
});

// 3 · Imported photo · 16:9 landscape · work van on a residential street at dusk
svg('fixture_import_van-street_16x9.svg', 1920, 1080, 'imported photo stand-in: work van parked on a residential street at dusk', {
  defs: `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27344D"/><stop offset=".62" stop-color="#8B6A78"/><stop offset="1" stop-color="#E49A6A"/></linearGradient>
<linearGradient id="van" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F4F2"/><stop offset="1" stop-color="#B9BCC0"/></linearGradient>
<radialGradient id="lamp"><stop offset="0" stop-color="#FFE3A3" stop-opacity=".9"/><stop offset="1" stop-color="#FFE3A3" stop-opacity="0"/></radialGradient>`,
  content: `<rect width="1920" height="1080" fill="url(#sky)"/>
<g filter="url(#soft)">
  <path d="M0 640 V380 L160 280 L320 380 V300 H620 V420 L760 330 L900 420 V360 H1280 V250 L1420 170 L1560 250 V400 H1920 V640 Z" fill="#2B2733"/>
  ${[[120,440],[220,440],[400,380],[500,380],[820,470],[1010,420],[1150,420],[1350,320],[1470,320],[1700,460],[1800,460]].map(([x,y]) => `<rect x="${x}" y="${y}" width="56" height="80" rx="4" fill="#F2C57A"/>`).join('')}
</g>
<circle cx="360" cy="520" r="160" fill="url(#lamp)"/><rect x="354" y="520" width="12" height="300" fill="#1C1B22"/>
<rect y="760" width="1920" height="80" fill="#5B5760"/><rect y="840" width="1920" height="240" fill="#34323A"/>
<ellipse cx="960" cy="930" rx="380" ry="34" fill="#15141A" opacity=".7"/>
<g transform="translate(640 520)">
  <path d="M0 110 Q0 40 60 40 H430 L560 170 Q640 190 640 250 V380 H0 Z" fill="url(#van)"/>
  <path d="M440 60 L550 170 H440 Z" fill="#3E4A58"/><rect x="40" y="80" width="360" height="12" rx="6" fill="#8D949C"/>
  <rect x="50" y="170" width="300" height="120" rx="8" fill="#1D5E8C" opacity=".85"/>
  <circle cx="140" cy="390" r="62" fill="#18181C"/><circle cx="140" cy="390" r="26" fill="#8E9398"/>
  <circle cx="520" cy="390" r="62" fill="#18181C"/><circle cx="520" cy="390" r="26" fill="#8E9398"/>
  <circle cx="630" cy="280" r="60" fill="url(#lamp)"/>
</g>`
});

// 4 · Imported photo · 1:1 · thermostatic radiator valve close-up
svg('fixture_import_valve-closeup_1x1.svg', 1080, 1080, 'imported photo stand-in: close-up of a thermostatic radiator valve', {
  defs: `<linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6A737B"/><stop offset=".35" stop-color="#F1F3F5"/><stop offset=".6" stop-color="#A9B1B8"/><stop offset="1" stop-color="#4F575E"/></linearGradient>
<linearGradient id="cap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#CFCCC4"/><stop offset=".45" stop-color="#FFFFFF"/><stop offset="1" stop-color="#B7B3AA"/></linearGradient>
<linearGradient id="cu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98552"/><stop offset=".5" stop-color="#F0B083"/><stop offset="1" stop-color="#8B4E25"/></linearGradient>`,
  content: `<rect width="1080" height="1080" fill="#6C5A4B"/>
<g filter="url(#softer)">${[[160,180,120,'#E7B774'],[340,120,80,'#F2D6A2'],[900,220,140,'#C58C5C'],[120,760,160,'#8C6E57'],[980,860,120,'#D9A874']].map(([x,y,r,c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity=".8"/>`).join('')}
${[0,1,2,3].map(i => `<rect x="${700 + i * 110}" y="-40" width="80" height="1160" rx="30" fill="#EDEBE6"/>`).join('')}</g>
<rect x="-40" y="700" width="560" height="96" rx="48" fill="url(#cu)"/>
<rect x="470" y="660" width="170" height="180" rx="20" fill="url(#chrome)"/>
<rect x="400" y="300" width="310" height="380" rx="70" fill="url(#cap)"/>
${[0,1,2,3,4,5,6].map(i => `<rect x="${432 + i * 38}" y="330" width="14" height="300" rx="7" fill="#9E9A91" opacity=".45"/>`).join('')}
<rect x="400" y="600" width="310" height="80" rx="14" fill="url(#chrome)"/>`
});

// 5 · Imported photo · 3:4 · two team members outside the shop
svg('fixture_import_team-shopfront_3x4.svg', 1080, 1440, 'imported photo stand-in: two team members standing outside the shop', {
  defs: `<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9DB4B8"/><stop offset="1" stop-color="#4E6468"/></linearGradient>
<linearGradient id="skinA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0C7A6"/><stop offset="1" stop-color="#C99876"/></linearGradient>
<linearGradient id="skinB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6B4431"/><stop offset="1" stop-color="#46291C"/></linearGradient>`,
  content: `<rect width="1080" height="1440" fill="#D9D2C4"/>
<g filter="url(#soft)"><rect y="120" width="1080" height="180" fill="#274C43"/><rect x="60" y="360" width="960" height="820" fill="url(#glass)"/><path d="M60 360 L520 1180 H640 L180 360 Z" fill="#FFFFFF" opacity=".18"/><rect x="0" y="1180" width="1080" height="260" fill="#A79F92"/></g>
${text('MORETTI IMPIANTI', 540, 236, 72, { anchor: 'middle', fill: '#F4EFE6' })}
<path d="M110 1440 C120 1120 190 980 330 960 C470 980 540 1120 550 1440 Z" fill="#5D6B7A"/>
<rect x="290" y="840" width="80" height="140" rx="30" fill="#D9A987"/>
<ellipse cx="330" cy="720" rx="118" ry="150" fill="url(#skinA)"/>
<path d="M214 700 C200 560 280 540 330 540 C400 540 460 570 446 700 C420 630 380 620 330 620 C280 620 240 630 214 700 Z" fill="#C9C5BE"/>
<rect x="258" y="700" width="62" height="40" rx="14" fill="none" stroke="#2B2B2B" stroke-width="7"/><rect x="342" y="700" width="62" height="40" rx="14" fill="none" stroke="#2B2B2B" stroke-width="7"/><path d="M320 716h22" stroke="#2B2B2B" stroke-width="7"/>
<path d="M290 800 q40 22 80 0" stroke="#8A5A45" stroke-width="10" fill="none" stroke-linecap="round"/>
<path d="M170 1200 C260 1140 400 1140 490 1200 L480 1260 C400 1210 260 1210 180 1260 Z" fill="#4A5663"/>
<path d="M560 1440 C570 1100 640 990 770 970 C900 990 970 1100 980 1440 Z" fill="#F07A1A"/>
<path d="M690 990 L700 1440 M850 990 L840 1440" stroke="#E3E36A" stroke-width="30"/><path d="M600 1200 H940" stroke="#E3E36A" stroke-width="30"/>
<rect x="732" y="860" width="80" height="140" rx="30" fill="#50301F"/>
<ellipse cx="772" cy="740" rx="120" ry="152" fill="url(#skinB)"/>
${[[680,600,60],[740,570,64],[810,580,62],[860,630,54],[660,660,46],[880,690,44],[772,560,50]].map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1B1411"/>`).join('')}
<ellipse cx="730" cy="742" rx="14" ry="10" fill="#140D0A"/><ellipse cx="816" cy="742" rx="14" ry="10" fill="#140D0A"/>
<path d="M728 816 q44 30 88 0" stroke="#F4EDE6" stroke-width="12" fill="none" stroke-linecap="round"/>`
});

// 6 · Planned Videogo video poster · 9:16 · “Radiator bleeding in 90 seconds” — hands + tool close-up, faceless (PR:890)
svg('fixture_planned_radiator-bleeding-hands_9x16.svg', 1080, 1920, 'poster frame stand-in for “Radiator bleeding in 90 seconds” (hands and bleed key, no face)', {
  defs: `<linearGradient id="rad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D8DBD9"/><stop offset=".5" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C4C8C6"/></linearGradient>
<linearGradient id="brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4D58A"/><stop offset="1" stop-color="#A67C2E"/></linearGradient>
<linearGradient id="skinC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2B08B"/><stop offset="1" stop-color="#B98463"/></linearGradient>`,
  content: `<rect width="1080" height="1920" fill="#5E8C88"/>
<g filter="url(#softer)"><rect x="-80" y="1500" width="1240" height="500" fill="#3F5B58"/><circle cx="160" cy="300" r="180" fill="#8DB5AE"/></g>
<rect x="90" y="660" width="900" height="980" rx="40" fill="url(#rad)"/>
${[0,1,2,3,4,5,6,7].map(i => `<rect x="${140 + i * 106}" y="710" width="40" height="880" rx="20" fill="#B9BEBC" opacity=".55"/>`).join('')}
<rect x="820" y="610" width="90" height="70" rx="14" fill="url(#brass)"/>
<rect x="900" y="560" width="200" height="130" rx="40" fill="#2F4F7A"/>
<rect x="760" y="560" width="190" height="130" rx="60" fill="url(#skinC)"/>
<rect x="700" y="620" width="150" height="46" rx="23" fill="#D39C77"/>
<rect x="790" y="640" width="120" height="22" rx="8" fill="#A67C2E"/>
<path d="M860 690 q-22 64 0 86 q22 -22 0 -86 Z" fill="#9FC9E6"/>
<path d="M700 820 Q780 770 960 800 Q1030 820 1020 890 Q940 930 760 910 Z" fill="#2C6BB5"/>
<rect x="600" y="820" width="220" height="130" rx="60" fill="url(#skinC)"/>
<rect x="-20" y="850" width="640" height="90" rx="40" fill="#6B7C3A"/>
<rect x="110" y="300" width="860" height="200" rx="28" fill="#1D1D1F" opacity=".88"/>
${text('Radiator bleeding', 540, 388, 84, { anchor: 'middle', fill: '#FFFFFF' })}
${text('in 90 seconds', 540, 472, 84, { anchor: 'middle', fill: '#FFFFFF' })}`
});

console.log('feed fixtures written');

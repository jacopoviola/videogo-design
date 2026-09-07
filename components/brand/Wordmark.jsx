import React from 'react';

/* The glyph geometry under its original transform, tight bounds 21.36 → 358.64 (a 337.3 square). */
const GLYPH_T = 'translate(10.82 8.13) translate(176 190) rotate(-45) translate(-259 -259)';
const VIEWBOX = '21.36 21.35 337.28 337.28';

/** The owner's glyph, squared terminals. An SVG <g>; use inside a 380×380 viewBox or the tight VIEWBOX. */
export function MarkGlyph({ fill = 'currentColor' }) {
  return (
    <g fill={fill} transform={GLYPH_T}>
      <rect x="148" y="136" width="49" height="239" /><rect x="148" y="136" width="238" height="54" />
      <rect x="148" y="322" width="237.5" height="53" /><rect x="240" y="228" width="136" height="46" />
    </g>
  );
}

/** The mark: the glyph alone on a transparent ground, 1.4× the wordmark's cap height, in the text colour.
 *  Square terminals (radius 0 applies to the mark). The label chip square is the mark's silhouette, not the mark itself. */
export function Mark({ size = 12, inverse = false, color, style }) {
  const ink = color || (inverse ? 'var(--vg-canvas)' : 'var(--vg-bone)');
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox={VIEWBOX} style={{ display: 'block', flex: 'none', color: ink, ...style }}>
      <MarkGlyph fill="currentColor" />
    </svg>
  );
}

export const MARK_SCALE = 1.4; // the glyph is 40% taller than the cap height, centred on the wordmark

/** The VIDEOGO lockup: glyph at 1.4× cap height + VIDEOGO in Instrument Sans 700, +0.14em caps, one colour. Gap 0.6× cap height.
 *  Achromatic only. mark = cap height in px (default 12). markOnly for app icon / avatar. inverse for #0C0B09 on #F5F2EC. */
export function Wordmark({ mark = 12, markOnly = false, inverse = false, style, ...rest }) {
  const ink = inverse ? 'var(--vg-canvas)' : 'var(--vg-bone)';
  const fontSize = mark / 0.7; // Instrument Sans cap height ≈ 0.70em
  return (
    <span aria-label="VIDEOGO" role="img" style={{ display: 'inline-flex', alignItems: 'center', gap: mark * 0.6, lineHeight: 1, color: ink, ...style }} {...rest}>
      <Mark size={mark * MARK_SCALE} color={ink} />
      {!markOnly && (
        <span style={{ fontFamily: 'var(--vg-sans)', fontWeight: 700, fontSize, letterSpacing: 'var(--vg-wordmark-track)', textTransform: 'uppercase', color: ink, lineHeight: 1, transform: 'translateY(0.04em)' }}>VIDEOGO</span>
      )}
    </span>
  );
}

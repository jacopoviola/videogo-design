import React from 'react';
import { LabelChip } from '../controls/LabelChip.jsx';

/** Confidence is how resolved the container is — never a score.
 *  collecting = dashed hairline, text-3 body. early = solid hairline, text-2 at 14px, must name the next test.
 *  learned = solid border + panel elevation, text-1 at 18px, plus evidence rows (pass as children). A claim only ever moves UP a grade. */
export function ConfidenceClaim({ grade = 'collecting', statement, nextTest, children, style }) {
  const g = grade;
  const border = g === 'collecting' ? 'var(--vg-rule-absent)' : g === 'early' ? 'var(--vg-rule-hi)' : 'var(--vg-rule-border)';
  const label = g === 'collecting' ? 'COLLECTING' : g === 'early' ? 'EARLY SIGNAL' : 'LEARNED';
  return (
    <section data-grade={g} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vg-part-gap)', padding: 'var(--vg-card-y) var(--vg-card-x)', border, background: g === 'learned' ? 'var(--vg-panel)' : 'transparent', ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <LabelChip kind="plain" style={{ color: g === 'collecting' ? 'var(--vg-text-4)' : 'var(--vg-text-3)' }}>{label}</LabelChip>
        {g === 'learned' && <span style={{ font: 'var(--vg-micro)', letterSpacing: 'var(--vg-track-micro)', textTransform: 'uppercase', color: 'var(--vg-text-4)' }}>Strong enough to change what happens next</span>}
      </div>
      <p style={{ margin: 0, maxWidth: 'var(--vg-measure)', textWrap: 'pretty',
        font: g === 'learned' ? 'var(--vg-claim)' : g === 'early' ? '450 14px/1.55 var(--vg-sans)' : 'var(--vg-body)',
        color: g === 'learned' ? 'var(--vg-text-1)' : g === 'early' ? 'var(--vg-text-2)' : 'var(--vg-text-3)' }}>{statement}</p>
      {g === 'early' && nextTest && <p style={{ margin: 0, font: 'var(--vg-small)', color: 'var(--vg-text-2)', maxWidth: 'var(--vg-measure)' }}>{nextTest}</p>}
      {g === 'learned' && children}
    </section>
  );
}

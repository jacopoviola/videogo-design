import React from 'react';

/** A measured value in mono. The observation window is part of the label ("SAVES · LAST 28 DAYS").
 *  delta is always against the account's own baseline, in words, never a chart. provenance renders "You told me" for owner-reported figures. */
export function MetricTile({ label, value, delta, provenance, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 'var(--vg-card-y) var(--vg-card-x)', background: 'var(--vg-shell)', border: 'var(--vg-rule-hi)', minWidth: 0, ...style }}>
      <span style={{ font: 'var(--vg-label)', lineHeight: 1.4, letterSpacing: 'var(--vg-track-label)', textTransform: 'uppercase', color: 'var(--vg-text-3)' }}>{label}</span>
      <span style={{ font: 'var(--vg-metric)', color: 'var(--vg-text-1)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{value}</span>
      {delta && <span style={{ font: 'var(--vg-small)', color: 'var(--vg-text-2)' }}>{delta}</span>}
      {provenance && <span style={{ font: 'var(--vg-micro)', letterSpacing: 'var(--vg-track-micro)', textTransform: 'uppercase', color: 'var(--vg-text-3)' }}>{provenance}</span>}
    </div>
  );
}

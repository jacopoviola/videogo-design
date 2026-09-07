import React from 'react';

/** Evidence rows: mono key (9.5/600, +0.12em) in a fixed 88px column, sans value (12.5/450), 1px left rule #37322B.
 *  rows = [{ k: 'WHY THIS', v: '…' }]. Never a table, an icon or a chart. Values never wrap mid-number. */
export function EvidenceRow({ rows = [], k, v, style }) {
  const list = rows.length ? rows : (k ? [{ k, v }] : []);
  return (
    <div style={{ borderLeft: 'var(--vg-rule-border)', paddingLeft: 'var(--vg-evidence-pad)', display: 'flex', flexDirection: 'column', gap: 'var(--vg-row-gap)', ...style }}>
      {list.map((r, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'var(--vg-evidence-key-w) minmax(0,1fr)', gap: 12, alignItems: 'baseline' }}>
          <span style={{ font: 'var(--vg-key)', letterSpacing: 'var(--vg-track-key)', textTransform: 'uppercase', color: 'var(--vg-text-3)', paddingTop: 2 }}>{r.k}</span>
          <span style={{ font: 'var(--vg-value)', color: 'var(--vg-text-2)' }}>{r.v}</span>
        </div>
      ))}
    </div>
  );
}

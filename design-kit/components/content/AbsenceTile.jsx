import React from 'react';

/** Unknown is not zero. 135° hatch, dashed border, em dash in text-4, and a caption that always states WHY the value is not observable.
 *  Never 0, never N/A, never a spinner. Never animates. */
export function AbsenceTile({ label, reason, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 'var(--vg-card-y) var(--vg-card-x)', background: 'var(--vg-hatch)', border: 'var(--vg-rule-absent)', minWidth: 0, ...style }}>
      <span style={{ font: 'var(--vg-label)', lineHeight: 1.4, letterSpacing: 'var(--vg-track-label)', textTransform: 'uppercase', color: 'var(--vg-text-3)' }}>{label}</span>
      <span aria-label="not observable" style={{ font: 'var(--vg-metric)', fontWeight: 400, color: 'var(--vg-text-4)' }}>—</span>
      <span style={{ font: 'var(--vg-small)', color: 'var(--vg-text-2)' }}>Not observable — {reason}</span>
    </div>
  );
}

import React from 'react';

/** A bone square at 22px beside a first-person statement. No timestamp, no name, no bubble, no second speaker.
 *  Children are set in the voice register (16/450, text-1) unless you pass your own. */
export function Attribution({ children, size = 22, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, ...style }}>
      <span aria-hidden="true" style={{ width: size, height: size, flex: 'none', background: 'var(--vg-bone)', marginTop: 2 }} />
      <div style={{ font: 'var(--vg-voice)', color: 'var(--vg-text-1)', maxWidth: 'var(--vg-measure)', minWidth: 0 }}>{children}</div>
    </div>
  );
}

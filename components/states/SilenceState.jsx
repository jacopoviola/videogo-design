import React from 'react';

/** Nothing needs you. 48px vertical padding, centred, dashed hairline, bone check, statement 17/450, status line 12px. Zero hue. Never animates.
 *  Never an illustration, a mascot, a "get started" button, or an apology. */
export function SilenceState({ statement = 'Everything is moving. Nothing needed from you.', status, style }) {
  return (
    <section data-silence style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14, padding: 'var(--vg-silence-y) var(--vg-card-x)', border: 'var(--vg-rule-absent)', ...style }}>
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--vg-bone)" strokeWidth="1.75" strokeLinecap="butt" strokeLinejoin="miter"><path d="M4 12.5l5 5L20 6.5" /></svg>
      <p style={{ margin: 0, font: '450 17px/1.45 var(--vg-sans)', color: 'var(--vg-text-1)', maxWidth: 'var(--vg-measure)', textWrap: 'pretty' }}>{statement}</p>
      {status && <p style={{ margin: 0, font: 'var(--vg-small)', color: 'var(--vg-text-2)', maxWidth: 'var(--vg-measure)' }}>{status}</p>}
    </section>
  );
}

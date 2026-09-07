import React from 'react';

/** Observable process, opaque method. Discrete working stages — never a progress bar for an unknown duration.
 *  stages = ['Understanding your business', 'Finding opportunities', …]; current = index. Done = bone check, current = text-1, upcoming = text-4.
 *  The only place a stage advancing may animate (200ms colour). */
export function ProcessStages({ stages = [], current = 0, note, style }) {
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--vg-row-gap)', ...style }}>
      {stages.map((s, i) => {
        const done = i < current, now = i === current;
        return (
          <li key={i} style={{ display: 'grid', gridTemplateColumns: '14px 1fr', gap: 12, alignItems: 'baseline',
            font: 'var(--vg-body)', fontWeight: now ? 500 : 450, color: now ? 'var(--vg-text-1)' : done ? 'var(--vg-text-2)' : 'var(--vg-text-4)',
            transition: 'color var(--vg-dur-enter) var(--vg-ease)' }}>
            <span aria-hidden="true" style={{ display: 'inline-flex', width: 14, height: 14, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
              {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--vg-bone)" strokeWidth="2.5" strokeLinecap="butt" strokeLinejoin="miter"><path d="M4 12.5l5 5L20 6.5" /></svg>}
              {now && <span style={{ width: 8, height: 8, background: 'var(--vg-bone)' }} />}
              {!done && !now && <span style={{ width: 8, height: 8, border: '1px solid var(--vg-text-4)' }} />}
            </span>
            <span>{s}{now && note ? <span style={{ font: 'var(--vg-small)', color: 'var(--vg-text-2)', marginLeft: 10 }}>{note}</span> : null}</span>
          </li>
        );
      })}
    </ol>
  );
}

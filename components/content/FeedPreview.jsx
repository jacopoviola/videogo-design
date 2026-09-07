import React from 'react';

/** The onboarding payoff and the Studio plan view: a 3-column 9:16 grid in the shape of a social feed.
 *  slots = [{ src, title, state: 'published' | 'ready' | 'scheduled' | 'planned' }]. Scheduled and planned slots are dimmed hatch —
 *  never populated with likes, views or any number that does not exist. No platform chrome, no fake avatar, no counts. */
export function FeedPreview({ slots = [], columns = 3, tileWidth = 120, style }) {
  const h = Math.round(tileWidth * 16 / 9);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + columns + ', ' + tileWidth + 'px)', gap: 2, ...style }}>
      {slots.map((s, i) => {
        const live = s.state === 'published' || s.state === 'ready';
        return (
          <div key={i} style={{ position: 'relative', width: tileWidth, height: h, overflow: 'hidden',
            background: live ? (s.src ? 'var(--vg-shell)' : 'var(--vg-panel)') : 'var(--vg-hatch)',
            border: live ? 'var(--vg-rule-hi)' : 'var(--vg-rule-absent)' }}>
            {live && s.src && <img src={s.src} alt="" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />}
            <div style={{ position: 'absolute', left: 8, right: 8, bottom: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ font: 'var(--vg-micro)', letterSpacing: 'var(--vg-track-micro)', textTransform: 'uppercase', color: live ? 'var(--vg-text-3)' : 'var(--vg-text-4)' }}>
                {s.state === 'published' ? 'Live' : s.state === 'ready' ? 'Ready' : s.state === 'scheduled' ? (s.when || 'Scheduled') : 'Planned'}
              </span>
              {s.title && live && <span style={{ font: 'var(--vg-small)', color: 'var(--vg-text-2)', lineHeight: 1.3 }}>{s.title}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

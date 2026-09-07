import React, { useState } from 'react';

/** The account control at the foot of the nav. Initials in mono inside a bordered square; business name; sector in text-3. Opens Account. */
export function AccountControl({ name = 'Moretti Impianti', sector = 'Home services', initials, onClick, style }) {
  const [hover, setHover] = useState(false);
  const ini = initials || name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '6px 8px', background: hover ? 'var(--vg-panel)' : 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
        transition: 'background-color var(--vg-dur-state) var(--vg-ease)', ...style }}>
      <span style={{ width: 34, height: 34, flex: 'none', display: 'grid', placeItems: 'center', border: 'var(--vg-rule-border)', font: 'var(--vg-label)', letterSpacing: 'var(--vg-track-label)', color: 'var(--vg-text-1)' }}>{ini}</span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <span style={{ fontFamily: 'var(--vg-sans)', fontSize: 13.5, fontWeight: 500, color: 'var(--vg-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
        <span style={{ font: 'var(--vg-small)', color: 'var(--vg-text-2)' }}>{sector}</span>
      </span>
    </button>
  );
}

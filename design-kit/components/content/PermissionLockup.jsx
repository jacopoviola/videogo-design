import React from 'react';
import { Button } from '../controls/Button.jsx';

export const TRUST_LINE = 'VIDEOGO only publishes within permissions you grant.';

/** Permission grammar. granted = solid border, text-1, closed padlock, Revoke on the same line.
 *  requested = dashed amber, amber text, open padlock. refused = no border, text-4, no glyph, inert.
 *  The padlock glyphs are placeholders in the house stroke (1.75px, butt caps, miter joins) until the icon SVGs arrive. */
export function PermissionLockup({ state = 'granted', scope, detail, onRevoke, onGrant, style }) {
  const s = state;
  const color = s === 'granted' ? 'var(--vg-text-1)' : s === 'requested' ? 'var(--vg-action)' : 'var(--vg-text-4)';
  const border = s === 'granted' ? 'var(--vg-rule-border)' : s === 'requested' ? 'var(--vg-rule-requested)' : '1px solid transparent';
  const status = s === 'granted' ? 'ALLOWED' : s === 'requested' ? 'ASKING' : 'NOT ALLOWED';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: s === 'refused' ? '8px 0' : '8px 12px', border, color, ...style }}>
      {s !== 'refused' && <Padlock open={s === 'requested'} />}
      <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: 1 }}>
        <span style={{ font: 'var(--vg-label)', letterSpacing: 'var(--vg-track-label)', textTransform: 'uppercase' }}>{scope} — {status}</span>
        {detail && <span style={{ font: 'var(--vg-small)', color: s === 'refused' ? 'var(--vg-text-4)' : 'var(--vg-text-2)' }}>{detail}</span>}
      </span>
      {s === 'granted' && <Button variant="ghost" onClick={onRevoke} style={{ height: 28, padding: '0 10px', fontSize: 12 }}>Revoke</Button>}
      {s === 'requested' && <Button variant="primary" onClick={onGrant} style={{ height: 28, padding: '0 10px', fontSize: 12 }}>Allow</Button>}
    </div>
  );
}

function Padlock({ open }) {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="butt" strokeLinejoin="miter" style={{ flex: 'none' }}>
      <rect x="4" y="11" width="16" height="10" />
      {open ? <path d="M8 11V7a4 4 0 0 1 8 0" /> : <path d="M8 11V7a4 4 0 0 1 8 0v4" />}
    </svg>
  );
}

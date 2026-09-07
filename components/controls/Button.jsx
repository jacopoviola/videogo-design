import React, { useState } from 'react';

/** Three buttons only. blocking = bone fill, only inside a NEED. primary = amber fill, one per object. ghost = border #37322B, everything else.
 *  34px desktop, 44px touch. Hover/press are 120ms colour changes; nothing moves. */
export function Button({ variant = 'ghost', touch = false, disabled = false, children, style, onClick, ...rest }) {
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const h = touch ? 'var(--vg-control-h-touch)' : 'var(--vg-control-h)';
  let bg, color, border = '1px solid transparent', weight = 500;
  if (variant === 'blocking') { bg = down ? 'var(--vg-text-2)' : hover ? '#FFFFFF' : 'var(--vg-bone)'; color = 'var(--vg-on-hue)'; }
  else if (variant === 'primary') { bg = down || hover ? 'var(--vg-action-pressed)' : 'var(--vg-action)'; color = 'var(--vg-on-hue)'; }
  else { bg = down ? 'var(--vg-panel)' : hover ? 'var(--vg-shell)' : 'transparent'; color = hover ? 'var(--vg-text-1)' : 'var(--vg-text-2)'; border = '1px solid var(--vg-border)'; weight = 450; }
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setDown(false); }}
      onMouseDown={() => setDown(true)} onMouseUp={() => setDown(false)}
      style={{
        height: h, padding: touch ? '0 18px' : '0 14px', background: bg, color, border, cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'var(--vg-sans)', fontSize: touch ? 15 : 13.5, fontWeight: weight, lineHeight: 1, letterSpacing: '-0.004em',
        opacity: disabled ? 0.45 : 1, transition: 'background-color var(--vg-dur-state) var(--vg-ease), color var(--vg-dur-state) var(--vg-ease)',
        display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', ...style
      }} {...rest}>{children}</button>
  );
}

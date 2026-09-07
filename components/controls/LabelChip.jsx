import React from 'react';

/** The object-type label. need = crimson fill, ready = amber fill, next / learned / plain = mono text only.
 *  Same square geometry as the brand mark. Never carries any other meaning. */
export function LabelChip({ kind = 'plain', children, style, ...rest }) {
  const filled = kind === 'need' || kind === 'ready';
  const bg = kind === 'need' ? 'var(--vg-signal)' : kind === 'ready' ? 'var(--vg-action)' : 'transparent';
  const text = children || (kind === 'plain' ? '' : kind.toUpperCase());
  return (
    <span style={{
      display: 'inline-block', alignSelf: 'flex-start', font: 'var(--vg-label)', lineHeight: 1.4, letterSpacing: 'var(--vg-track-label)', textTransform: 'uppercase',
      padding: filled ? '3px 6px 2px' : 0, background: bg, color: filled ? 'var(--vg-on-hue)' : 'var(--vg-text-3)',
      whiteSpace: 'nowrap', ...style
    }} {...rest}>{text}</span>
  );
}

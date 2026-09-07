import React from 'react';

/** 16:9 media thumbnail, 168×96 at object scale. Duration chip mono 9.5/600 on 86% canvas, bottom-right, 5px inset.
 *  With no src the frame shows the absence hatch — never a spinner, never a play icon. */
export function Thumbnail({ src, alt = '', duration, width = 168, height = 96, style }) {
  return (
    <div style={{ position: 'relative', width, height, flex: 'none', overflow: 'hidden', background: src ? 'var(--vg-shell)' : 'var(--vg-hatch)', border: src ? 0 : 'var(--vg-rule-absent)', ...style }}>
      {src && <img src={src} alt={alt} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />}
      {duration && (
        <span style={{ position: 'absolute', right: 5, bottom: 5, padding: '4px 5px 3px', background: 'var(--vg-duration-chip-bg)', color: 'var(--vg-text-1)', font: 'var(--vg-duration)', letterSpacing: '0.04em' }}>{duration}</span>
      )}
    </div>
  );
}

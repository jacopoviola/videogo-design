import React, { useState } from 'react';
import { Button } from './Button.jsx';

/** The persistent secondary strip at the bottom of a section. Never the page itself; never a transcript.
 *  A ghost Attach, the field, one primary Send. */
export function Composer({ placeholder = 'Message VIDEOGO…', touch = false, onSend, style }) {
  const [value, setValue] = useState('');
  const send = () => { if (value.trim() && onSend) onSend(value.trim()); setValue(''); };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: touch ? '10px 12px' : '8px 10px', background: 'var(--vg-shell)', border: 'var(--vg-rule-hi)', ...style }}>
      <Button variant="ghost" touch={touch} aria-label="Attach">Attach</Button>
      <input value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder={placeholder}
        style={{ flex: 1, minWidth: 0, height: touch ? 'var(--vg-control-h-touch)' : 'var(--vg-control-h)', padding: '0 12px', background: 'transparent', border: 0, outline: 0,
          font: 'var(--vg-body)', fontSize: touch ? 15 : 13.5, color: 'var(--vg-text-1)' }} />
      <Button variant="primary" touch={touch} onClick={send}>Send</Button>
    </div>
  );
}

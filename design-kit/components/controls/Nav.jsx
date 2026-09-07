import React, { useState } from 'react';
import { Wordmark } from '../brand/Wordmark.jsx';
import { AccountControl } from './AccountControl.jsx';

export const NAV_ITEMS = ['Today', 'Studio', 'Knowledge', 'Connections'];

/** Exactly four items, forever. Active = shell steps to #1C1A16, text-1, weight 500. Never amber. Icons only ever accompany the label.
 *  orientation="side" (214px rail with wordmark + account) or "bottom" (mobile bar, 44px targets). */
export function Nav({ active = 'Today', onSelect, account, orientation = 'side', icons, style }) {
  if (orientation === 'bottom') {
    return (
      <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', background: 'var(--vg-shell)', borderTop: 'var(--vg-rule-hi)', ...style }}>
        {NAV_ITEMS.map(item => <NavItem key={item} item={item} active={active === item} onSelect={onSelect} touch icon={icons && icons[item]} />)}
      </nav>
    );
  }
  return (
    <nav style={{ width: 'var(--vg-nav-w)', flex: 'none', display: 'flex', flexDirection: 'column', background: 'var(--vg-shell)', borderRight: 'var(--vg-rule-hi)', ...style }}>
      <div style={{ padding: '26px 22px 22px' }}><Wordmark mark={12} /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
        {NAV_ITEMS.map(item => <NavItem key={item} item={item} active={active === item} onSelect={onSelect} icon={icons && icons[item]} />)}
      </div>
      <div style={{ flex: 1 }} />
      {account && <div style={{ borderTop: 'var(--vg-rule-hi)', padding: '12px 8px' }}><AccountControl {...account} /></div>}
    </nav>
  );
}

function NavItem({ item, active, onSelect, touch, icon }) {
  const [hover, setHover] = useState(false);
  return (
    <button type="button" onClick={() => onSelect && onSelect(item)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: touch ? 'center' : 'flex-start', gap: 10, height: touch ? 'var(--vg-control-h-touch)' : 38, padding: touch ? 0 : '0 14px',
        background: active ? 'var(--vg-nav-active)' : hover ? 'var(--vg-panel)' : 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
        fontFamily: 'var(--vg-sans)', fontSize: touch ? 12 : 14, fontWeight: active ? 500 : 450, color: active ? 'var(--vg-text-1)' : hover ? 'var(--vg-text-1)' : 'var(--vg-text-2)',
        transition: 'background-color var(--vg-dur-state) var(--vg-ease), color var(--vg-dur-state) var(--vg-ease)'
      }}>
      {icon && <span aria-hidden="true" style={{ display: 'inline-flex', width: 15, height: 15, color: 'currentColor' }}>{icon}</span>}
      {item}
    </button>
  );
}

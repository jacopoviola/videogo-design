import React from 'react';
import { LabelChip } from '../controls/LabelChip.jsx';

/** One shell for all four object types. Anatomy, always in this order: label chip › title › body › media › evidence rows › actions.
 *  Only the chip and the elevation vary: need / ready = panel + border (elevated); next / learned = shell + hairline (at rest).
 *  Never animates when type="need". At most one primary button in actions. */
export function ObjectCard({ type = 'next', label, title, body, media, evidence, actions, style, ...rest }) {
  if (type === 'recommend') type = 'next'; // roadmap v7 name for the same object
  const elevated = type === 'need' || type === 'ready';
  return (
    <article data-object={type} style={{
      display: 'flex', flexDirection: 'column', gap: 'var(--vg-part-gap)', padding: 'var(--vg-card-y) var(--vg-card-x)',
      background: elevated ? 'var(--vg-panel)' : 'var(--vg-shell)', border: elevated ? 'var(--vg-rule-border)' : 'var(--vg-rule-hi)', ...style
    }} {...rest}>
      <LabelChip kind={type}>{label || type.toUpperCase()}</LabelChip>
      {title && <h3 style={{ margin: 0, font: 'var(--vg-title)', letterSpacing: 'var(--vg-track-title)', color: 'var(--vg-text-1)', maxWidth: 'var(--vg-measure)', textWrap: 'pretty' }}>{title}</h3>}
      {body && <p style={{ margin: 0, font: 'var(--vg-body)', color: 'var(--vg-text-2)', maxWidth: 'var(--vg-measure)', textWrap: 'pretty' }}>{body}</p>}
      {media}
      {evidence}
      {actions && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 2 }}>{actions}</div>}
    </article>
  );
}

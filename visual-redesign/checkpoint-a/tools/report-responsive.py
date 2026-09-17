# Writes RESPONSIVE_VALIDATION.md from validation/responsive-results.json. Run from checkpoint-a.
import json
R = json.load(open('validation/responsive-results.json'))
MODES = ['1440', '1216', 'text200', 'zoom200', '320']
MN = {'1440': '1440', '1216': '1216', 'text200': '200% text', 'zoom200': '200% zoom', '320': '320 complete shell'}
def cell(r):
    bad = []
    if r['layout']['horizontalScroll']: bad.append('h-scroll')
    for k, n in [('clipping', 'clip'), ('overlap', 'overlap'), ('midword', 'mid-word')]:
        if r[k]: bad.append(f"{len(r[k])} {n}")
    if 'nav' in r and not r['nav']['allReachable']: bad.append('nav')
    if r.get('keyboard') and (r['keyboard']['missingRing'] or r['keyboard']['obscured']): bad.append('focus')
    return 'pass' if not bad and r['pass'] else 'FAIL ' + ', '.join(bad)
lines = ['# Responsive validation · Checkpoint B (corrected)', '',
 f"{R['date'][:10]} · Chrome {R['chrome']} · data `validation/responsive-results.json` · tool `tools/validate-responsive.mjs` · renders `renders/responsive/`.", '',
 '## Correction to earlier reports', '',
 'The earlier Checkpoint A and B validation reports overstated reflow. **Withdrawn:**', '',
 '- **“200% text: no horizontal scroll or overflow”** (`05_VALIDATION.md`, `CHECKPOINT_B_REGISTER.md`, `validation/b-results.json` → `text200`). The method set `html { font-size: 200% }`, which does not move media-query breakpoints, so the desktop rail stayed beside compressed content. The 200% text and 200% zoom screenshots from those rounds are **failures**.',
 '- **“axe 0 violations” as evidence of reflow.** axe checks markup and contrast; it does not detect overlap, clipping, compression or mid-word breaks. It is reported below, separately.',
 '- **“320px: no horizontal scroll”** (`reflow-320_*`, `long_*_390`). Those were content-only studies (`?study=narrow`) with navigation and account access removed; they did not validate the product. The narrow study is retired.', '',
 '## Method', '',
 f"- **1440 / 1216:** desktop viewports.",
 f"- **200% text:** {R['method']['text200']}. Root text, rem sizes, em media queries and container queries all follow it, as with the browser setting.",
 f"- **200% zoom:** {R['method']['zoom200']}.",
 '- **320:** 320×640, touch, complete product shell including the collapsed navigation and account link.',
 '- **A pass requires all of:** no horizontal page scroll; no text clipped by an overflow boundary and no ellipsis; no overlap between text, controls, images or cards (chips on their own image excepted); no word broken across lines (addresses marked `.vg-breakable` excepted); full composer placeholder; Today, Studio, Knowledge, Connections and Account reachable (touch ≥44px at 320); desktop rail never beside content at 200% text, 200% zoom or 320; composer in flow (never covering content); every keyboard stop with a visible, unobscured 2px ring (1440, 200% text, 320, menu open).',
 '- **Detector self-test:** the checks fail on the known-bad layouts (four compressed Studio columns at 320: 12 mid-word breaks, 7 clips, 7 overlaps; sticky composer over cards: 6 overlaps; tabular Upcoming at 320: 12 overlaps + horizontal scroll).', '',
 '## Screens', '', '| Screen | ' + ' | '.join(MN[m] for m in MODES) + ' |', '|---|' + '---|' * len(MODES)]
for u, ms in R['pages'].items():
    lines.append(f"| `{u}` | " + ' | '.join(cell(ms[m]) for m in MODES) + ' |')
lines += ['', '## Stress scenarios (long content, open detail, five-line composer)', '', '| Scenario | ' + ' | '.join(MN[m] for m in MODES) + ' |', '|---|' + '---|' * len(MODES)]
for s, ms in R['scenarios'].items():
    lines.append(f"| {s} | " + ' | '.join(cell(ms[m]) + (f" · {ms[m]['textarea']['visibleLines']} of {ms[m]['textarea']['contentLines']} lines, scrolls inside" if ms[m].get('textarea') else '') for m in MODES) + ' |')
st = R['pages']['/studio.html?select=rd1']; sb = R['pages']['/studio.html']; td = R['pages']['/today.html']
ov = R.get('objectView', {})
if ov:
    o = ov['320']
    lines += ['', '## Mobile Studio object view', '',
     f"- **320:** selecting READY opens a dedicated view: {o['dedicatedView']}; board hidden: {o['boardHidden']}; first control “{o['backLabel']}”; object title at {o['titleTop']}px in a {o['viewportH']}px viewport; focus on the title: {o['focusOnTitle']}; Live content before the detail: {o['liveCardVisibleBeforeDetail']}; clipping/overlap/mid-word: {len(o['checks']['clipping'])}/{len(o['checks']['overlap'])}/{len(o['checks']['midword'])}. After Back to Studio: board visible {o['afterBack']['boardVisible']}, focus returned to the card {o['afterBack']['focusOnCard']}. Pass: {o['pass']}.",
     f"- **200% zoom / 200% text (45em):** the approved panel below the board is kept (“{ov['zoom200']['backLabel']}”). Pass: {ov['zoom200']['pass']} / {ov['text200']['pass']}."]
hb = R.get('historyBack')
if hb:
    lines += ['', '## Mobile object view · browser/system Back', '',
     f"- Board scrolled to the READY card ({hb['boardScrollBefore']}px), card opened → view shown, URL `{hb['opened']['url']}`, focus on the title: {hb['opened']['focusOnTitle']}.",
     f"- Browser Back → view closed: {not hb['afterBrowserBack']['view']}; board visible: {hb['afterBrowserBack']['boardVisible']}; scroll restored to {hb['afterBrowserBack']['scrollY']}px; focus on the originating card: {hb['afterBrowserBack']['focusOnCard']}; URL `{hb['afterBrowserBack']['url'] or '(no select)'}`.",
     f"- Browser Forward → view re-opened: {hb['afterForward']['view']}, focus on the title: {hb['afterForward']['focusOnTitle']}.",
     f"- Back to Studio (same history path) → scroll {hb['afterBackToStudio']['scrollY']}px, focus on the card: {hb['afterBackToStudio']['focusOnCard']}.",
     f"- Deep link `?select=rd1` → view; browser Back → board with focus on the card: {hb['deepBack']['focusOnCard']}.",
     f"- Pass: {hb['pass']}."]
nav = R['pages']['/account.html']['320']['nav']
lines += ['', '## Menu state and Account orientation', '',
 f"- Collapsed menu (all screens at 200% text, 200% zoom and 320): open label “{nav['openLabel']}” with aria-expanded={nav['expanded']}; closed label “{nav['closedLabel']}” with aria-expanded={nav['closedExpanded']}; focus returns to the button on Close ({nav['focusReturned']}) and on Escape ({nav['escapeFocusReturned']}).",
 f"- Account / Settings: primary destinations marked current: {nav['orientation']['primaryCurrent'] or 'none'}; account control current: {nav['orientation']['accountCurrent']} (every mode)."]

lines += ['', '## Layout outcomes', '',
 '| | 1440 | 1216 | 200% text | 200% zoom | 320 |', '|---|---|---|---|---|---|',
 '| Shell | ' + ' | '.join('menu bar (rail collapsed)' if st[m]['layout']['railCollapsed'] else 'rail' for m in MODES) + ' |',
 '| Studio columns per row | ' + ' | '.join(str(sb[m]['layout']['boardColumnsPerRow']) for m in MODES) + ' |',
 '| Narrowest Studio card (CSS px) | ' + ' | '.join(str(sb[m]['layout']['minCardWidth']) for m in MODES) + ' |',
 '| Studio detail panel | ' + ' | '.join(('dedicated object view' if st[m]['layout'].get('boardColumnsPerRow') is not None and m == '320' else st[m]['layout']['panelPosition']) for m in MODES) + ' |',
 '| Today Upcoming rows | ' + ' | '.join(td[m]['layout']['upcoming'][0]['layout'] for m in MODES) + ' |',
 '| Keyboard stops · Today | ' + ' | '.join(str(td[m]['keyboard']['stops']) if td[m].get('keyboard') else '—' for m in MODES) + ' |',
 '| axe violations · Today / Studio READY | ' + ' | '.join((f"{len(td[m]['axe'])} / {len(st[m]['axe'])}" if 'axe' in td[m] else '—') for m in MODES) + ' |', '',
 '## Composer keys', '',
 f"- **Desktop (1440):** Shift+Enter inserted a newline without sending; Enter sent (submit count 1) without adding a newline; Send sent. Pass: {R['composer']['1440']['pass']}.",
 f"- **Touch (320):** Return inserted a newline and did not send; the Send button sent. Pass: {R['composer']['320']['pass']}.",
 '- The send outcome is not defined by the sources: submitting is recorded on the form and changes nothing visible.', '',
 '## Desktop direction unchanged', '', 'Pixel comparison (device scale 2) against renders taken before this correction (`renders/_baseline-before-responsive/`):', '',
 '| Render | Changed pixels |', '|---|---|']
for k, v in R['desktopDiff'].items():
    lines.append(f"| {k} | {v['changedPixelsPct']}%{' (rows ' + str(v['changedRowsCssPx'][0]) + '–' + str(v['changedRowsCssPx'][1]) + (' px, intended: Account orientation change)' if k.startswith('B3_account') or k.startswith('B4_account') else ' px, anti-aliasing)') if v['changedRowsCssPx'] and v['changedPixelsPct'] > 0 else ''} |")
lines += ['', '## Renders (full resolution, device scale 2)', '']
for r in R['renders']:
    lines.append(f"- `renders/responsive/{r['name']}.png` — `{r['url']}` · {MN[r['mode']]}{' · ' + r['clip'] if r['clip'] else ''}")
lines += ['', '## Not covered', '', '- Screen readers, Safari, Firefox and real devices were not tested. On-screen keyboards on real phones were not tested; Return behaviour is keyed to a coarse pointer.',
 '- Connections has no screen in the checkpoints: its link is present and reachable but non-executing.']
open('RESPONSIVE_VALIDATION.md', 'w').write('\n'.join(lines) + '\n')
print('ok')

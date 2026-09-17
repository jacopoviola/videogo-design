# Builds APPROVAL_BOARD_B.html from validation data and renders. Run from the checkpoint-a folder.
import json
RR = json.load(open('validation/responsive-results.json'))
D = json.load(open('validation/b-decisions.json'))
MODES = ['1440', '1216', 'text200', 'zoom200', '320']
MN = {'1440': '1440', '1216': '1216', 'text200': '200% text', 'zoom200': '200% zoom', '320': '320 shell'}
def cell(r):
    bad = []
    if r['layout']['horizontalScroll']: bad.append('h-scroll')
    for k, n in [('clipping', 'clip'), ('overlap', 'overlap'), ('midword', 'mid-word')]:
        if r[k]: bad.append(f"{len(r[k])} {n}")
    if 'nav' in r and not r['nav']['allReachable']: bad.append('nav')
    if r.get('keyboard') and (r['keyboard']['missingRing'] or r['keyboard']['obscured']): bad.append('focus')
    return 'pass' if not bad and r['pass'] else '<b>FAIL</b> ' + ', '.join(bad)
rows = ''.join(f"<tr><td>{u}</td>" + ''.join(f"<td>{cell(ms[m])}</td>" for m in MODES) + '</tr>' for u, ms in RR['pages'].items())
srows = ''.join(f"<tr><td>{u}</td>" + ''.join(f"<td>{cell(ms[m])}{(' · ' + str(ms[m]['textarea']['visibleLines']) + ' lines + scroll') if ms[m].get('textarea') else ''}</td>" for m in MODES) + '</tr>' for u, ms in RR['scenarios'].items())
st = RR['pages']['/studio.html?select=rd1']; td = RR['pages']['/today.html']
lrows = ('<tr><td>Shell</td>' + ''.join(f"<td>{'menu bar' if st[m]['layout']['railCollapsed'] else 'rail'}</td>" for m in MODES) + '</tr>'
  + '<tr><td>Studio columns</td>' + ''.join(f"<td>{RR['pages']['/studio.html'][m]['layout']['boardColumnsPerRow']}</td>" for m in MODES) + '</tr>'
  + '<tr><td>Studio detail</td>' + ''.join(f"<td>{'dedicated object view' if m == '320' else st[m]['layout']['panelPosition']}</td>" for m in MODES) + '</tr>'
  + '<tr><td>Upcoming rows</td>' + ''.join(f"<td>{td[m]['layout']['upcoming'][0]['layout']}</td>" for m in MODES) + '</tr>'
  + '<tr><td>axe (reported separately)</td>' + ''.join(f"<td>{(str(len(td[m]['axe'])) + ' / ' + str(len(st[m]['axe']))) if 'axe' in td[m] else '—'}</td>" for m in MODES) + '</tr>')
drows = ''.join(f"<tr><td>{k}</td><td>{v['changedPixelsPct']}%</td></tr>" for k, v in RR['desktopDiff'].items())
S = D['summary']
def fig(label, src, w, note=''):
    return f'<figure><figcaption><b>{label}</b>{("<span>" + note + "</span>") if note else ""}</figcaption><img src="{src}" width="{w}"></figure>'
html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Canonical Checkpoint B — Approval board</title>
<style>*{{box-sizing:border-box}}body{{margin:0;background:#E6E6EA;color:#1D1D1F;font:16px/1.45 system-ui,-apple-system,sans-serif}}
.board{{width:2800px;padding:48px}} h1{{margin:0;font-size:40px;letter-spacing:-.02em}} .lead{{color:#5C5C63;margin:6px 0 28px;max-width:1700px;font-size:18px}}
.status{{float:right;font-weight:600;border:2px solid #1D1D1F;border-radius:8px;padding:8px 14px;font-size:18px}}
section{{background:#fff;border-radius:18px;padding:32px 36px 36px;margin-bottom:36px}} h2{{margin:0 0 6px;font-size:28px}} .rule{{color:#5C5C63;margin:0 0 20px;font-size:17px;max-width:2400px}}
.row{{display:flex;gap:48px;align-items:flex-start;flex-wrap:wrap}} figure{{margin:0}} figcaption{{display:flex;flex-direction:column;margin-bottom:10px;font-size:18px}} figcaption span{{font-size:15px;color:#5C5C63;max-width:1400px}}
img{{display:block;height:auto;border:1px solid #C9C9CF}} .note{{border:2px solid #B42318;background:#FFF1F0;border-radius:12px;padding:12px 16px;font-size:16px;margin-bottom:20px}}
.block{{border:2px solid #1D1D1F;border-radius:12px;padding:12px 16px;font-size:16px;margin-bottom:20px}}
table{{border-collapse:collapse;font-size:15px;width:100%}} td,th{{text-align:left;padding:10px 12px;border-bottom:1px solid #D8D8DD;vertical-align:top}} th{{color:#5C5C63;font-weight:600}}</style></head>
<body><div class="board"><span class="status">Status: not approved · responsive correction applied</span><h1>Videogo · Canonical Checkpoint B</h1>
<p class="lead">Responsive and validation layer corrected: collapsing application shell, Studio 4 → 2 → 1 columns with detail below, stacked Upcoming rows, multiline composer, no mid-word breaks. Earlier 200% and 320 passes withdrawn. Desktop direction unchanged (pixel diff ≤0.003%). Instrument Sans (variable, OFL) throughout. Rendered in Chrome, macOS, device scale 2. No option is recommended on this board.</p>

<section><h2>Decisions applied</h2>
<table><tr><th>#</th><th>Decision</th><th>Applied</th></tr>
<tr><td>B-01</td><td>Approved</td><td>Exact trust line “VIDEOGO only publishes within permissions you grant.” under Billing — verified: {D['trustLine']}</td></tr>
<tr><td>B-02</td><td>Approved</td><td>Today stays selected on Account (current: {', '.join(S['accountNavCurrent'])}); Account reached only from the account control</td></tr>
<tr><td>B-03</td><td>Approved as a scoped exception</td><td>Knowledge: in-card input · Account: no composer · QA-deferred: no composer. Screen-specific, not a universal composer rule</td></tr>
<tr><td>B-04</td><td>Approved provisionally</td><td>Four-step indicator on the onboarding QA-deferred screen only; not a generic component</td></tr>
<tr><td>B-05</td><td>Standardized</td><td>Account control is a link on all 8 Checkpoint A and B pages — link {S['allLinks']} · same size {S['sameHeight'] and S['sameWidth']} · same appearance {S['sameColor'] and S['sameFont']} · same focus ring {S['sameFocus']} · touch ≥44px {S['touchTargetsOk']}</td></tr>
<tr><td>B-06</td><td>Approved</td><td>Videogo mark identifies Videogo turns with accessible name “Videogo” ({len(D['videogoMarks'])} marks, role img)</td></tr>
</table></section>

<section><h2>Feed Preview</h2><p class="rule">Projected chronology: the eventual newest post top-left; timed Scheduled / Planned by effective publish time; untimed Planned posts listed apart, claiming no position; recent Live posts follow. 3:4 grid preview positioned by title-safe / focal metadata, centre only without metadata; originals unaltered. Nothing Scheduled on the integrated Studio screen (READY conflict).</p>
<div class="note"><b>Demo fixtures.</b> Every image and poster frame is an illustrative demo fixture, labelled once per instance — not customer media, not photographs, and not Videogo’s brand style. Imported-post format metadata is part of the fixture.</div>
<div class="row">
{fig('Integrated Studio · 1440', 'renders/a2-1/A21-3_studio-populated-media_1440.png', 1440, 'Feed: six Live positions — lv1 and five imported posts.')}
{fig('Integrated Studio · 1216 · Feed below the board', 'renders/a2-1/A21-11_studio-feed-below_1216.png', 1000)}
</div><div class="row" style="margin-top:36px">
{fig('Specimen · populated', 'renders/a2-1/A21-6_feed-specimen-populated.png', 400, 'Component review, not a canonical state. Sat 11:00 is later than Thu 18:00, so it is top-left.')}
{fig('Specimen · untimed Planned', 'renders/a2-1/A21-12_feed-specimen-untimed-planned.png', 400, 'Separate scenario: the untimed Planned post sits apart; label copy provisional.')}
{fig('Specimen · partial / failure', 'renders/a2-1/A21-10_feed-specimen-partial-failure.png', 400, 'Separate scenario: four posts; one imported carousel cannot be retrieved.')}
{fig('Specimen · empty', 'renders/a2-1/A21-7_feed-specimen-empty.png', 400, 'Separate scenario: no tiles.')}
{fig('Media states · Available · Rendering · Unavailable · Absent', 'renders/a2-1/A21-8_media-states-specimen.png', 900)}
</div>
<p class="rule" style="margin-top:20px">Open, no interaction added: access to the uncropped original for imported posts. Not added: reorder, positioning, Current / After toggle, pinning, tile detail, editing.</p></section>

<section><h2>Validation correction</h2>
<div class="block"><b>Withdrawn:</b> the earlier “200% text: pass” (CSS root size did not move breakpoints — those screenshots are failures) · axe results presented as reflow evidence · the 320/390 content-only studies without navigation or account access. See RESPONSIVE_VALIDATION.md.</div>
<p class="rule">200% text = CDP Page.setFontSizes (browser text-size setting ×2). 200% zoom = 720×450 CSS px at device scale 2. 320 = complete product shell, touch. A pass needs: no horizontal scroll, clipping, overlap or mid-word breaks; navigation and account reachable; composer in flow; visible keyboard rings. Detectors verified against known-bad layouts.</p>
<table><tr><th>Screen</th>{''.join('<th>' + MN[m] + '</th>' for m in MODES)}</tr>{rows}</table>
<h3 style="margin:28px 0 8px">Long content · open detail · five-line composer</h3>
<table><tr><th>Scenario</th>{''.join('<th>' + MN[m] + '</th>' for m in MODES)}</tr>{srows}</table>
<h3 style="margin:28px 0 8px">Layout outcomes</h3>
<table><tr><th></th>{''.join('<th>' + MN[m] + '</th>' for m in MODES)}</tr>{lrows}</table>
<h3 style="margin:28px 0 8px">Desktop unchanged · pixel diff against pre-correction renders</h3>
<table><tr><th>Render</th><th>Changed pixels</th></tr>{drows}</table></section>

<section><h2>200% text</h2><p class="rule">1440×900 window, browser text size 200%. Rail collapses to the menu bar; Upcoming rows stack; Studio shows two columns with READY detail below; full composer placeholder.</p><div class="row">
{fig('Today · 200% text', 'renders/responsive/R01_today_text200_1440.png', 1100)}{fig('Studio READY · 200% text', 'renders/responsive/R02_studio-ready_text200_1440.png', 1100)}</div></section>

<section><h2>200% zoom</h2><p class="rule">1440×900 window at 200% browser zoom (720 CSS px).</p><div class="row">
{fig('Today · 200% zoom', 'renders/responsive/R03_today_zoom200.png', 1000)}{fig('Studio READY · 200% zoom', 'renders/responsive/R04_studio-ready_zoom200.png', 1000)}</div></section>

<section><h2>320px · complete product shell</h2><p class="rule">Navigation and account access included. Menu is a disclosure in page flow (Escape closes). Studio: one column with media cards, READY detail below, composer after it.</p><div class="row">
{fig('Today · 320', 'renders/responsive/R05_today_320_complete.png', 480)}{fig('Today · 320 · menu open', 'renders/responsive/R05b_today_320_menu-open.png', 480)}{fig('Studio · 320 · menu open', 'renders/responsive/R06b_studio_320_menu-open.png', 480)}{fig('Studio · 320 · media cards and READY detail', 'renders/responsive/R06_studio_320_media-and-ready-detail.png', 480)}</div></section>

<section><h2>Composer</h2><p class="rule">Approved multiline textarea: grows through five whole lines, then scrolls inside. Desktop Enter sends, Shift+Enter inserts a newline; touch Return inserts a newline, Send submits. In flow — never covers content. Send outcome undefined in sources.</p><div class="row">
{fig('One line · 1440', 'renders/responsive/R07a_composer_one-line_1440.png', 880)}{fig('Five lines · 1440', 'renders/responsive/R07b_composer_five-lines_1440.png', 880)}{fig('Placeholder · 200% text', 'renders/responsive/R07e_composer_placeholder_text200.png', 880)}</div>
<div class="row" style="margin-top:24px">{fig('One line · 320', 'renders/responsive/R07c_composer_one-line_320.png', 288)}{fig('Five lines · 320', 'renders/responsive/R07d_composer_five-lines_320.png', 288)}</div></section>

<section><h2>Desktop re-export · 1440</h2><p class="rule">Knowledge · Account / Settings · Making (loading) · Week one (empty) · QA-deferred. Unchanged from the approved direction.</p><div class="row">
{fig('Knowledge', 'renders/responsive/R08_knowledge_1440.png', 1300)}{fig('Account / Settings · full page', 'renders/responsive/R09_account_1440.png', 1300)}</div>
<div class="row" style="margin-top:36px">{fig('Loading · Making', 'renders/responsive/R10_making_1440.png', 1300)}{fig('Empty · Week one', 'renders/responsive/R11_week-one_1440.png', 1300)}</div>
<div class="row" style="margin-top:36px">{fig('QA-deferred · first video needs a little more time', 'renders/responsive/R12_qa-deferred_1440.png', 1300)}</div></section>
</div></body></html>'''
open('APPROVAL_BOARD_B.html', 'w').write(html)
print('board written')

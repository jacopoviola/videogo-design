# Responsive validation · Checkpoint B (corrected)

2026-09-17 · Chrome 152.0.7977.84 · data `validation/responsive-results.json` · tool `tools/validate-responsive.mjs` · renders `renders/responsive/`.

## Correction to earlier reports

The earlier Checkpoint A and B validation reports overstated reflow. **Withdrawn:**

- **“200% text: no horizontal scroll or overflow”** (`05_VALIDATION.md`, `CHECKPOINT_B_REGISTER.md`, `validation/b-results.json` → `text200`). The method set `html { font-size: 200% }`, which does not move media-query breakpoints, so the desktop rail stayed beside compressed content. The 200% text and 200% zoom screenshots from those rounds are **failures**.
- **“axe 0 violations” as evidence of reflow.** axe checks markup and contrast; it does not detect overlap, clipping, compression or mid-word breaks. It is reported below, separately.
- **“320px: no horizontal scroll”** (`reflow-320_*`, `long_*_390`). Those were content-only studies (`?study=narrow`) with navigation and account access removed; they did not validate the product. The narrow study is retired.

## Method

- **1440 / 1216:** desktop viewports.
- **200% text:** CDP Page.setFontSizes standard 32px / fixed 26px (browser default text size ×2). Root text, rem sizes, em media queries and container queries all follow it, as with the browser setting.
- **200% zoom:** 720×450 CSS px viewport at device scale factor 2 (layout-equivalent to a 1440×900 window at 200% browser zoom).
- **320:** 320×640, touch, complete product shell including the collapsed navigation and account link.
- **A pass requires all of:** no horizontal page scroll; no text clipped by an overflow boundary and no ellipsis; no overlap between text, controls, images or cards (chips on their own image excepted); no word broken across lines (addresses marked `.vg-breakable` excepted); full composer placeholder; Today, Studio, Knowledge, Connections and Account reachable (touch ≥44px at 320); desktop rail never beside content at 200% text, 200% zoom or 320; composer in flow (never covering content); every keyboard stop with a visible, unobscured 2px ring (1440, 200% text, 320, menu open).
- **Detector self-test:** the checks fail on the known-bad layouts (four compressed Studio columns at 320: 12 mid-word breaks, 7 clips, 7 overlaps; sticky composer over cards: 6 overlaps; tabular Upcoming at 320: 12 overlaps + horizontal scroll).

## Screens

| Screen | 1440 | 1216 | 200% text | 200% zoom | 320 complete shell |
|---|---|---|---|---|---|
| `/today.html` | pass | pass | pass | pass | pass |
| `/today-ready.html` | pass | pass | pass | pass | pass |
| `/studio.html` | pass | pass | pass | pass | pass |
| `/studio.html?select=rd1` | pass | pass | pass | pass | pass |
| `/knowledge.html` | pass | pass | pass | pass | pass |
| `/account.html` | pass | pass | pass | pass | pass |
| `/making.html` | pass | pass | pass | pass | pass |
| `/week-one.html` | pass | pass | pass | pass | pass |
| `/first-video-deferred.html` | pass | pass | pass | pass | pass |

## Stress scenarios (long content, open detail, five-line composer)

| Scenario | 1440 | 1216 | 200% text | 200% zoom | 320 complete shell |
|---|---|---|---|---|---|
| knowledge-long | pass | pass | pass | pass | pass |
| account-long | pass | pass | pass | pass | pass |
| making-long | pass | pass | pass | pass | pass |
| today-upcoming-long | pass | pass | pass | pass | pass |
| studio-detail-long | pass | pass | pass | pass | pass |
| studio-idea-detail-field | pass | pass | pass | pass | pass |
| composer-five-lines | pass · 5 of 7 lines, scrolls inside | pass · 5 of 7 lines, scrolls inside | pass · 5 of 15 lines, scrolls inside | pass · 5 of 9 lines, scrolls inside | pass · 5 of 20 lines, scrolls inside |
| studio-composer-five-lines | pass · 5 of 8 lines, scrolls inside | pass · 5 of 7 lines, scrolls inside | pass · 5 of 15 lines, scrolls inside | pass · 5 of 9 lines, scrolls inside | pass · 5 of 20 lines, scrolls inside |

## Mobile Studio object view

- **320:** selecting READY opens a dedicated view: True; board hidden: True; first control “Back to Studio”; object title at 169px in a 640px viewport; focus on the title: True; Live content before the detail: False; clipping/overlap/mid-word: 0/0/0. After Back to Studio: board visible True, focus returned to the card True. Pass: True.
- **200% zoom / 200% text (45em):** the approved panel below the board is kept (“Back to context”). Pass: True / True.

## Mobile object view · browser/system Back

- Board scrolled to the READY card (1147px), card opened → view shown, URL `?select=rd1`, focus on the title: True.
- Browser Back → view closed: True; board visible: True; scroll restored to 1147px; focus on the originating card: True; URL `(no select)`.
- Browser Forward → view re-opened: True, focus on the title: True.
- Back to Studio (same history path) → scroll 1147px, focus on the card: True.
- Deep link `?select=rd1` → view; browser Back → board with focus on the card: True.
- Pass: True.

## Menu state and Account orientation

- Collapsed menu (all screens at 200% text, 200% zoom and 320): open label “Close” with aria-expanded=true; closed label “Menu” with aria-expanded=false; focus returns to the button on Close (True) and on Escape (True).
- Account / Settings: primary destinations marked current: none; account control current: True (every mode).

## Layout outcomes

| | 1440 | 1216 | 200% text | 200% zoom | 320 |
|---|---|---|---|---|---|
| Shell | rail | rail | menu bar (rail collapsed) | menu bar (rail collapsed) | menu bar (rail collapsed) |
| Studio columns per row | 4 | 4 | 2 | 2 | 1 |
| Narrowest Studio card (CSS px) | 189 | 231 | 698 | 338 | 288 |
| Studio detail panel | beside board | below board | below board | below board | dedicated object view |
| Today Upcoming rows | tabular | tabular | stacked | tabular | stacked |
| Keyboard stops · Today | 10 | — | 11 | — | 11 |
| axe violations · Today / Studio READY | 0 / 0 | — | 0 / 0 | — | 0 / 0 |

## Composer keys

- **Desktop (1440):** Shift+Enter inserted a newline without sending; Enter sent (submit count 1) without adding a newline; Send sent. Pass: True.
- **Touch (320):** Return inserted a newline and did not send; the Send button sent. Pass: True.
- The send outcome is not defined by the sources: submitting is recorded on the form and changes nothing visible.

## Desktop direction unchanged

Pixel comparison (device scale 2) against renders taken before this correction (`renders/_baseline-before-responsive/`):

| Render | Changed pixels |
|---|---|
| B1_knowledge_1440 | 0% |
| B2_knowledge_1216 | 0% |
| B3_account-settings_1440 | 0.929% (rows 71–884 px, intended: Account orientation change) |
| B4_account-settings_1216 | 1.108% (rows 71–1034 px, intended: Account orientation change) |
| B5_loading_making_1440 | 0% |
| B6_empty_week-one_1440 | 0% |
| B7_qa-deferred_first-video-deferred_1440 | 0% |
| A21-1_today-ready-media_1440 | 0% |
| A21-3_studio-populated-media_1440 | 0% |
| A21-4_studio-selected-detail_1440 | 0.001% (rows 37–390 px, anti-aliasing) |
| A21-5_studio-selected-detail-below_1216 | 0% |

## Renders (full resolution, device scale 2)

- `renders/responsive/R01_today_text200_1440.png` — `/today.html` · 200% text
- `renders/responsive/R02_studio-ready_text200_1440.png` — `/studio.html?select=rd1` · 200% text
- `renders/responsive/R03_today_zoom200.png` — `/today.html` · 200% zoom
- `renders/responsive/R04_studio-ready_zoom200.png` — `/studio.html?select=rd1` · 200% zoom
- `renders/responsive/R05_today_320_complete.png` — `/today.html` · 320 complete shell
- `renders/responsive/R05b_today_320_menu-open.png` — `/today.html?menu=open` · 320 complete shell
- `renders/responsive/R06_studio_320_media-and-ready-detail.png` — `/studio.html?select=rd1` · 320 complete shell
- `renders/responsive/R06b_studio_320_menu-open.png` — `/studio.html?select=rd1&menu=open` · 320 complete shell
- `renders/responsive/R07a_composer_one-line_1440.png` — `/today.html` · 1440 · form[data-composer]
- `renders/responsive/R07b_composer_five-lines_1440.png` — `/today.html` · 1440 · form[data-composer]
- `renders/responsive/R07c_composer_one-line_320.png` — `/today.html` · 320 complete shell · form[data-composer]
- `renders/responsive/R07d_composer_five-lines_320.png` — `/today.html` · 320 complete shell · form[data-composer]
- `renders/responsive/R07e_composer_placeholder_text200.png` — `/today.html` · 200% text · form[data-composer]
- `renders/responsive/R13_studio_320_object-view_ready.png` — `/studio.html` · 320 complete shell
- `renders/responsive/R13b_studio_320_after-back-to-studio.png` — `/studio.html` · 320 complete shell
- `renders/responsive/R14_account_1440.png` — `/account.html` · 1440
- `renders/responsive/R14b_account_320_menu-open.png` — `/account.html?menu=open` · 320 complete shell
- `renders/responsive/R08_knowledge_1440.png` — `/knowledge.html` · 1440
- `renders/responsive/R09_account_1440.png` — `/account.html` · 1440
- `renders/responsive/R10_making_1440.png` — `/making.html` · 1440
- `renders/responsive/R11_week-one_1440.png` — `/week-one.html` · 1440
- `renders/responsive/R12_qa-deferred_1440.png` — `/first-video-deferred.html` · 1440

## Not covered

- Screen readers, Safari, Firefox and real devices were not tested. On-screen keyboards on real phones were not tested; Return behaviour is keyed to a coarse pointer.
- Connections has no screen in the checkpoints: its link is present and reachable but non-executing.

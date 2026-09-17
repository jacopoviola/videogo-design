# Canonical Checkpoint B · change register

**Status (17 Sep 2026): approved.** R13 mobile Studio object view and R14 Account / Settings approved; Design System v12 approved for rollout (integrity record `DS_VERSION_INTEGRITY.md` accepted). “Pricing TBD (placeholder)” remains a production-content blocker, not a design-rollout blocker.

17 Sep 2026 · Decisions B-01–B-06, feed order and crop applied · Approved A2.1 system (Instrument Sans variable, page title 44/48 · 600 · −0.02em, neutral palette, status grammar, media doctrine) applied to five canonical categories. No new workflows, navigation, permissions, object meanings, state transitions or engagement data. Approval board: `APPROVAL_BOARD_B.html` / `renders/APPROVAL_BOARD_B.png`.

## Screens

| Category | Screen (source) | Renders | Media decision |
|---|---|---|---|
| Knowledge / proactive chat | Knowledge default · `B3_page_knowledge.png`, PR:976–1003, FH §5 | `renders/b/B1_knowledge_1440.png`, `B2_knowledge_1216.png` | None forced: facts and conversation are text. “46 job photos” stays a count; Manage use is undesigned. |
| Dense / data-heavy | Account / Settings · `ACC_account_settings.png`, PR:1041–1069, FH §8A | `B3_account-settings_1440.png`, `B4_account-settings_1216.png` (full page) | None: administrative context. |
| Loading | Studio · Making · `09_studio_making.png`, PR:555–568, FH §4 | `B5_loading_making_1440.png` | The object is a video in production → media leads as the **Rendering** reserved area. Named stages, honest ETA, no percentage, no motion. |
| Empty | Studio · week one · `E1_week_one_empty_states.png`, PR:1074–1089, FH §9 | `B6_empty_week-one_1440.png` | Nothing exists yet → text only, no media rectangles, no hatch. |
| QA-deferred (not an error) | “Your first video needs a little more time” · `02_onboarding_qa_deferred.png`, PR:381–396, FH §1 | `B7_qa-deferred_first-video-deferred_1440.png` | **No output shown** (IB-17: QA failure shows no output and no paywall). |

**State classification.** “Your first video needs a little more time” is **QA-deferred**, not an error: Videogo reworks automatically, the owner is not blocked and no recovery action is required. **A generic recoverable-error state is not designed:** the sources contain no recoverable-error screen, copy or recovery action (missing source evidence), so none is invented.

Layout changes materially only on Knowledge (two panes) and Account (row widths), so those have 1216 renders; the other three were validated at 1216 without separate renders (single column, no reflow difference).

## Feed Preview (addendum, applied to Studio and the doctrine)

| Item | Result | Basis |
|---|---|---|
| Model | Truthful forecast of the connected account’s grid: Videogo-owned future posts plus the most recent Live posts imported from the account; six positions (the source’s six slots, PR:919). Provenance and state kept per position. | Addendum; PR:917–919 |
| Order (approved) | **Projected chronology:** the eventual newest post occupies the top-left. Timed Scheduled / Planned posts are ordered by effective publish time, latest first; recent Live posts follow, newest first. **Untimed Planned posts claim no grid position:** they are listed apart above the grid under “Planned · no publish time yet” (label copy provisional). Specimen data is deliberately out of order to prove the sort. | Decision · Feed order |
| Grid and crop (approved) | Videogo-owned three columns, 3:4 grid preview. Crop position comes from positioning metadata when present: the on-screen title-safe box (then the subject box) stays inside the window, centred on the focal point where possible. **Centre is the fallback only when no metadata exists** (the five imported fixtures). Display-only `object-position`; the original asset is never altered. No platform chrome, embeds or engagement data. | Decision · Feed crop |
| States | Text under each tile: LIVE · SCHEDULED + time · PLANNED + time. Live media is filled; Scheduled / Planned media is outlined (2px near-black ring inside a white hairline) — the source Calendar grammar “Filled square = published/locked · outlined = planned” (PR:928). No dimming. | Addendum; PR:928, CONTENT_REALITY_SET “Feed tile” |
| Format | “Reel” / “Carousel · 3” only when metadata confirms it: rd1 Reel (PR:582); lv1 none (not in source); planned radiator video none (PR:442 “Instagram + TikTok”). Imported fixtures carry fixture metadata. | Addendum |
| Failure | Media that exists but cannot be retrieved: dashed “Preview unavailable”, state and confirmed format still shown. | Addendum |
| Empty | No tiles: “Nothing live yet.” (E1 copy, PR:1074–1089). No grey placeholder tiles anywhere. | Addendum |
| Copy | “Preview — Instagram may display crops differently.” below the grid, meta size, `text-secondary` (5.8:1), no icon. | Addendum |
| Integrated Studio | Six Live positions: lv1 + five imported posts (demo fixtures). Nothing Scheduled or Planned (VD-17 conflict). Renders A21-3 / A21-4 / A21-5. | — |
| Specimens (component review, not canonical states) | Populated `A21-6` (Planned Sat 11:00 · Scheduled Thu 18:00 · four Live; photo-like interiors, people, hands, street, macro; 9:16 · 16:9 · 1:1 · 4:5 · 3:4 sources) · Untimed Planned `A21-12` · Partial / failure `A21-10` (four posts, one unavailable) · Empty `A21-7`. Each is its own scenario. | Addendum |
| Not added | Drag-to-reorder, manual positioning, Current / After toggle, pinned posts, tile detail interactions, editing tools. Tiles are not interactive. | Addendum |

**Design System v8:** Feed Preview doctrine (order and crop rules updated) in the README (implementation notes kept separate from doctrine) and a new FeedPreview component (README, preview, `bundle.css` recipe).

**Open (recorded, no interaction added):** access to the uncropped original from the Feed. Videogo-owned posts keep it in the existing object detail (inspection never crops); imported posts have no source path, and adding one would be a new tile interaction. Instagram’s own grid crop may differ (hence the preview copy); runtime thumbnails and provider remain replaceable.

## Visual changes

- Dark fallback-font captures → light neutral canvas, subtle rail, white work surfaces, Instrument Sans, 44/48 page titles.
- **Knowledge:** chat card with owner turns right-aligned on `surface-subtle` and Videogo turns marked by the Videogo mark with the accessible name “Videogo” (`role="img"`); owner turns carry screen-reader text “You:” (SC-21 attribution gap); six fact groups in one bordered list with sentence-case labels, quiet Update per group, qualifiers (“until Nov 30”, “confirmed”) in primary weight; in-card input with a visible `border-control` boundary.
- **Account / Settings:** four groups as white sections with aligned label/value rows; the granted permission shows Allowed + Revoke on its row; refused permissions stay readable (`text-secondary`, 5.8:1) instead of the source’s 2.1:1 faint text; destructive actions are explicit words in the quiet style.
- **Making:** one object — rendering area, MAKING marker, title, format line, three named stages (done check · current filled · upcoming outline, with screen-reader state text), ETA sentence.
- **Week one:** statement object replacing the dashed silence box; “Live · Nothing live yet.” as a quiet section; the hatch and filled square removed.
- **QA-deferred:** centred onboarding column, 4-step indicator (step 3 current), onboarding lead 36/42, stage list with Reworking / Pending markers, secondary “Notify me by email”.

## Copy removed as internal design commentary (documentation only)

| Screen | Removed | Rule kept in docs |
|---|---|---|
| Account / Settings | Subline “Opened from the account control — not part of the main navigation” | IB-50: Account only via the account control |
| Account / Settings | “(WhatsApp shown here when supported)” | SC-38: WhatsApp shown only where supported |
| Week one | Subline “Day one, after payment” (replaced by the approved Studio subtitle “From idea to published result.”) | IB-51 week-one rule |
| QA-deferred | none (the prototype’s “(Prototype) skip ahead” lives on screen 01c, not used here) | — |

Kept because it is owner-facing: Knowledge subline “Update what VIDEOGO knows about you”; the permission note “VIDEOGO can propose expanding a permission … There is no global autonomous mode.”; the Connections / Manage use wayfinding sentence; “Pricing TBD (placeholder)” (IB-10).

## Decisions (resolved 17 Sep 2026)

| # | Decision | Status | Applied |
|---|---|---|---|
| B-01 | Required trust line under Billing | **Approved** | Exact frozen string “VIDEOGO only publishes within permissions you grant.” (PR:252, readme, SC-16), directly under the Billing actions. The source’s padlock glyph is not drawn: icon family undelivered (TBD). |
| B-02 | Account orientation | **Revised (final corrections)** | Today is **not** selected on Account / Settings. No primary destination carries `aria-current`; the account control carries `aria-current="page"` with the neutral selected fill (rail and collapsed menu). Account remains secondary navigation reached only from the account control (IB-50). |
| B-03 | Composer presence | **Approved as a scoped exception** | Screen-specific resolution, **not a universal composer rule:** Knowledge uses its existing in-card input · Account has no composer · QA-deferred has no composer. Every other screen keeps the source composer until reviewed individually. |
| B-04 | Four-step indicator | **Approved provisionally** | Kept on the onboarding QA-deferred screen only. Not a generic error or progress component; not to be reused elsewhere without a new decision. |
| B-05 | Account control | **Standardized** | A navigation link (`<a class="vg-account" href="account.html">`) on every Checkpoint A and B page: same element, appearance, destination, focus ring (2px #0057D9, offset 2px) and target (full rail width × 56px, ≥44px on touch). Checked on 8 pages (`validation/b-decisions.json`). |
| B-06 | Videogo message attribution | **Approved** | The Videogo mark identifies Videogo turns and carries the accessible name “Videogo” (`role="img" aria-label="Videogo"`); the mark is never the only carrier of the name. |

## Responsive and validation correction (not approved yet)

Only the responsive and validation layer changed. Desktop 1440 and 1216 renders match the pre-correction renders to ≤0.003% of pixels (anti-aliasing). Full results: `RESPONSIVE_VALIDATION.md`.

| # | Change | Detail |
|---|---|---|
| R-01 | **Validation report corrected** | Withdrawn: the earlier 200% text pass (CSS root size did not move breakpoints; those screenshots are failures), axe-as-reflow evidence, and the content-only 320/390 studies without navigation or account access. `?study=narrow` retired. |
| R-02 | **Responsive application shell** (decision for approval) | Below 60em (960px at default text; also reached at 200% text or 200% zoom on a 1440 window) the rail collapses into a top bar: outlined lockup + a text “Menu” button (`aria-expanded`, Escape closes) that reveals Today, Studio, Knowledge, Connections and the account link in page flow, not as an overlay. Current destination keeps its selected style. No icons (set undelivered), no bottom bar. The rail is never beside compressed content. |
| R-03 | **Studio board** | Columns measured on the Studio column in rem: four when four ≥11rem cards fit, then two, then one. 1440: 4 · 1216: 4 · 200% zoom: 2 · 200% text: 2 · 320: 1. Detail panel moves below the board below 82.5em (1320px at default text) and follows text size and zoom. Inner layouts (detail split, media inspection, feed labels) use container queries. |
| R-04 | **Mid-word breaks** | `overflow-wrap: anywhere` replaced by `break-word` everywhere; only addresses (`.vg-breakable`) may break inside a string. |
| R-05 | **Today Upcoming** | Container query on the Today column: when the four columns no longer fit, each row stacks (time + status, title, channel). No horizontal scroll. |
| R-06 | **Composer** | The approved multiline textarea replaces the input on every screen with a composer. Grows through five whole lines, then scrolls inside (padding on a wrapper so no partial sixth line shows). Desktop: Enter sends, Shift+Enter newline. Touch (coarse pointer): Return newline, Send submits. In flow at the end of the page (not sticky), so it reserves its full height and never covers cards, tables, actions or detail. Full placeholder at 320 and 200% text. The inline “Change something” field in Studio detail is a wrapping textarea without key behavior. The send outcome is undefined in the sources (non-executing). |
| R-07 | **Copy** | Stress title “… on camera-free video” replaced by “I recommend answering “how long does a boiler service take?” with short guided clips Luca records on the job”. No performance evidence added. |
| R-08 | **Commentary removed** | The composer form tooltip “Composer is persistent and secondary — never the page” (design commentary) removed from Today and Today READY. |
| R-09 | **Feed tiles** | When a tile is narrower than the “Demo fixture” chip (320 panel), the label moves into the tile caption instead of being clipped. Desktop chips unchanged. |

The composer study page (`src/composer-study.html`) is superseded by the product composer.

## Final corrections (conditional approval, 17 Sep 2026)

| # | Change | Detail |
|---|---|---|
| F-01 | **Mobile Studio object view** | Below 40em (640px at default text) opening a Studio object replaces the board with a dedicated full-width view headed by **Back to Studio**; the page heading stays for assistive tech. Focus moves to the object title; Back to Studio restores the board and returns focus to the card. The detail is never appended after the workflow. 200% text and 200% zoom on a 1440 window (45em) keep the approved panel below the board. The view is a browser history entry: browser/system Back and Back to Studio close it and restore the board, its scroll position and focus on the originating card; Forward re-opens it; a deep link (`?select=`) gets a board entry beneath it. Wider layouts keep in-place selection without history entries. |
| F-02 | **Menu → Close** | The collapsed-shell button reads “Close” with `aria-expanded="true"` while open; Close or Escape collapses it and returns focus to the button. |
| F-03 | **Account orientation** | See B-02 (revised). |
| F-04 | **Design System integrity** | v9 was not published by this session: it moved the artifact to Artifact type release `1789650788-4657` and changed no project file. v10 and v11 changed only the files they sent. Evidence: `DS_VERSION_INTEGRITY.md`. Design System now v12 (bounded update: References page-title guidance 44/48 · 600 · −0.02em; ContextPanel mobile Back). |

**Production blocker (not a design-rollout blocker):** Account / Settings shows “Pricing TBD (placeholder)” (IB-10). Replace with approved pricing copy before production.


## Validation

Superseded by `RESPONSIVE_VALIDATION.md` (tool `tools/validate-responsive.mjs`, negative control `tools/selftest-detectors.mjs`). Summary: all 9 screens and 8 stress scenarios pass at 1440, 1216, 200% text, 200% zoom and the complete 320 shell — no horizontal scroll, clipping, overlap or mid-word breaks; navigation and account reachable; composer five lines then internal scroll; keyboard rings visible and unobscured; composer keys as specified. axe: 0 violations at 1440, 200% text and 320 (reported separately, not as reflow evidence). `validation/b-results.json` and `validation/composer-study.json` are historical; their 200% text and 320 claims are withdrawn.

## Known limitations (not hidden)

- **Mobile shell (R-02) needs approval:** it resolves access at narrow widths but is a new navigation pattern for UN-16.
- Composer send outcome, destructive confirmations (Delete account, Cancel subscription, Revoke), Manage use, Update behaviour, Connections screen and the unavailable-media trigger remain undesigned — non-executing.
- Screen readers, Safari, Firefox, real devices and on-screen keyboards not tested.

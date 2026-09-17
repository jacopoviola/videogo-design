# 00 · Source and decision register — Checkpoint A

17 September 2026 · Direction: Composed Expertise · Scope: Today / blocking NEED and Studio / dense default + READY selected. Nothing else.

## 1. Workspace and repository state

| Item | Fact |
|---|---|
| Working folder | `~/Desktop/videogo-design` — **not a git repository**. Contains `CLAUDE.md` (imports `docs/videogo-redesign/CLAUDE_ENTRY.md`), the redesign package, design-kit copies, assets. It does **not** contain the freeze documents, the prototype or `screens/`. |
| Behavior sources | `~/videogo-design` (git) · HEAD `f734247cdf4b01af58bba8d0d659ca876163ddd2` on `main` · working tree: `M README.md`, untracked `.DS_Store` (both pre-existing, untouched). This matches the reconstruction baseline. |
| Output | `~/Desktop/videogo-design/visual-redesign/checkpoint-a/` only. No production file, asset, token or design-kit file was modified in either folder. |
| Design System | Private artifact “Videogo — Composed Expertise” (https://claude.ai/artifact/RdJn49WoDLAu6TUboAKXRG). Not modified in this step. |

## 2. Sources read

**Package (all read in full):** `CLAUDE.md`; `docs/videogo-redesign/` → `00_READ_ME_FIRST.md`, `CLAUDE_ENTRY.md`, `MANIFEST.md`, `NATIVE_DESIGN_SYSTEM_PROMPT.md`, `README_IMPORT.md`, `START_PROMPT.md`; `native-design-system/` (all 6 files); `docs/` → DESIGN_RECONSTRUCTION_INDEX, SOURCE_AUTHORITY_MAP, REDESIGN_BOUNDARIES, SCREEN_INVENTORY, CONTENT_REALITY_SET, COMPONENT_INVENTORY, DESIGN_TOKENS_CURRENT, LAYOUT_COMPOSITION_GRAMMAR, VISUAL_LANGUAGE_REPORT, RESPONSIVE_ACCESSIBILITY_GAPS, VISUAL_DEBT_REPORT, VIDEOGO_VISUAL_DOCTRINE_AND_MASTER_PROMPT, VIDEOGO_Roadmap_v6 (context only; no behavior derived from it).

**Images inspected:** `references/target/TODAY_NEED_DIRECTION_REFERENCE_v1.png` (measured), `references/current/04_today_need.png`, `~/videogo-design/screens/B2_page_studio.png`, `B2b_studio_drawer_open.png`.

**Behavior source inspected directly:** `~/videogo-design/VIDEOGO_UX3_FREEZE_HANDOFF.md` §0–§4; `videogo_ux3_prototype.html` lines 225–280 (shell, nav, account, composer, page head), 429–445 (Today NEED), 880–954 (Studio STUD registry, selection, panel, page); `components/brand/Wordmark.jsx`; `assets/*.svg`.

**Not re-read in this step:** freeze §5–§9, design principles and build handoff (their content reaches this proof through the reconstruction docs), the PDF, artboards/ui_kits/brandbook/guidelines (visual history only).

## 3. Authority applied

1. Behavior, content meaning, action sets, navigation: freeze → prototype → screens (via `REDESIGN_BOUNDARIES.md`).
2. Visual doctrine: `VIDEOGO_DESIGN_SYSTEM.md` + `TOKENS.json` v0.1.
3. Accepted tone: target PNG. Per your instruction, the tokens are a working baseline and **do not outrank** the reference; where they differ, a proposal is shown for approval rather than a token being silently changed.

## 4. Behavior preserved (target: zero changes)

| Rule | How it holds in the proof |
|---|---|
| IB-01 / IB-50 four destinations, account at foot | Today · Studio · Knowledge · Connections; account control bottom-left. Knowledge/Connections/account are non-executing (outside Checkpoint A). |
| IB-02 no bell/badges | None. No column counts added. |
| IB-19/22/23 Today = objects, NEED first | One NEED object, first. |
| SC-26 NEED states consequence | Title + consequence copy verbatim. |
| SC-07 blocker remedy ≠ authorization | `Fix connection` = neutral near-black primary; `Publish` = authorization blue. |
| IB-21 Upcoming = schedule only | Two scheduled rows verbatim; status “Scheduled”. |
| IB-04 / SC-20 composer secondary | Bottom strip; Attach, exact placeholder, Send. |
| IB-28 Ideas → Making → Ready → Live | Four ordered columns, real populations (2/1/1/1). |
| IB-29 Feed / Calendar context | Toggle present; Feed default with 4 Live + 2 Scheduled slots. |
| SC-32 detail in context, selected identifiable | Selecting a card replaces the panel in place; selected card outlined; same card again or “Back to context” clears (PR:900–903). |
| IB-31 detail exposes only Saying / Format / Why this / Status | Exactly those rows (Live keeps its source rows). |
| IB-34 READY = Publish / Schedule / Change something / Reject | All four, in order, no Approve. |
| SC-31 no fake media | “No still” absence slots; no play affordance; feed slots carry state words only. |

## 5. Decisions — verified facts vs proposals

| # | Decision | Type | Detail |
|---|---|---|---|
| D-01 | Page title | **Option, token untouched** | 32/38 vs 44/48 with weight 600 and −0.02em held, so size is the only variable. Shown on `APPROVAL_BOARD.html`. |
| D-02 | Lockup font fallback | **Resolved (asset derivative; Design System updated, live-text lockups deleted)** | Outlined from licensed Instrument Sans Bold (OFL 1.1, sha256 `444f85bf…3bdf`, v1.000). Glyph origins taken from Chrome 152 layout of the source `<text>` with that face loaded; mark geometry byte-identical. 0 `<text>` elements remain. UI typography unchanged. Source files in `assets/` untouched. |
| D-03 | Rail surface | Uses v0.1 `surface-subtle`, main on `surface-canvas` | Matches the reference’s rail/canvas separation. |
| D-04 | Selected nav fill | **PROPOSED token** `--vg-surface-selected #E3E3E8` | v0.1 has no neutral darker than `surface-subtle`, which is now the rail. Text 13.2:1. |
| D-05 | NEED treatment | **PROPOSED** leading zone (88px, `need-surface`) + outline alert glyph (aria-hidden) | From the accepted reference. Word NEED remains the carrier of meaning. Glyph is drawn ad hoc: the icon family is still undelivered (TBD). |
| D-06 | Studio card padding 12px | **PROPOSED density deviation** from `space.objectCompact` 16px | Keeps 4 columns readable at ≈154px (1216). Token left unused. |
| D-07 | Card media absence slot, 40px, text “No still” | **PROPOSED copy + anatomy** | Source cards carry an empty hatch thumbnail. Accessible name ends with “, no preview still available”. |
| D-08 | Upcoming row layout | Visual | Source ““title” — platform” split into title / channel columns (as the reference). Quotes dropped visually; words unchanged. |
| D-09 | Rail width at large text | **PROPOSED** `max(208px, 13rem)` | Identical at default size; prevents “Connections” clipping at 200% text. |
| D-10 | Studio panel below the board ≤1100px | **PROPOSED reflow** | In-flow, DOM order and selection preserved; not modal. Needed for 200% zoom. |
| D-11 | Skip link | Accessibility addition, visible only on focus | Not a new product control. |
| D-12 | Back to context returns focus to the card that was selected | Accessibility detail | Source had no focus management (gap). |
| D-13 | Status markers set uppercase via CSS | Visual | Source strings “Need”, “Ready”, “Idea”… unchanged in DOM. |

## 6. Conflicts and items logged, not solved

| ID | Item | Handling |
|---|---|---|
| UN-31 | Annotations in source copy | **Restored** (UN-31 is “presumed”, not conclusive). Only MV-44 chrome stays removed. See `ANNOTATION_RESOLUTION.md`. |
| UN-11 | Publish and Schedule both open the same sheet | Both non-executing; sheet not in scope. |
| UN-19 | `Fix connection` only toasts in the prototype; reconnect flow undesigned | Non-executing; no success state invented. |
| UN-16 | Owner-mobile shell and narrow composer | Narrow study hides the rail and says so on the page. Composer placeholder clipped: **UNRESOLVED, study does not pass.** |
| — | Calendar context (B2c) | Toggle rendered; Calendar view not built (outside Checkpoint A). |
| — | Lockup tracking | The source SVG declares both `letter-spacing="20"` (0.14em) and `textLength="700"`. Chrome honours the letter-spacing and ignores `textLength` (computed length 813); an SVG-2-strict renderer would compress the word to 700. The outline follows Chrome, which also matches `Wordmark.jsx` (+0.14em). The reference image appears more widely tracked still. **Brand-owner question**, not changed. |
| — | Reference nav icons | The reference shows outline nav icons; the icon set is undelivered (TBD). Proof keeps labels only. |
| — | Date fixture | “Tuesday 8 October” kept verbatim (2024 weekday convention, VD-17). |
| — | Design System preview drift | Fixed: column counts removed from the StudioCard preview; Logos now hold only outlined lockups (NavRail preview uses the outlined lockup). |
| — | Idea/Making/Live detail panels | Built from source content to keep selection behavior intact; **not validated** as Checkpoint A states (Live claim container is TBD). |

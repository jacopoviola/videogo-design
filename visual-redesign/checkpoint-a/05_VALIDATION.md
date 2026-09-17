> **Correction (17 Sep 2026):** the 200% text result below used `html { font-size: 200% }`, which does not move breakpoints; those renders are failures. axe results are not reflow evidence. The 320/390 narrow studies excluded navigation and account access and did not validate the product. See `RESPONSIVE_VALIDATION.md`.

# 05 · Validation — Checkpoint A

Automated: `tools/validate.mjs` → `validation/results.json` (full data), `validation/summary.json`. Environment: Google Chrome 152.0.7977.84 (headless, playwright-core), macOS arm64, 17 Sep 2026. Renders: `tools/render.mjs`, device scale 2.

## Verified (automated)

| Check | Result |
|---|---|
| **Rendered font** (CDP `getPlatformFontsForNode`) | Every sampled node on both screens renders **.SF NS** (San Francisco system face, regular/bold/variable instances). 0 web fonts requested; no silent substitution. |
| **Lockup** | Both outlined SVGs contain 0 `<text>` elements; images load (`naturalWidth > 0`). Glyph positions match Chrome’s live render with the licensed face within 1px (`renders/G_lockup_fallback-vs-live-vs-outlined.png`, row 2 vs row 3). |
| **Text contrast** (every visible text node, computed fg vs effective bg) | 0 failures on Today, Studio default, Studio READY. Minimum **4.82:1** (`text-tertiary` on `surface-subtle`: account sector, “No still”). NEED 5.98, READY 5.61, Publish label 6.24, placeholder 5.54, page title 15.46. |
| **Non-text contrast** | Control boundary 3.67 (content) / 3.37 (canvas); dashed Scheduled slot 3.67; selected card 15.46 on canvas and 11.85 vs unselected border; selected segment 3.19; focus ring 4.88–6.24 on every surface it sits on. |
| **axe-core** (WCAG 2 A/AA, 2.1, 2.2 AA, best practice) | 0 violations on Today, Studio default, Studio READY, and both narrow studies. |
| **Keyboard order** | Today: skip link → Today → Studio → Knowledge → Connections → account → Fix connection → Attach → input → Send. Studio: rail → 5 cards in column order → composer → panel (Back to context → Publish → …). Every stop shows a 2px ring; none obscured (sticky composer checked with `elementFromPoint`). |
| **Studio selection by keyboard** | Enter selects READY and shows its detail; Space on another card switches; Enter on the selected card clears; Back to context clears and returns focus to the card. |
| **Restored source strings** | Upcoming heading, drawer/feed footnotes, feed sentence and `title` tooltips restored per `ANNOTATION_RESOLUTION.md`; renders before this restoration (A/B/D/E/F sets) predate it. Approval-board renders include them. |
| **Long content** (81-char title, 280-char body, 35-char action, 192-char evidence, 65-char placeholder; mixed stress fixtures, not a product state) | No horizontal scroll, no clipping, no text overflow at 1440, 1216, 390. Renders `renders/D_stress_*`. |
| **200% text** (root font-size 200%) | Titles 32→64px, body 32px, controls 28px. No horizontal scroll or overflow on either screen at 1440 or 1216 after D-09. Renders `renders/E_text-200_*`. |
| **200% zoom** (1440×900 → 720×450 CSS) | No horizontal scroll or overflow; Studio panel reflows below the board (D-10). Renders `renders/E_zoom-200_*`. |
| **320px / 390px narrow study** | **UNRESOLVED — does not pass.** No page-level horizontal scroll, but the composer placeholder is clipped (an `<input>` cannot wrap), and the owner-mobile shell is undesigned (UN-16). Renders `renders/C*`, `renders/F_reflow-320_*`. |
| **Target size** | Desktop: all ≥24×24 (smallest 32px Back to context). Touch/coarse pointer: all interactive elements ≥44px high and ≥44px wide (inputs ≥44 high). |
| **Reduced motion** | All transitions compute to 0s. |

## Known failures and risks (not hidden)

1. **UNRESOLVED · narrow composer.** The placeholder is clipped when the strip is narrower than ≈620px (390/320 studies), so the narrow study does not pass. An `<input>` cannot wrap; resolving it needs a composer decision. Desktop 1216/1440: full string visible.
2. **Studio card states (pixel-measured, `renders/board/board-data.json`).** Passive border kept subtle (#D8D8DD, 1.3:1). Selected: 2px #1D1D1F — 15.46:1 on canvas, 16.83:1 on the card, 11.85:1 against the passive border. Keyboard focus: 2px #0057D9 ring with 2px offset — 5.73:1 against the canvas on both sides.
3. **Focus ring vs near-black fill is 2.7:1**, but the 2px offset places the ring on the surface (≥4.88:1), so the adjacent colour is never the fill. Recorded, not changed.
4. **Cross-platform typography is not deterministic by design.** `system-ui` renders SF on Apple platforms and other faces elsewhere (Segoe UI on Windows). Verified only on macOS/Chrome. Determinism across platforms requires packaging a licensed face — a typography decision.
5. Selected detail at narrow width sits below the board and composer: the selection→detail relationship is weak there. Study only; UN-16.

## Not verified

Screen readers (VoiceOver/NVDA announcements), Safari/Firefox/Windows rendering, real touch devices, text-spacing override (1.4.12), Calendar context, Idea/Making/Live detail panels, any pending/success/failure state (none exist in the source).

## Human visual inspection (Claude, on the renders)

- Today 1440/1216: one focal action; NEED reads first; Upcoming quieter; composer secondary. Optical title closer to the reference.
- Studio 1440: cards ≈188px, titles ≤2 lines; panel 360px; four READY actions wrap to two rows without shrinking. 1216: cards ≈154px, titles ≤3 lines, panel 304px, placeholder fully visible.
- Defects fixed before presenting: “Connections” clipped at 200% text; card names announced “No still” before the title; study note outside a landmark; outline tracking initially 20px wider than the live-font render; card media slot reduced 56→40px for density.

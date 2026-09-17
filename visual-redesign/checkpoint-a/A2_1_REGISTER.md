# Checkpoint A2.1 · Integration — visual-change register

17 Sep 2026 · Approved media architecture + Composed Expertise direction, with the locked decisions applied. No new workflows, navigation, permissions, object meanings, state transitions or engagement data.

## Renders (`renders/a2-1/`)

| # | File | Required output |
|---|---|---|
| 1 | `A21-1_today-ready-media_1440.png` | Today READY with media · 1440 |
| 2 | `A21-2_today-ready-media_1216.png` | Today READY with media · 1216 |
| 3 | `A21-3_studio-populated-media_1440.png` | Studio populated with media · 1440 |
| 4 | `A21-4_studio-selected-detail_1440.png` | Studio selected detail · 1440 (panel beside the board) |
| 5 | `A21-5_studio-selected-detail-below_1216.png` | Studio selected detail · 1216 · panel below the board (full page) |
| 6 | `A21-6_feed-populated-crop.png` | Populated Feed detail crop |
| 7 | `A21-7_feed-fallback-crop.png` | Honest Feed fallback (separate specimen) |
| 8 | `A21-8_media-states-specimen.png` | Media states: Available · Rendering · Unavailable · Absent (+ selected, focus) |
| 9 | `A21-9_media-component-sheet.png` | Full media component sheet (ratios, crops, types, states, widths) |

Evidence: `A21_RENDER_LOG.json` (rendered font per page, title metrics, 0 broken images, no horizontal scroll, panel position, card widths/states, one “Demo fixture” label per fixture image, 0 play controls, no commentary strings) · `validation/a2-1-results.json` (axe-core: 0 violations on all six pages) · `validation/a2-1-breakpoints.json`.

## Visual changes

| Area | Before (A2) | A2.1 | Basis |
|---|---|---|---|
| Typography | system-ui, page title 32/38 | **Instrument Sans** official OFL variable font everywhere (verified as loaded font file on every render), synthesis off, no fallback family; page title **44/48 · 600 · −0.02em** | Locked decision |
| Upcoming heading | “Upcoming · schedule, never a recommendation” | “Upcoming” · right “Next 7 days” | Correction 1–2; rule kept in docs |
| Feed | Footnote about tabs / fake likes | Removed | Correction 1 |
| Selected detail | Footnote about hypotheses / internal machinery | Removed | Correction 1 |
| Studio subtitle | “What VIDEOGO is making, and where it is” | “From idea to published result.” | Correction 3 |
| Media states | Shared grey “No still” bar | **Available** image/poster · **Rendering** reserved 4:5 area “Rendering” (Making card) · **Unavailable** bounded dashed “Preview unavailable” (specimen; trigger TBD) · **Absent** compact text “No preview”, no rectangle (Idea not produced) | Correction 4 |
| Feed | State words only | Live tile 1 shows the Live fixture poster (full frame: its title would be cut by a 9:16 crop). Specimen also maps Scheduled tile 1 to the READY fixture per B2c; remaining tiles keep state words. No likes, views or comments | Correction 5 |
| Feed on the Studio screen | — | Scheduled mapping shown **only in the Feed specimen**: B2c lists “Heat pump vs new boiler” as scheduled Thu 17 · 18:00 while B2/B2b show it READY (VD-17). Putting both on one screen would show one video in two states | Source conflict, flagged |
| Responsive | Panel beside board down to 1100px; cards ≈154px at 1216 | **≤1319px** the same panel moves below the board, before the composer (DOM move keeps reading and focus order). Beside the board (≥1320px) the panel scales 304→360px and the main inset 24→40px so cards stay ≥180px. Measured: 1440 → 189px · 1380 → 185 · 1320 → 181 · 1319 → 257 (below) · 1216 → 231 | Correction 6 |
| Composer when panel is below | Sticky, could float over Publish | Static at the end of the page | Defect found in render |
| “Demo fixture” label | Chip + burned-in mark | **Once per instance**: overlay chip on cards, Today poster and feed tiles; “Provenance · Demo fixture” in inspection facts. Burned marks removed; SVG `<title>`/`<desc>` and `fixture_` filenames keep standalone files identifiable | Correction 7 |
| Context panel element | `aside` | labelled `section` (valid both beside the board and inside `main`) | Accessibility (landmark nesting) |

## Preserved

Four-item navigation and account control · NEED and selected-object treatments · authorization blue #0057D9 only on READY marker, Review & publish and Publish · Today READY copy, evidence rows and trust line · four Studio stages, card titles and meta, Saying / Format / Why this / Status, the four READY actions · selection toggle and Back to context · inspection views never crop · no play controls.

## Open (unchanged, not solved here)

Scheduled-vs-READY source conflict for “Heat pump vs new boiler” (VD-17) · “Radiator bleeding in 90 seconds” is Planned on Today (B1) but an unproduced Idea in Studio (B2) — pre-existing fixture inconsistency · unavailable-state trigger · playback · Calendar context · owner-mobile shell and narrow composer (UN-16) · copy “No preview” and “Rendering” in the media area are proposals.

## A2.1 mechanical corrections (after approval)

| Correction | Result |
|---|---|
| Absent media copy | “No media yet” → **“No preview”** in the component, specimens and doctrine. |
| READY vs Scheduled contradiction | The integrated Studio screen maps no Scheduled or Planned post: none exists there without contradicting the board (B2c schedules “Heat pump vs new boiler” Thu 17 · 18:00, PR:929; B2/B2b show it READY — VD-17). |
| Fixture doctrine | Design System: demo fixture illustration style is not Videogo’s brand style; Videogo must accommodate diverse real photography, footage, people, environments, graphics and vertical video. |
| Tooling | Fixture text outlining draws glyphs in font units (opentype.js produced NaN path data at some scaled origins). |

**Superseded by the Feed Preview addendum** (see `CHECKPOINT_B_REGISTER.md` § Feed Preview): the Calendar-source snapshot specimen, the empty-tile fallback and the first six-poster component specimen. Old renders kept in `renders/a2-1/superseded/`.

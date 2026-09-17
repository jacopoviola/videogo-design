# Checkpoint A2 · Media is first-class

> **Superseded in part by A2.1** (`A2_1_REGISTER.md` and the Design System “Media — primary component family” doctrine): four separate media states replace the shared “No still” treatment, “Demo fixture” appears once per instance, typography is locked to Instrument Sans with a 44/48 page title, and the Studio panel moves below the board under 1320px.

Scope: three media proofs plus the honest media-absent fallback and a media component sheet. Typography is held at the v0.1 baseline (system-ui, page title 32/38) so media is the only variable; font and title options remain on `APPROVAL_BOARD.html`.

## Renders (`renders/a2/`)

| File | Proof |
|---|---|
| `A2-1_today-ready-media_1440.png` (+ `A2-6_…_1216`) | Today · READY with media |
| `A2-2_studio-populated-media_1440.png` | Studio · populated media board |
| `A2-3_studio-selected-media-detail_1440.png` (+ `A2-7_…_1216`) | Selected media detail |
| `A2-4_studio-media-absent-fallback_1440.png` | Honest media-absent fallback (the approved “No still” board, unchanged) |
| `A2-5_media-component-specimens.png` | Media component: ratios, crop rules, types, provenance, states, responsive widths |
| `A2_RENDER_LOG.json` | Card widths, crop mode per card, broken images (0), horizontal scroll (none), play controls (0) |

Source: `src/today-ready.html`, `src/studio.html?media=fixtures[&select=rd1]`, `src/media-specimens.html`, `src/js/media.js`, `src/js/media-fixtures.js`, `src/assets/media/`. Regenerate with `tools/make-fixtures.mjs` and `tools/render-a2.mjs`.

## Media sources — none real

Both repositories were searched for JPG/PNG/WebP/GIF/MP4/MOV and image slots. **No real Videogo output, customer photo, still or video exists** (confirmed by `SOURCE_AUTHORITY_MAP.md` §5 “real video stills” missing, `VISUAL_LANGUAGE_REPORT.md` A7, empty brandbook `image-slot`s). All media in A2 are **demo fixtures**:

| Fixture | Stands in for | Where marked |
|---|---|---|
| `fixture_ready_heat-pump-vs-boiler_9x16.svg` | Poster frame of READY “Heat pump vs new boiler: the honest math” | SVG `<title>/<desc>`, burned “DEMO FIXTURE” mark, `fixture: true` in data, UI “Demo fixture” chip/provenance |
| `fixture_live_89-pre-winter-check_4x5.svg` | Poster frame of LIVE “The €89 pre-winter check, explained” | same |
| `fixture_idea_job-photo_4x3.svg` | One of “your real job photos” (visual source of the Idea) — flat illustration, not a photograph | same |
| `specimen_*.svg` | Neutral ratio/safe-zone guides, not linked to any object | labelled “SPECIMEN” |

Fixture text is outlined (no font dependency). Fixtures depict no people, no customer premises and no performance data.

## Source facts used (unchanged meaning)

| Object | Facts | Source |
|---|---|---|
| READY (Today) | Title “Heat pump vs new boiler” is ready for your go; body; Review & publish; Upcoming Sat 11:00 “Radiator bleeding in 90 seconds” · Planned; date Thu · 17 Oct | PR:960–970 (B1) |
| READY evidence | Why this (PR:895); Format “Consideration · voiceover + comparison graphics · passed quality review” (PR:582); duration 0:41 (PR:580); Instagram Reel (PR:582, PR:895) | same object in Studio / screen 10 |
| Trust line | “VIDEOGO only publishes within permissions you grant.” | PR:252; SC-16 (wherever publishing appears) |
| Studio cards / detail | Titles, meta, Saying/Format/Why this/Status, READY actions | PR:885–897 |
| Media derived facts | 9:16 from “Instagram Reel”; “Photo” + “Your job photos” from “Luca voiceover over real job photos” (PR:887); Instagram channel for LIVE from the @morettimpianti feed (PR:917) | derived, stated |

Not shown because not in source: LIVE duration and ratio, on-screen text content, voiceover script, any media for Idea “Radiator bleeding in 90 seconds” (not produced) and Making “3 signs your boiler needs a check” (rendering). Those two cards show the absent state.

## Decisions needing approval

| # | Decision | Note |
|---|---|---|
| M-01 | Today READY composes B1 copy + the same object’s poster, Why this, Format and the trust line | B1 itself shows no media or evidence; nothing from a different object is mixed in |
| M-02 | B1 kicker “Your video advantage, every day” omitted | UN-24 (unresolved) and doctrine §18A “No slogan added above Today”. Confirm |
| M-03 | B1 “— · 2 videos in production · results collecting on 3 live videos · Moving” row omitted | Schedule-only rule IB-21 wins (C-19 / UN-20) |
| M-04 | Trust line added under READY actions in Today and Studio detail | SC-16; the B1 and B2b captures do not show it |
| M-05 | Studio card: 4:5 media crop leads; format/channel chip bottom-left, duration bottom-right, provenance top-left | Cards 189px at 1440, 155px at 1216 |
| M-06 | Selected detail: whole 9:16 poster (200px at 1440, 150px ≤1320) with Channel / Poster frame / Duration / Provenance beside it, then the four IB-31 rows, READY actions, trust line | Panel stays 304–360px (v0.1) |
| M-07 | Feed panel slots keep state words only | Which posts occupy the live grid is not in source; no poster assigned |

## Crop rules (implemented in `src/js/media.js`)

1. Card crop is **4:5**, cover, positioned on the image’s focal point and clamped to its edges.
2. **Subject-safe:** the declared subject box must be fully inside the crop window.
3. **Text-safe:** the declared on-screen title box must be inside the window **and clear of the overlay bands** (top and bottom 13% of the crop, where chips sit).
4. If a rule fails, the card shows the **full frame** (contain) on a neutral mat and labels it “Full frame”.
5. Inspection surfaces (Today, detail) **never crop**: original ratio shown whole.
6. **Absent** (no media exists): 40px “No still”, no frame, no play affordance. **Unavailable** (media exists but cannot be shown): ratio frame kept, dashed boundary, “Preview unavailable” — product trigger **TBD**.
7. Chips are opaque near-black (white 12px text, 16.8:1) or white (provenance); never translucent over media.

## Component state coverage

Image preview · video poster frame · 9:16, 1:1, 4:5, 4:3, 16:9 sources · cover and full-frame crops · duration · format/channel · provenance (“Demo fixture”; real media would show its source, e.g. “Your job photos”) · default, selected (2px #1D1D1F), keyboard focus (2px #0057D9, 2px offset), unavailable, absent · 154/189/280px card widths. Accessible names: card = title + meta + “video poster frame, Instagram Reel, 9:16, 0:41, demo fixture”; inspection image alt = title + “(demo fixture)”.

## TBD / not done

Playback, captions and media controls (not in source) · on-screen text and voiceover script display · unavailable-state trigger · real-media provenance wording · Calendar context · narrow shell (UN-16) and narrow composer (still unresolved) · A2 automated checks: axe-core 0 violations on Today READY, Studio populated, Studio detail and the narrow Today READY study; card names lead with the title; keyboard selection opens the media detail (`validation/a2-results.json`). Screen-reader and cross-browser testing not done.

# VIDEOGO Design System

VIDEOGO is a social-video engine for small businesses: it finds what deserves communicating, produces the video, publishes with permission, and learns. Its success condition is that the owner opens it **less** over time. This system is optimised for earned absence, never engagement.

Sources: the VIDEOGO brief (chat, Sept 2026), `uploads/VIDEOGO-Brand-Book.pdf` (v1, 6 Sept 2026, internal), `uploads/VIDEOGO_Roadmap_v7.md` (30 Aug 2026), the token registry at github.com/jacopoviola/videogo-design (`videogo-tokens_1.css`, generated from `VIDEOGO_DESIGN_TOKENS.md`). Where this system and the UX.3 freeze disagree, the freeze wins.

## The mark
The mark is the owner's E-chevron glyph alone: transparent ground, set at 1.4× the wordmark's cap height and vertically centred on it, in the wordmark's colour (bone on canvas, canvas on bone). Terminals are squared (radius 0 applies to the mark). Its bounding box is a square, and the label chip inherits that silhouette. Files in `assets/`: `videogo-mark.svg`, `videogo-mark-inverse.svg`, `videogo-lockup.svg`, `videogo-lockup-inverse.svg`. The lockup SVGs carry live text and must be converted to outlines with Instrument Sans installed before trademark filing. The original rounded-terminal chevron PNGs in `uploads/` are superseded.

## Roadmap v7 → design decisions
- **Object vocabulary**: roadmap says NEED / RECOMMEND / READY / LEARNED; the brand book says NEXT. The book is later and wins on the surface; `ObjectCard` accepts `type="recommend"` as an alias of `next` so code and product speak the same language.
- **Nav**: roadmap lists five sections (Today · Studio · Results · Knowledge · Connections); the book freezes four. Results lives inside Knowledge (`ui_kits/live/`). **Open conflict — resolve in the UX.3 freeze, not here.**
- **Observable process, opaque method** → `ProcessStages`: the fixed public stage vocabulary (Understanding your business → Finding opportunities → Building the video → Checking consistency → Ready) as discrete stages, never a bar.
- **Onboarding payoff** (first video inside a feed preview) → `FeedPreview`: scheduled/planned slots dimmed on the hatch, never fake counts.
- **Human Capture is scarce and batched** → a Capture Session is a READY object (amber: it waits on the owner's time) with evidence rows for lines, b-roll and total time, and always a "Use synthetic instead" ghost. Specimen in `components/objects/objects.card.html`.
- **Provenance grades** stay internal. On the surface only three provenance words exist: nothing (VIDEOGO measured it), "You told me" (owner-reported), "Inferred from your website" (belief inferred, not confirmed). Inferred facts use the *collecting* container (dashed) until confirmed.
- **Epistemic ladder** (Observation → Pattern → Mechanistic hypothesis → Operational learning → Economically validated → Transferable) collapses to three visible grades: collecting (0–1), early signal (2), learned (3+). Stages 4–5 never get a fourth visual grade — they change what the copy may claim, not how the container looks.
- **Settings stay boring**: account, billing, team, permissions. No KPI configuration surface.
- **Marketing**: no guaranteed views, no transfer coefficient, no "proprietary data" claims. The site copy in `ui_kits/site/` follows the grade ladder.

## Principles — every element serves one
01 No alert language (no bell, badge, red dot). 02 Emptiness reads as competence. 03 Absence is drawn, never left blank. 04 Evidence looks different from opinion. 05 Confidence without scoring. 06 The owner is never made to feel behind. 07 Success is the screen you stop opening. 08 Observable process, opaque method — never a dashboard. 09 Permission has a visual grammar: granted / requested / refused.

## Content fundamentals
- VIDEOGO speaks in **first person, present tense, sentence case**: "I'm preparing your next videos." It states the consequence, not the alarm ("Thursday's video can't go live"). It names uncertainty out loud and carries provenance ("based on 12 videos over 8 weeks", "you told me").
- Claims are graded and the copy is bound to the grade: **collecting** → "Still collecting results." · **early signal** → "Early signs suggest…" + must name the next test · **learned** → "VIDEOGO learned…" + must state its evidence base. A claim only ever moves up.
- Labels are mono, uppercase, terse: `NEXT POLICY`, `SAVES · LAST 28 DAYS`. The observation window is part of the label.
- Never: "optimise / boost / unlock / supercharge", countdowns, invented urgency, apologies for silence, model names, prompts, scores. No emoji anywhere. Fixed trust line wherever publishing or payment appears: "VIDEOGO only publishes within permissions you grant."
- Owner-reported figures carry "You told me"; measured ones carry nothing.

## Visual foundations
- **Colour**: warm near-black ramp (hue ~65) `#0C0B09 → #37322B`, bone text `#F5F2EC`. Two hues, both semantic: `--vg-signal #FF0048` = blocked (NEED chip only), `--vg-action #E9A93C` = waiting on you (READY chip + primary controls). Text on either hue is `#0C0B09`. Zero decorative colour, no gradients, no tinted panels. The brand itself is achromatic.
- **Type**: Instrument Sans (UI + display, weights 450/500/700 only) and IBM Plex Mono (every label, every measured value — numbers are never set in the sans). Scale in `tokens/typography.css`. Negative tracking on display, +0.12–0.16em on mono labels, nothing between 12–16px tracked. Measure 66ch.
- **Space**: 4px base (4 8 12 16 20 24 32 40 56). Nav 214. Page 30/34. Card 16/18, 10 between parts, 12 between objects, 6–7 between rows. Silence state 48px vertical — the one exception.
- **Form**: radius 0 everywhere. No shadows. Elevation = one ramp step + a border (needs-you: panel + `#37322B`; at rest: shell + `#292520`). Absence = 135° hatch `#100E0C/#151310`, 5px stripe, dashed hairline.
- **Backgrounds**: flat canvas. Hatch fields are the only texture. No imagery except real product stills (16:9 thumbnails, no wash, no filters); the empty state is the hatch.
- **Motion**: 120ms state / 200ms enter / 320ms page, `cubic-bezier(.2,0,0,1)`, 6px max travel, colour-only feedback on controls. Never animate a NEED, an evidence value, the silence state, or progress of unknown duration. Reduced motion → 0ms.
- **Hover / press**: colour steps only (ghost → shell → panel; amber → `#D69A34`; bone → white). Nothing scales or moves. Focus = 1px bone outline, 2px offset. Disabled = 45% opacity.
- **Borders**: 1px always; solid = resolved, dashed = unresolved/collecting/absent, dashed amber = permission requested.
- **Transparency/blur**: none, except the duration chip at 86% canvas.
- **Cards**: the one Object shell for four types (NEED, READY, NEXT, LEARNED); anatomy fixed: chip › title › body › media › evidence › actions.

## Iconography
Stroke only, 1.75px, butt caps, miter joins, 24×24 grid, rendered 15px in nav / 22px in specimens, `currentColor`. Icons always accompany a label, never replace one; set kept under fifteen glyphs. No fills, duotone, emoji, or unicode glyphs as icons. **The icon set has not been delivered yet** — the owner will supply SVGs. Three placeholder glyphs exist in the house stroke (padlock in `PermissionLockup`, check in `SilenceState` and `ProcessStages`) and should be swapped for the delivered set. Nav currently renders labels only.

## Components (`components/`)
brand/Wordmark (+ Mark, MarkGlyph) · controls/Button, LabelChip, Nav, AccountControl, Composer · content/Thumbnail, Attribution, EvidenceRow, MetricTile, AbsenceTile, PermissionLockup (+ `TRUST_LINE`), ProcessStages, FeedPreview · objects/ObjectCard · states/ConfidenceClaim, SilenceState. Each has `.d.ts` and `.prompt.md`; each directory has a `*.card.html`.

## Artboards & screens
`artboards/00` (Brand), `artboards/01–06` (Tokens, Type, Controls, Content, Object types, States), `ui_kits/today/` (07 Today desktop + mobile), `ui_kits/live/` (08 Live / operational learning), `ui_kits/site/` (marketing surface). `artboards/book.html` is the print-ready PDF of the nine artboards (landscape). `brandbook/index.html` is the five-page brand summary (strategy, logo suite, colour, type, imagery), also print-ready. `artboards/boards.jsx` is their single source.

## Index
`styles.css` (imports `tokens/*.css`) · `tokens.json` (developer tokens) · `_dev/loader.js` (renders the JSX in cards and kits without a build step) · `guidelines/` (small foundation cards) · `SKILL.md` · `github.md` (source repo).

## Intentional additions
`--vg-nav-active #1C1A16` and `--vg-action-pressed #D69A34` (hover/press steps the registry implies but does not name); `claim`, `key`, `value`, `metric`, `duration` type tokens derived from component specs in the brief.

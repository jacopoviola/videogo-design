# VIDEOGO — Architectural Design Principles (v1)

**Status:** governs the visual layer of the frozen UX.3 experience, 7 September 2026.
**Sources:** the VIDEOGO design system (`videogo-design`, 6 Sept 2026) applied to the UX.3 Freeze Spec v1.1 + Final Gate Corrections. **Where this document and the UX.3 freeze disagree, the freeze wins.** Where the design system and the roadmap disagree on names, the system records the reconciliation (`recommend` is an alias of NEXT; Results lives inside contextual drawers, never the nav).

This document is the "why" behind every visual decision. The exact values live in `design-kit/tokens/` and `design-kit/tokens.json`; the component contracts live in `VIDEOGO_UX3_FRONTEND_BUILD_HANDOFF.md`.

---

## The one-sentence thesis

VIDEOGO's success condition is that the owner opens it **less** over time — so every pixel is optimised for **earned absence, never engagement**. The interface is a calm operator reporting in, not a dashboard asking to be watched.

## The nine principles

**01 — No alert language.** No bell, no badge, no red dot, no counters, no urgency mechanics. Attention is requested only by an object that genuinely needs the owner, and the object itself carries the request.

**02 — Emptiness reads as competence.** A screen with nothing on it means the engine is running well. Silence is a designed, first-class state (the SilenceState pattern: dashed hairline, 48 px of air, a bone check, one calm statement) — never an apology, a mascot, or a "get started" prompt.

**03 — Absence is drawn, never left blank.** Unknown is not zero and not whitespace: an unobservable value renders as the 135° absence hatch with a dashed hairline, an em dash in the faintest text step, and a caption that states *why* it is not observable. Scheduled/planned future slots use the same hatch. Never 0, never N/A, never a spinner.

**04 — Evidence looks different from opinion.** Every measured value is set in IBM Plex Mono; everything VIDEOGO *says* is set in Instrument Sans. Evidence rows hang off a 1 px rule with mono keys; the observation window is part of the label ("SAVES · LAST 28 DAYS"). Owner-reported figures carry "You told me"; measured ones carry nothing.

**05 — Confidence without scoring.** Confidence is how *resolved* the container is, never a number: collecting = dashed hairline + faint text · early signal = solid hairline + must name the next test · learned = panel elevation + border + the claim in the largest voice, with its evidence base. A claim only ever moves up. Stages beyond "learned" change what the copy may claim, not how the container looks.

**06 — Colour means "you are needed" and nothing else.** The brand is achromatic (warm near-black ramp, bone text). Exactly two hues exist, both semantic: **crimson #FF0048 = VIDEOGO is blocked** (NEED chips only — never a border, fill, heading or decoration) and **amber #E9A93C = waiting on your authorization** (READY chips and primary controls only). Text on either hue is near-black. A hueless screen therefore literally means "nothing needs you." Zero decorative colour, no gradients, no tinted panels.

**07 — The owner is never made to feel behind.** No progress bars on unknown durations, no checklists of chores, no setup wizards, no streaks. Process is shown as discrete, honest stages (ProcessStages: done / now / upcoming) with ETAs only when the system can stand behind them.

**08 — Observable process, opaque method.** The owner sees *what stage* work is in ("Understanding your business → Finding opportunities → Building the video → Checking consistency → Ready") — never the machinery (no model names, providers, prompts, render settings, hypotheses, learning goals). Never a dashboard.

**09 — Permission has a visual grammar.** Granted = solid border, closed padlock, Revoke on the same line. Requested = dashed amber, open padlock. Refused/absent = borderless, faintest text, inert. The trust line appears wherever publishing or payment appears: *"VIDEOGO only publishes within permissions you grant."*

## Foundations (the decisions, with reasons)

**Colour.** Warm near-black ramp, hue ~65: canvas `#0C0B09` → shell `#12100E` → panel `#171512` → nav-active `#1C1A16`; hairlines `#211E1A`/`#292520`; emphasis border `#37322B`. Text ramp: `#F5F2EC` (statements) / `#A59E92` (body) / `#6F685C` (mono labels) / `#4B453C` (faint/absence). Elevation is one ramp step plus a border — objects that need the owner sit on panel with the emphasis border; objects at rest sit on shell with a hairline. The warm hue keeps darkness hospitable rather than clinical.

**Type.** Two faces, three jobs. **Instrument Sans** (weights 450/500/700 only) is everything the interface or VIDEOGO says — display tracked negative, body at 13.5/1.55, VIDEOGO's first-person voice at 16/1.6. **IBM Plex Mono** is every label and every measured value — labels uppercase, tracked +0.12–0.16em, terse ("NEXT POLICY", "SAVES · LAST 28 DAYS"). Numbers are never set in the sans: the mono is the typographic marker of evidence. Measure caps at 66ch.

**Space.** 4 px base scale (4 8 12 16 20 24 32 40 56). Nav rail 214. Page 30/34. Card 16/18; 10 between parts of one object; 12 between objects; 6–7 between evidence rows. Compact everywhere except the silence state's 48 px vertical — the one place air is the message.

**Form.** Radius 0 everywhere, including the mark. No shadows — depth would imply hierarchy the evidence hasn't earned; elevation is surface + border. Borders are always 1 px: solid = resolved, dashed = unresolved/collecting/absent, dashed amber = permission requested.

**Motion.** Motion reports, it never advertises: 120 ms state changes (colour only), 200 ms enters (6 px rise max), 320 ms page transitions, one ease `cubic-bezier(.2,0,0,1)`. Never animate: a NEED object, an evidence value, the silence state, or progress of unknown duration. Reduced motion → 0 ms.

**Interaction feedback.** Hover and press are colour steps only (ghost → shell → panel; amber → `#D69A34`; bone → white). Nothing scales, moves or glows. Focus = 1 px bone outline, 2 px offset. Disabled = 45% opacity.

**Iconography.** Stroke only, 1.75 px, butt caps, miter joins, 24-grid, `currentColor`; icons always accompany a label and never replace one; the whole set stays under fifteen glyphs. No fills, duotone, emoji, or unicode glyphs as icons. (The final icon set is not yet delivered; padlock and check exist as placeholders in the house stroke. Nav renders labels only.)

**Imagery.** Flat surfaces; the hatch is the only texture. No imagery except real product stills (16:9 thumbnails, no wash, no filters); a thumbnail without a real frame shows the absence hatch — never a fake still, never a play icon.

## The object grammar

One card shell serves all four proactive object types — anatomy fixed, in this order: **label chip › title › body › media › evidence rows › actions.**

| Type | Chip | Surface | Meaning |
|---|---|---|---|
| NEED | crimson fill | panel + border (elevated) | VIDEOGO is blocked; the blocking action is the **bone** button |
| READY | amber fill | panel + border (elevated) | waits on the owner's authorization; primary action is **amber** |
| NEXT | mono text only | shell + hairline (at rest) | recommendation; nothing is required |
| LEARNED | mono text only | shell + hairline (at rest) | evidence changed intent; informational |

At most **one primary button per object**. A NEED is always first on the page and never animates. Publishing is the authorization — there is no separate Approve. Status words (Idea, Making, Live, Connected, Design partner) are plain mono labels, never coloured chips.

## Content principles

VIDEOGO speaks in first person, present tense, sentence case, and states the consequence, not the alarm ("Thursday's video can't go live"). It names uncertainty out loud and carries provenance ("based on 12 videos over 8 weeks", "you told me"). Claim copy is bound to the claim grade — collecting → "Still collecting results." · early → "Early signs suggest…" + next test · learned → "VIDEOGO learned…" + evidence base — and is generated from the grade, never hand-written. VIDEOGO's own statements carry the bone attribution square; the owner's words sit in a plain bordered block — there is no transcript, no timestamps, no second avatar. Never: "optimise / boost / unlock / supercharge", countdowns, invented urgency, apologies for silence, model names, scores, emoji.

## Hard rules (override any request)

Radius 0 · no shadows · no bell/badge/red dot · crimson only on NEED chips · amber only on READY chips and primary controls · numbers always in IBM Plex Mono · unknown values drawn as absence, never 0 · four nav items, forever · one primary button per object · no emoji · no gradients · no play icons on empty thumbnails · icons never replace labels.

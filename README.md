# VIDEOGO — UX.3 Freeze × Design System v1 · Build Package

**7 September 2026.** The frozen UX.3 experience rebuilt in the VIDEOGO design system (visual layer only — no flow, copy, gating or nav change). Everything needed to build the front end.

## Read in this order

1. **`VIDEOGO_UX3_DESIGN_PRINCIPLES.md`** — the architectural design principles (the "why" behind every visual decision, the nine principles, foundations, object grammar, hard rules).
2. **`VIDEOGO_UX3_FREEZE_HANDOFF.md`** — the frozen experience: every screen, every interaction rule, exact load-bearing copy. This is the behavioral source of truth; it wins every conflict.
3. **`VIDEOGO_UX3_FRONTEND_BUILD_HANDOFF.md`** — the engineering map: component inventory → surface mapping, screen recipes, interaction/state rules, a11y bar, don't-build list.
4. **`VIDEOGO_UX3_FREEZE_ONE_DOCUMENT.pdf`** — all three of the above as one document with all 38 screens inline (for LLM context windows / review).

## Artifacts

- **`videogo_ux3_prototype.html`** — self-contained clickable prototype in the design system. Open in any browser. All 23 mandatory scenarios + 4 browsable app pages + gate-correction surfaces; nav, drawers, sheets, chips and toasts are live. Vanilla JS; scenarios in the `S[]` registry.
- **`screens/`** — 38 PNG captures of every screen and state (filenames referenced throughout the handoff).
- **`design-kit/`** — the design system, verbatim: `styles.css` + `tokens/*.css` (all `--vg-*` custom properties), `tokens.json` (machine-readable), `components/` (17 React components with `.d.ts` + `.prompt.md` each), `assets/` (mark + lockup SVGs).

## The rules that survive any refactor

Radius 0 · no shadows · no bell/badge/red dot · crimson `#FF0048` only on NEED chips · amber `#E9A93C` only on READY chips + primary controls · numbers always in IBM Plex Mono · unknown drawn as absence (hatch + em dash + reason), never 0 · four nav items (Today · Studio · Knowledge · Connections), forever · one primary button per object · publishing IS the authorization (no Approve) · no emoji · trust line wherever publishing or payment appears: *"VIDEOGO only publishes within permissions you grant."*

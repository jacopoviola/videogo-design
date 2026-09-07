# VIDEOGO — Frontend Build Handoff (UX.3 frozen experience × design system v1)

**Audience:** the engineer/LLM building the production front end.
**Authority order:** `VIDEOGO_UX3_FREEZE_HANDOFF.md` (behavior, flows, load-bearing copy — frozen) → `VIDEOGO_UX3_DESIGN_PRINCIPLES.md` (visual rules) → this document (implementation mapping) → `design-kit/` (tokens + component sources, verbatim from the design system). If anything here conflicts with the freeze handoff, the freeze wins.

---

## 1. Stack & setup

- Any React setup works; the component sources in `design-kit/components/` are dependency-free React function components with inline styles reading CSS custom properties, plus `.d.ts` types and a `.prompt.md` usage note each. Port them to your styling system if you prefer — the tokens are the contract, not the inline styles.
- Load `design-kit/styles.css` once (it imports `tokens/*.css`: fonts, colors, typography, spacing, form, motion, base). All values are exposed as `--vg-*` custom properties; the machine-readable copy is `design-kit/tokens.json`.
- Fonts: Instrument Sans (400–700 variable; use 450/500/700 only) and IBM Plex Mono (400/500/600), both SIL OFL 1.1, currently served from Google Fonts (`tokens/fonts.css`); self-host binaries before production hardening.
- Brand assets: `design-kit/assets/` — `videogo-mark.svg` / `-inverse`, `videogo-lockup.svg` / `-inverse`. The mark is the E-chevron glyph alone, squared terminals, set at 1.4× the wordmark cap height. Lockup SVGs carry live text — convert to outlines (with Instrument Sans installed) before trademark use.
- Global CSS ground rules: `*{box-sizing:border-box;border-radius:0}`, body = canvas bg + `--vg-body` in text-2, `:focus-visible` = 1px bone outline offset 2px, `::selection` = border bg / text-1. `@media (prefers-reduced-motion: reduce)` zeroes all durations.
- The reference implementation of every screen is `videogo_ux3_prototype.html` (vanilla JS, one file, scenario registry `S[]`) — resolve layout questions with `screens/*.png`, behavior questions with the prototype source.

## 2. Component inventory → surface map

All sources in `design-kit/components/`. "Freeze surfaces" reference the freeze handoff sections and screenshot ids.

| Component | Contract (essentials) | Freeze surfaces |
|---|---|---|
| `controls/Nav` | Exactly four items: Today · Studio · Knowledge · Connections (`NAV_ITEMS`, never extended). 214px side rail with Wordmark on top and AccountControl at the foot; `orientation="bottom"` for the mobile bar (44px targets). Active = `--vg-nav-active` + text-1 + 500; never amber. Labels only until the icon set is delivered. | every screen; §0.2 |
| `controls/AccountControl` | Initials in mono inside a bordered 34px square + business name + sector. Opens Account/Settings (secondary utility, §8A) — the only route to it. | every screen; `ACC` |
| `brand/Wordmark` (+ `Mark`, `MarkGlyph`) | Achromatic lockup; `mark` = cap height px; `markOnly` for avatar/app icon. | nav rail; auth/marketing surfaces |
| `objects/ObjectCard` | The one shell for NEED / READY / NEXT / LEARNED (`type="recommend"` aliases `next`). Anatomy fixed: chip › title › body › media › evidence › actions. need/ready = panel+border; next/learned = shell+hairline. Never animates when `type="need"`. Max one primary button in `actions`. | Today objects (`04`,`05`,`13`,`20`), Ready (`10`), week-one (`E1`) |
| `controls/LabelChip` | `kind`: need = crimson fill · ready = amber fill · everything else = mono text-3, no fill (use for IDEA / MAKING / LIVE / CONNECTED / DESIGN PARTNER…). Never carries any other meaning. | all objects, Studio columns, status rows |
| `controls/Button` | Three variants only: `blocking` (bone fill — only inside a NEED), `primary` (amber — one per object; Publish, Send, Confirm, Allow, Good — make it), `ghost` (border `#37322B` — everything else: Schedule, Change something, Reject, Later, Not now, Attach…). 34px desktop / 44px touch. Hover/press = colour steps only. | everywhere |
| `controls/Composer` | Persistent secondary strip at a section's bottom: ghost Attach + field + one primary Send. Never the page; never a transcript. Placeholder is the frozen string: "Tell VIDEOGO something — e.g. 'talk about our new boiler service'". | §0.4; all main pages |
| `content/EvidenceRow` | Mono key (88px column, +0.12em caps) + sans value, hung on a 1px left rule. `rows=[{k,v}]`. Never a table, icon or chart. | Why this / Expected / Format / Status blocks (`01d`,`05`,`08`,`10`,`22`, drawers) |
| `content/MetricTile` | Mono 28px value; observation window inside the label ("SAVES · LAST 28 DAYS"); `delta` in words against the account's own baseline, never a chart; `provenance="You told me"` for owner-reported. | Live drawers (`14`–`16`,`21`) |
| `content/AbsenceTile` | Unknown ≠ 0: hatch bg, dashed border, em dash in text-4, caption stating why ("Not observable — no booking link connected"). Never a spinner. Never animates. | `14` (collecting), `21` (bookings), `E1` |
| `states/ConfidenceClaim` | `grade`: collecting = dashed + text-3 body · early = hairline + 14px text-2 + `nextTest` required · learned = panel + border + 18px text-1 claim + evidence children. Copy is generated from the claim grade (freeze §0.6). A claim only moves up. | `14`–`16`, `21`, digest claims |
| `states/SilenceState` | Dashed hairline, 48px vertical, bone check, statement 17/450 + status line. Zero hue, zero animation, no illustration/CTA. | `06`, `E1` (statement variant) |
| `content/ProcessStages` | Discrete stages, never a bar: done = bone check · current = bone square + optional note · upcoming = outlined square. The only place a stage advancing may animate (200ms colour). Public stage vocabulary only — no machinery. | onboarding working (`01c`), QA deferred (`02`), Making (`09`) |
| `content/Thumbnail` | 16:9, 168×96 at object scale; duration chip mono 9.5/600 on 86% canvas, bottom-right, 5px inset. No `src` → absence hatch; never a spinner or play icon. | Ready cards, Studio cards, capture coach |
| `content/FeedPreview` | 3-col 9:16 grid; published/ready slots real, scheduled/planned slots dimmed hatch; state word in micro mono. Never fake counts, no platform chrome. | Studio Feed context (`B2`), onboarding payoff |
| `content/Attribution` | Bone 22px square + first-person statement in the voice register. No timestamp, no name, no bubble, no second speaker. Owner messages: plain bordered block, right-aligned (see prototype `.msg.me`). | Change something (`11`), Knowledge chat (`17`,`18`,`B3`) |
| `content/PermissionLockup` (+ `TRUST_LINE`) | granted = solid border, closed padlock, Revoke inline · requested = dashed amber, open padlock, Allow · refused = borderless text-4, inert. Status words: ALLOWED / ASKING / NOT ALLOWED. `TRUST_LINE` = "VIDEOGO only publishes within permissions you grant." — render wherever publishing or payment appears (paywall, publish sheet, auto-publish, Account). | Connections (`B4`), Account permissions (`ACC`), trust lines |

## 3. Screen recipes (composition per page)

- **Today** (`B1`,`04`–`07`): header (mono kicker + display-2 "Today" + date in micro mono, right) → 0–3 ObjectCards (NEED always first) → Upcoming strip (schedule rows: mono time · sans title · mono status — never a recommendation) → Composer. Silence day = SilenceState instead of objects.
- **Studio** (`B2`): four columns with mono headers IDEAS · VETO WINDOW / MAKING / READY / LIVE; cards open a right drawer (EvidenceRow + actions; selected card border steps to bone); context panel toggles Feed (FeedPreview) | Calendar (mono grid; filled square = published/locked, outlined = planned). No "+ New concept", no Approve, no Ads toggle.
- **Knowledge** (`B3`,`17`,`18`): chat column (Attribution pattern) mutates fact cards on the right (mono card labels, check + "UPDATED JUST NOW" on mutation). Consequential identity boundary = one modal (panel + border) with Confirm / Cancel.
- **Connections** (`B4`,`19`): PermissionLockup list — four supported connections, nothing else. Trust line at the foot (access variant).
- **Publish sheet** (`10b`): right sheet on scrim rgba(12,11,9,.65), shell + left border; pre-filled platform chips (selected = bone border), caption textarea, when fields, amber Confirm & schedule, trust line.
- **Account / Settings** (`ACC`): reached only from AccountControl. Account / Billing / Permissions (PermissionLockup rows with Revoke) / Your data. No notification matrix, no global autonomous mode.
- **Human Capture mobile** (`20`): three phone screens (setup+consent / coach / complete); consent copy is frozen; synthetic voice/avatar always a separate permission.
- **Week one** (`E1`): SilenceState-style "VIDEOGO is preparing your first batch." + hatch "Nothing live yet." card. Never templates or create buttons.

## 4. Interaction & state rules

- Hover/press/focus/disabled exactly as tokens (`--vg-dur-state` colour-only; focus bone outline; disabled 45%).
- Enter animations: 200ms, ≤6px rise — but never on a NEED, an evidence value, the silence state, or unknown-duration progress. Page transitions 320ms.
- Reject flow: five chips (Not true / Not us / Not good enough / Not now / Other), one tap; selected chip steps to bone; response is VIDEOGO speaking (Attribution).
- First-Dismiss teaching: render once ever (persist a flag), inline within the object.
- Toasts: panel bg + border, text-1, bottom-center of the app pane, ~2.4s; confirmation language only, no emoji, no exclamation marks.
- All numerals user-visible = mono. All labels = mono uppercase tracked. Everything VIDEOGO says = sans, first person, sentence case.

## 5. Accessibility & quality bar

Contrast: text-1 17.4:1, text-2 8.5:1 on canvas; mono labels (text-3, 3.9:1) are ≥ large-text equivalent — never use text-3 for body copy; text on crimson/amber is near-black. Touch targets 44px on mobile (`touch` props). Focus visible on every interactive element. `prefers-reduced-motion` honored globally. Chips/status words are real text, not colour alone (colour never carries meaning without the mono word next to it). Thumbnails: `alt` from the video title; absence tiles: `aria-label="not observable"`.

## 6. Don't-build list (from the freeze, restated for engineers)

No notification bell/inbox/badges · no fifth nav item, ever · no Approve button (publish/schedule IS approval) · no "+ New concept" · no progress percentages on unknown durations · no zeros for unknowns · no scores/confidence numbers in UI · no timeline editor · no template/connector marketplaces · no KPI config · no global autonomous mode toggle · no fake social proof · no emoji anywhere in product UI.

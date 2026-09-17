# 03 · Component and state notes (only what Checkpoint A uses)

Source: `src/styles/components.css`. All values resolve to `src/styles/tokens.css`. Source handlers for non-executing controls are recorded in `data-source-action` / `data-out-of-scope` attributes.

| Component | Anatomy | States implemented | Accessibility | Open / TBD |
|---|---|---|---|---|
| App shell | Rail (`surface-subtle`, 208px ≥13rem) + main (`surface-canvas`, 40px inset ≥1320px, 32/24px below) [+ context panel 304–360px] | — | Skip link; `nav`, `main`, `aside` landmarks; one `h1` per page | Owner-mobile shell (UN-16) |
| Lockup | Outlined SVG, 128px wide | Static | `alt="VIDEOGO"` | Tracking question (see register) |
| Nav item | 36px min (44 coarse), 16px/500 label | Default, hover (`surface-selected`), current (`surface-selected` + 600 + `aria-current`), focus ring | Text labels only | Icon family TBD |
| Account control | 36px initials tile + name / sector, top hairline | Default, hover (underline name), focus | Button name includes “Account and settings” | Destination outside scope |
| Page header | `h1` page title + subline (`text-secondary`) | Token / optical title | — | D-01 |
| Button · primary | Near-black fill, white 14/600 | Default, hover, pressed, focus, disabled (defined) | Native button | Pending/success/failure TBD (UN-19, UN-29/30) |
| Button · authorize | `authorization` fill | Default, hover, pressed, focus | Used only for Publish | Publish-now route (UN-11) |
| Button · secondary | White, `border-control` 3.7:1 | Default, hover, pressed, focus | — | — |
| Button · quiet / quiet-fill | Transparent / `surface-subtle` | Default, hover, pressed, focus | Reject, Back to context, Attach | — |
| Sizes | 36px desktop, 32px compact (Back to context), 44×44 under `pointer: coarse` | | Long labels wrap; never truncated | — |
| Status marker | 12/16/600 +0.025em uppercase, 6px radius | NEED (red on need-surface 6.0:1), READY (blue on auth-surface 5.6:1), neutral (Idea, Making, Live) | Word always present | — |
| Work object · NEED | 14px radius, `border-subtle`; 88px `need-surface` zone + 24px alert glyph; body: marker → 22/29 title → consequence → primary action | Static | `article` labelled by title; glyph `aria-hidden` | D-05 approval |
| Upcoming list | Section head + hairline rows: time (tabular) · title · channel · state | Static; stacks ≤720px | `ul`, `time` | — |
| Composer | White strip, 14px radius: Attach · divider · input · Send | Input focus ring (inset), placeholder `text-tertiary` 5.5:1 | Visually hidden label; form landmark name | Placeholder truncates when the strip is narrower than ≈620px (narrow study only; known failure) |
| Studio column | 13/600 secondary heading + card list | — | `section` labelled by heading; `ul` | — |
| Studio card | 12px padding, 14px radius, 40px “No still” slot, 14/600 title, 13 meta | Default, hover (`border-control`), selected (2px `text-primary`), focus | `button aria-pressed aria-controls`; Enter/Space toggle | Card boundary contrast (see validation) |
| Context panel · Feed | Segmented Feed/Calendar (32px, selected white + `border-control`), handle sentence, 3×2 9:16 slots (Live solid, Scheduled dashed) | Feed only | `aside` labelled; `aria-pressed` | Calendar view not built |
| Context panel · READY detail | Back to context → READY marker → 18/24 title → evidence rows → 4 actions (wrap) | Selected state; Back returns focus to card | `aria-labelledby` title; not modal, no focus trap | — |
| Evidence rows | `dl`, 76px key column, 13/18, 12px row gap | Static | Definition list semantics | — |
| Field (panel inline input, Idea detail only) | `border-control` boundary, focus ring | Default, focus | Visually hidden label | Not validated in Checkpoint A |

# Agent navigation — design reference package

This is a public design/reference repository, not a deployed product. Do not put private company strategy, personal beliefs, governance records, credentials or customer information here.

1. Read uppercase `README.md` and `VIDEOGO_UX3_FREEZE_HANDOFF.md` first. The lowercase root/design-kit readmes are historical notes when they disagree with the freeze. Do not infer authority from filename case or the order a search returns files.
2. In a receiving implementation project, read its canonical authority map, current experience amendments and registered design pin before retrieving visual sources. The receiving project's explicit admitted commit is distinct from this repository's current HEAD. No new pin, re-freeze or production approval follows from this navigation.
3. Read `VIDEOGO_UX3_DESIGN_PRINCIPLES.md`, `VIDEOGO_UX3_FRONTEND_BUILD_HANDOFF.md`, then the required `design-kit/` and screen assets at that admitted ref. Where a skill points to absent relative paths, inspect the tree; do not invent `design-kit/artboards/` or `design-kit/ui_kits/`.
4. There are parallel root/design-kit copies of components/tokens/assets. Compare blob identities before changing a shared source. Do not independently maintain two competing versions, delete frozen paths or rename case-only readmes as an incidental build fix.

## Known reconciliation items before production UI

- Older readmes/specimens describe Results placement as open and Capture as READY with a synthetic substitute. The freeze resolves Results contextually and Capture as a NEED. Consult current admitted experience rather than copying the old specimen.
- The 'claims only move up' shorthand must be reconciled with the receiving project's evidence invalidation/supersession rules. Do not introduce monotonic claim authority from a component comment.
- The frontend handoff's contrast assurance is not a completed accessibility audit: small 9–10px text is not established as large text by its contrast ratio. Verify actual sizes/contrast and semantic use before production UI acceptance.
- Missing source-index references, external font loading and demo/prototype scaffolding are explicit follow-ups. A screenshot or prototype is layout evidence, not proof of a working backend, accessibility or product readiness.

Raise unresolved behavioral/visual conflicts with exact source paths and receiving-project authority. Explain the user journey before component mechanics. This entrypoint records navigation issues; it does not revise frozen product behavior or establish a new acceptance gate.


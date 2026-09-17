# Removed-string resolution (Checkpoint A)

Rule applied: a string stays removed only if `SOURCE_AUTHORITY_MAP.md` or `REDESIGN_BOUNDARIES.md` identifies it **conclusively** as review chrome. `REDESIGN_BOUNDARIES.md` UN-31 labels in-product annotations “Presumed annotation, not product copy. **Confirm.**” — presumed is not conclusive, so every UN-31 string is restored.

| String (source) | Authority finding | Decision |
|---|---|---|
| Fake browser bar with URL `app.videogo.ai/…` (PR:262–263, CSS PR:44–46) | RB **MV-44** “Prototype spec chrome: browser frame, scenario headers, gate-check note, phone frames — Not product UI at all”; SAM §2 row 6 “Include spec chrome (… fake browser bar …)” | Stays removed |
| Scenario header: kicker “Scenario 4 / 23” / “App page · live navigation”, title, rationale, reference chips (PR:282–285, `head()`/`headB()`) | RB **MV-44** “scenario headers”; SAM §2 row 6 “spec chrome (scenario header …)” | Stays removed |
| “EXPERIENCE-gate check for this scenario …” note (PR:1106) | RB **MV-44** “gate-check note”; SAM §2 row 6 “gate-check note” | Stays removed |
| Review index / scenario list (PR:225–235) | PR CSS comment “review shell (spec chrome, same system)” (PR:25); RB **MV-44**; SAM §2 row 5 “Contains spec chrome” | Stays removed |
| “Upcoming · schedule, never a recommendation” (PR:440) | RB **UN-31**: presumed, confirm | **Restored** as the Upcoming heading |
| Drawer footnote “Drawer shows only what's useful: no hypothesis, references or learning goals — that machinery stays internal.” (PR:912) | RB **UN-31**: presumed, confirm | **Restored** below detail actions |
| Feed footnote “Tabs like “your existing posts vs proposed by VIDEOGO” live here — honest contrast, no fake likes.” (PR:921) | RB **UN-31**: presumed, confirm | **Restored** below the feed |
| “Dimmed slots are the hatch — never fake counts.” (PR:917) | Not in SAM or RB (listed only in VISUAL_DEBT_REPORT VD-11, which defers to UN-31). Implementation guidance tied to the superseded hatch treatment, not owner-facing copy (your decision, 17 Sep 2026). | **Removed from the product interface; preserved here only as removed visual guidance.** |
| `title` tooltips: “Open Today/Studio/Knowledge/Connections” (PR:247), “Account / Settings” (PR:251), composer “Composer is persistent and secondary — never the page” (PR:256) | Not identified as annotation in SAM or RB | **Restored** as `title` attributes |
| Quotation marks around Upcoming titles (PR:441–442) | Not annotation; punctuation removed in the earlier proof | **Restored**. The “ — Instagram” separator is shown as a column (visual layout). |

Every restored item remains subject to your UN-31 confirmation.

## A2.1 decision (17 Sep 2026) — supersedes the restorations above for product UI

Jacopo directed that internal design commentary is documentation only. Removed from the product interface; the rules they express stay in the doctrine:

| String | Rule it expressed (kept in documentation) |
|---|---|
| “Upcoming · schedule, never a recommendation” → heading “Upcoming”, right “Next 7 days” | IB-21: Upcoming is schedule only |
| “Tabs like “your existing posts vs proposed by VIDEOGO” live here — honest contrast, no fake likes.” | SC-30 / IB-29: feed shows honest live vs scheduled, no fake engagement |
| “Drawer shows only what's useful: no hypothesis, references or learning goals — that machinery stays internal.” | IB-31: detail exposes only Saying / Format / Why this / Status |
| Studio subline “What VIDEOGO is making, and where it is” → “From idea to published result.” | Copy decision by Jacopo |

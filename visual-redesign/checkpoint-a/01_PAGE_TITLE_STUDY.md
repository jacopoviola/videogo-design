# 01 · Page-title study

**Superseded by `APPROVAL_BOARD.html` section C.** The alternative is now 44/48 with weight 600 and −0.02em held at the token, so size is the only variable, and it is shown for both font options. No recommendation is made on the board.

---

# 01 · Page-title study — token vs optical alternative

Identical content, composition, palette and components. Only the `page title` role changes.

| | Token (v0.1) | Optical alternative (PROPOSED) |
|---|---|---|
| Size / line height | 32 / 38px (2rem / 2.375rem) | 44 / 48px (2.75rem / 3rem) |
| Weight / tracking | 600 / −0.02em | 700 / −0.03em |
| Title ÷ object title (22px) | 1.45× | 2.0× |
| Renders | `renders/A1_…token.png` (1440), `A3_…` (1216) | `renders/A2_…optical.png` (1440), `A4_…` (1216), `B5_…` (Studio) |
| Side by side | `comparisons/01_page-title_token-vs-optical_1440.png`, `01b_page-title_detail.png` | |

**How the alternative was derived.** Pixel measurement of `TODAY_NEED_DIRECTION_REFERENCE_v1.png`: “Today” cap height 44px vs the object title’s 22px (ratio 2.0), with body and nav caps at 14–15px. Normalising the object title to the 22px token puts the reference title at ≈44px, set heavier than 600 with tight tracking. The reference appears to be a ~1060px-wide layout scaled up, so absolute pixels were not copied; the ratio was.

**Recommendation: the optical alternative (44/48/700).**
- At 32px the page title is only 1.45× the NEED title directly below it, so the page anchor and the work object compete. At 44px the hierarchy reads page → object → body in one glance, as in the accepted reference.
- It stays well short of marketing-hero scale and costs 14px of vertical space; Studio density is unaffected (board and panel keep their positions within 14px).
- It passes the same checks (large-text contrast 15.5:1, no overflow at 200% text, wraps cleanly at 320px).

**Not done:** `TOKENS.json` and the Design System keep 32/38 until you approve. Onboarding lead (36/42) would then sit below the page title and should be re-evaluated at Checkpoint B.

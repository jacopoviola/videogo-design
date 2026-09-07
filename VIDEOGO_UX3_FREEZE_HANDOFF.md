# VIDEOGO — UX.3 FROZEN EXPERIENCE HANDOFF

**Status:** FROZEN + FINAL GATE CORRECTIONS APPLIED — STRUCTURAL EXPERIENCE LOCKED, 6 September 2026 · **VIDEOGO DESIGN SYSTEM v1 APPLIED (visual layer only), 7 September 2026**
**Audience:** any LLM / designer / engineer continuing VIDEOGO into brandbook, SYSTEM, PLAN, BUILD.
**Package contents:** this document (the source of truth for the experience), `videogo_ux3_prototype.html` (self-contained clickable prototype in the VIDEOGO design system, open in any browser), `screens/` (38 PNG captures of every screen and state, filenames referenced below), `VIDEOGO_UX3_DESIGN_PRINCIPLES.md` (the architectural design principles now governing the visual layer), `VIDEOGO_UX3_FRONTEND_BUILD_HANDOFF.md` (component/token mapping for engineers), and `design-kit/` (tokens, component sources and brand assets from the VIDEOGO design system v1).
**Governing canon:** use `VIDEOGO_CANON_INDEX.md` for layered authority. This handoff is the source of truth for the frozen human-facing experience; it may not override Roadmap / Step-A / Step-B invariants. It incorporates the Final EXPERIENCE Gate Corrections (6 Sept 2026). If this document conflicts with higher canon, surface the conflict; do not silently reconcile.

**How to use this package as an LLM:** read this document top to bottom first; it contains every screen, every interaction rule, and the exact copy for load-bearing strings. Use the screenshots to resolve layout questions and the HTML source to resolve behavior questions (all logic is vanilla JS in one file; scenario templates are in the `S[]` registry). Do not invent product behavior not described here — the freeze rule is "apply, don't redesign."

---

## 0. Global invariants (frozen — violating any of these fails the EXPERIENCE gate)

1. **Positioning:** "Give VIDEOGO your business. It runs the social-video engine and gets smarter." The product behaves like a senior social/creative operator, not a tool the customer operates.
2. **Primary navigation is exactly four items:** Today · Studio · Knowledge · Connections. Nothing else. Ever. No Results nav (results live in contextual drawers), no Human Capture nav (it is a flow reached from a Need), no Settings wizard surface in the MLP.
3. **No notification bell or inbox anywhere.** Outbound reach is one chosen channel (email always available; WhatsApp only where supported), used only for genuine blockers, time-sensitive consequential actions, batched Ready items, and the periodic digest.
4. **Chat/composer is available everywhere but primary nowhere.** Placeholder copy: *"Tell VIDEOGO something — e.g. 'talk about our new boiler service'"*. It sits at the bottom of pages as a persistent secondary strip. Today is never a blank chat.
5. **The customer owns truth, identity, consent, spend and granted permissions. VIDEOGO owns marketing judgment.** Never ask the owner a strategy question ("which hook do you prefer?"); recommend, and let them veto/override/correct.
6. **Scores rank, gates decide; language follows evidence.** UI learning copy is *generated from* the canonical Learning Claim stage, never hand-written: collecting → "Still collecting results." / early signal → "Early signs suggest…" / operational learning → "VIDEOGO learned…". Never over-claim.
7. **Unknown ≠ zero.** Anything unobservable says so ("Not observable — no booking link connected"), never displays 0. Owner-reported signals carry provenance ("you told me").
8. **Metric order is objective-relative.** A Trust video leads with saves/completion; reach is last and labeled "context, not the goal." Reach never mechanically leads.
9. **Prototype ICP:** primary account is **Moretti Impianti** — family-run heating, plumbing & boiler service, Varese, since 1998; owner/technician **Luca Moretti**; current offer: **€89 pre-winter boiler check (until Nov 30)**; boundary (confirmed): **never fear-based selling**; vocabulary note: say "spesa," not "investment." **Farmacia Vitalis** (pharmacy) appears ONLY in the gated design-partner Direct Response scenario, explicitly labeled.
10. **Pricing is a placeholder.** "Pricing TBD (placeholder)" until commercially locked. No 14-day free trial anywhere — the acquisition mechanic is one real video, then a hard paywall.

---

## 1. Onboarding (screens `01a`–`01e`, `02`)

**Flow (frozen order):** website → "Here's what I understood" → working states → first video → hard paywall.

**Screen 1 — Website (`01a`).** One field (website URL), optional direct upload and Google Drive (never implied as required). Copy: "Give VIDEOGO your business / Paste your website. That's all we need to get started."

**Screen 2 — Here's what I understood (`01b`).** Five cards: Your business / Who you help / What you offer / How you sound / People & assets — each with Edit. **Rule: at least one inference must be concrete enough to prove the system actually read the business** (here: the €89 pre-winter check found on the homepage). Generic-only inferences fail the gate (Barnum-effect guard).

**Screen 3 — Working (`01c`).** Honest observable states: Understanding your business → Finding an opportunity → Building your first video → Checking it. **ETA promise is split:** understanding "takes about a minute"; the video "takes longer — we'll tell you the moment it's ready." Never promise the full video in minutes unless true. "You can close this page — we'll email you when it's ready."

**Screen 4 — First video (`01d`).** Production route is **forced no-human** (voiceover + on-screen text + the business's own photos). Shows: title, "Why this" (evidence-based: seasonal search spike + review themes), style, "Passed VIDEOGO's internal review ✓". Includes the soft forward-tease: "Future videos like this could be stronger with Luca on camera — we'll suggest it later when it's worth the effort. You can always skip a capture request." **"Try a different angle" is bounded** (counter shown: "1 left"). Absolutely no fake likes, no fake performance numbers, no impossible human footage, no locked/approve-to-unlock cards.

**Screen 5 — Hard paywall (`01e`).** Appears **only after the user has watched** the QA-passed video. Headline: "Keep VIDEOGO running." Sells continuation of a working operator, listing: proactive opportunity-finding; differentiated videos with minimal human input; user authorizes what goes live until more is granted; learns only what evidence supports. Price block: "Pricing TBD (placeholder)". Trust line (padlock glyph in the house stroke, never an emoji): "VIDEOGO only publishes within permissions you grant." Footnote: "No free trial."

**QA-failure state (`02`).** If the render cannot pass quality review within bounded automatic retries: show NO output, show NO paywall. Copy: "Your first video needs a little more time. We'll email you when it's ready." (a more specific ETA appears only when the system genuinely has one) plus "Nothing is needed from you. Your understanding of the business is saved."

## 2. Activation (`03`)

After payment, exactly three things: (1) connect Instagram and/or TikTok; (2) choose outbound contact — Email always available, WhatsApp visible only where supported (shown dimmed "coming soon" otherwise); (3) continuity message: "I'm preparing your next videos… **Nothing needed from you right now.**" Then "Go to Today." "Maybe later" is available (no forced completion). No setup wizard, calendar setup, marketing questionnaire, or integration marketplace.

## 3. Today (`04`–`07`, `22`, `B1`)

Today is an **attention-allocation page**: proactive objects ARE the page (1–3 visible normally), each carrying its own action. Object types (canonical vocabulary, frozen): **NEED** (blocking; VIDEOGO cannot proceed) · **READY** (consequential item awaiting authorization) · **NEXT** (strategic recommendation) · **LEARNED** (evidence changed intent; informational). **"Upcoming" is schedule only and never means recommendation.** At most ONE non-blocking ask per visit; a blocking NEED may override.

- **NEED example (`04`):** "Instagram connection expired — publishing is paused" with embedded [Fix connection]; shows downstream consequence ("Thursday's video can't go live").
- **NEXT example (`05`):** recommendation with **Why this** (evidence: most-repeated question in reviews/DMs) and **Expected** (honest, including uncertainty: "direct booking impact is uncertain"). Actions: Good — make it / Later / Dismiss.
- **Silence state (`06`):** the SilenceState pattern — dashed hairline, 48px of air, bone check in the house stroke: "Everything is moving. Nothing needed from you." plus a one-line status (in production / scheduled / collecting). Silence is a valid, designed state.
- **First-Dismiss teaching (`07`, `07b`):** shown ONCE, on the first strategic dismissal only: "**Dismiss** means 'don't do this.' **Later** means 'not now.'" Never repeated. (Reason: Dismiss writes strategic evidence, Later writes timing evidence; mislabeling poisons learning.)
- **Quiet-week digest (`22`):** compact three rows — **Done** (what shipped, what was decided, "0 things needed from you") / **Actual** (best outcome with provenance; explicitly states when business impact is not observable and why) / **Next** (intent). This digest is the value story under earned silence.
- **Default day (`B1`):** typically one READY object + Upcoming strip; READY's button deep-links to review/publish.

## 4. Studio (`08`–`16`, `B2`, `B2b`, `B2c`)

**Pipeline: Ideas → Making → Ready → Live.** Context panel on the right toggles **Feed | Calendar** (`B2`, `B2c`): feed shows the honest Instagram-grid preview with scheduled slots dimmed (no fake engagement); calendar shows scheduled posts only. Clicking any card replaces the panel with its **drawer** (`B2b`).

- **Ideas = veto window (`08`), not an approval queue.** Production proceeds unless the owner intervenes. Card drawer exposes ONLY: What we're saying / Format / Why this / Status. It never exposes: Hypothesis, References, Learning goal, evidence graphs, providers/models. Actions: Not now / Reject / Change something (free text). No "+ New concept" button; owner-originated requests enter through the composer and pass through the same reasoning pipeline. Status line sets the veto norm: "Starts production tomorrow unless you say otherwise."
- **Making (`09`):** credible stages (Writing & assembling → Producing → Quality review) + honest ETA ("usually ready by 15:00 today"). No percentages theater, no provider names.
- **Ready (`10`):** actions are exactly **Publish / Schedule / Change something / Reject** — no standalone Approve; publishing IS the authorization. The Publish sheet (`10b`) opens **pre-filled**: recommended platform(s), caption, recommended time — all inline-editable. Trust line (padlock glyph in the house stroke, never an emoji): "VIDEOGO only publishes within permissions you grant." **No auto-publish ask on first publish.**
- **Change something (`11`):** natural-language edit intent; VIDEOGO classifies underneath. Behaviors shown: a quality fix is applied and generalized ("I'll keep intros tighter on comparison videos"); a vocabulary correction becomes durable state ("'spesa', not 'investment' — will apply to every future video").
- **Reject (`12`, `12b`):** one tap of reason chips — **Not true / Not us / Not good enough / Not now / Other**. "Not us" response offers (does not force) promotion to a permanent boundary via Knowledge.
- **Earned auto-publish proposal (`13`):** later-state only, based on demonstrated behavior ("last 6 educational videos performed as predicted and were published without strategic changes"), scoped to ONE content type; exceptions always come back for confirmation. Actions: **Allow for this type / Not now**. Withdrawal always possible — the stable revoke surface is Account / Settings (§8A). Trust line: "VIDEOGO only publishes within permissions you grant." No global autonomous mode.
- **Live drawers (`14`/`15`/`16`):** three evidence states of the same layout. Collecting: dash tiles + "Still collecting results." Early signal: "**Early signs suggest** checklist-style boiler videos hold attention longer than your average. I'll test one more before changing the plan." (names the next test). Operational learning: "**VIDEOGO learned:** videos answering real customer questions get saved about 3× more than promotional ones — based on 12 videos over 8 weeks." + Next policy + saturation note ("this angle is starting to repeat, so I'm also trying one fresh structure"). **"Make another like this" is user intent, not a strategy button** — the one bounded pushback: "I can do that — though this angle is starting to repeat. I'd try a customer-story video next."

## 5. Knowledge (`17`, `18`, `B3`)

Two panes: chat (left) mutates the knowledge cards (right) **visibly** — every correction is confirmed in words and reflected on the card ("✓ updated just now"), including downstream consequences ("two upcoming ideas mentioned installs — I've reworked both"). Cards: About / Customers / What we sell / How we sound / People & assets / What we talk about, each with Update.

- **Routine correction (`17`):** no ceremony, immediate visible mutation.
- **Consequential Protected Identity change (`18`):** exactly one explicit confirmation dialog — "Make this a permanent boundary? 'Moretti Impianti never uses fear-based selling.' VIDEOGO will refuse this angle in every future video — even if it performs well elsewhere. Only you can change this later." **Confirm / Cancel.** Performance can never mutate identity; only the owner can.
- **People & assets (`B3`):** minimal, not a DAM. Per-person state (on camera ✓ / consent pending) and a "Manage use" affordance (what footage exists, permitted uses, withdraw anytime). A new person's consent is requested from that person at their first capture, never assumed from the owner.

## 6. Connections (`19`, `B4`)

A short supported list, nothing else: **Instagram** (publishing + results), **TikTok**, **Google Drive** (named folder, read-only), **Direct upload**. Each row: what it's for, status, connect/disconnect. Footer: "🔒 VIDEOGO only accesses what you connect… Disconnect anything, anytime." No marketplace, no search, no available-integrations rail. **Meta Ads exists only as a gated design-partner state and is invisible to standard accounts.**

## 7. Human Capture (`20`)

Never a section; a **contextual NEED** creates it: "15 minutes of Luca on camera would make November's trust videos stronger" — with why (evidence), what (batched: 2 talking clips + 3 workshop shots), effort (phone, natural light, no memorizing), and **"Not this month"** as a first-class answer. Requests are batched monthly; capture is asked for only when real presence materially improves the work, and preferably only after live value exists.

**Mobile flow — three screens (frozen):**
1. **Session setup + consent:** what you'll need (15 min / quiet / natural light / phone stand), what this session creates, and contextual consent: "VIDEOGO may use footage from this session to create videos for Moretti Impianti." **Synthetic voice/avatar always needs separate permission and is not part of the MLP.**
2. **AI camera coach:** one clip at a time; guides framing, position, lighting, the spoken prompt ("say it in your own words…"), retakes. One copied link = one setup-compatible session.
3. **Complete:** clip checklist, where footage goes (asset library), what happens next (videos appear in Studio as usual).

## 8. Design-partner Direct Response — gated (`23`)

Explicit banner: "Design-partner mode · Farmacia Vitalis (pharmacy) — this surface never appears for a standard account." One narrow pattern only: keyword comment ("ALLERGIE") → approved DM (editable text) → link/booking. Actions: **Allow / Not now / Edit message.** Invariants stated in-UI: comments, DM deliveries and bookings tracked as separate steps; a comment is never counted as a sale; unobservable DM delivery is recorded as unknown, not zero. No automation builder, no branching workflows.

---


## 8A. Account / Settings — secondary utility surface (final gate correction)

Opened from the **account control at the bottom-left** of every screen (`ACC` screenshot). It is NOT primary navigation and NOT a setup wizard; the four-item nav is unchanged. Contents (frozen minimum): **Account** — business/account name, owner, preferred outbound channel (Email; WhatsApp only where supported). **Billing** — current plan / pricing state (placeholder until locked), manage subscription, cancel. **Permissions** — every granted scoped Action Right listed with explicit **Revoke** (e.g. "Organic educational auto-publish — Allowed → Revoke"; "Promotional auto-publish — Not allowed"; "DM response path — Not allowed"; "Paid spend — Not allowed"); VIDEOGO may propose expansion, only the customer grants; **no global autonomous-mode toggle**. **Your data** — export data, delete account (deletion note: media/identity/account state removed; de-identified aggregate learnings retained only where contractually allowed). Boundaries: connections stay in Connections; person/likeness consent stays contextual in Knowledge → People & assets → Manage use; **no notification-preference matrix**.

## 8B. Week-one empty states — frozen in EXPERIENCE (final gate correction)

A paid account whose pipeline is not yet populated never sees a dead blank screen — and never sees templates, "create content" buttons or setup tasks (`E1` screenshot). Studio: "**VIDEOGO is preparing your first batch.** I'm finding the strongest opportunities and building the first executions. Nothing is needed from you right now." (If a genuine blocker exists, the relevant NEED shows instead.) Live/Results before first publication: "**Nothing live yet.** I'll start showing results and learnings here after your first video is published." Unknown is not zero. SYSTEM determines only the technical state driving these screens.

## 9. Screenshot index

`01a`–`01e` onboarding steps 1–5 · `02` QA deferred · `03` activation · `04` Today NEED · `05` Today NEXT · `06` silence · `07`/`07b` first-Dismiss teaching · `08` Idea veto + drawer · `09` Making · `10`/`10b` Ready + publish sheet · `11` change-something · `12`/`12b` reject chips · `13` auto-publish proposal · `14` live collecting · `15` early signal · `16` operational learning · `17` Knowledge routine · `18` identity confirmation · `19` Connections scenario · `20` Human Capture (Need + 3 phones) · `21` unknown/not-observable · `22` digest · `23` pharmacy DR gated · `B1`–`B4` browsable default pages (Today, Studio + `B2b` drawer + `B2c` calendar, Knowledge, Connections) · `ACC` Account/Settings utility · `E1` week-one empty states.

## 10. Explicit non-products (do not add, ever, without reopening Step B)

Traditional video editor / timeline · template marketplace · analytics dashboard · KPI configuration · notification center or bell · prompt/model/provider selectors · broad connector marketplace · agency command center · automation builder · experimentation UI for SMBs · Ads Manager clone · public confidence scores · ontology manager · fake social proof of any kind · approve-to-unlock mechanics · global "autonomous mode."

## 11. Known post-freeze work (not part of this handoff)

~~Visual brandbook and final identity~~ — **done: the VIDEOGO design system v1 (warm near-black, bone, crimson NEED / amber READY, Instrument Sans + IBM Plex Mono, radius 0) is applied as of vD.1** · mobile layouts for the owner web app (only Capture is mobile here) · Italian production copy (all strings here are English placeholder voice) · internal operator/escalation console (Decision 33; never customer-facing) · week-one empty-state behavior is frozen in EXPERIENCE (§8B); SYSTEM determines the technical state that drives it · pricing.

**Freeze rule for whoever picks this up:** you may refine visual design, layout polish, and copy voice. You may not change flows, object types, action sets, gating, language-evidence binding, consent granularity, or any invariant in §0 without a Step B change process.

---

## 12. Change log

**vD.1 — 7 Sept 2026, Design system applied (visual layer only).** The prototype and all 38 screens were rebuilt in the VIDEOGO design system v1 (`videogo-design`): warm near-black surface ramp (#0C0B09 → #37322B), bone text #F5F2EC, exactly two hues — crimson #FF0048 on NEED chips only, amber #E9A93C on READY chips and primary controls only — Instrument Sans + IBM Plex Mono (every label and every measured value in mono), radius 0, no shadows, unknowns drawn as the 135° absence hatch, dashed = unresolved, learning grades expressed by container resolution (collecting = dashed / early = hairline / learned = panel + border). NEED's blocking action is the bone button; publishing stays amber. All emoji and glyph-icons removed per system rule (padlock/check in the 1.75px house stroke). **No flow, object type, action set, gating rule, load-bearing string, nav item or §0 invariant changed.** Where the design system and this freeze disagree, the freeze wins (per the design-system readme); no such conflict required resolution beyond the roadmap-era naming notes already recorded in the system (`recommend` = alias of NEXT; Results lives inside contextual drawers, not the nav).

**vC.1 — 6 Sept 2026, Final EXPERIENCE Gate correction pass (bounded).** Added Account / Settings secondary utility (§8A) reachable from the account control — the stable surface for revoking Action Rights, billing and data controls (Gate 3/5 fix). Froze week-one empty states in EXPERIENCE (§8B). Four copy corrections: paywall/publish/auto-publish trust line → "VIDEOGO only publishes within permissions you grant" (protects the permission ladder); activation → "preparing your next videos" (cadence is not a product invariant); QA-deferred ETA removed unless credible; Human Capture tease → "when it's worth the effort / you can always skip a capture request." Canon line now defers to `VIDEOGO_CANON_INDEX.md`. Nothing else changed: flows, object types, action sets, gating, evidence-language binding, nav, ICP invariants all as frozen. **STRUCTURAL EXPERIENCE = LOCKED.**

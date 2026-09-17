# Videogo visual redesign · Checkpoint A

Isolated proof. Production UI, assets and tokens are untouched.

| File | What |
|---|---|
| `00_SOURCE_AND_DECISION_REGISTER.md` | Sources, authority, preserved behavior, decisions (verified vs proposed), logged conflicts |
| `APPROVAL_BOARD.html`, `renders/APPROVAL_BOARD.png` | Visual approval board (options only) |
| `ANNOTATION_RESOLUTION.md` | Removed vs restored source strings, with citations |
| `02_TOKENS.json`, `02_TOKENS.css` | Tokens actually used; PROPOSED entries flagged |
| `03_COMPONENT_STATE_NOTES.md` | Components and states used by the two screens |
| `05_VALIDATION.md` | Verified / known failures / not verified |
| `06_VISUALLY_CHANGED_STRUCTURALLY_PRESERVED.md` | Comparison |
| `renders/` | A = Today, B = Studio, C = narrow study, D = long content, E = 200% text/zoom, F = 320px, G = lockup |
| `comparisons/` | Title study, reference vs proof, before/after |
| `src/` | Editable source: `today.html`, `studio.html` (`?select=rd1`, `?title=optical`, `?study=narrow`), `styles/`, `js/`, `assets/` (outlined lockups) |
| `tools/` | `outline-lockup.mjs`, `render.mjs`, `validate.mjs`, `serve.mjs`; licensed font source (OFL) |

Run (from `tools/`, requires Google Chrome):

```bash
npm install && node serve.mjs 4417
```

Then open `http://127.0.0.1:4417/today.html`. Re-render with `node render.mjs`; re-validate with `node validate.mjs`.

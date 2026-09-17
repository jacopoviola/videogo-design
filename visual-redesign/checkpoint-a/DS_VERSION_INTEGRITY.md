# Design System version integrity · v8 → v9 → v10 → v11 → v12

Artifact: https://claude.ai/artifact/RdJn49WoDLAu6TUboAKXRG (private). Checked 17 Sep 2026 with the Artifact tool’s file listing and per-file SHA-256, the session transcript, and local copies of every file this session published.

## What each version is

Version ids are creation timestamps (UTC seconds), confirmed against this session’s publish times (v7 id `1789649891` = 12:58:11Z, the v7 publish at 12:58:12Z).

| Version | Id | Created (UTC) | Origin | Type release (page files) | Project files changed |
|---|---|---|---|---|---|
| v8 | not listed by the tools | 13:11:32 | Publish by this session (“Checkpoint B decisions”) | `1789582625-8df1` (stated in the publish result) | README.md, bundle.css, FeedPreview/README.md, FeedPreview/preview.html, Composer/README.md, NavRail/README.md, design-system.json |
| — | `1789650788-4657` | 13:13:08 | New **Artifact type release** published (not by this session) | — | — |
| **v9** | `1789653547-0099` | 13:59:07 | **Not published by this session.** Created 2 s before this session’s next read returned. The tools do not show who or what created it. | `1789650788-4657` | **None** (proof below) |
| v10 | `1789653579-d52c` | 13:59:39 | Publish by this session (“Responsive correction”) | `1789650788-4657` | Composer/README.md, NavRail/README.md, design-system.json |
| v11 | `1789657441-09c1` | 15:04:01 | Publish by this session (“Checkpoint B final corrections”) | `1789650788-4657` | NavRail/README.md, ContextPanel/README.md, design-system.json |
| **v12** | `1789658465-500d` | 15:21:05 | Publish by this session (“v12 page-title reference + mobile Back”), one bounded update | `1789650788-4657` | assets/References/README.md (page title 32/38 → 44/48 · 600 · −0.02em), ContextPanel/README.md (browser/system Back), design-system.json (change note) |

**What v9 changed:** the Design System page it runs on. The type release moved from `1789582625-8df1` (v8) to `1789650788-4657` (v9 onward): the fixed type files `index.html` (28 292 → 31 379 bytes) and `artifact-type/app.js` (1 672 857 → 1 673 411 bytes) differ from the v6 listing (`1789648959-ffe8`), the last full listing taken before v9; v7 and v8 publish results still named the old release. No project file (README, tokens, fonts, components, previews, index) changed. The tools do not expose older versions’ type files, so the exact diff of the page code is not verifiable here.

## Proof that v9 changed no project content

1. **The three files read at v9 equal the v8 publish, byte for byte.** Rebuilding the v8 bytes (by reversing only this session’s v10 edits) gives the same size and SHA-256 that the v9 read reported: `design-system.json` 2340 B `96ce25b7…`, `NavRail/README.md` 1226 B `118fc247…`, `Composer/README.md` 1041 B `c88c51a3…`.
2. **Every other project file at v10 is byte-identical to the last copy this session published** (36 files: v8-published README.md, bundle.css and FeedPreview files; earlier-published components, previews, tokens, fonts and asset READMEs). A v10 publish keeps files it does not send, so those files were identical at v9.
3. Therefore v9’s project files = v8’s project files, and v10 changed only the three files it sent.

## v10 preserved v9 · v11 preserved v10 · v12 preserved v11

- v10 sent 3 files; the other 36 are identical to v9 (point 2). The 3 sent files contain v9’s content plus only the v10 edits (point 1 reverses exactly those edits).
- v11 read-back: 36 files byte-identical to v10; the 3 files sent in v11 match this session’s local copies exactly.
- v12 read-back (below): 36 files byte-identical to v11; the 3 files sent in v12 match this session’s local copies exactly. v11 and v12 stay on type release `1789650788-4657`.

## v12 read-back (all 39 project files)

36 files byte-identical to v11; the 3 files sent in v12 match this session’s local copies exactly. No `32/38` remains anywhere in the project files; the only page-title statements are the locked 44/48 · 600 · −0.02em (README.md, tokens.json, References/README.md).

| File | Bytes | SHA-256 | v11 → v12 |
|---|---|---|---|
| `project/README.md` | 25280 | `55854c95a8ea` | unchanged |
| `project/assets/Logos/README.md` | 824 | `1715906b12d5` | unchanged |
| `project/assets/References/README.md` | 683 | `85e5059a7237` | **changed in v12** |
| `project/components/Button/README.md` | 1437 | `8ab56d8c4230` | unchanged |
| `project/components/Button/preview.html` | 1570 | `cda46f0a73b2` | unchanged |
| `project/components/Composer/README.md` | 1316 | `c07cdd095312` | unchanged |
| `project/components/Composer/preview.html` | 887 | `2a3c41e77b02` | unchanged |
| `project/components/ContextPanel/README.md` | 1389 | `03620051af33` | **changed in v12** |
| `project/components/ContextPanel/preview.html` | 1604 | `e66c02754713` | unchanged |
| `project/components/Cover/preview.html` | 3221 | `d1523782cd63` | unchanged |
| `project/components/EvidenceRow/README.md` | 778 | `a6f758e93a6c` | unchanged |
| `project/components/EvidenceRow/preview.html` | 912 | `8f868cc0a994` | unchanged |
| `project/components/FeedPreview/README.md` | 1943 | `8ac087fa068d` | unchanged |
| `project/components/FeedPreview/preview.html` | 84193 | `23fc2eb83097` | unchanged |
| `project/components/Field/README.md` | 808 | `284eb5447506` | unchanged |
| `project/components/Field/preview.html` | 1230 | `023b850d048d` | unchanged |
| `project/components/MediaFrame/README.md` | 1735 | `c354a54ffaa5` | unchanged |
| `project/components/MediaFrame/preview.html` | 61887 | `169e066e00a3` | unchanged |
| `project/components/NavRail/README.md` | 1873 | `ff5109f2df00` | unchanged |
| `project/components/NavRail/preview.html` | 4585 | `b1929dfe2504` | unchanged |
| `project/components/PermissionRow/README.md` | 797 | `8a0a07e2eeb5` | unchanged |
| `project/components/PermissionRow/preview.html` | 1831 | `82b4541bde85` | unchanged |
| `project/components/ResultReadout/README.md` | 778 | `aaf79557c957` | unchanged |
| `project/components/ResultReadout/preview.html` | 2204 | `25f9af22dcf0` | unchanged |
| `project/components/Sheet/README.md` | 816 | `106467a26d55` | unchanged |
| `project/components/Sheet/preview.html` | 1132 | `f365b29ccdc8` | unchanged |
| `project/components/StatusMarker/README.md` | 917 | `33f2d5b8f267` | unchanged |
| `project/components/StatusMarker/preview.html` | 1210 | `d79a9f3a057c` | unchanged |
| `project/components/StudioCard/README.md` | 1124 | `258a8517ce35` | unchanged |
| `project/components/StudioCard/preview.html` | 1779 | `b91d3b7a583c` | unchanged |
| `project/components/UpcomingList/README.md` | 590 | `4b84ae40ab8b` | unchanged |
| `project/components/UpcomingList/preview.html` | 953 | `c11f89d76a37` | unchanged |
| `project/components/WorkObject/README.md` | 1165 | `6e43585cb6b9` | unchanged |
| `project/components/WorkObject/preview.html` | 2372 | `0eeabb884862` | unchanged |
| `project/components/bundle.css` | 19604 | `0a1735ba759a` | unchanged |
| `project/design-system.json` | 2214 | `aabed7afe52a` | **changed in v12** |
| `project/fonts/InstrumentSans-OFL.txt` | 4403 | `9e27a72ed30e` | unchanged |
| `project/fonts/InstrumentSans-Variable.ttf` | 194336 | `b24f18125848` | unchanged |
| `project/tokens.json` | 15107 | `131615d5db5e` | unchanged |

## Resolved in v12

- `project/assets/References/README.md` said “tokens win: `page-title` is 32/38”. It now reads “`page-title` is 44/48 · weight 600 · tracking −0.02em, locked A2.1”. The local rollout token record `02_TOKENS.json` (still 32/38 and system-ui) and the stale “not applied until approved” comments in `tokens.css` / `02_TOKENS.css` were corrected at the same time; `02_TOKENS.json` now matches every value in `src/styles/tokens.css`. Rendering is unchanged (comments and records only).

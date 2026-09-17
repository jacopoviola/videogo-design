/* Media data for Checkpoint A2.
   SOURCE FACTS come from videogo_ux3_prototype.html (line refs). MEDIA FILES are DEMO FIXTURES:
   no real Videogo or customer media exists in either repository. Every fixture entry carries
   fixture: true and provenance "Demo fixture"; the UI shows that label exactly once per media instance.
   States: available (image or poster frame) · rendering (reserved area, explicit state) ·
   unavailable (bounded “Preview unavailable”) · absent (compact text, no media rectangle). */
window.VG_MEDIA = {
  rd1: {
    state: 'available',
    fixture: true,
    kind: 'video',                         // video poster frame
    src: 'assets/media/fixture_ready_heat-pump-vs-boiler_9x16.svg',
    alt: 'Poster frame for “Heat pump vs new boiler: the honest math” (demo fixture)',
    w: 1080, h: 1920,
    ratioLabel: '9:16',                    // Instagram Reel is a 9:16 format (PR:582 “Instagram Reel”)
    channel: 'Instagram Reel',             // PR:582, PR:895
    format: { type: 'reel' },              // Feed indicator: confirmed by source metadata (PR:582 “Instagram Reel”)
    duration: '0:41',                      // PR:580, PR:895
    provenance: 'Demo fixture',
    focus: [0.5, 0.4],                     // crop focal point (normalised)
    titleSafe: [0.08, 0.14, 0.84, 0.2],    // on-screen title block in the fixture (x, y, w, h), measured from the SVG text
    subjectSafe: [0.08, 0.39, 0.84, 0.3]   // comparison graphics block
  },
  lv1: {
    state: 'available',
    fixture: true,
    kind: 'video',
    src: 'assets/media/fixture_live_89-pre-winter-check_4x5.svg',
    alt: 'Poster frame for “The €89 pre-winter check, explained” (demo fixture)',
    w: 1080, h: 1350,
    ratioLabel: null,                      // source gives no format for this video: ratio not shown as fact
    channel: 'Instagram',                  // PR:917 feed is @morettimpianti on Instagram
    duration: null,                        // not in source
    provenance: 'Demo fixture',
    focus: [0.5, 0.5],
    titleSafe: [0.08, 0.4, 0.84, 0.36],
    subjectSafe: [0.58, 0.1, 0.32, 0.36]
  },
  idea1: {
    state: 'available',
    fixture: true,
    kind: 'image',                         // visual source for an idea that is not produced yet
    src: 'assets/media/fixture_idea_job-photo_4x3.svg',
    alt: 'Illustrative stand-in for one of your job photos (demo fixture)',
    w: 1600, h: 1200,
    ratioLabel: '4:3',
    channel: null,
    duration: null,
    sourceLabel: 'Your job photos',        // PR:887 “Luca voiceover over real job photos”
    provenance: 'Demo fixture',
    focus: [0.58, 0.45],
    titleSafe: null,
    subjectSafe: [0.44, 0.13, 0.26, 0.6]
  },
  mk1: {
    state: 'rendering',                    // PR:888 “Rendering · ready by ~15:00”: media is being produced
    label: 'Rendering'
  },
  idea2: {
    state: 'absent'                        // Idea not produced; no visual source named in PR:891
  }
};
/* ---------- Feed Preview (addendum) ----------
   A truthful forecast of the connected account's grid: Videogo-owned Scheduled / Planned posts first (they will
   appear newest), then the most recent Live posts imported from the account, six positions. Each position keeps its
   own provenance and state. Format indicators (Reel, Carousel) only when source metadata confirms them; for
   imported fixtures that metadata is itself part of the demo fixture. Runtime uses real connected thumbnails. */
function imported(src, alt, w, h, format, kind) {
  return { state: 'available', fixture: true, origin: 'imported', kind: kind || 'image', src: src, alt: alt + ' (demo fixture)', w: w, h: h, format: format || null, provenance: 'Demo fixture' };
}
window.VG_MEDIA.imp_reel = imported('assets/media/fixture_import_technician-kitchen_9x16.svg', 'Imported Reel: technician speaking to camera in a customer’s kitchen', 1080, 1920, { type: 'reel' }, 'video');
window.VG_MEDIA.imp_carousel = imported('assets/media/fixture_import_before-after-install_4x5.svg', 'Imported carousel, first slide: before and after a boiler replacement', 1080, 1350, { type: 'carousel', count: 3 });
window.VG_MEDIA.imp_van = imported('assets/media/fixture_import_van-street_16x9.svg', 'Imported photo: work van parked on a residential street at dusk', 1920, 1080);
window.VG_MEDIA.imp_valve = imported('assets/media/fixture_import_valve-closeup_1x1.svg', 'Imported photo: close-up of a thermostatic radiator valve', 1080, 1080);
window.VG_MEDIA.imp_team = imported('assets/media/fixture_import_team-shopfront_3x4.svg', 'Imported photo: two team members outside the shop', 1080, 1440);
window.VG_MEDIA.pl_radiator = { state: 'available', fixture: true, origin: 'videogo', kind: 'video', src: 'assets/media/fixture_planned_radiator-bleeding-hands_9x16.svg',
  alt: 'Poster frame for “Radiator bleeding in 90 seconds” (demo fixture)', w: 1080, h: 1920, format: null,   // PR:442 “Instagram + TikTok”: Reel not confirmed
  provenance: 'Demo fixture', focus: [0.5, 0.42],
  titleSafe: [0.1, 0.156, 0.8, 0.105],     // caption band, measured from the SVG
  subjectSafe: [0.08, 0.29, 0.86, 0.5] };   // hands, key and radiator top

/* Integrated Studio screen: no Scheduled or Planned post exists there without contradicting the board
   (B2c's “Heat pump vs new boiler” scheduled vs B2/B2b READY — VD-17), so all six positions are Live:
   lv1 (PR:917) and five posts imported from the connected account. */
window.VG_FEED = [
  { ref: 'lv1', state: 'live' }, { ref: 'imp_carousel', state: 'live' }, { ref: 'imp_reel', state: 'live' },
  { ref: 'imp_van', state: 'live' }, { ref: 'imp_valve', state: 'live' }, { ref: 'imp_team', state: 'live' }
];
/* Standalone specimens (component review, not canonical product states). Each is its own scenario. */
/* at = effective publish time for timed future posts (2024 weekday convention of the source dates, VD-17).
   Data order is deliberately not display order: feedPreview sorts by projected chronology. */
window.VG_FEED_SPECIMENS = {
  populated: [   // four Live + two timed future; PR:969 (Planned Sat 11:00), PR:583 (Thu 18:00)
    { ref: 'rd1', state: 'scheduled', when: 'Thu 18:00', at: '2024-10-17T18:00' }, { ref: 'pl_radiator', state: 'planned', when: 'Sat 11:00', at: '2024-10-19T11:00' },
    { ref: 'lv1', state: 'live' }, { ref: 'imp_carousel', state: 'live' }, { ref: 'imp_reel', state: 'live' }, { ref: 'imp_van', state: 'live' }
  ],
  untimed: [     // one Planned post without a publish time: listed apart, claims no grid position
    { ref: 'pl_radiator', state: 'planned' }, { ref: 'rd1', state: 'scheduled', when: 'Thu 18:00', at: '2024-10-17T18:00' },
    { ref: 'lv1', state: 'live' }, { ref: 'imp_carousel', state: 'live' }, { ref: 'imp_reel', state: 'live' }, { ref: 'imp_van', state: 'live' }, { ref: 'imp_valve', state: 'live' }
  ],
  partial: [     // fewer than six posts, and one imported post whose media exists but cannot be retrieved
    { ref: 'rd1', state: 'scheduled', when: 'Thu 18:00', at: '2024-10-17T18:00' },
    { ref: 'lv1', state: 'live' }, { ref: 'imp_carousel', state: 'live', unavailable: true }, { ref: 'imp_valve', state: 'live' }
  ],
  empty: []
};

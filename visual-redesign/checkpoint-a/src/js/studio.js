/* Studio selection behavior, preserved from videogo_ux3_prototype.html:885–934.
   - Selecting a card replaces the context panel with that card's detail, in place.
   - Selecting the selected card again clears the selection (studSel toggle).
   - “Back to context” clears the selection and returns focus to the card.
   Content is copied verbatim from the STUD registry. Actions leading to other frozen screens
   (10b sheet, 11, 12) are non-executing in this proof.
   A2.1: media leads every card (available / rendering / absent); below 82.5em the same panel moves below the
   board (DOM move keeps reading and focus order equal to the visual order). */
(function () {
  var STUD = {
    idea1: { marker: 'Idea', title: 'Why we show the price before we start the job',
      rows: [['Saying', "Transparent pricing isn't a marketing line — written quote before any work starts, since 1998."], ['Format', 'Luca voiceover over real job photos · ~35 sec'], ['Why this', 'Call-out pricing is the #1 objection in your category locally; your flat-fee policy is unused proof.'], ['Status', 'Starts production tomorrow unless you say otherwise']],
      actions: [['Not now', 'secondary', 'PR:888 toast “Moved to later”'], ['Reject', 'secondary', 'PR:888 → reject reasons (12)']],
      field: 'Change something — tell VIDEOGO…' },
    idea2: { marker: 'Idea', title: 'Radiator bleeding in 90 seconds',
      rows: [['Saying', "Most 'cold radiator' calls are a 90-second DIY fix — and Moretti tells you so for free."], ['Format', 'Hands + tool close-ups, captions, no face · ~50 sec'], ['Why this', 'Generosity content builds the trust that brings the paid calls; your reviews praise honesty.'], ['Status', 'Queued after the pricing video']],
      actions: [['Not now', 'secondary', 'PR:891 toast “Moved to later”'], ['Reject', 'secondary', 'PR:891 toast “Rejected”']],
      field: 'Change something — tell VIDEOGO…' },
    mk1: { marker: 'Making', title: '3 signs your boiler needs a check',
      rows: [['Saying', 'Three signs any homeowner can check this week — before the December rush.'], ['Format', 'How-to checklist · faceless · Instagram + TikTok'], ['Status', 'Producing the video · quality review next · usually ready by 15:00 today']],
      note: 'Nothing needed from you — it will appear in Ready.' },
    rd1: { marker: 'Ready', ready: true, title: 'Heat pump vs new boiler: the honest math',
      rows: [['Saying', 'The honest numbers we quote our own customers — no sales pitch.'], ['Format', 'Voiceover + comparison graphics · 0:41'], ['Why this', "'Which one is worth it?' is your most-asked consultation question."], ['Status', 'Waiting for your go — recommended: Thu 18:00, Instagram Reel']],
      actions: [['Publish', 'authorize', 'PR:897 go(9) → publish/schedule sheet 10b (Publish-now route unresolved, UN-11)'], ['Schedule', 'secondary', 'PR:897 go(9) → sheet 10b'], ['Change something', 'secondary', 'PR:897 go(10) → screen 11'], ['Reject', 'quiet', 'PR:897 go(11) → screen 12']] },
    lv1: { marker: 'Live', title: 'The €89 pre-winter check, explained',
      rows: [['Objective', 'Trust — so saves and completion lead; reach is context'], ['Saves', '22 · typical for you'], ['Watched', '33% · data as of today 09:00'], ['Bookings', 'Not observable — no booking link connected'], ['Reach', '2.8K · context, not the goal']],
      claim: ['Still collecting results.', 'First results usually stabilize after a few days.'] }
  };
  var MEDIA = window.VG_MEDIA || {}, FEED = window.VG_FEED || [];
  var params = new URLSearchParams(location.search);
  var app = document.querySelector('.vg-app--split'), main = document.getElementById('main');
  var panel = document.getElementById('context-panel');
  var selected = null;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  // ---- cards: media leads ----
  document.querySelectorAll('.vg-card').forEach(function (card) {
    var m = MEDIA[card.dataset.key];
    var slot = card.querySelector('[data-media-slot]');
    slot.outerHTML = window.VGMedia.card(m);
    card.classList.add(m && m.state !== 'absent' ? 'vg-card--media' : 'vg-card--absent');
    var hidden = card.querySelector('.vg-visually-hidden');
    if (hidden) hidden.textContent = window.VGMedia.describe(m);
  });

  // ---- feed context ----
  panel.querySelector('[data-feed-preview]').innerHTML = window.VGMedia.feedPreview(params.get('feed') === 'empty' ? [] : FEED, MEDIA);
  var contextHTML = panel.innerHTML;

  var mobile = window.matchMedia('(max-width: 39.99em)');   // dedicated object view below 640px at default text

  function detailHTML(key, view) {
    var c = STUD[key], h = '';
    h += '<div class="vg-panel__head"><button class="vg-btn vg-btn--quiet vg-btn--compact vg-panel__back" type="button" data-back>' + (view ? 'Back to Studio' : 'Back to context') + '</button>';
    h += '<span class="vg-status' + (c.ready ? ' vg-status--ready' : '') + '">' + c.marker + '</span>';
    h += '<h2 class="vg-panel__title" id="panel-title" tabindex="-1">' + esc(c.title) + '</h2></div>';
    h += '<div class="vg-panel__split"><div class="vg-panel__media">' + window.VGMedia.inspect(MEDIA[key]) + '</div><div class="vg-panel__details">';
    h += '<dl class="vg-evidence">' + c.rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>';
    if (c.actions) h += '<div class="vg-actions">' + c.actions.map(function (a) {
      return '<button class="vg-btn vg-btn--' + a[1] + '" type="button" data-source-action="' + esc(a[2]) + '">' + a[0] + '</button>';
    }).join('') + '</div>';
    if (c.ready) h += '<p class="vg-trust">VIDEOGO only publishes within permissions you grant.</p>';
    if (c.field) h += '<label class="vg-visually-hidden" for="change-' + key + '">Change something</label><textarea class="vg-panel__field" id="change-' + key + '" rows="1" placeholder="' + esc(c.field) + '"></textarea>';
    if (c.note) h += '<p class="vg-panel__note">' + esc(c.note) + '</p>';
    if (c.claim) h += '<p class="vg-panel__note"><strong>' + esc(c.claim[0]) + '</strong> ' + esc(c.claim[1]) + '</p>';
    return h + '</div></div>';
  }

  function render(focusCard, opened) {
    var view = !!selected && mobile.matches;
    document.querySelectorAll('.vg-card').forEach(function (card) { card.setAttribute('aria-pressed', String(card.dataset.key === selected)); });
    main.classList.toggle('vg-main--object', view);
    main.querySelector('.vg-page-head').classList.toggle('vg-visually-hidden', view);   // “Studio” stays the page heading for assistive tech
    panel.classList.toggle('vg-panel--detail', !!selected);
    panel.classList.toggle('vg-panel--view', view);
    if (view) main.insertBefore(panel, main.querySelector('.vg-studio'));   // the object view leads the page
    else place();
    if (selected) { panel.innerHTML = detailHTML(selected, view); panel.setAttribute('aria-labelledby', 'panel-title'); }
    else { panel.innerHTML = contextHTML; panel.setAttribute('aria-labelledby', 'context-title'); }
    if (view && opened) { window.scrollTo(0, 0); panel.querySelector('#panel-title').focus({ preventScroll: true }); }
    if (focusCard) { focusCard.focus({ preventScroll: true }); focusCard.scrollIntoView({ block: 'center' }); }
  }

  // ---- mobile object view is a history entry: browser/system Back closes it ----
  // Opening pushes an entry for the object; the board entry beneath it remembers the scroll position and the card.
  // Back (browser, system or “Back to Studio”) returns to that entry: board restored, scroll restored, focus on the card.
  // Forward re-opens the object. Wider layouts keep in-place selection without history entries (unchanged).
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  function urlFor(key) { var u = new URL(location.href); if (key) u.searchParams.set('select', key); else u.searchParams.delete('select'); return u.pathname + u.search + u.hash; }
  function openView(key, scrollY) {
    history.replaceState({ vgBoard: true, scrollY: scrollY, card: key }, '', urlFor(null));
    history.pushState({ vgObject: key }, '', urlFor(key));
    selected = key; render(null, true);
  }
  function closeToBoard(state) {
    var key = (state && state.card) || selected, card = document.querySelector('.vg-card[data-key="' + key + '"]');
    selected = null; render();
    if (state && typeof state.scrollY === 'number') window.scrollTo(0, state.scrollY); else if (card) card.scrollIntoView({ block: 'center' });
    if (card) card.focus({ preventScroll: true });
  }
  window.addEventListener('popstate', function (e) {
    var st = e.state || {};
    if (st.vgObject && STUD[st.vgObject]) { selected = st.vgObject; render(null, true); }
    else if (selected || st.vgBoard) closeToBoard(st);
  });

  document.querySelectorAll('.vg-card').forEach(function (card) {
    card.addEventListener('click', function () {
      if (mobile.matches && selected !== card.dataset.key) { openView(card.dataset.key, window.scrollY); return; }
      selected = selected === card.dataset.key ? null : card.dataset.key; render(null, !!selected);
    });
  });
  panel.addEventListener('click', function (e) {
    if (e.target.closest('[data-back]')) {
      if (mobile.matches && history.state && history.state.vgObject) { history.back(); return; }   // same path as browser Back
      var previous = document.querySelector('.vg-card[data-key="' + selected + '"]');
      selected = null; render(previous);
    }
  });

  // ---- responsive: ≤1319px the panel sits below the board, before the composer ----
  var below = window.matchMedia('(max-width: 82.4375em)');   // 1319px at default text; follows text size and zoom
  function place() {
    if (below.matches) { main.insertBefore(panel, main.querySelector('.vg-main__end')); panel.classList.add('vg-panel--below'); }
    else { app.appendChild(panel); panel.classList.remove('vg-panel--below'); }
  }
  below.addEventListener('change', function () { render(); }); place();
  mobile.addEventListener('change', function () { render(); });

  var initial = params.get('select');
  if (initial && STUD[initial]) {
    if (mobile.matches && history.state && history.state.vgObject === initial) { selected = initial; render(null, true); }   // reload inside the view
    else if (mobile.matches) openView(initial, 0);   // a deep link still gets a board entry to go Back to
    else { selected = initial; render(); }
  }
})();

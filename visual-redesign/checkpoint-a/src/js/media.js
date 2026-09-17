/* Media component family (visual only). Rules — see A2_1_REGISTER.md and the Design System “Media” doctrine:
   Crop  1. Card crops are 4:5 cover on the focal point, clamped to the source edges.
         2. Subject-safe: the declared subject box stays fully inside the crop.
         3. Text-safe: the on-screen title box stays inside the crop and clear of the overlay bands
            (top and bottom 13% of the crop, where chips sit).
         4. If a rule fails, the frame is shown whole (contain) on a neutral mat, labelled “Full frame”.
         5. Inspection views never crop.
   States available · rendering (reserved area, “Rendering”) · unavailable (bounded, “Preview unavailable”) ·
         absent (compact text “No preview”, no rectangle).
   Label  “Demo fixture” appears once per media instance. No play controls: playback is not in the sources. */
(function () {
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function crop(m, target) {
    var srcRatio = m.w / m.h, win = { w: 1, h: 1, x: 0, y: 0 };
    if (srcRatio > target) { win.w = target / srcRatio; win.x = Math.min(Math.max(m.focus[0] - win.w / 2, 0), 1 - win.w); }
    else { win.h = srcRatio / target; win.y = Math.min(Math.max(m.focus[1] - win.h / 2, 0), 1 - win.h); }
    function inside(b) { return !b || (b[0] >= win.x - 1e-6 && b[1] >= win.y - 1e-6 && b[0] + b[2] <= win.x + win.w + 1e-6 && b[1] + b[3] <= win.y + win.h + 1e-6); }
    var band = 0.13 * win.h;
    function clear(b) { return !b || (b[1] >= win.y + band - 1e-6 && b[1] + b[3] <= win.y + win.h - band + 1e-6); }
    var ok = inside(m.subjectSafe) && inside(m.titleSafe) && clear(m.titleSafe);
    var px = win.w < 1 ? (win.x / (1 - win.w)) * 100 : 50, py = win.h < 1 ? (win.y / (1 - win.h)) * 100 : 50;
    return { mode: ok ? 'cover' : 'contain', position: px.toFixed(1) + '% ' + py.toFixed(1) + '%', subjectInside: inside(m.subjectSafe), titleInside: inside(m.titleSafe) && clear(m.titleSafe) };
  }
  function formatChip(m) {
    if (m.kind === 'image') return 'Photo · ' + m.ratioLabel;
    var ch = m.channel === 'Instagram Reel' ? 'Reel' : (m.channel || 'Video');
    return ch + (m.ratioLabel ? ' · ' + m.ratioLabel : '');
  }
  function prov(m) { return m.fixture ? '<span class="vg-media__prov">Demo fixture</span>' : ''; }
  function describe(m) {
    if (!m || m.state === 'absent') return ', no preview';
    if (m.state === 'rendering') return ', media rendering';
    if (m.state === 'unavailable') return ', preview unavailable';
    return (m.kind === 'video' ? ', video poster frame' : ', source photo') + (m.channel ? ', ' + m.channel : '') + (m.ratioLabel ? ', ' + m.ratioLabel : '') + (m.duration ? ', ' + m.duration : '') + (m.fixture ? ', demo fixture' : '');
  }
  window.VGMedia = {
    crop: crop,
    describe: describe,
    card: function (m) {
      if (!m || m.state === 'absent') return '<span class="vg-media-absent" aria-hidden="true">No preview</span>';
      if (m.state === 'rendering') return '<span class="vg-media vg-media--card vg-media--rendering" aria-hidden="true"><span>' + esc(m.label || 'Rendering') + '</span></span>';
      if (m.state === 'unavailable') return '<span class="vg-media vg-media--card vg-media--unavailable" aria-hidden="true"><span>Preview unavailable</span></span>';
      var c = crop(m, 4 / 5);
      return '<span class="vg-media vg-media--card vg-media--' + c.mode + '" data-crop="' + c.mode + '" aria-hidden="true">' +
        '<img src="' + esc(m.src) + '" alt="" style="object-position:' + c.position + '">' + prov(m) +
        (c.mode === 'contain' ? '<span class="vg-media__prov vg-media__prov--end">Full frame</span>' : '') +
        '<span class="vg-media__chip vg-media__chip--start">' + esc(formatChip(m)) + '</span>' +
        (m.duration ? '<span class="vg-media__chip vg-media__chip--end">' + esc(m.duration) + '</span>' : '') + '</span>';
    },
    inspect: function (m) {
      if (!m || m.state === 'absent') return '<p class="vg-media-absent">No preview</p>';
      if (m.state === 'rendering') return '<div class="vg-media vg-media--inspect-reserved vg-media--rendering"><span>' + esc(m.label || 'Rendering') + '</span></div>';
      if (m.state === 'unavailable') return '<div class="vg-media vg-media--inspect-reserved vg-media--unavailable"><span>Preview unavailable</span></div>';
      var facts = [];
      if (m.channel) facts.push(['Channel', m.channel]);
      if (m.sourceLabel) facts.push(['Source', m.sourceLabel]);
      facts.push([m.kind === 'video' ? 'Poster frame' : 'Image', m.ratioLabel || 'Ratio not in source']);
      if (m.duration) facts.push(['Duration', m.duration]);
      facts.push(['Provenance', m.provenance]);
      return '<div class="vg-media-inspect"><figure class="vg-media vg-media--inspect" style="aspect-ratio:' + m.w + ' / ' + m.h + '"><img src="' + esc(m.src) + '" alt="' + esc(m.alt) + '"></figure>' +
        '<dl class="vg-media-facts">' + facts.map(function (f) { return '<dt>' + f[0] + '</dt><dd' + (f[1] === 'Demo fixture' ? ' class="vg-media-facts__fixture"' : '') + '>' + esc(f[1]) + '</dd>'; }).join('') + '</dl></div>';
    },
    // Feed Preview grid crop (3:4). Positioning metadata first: keep the on-screen title box (then the subject box)
    // inside the window, centred on the focal point where possible. Centre only when no metadata exists.
    // Display-only object-position; the original asset is never altered.
    gridCrop: function (m, target) {
      var boxes = [m.titleSafe, m.subjectSafe].filter(Boolean);
      if (!m.focus && !boxes.length) return { position: '50% 50%', basis: 'centre' };
      var r = m.w / m.h, win = { w: 1, h: 1 }, f = m.focus || [0.5, 0.5];
      if (r > target) win.w = target / r; else win.h = r / target;
      function fits(set) { if (!set.length) return true; var lx = Math.min.apply(0, set.map(function (b) { return b[0]; })), hx = Math.max.apply(0, set.map(function (b) { return b[0] + b[2]; })), ly = Math.min.apply(0, set.map(function (b) { return b[1]; })), hy = Math.max.apply(0, set.map(function (b) { return b[1] + b[3]; })); return hx - lx <= win.w + 1e-6 && hy - ly <= win.h + 1e-6 ? [lx, hx, ly, hy] : null; }
      var keep = fits(boxes) || (m.titleSafe && fits([m.titleSafe])) || (m.subjectSafe && fits([m.subjectSafe])) || null;
      function place(size, centre, lo, hi) { var st = centre - size / 2; if (lo !== undefined) st = Math.min(Math.max(st, hi - size), lo); return Math.min(Math.max(st, 0), 1 - size); }
      var x = place(win.w, f[0], keep && keep !== true ? keep[0] : undefined, keep && keep !== true ? keep[1] : undefined);
      var y = place(win.h, f[1], keep && keep !== true ? keep[2] : undefined, keep && keep !== true ? keep[3] : undefined);
      var px = win.w < 1 ? x / (1 - win.w) * 100 : 50, py = win.h < 1 ? y / (1 - win.h) * 100 : 50;
      return { position: px.toFixed(1) + '% ' + py.toFixed(1) + '%', basis: keep && keep !== true && m.titleSafe && fits([m.titleSafe]) ? 'title-safe' : 'focal' };
    },
    // Feed Preview tile: state text first in reading order; format indicator only when confirmed; no counts, no controls.
    feedTile: function (pos, M) {
      var m = M[pos.ref], future = pos.state !== 'live';
      var word = { live: 'Live', scheduled: 'Scheduled', planned: 'Planned' }[pos.state];
      var fmt = m && m.format ? (m.format.type === 'reel' ? 'Reel' : 'Carousel · ' + m.format.count) : '';
      var media;
      if (pos.unavailable || !m || m.state !== 'available') media = '<div class="vg-ftile__media vg-ftile__media--unavailable"><span>Preview unavailable</span></div>';
      else { var c = this.gridCrop(m, 3 / 4); media = '<div class="vg-ftile__media" data-crop="' + c.basis + '"><img src="' + esc(m.src) + '" alt="' + esc(m.alt) + '" style="object-position:' + c.position + '">' + (m.fixture ? '<span class="vg-media__prov" aria-hidden="true">Demo fixture</span>' : '') + '</div>' + (m.fixture ? '<p class="vg-ftile__prov-text" aria-hidden="true">Demo fixture</p>' : ''); }
      return '<li class="vg-ftile vg-ftile--' + (future ? 'future' : 'live') + '"' + (pos.at ? ' data-at="' + pos.at + '"' : '') + '><p class="vg-ftile__state"><span class="vg-ftile__word">' + word + '</span>' +
        (pos.when ? ' <span class="vg-ftile__when">' + esc(pos.when) + '</span>' : '') + '</p>' + (fmt ? '<p class="vg-ftile__format">' + esc(fmt) + '</p>' : '') + media + '</li>';
    },
    // Projected chronology: the eventual newest post sits top-left. Timed future posts by effective publish time
    // (latest first), then recent Live posts in their given order (newest first). Untimed Planned posts claim no
    // grid position: they are listed apart, above the grid.
    feedPreview: function (positions, M) {
      if (!positions.length) return '<p class="vg-feed-empty">Nothing live yet.</p>';
      var self = this, tile = function (p) { return self.feedTile(p, M); };
      var untimed = positions.filter(function (p) { return p.state !== 'live' && !p.at; });
      var timed = positions.filter(function (p) { return p.state !== 'live' && p.at; }).sort(function (a, b) { return a.at < b.at ? 1 : -1; });
      var live = positions.filter(function (p) { return p.state === 'live'; });
      var h = '';
      if (untimed.length) h += '<div class="vg-funtimed"><p class="vg-funtimed__label" id="funtimed-label">Planned · no publish time yet</p><ul class="vg-fgrid" aria-labelledby="funtimed-label">' + untimed.map(tile).join('') + '</ul></div>';
      return h + '<ul class="vg-fgrid" aria-label="Feed preview">' + timed.concat(live).slice(0, 6).map(tile).join('') + '</ul>' +
        '<p class="vg-fgrid__note">Preview — Instagram may display crops differently.</p>';
    }
  };
})();

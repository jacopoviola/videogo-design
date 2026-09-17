/* Proof switches, applied before first paint. Not product behavior.
   ?title=44          → PROPOSED page title 44/48 (weight 600 and −0.02em held at the token)
   ?font=instrument   → Instrument Sans from assets/fonts (OFL), for the font comparison only
   ?needicon=off      → NEED leading zone without the alert icon, for the icon comparison only
   ?study=narrow   → narrow content reflow study (shell unresolved, UN-16) */
(function () {
  var q = new URLSearchParams(location.search), root = document.documentElement;
  if (q.get('title') === '44') root.setAttribute('data-title', '44');
  if (q.get('font') === 'instrument') root.setAttribute('data-font', 'instrument');
  if (q.get('font') === 'system') root.setAttribute('data-font', 'system');
  if (q.get('title') === '32') root.setAttribute('data-title', '32');
  if (q.get('needicon') === 'off') root.setAttribute('data-need-icon', 'off');
  if (q.get('study') === 'narrow') root.setAttribute('data-study', 'narrow');
})();
document.documentElement.classList.add('vg-js');

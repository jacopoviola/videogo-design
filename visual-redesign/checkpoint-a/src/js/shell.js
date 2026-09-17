/* Proof-only guards: controls whose destinations are outside the checkpoints do nothing.
   Their source behavior is recorded on the element (data-source-action / data-out-of-scope). */
document.addEventListener('click', function (e) {
  var el = e.target.closest('[data-out-of-scope], [data-source-action]');
  if (el && !(el.tagName === "A" && el.getAttribute("href") !== "#" && !el.dataset.outOfScope)) e.preventDefault();
});
/* Collapsed shell (below 60em): the Menu button discloses the same destinations and the account link in page flow. */
(function () {
  var btn = document.querySelector('.vg-menu'); if (!btn) return;
  var rail = btn.closest('.vg-rail');
  function set(open) { btn.setAttribute('aria-expanded', String(open)); btn.textContent = open ? 'Close' : 'Menu'; rail.classList.toggle('is-open', open); if (!open) btn.focus(); }
  btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && rail.classList.contains('is-open')) set(false); });
  if (new URLSearchParams(location.search).get('menu') === 'open') set(true);   // render switch for review
})();

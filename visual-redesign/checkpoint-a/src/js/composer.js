/* Composer keys (approved): desktop Enter sends, Shift+Enter inserts a newline; touch (coarse pointer) Return inserts
   a newline and the Send button submits. The send outcome is not defined by the sources, so submitting records the
   event on the form (data-submitted) and changes nothing visible. */
(function () {
  var coarse = window.matchMedia('(pointer: coarse)');
  document.querySelectorAll('form[data-composer]').forEach(function (form) {
    var ta = form.querySelector('textarea');
    var box = form.querySelector('.vg-composer__box');   // the padded box is part of the field's target: a tap anywhere in it focuses the textarea
    if (box) box.addEventListener('pointerdown', function (e) { if (e.target === box) { e.preventDefault(); ta.focus(); } });
    form.addEventListener('submit', function (e) { e.preventDefault(); form.dataset.submitted = String((+form.dataset.submitted || 0) + 1); });
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && !coarse.matches) { e.preventDefault(); form.requestSubmit(); }
    });
    if (!(window.CSS && CSS.supports('field-sizing', 'content'))) {   // growth fallback where field-sizing is unsupported
      var fit = function () { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight + 2, parseFloat(getComputedStyle(ta).maxHeight)) + 'px'; };
      ta.addEventListener('input', fit); fit();
    }
  });
})();

/* Dev loader for cards and UI kits. Resolves the VIDEOGO component namespace:
   1. a compiled _ds_bundle.js namespace if one is on window;
   2. otherwise fetches the .jsx sources, transpiles with Babel standalone and evaluates them in order.
   Usage: <script src="…/_dev/loader.js" data-root="../.."></script> then await window.VGReady → window.VG */
(function () {
  var script = document.currentScript;
  var root = (script && script.getAttribute('data-root')) || '.';
  var files = [
    'components/brand/Wordmark.jsx',
    'components/controls/LabelChip.jsx',
    'components/controls/Button.jsx',
    'components/controls/AccountControl.jsx',
    'components/controls/Nav.jsx',
    'components/controls/Composer.jsx',
    'components/content/Thumbnail.jsx',
    'components/content/Attribution.jsx',
    'components/content/EvidenceRow.jsx',
    'components/content/MetricTile.jsx',
    'components/content/AbsenceTile.jsx',
    'components/content/PermissionLockup.jsx',
    'components/content/ProcessStages.jsx',
    'components/content/FeedPreview.jsx',
    'components/objects/ObjectCard.jsx',
    'components/states/ConfidenceClaim.jsx',
    'components/states/SilenceState.jsx'
  ];
  function load(src) {
    return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }
  function findBundleNS() {
    var keys = Object.keys(window);
    for (var i = 0; i < keys.length; i++) {
      try {
        var v = window[keys[i]];
        if (v && typeof v === 'object' && v !== window && !(v instanceof Window) && v.ObjectCard && v.Button && v.Wordmark) return v;
      } catch (e) { /* cross-origin frame reference */ }
    }
    return null;
  }
  window.VGLoadJSX = async function (url) {
    if (!window.Babel) await load('https://unpkg.com/@babel/standalone@7/babel.min.js');
    var src = await (await fetch(url)).text();
    new Function(Babel.transform(src, { presets: ['react'] }).code)();
  };
  window.VGMount = function (el, Comp, props) {
    var root = ReactDOM.createRoot(typeof el === 'string' ? document.querySelector(el) : el);
    root.render(React.createElement(Comp, props || {}));
    return root;
  };
  window.VGReady = (async function () {
    if (!window.React) await load('https://unpkg.com/react@18/umd/react.production.min.js');
    if (!window.ReactDOM) await load('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js');
    var ns = findBundleNS();
    if (ns) { window.VG = ns; return ns; }
    if (!window.Babel) await load('https://unpkg.com/@babel/standalone@7/babel.min.js');
    window.VG = window.VG || {};
    for (var i = 0; i < files.length; i++) {
      var src = await (await fetch(root + '/' + files[i])).text();
      src = src.replace(/^\s*import\s+React[^\n]*\n/m, 'const { useState, useEffect, useRef, useMemo, useCallback, useId } = React;\n')
               .replace(/^\s*import\s*\{([^}]*)\}\s*from\s*['"][^'"]+['"];?\s*$/gm, 'const {$1} = window.VG;')
               .replace(/^export\s+(const|function)\s+([A-Za-z0-9_]+)/gm, function (m, kind, name) { return kind + ' ' + name; });
      var names = [];
      var re = /^(?:const|function)\s+([A-Z][A-Za-z0-9_]*)/gm, m;
      while ((m = re.exec(src))) names.push(m[1]);
      src += '\nObject.assign(window.VG, {' + names.join(',') + '});';
      var out = Babel.transform('(function(React){' + src + '})(window.React);', { presets: ['react'] }).code;
      new Function(out)();
    }
    return window.VG;
  })();
})();

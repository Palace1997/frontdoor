/* Editorial (Tana) motion.
   - Letter-by-letter rise on the big Bodoni display headings (preserves any
     child <span> like .accent, and keeps an aria-label for screen readers).
   - Statement photo pills spring in; the rust emblem turns in.
   - Builds the ticking ring of the client-stories play badge.
   Everything degrades to "just show it" under prefers-reduced-motion. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Play-badge ticking ring (48 radial ticks) ---- */
  document.querySelectorAll('[data-ticks]').forEach(function (ring) {
    var N = 48, html = '';
    for (var i = 0; i < N; i++) {
      html += '<i style="transform:translateX(-50%) rotate(' + (i * (360 / N)) + 'deg)"></i>';
    }
    ring.innerHTML = html;
  });

  if (reduce) return;

  /* ---- Letter splitter (recurses so child elements survive) ---- */
  var counter = 0, step = 26;
  function wrap(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {               // text node → words of letters
        var frag = document.createDocumentFragment();
        child.nodeValue.split(/(\s+)/).forEach(function (tok) {
          if (tok === '') return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span');      // nowrap word (no mid-word breaks)
          w.className = 'ed-w';
          for (var i = 0; i < tok.length; i++) {
            var s = document.createElement('span');
            s.className = 'ed-l';
            s.textContent = tok[i];
            s.setAttribute('aria-hidden', 'true');
            s.style.transitionDelay = (counter * step) + 'ms';
            w.appendChild(s);
            counter++;
          }
          frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {         // element → keep it, recurse
        wrap(child);
      }
    });
  }
  function split(el, perLetter) {
    if (el.dataset.edSplit) return;
    el.dataset.edSplit = '1';
    el.setAttribute('aria-label', el.textContent.trim());
    counter = 0; step = perLetter;
    wrap(el);
    el.classList.add('ed-split');
  }

  var targets = [];
  document.querySelectorAll('.lmast').forEach(function (el) { split(el, 55); targets.push(el); });
  document.querySelectorAll('.display-2, .bmr__title, .rdeck h1, .rdeck h2, .port__title').forEach(function (el) {
    split(el, 26); targets.push(el);
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(function (t) { io.observe(t); });

  /* Hero masthead sits above the fold: reveal shortly after load. */
  var mast = document.querySelector('.lmast');
  if (mast) { setTimeout(function () { mast.classList.add('is-in'); }, 360); }

  /* ---- Package section: cycling word + brand icon tile ---- */
  (function () {
    var slot = document.getElementById('pkSlot');
    if (!slot) return;
    var wordEl = document.getElementById('pkWord'), iconEl = document.getElementById('pkIcon');
    // Glossy "inflated" icon set: gradient body + embossed detail + specular.
    var G = 'url(#pkG)', D = 'url(#pkGd)';
    function hl(cx, cy, rx, ry, op) {
      return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry +
        '" fill="#fff" opacity="' + op + '" filter="url(#pkB)"/>';
    }
    function svg(inner) { return '<svg viewBox="0 0 64 64">' + inner + '</svg>'; }
    var ART = {
      design: svg('<rect x="8" y="10" width="48" height="44" rx="14" fill="' + G + '"/>' +
        '<circle cx="23" cy="26" r="5" fill="' + D + '"/>' +
        '<path d="M15 47 L27 33 L35 42 L43 34 L51 47 Z" fill="' + D + '"/>' + hl(25, 20, 13, 6, .55)),
      domain: svg('<circle cx="32" cy="32" r="23" fill="' + G + '"/>' +
        '<ellipse cx="32" cy="32" rx="9.5" ry="23" fill="none" stroke="' + D + '" stroke-width="3"/>' +
        '<path d="M10 32 H54" stroke="' + D + '" stroke-width="3" stroke-linecap="round"/>' + hl(24, 21, 10, 6, .55)),
      hosting: svg('<rect x="10" y="13" width="44" height="16" rx="8" fill="' + G + '"/>' +
        '<rect x="10" y="35" width="44" height="16" rx="8" fill="' + G + '"/>' +
        '<circle cx="20" cy="21" r="3.2" fill="' + D + '"/><circle cx="20" cy="43" r="3.2" fill="' + D + '"/>' +
        hl(27, 17, 11, 3.4, .5) + hl(27, 39, 11, 3.4, .35)),
      editor: svg('<g transform="rotate(-45 32 32)">' +
        '<rect x="25" y="8" width="14" height="36" rx="7" fill="' + G + '"/>' +
        '<path d="M25 44 L32 57 L39 44 Z" fill="' + D + '"/>' +
        '<ellipse cx="30" cy="17" rx="3" ry="8" fill="#fff" opacity=".45" filter="url(#pkB)"/></g>'),
      booking: svg('<rect x="18" y="6" width="7" height="13" rx="3.5" fill="' + G + '"/>' +
        '<rect x="39" y="6" width="7" height="13" rx="3.5" fill="' + G + '"/>' +
        '<rect x="8" y="13" width="48" height="42" rx="13" fill="' + G + '"/>' +
        '<rect x="8" y="26" width="48" height="4" fill="' + D + '"/>' +
        '<circle cx="22" cy="40" r="3.2" fill="' + D + '"/><circle cx="32" cy="40" r="3.2" fill="' + D + '"/>' +
        '<circle cx="42" cy="40" r="3.2" fill="' + D + '"/>' + hl(25, 21, 12, 5, .5)),
      edits: svg('<circle cx="32" cy="32" r="17" fill="none" stroke="' + G + '" stroke-width="10" ' +
        'stroke-linecap="round" stroke-dasharray="80 27" transform="rotate(-50 32 32)"/>' +
        '<path d="M43 8 L55 19 L41 24 Z" fill="' + G + '"/>' + hl(20, 23, 6, 7, .4)),
      support: svg('<rect x="8" y="12" width="48" height="36" rx="16" fill="' + G + '"/>' +
        '<path d="M21 44 L19 58 L34 46 Z" fill="' + G + '"/>' +
        '<circle cx="22" cy="30" r="3.6" fill="' + D + '"/><circle cx="32" cy="30" r="3.6" fill="' + D + '"/>' +
        '<circle cx="42" cy="30" r="3.6" fill="' + D + '"/>' + hl(25, 21, 12, 6, .55)),
      analytics: svg('<rect x="11" y="33" width="12" height="21" rx="6" fill="' + G + '"/>' +
        '<rect x="26" y="23" width="12" height="31" rx="6" fill="' + G + '"/>' +
        '<rect x="41" y="13" width="12" height="41" rx="6" fill="' + G + '"/>' +
        hl(17, 37, 4, 3.5, .5) + hl(32, 27, 4, 3.5, .5) + hl(47, 17, 4, 3.5, .5)),
      security: svg('<path d="M32 7 L54 15 V31 C54 43.5 44.5 51.5 32 56 C19.5 51.5 10 43.5 10 31 V15 Z" fill="' + G + '"/>' +
        '<path d="M23 32 l6.5 6.5 L42 26" fill="none" stroke="' + D + '" stroke-width="5.5" ' +
        'stroke-linecap="round" stroke-linejoin="round"/>' + hl(23, 20, 8, 6, .45))
    };
    var WORDS = [
      { word: 'Design', svg: ART.design },
      { word: 'Domain', svg: ART.domain },
      { word: 'Hosting', svg: ART.hosting },
      { word: 'Editor', svg: ART.editor },
      { word: 'Booking', svg: ART.booking },
      { word: 'Edits', svg: ART.edits },
      { word: 'Support', svg: ART.support },
      { word: 'Analytics', svg: ART.analytics },
      { word: 'Security', svg: ART.security }
    ];
    var mast = document.getElementById('pkMast') || slot;
    var i = 2;
    function paint(n) {
      var w = WORDS[n];
      wordEl.textContent = w.word;
      iconEl.innerHTML = w.svg;
    }
    paint(i);
    setInterval(function () {
      if (document.hidden) return;
      i = (i + 1) % WORDS.length;
      paint(i);
      mast.classList.remove('anim'); void mast.offsetWidth; mast.classList.add('anim');
    }, 1900);
  })();

  /* ---- Package strip: duplicate the chips so the marquee loops seamlessly ---- */
  (function () {
    var track = document.getElementById('pkTrack');
    if (!track || reduce) return;
    var items = Array.prototype.slice.call(track.children);
    items.forEach(function (el) {
      var copy = el.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    });
    track.classList.add('is-loop');
  })();

  /* ---- Statement: spring the photo pills + emblem in ---- */
  var tag = document.querySelector('.tagband');
  if (tag) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io2.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    io2.observe(tag);
  }
})();

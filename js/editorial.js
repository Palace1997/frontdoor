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
    var TILE = '<rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor"/>';
    var SVG = {
      design: '<svg viewBox="0 0 24 24">' + TILE + '<rect x="6.5" y="6.5" width="11" height="11" rx="1.8" stroke="#fff" stroke-width="1.6" fill="none"/><circle cx="10" cy="10" r="1.3" stroke="#fff" stroke-width="1.3" fill="none"/><path d="M7 16l3.2-3.4 2.3 2.2 2.2-2.4 2.3 2.6" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      hosting: '<svg viewBox="0 0 24 24">' + TILE + '<rect x="6.3" y="6.5" width="11.4" height="4.4" rx="1.3" stroke="#fff" stroke-width="1.6" fill="none"/><rect x="6.3" y="13.1" width="11.4" height="4.4" rx="1.3" stroke="#fff" stroke-width="1.6" fill="none"/><path d="M9 8.7h.01M9 15.3h.01" stroke="#fff" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>',
      support: '<svg viewBox="0 0 24 24">' + TILE + '<path d="M6.5 8.2a1.7 1.7 0 0 1 1.7-1.7h7.6a1.7 1.7 0 0 1 1.7 1.7v4.6a1.7 1.7 0 0 1-1.7 1.7H10l-3.5 3z" stroke="#fff" stroke-width="1.6" fill="none" stroke-linejoin="round"/><path d="M9.3 10.5h.01M12 10.5h.01M14.7 10.5h.01" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>'
    };
    var WORDS = [
      { word: 'Design', svg: SVG.design, layer: 0 },
      { word: 'Hosting', svg: SVG.hosting, layer: 1 },
      { word: 'Support', svg: SVG.support, layer: 2 }
    ];
    var layers = document.querySelectorAll('#features .pk-layer');
    var mast = document.getElementById('pkMast') || slot;
    var i = 1;
    function paint(n) {
      var w = WORDS[n];
      wordEl.textContent = w.word;
      iconEl.innerHTML = w.svg;
      layers.forEach(function (l, k) { l.classList.toggle('on', k === w.layer); });
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

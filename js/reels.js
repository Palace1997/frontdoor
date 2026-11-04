/* Designs showcase: a curved, auto-scrolling, draggable carousel of live design
   previews. Needs js/catalog.js + js/designs.js first. Original to FrontDoor. */
(function () {
  "use strict";
  var stage = document.querySelector('[data-reels]');
  var C = window.SW_CATALOG;
  if (!stage || !C) return;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var built = C.designs.filter(function (d) { return !d.soon; });
  // a varied set, capped so we load a sensible number of iframes
  var picks = built.slice(0, 14);
  if (picks.length < 6) picks = built;

  var small = window.innerWidth <= 640;
  var CARD_W = small ? 140 : 180;
  var GAP = small ? 20 : 26;
  var pitch = CARD_W + GAP;
  var N = picks.length;
  var total = N * pitch;

  var cards = picks.map(function (d, i) {
    var el = document.createElement('div');
    el.className = 'rcard';
    el.style.width = CARD_W + 'px';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Preview the ' + d.name + ' design');
    el.dataset.id = d.id;
    el.innerHTML =
      '<div class="rcard__shot"><iframe title="' + d.name + ' design preview" loading="lazy" tabindex="-1"></iframe></div>' +
      '<span class="rcard__play"><svg viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z"/></svg></span>';
    stage.appendChild(el);
    var fr = el.querySelector('iframe');
    fr.addEventListener('load', function () { el.classList.add('ready'); });
    // stagger the loads a little so they don't all hit at once
    setTimeout(function () { fr.src = d.file + '?v=20261104'; }, i * 120);
    return el;
  });

  var stageW = stage.clientWidth, center = stageW / 2;
  function measure() { stageW = stage.clientWidth; center = stageW / 2; }
  addEventListener('resize', measure);

  function layout() {
    if (!stageW) measure();
    for (var i = 0; i < N; i++) {
      var el = cards[i];
      var x = (i * pitch - pos) % total;
      if (x < 0) x += total;
      if (x > stageW + CARD_W) x -= total;      // recycle left
      var cx = x + CARD_W / 2;
      var d = (cx - center) / center;            // -1..1 across the stage
      var dist = Math.min(Math.abs(d), 1.35);
      var scale = 1 + 0.42 * dist * dist;        // edges grow
      var rotY = -26 * Math.max(-1.4, Math.min(1.4, d)); // lean like inside a cylinder
      var ty = -10 * dist * dist;
      el.style.left = x + 'px';
      el.style.transform = 'translateY(' + ty.toFixed(1) + 'px) rotateY(' + rotY.toFixed(1) + 'deg) scale(' + scale.toFixed(3) + ')';
      el.style.zIndex = String(Math.round(120 - dist * 60));
    }
  }

  var pos = 0, mom = 0, speed = RM ? 0 : 44, last = performance.now(), raf = 0;
  var dragging = false, lastX = 0, moved = 0;

  function frame(now) {
    var dt = Math.min(64, now - last); last = now;
    if (!dragging) {
      pos += speed * dt / 1000 + mom;
      mom *= Math.pow(0.9, dt / 16.67);
      if (Math.abs(mom) < 0.02) mom = 0;
    }
    layout();
    raf = requestAnimationFrame(frame);
  }

  function onDown(e) {
    dragging = true; moved = 0; mom = 0;
    lastX = (e.touches ? e.touches[0].clientX : e.clientX);
    stage.classList.add('is-grab');
    if (e.pointerId != null && stage.setPointerCapture) { try { stage.setPointerCapture(e.pointerId); } catch (x) {} }
  }
  function onMove(e) {
    if (!dragging) return;
    var cx = (e.touches ? e.touches[0].clientX : e.clientX);
    var dx = cx - lastX; lastX = cx;
    pos -= dx; mom = -dx * 0.85; moved += Math.abs(dx);
    layout();
  }
  function onUp() { dragging = false; stage.classList.remove('is-grab'); }

  stage.addEventListener('pointerdown', onDown);
  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('pointerup', onUp);
  stage.addEventListener('dragstart', function (e) { e.preventDefault(); });

  // click a card -> open the shared preview, unless it was a drag
  stage.addEventListener('click', function (e) {
    var card = e.target.closest ? e.target.closest('.rcard') : null;
    if (!card || moved > 6) return;
    if (window.SWD && window.SWD.openPreview) window.SWD.openPreview(card.dataset.id);
  });
  stage.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('rcard')) {
      e.preventDefault();
      if (window.SWD && window.SWD.openPreview) window.SWD.openPreview(e.target.dataset.id);
    }
  });

  var cta = document.querySelector('[data-reels-cta]');
  if (cta) cta.addEventListener('click', function (e) {
    var t = document.getElementById('catalog');
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }); }
  });

  measure();
  layout();
  raf = requestAnimationFrame(frame);
})();

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

  // Each card renders the real template in an iframe at SHOT_W and scales it
  // down to fit. The bigger the card, the less the downscale, and the sharper
  // the type: at the old 180px the shot ran at a third size and read as a
  // blur. SHOT_W is a real phone width, so the templates lay out properly.
  var SHOT_W = 390;
  var small = window.innerWidth <= 640;
  // In the hero the carousel is the backdrop, so the cards are sized off the
  // frame rather than a fixed band: tall enough to fill it, capped so the
  // shot never has to scale up past its own render width and go soft.
  var hero = stage.classList.contains('lhero__reels');
  // On a phone a card sized off the frame is nearly as wide as the frame, so
  // you read one screenshot rather than a wall of them. Smaller there.
  var DEFAULT_FILL = small ? 0.42 : 0.60;
  var fill = DEFAULT_FILL;
  var CARD_W, CARD_H;

  // Sizing lives in one place so the dev tuner can re-run it without
  // rebuilding the cards, which would reload all fourteen iframes.
  function measureCards() {
    if (hero) {
      var frameH = stage.clientHeight || 760;
      CARD_H = Math.round(Math.min(Math.max(frameH * fill, 220), 760));
      CARD_W = Math.min(Math.round(CARD_H / 1.62), SHOT_W);
    } else {
      CARD_W = small ? 196 : 288;
      CARD_H = Math.round(CARD_W * 1.62);
    }
  }
  measureCards();
  // Space between neighbouring cards. Mutable so the dev tuner (#tune) can set
  // it live; the default is what ships until a tuned value is baked in.
  var DEFAULT_GAP = small ? 22 : hero ? 60 : 34;   // hero 60 tuned 11 Nov 2026 (was 28)
  var GAP = DEFAULT_GAP;
  // How much the cards at the edges swell. The old standalone section had a
  // whole band to grow into; as a backdrop behind the masthead they should
  // stay calm, so the perspective reads as depth rather than motion.
  var GROW = hero ? 0.13 : 0.42;
  var pitch = CARD_W + GAP;
  var N = picks.length;
  var total = N * pitch;

  var cards = picks.map(function (d, i) {
    var el = document.createElement('div');
    el.className = 'rcard';
    el.style.width = CARD_W + 'px';
    el.style.height = CARD_H + 'px';
    el.style.setProperty('--shot', String(CARD_W / SHOT_W));
    el.style.setProperty('--ch', CARD_H + 'px');   // the CSS centres on this
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Preview the ' + d.name + ' design');
    el.dataset.id = d.id;
    el.innerHTML =
      '<div class="rcard__shot"><iframe title="' + d.name + ' design preview" loading="lazy" tabindex="-1"></iframe></div>';
    stage.appendChild(el);
    var fr = el.querySelector('iframe');
    fr.addEventListener('load', function () {
      // Same origin, so reach in and mark it as a preview: that hides the
      // template's own "Built with FrontDoor" ribbon, which at card size
      // reads as a chat bubble stuck to every sample. The card is still
      // opacity:0 at this point, so nothing flashes.
      try { fr.contentDocument.documentElement.classList.add('is-preview'); } catch (x) {}
      el.classList.add('ready');
    });
    // stagger the loads a little so they don't all hit at once
    setTimeout(function () { fr.src = d.file + '?v=' + (window.SW_TPL_V || '1'); }, i * 120);
    return el;
  });

  var stageW = stage.clientWidth, center = stageW / 2;
  function measure() { stageW = stage.clientWidth; center = stageW / 2; }
  addEventListener('resize', measure);

  // Re-apply the card size to the cards already on the page. Used by the dev
  // tuner (#tune) so the size slider is live; the iframes are left alone, so
  // nothing reloads and the carousel keeps its position.
  function applySize() {
    measureCards();
    pitch = CARD_W + GAP;
    total = N * pitch;
    for (var i = 0; i < cards.length; i++) {
      var el = cards[i];
      el.style.width = CARD_W + 'px';
      el.style.height = CARD_H + 'px';
      el.style.setProperty('--shot', String(CARD_W / SHOT_W));
      el.style.setProperty('--ch', CARD_H + 'px');
    }
    measure();
    layout();
  }
  window.SW_REELS = {
    setFill: function (pct) { fill = Math.max(0.15, Math.min(1.15, pct / 100)); applySize(); },
    defaultFill: Math.round(DEFAULT_FILL * 100),
    // pitch and total are derived from GAP inside applySize(), so changing the
    // gap re-spaces every card in place without reloading an iframe.
    setGap: function (px) { GAP = Math.max(0, Math.min(160, px)); applySize(); },
    defaultGap: DEFAULT_GAP,
    isHero: hero
  };

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
      var scale = 1 + GROW * dist * dist;        // edges grow
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

/* "What You Get" motion hero (home page).
   1. Arms the headline/strip reveal and plays it once when the section scrolls into view.
   2. Turns the middle panel into a rotating carousel: one item at a time, each bar fills
      over a few seconds and the next item follows. The bar's own CSS animation is the
      timer, so pausing the animation pauses the rotation.
   No script, or reduced motion: everything is shown at once and the six items are listed. */
(function () {
  "use strict";
  var sec = document.getElementById('included');
  if (!sec) return;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- reveal
  sec.classList.add('is-ready');
  var shown = false;
  function reveal() {
    if (shown) return; shown = true;
    sec.classList.add('is-in');
    window.removeEventListener('scroll', check);
    window.removeEventListener('resize', check);
  }
  // Backup to the observer: if the section is on screen, play it. Some embedded
  // browsers never fire the observer, and the words must not stay hidden.
  function check() {
    var r = sec.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.75 && r.bottom > 0) reveal();
  }
  if (RM || !('IntersectionObserver' in window)) {
    reveal();
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { reveal(); io.disconnect(); } });
    }, { threshold: 0.2 });
    io.observe(sec);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    setTimeout(check, 600);
  }

  // ---- carousel
  var p2 = sec.querySelector('.wi__p2');
  var slides = [].slice.call(sec.querySelectorAll('.wi__slide'));
  var bars = [].slice.call(sec.querySelectorAll('.wi__bar'));
  var ctl = sec.querySelector('.wi__ctl');
  var box = document.getElementById('wiSlides');
  var pause = sec.querySelector('.wi__pause');
  if (!p2 || !slides.length || slides.length !== bars.length) return;

  // Reduced motion: no rotating. Leave all six items listed so nothing is hidden behind a control.
  if (RM) return;

  var n = slides.length, cur = 0;
  p2.classList.add('is-carousel');
  ctl.hidden = false;
  slides.forEach(function (el, k) { if (k) el.setAttribute('aria-hidden', 'true'); });
  box.setAttribute('aria-live', 'off');

  function show(i) {
    cur = (i + n) % n;
    slides.forEach(function (el, k) {
      var on = k === cur;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    bars.forEach(function (b, k) { b.setAttribute('aria-current', k === cur ? 'true' : 'false'); });
    // restart the active bar's fill so it always runs from empty
    var fill = bars[cur].firstElementChild;
    if (fill) { fill.style.animation = 'none'; void fill.offsetWidth; fill.style.animation = ''; }
  }

  // the fill finishing is the cue to move on
  sec.querySelector('.wi__bars').addEventListener('animationend', function (e) {
    if (e.animationName === 'wiFill') show(cur + 1);
  });
  bars.forEach(function (b, k) {
    b.addEventListener('click', function () { box.setAttribute('aria-live', 'polite'); show(k); });
  });
  pause.addEventListener('click', function () {
    var on = p2.classList.toggle('is-paused');
    pause.setAttribute('aria-label', on ? 'Play rotation' : 'Pause rotation');
    box.setAttribute('aria-live', on ? 'polite' : 'off');
  });
  // hold still while someone is reading or using the panel
  p2.addEventListener('mouseenter', function () { p2.classList.add('is-hold'); });
  p2.addEventListener('mouseleave', function () { p2.classList.remove('is-hold'); });
  // only keyboard focus holds it; a mouse click leaves focus on the bar, which must not freeze the rotation
  p2.addEventListener('focusin', function (e) { if (e.target.matches && e.target.matches(':focus-visible')) p2.classList.add('is-hold'); });
  p2.addEventListener('focusout', function () { p2.classList.remove('is-hold'); });
})();

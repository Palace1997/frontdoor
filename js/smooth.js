/* Smooth wheel scrolling (Lenis). Added 16 Nov 2026 after John pointed at the iTrust
   Insights site, which scrolls with the same library and the same two numbers.
   What it does: instead of the page jumping a notch per wheel click, the scroll position
   eases toward where the wheel asked for, so it glides. Touch screens keep their own
   native scrolling; Lenis leaves them alone.
   The library is self-hosted (js/lenis.min.js, v1.1.13) so no third-party request is added;
   privacy.html says the public pages load no third-party scripts.
   Off for reduced motion. Paused while the menu or the design preview is open. */
(function () {
  "use strict";
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM || !window.Lenis) return;

  var lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  window.swLenis = lenis;

  // One loop, only while something is moving (Lenis reports isScrolling), so an idle page
  // costs nothing.
  var pending = false, awake = 0;
  function loop(t) {
    pending = false;                         // cleared first, so a thrown error cannot leave the loop dead
    lenis.raf(t);
    if (lenis.isScrolling || t - awake < 400) { pending = true; requestAnimationFrame(loop); }
  }
  function wake() {
    awake = performance.now();
    if (!pending) {
      // The loop slept, so Lenis's clock is stale: its first frame would measure the whole idle
      // gap as one huge step and jump most of the way there. Zero it so the glide starts gently.
      lenis.time = 0;
      pending = true; requestAnimationFrame(loop);
    }
  }
  ['wheel', 'keydown', 'pointerdown', 'scroll', 'touchstart'].forEach(function (ev) {
    addEventListener(ev, wake, { passive: true });
  });
  wake();

  // In-page links glide instead of jumping, and the shared helper replaces scrollIntoView
  // 'smooth', which would fight the library.
  window.swScrollTo = function (target, dur) {
    wake();
    lenis.scrollTo(target, { duration: dur || 1.4, easing: function (k) { return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; } });
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = a.getAttribute('href').slice(1);
    var t = id && document.getElementById(id);
    if (!t || !t.getClientRects().length) return;   // missing or hidden target: leave it to the browser
    e.preventDefault();
    window.swScrollTo(t);
    if (history.pushState) history.pushState(null, '', '#' + id);
    if (t.tabIndex < 0) t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
  });

  // The mobile menu and the design preview lock the page by setting body overflow.
  // Lenis does not read that, so pause it while either is open.
  function sync() {
    var locked = document.body.classList.contains('mnav-open') || document.body.style.overflow === 'hidden';
    if (locked && !lenis.isStopped) lenis.stop();
    else if (!locked && lenis.isStopped) { lenis.start(); wake(); }
  }
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
})();

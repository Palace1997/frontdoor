/* FrontDoor, shared interactions */
(function () {
  /* ---- Booking link -----------------------------------------------------
     Every conversion CTA marked data-book points here. Set this ONE value
     to your Calendly (or other scheduling) link and all buttons update. */
  var BOOKING_URL = 'https://calendly.com/YOUR-HANDLE/intro-call';
  // Only take over the CTAs once a real link is set; until then they keep
  // their in-page fallback (#start, the request form) so nothing points at a dead page.
  if (BOOKING_URL && !/YOUR-HANDLE/.test(BOOKING_URL)) {
    document.querySelectorAll('[data-book]').forEach(function (a) {
      a.setAttribute('href', BOOKING_URL);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  }

  // Auto-hiding scrollbar: show only while actively scrolling
  var root = document.documentElement, sbTimer;
  window.addEventListener('scroll', function () {
    root.classList.add('is-scrolling');
    clearTimeout(sbTimer);
    sbTimer = setTimeout(function () { root.classList.remove('is-scrolling'); }, 650);
  }, { passive: true });

  // Sticky nav shadow + hide on scroll down, show on scroll up
  var nav = document.querySelector('.nav');
  if (nav) {
    var lastY = window.scrollY;
    var onScroll = function () {
      var y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 8);
      if (y > 170 && y > lastY + 5) nav.classList.add('nav--hidden');
      else if (y < lastY - 5 || y < 170) nav.classList.remove('nav--hidden');
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile menu
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () { links.classList.toggle('is-open'); });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('is-open');
    });
  }

  /* ---- Section router --------------------------------------------------
     Nav items behave like standalone pages: clicking "FAQ" shows only
     the FAQ section (plus the persistent nav + footer), not the whole
     one-page site. The logo / no-hash shows the full landing page.
     Safe on every page: if the hash has no matching section here, it just
     shows everything (normal full page). */
  var ROUTES = { how: 1, why: 1, mission: 1, designs: 1, features: 1, faq: 1, start: 1 };
  var routeSections = Array.prototype.slice.call(document.querySelectorAll('body > section'));

  // "Back to homepage" control, shown only while a single section is routed
  // (these isolated views have no nav bar of their own).
  var backBtn = null;
  if (routeSections.length) {
    backBtn = document.createElement('a');
    backBtn.className = 'routeback';
    backBtn.href = 'index.html';
    backBtn.setAttribute('aria-label', 'Back to homepage');
    backBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><span>Back to homepage</span>';
    backBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (history.pushState) { history.pushState('', '', location.pathname); }
      else { location.hash = ''; }
      applyRoute();
    });
    document.body.appendChild(backBtn);
  }

  function applyRoute() {
    var id = (location.hash || '').replace(/^#/, '');
    var single = (ROUTES[id] && document.getElementById(id)) ? id : null;
    routeSections.forEach(function (s) {
      // route-only sections never show in the full-page scroll; they appear
      // only when navigated to directly (e.g. via a nav link).
      var show = single ? (s.id === single) : !s.hasAttribute('data-route-only');
      s.style.display = show ? '' : 'none';
    });
    document.body.classList.toggle('is-routed', !!single);
    if (single) {
      var sec = document.getElementById(single);
      // Dark routeback only on genuinely dark sections (a section can carry the
      // .section--dark class for styling hooks yet be visually light: data-light).
      if (backBtn) backBtn.classList.toggle('routeback--ondark', sec.classList.contains('section--dark') && !sec.hasAttribute('data-light'));
      // Replay the entrance every time the section is opened, not just the first
      // time: reset the reveal/letter states, force a reflow so the CSS
      // animations restart, then play them again on the next frame.
      // Done synchronously: reset, flush the reset with a forced reflow, then
      // re-apply. Never defer the re-show to rAF, which does not fire while the
      // page is hidden and would leave the section stuck invisible.
      var anim = sec.querySelectorAll('.reveal, .ed-split');
      sec.classList.remove('is-entering');
      anim.forEach(function (el) { el.classList.remove('is-in'); });
      void sec.offsetWidth;
      sec.classList.add('is-entering');
      anim.forEach(function (el) { el.classList.add('is-in'); });
      // Land at the top. Defer past the browser's own jump-to-#hash so we win.
      window.scrollTo(0, 0);
      requestAnimationFrame(function () { window.scrollTo(0, 0); });
    }
  }
  if (routeSections.length) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.addEventListener('hashchange', applyRoute);
    window.addEventListener('popstate', applyRoute);
    applyRoute();
  }

  // FAQ accordion
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var ans = item.querySelector('.faq__a');
      var open = item.classList.toggle('is-open');
      ans.style.maxHeight = open ? ans.scrollHeight + 'px' : null;
    });
  });

  /* ---- Get-started request form ---------------------------------------
     Posts to Formspree once a real form id is set below. Until then it shows
     a friendly confirmation so nothing looks broken. Never collects health data. */
  var REQUEST_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
  var req = document.getElementById('requestForm');
  if (req) {
    req.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = req.querySelector('[name=name]'), email = req.querySelector('[name=email]');
      if (!name.value.trim()) { name.focus(); return; }
      if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) { email.focus(); return; }
      var btn = req.querySelector('[type=submit]');
      var done = function () { req.classList.add('is-sent'); if (btn) { btn.disabled = true; btn.textContent = 'Request sent'; } };
      if (/YOUR_FORM_ID/.test(REQUEST_ENDPOINT)) { done(); return; }
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      fetch(REQUEST_ENDPOINT, { method: 'POST', body: new FormData(req), headers: { 'Accept': 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(); done(); })
        .catch(function () { if (btn) { btn.disabled = false; btn.textContent = 'Try again'; } });
    });
  }

  // Reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();

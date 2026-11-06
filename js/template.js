/* FrontDoor template, shared interactions */
(function () {
  /* ---- Form delivery config -------------------------------------------
     Set the Formspree endpoint here (or per-form via the form's action="…",
     or globally via window.D7_FORM_ENDPOINT before this script runs).
     While it is left as the placeholder below, forms fall back to a friendly
     no-backend confirmation so nothing looks broken pre-launch. */
  var FORM_ENDPOINT_DEFAULT = 'https://formspree.io/f/YOUR_FORM_ID';
  var PLACEHOLDER = 'https://formspree.io/f/YOUR_FORM_ID';

  // Auto-hiding scrollbar: show the bar only while actively scrolling
  var root = document.documentElement, sbTimer;
  window.addEventListener('scroll', function () {
    root.classList.add('is-scrolling');
    clearTimeout(sbTimer);
    sbTimer = setTimeout(function () { root.classList.remove('is-scrolling'); }, 650);
  }, { passive: true });

  /* ---- Menu buttons -----------------------------------------------------
     Six designs open their mobile menu with the CSS checkbox trick. A <label>
     responds to a click but never to Enter or Space, so those menus could not
     be opened from the keyboard at all (WCAG 2.1.1). The label carries
     role="button" and the checkbox is hidden from assistive tech; this wires
     up the keyboard half and keeps aria-expanded honest. */
  document.querySelectorAll('label[data-menu-toggle]').forEach(function (label) {
    var box = document.getElementById(label.getAttribute('for'));
    if (!box) return;
    var sync = function () { label.setAttribute('aria-expanded', box.checked ? 'true' : 'false'); };
    sync();
    label.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
      e.preventDefault();
      box.checked = !box.checked;
      box.dispatchEvent(new Event('change', { bubbles: true }));
      sync();
    });
    label.addEventListener('click', function () { setTimeout(sync, 0); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.checked) { box.checked = false; sync(); label.focus(); }
    });
  });

  var nav = document.querySelector('.t-nav');
  if (nav) {
    var on = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    on(); window.addEventListener('scroll', on, { passive: true });
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* derive a sensible field name for controls that lack one */
  function fieldName(el, i) {
    if (el.name) return el.name;
    if (el.type === 'email') return 'email';
    var lbl = el.closest('label') || (el.id && document.querySelector('label[for="' + el.id + '"]'));
    var txt = (lbl && lbl.textContent) || el.getAttribute('placeholder') || el.getAttribute('aria-label') || ('field_' + (i + 1));
    return txt.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || ('field_' + (i + 1));
  }

  function endpointFor(f) {
    var a = f.getAttribute('action') || '';
    if (/^https?:\/\//i.test(a)) return a;                 // per-form override
    if (window.D7_FORM_ENDPOINT) return window.D7_FORM_ENDPOINT;
    return FORM_ENDPOINT_DEFAULT;
  }

  document.querySelectorAll('form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = f.querySelector('[type=submit],button');
      var original = btn ? btn.textContent : '';
      var endpoint = endpointFor(f);

      // No real endpoint configured yet → keep the graceful stub.
      if (!endpoint || endpoint === PLACEHOLDER) {
        if (btn) { btn.textContent = 'Thank you, we’ll be in touch'; btn.disabled = true; }
        return;
      }

      // Build payload from all named/derivable controls.
      var data = new FormData();
      var controls = f.querySelectorAll('input, select, textarea');
      controls.forEach(function (el, i) {
        if (!el.name && (el.type === 'submit' || el.type === 'button')) return;
        if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;
        data.append(fieldName(el, i), el.value);
      });

      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      fetch(endpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (res) {
          if (res.ok) {
            if (btn) btn.textContent = 'Thank you, we’ll be in touch';
            f.reset();
          } else {
            if (btn) { btn.textContent = 'Something went wrong, try again'; btn.disabled = false; }
          }
        })
        .catch(function () {
          if (btn) { btn.textContent = 'Network error, try again'; btn.disabled = false; }
        });
    });
  });
})();

/* FrontDoor, shared design-catalog widgets
   Needs js/catalog.js loaded first. Every widget only runs if its element exists,
   so this file is safe on any page. */
(function () {
  var C = window.SW_CATALOG; if (!C) return;
  var byId = function (list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var areaName = function (id) { var a = byId(C.areas, id); return a ? a.name : ''; };
  var typeName = function (id) { var t = byId(C.types, id); return t ? t.name : ''; };
  var built = C.designs.filter(function (d) { return !d.soon; });

  // lowercase the first letter, unless the first word is an acronym like ADHD or ABA
  var lc = function (t) { return /^[A-Z][A-Z]/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1); };

  /* ---- Card markup ---- */
  function cardHTML(d) {
    // one quiet editorial meta line instead of pill tags
    var meta = '<p class="dcard__meta">' + (d.isNew ? '<em>New</em> &middot; ' : '') + esc(areaName(d.area)) + ' &middot; ' + esc(typeName(d.type)) + '</p>';
    var chrome = '<div class="dcard__chrome"><i></i><i></i><i></i><span>' + (d.soon ? 'coming soon' : 'yourpractice.com') + '</span></div>';
    if (d.soon) {
      return '<article class="dcard dcard--soon">' +
        '<div class="dcard__thumb">' + chrome + '<div class="dcard__shot"><span>Coming soon</span></div></div>' +
        '<div class="dcard__body">' + meta + '<h3>' + esc(d.name) + '</h3>' +
        '<p class="dcard__best"><b>For</b> ' + esc(lc(d.best)) + '</p></div></article>';
    }
    return '<article class="dcard">' +
      '<div class="dcard__thumb" data-preview="' + esc(d.id) + '" role="button" tabindex="0" aria-label="Preview the ' + esc(d.name) + ' design">' +
      (d.isNew ? '<span class="dcard__new">New</span>' : '') + chrome +
      '<div class="dcard__shot"><iframe data-src="' + esc(d.file) + '?v=' + (window.SW_TPL_V || '1') + '" tabindex="-1" title="' + esc(d.name) + ' design preview" loading="lazy"></iframe></div>' +
      '<div class="dcard__view"><span>Preview</span></div></div>' +
      '<div class="dcard__body">' + meta +
      '<h3>' + esc(d.name) + '</h3>' +
      '<p class="dcard__feel">' + esc(d.feel) + '</p>' +
      '<p class="dcard__best"><b>Best for</b> ' + esc(lc(d.best)) + '</p>' +
      '<div class="dcard__actions"><button class="dcard__prev" type="button" data-preview="' + esc(d.id) + '">Preview</button>' +
      '<a class="dcard__choose" href="index.html?design=' + encodeURIComponent(d.id) + '#start">Choose this design</a></div>' +
      '</div></article>';
  }

  /* ---- Lazy-load the live thumbnails only when they come near view ----
     IntersectionObserver does the normal work. A position check backs it up,
     because the section router can move cards into view without any scroll. */
  function load(f) { if (!f.getAttribute('src')) f.src = f.dataset.src; if (lazyIO) lazyIO.unobserve(f); }
  var lazyIO = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) load(e.target); });
  }, { rootMargin: '300px 0px' }) : null;
  function checkNear() {
    var limit = window.innerHeight + 400;
    document.querySelectorAll('iframe[data-src]:not([src])').forEach(function (f) {
      var r = f.getBoundingClientRect();
      if (r.width && r.top < limit && r.bottom > -400) load(f);
    });
  }
  var ticking = false;
  function onMove() { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; checkNear(); }); }
  ['scroll', 'resize', 'hashchange'].forEach(function (ev) { window.addEventListener(ev, onMove, { passive: true }); });
  window.addEventListener('load', checkNear);
  function hydrate(root) {
    (root || document).querySelectorAll('iframe[data-src]:not([src])').forEach(function (f) {
      if (lazyIO) lazyIO.observe(f); else load(f);
    });
    setTimeout(checkNear, 60); setTimeout(checkNear, 600);
  }

  /* ---- Preview modal (desktop / tablet / mobile) ---- */
  var pv = null, pvFrame, pvStage, pvTitle, pvOpen, pvChoose, lastFocus;
  function buildPreview() {
    pv = document.createElement('div');
    pv.className = 'pv'; pv.setAttribute('role', 'dialog'); pv.setAttribute('aria-modal', 'true'); pv.setAttribute('aria-label', 'Design preview');
    pv.innerHTML =
      '<div class="pv__bar">' +
        '<div class="pv__title" id="pvTitle"></div>' +
        '<div class="pv__devices" role="group" aria-label="Preview size">' +
          '<button type="button" class="is-active" data-dev="desktop">Desktop</button>' +
          '<button type="button" data-dev="tablet">Tablet</button>' +
          '<button type="button" data-dev="mobile">Mobile</button></div>' +
        '<div class="pv__actions"><a class="btn btn--ghost" id="pvOpen" target="_blank" rel="noopener">Open full page</a>' +
          '<a class="btn btn--primary" id="pvChoose">Choose this design</a>' +
          '<button type="button" class="pv__close" aria-label="Close preview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '</div>' +
      '<div class="pv__stage"><iframe title="Design preview"></iframe></div>';
    document.body.appendChild(pv);
    pvFrame = pv.querySelector('iframe'); pvStage = pv.querySelector('.pv__stage');
    pvTitle = pv.querySelector('#pvTitle'); pvOpen = pv.querySelector('#pvOpen'); pvChoose = pv.querySelector('#pvChoose');
    pv.querySelector('.pv__close').addEventListener('click', closePreview);
    pv.addEventListener('click', function (e) { if (e.target === pv) closePreview(); });
    pv.querySelectorAll('[data-dev]').forEach(function (b) {
      b.addEventListener('click', function () {
        pv.querySelectorAll('[data-dev]').forEach(function (x) { x.classList.toggle('is-active', x === b); });
        pvStage.className = 'pv__stage' + (b.dataset.dev === 'desktop' ? '' : ' is-' + b.dataset.dev);
      });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pv.classList.contains('is-open')) closePreview(); });
  }
  function openPreview(id) {
    var d = byId(C.designs, id); if (!d || d.soon) return;
    if (!pv) buildPreview();
    lastFocus = document.activeElement;
    pvTitle.innerHTML = esc(d.name) + '<small>' + esc(areaName(d.area)) + ' · ' + esc(typeName(d.type)) + '</small>';
    pvOpen.href = d.file + '?v=' + (window.SW_TPL_V || '1');
    pvChoose.href = 'index.html?design=' + encodeURIComponent(d.id) + '#start';
    pvFrame.src = d.file + '?v=' + (window.SW_TPL_V || '1');
    pv.classList.add('is-open'); document.body.style.overflow = 'hidden';
    pv.querySelector('.pv__close').focus();
  }
  function closePreview() {
    pv.classList.remove('is-open'); document.body.style.overflow = '';
    pvFrame.src = 'about:blank';
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-preview]');
    if (t) { e.preventDefault(); openPreview(t.dataset.preview); }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.dcard__thumb[data-preview]')) { e.preventDefault(); openPreview(e.target.dataset.preview); }
  });

  /* ---- Designs browser: a vertical category sidebar + a grid of designs ----
     Renders into any [data-designs-browser] element, so the homepage and the
     gallery share one component. Add data-url-sync to keep ?cat= in the URL. */
  function initBrowser(el) {
    var urlSync = el.hasAttribute('data-url-sync');
    var cat = '';
    if (urlSync) { var p = new URLSearchParams(location.search).get('cat') || ''; if (byId(C.categories, p)) cat = p; }
    function countFor(id) { return built.filter(function (d) { return !id || C.categoryOf(d) === id; }).length; }
    var cats = [{ id: '', name: 'All designs' }].concat(C.categories);
    el.classList.add('browse');
    el.innerHTML =
      '<aside class="browse__side"><p class="browse__sidehead">Browse by practice</p>' +
      '<div class="browse__cats" role="tablist" aria-label="Design categories">' +
        cats.map(function (c) {
          return '<button type="button" class="browse__cat" role="tab" data-cat="' + esc(c.id) + '">' +
            '<span>' + esc(c.name) + '</span><em>' + countFor(c.id) + '</em></button>';
        }).join('') +
      '</div></aside>' +
      '<div class="browse__main"><p class="browse__count" aria-live="polite"></p>' +
      '<div class="dgrid browse__grid"></div></div>';
    var catsEl = el.querySelector('.browse__cats'), gridEl = el.querySelector('.browse__grid'), countEl = el.querySelector('.browse__count');
    function render() {
      var list = built.filter(function (d) { return !cat || C.categoryOf(d) === cat; });
      var name = cat ? byId(C.categories, cat).name : 'All designs';
      countEl.textContent = list.length + (list.length === 1 ? ' design' : ' designs') + (cat ? ' in ' + name : '');
      gridEl.innerHTML = list.map(cardHTML).join('');
      hydrate(gridEl);
      catsEl.querySelectorAll('.browse__cat').forEach(function (b) {
        var on = b.dataset.cat === cat; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      if (urlSync) history.replaceState(null, '', location.pathname + (cat ? '?cat=' + cat : ''));
    }
    catsEl.addEventListener('click', function (e) { var b = e.target.closest('[data-cat]'); if (!b) return; cat = b.dataset.cat; render(); });
    render();
  }
  document.querySelectorAll('[data-designs-browser]').forEach(initBrowser);

  /* ---- Contact form: list the real designs grouped by category, and prefill from a design link ---- */
  var req = document.getElementById('requestForm');
  if (req) {
    var sel = req.querySelector('#rqType');
    var note = document.getElementById('reqPick');
    // one optgroup per category, options drawn from the live catalog so the list never goes stale
    if (sel && C.categories) {
      C.categories.forEach(function (cat) {
        var items = C.designs.filter(function (d) { return !d.soon && C.categoryOf(d) === cat.id; });
        if (!items.length) return;
        var og = document.createElement('optgroup'); og.label = cat.name;
        items.forEach(function (d) {
          var o = document.createElement('option'); o.value = d.name; o.textContent = d.name; og.appendChild(o);
        });
        sel.appendChild(og);
      });
    }
    // a short note naming the chosen design
    function reqNote() {
      if (!note) return;
      var v = sel && sel.value;
      if (v && v !== 'Not sure yet') {
        note.hidden = false;
        note.textContent = 'You are asking about the ' + v + ' design. Tell us a little about your practice and we will take it from there.';
      } else { note.hidden = true; }
    }
    if (sel) sel.addEventListener('change', reqNote);
    // arriving from a design's link (?design=id) preselects that design
    var pick = byId(C.designs, new URLSearchParams(location.search).get('design') || '');
    if (pick && !pick.soon && sel) { sel.value = pick.name; reqNote(); }
  }

  window.SWD = { cardHTML: cardHTML, hydrate: hydrate, openPreview: openPreview, areaName: areaName, typeName: typeName, byId: byId, esc: esc };
})();

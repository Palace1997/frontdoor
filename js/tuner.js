/* Dev-only tuner. Hidden unless the URL contains #tune (works on the live
   site too: add #tune to the address). Sliders set sizes/positions live and
   remember your last values in this browser. Once you settle, tell Claude the
   numbers and they get baked into css/main.css; this file can then be removed.
     - Nav / footer logo heights  -> --nav-logo-size, --footer-logo-size
     - Hero (homepage .lhero only): logo size, and the copy block up/down
       -> --lhero-logo, --lhero-copy-y
     - Hero designs reel: up/down, left/right, card size, space between
       -> --reels-y, --reels-x, window.SW_REELS.setFill() and .setGap() */
(function () {
  var root = document.documentElement;

  function get(key, def) {
    try { var v = localStorage.getItem(key); return v !== null ? +v : def; } catch (e) { return def; }
  }
  function set(key, v) { try { localStorage.setItem(key, v); } catch (e) {} }

  // What each slider starts on when nothing is saved in this browser. These used to
  // be hard-coded numbers (hero logo 56, footer logo 120, reel position 0 and 0),
  // which had drifted from the values actually baked into the CSS (122, 90, -10
  // and 49). So a fresh browser opening #tune silently applied the wrong numbers,
  // and the tuner looked different from the live page until something was saved.
  // Read the real current value from the page instead, so they cannot drift again.
  function cssPx(name, fb) {
    var n = parseFloat(getComputedStyle(root).getPropertyValue(name));
    return isNaN(n) ? fb : n;
  }
  function translateOf(sel) {                       // [x, y] of the standalone `translate`
    var e = document.querySelector(sel);
    var t = e ? getComputedStyle(e).translate : '';
    if (!t || t === 'none') return [0, 0];
    var p = t.split(/\s+/);
    return [parseFloat(p[0]) || 0, parseFloat(p[1]) || 0];
  }
  var heroImg = document.querySelector('.lnav__logo img');
  var reelT = translateOf('.lhero__reels');
  var copyT = translateOf('.lstage');

  var nav = get('fd_nav', cssPx('--nav-logo-size', 92));
  var foot = get('fd_logo', cssPx('--footer-logo-size', 90));
  var hLogo = get('fd_lhero_logo', heroImg ? Math.round(parseFloat(getComputedStyle(heroImg).height)) || 122 : 122);
  var copyY = get('fd_lhero_copy_y', copyT[1]);
  var rHead = get('fd_rdeck_head', 80);
  var reelY = get('fd_reels_y', reelT[1]);
  var reelX = get('fd_reels_x', reelT[0]);
  var reelFill = get('fd_reels_fill', 0);   // 0 = leave reels.js on its default
  var reelGap = get('fd_reels_gap', -1);    // -1 = leave reels.js on its default (0 is a real value)

  var hasHero = !!document.querySelector('.lhero');
  var hasShowcase = !!document.querySelector('.rdeck');
  var hasReels = !!document.querySelector('.lhero__reels');

  function apply() {
    root.style.setProperty('--nav-logo-size', nav + 'px');
    root.style.setProperty('--footer-logo-size', foot + 'px');
    if (hasHero) {
      root.style.setProperty('--lhero-logo', hLogo + 'px');
      // Moves the eyebrow, masthead, subline and CTA together, plus the
      // ellipse scrim that sits under them.
      root.style.setProperty('--lhero-copy-y', copyY + 'px');
    }
    if (hasShowcase) {
      root.style.setProperty('--rdeck-head-y', rHead + 'px');
    }
    if (hasReels) {
      root.style.setProperty('--reels-y', reelY + 'px');
      root.style.setProperty('--reels-x', reelX + 'px');
    }
  }

  function row(label, id, min, max, val, unit) {
    unit = unit || 'px';
    return '<label style="display:block;margin-bottom:12px" data-unit="' + unit + '">' +
      '<span style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:12.5px">' +
      '<span>' + label + '</span><b id="' + id + '-o">' + val + unit + '</b></span>' +
      '<input id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="1" value="' + val + '" style="width:100%">' +
      '</label>';
  }

  function head(text) {
    return '<div style="font-weight:600;margin:14px 0 10px;font-size:11px;letter-spacing:.08em;' +
      'text-transform:uppercase;color:#5CC2A3">' + text + '</div>';
  }

  function bind(id, onChange) {
    var el = document.getElementById(id), out = document.getElementById(id + '-o');
    if (!el) return;
    el.addEventListener('input', function () {
      var v = Math.round(+el.value);
      out.textContent = v + (el.closest('label').dataset.unit || 'px');
      onChange(v);
      apply();
    });
  }

  var built = false;
  function build() {
    if (built || !/tune/.test(location.hash)) return;
    built = true;
    apply();
    var p = document.createElement('div');
    p.setAttribute('data-tuner', '');
    p.style.cssText = 'position:fixed;bottom:18px;right:18px;z-index:99999;background:#112746;color:#F0EBE1;' +
      'border:1px solid #1d5143;border-radius:12px;padding:14px 16px;width:248px;max-height:86vh;overflow:auto;' +
      'font:14px/1.4 Inter,system-ui,sans-serif;box-shadow:0 12px 34px rgba(0,0,0,.4)';

    var html = head('Logo tuner (dev)') +
      row('Nav logo size', 'fd-nav', 40, 92, nav) +
      row('Footer logo size', 'fd-logo', 48, 160, foot);

    if (hasHero) {
      html += head('Hero (homepage)') +
        row('Hero logo size', 'fd-hlogo', 24, 140, hLogo) +
        row('Text up / down', 'fd-copyy', -260, 260, copyY);
    }

    if (hasShowcase) {
      html += head('Designs showcase') +
        row('Section down', 'fd-rhead', 0, 400, rHead);
    }

    if (hasReels) {
      var startFill = reelFill || (window.SW_REELS && window.SW_REELS.defaultFill) || 62;
      var startGap = reelGap >= 0 ? reelGap : ((window.SW_REELS && window.SW_REELS.defaultGap) || 28);
      html += head('Hero designs') +
        row('Up / down', 'fd-reely', -320, 320, reelY) +
        row('Left / right', 'fd-reelx', -320, 320, reelX) +
        row('Card size', 'fd-reelf', 20, 110, startFill, '%') +
        row('Space between', 'fd-reelg', 0, 120, startGap);
    }

    html += '<div style="font-size:11px;color:#9fc3b7;margin-top:8px">Only shows with #tune in the URL. Tell Claude the values to lock them in.</div>';
    p.innerHTML = html;
    document.body.appendChild(p);

    bind('fd-nav', function (v) { nav = v; set('fd_nav', v); });
    bind('fd-logo', function (v) { foot = v; set('fd_logo', v); });
    bind('fd-hlogo', function (v) { hLogo = v; set('fd_lhero_logo', v); });
    bind('fd-copyy', function (v) { copyY = v; set('fd_lhero_copy_y', v); });
    bind('fd-rhead', function (v) { rHead = v; set('fd_rdeck_head', v); });
    bind('fd-reely', function (v) { reelY = v; set('fd_reels_y', v); });
    bind('fd-reelx', function (v) { reelX = v; set('fd_reels_x', v); });
    bind('fd-reelg', function (v) {
      reelGap = v; set('fd_reels_gap', v);
      if (window.SW_REELS) window.SW_REELS.setGap(v);
    });
    bind('fd-reelf', function (v) {
      reelFill = v; set('fd_reels_fill', v);
      if (window.SW_REELS) window.SW_REELS.setFill(v);
    });

    // reels.js builds after this panel on some loads, so apply a stored card
    // size once it is there rather than silently doing nothing.
    // If nothing was saved, the slider started on a guess (28) because reels.js
    // may not exist yet. Once it does, show the real default for this layout
    // (22 on a phone, 28 in the hero, 34 elsewhere).
    if (hasReels && reelGap < 0) {
      (function syncGap(tries) {
        if (window.SW_REELS && window.SW_REELS.defaultGap != null) {
          var g = document.getElementById('fd-reelg'), o = document.getElementById('fd-reelg-o');
          if (g && o && reelGap < 0) { g.value = window.SW_REELS.defaultGap; o.textContent = window.SW_REELS.defaultGap + 'px'; }
          return;
        }
        if (tries > 0) setTimeout(function () { syncGap(tries - 1); }, 120);
      })(25);
    }
    if (hasReels && (reelFill || reelGap >= 0)) {
      (function waitForReels(tries) {
        if (window.SW_REELS) {
          if (reelFill) window.SW_REELS.setFill(reelFill);
          if (reelGap >= 0) window.SW_REELS.setGap(reelGap);
          return;
        }
        if (tries > 0) setTimeout(function () { waitForReels(tries - 1); }, 120);
      })(25);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
  window.addEventListener('hashchange', build);
})();

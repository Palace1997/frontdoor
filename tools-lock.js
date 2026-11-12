#!/usr/bin/env node
/* Password-lock a page so only people with the team password can open it.

   Why this exists: the public site is hosted on GitHub Pages, which is static
   and has no login. So the two internal pages (studio/customize.html and
   forms/index.html) are stored ENCRYPTED. What is committed is a small lock
   screen plus the scrambled page. The browser decrypts it only after the right
   password is typed, then shows it. Without the password the page cannot be
   read from the repo, from view-source, or from the live site.

   Use:
     node tools-lock.js lock   <plain.html>  <locked.html>   encrypt a page
     node tools-lock.js unlock <locked.html> <plain.html>    decrypt it to edit

   The password is read from the STUDIO_PASSWORD environment variable, or from a
   file called .studio-password beside this script (one line, git-ignored). It is
   never printed and never written into the output.

   To edit a locked page: unlock it to a file OUTSIDE the repo (for example
   /tmp/customize.html), edit that, then lock it back over the original. Never
   commit the plain version. To change the password: unlock with the old one,
   then lock again with the new one.

   Method: PBKDF2-SHA256 (600,000 rounds) turns the password into a key, and
   AES-256-GCM encrypts the page. GCM also detects a wrong password or any
   tampering, so a wrong password simply fails. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const ITER = 600000;

function readPassword() {
  if (process.env.STUDIO_PASSWORD) return process.env.STUDIO_PASSWORD;
  const f = path.join(__dirname, '.studio-password');
  if (fs.existsSync(f)) {
    const p = fs.readFileSync(f, 'utf8').split(/\r?\n/)[0].trim();
    if (p) return p;
  }
  console.error('No password. Set STUDIO_PASSWORD, or put it on the first line of .studio-password');
  process.exit(1);
}

function encrypt(plain, password) {
  const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, ITER, 32, 'sha256');
  const c = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([c.update(plain, 'utf8'), c.final(), c.getAuthTag()]); // WebCrypto wants tag at the end
  return { v: 1, iter: ITER, salt: salt.toString('base64'), iv: iv.toString('base64'), ct: ct.toString('base64') };
}

function decrypt(p, password) {
  const ct = Buffer.from(p.ct, 'base64');
  const key = crypto.pbkdf2Sync(password, Buffer.from(p.salt, 'base64'), p.iter, 32, 'sha256');
  const d = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(p.iv, 'base64'));
  d.setAuthTag(ct.subarray(ct.length - 16));
  return Buffer.concat([d.update(ct.subarray(0, ct.length - 16)), d.final()]).toString('utf8');
}

/* The lock screen. Self-contained: no external files, so it also works when this
   page is the only thing that loads. Written for the team, so it says so. */
function shell(payload) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>FrontDoor Studio | Team sign-in</title>
<link rel="icon" href="data:,">
<style>
  :root{ --navy:#112746; --navy-2:#0A1B33; --blue:#1C6FB0; --blue-600:#15578C; --canvas:#F7F4EE; --ink:#1B1812; --line:#E5E2DC; --g-700:#514c46; --err:#9B1C1C; }
  *{ box-sizing:border-box; }
  body{ margin:0; min-height:100vh; display:flex; flex-direction:column; background:var(--canvas); color:var(--ink); font:17px/1.6 Inter,system-ui,-apple-system,"Segoe UI",sans-serif; }
  header{ background:var(--navy-2); color:#E7F1FA; padding:14px 24px; font-size:14px; }
  header b{ color:#fff; font-weight:600; }
  main{ flex:1; display:grid; place-items:center; padding:40px 20px; }
  .card{ width:100%; max-width:440px; background:#fff; border:1px solid var(--line); border-radius:6px; padding:clamp(24px,5vw,36px); }
  .eyebrow{ font-size:12.5px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--blue-600); }
  h1{ font-family:Fraunces,Georgia,serif; font-weight:500; font-size:clamp(28px,5vw,34px); line-height:1.12; margin:10px 0 10px; }
  p{ margin:0 0 20px; color:var(--g-700); font-size:16px; }
  label{ display:block; font-weight:600; font-size:15px; margin-bottom:6px; }
  input{ width:100%; font:inherit; padding:12px 14px; border:1px solid #8A8480; border-radius:6px; background:#fff; color:var(--ink); }
  input:focus-visible, button:focus-visible{ outline:3px solid var(--blue); outline-offset:2px; }
  button{ margin-top:16px; width:100%; font:inherit; font-weight:600; padding:13px 18px; border:0; border-radius:999px; background:var(--blue); color:#fff; cursor:pointer; }
  button:hover{ background:var(--blue-600); }
  button[disabled]{ opacity:.7; cursor:wait; }
  .err{ margin:12px 0 0; color:var(--err); font-size:15px; min-height:1.4em; }
  footer{ padding:18px 24px; text-align:center; font-size:14px; color:var(--g-700); }
</style>
</head>
<body>
<header>FrontDoor Studio · An internal tool for the <b>iTrust Insights</b> team</header>
<main id="main">
  <form class="card" id="gate" autocomplete="off">
    <span class="eyebrow">Team access</span>
    <h1>FrontDoor Studio</h1>
    <p>This page is for the iTrust Insights team. Enter the team password to continue.</p>
    <label for="pw">Password</label>
    <input id="pw" name="pw" type="password" autocomplete="current-password" required autofocus>
    <p class="err" id="err" role="alert" aria-live="assertive"></p>
    <button type="submit" id="go">Open</button>
  </form>
  <noscript><p>This page needs JavaScript to unlock.</p></noscript>
</main>
<footer>Internal use only.</footer>
<script type="application/json" id="payload">${JSON.stringify(payload)}</script>
<script>
(function () {
  var P = JSON.parse(document.getElementById('payload').textContent);
  var KEY = 'fd-team-pw';
  var form = document.getElementById('gate'), pw = document.getElementById('pw'),
      err = document.getElementById('err'), go = document.getElementById('go');
  function b64(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function decrypt(password) {
    var enc = new TextEncoder();
    return crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
      .then(function (km) {
        return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(P.salt), iterations: P.iter, hash: 'SHA-256' },
          km, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      })
      .then(function (key) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(P.iv) }, key, b64(P.ct)); })
      .then(function (buf) { return new TextDecoder().decode(buf); });
  }
  function show(html) { document.open(); document.write(html); document.close(); }
  if (!window.crypto || !crypto.subtle) {
    err.textContent = 'This browser cannot unlock the page here. Open it over https in a current browser.';
    go.disabled = true; return;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!pw.value) { pw.focus(); return; }
    err.textContent = ''; go.disabled = true; go.textContent = 'Opening...';
    var typed = pw.value;
    decrypt(typed).then(function (html) {
      // Remember it for this tab only, so reloading the Studio does not ask again.
      try { sessionStorage.setItem(KEY, typed); } catch (x) {}
      show(html);
    }).catch(function () {
      go.disabled = false; go.textContent = 'Open';
      err.textContent = 'That password did not work. Try again.';
      pw.select();
    });
  });
  // Same tab, already signed in: open straight away.
  var saved = null; try { saved = sessionStorage.getItem(KEY); } catch (x) {}
  if (saved) decrypt(saved).then(show).catch(function () { try { sessionStorage.removeItem(KEY); } catch (x) {} });
})();
</script>
</body>
</html>
`;
}

const [, , cmd, inFile, outFile] = process.argv;
if (!['lock', 'unlock'].includes(cmd) || !inFile || !outFile) {
  console.error('Usage: node tools-lock.js lock|unlock <input.html> <output.html>');
  process.exit(1);
}
const password = readPassword();
const input = fs.readFileSync(inFile, 'utf8');

if (cmd === 'lock') {
  if (input.includes('id="payload"') && input.includes('fd-team-pw')) {
    console.error('That file is already locked. Unlock it first.'); process.exit(1);
  }
  fs.writeFileSync(outFile, shell(encrypt(input, password)));
  console.log('Locked ' + path.basename(inFile) + ' -> ' + outFile);
} else {
  const m = input.match(/<script type="application\/json" id="payload">(.*?)<\/script>/s);
  if (!m) { console.error('No locked payload found in ' + inFile); process.exit(1); }
  let plain;
  try { plain = decrypt(JSON.parse(m[1]), password); }
  catch (e) { console.error('Wrong password, or the file was changed.'); process.exit(1); }
  fs.writeFileSync(outFile, plain);
  console.log('Unlocked ' + path.basename(inFile) + ' -> ' + outFile);
}

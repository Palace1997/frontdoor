/* Build one intake form per design.
   Every question comes from the template's own data-field / data-img tags, so a
   form never asks for something its design has no room for, and never misses
   something it does. The form writes the exact .d7project.json the Studio
   imports, so nothing has to be retyped. */
const fs = require('fs'), path = require('path');
const ROOT = '/Users/eddmaar/Documents/Sitewell Studio';

global.window = {};
eval(fs.readFileSync(path.join(ROOT, 'js/catalog.js'), 'utf8'));
const DESIGNS = window.SW_CATALOG.designs.filter(d => !d.soon);
const AREAS = {}; window.SW_CATALOG.areas.forEach(a => AREAS[a.id] = a.name);
const TYPES = {}; window.SW_CATALOG.types.forEach(t => TYPES[t.id] = t.name);
const GROUPS = JSON.parse(fs.readFileSync('/tmp/groups.json', 'utf8'));

// What each field is for, in the client's language. Anything not listed falls
// back to the Studio's own label.
const HINT = {
  brandName:'The name as you want it read on the site, in the nav and the footer.',
  phone:'The number you answer. It becomes a tap-to-call link on phones.',
  email:'The address enquiries should reach. It becomes a mailto link.',
  address:'Street, suite, town and state. Leave blank if you do not see people in person.',
  hours:'When you are reachable, in plain words. For example, Mon to Fri 9am to 5pm.',
  navCta:'The button at the top right. Two or three words.',
  logoText:'Only if your logo is a word set differently from the business name. Otherwise leave blank.',
  heroEyebrow:'The small line above the headline. Says what you are and where.',
  heroTitle:'The first thing a visitor reads. Say what you do, not a slogan.',
  heroSub:'One or two sentences under the headline. Who you help and how to start.',
  heroCta1:'Main button. What should happen next, for example Book a free consult.',
  heroCta2:'Second button, lower commitment, for example See our services.',
  trustText:'A short line of reassurance under the buttons. Facts only.',
  servicesTitle:'Heading for the list of what you offer.',
  servicesSub:'One line under that heading.',
  aboutTitle:'Heading for the section about you or the practice.',
  aboutText:'A short paragraph in your own voice. Who you are and how you work.',
  quoteText:'A note in YOUR words about how you work. Not a client testimonial, and nothing about a specific person.',
  quoteAuthor:'Who is speaking. Your name and credentials.',
  quoteRole:'Their role, for example Clinical Director.',
  contactTitle:'Heading above the contact form.',
  contactSub:'One line telling people what happens after they get in touch.',
  footerText:'A closing line in the footer.',
  footerLegal:'Your legal or copyright line.',
  hero:'The main photograph at the top of the page.',
  about:'The photograph beside your about section.'
};
for (let n = 1; n <= 6; n++) {
  HINT['svc' + n + 'Title'] = 'Name of service ' + n + '. Leave blank to remove the whole card.';
  HINT['svc' + n + 'Desc'] = 'One or two plain sentences about service ' + n + '.';
}
for (let n = 1; n <= 4; n++) HINT['check' + n] = 'Short point ' + n + '. Leave blank to drop it.';
for (let n = 1; n <= 3; n++) {
  HINT['stat' + n + 'Num'] = 'Figure ' + n + '. Only something you can evidence, no outcome or success rates.';
  HINT['stat' + n + 'Label'] = 'What figure ' + n + ' counts.';
}
for (let n = 1; n <= 5; n++) {
  HINT['faq' + n + 'Q'] = 'Question ' + n + ', as a client would ask it.';
  HINT['faq' + n + 'A'] = 'Your answer to question ' + n + '. Keep it practical.';
}


// The twenty asked up front. Chosen because each one is a FACT or a VOICE that
// only the practice has, and that would be plainly wrong if the demo wording
// shipped instead: another practice's phone number, another clinician's name
// on the quote, invented figures in the stats band. Everything else is prose
// the team writes, which is what the service promises anyway.
const CORE = ['brandName','phone','email','address',
  'heroTitle','heroSub','heroCta1',
  'svc1Title','svc2Title','svc3Title',
  'aboutText','quoteText','quoteAuthor','quoteRole',
  'stat1Num','stat1Label','stat2Num','stat2Label','stat3Num','stat3Label'];

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const txt = h => h.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#39;|&rsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"').replace(/\s+/g, ' ').trim();

function fieldsIn(html) {
  const found = {};
  const re = /data-field="([^"]+)"[^>]*>([\s\S]*?)<\//g;
  let m; while ((m = re.exec(html))) if (!(m[1] in found)) found[m[1]] = txt(m[2]);
  return found;
}
function imagesIn(html) {
  const out = [];
  const re = /<img\b([^>]*)>/g; let m;
  while ((m = re.exec(html))) {
    const tag = m[1];
    const id = (tag.match(/data-img="([^"]+)"/) || [])[1];
    const alt = (tag.match(/alt="([^"]*)"/) || [, ''])[1];
    const src = (tag.match(/src="([^"]*)"/) || [, ''])[1];
    if (!/images\.unsplash\.com|assets\//.test(src)) continue;
    out.push({ id: id || null, alt: txt(alt), src });
  }
  return out;
}

function guide(sample) {
  const n = (sample || '').length;
  if (!n) return '';
  if (n <= 28) return 'about ' + n + ' characters';
  if (n <= 90) return 'roughly ' + n + ' characters, one short line';
  return 'roughly ' + n + ' characters, about ' + Math.max(1, Math.round(n / 95)) + ' lines';
}

function buildForm(d) {
  const file = path.join(ROOT, d.file);
  const html = fs.readFileSync(file, 'utf8');
  const have = fieldsIn(html);
  const imgs = imagesIn(html);
  const labelOf = {}; GROUPS.forEach(g => g.fields.forEach(f => labelOf[f.id] = f.label));

  function row(id, label, sample) {
    const big = (sample || '').length > 95;
    const hint = HINT[id] || label;
    return '<div class="q"><label for="' + id + '">' + esc(label) + '</label>'
      + '<p class="hint">' + esc(hint) + (guide(sample) ? ' <span class="len">' + esc(guide(sample)) + '</span>' : '') + '</p>'
      + (big
        ? '<textarea id="' + id + '" name="' + id + '" rows="3" placeholder="' + esc((sample || '').slice(0, 160)) + '"></textarea>'
        : '<input type="text" id="' + id + '" name="' + id + '" placeholder="' + esc((sample || '').slice(0, 90)) + '">')
      + (sample ? '<p class="eg">Currently shows: <span>' + esc(sample.slice(0, 180)) + (sample.length > 180 ? '…' : '') + '</span></p>' : '')
      + '</div>';
  }

  // ---- the twenty ----
  const core = CORE.filter(id => id in have);
  let main = '<section class="grp"><h2>The Twenty</h2>'
    + '<p class="note">These are the things only you can tell us. Everything else on the page we write for you from these answers.</p>';
  core.forEach(id => { main += row(id, labelOf[id] || id, have[id]); });
  main += '</section>';

  main += '<section class="grp"><h2>Photographs and logo</h2>'
    + '<p class="note">Email us your photographs and logo and we will place them. No need to list anything here. '
    + 'Where you have none we use stock photography and swap it later whenever you are ready.</p></section>';

  // ---- everything else, folded away ----
  let extraRows = '';
  GROUPS.forEach(g => {
    const rows = g.fields.filter(f => (f.id in have) && CORE.indexOf(f.id) < 0 && f.type !== 'color' && f.type !== 'logo' && f.type !== 'range' && f.type !== 'image');
    if (!rows.length) return;
    extraRows += '<h3 class="sub">' + esc(g.title) + '</h3>';
    rows.forEach(f => { extraRows += row(f.id, f.label, have[f.id]); });
  });
  extraRows += '<h3 class="sub">Brand</h3>'
    + row('accent', 'Brand colour', d.accent)
    + row('logoText', 'Logo wording', '');
  extraRows += '<h3 class="sub">Photographs</h3>';
  imgs.forEach((im, i) => { extraRows += row(im.id || ('img' + (i + 1)), im.alt || ('Photograph ' + (i + 1)), ''); });

  const extra = '<details class="more"><summary>Want more control? Open the rest (optional)</summary>'
    + '<p class="note">Nothing here is needed. Fill in anything you already have strong wording for, and we will write the rest.</p>'
    + extraRows + '</details>';

  return { count: core.length, html: page(d, main + extra, core.length) };
}

function page(d, body, count) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Website Content Form, ${esc(d.name)} design | FrontDoor</title>
<link rel="stylesheet" href="form.css?v=1">
</head>
<body>
<header class="hd"><div class="in">
  <p class="kicker">FrontDoor, a service of iTrust Insights</p>
  <h1>Your Website Content</h1>
  <p class="lede">You picked the <b>${esc(d.name)}</b> design, built for ${esc((AREAS[d.area] || '').toLowerCase())} at ${esc((TYPES[d.type] || '').toLowerCase())} scale. There are just ${count} questions, and they should take about ten minutes. They cover the things only you can tell us. We write the rest of the page from your answers and send you a draft to approve. Please keep patient information out of it, including anonymised stories.</p>
</div></header>

<main class="in">
  <form id="f" autocomplete="off">${body}</form>

  <section class="grp">
    <h2>Send it back</h2>
    <p class="note">Nothing you type is sent anywhere until you press a button below. Your answers stay in this browser.</p>
    <div class="acts">
      <button type="button" id="dl" class="btn btn--p">Download my answers</button>
      <button type="button" id="cp" class="btn">Copy as text</button>
    </div>
    <p class="note">Email the downloaded file to us and we will load it straight into your site. Copying as text is fine too if that is easier.</p>
  </section>
</main>

<footer class="ft"><div class="in">
  <p>If you or someone you know is in crisis, call or text <b>988</b> (Suicide &amp; Crisis Lifeline), or call 911 in an emergency.</p>
  <p class="sm">&copy; 2026 FrontDoor, a service of iTrust Insights.</p>
</div></footer>

<script>
var TEMPLATE = ${JSON.stringify('../' + d.file)};
var DESIGN = ${JSON.stringify(d.name)};
function collect(){
  var values={}, f=document.getElementById('f');
  [].forEach.call(f.querySelectorAll('input,textarea'), function(el){
    var v=el.value.trim(); if(v) values[el.name]=v;
  });
  return values;
}
function fileName(values){
  var n=(values.brandName||DESIGN||'website').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  return n+'.d7project.json';
}
document.getElementById('dl').addEventListener('click',function(){
  var values=collect();
  if(!Object.keys(values).length){ alert('Fill in at least one answer first.'); return; }
  // exactly the shape the Studio's Import expects
  // the copyright line follows from the business name, so we never ask for it
  if(values.brandName && !values.footerLegal){
    values.footerLegal='\u00a9 '+new Date().getFullYear()+' '+values.brandName+'. All rights reserved.';
  }
  var payload={ name: values.brandName||DESIGN, template: TEMPLATE, values: values };
  var blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download=fileName(values); a.click(); URL.revokeObjectURL(a.href);
});
document.getElementById('cp').addEventListener('click',function(){
  var values=collect(), lines=['Design: '+DESIGN,''];
  [].forEach.call(document.querySelectorAll('#f .q'), function(q){
    var el=q.querySelector('input,textarea'); if(!el||!values[el.name]) return;
    lines.push(q.querySelector('label').textContent+': '+values[el.name]);
  });
  var text=lines.join('\\n');
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){ alert('Copied. Paste it into an email to us.'); },
      function(){ window.prompt('Copy this:', text); });
  } else { window.prompt('Copy this:', text); }
});
</script>
</body>
</html>`;
}

const outDir = path.join(ROOT, 'forms');
fs.mkdirSync(outDir, { recursive: true });
const built = [];
DESIGNS.forEach(d => {
  const r = buildForm(d);
  fs.writeFileSync(path.join(outDir, d.id + '.html'), r.html);
  built.push({ id: d.id, name: d.name, practice: d.practice, area: AREAS[d.area], type: TYPES[d.type], q: r.count });
});

// an index so the team can find the right link to send
const rows = built.map(b => '<tr><td><b>' + esc(b.name) + '</b><br><span class="sm">' + esc(b.practice) + '</span></td><td>'
  + esc(b.area) + '</td><td>' + esc(b.type) + '</td><td><a href="' + b.id + '.html">Open</a> &middot; '
  + '<a href="' + b.id + '.html" class="copy" data-id="' + b.id + '">Copy link</a></td></tr>').join('');
fs.writeFileSync(path.join(outDir, 'index.html'), `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Content forms, all designs | FrontDoor</title>
<link rel="stylesheet" href="form.css?v=1"></head><body>
<header class="hd"><div class="in"><p class="kicker">Internal</p><h1>Content Forms</h1>
<p class="lede">One form per design, ${built.length} in all. Send a client the link for the design they chose. Their answers download as a file you load straight into the Studio with Import.</p></div></header>
<main class="in"><table class="tbl"><tr><th>Design</th><th>Practice area</th><th>Size</th><th></th></tr>${rows}</table></main>
<script>document.addEventListener('click',function(e){var a=e.target.closest('.copy');if(!a)return;e.preventDefault();
var u=new URL(a.getAttribute('href'),location.href).href;navigator.clipboard.writeText(u).then(function(){a.textContent='Copied';setTimeout(function(){a.textContent='Copy link';},1400);});});</script>
</body></html>`);

console.log('forms written: ' + built.length);
console.log(built.map(b => b.id + ' (' + b.q + ' questions)').join(', '));

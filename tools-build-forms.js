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
// back to the Studio's own label. Deliberately uneven: a field whose label says
// it all gets no hint, because twenty identically-shaped sentences in a row is
// what makes a form read as machine-written. Where a series repeats (services,
// FAQs, stats) only the first one carries the explanation.
const HINT = {
  brandName:'As it should read in the nav and the footer.',
  phone:'The line you actually answer.',
  email:"Where inquiries should land. A shared inbox is fine.",
  address:"Street, suite, city, state. Leave it blank if you're telehealth only.",
  hours:"In plain words, the way you'd say them on the phone.",
  navCta:'The button at the top right. Two or three words.',
  logoText:'Only if your logo reads differently from the business name.',
  heroEyebrow:'The small line above the headline. What you are, and where.',
  heroTitle:'The first line anyone reads. What you do, not a slogan.',
  heroSub:'Who you work with and how someone starts. Two sentences.',
  heroCta1:'Name the action. Request an appointment. Book a consult.',
  heroCta2:'A second, lower-commitment button, if you want one.',
  trustText:'A short line under the buttons. Facts only.',
  servicesTitle:'Heading over the list of what you offer.',
  servicesSub:'One line under that heading.',
  aboutTitle:'Heading for the section about you or the practice.',
  aboutText:"How you work, in a short paragraph. Write it the way you'd say it.",
  quoteText:'Set in large type, in your words. Your approach to care, not a client testimonial.',
  quoteAuthor:"Name and credentials, the way you'd sign a letter.",
  quoteRole:'Your title, or the city you practice in.',
  contactTitle:'Heading above the contact form.',
  contactSub:'One line on what happens after someone sends it.',
  footerText:'A closing line in the footer.',
  footerLegal:'Leave it blank and we build it from your business name.',
  hero:'The main photograph at the top.',
  about:'The photograph beside your about section.'
};
HINT.svc1Desc = 'One or two plain sentences. Same for the cards below.';
HINT.check1 = 'A short point. Leave any of them blank to drop it.';
HINT.faq1Q = 'The way someone would actually ask it.';
HINT.faq1A = 'Practical. What they need in order to act.';
for (let n = 1; n <= 6; n++) { if (n > 1) HINT['svc' + n + 'Desc'] = ''; HINT['svc' + n + 'Title'] = ''; }
for (let n = 2; n <= 4; n++) HINT['check' + n] = '';
for (let n = 1; n <= 3; n++) { HINT['stat' + n + 'Num'] = ''; HINT['stat' + n + 'Label'] = ''; }
for (let n = 2; n <= 5; n++) { HINT['faq' + n + 'Q'] = ''; HINT['faq' + n + 'A'] = ''; }

// Labels we override, because the Studio's own ("Service 1, title") is written
// for whoever is editing the site, not for the person who owns the practice.
const LABEL = {
  stat1Num:'First number', stat2Num:'Second number', stat3Num:'Third number',
  stat1Label:'What it counts', stat2Label:'What it counts', stat3Label:'What it counts',
  heroCta1:'Main button', quoteRole:'Title or city', accent:'Accent color'
};
const ORD = ['First','Second','Third','Fourth','Fifth','Sixth'];
for (let n = 1; n <= 6; n++) {
  LABEL['svc' + n + 'Title'] = ORD[n - 1] + ' service';
  LABEL['svc' + n + 'Desc'] = ORD[n - 1] + ' service, what it is';
}
HINT.accent = 'A hex code if you have one, or just name the color.';

// The Studio's own group names are written for whoever edits the site. "Hero"
// means nothing to the person who owns the practice.
const SUBTITLE = {
  'Business info':'Business details', 'Hero':'Top of the page',
  'Brand & colour':'Brand and color', 'Brand & color':'Brand and color',
  'Contact section':'Contact section'
};
const subTitle = t => SUBTITLE[t] || SUBTITLE[t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()] || t;

// The twenty asked up front, in five short groups rather than one slab of
// questions. Each one is a FACT or a VOICE that only the practice has, and that
// would be plainly wrong if the demo wording shipped instead: another practice's
// phone number, another clinician's name on the quote, invented figures in the
// stats band. Everything else is prose we write, which is the service anyway.
const CORE_GROUPS = [
  { title:'How to reach you', note:'',
    ids:['brandName','phone','email','address'] },
  { title:'The top of the page', note:'',
    ids:['heroTitle','heroSub','heroCta1'] },
  { title:'What you offer', note:'Three cards run across the page. Leave one blank and that card comes off.',
    ids:['svc1Title','svc2Title','svc3Title'] },
  { title:'In your own words', note:'',
    ids:['aboutText','quoteText','quoteAuthor','quoteRole'] },
  { title:'Three numbers', note:'Only things you can back up. No outcome or success rates.',
    pairs:true, ids:['stat1Num','stat1Label','stat2Num','stat2Label','stat3Num','stat3Label'] }
];
const CORE = CORE_GROUPS.reduce((a, g) => a.concat(g.ids), []);

// One step back up the tree, not a jump to the top: a single form goes to the
// index of all of them, and the index goes to the homepage. Each link is named
// for where it lands, so neither of them says "Home" while going somewhere else.
const back = (href, label) => '<a class="back" href="' + href + '">'
  + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" '
  + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<path d="M19 12H5M11 18l-6-6 6-6"/></svg>' + label + '</a>';
const BACK_TO_INDEX = back('index.html', 'All forms');
const BACK_TO_HOME = back('../index.html', 'Home');

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

function buildForm(d) {
  const file = path.join(ROOT, d.file);
  const html = fs.readFileSync(file, 'utf8');
  const have = fieldsIn(html);
  const imgs = imagesIn(html);
  const labelOf = {}; GROUPS.forEach(g => g.fields.forEach(f => labelOf[f.id] = f.label));

  // The demo wording goes in the placeholder, so each field shows what it is
  // replacing without a second line underneath repeating it.
  function row(id, label, sample, small, hintOver) {
    const big = (sample || '').length > 95;
    // No entry means no hint. Repeating the label underneath the label is the
    // kind of filler a generator produces and a reader notices.
    const hint = hintOver !== undefined ? hintOver : (HINT[id] || '');
    return '<div class="q' + (small ? ' q--sm' : '') + '"><label for="' + id + '">' + esc(label) + '</label>'
      + (hint ? '<p class="hint">' + esc(hint) + '</p>' : '')
      + (big
        ? '<textarea id="' + id + '" name="' + id + '" rows="3" placeholder="' + esc(sample || '') + '"></textarea>'
        : '<input type="text" id="' + id + '" name="' + id + '" placeholder="' + esc((sample || '').slice(0, 90)) + '">')
      + '</div>';
  }

  // ---- the twenty, in five short groups ----
  let core = 0, main = '';
  CORE_GROUPS.forEach(g => {
    const ids = g.ids.filter(id => id in have);
    if (!ids.length) return;
    core += ids.length;
    main += '<section class="grp"><h2>' + esc(g.title) + '</h2>'
      + (g.note ? '<p class="note">' + esc(g.note) + '</p>' : '');
    if (g.pairs) {
      for (let i = 0; i < ids.length; i += 2) {
        main += '<div class="pair">' + row(ids[i], LABEL[ids[i]] || labelOf[ids[i]] || ids[i], have[ids[i]], true)
          + (ids[i + 1] ? row(ids[i + 1], LABEL[ids[i + 1]] || labelOf[ids[i + 1]] || ids[i + 1], have[ids[i + 1]]) : '')
          + '</div>';
      }
    } else {
      ids.forEach(id => { main += row(id, LABEL[id] || labelOf[id] || id, have[id]); });
    }
    main += '</section>';
  });

  main += '<section class="grp grp--plain"><h2>Photographs and logo</h2>'
    + "<p class=\"note\">Attach your photographs and logo to the same reply and we'll place them. "
    + "If you don't have photographs yet we use stock, and swap them whenever you're ready.</p></section>";

  // ---- everything else, folded away ----
  let extraRows = '', extraCount = 0;
  GROUPS.forEach(g => {
    const rows = g.fields.filter(f => (f.id in have) && CORE.indexOf(f.id) < 0 && f.type !== 'color' && f.type !== 'logo' && f.type !== 'range' && f.type !== 'image');
    if (!rows.length) return;
    extraRows += '<h3 class="sub">' + esc(subTitle(g.title)) + '</h3>';
    rows.forEach(f => { extraRows += row(f.id, LABEL[f.id] || f.label, have[f.id]); extraCount++; });
  });
  extraRows += '<h3 class="sub">Brand</h3>'
    + row('accent', 'Accent color', d.accent)
    + row('logoText', 'Logo wording', '');
  extraCount += 2;
  if (imgs.length) {
    extraRows += '<h3 class="sub">Photographs</h3>';
    // The alt text describes the stock shot that is in the slot now, so it
    // belongs under the label as context, not as the label itself.
    imgs.forEach((im, i) => {
      extraRows += row(im.id || ('img' + (i + 1)), 'Photograph ' + (i + 1),
        '', false, im.alt ? 'In that slot now: ' + im.alt.charAt(0).toLowerCase() + im.alt.slice(1) + '.' : '');
      extraCount++;
    });
  }

  const extra = '<details class="more"><summary>The other ' + extraCount + ' fields, all optional</summary>'
    + "<p class=\"note\">None of this is needed. Fill in whatever you already have wording for.</p>"
    + extraRows + '</details>';

  return { count: core, html: page(d, main + extra, core) };
}

function page(d, body, count) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Content form, ${esc(d.name)} | FrontDoor</title>
<link rel="stylesheet" href="form.css?v=4">
</head>
<body>
<header class="hd"><div class="in">
  ${BACK_TO_INDEX}
  <p class="kicker">FrontDoor, a service of iTrust Insights</p>
  <h1>Content for your ${esc(d.name)} site</h1>
  <p class="lede">${esc(d.name)} is built for ${esc((AREAS[d.area] || '').toLowerCase())} at ${esc((TYPES[d.type] || '').toLowerCase())} scale. ${count} questions below. They are the parts of the page we can't invent for you: your name on it, your words, your numbers. We draft the rest and send it back for you to mark up. Please keep patient information out of it, de-identified vignettes included.</p>
</div></header>

<main class="in">
  <form id="f" autocomplete="off">${body}</form>

  <section class="grp grp--plain">
    <h2>Sending it back</h2>
    <p class="note">Nothing leaves your browser until you press one of these.</p>
    <div class="acts">
      <button type="button" id="dl" class="btn btn--p">Download answers</button>
      <button type="button" id="cp" class="btn">Copy as text</button>
    </div>
    <p class="note">Reply to the email we sent you and attach the file. Pasted text is fine too.</p>
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
    navigator.clipboard.writeText(text).then(function(){ alert('Copied. Paste it into your reply.'); },
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
<link rel="stylesheet" href="form.css?v=4"></head><body>
<header class="hd"><div class="in in--wide">${BACK_TO_HOME}<p class="kicker">Internal</p><h1>Content forms</h1>
<p class="lede">One per design, ${built.length} in all. Send a client the link for the design they picked. They fill it in and send back a file, which goes straight into the Studio with Import.</p></div></header>
<main class="in in--wide"><table class="tbl"><tr><th>Design</th><th>Practice area</th><th>Size</th><th></th></tr>${rows}</table></main>
<script>document.addEventListener('click',function(e){var a=e.target.closest('.copy');if(!a)return;e.preventDefault();
var u=new URL(a.getAttribute('href'),location.href).href;navigator.clipboard.writeText(u).then(function(){a.textContent='Copied';setTimeout(function(){a.textContent='Copy link';},1400);});});</script>
</body></html>`);

console.log('forms written: ' + built.length);
console.log(built.map(b => b.id + ' (' + b.q + ' questions)').join(', '));

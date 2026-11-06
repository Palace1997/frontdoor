/* Build the structured data and the blog for every design in the catalog.
   Run it with: node tools-build-seo.js

   Three things happen to each of the 30 catalogued templates:

   1. A <script type="application/ld+json" id="sw-jsonld"> goes into the head,
      built from that template's OWN data-field values by js/seo.js. The same
      builder runs in the Studio just before export, so a client's real name,
      phone, address and services replace the demo wording in the schema without
      anyone editing JSON by hand.
   2. Two pages are written beside it, <design>-blog.html and <design>-post.html,
      using that template's own head, styles, nav and footer, so the blog carries
      the design's accent and navigation rather than a house style of its own.
   3. A Blog link is added to the nav and to the footer link list.

   Re-running is safe: every injected part is bounded by markers and replaced in
   place, so the script is idempotent and never duplicates itself.

   The six templates that are NOT in the catalog (billing, credentialing,
   marketplace, the AI scribe, the consumer app, the workplace programme) are
   skipped on purpose. None of them is a clinical practice, so MedicalBusiness
   and medicalSpecialty would be the wrong claim to make about them. */

const fs = require('fs'), path = require('path');
const ROOT = __dirname;
const SEO = require(path.join(ROOT, 'js/seo.js'));

global.window = {};
eval(fs.readFileSync(path.join(ROOT, 'js/catalog.js'), 'utf8'));
const CATALOG = window.SW_CATALOG;
const DESIGNS = CATALOG.designs.filter(d => !d.soon);
const AREA_NAME = {}; CATALOG.areas.forEach(a => AREA_NAME[a.id] = a.name);

/* Which schema.org type and which medicalSpecialty each practice area is.

   Physician is reserved for the two areas led by physicians. A psychiatric
   nurse practitioner is not a physician and an ABA provider is not one either,
   so those stay MedicalBusiness, which is the honest parent type.

   The specialty is a member of schema.org's MedicalSpecialty enumeration, so it
   has to be one of the published values. "Psychiatric" is the one that covers
   behavioral health. Community-based services that are not themselves clinical
   treatment, a recovery community centre, a clubhouse, a crisis line, take
   CommunityHealth instead, because calling peer support a psychiatric specialty
   would overstate what those programmes do. */
const SCHEMA = {
  psychiatry:      { type: 'Physician',       specialty: 'Psychiatric' },
  'addiction-med': { type: 'Physician',       specialty: 'Psychiatric' },
  psychology:      { type: 'MedicalBusiness', specialty: 'Psychiatric' },
  counseling:      { type: 'MedicalBusiness', specialty: 'Psychiatric' },
  mft:             { type: 'MedicalBusiness', specialty: 'Psychiatric' },
  'psych-nursing': { type: 'MedicalBusiness', specialty: 'Psychiatric' },
  aba:             { type: 'MedicalBusiness', specialty: 'Psychiatric' },
  expressive:      { type: 'MedicalBusiness', specialty: 'Psychiatric' },
  sud:             { type: 'MedicalBusiness', specialty: 'Psychiatric' },
  'social-work':   { type: 'MedicalBusiness', specialty: 'CommunityHealth' },
  'psych-rehab':   { type: 'MedicalBusiness', specialty: 'CommunityHealth' },
  peer:            { type: 'MedicalBusiness', specialty: 'CommunityHealth' }
};

const POST_DATE = '2026-11-06';

/* ---- small HTML helpers (no DOM in Node, and no dependency to install) ---- */

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const txt = h => String(h).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#39;|&rsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"')
  .replace(/&ndash;/g, '–').replace(/\s+/g, ' ').trim();

// Balanced <tag> ... </tag>, matching nesting. `last` walks back from the final
// closing tag instead, which is how the page footer is told apart from the small
// <footer> that sits inside a pull quote.
function balanced(html, tag, last) {
  const re = new RegExp('<\\/?' + tag + '\\b[^>]*>', 'g');
  const toks = []; let m;
  while ((m = re.exec(html))) toks.push({ i: m.index, end: m.index + m[0].length, open: m[0][1] !== '/' });
  if (!toks.length) return null;
  if (!last) {
    let d = 0;
    for (const t of toks) { d += t.open ? 1 : -1; if (d === 0) return { start: toks[0].i, end: t.end }; }
    return null;
  }
  let d = 0;
  for (let k = toks.length - 1; k >= 0; k--) {
    d += toks[k].open ? -1 : 1;
    if (d === 0) return { start: toks[k].i, end: toks[toks.length - 1].end };
  }
  return null;
}

function fieldsIn(html) {
  const found = {};
  const re = /data-field="([^"]+)"[^>]*>([\s\S]*?)<\//g;
  let m; while ((m = re.exec(html))) if (!(m[1] in found)) found[m[1]] = txt(m[2]);
  return found;
}

// Keep the attribute if it is already there, otherwise add it.
function setAttr(tag, name, value) {
  const re = new RegExp('\\s' + name + '="[^"]*"');
  const pair = ' ' + name + '="' + esc(value) + '"';
  if (re.test(tag)) return tag.replace(re, pair);
  return tag.replace(/>$/, pair + '>');
}

/* Replace a region bounded by HTML comment markers, or insert it before a
   closing tag the first time. This is what makes re-running the script safe. */
function upsert(html, key, block, beforeClose) {
  const open = '<!-- sw:' + key + ' -->', close = '<!-- /sw:' + key + ' -->';
  const wrapped = open + '\n' + block + '\n' + close;
  const a = html.indexOf(open), b = html.indexOf(close);
  if (a >= 0 && b > a) return html.slice(0, a) + wrapped + html.slice(b + close.length);
  const at = html.lastIndexOf(beforeClose);
  if (at < 0) throw new Error('no ' + beforeClose + ' to insert before');
  return html.slice(0, at) + wrapped + '\n' + html.slice(at);
}

/* ---- the blog's own CSS ---------------------------------------------------
   It borrows nothing from the template except --acc and whatever the body class
   already sets for background, text colour and font, which is why the blog
   looks like the design it belongs to without the designs having to agree on
   token names. They do not: every one of the 30 names its colours differently.
   Everything else here is drawn from currentColor, so it adapts on its own. */
const BLOG_CSS = `
/* --acc is what the thirty catalog designs call their accent; the Starter calls
   it --accent. One alias, inherited by everything inside, covers both. */
.sw-blog{--sw-acc:var(--acc,var(--accent,currentColor));max-width:748px;margin:0 auto;padding:clamp(52px,8vw,104px) clamp(18px,5vw,44px);}
.sw-blog--wide{max-width:980px;}
.sw-blog__eyebrow{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--sw-acc);}
.sw-blog__h1{font-size:clamp(33px,5.2vw,54px);line-height:1.07;margin:16px 0 0;}
.sw-blog__lede{font-size:clamp(17px,1.7vw,20px);line-height:1.6;margin:18px 0 0;opacity:.78;max-width:60ch;}
.sw-blog__rule{height:1px;background:currentColor;opacity:.14;margin:clamp(34px,5vw,54px) 0;border:0;}
.sw-blog__meta{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:26px;font-size:14.5px;opacity:.72;}
.sw-blog__meta b{font-weight:600;opacity:1;}
.sw-blog__dot{opacity:.5;}

.sw-blog__list{display:grid;gap:18px;margin:0;padding:0;list-style:none;}
.sw-post-card{display:block;padding:clamp(22px,3vw,32px);border:1px solid;border-color:color-mix(in srgb,currentColor 16%,transparent);border-radius:18px;color:inherit;text-decoration:none;transition:border-color .25s ease,transform .25s ease,background-color .25s ease;}
.sw-post-card:hover{border-color:var(--sw-acc);transform:translateY(-2px);background-color:color-mix(in srgb,var(--sw-acc) 6%,transparent);}
.sw-post-card__kicker{font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--sw-acc);}
.sw-post-card__title{font-size:clamp(22px,2.7vw,30px);line-height:1.18;margin:12px 0 0;}
.sw-post-card__dek{margin:12px 0 0;font-size:16px;line-height:1.62;opacity:.76;}
.sw-post-card__more{display:inline-flex;align-items:center;gap:8px;margin-top:18px;font-size:14.5px;font-weight:600;color:var(--sw-acc);}
.sw-post-card__more svg{width:15px;height:15px;}

.sw-prose{font-size:17px;line-height:1.72;}
.sw-prose > p{margin:0 0 1.15em;}
.sw-prose h2{font-size:clamp(23px,2.8vw,31px);line-height:1.2;margin:2em 0 .6em;}
.sw-prose h2:first-child{margin-top:0;}
.sw-prose strong{font-weight:600;}

.sw-blog__back{display:inline-flex;align-items:center;gap:9px;margin-bottom:clamp(26px,3vw,38px);font-size:14.5px;font-weight:600;color:var(--sw-acc);text-decoration:none;}
.sw-blog__back svg{width:16px;height:16px;}
.sw-blog__back:hover{text-decoration:underline;}

.sw-cta{margin-top:clamp(40px,6vw,64px);padding:clamp(26px,4vw,40px);border-radius:20px;background:color-mix(in srgb,var(--sw-acc) 9%,transparent);border:1px solid;border-color:color-mix(in srgb,var(--sw-acc) 22%,transparent);}
.sw-cta__title{font-size:clamp(22px,2.6vw,29px);line-height:1.2;margin:0;}
.sw-cta__text{margin:12px 0 0;font-size:16px;line-height:1.62;opacity:.8;}
.sw-cta__btn{display:inline-flex;align-items:center;justify-content:center;margin-top:22px;padding:14px 26px;border-radius:100px;background:var(--sw-acc);color:var(--on,#fff);font-size:15px;font-weight:600;line-height:1.2;text-decoration:none;transition:filter .25s ease,transform .25s ease;}
.sw-cta__btn:hover{filter:brightness(.92);transform:translateY(-2px);}
`.trim();

const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const BACK_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';

/* ---- the starter post ------------------------------------------------------
   One article ships with every design, and it is deliberately the same one:
   what happens at a first appointment is the question that keeps people from
   calling, and it is answerable without knowing anything about a particular
   practice. Nothing in it is a clinical claim, a statistic or an outcome, so no
   practice has to fact-check it before publishing, only put its own details in.
   Everything is data-field tagged, so the Studio edits it like any other page. */
function postCopy(d) {
  const brand = d.practice;
  return {
    section: 'Getting started',
    title: 'What To Expect At A First Appointment',
    dek: 'Not knowing what happens in the room is one of the reasons people put off calling. Here is the shape of a first appointment, start to finish.',
    intro: 'If you have never done this before, the first appointment is the part that is hardest to picture. It helps to know that it is mostly a conversation, that you are not expected to have your thoughts in order, and that nothing is decided before you are ready.',
    sections: [
      { h: 'Before You Come In', p: 'We send the paperwork ahead of time so you are not filling in forms in a waiting room. It asks for your contact details, your insurance if you are using it, and who we should call in an emergency. Bring a photo ID and your insurance card if you have one. If you are meeting by video, test the link the day before so a login is not the first thing you deal with.' },
      { h: 'The First Conversation', p: 'Most of the first appointment is listening. You will be asked what brought you in, what you have already tried, and what you would like to be different. There is no right way to answer. If a question is one you would rather not take on yet, say so and we move past it. You set the pace, in the first appointment and after it.' },
      { h: 'What You Decide Together', p: 'By the end you should leave with a plan you understand: how often you would meet, roughly what the work would focus on, and what it costs. None of that is locked in. People change direction once they get going, and bringing that up is part of the work rather than an interruption to it.' },
      { h: 'If It Is Not The Right Fit', p: 'Sometimes it is not, and that is worth saying out loud rather than quietly not booking again. Tell us and we will help you look elsewhere. Finding the right person matters more than filling our calendar, and we would rather make an introduction than lose you to a bad first try.' }
    ],
    close: 'If a question is in the way of booking, call or send a message and a person will answer. Please keep health details out of the form, we will cover those with you in the appointment.',
    ctaTitle: 'Book A First Appointment',
    ctaText: 'Send a message or call ' + brand + ' and we will go from there.',
    ctaBtn: 'Get in touch'
  };
}

function blogCopy() {
  return {
    eyebrow: 'From the practice',
    title: 'Notes And Updates',
    sub: 'Short, practical writing for people deciding whether to reach out, and for the ones already working with us.'
  };
}

/* ---- page assembly --------------------------------------------------------- */

// Anchors inside a nav or footer point at sections of the home page. On the blog
// they have to go back to it first, or they are links to nothing.
function rehome(block, mainHref) {
  return block
    .replace(/href="#"/g, 'href="' + mainHref + '"')
    .replace(/href="#([A-Za-z][\w-]*)"/g, 'href="' + mainHref + '#$1"');
}

/* One design draws an icon beside every nav link, so a bare Blog link would be
   the only one without one. Reuse the neighbour's own <svg> opening tag, which
   is where that design's sizing and stroke come from, and give it a document
   outline. The path is drawn for stroke rather than fill, which is how the one
   design that does this styles its icons. */
const BLOG_ICON_PATH = '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 13h6M10 17h4"/>';

/* Add a Blog link beside the links a nav already has.

   Appending to the <nav> itself drops the link outside the list in the designs
   that wrap their links in a panel, and appending after the nav's last anchor
   puts it in the phone-number block at the bottom of a menu overlay. So find
   the run of anchors that sit directly next to each other with nothing but
   whitespace between them, which is what a list of nav links looks like and
   what a contact block never does, and join the longest one. */
function addNavLink(block, href) {
  if (block.indexOf('data-sw-bloglink') >= 0) return block;
  return block.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/g, nav => {
    const anchors = [...nav.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)];
    if (anchors.length < 2) return nav;
    let runs = [[anchors[0]]];
    for (let i = 1; i < anchors.length; i++) {
      const prev = anchors[i - 1];
      const gap = nav.slice(prev.index + prev[0].length, anchors[i].index);
      if (/^\s*$/.test(gap)) runs[runs.length - 1].push(anchors[i]);
      else runs.push([anchors[i]]);
    }
    const run = runs.reduce((a, b) => (b.length > a.length ? b : a), runs[0]);
    if (run.length < 2) return nav;
    const last = run[run.length - 1];
    const svgOpen = /<svg\b[^>]*>/.exec(last[0]);
    const icon = svgOpen ? svgOpen[0] + BLOG_ICON_PATH + '</svg>' : '';
    const sep = /\n/.test(nav.slice(run[0].index + run[0][0].length, run[1].index)) ? '\n      ' : '';
    const link = sep + '<a href="' + href + '" data-sw-bloglink>' + icon + 'Blog</a>';
    const at = last.index + last[0].length;
    return nav.slice(0, at) + link + nav.slice(at);
  });
}

/* Take out any Blog link a previous run added, so a run can put a corrected one
   back. Without this the only way to change the link was to restore the
   templates from git, which is not safe in a checkout other people are editing. */
function stripNavLinks(block) {
  return block
    .replace(/\s*<li[^>]*>\s*<a[^>]*data-sw-bloglink[^>]*>[\s\S]*?<\/a>\s*<\/li>/g, '')
    .replace(/\s*<a[^>]*data-sw-bloglink[^>]*>[\s\S]*?<\/a>/g, '');
}

function addFooterLink(block, href) {
  if (block.indexOf('data-sw-bloglink') >= 0) return block;
  const m = /<ul\b[^>]*>[\s\S]*?<\/ul>/.exec(block);
  if (!m) return block;
  const ul = m[0].replace(/<\/ul>$/, '<li><a href="' + href + '" data-sw-bloglink>Blog</a></li></ul>');
  return block.slice(0, m.index) + ul + block.slice(m.index + m[0].length);
}

function buildPages(d, src, base) {
  const have = fieldsIn(src);
  const mainHref = base + '.html';
  const blogHref = base + '-blog.html';
  const postHref = base + '-post.html';

  const headM = /<head[^>]*>([\s\S]*?)<\/head>/.exec(src);
  const htmlTagM = /<html[^>]*>/.exec(src);
  const bodyOpenM = /<body[^>]*>/.exec(src);
  if (!headM || !htmlTagM || !bodyOpenM) throw new Error('unexpected document shape');

  // The head, minus the bits each page states for itself.
  let head = headM[1]
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/i, '')
    .replace(/<!-- sw:jsonld -->[\s\S]*?<!-- \/sw:jsonld -->\s*/, '')
    .replace(/<script[^>]*id="sw-jsonld"[\s\S]*?<\/script>\s*/, '')
    .trim();

  const bodyStart = bodyOpenM.index + bodyOpenM[0].length;
  const body = src.slice(bodyStart);
  const hd = balanced(body, 'header', false);
  const ft = balanced(body, 'footer', true);
  if (!hd || !ft) throw new Error('no header or footer');

  // Everything down to the first section is page furniture: the header itself,
  // plus the notice bars, menu overlays and page wrappers that sit around it.
  const afterHeader = body.slice(hd.end);
  const firstSection = afterHeader.search(/<(main|section)\b/);
  let prefix = body.slice(0, hd.end) + (firstSection < 0 ? '' : afterHeader.slice(0, firstSection));
  // From the page footer to the end of the body, which carries the FrontDoor
  // ribbon, the shared script, and any wrapper the prefix opened.
  let suffix = body.slice(ft.start).replace(/<\/body>[\s\S]*$/i, '').trim();

  prefix = addNavLink(stripNavLinks(rehome(prefix, mainHref)), blogHref);
  suffix = addFooterLink(stripNavLinks(rehome(suffix, mainHref)), blogHref);

  let htmlTag = htmlTagM[0];
  htmlTag = setAttr(htmlTag, 'data-sw-type', d.schemaType);
  htmlTag = setAttr(htmlTag, 'data-sw-specialty', d.specialty);
  if (!/data-site-url=/.test(htmlTag)) htmlTag = setAttr(htmlTag, 'data-site-url', '');

  const bodyOpen = bodyOpenM[0];
  const brand = have.brandName || d.practice;

  function page(opts) {
    const tag = setAttr(setAttr(htmlTag, 'data-sw-page', opts.page), 'data-sw-href', opts.exportHref);
    const jsonld = SEO.build(Object.assign({
      page: opts.page,
      schemaType: d.schemaType,
      specialty: d.specialty,
      siteUrl: '',
      brandName: brand,
      phone: have.phone, email: have.email, address: have.address, hours: have.hours,
      description: opts.desc
    }, opts.data));
    return tag + '\n<head>\n'
      + '<title>' + esc(opts.title) + '</title>\n'
      + '<meta name="description" content="' + esc(opts.desc) + '">\n'
      + head + '\n'
      + '<style>\n' + BLOG_CSS + '\n</style>\n'
      + '<!-- sw:jsonld -->\n<script type="application/ld+json" id="sw-jsonld">\n'
      + SEO.serialize(jsonld) + '\n</script>\n<!-- /sw:jsonld -->\n'
      + '</head>\n' + bodyOpen + '\n' + prefix + '\n'
      + opts.main + '\n' + suffix + '\n</body>\n</html>\n';
  }

  // ---- blog index ----
  const bc = blogCopy();
  const pc = postCopy(d);
  const blogMain = '<main id="main" tabindex="-1" class="sw-blog sw-blog--wide">\n'
    + '  <span class="sw-blog__eyebrow" data-field="blogEyebrow">' + esc(bc.eyebrow) + '</span>\n'
    + '  <h1 class="sw-blog__h1" data-field="blogTitle">' + esc(bc.title) + '</h1>\n'
    + '  <p class="sw-blog__lede" data-field="blogSub">' + esc(bc.sub) + '</p>\n'
    + '  <hr class="sw-blog__rule">\n'
    + '  <ul class="sw-blog__list">\n'
    + '    <li>\n'
    + '      <a class="sw-post-card" href="' + postHref + '" data-post="1" data-post-date="' + POST_DATE + '">\n'
    + '        <span class="sw-post-card__kicker" data-field="post1Kicker">' + esc(pc.section) + '</span>\n'
    + '        <h2 class="sw-post-card__title" data-field="post1Title">' + esc(pc.title) + '</h2>\n'
    + '        <p class="sw-post-card__dek" data-field="post1Dek">' + esc(pc.dek) + '</p>\n'
    + '        <span class="sw-post-card__more">Read it ' + ARROW + '</span>\n'
    + '      </a>\n'
    + '    </li>\n'
    + '    <!-- To add a post: copy ' + postHref + ' to a new file, edit it, then copy the\n'
    + '         <li> above, point its href at the new file and change data-post to 2.\n'
    + '         The schema on this page is rebuilt from these cards, so nothing else\n'
    + '         needs updating. -->\n'
    + '  </ul>\n'
    + '</main>';

  const blogPage = page({
    page: 'blog', exportHref: 'blog.html',
    title: bc.title + ', ' + brand,
    desc: 'Practical writing from ' + brand + ' on getting started, what to expect and how we work.',
    main: blogMain,
    data: {
      blogTitle: bc.title, blogSub: bc.sub,
      posts: [{ title: pc.title, dek: pc.dek, date: POST_DATE, href: 'post.html' }]
    }
  });

  // ---- post ----
  const dateText = 'November 6, 2026';
  const author = have.quoteAuthor || brand;
  const role = have.quoteRole || '';
  let prose = '  <div class="sw-prose">\n'
    + '    <p data-field="postIntro">' + esc(pc.intro) + '</p>\n';
  pc.sections.forEach((s, i) => {
    prose += '    <h2 data-field="postH' + (i + 1) + '">' + esc(s.h) + '</h2>\n'
      + '    <p data-field="postP' + (i + 1) + '">' + esc(s.p) + '</p>\n';
  });
  prose += '    <p data-field="postClose">' + esc(pc.close) + '</p>\n  </div>';

  const postMain = '<main id="main" tabindex="-1" class="sw-blog">\n'
    + '  <a class="sw-blog__back" href="' + blogHref + '">' + BACK_ARROW + 'All posts</a>\n'
    + '  <article>\n'
    + '    <header>\n'
    + '      <span class="sw-blog__eyebrow" data-field="postSection">' + esc(pc.section) + '</span>\n'
    + '      <h1 class="sw-blog__h1" data-field="postTitle">' + esc(pc.title) + '</h1>\n'
    + '      <p class="sw-blog__lede" data-field="postDek">' + esc(pc.dek) + '</p>\n'
    + '      <p class="sw-blog__meta" data-post-date="' + POST_DATE + '">'
    + '<b data-field="postAuthor">' + esc(author) + '</b>'
    + (role ? '<span class="sw-blog__dot">&middot;</span><span data-field="postRole">' + esc(role) + '</span>' : '')
    + '<span class="sw-blog__dot">&middot;</span><time datetime="' + POST_DATE + '" data-field="postDate">' + esc(dateText) + '</time></p>\n'
    + '    </header>\n'
    + '    <hr class="sw-blog__rule">\n'
    + prose + '\n'
    + '    <aside class="sw-cta">\n'
    + '      <h2 class="sw-cta__title" data-field="postCtaTitle">' + esc(pc.ctaTitle) + '</h2>\n'
    + '      <p class="sw-cta__text" data-field="postCtaText">' + esc(pc.ctaText) + '</p>\n'
    + '      <a class="sw-cta__btn" href="' + mainHref + '#contact" data-field="postCtaBtn">' + esc(pc.ctaBtn) + '</a>\n'
    + '    </aside>\n'
    + '  </article>\n'
    + '</main>';

  const postPage = page({
    page: 'post', exportHref: 'post.html',
    title: pc.title + ', ' + brand,
    desc: pc.dek,
    main: postMain,
    data: {
      postTitle: pc.title, postDek: pc.dek, postDate: POST_DATE,
      postAuthor: author, postRole: role, postSection: pc.section,
      postHref: 'post.html', blogTitle: bc.title, blogSub: bc.sub
    }
  });

  return { blogPage, postPage, have, blogHref, postHref };
}

/* ---- the home page's own schema + blog links -------------------------------- */

function instrument(d, src, base, have) {
  const blogHref = base + '-blog.html';
  let out = src;

  // <html> carries the schema type, the specialty and the client's domain, so
  // the Studio can rebuild the graph from the page alone.
  out = out.replace(/<html[^>]*>/, tag => {
    tag = setAttr(tag, 'data-sw-type', d.schemaType);
    tag = setAttr(tag, 'data-sw-specialty', d.specialty);
    tag = setAttr(tag, 'data-sw-page', 'home');
    if (!/data-site-url=/.test(tag)) tag = setAttr(tag, 'data-site-url', '');
    return tag;
  });

  const descM = /<meta\s+name="description"\s+content="([^"]*)"/i.exec(out);
  const graph = SEO.build({
    page: 'home',
    schemaType: d.schemaType, specialty: d.specialty, siteUrl: '',
    brandName: have.brandName || d.practice,
    description: descM ? txt(descM[1]) : '',
    heroSub: have.heroSub,
    phone: have.phone, email: have.email, address: have.address, hours: have.hours,
    servicesTitle: have.servicesTitle,
    svc1Title: have.svc1Title, svc1Desc: have.svc1Desc,
    svc2Title: have.svc2Title, svc2Desc: have.svc2Desc,
    svc3Title: have.svc3Title, svc3Desc: have.svc3Desc,
    svc4Title: have.svc4Title, svc4Desc: have.svc4Desc,
    svc5Title: have.svc5Title, svc5Desc: have.svc5Desc,
    svc6Title: have.svc6Title, svc6Desc: have.svc6Desc,
    faq1Q: have.faq1Q, faq1A: have.faq1A, faq2Q: have.faq2Q, faq2A: have.faq2A,
    faq3Q: have.faq3Q, faq3A: have.faq3A, faq4Q: have.faq4Q, faq4A: have.faq4A,
    faq5Q: have.faq5Q, faq5A: have.faq5A
  });

  out = upsert(out, 'jsonld',
    '<script type="application/ld+json" id="sw-jsonld">\n' + SEO.serialize(graph) + '\n</script>',
    '</head>');

  // Blog link in the nav and in the footer's link list.
  const bodyStart = /<body[^>]*>/.exec(out);
  const body = out.slice(bodyStart.index + bodyStart[0].length);
  let newBody = stripNavLinks(body);
  const ft2 = balanced(newBody, 'footer', true);
  const hd2 = balanced(newBody, 'header', false);
  if (ft2) {
    const block = addFooterLink(newBody.slice(ft2.start, ft2.end), blogHref);
    newBody = newBody.slice(0, ft2.start) + block + newBody.slice(ft2.end);
  }
  if (hd2) {
    const block = addNavLink(newBody.slice(hd2.start, hd2.end), blogHref);
    newBody = newBody.slice(0, hd2.start) + block + newBody.slice(hd2.end);
  }
  // Designs that keep their menu outside the header still get the link.
  if (!/data-sw-bloglink/.test(newBody)) newBody = addNavLink(newBody, blogHref);

  return out.slice(0, bodyStart.index + bodyStart[0].length) + newBody;
}

/* ---- run -------------------------------------------------------------------- */

const report = [];
let wrote = 0;

/* The Studio's Starter is not in the public catalog, so it has no entry to read
   a practice area from, but it is the template the Studio opens on and the one
   a client most often starts from. It gets the same treatment as the thirty,
   with the broadest honest pair of values: a behavioral health business, with
   no claim about which discipline. */
const STARTER = {
  id: 'starter', name: 'Starter', practice: 'Your Practice',
  area: 'counseling', file: 'studio/editable-practice.html'
};

[].concat(DESIGNS, [STARTER]).forEach(design => {
  const map = SCHEMA[design.area];
  if (!map) { console.warn('no schema mapping for area ' + design.area + ' (' + design.id + '), skipped'); return; }
  const d = Object.assign({}, design, { schemaType: map.type, specialty: map.specialty });

  const file = path.join(ROOT, d.file);
  const src = fs.readFileSync(file, 'utf8');
  const base = path.basename(d.file, '.html');
  const dir = path.dirname(file);

  const built = buildPages(d, src, base);
  const home = instrument(d, src, base, built.have);

  fs.writeFileSync(file, home);
  fs.writeFileSync(path.join(dir, base + '-blog.html'), built.blogPage);
  fs.writeFileSync(path.join(dir, base + '-post.html'), built.postPage);
  wrote += 3;

  report.push({
    id: d.id, name: d.name, area: AREA_NAME[d.area], type: d.schemaType, specialty: d.specialty,
    blog: path.join(path.dirname(d.file), base + '-blog.html'),
    post: path.join(path.dirname(d.file), base + '-post.html'),
    faqs: ['faq1Q', 'faq2Q', 'faq3Q'].filter(k => built.have[k]).length
  });
});

console.log('designs processed: ' + report.length + ', files written: ' + wrote);
const byType = {};
report.forEach(r => { const k = r.type + ' / ' + r.specialty; byType[k] = (byType[k] || 0) + 1; });
Object.keys(byType).forEach(k => console.log('  ' + k + ': ' + byType[k]));
console.log('with FAQ schema: ' + report.filter(r => r.faqs).length);
fs.writeFileSync(path.join(ROOT, 'js/blog-pages.json'), JSON.stringify(
  report.reduce((a, r) => { a[r.id] = { blog: r.blog, post: r.post }; return a; }, {}), null, 2) + '\n');

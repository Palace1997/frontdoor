/* FrontDoor, structured data builder.
   One implementation, used twice: tools-build-seo.js calls build() to write the
   static <script type="application/ld+json"> into every template, and the Studio
   calls sync() on the live preview document just before export, so a client's
   own name, phone, address and services end up in the schema instead of the
   demo wording.

   Nothing here invents a value. A field the practice has not filled in is left
   out of the graph rather than guessed at, because a wrong telephone number in
   schema is worse than no telephone number at all.

   Runs in Node (require) and in the browser (window.SW_SEO). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SW_SEO = factory();
}(typeof self !== 'undefined' ? self : this, function () {

  /* ---- helpers ---------------------------------------------------------- */

  var clean = function (s) {
    return String(s == null ? '' : s)
      .replace(/\s+/g, ' ')
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .trim();
  };

  // Drop empty strings, empty arrays and empty objects from a node.
  function prune(o) {
    if (Array.isArray(o)) {
      var a = o.map(prune).filter(function (v) { return v !== undefined; });
      return a.length ? a : undefined;
    }
    if (o && typeof o === 'object') {
      var out = {}, any = false;
      for (var k in o) {
        if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
        var v = prune(o[k]);
        if (v === undefined) continue;
        out[k] = v; if (k !== '@type' && k !== '@id') any = true;
      }
      return any ? out : undefined;
    }
    if (typeof o === 'string') { var s = clean(o); return s ? s : undefined; }
    return o === undefined || o === null ? undefined : o;
  }

  // Absolute URL, or undefined. Relative and placeholder values are not URLs.
  function absUrl(u) {
    u = clean(u);
    if (!u) return undefined;
    if (!/^https?:\/\//i.test(u)) {
      if (!/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(\/|$)/i.test(u)) return undefined;
      u = 'https://' + u;
    }
    if (/example\.(com|org|net)|yourdomain|your-domain|localhost|127\.0\.0\.1/i.test(u)) return undefined;
    return u.replace(/\/+$/, '');
  }

  /* A telephone only goes in when it reads as one. The demo templates carry 555
     numbers and .example addresses, which are the ranges reserved for fiction,
     and those do ship in the demo schema on purpose: the whole point is that the
     field is wired, and the page says in its own footer that the practice is
     made up. A client's real number replaces it on export. */
  function phone(p) {
    p = clean(p);
    if (!p) return undefined;
    return p.replace(/[^0-9]/g, '').length >= 7 ? p : undefined;
  }

  function email(e) {
    e = clean(e);
    return /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(e) ? e : undefined;
  }

  var STATES = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND '
    + 'OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC PR').split(' ');

  /* The address field is free text, because a telehealth-only practice types
     something like "Online, statewide" into it. Split it into postal parts only
     when it really reads as a street address: a leading street number and a
     state at the end. Anything else is kept as a plain string, which schema.org
     allows, instead of being forced into a PostalAddress that would be wrong. */
  function address(a) {
    a = clean(a).replace(/&nbsp;/g, ' ');
    if (!a) return undefined;
    var parts = a.split(',').map(clean).filter(Boolean);
    if (parts.length < 2 || !/^\d/.test(parts[0])) return a;

    var last = parts[parts.length - 1], region, postal, locality;
    var m = /^([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/.exec(last);
    if (m && STATES.indexOf(m[1].toUpperCase()) >= 0) { region = m[1].toUpperCase(); postal = m[2]; parts.pop(); }
    else if (/^[A-Za-z]{2}$/.test(last) && STATES.indexOf(last.toUpperCase()) >= 0) { region = last.toUpperCase(); parts.pop(); }
    else if (/^\d{5}(-\d{4})?$/.test(last)) { postal = last; parts.pop(); }
    if (!region && !postal) return a;
    if (parts.length > 1) locality = parts.pop();
    return {
      '@type': 'PostalAddress',
      streetAddress: parts.join(', '),
      addressLocality: locality,
      addressRegion: region,
      postalCode: postal,
      addressCountry: 'US'
    };
  }

  /* Opening hours are typed the way the practice would say them on the phone,
     so they only become openingHoursSpecification when the whole string parses.
     A half-understood schedule is dropped: it is the kind of thing that puts a
     wrong "Closed" next to a practice in a search result. */
  var DAYS = { mon: 'Monday', tue: 'Tuesday', tues: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', thur: 'Thursday', thurs: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
  var DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  function day(tok) { return DAYS[clean(tok).toLowerCase().replace(/[^a-z]/g, '').slice(0, 5)] || DAYS[clean(tok).toLowerCase().slice(0, 3)]; }

  function time24(t) {
    var m = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i.exec(clean(t).replace(/\./g, ''));
    if (!m) return null;
    var h = parseInt(m[1], 10), min = m[2] || '00', ap = m[3].toLowerCase();
    if (h < 1 || h > 12) return null;
    if (ap === 'pm' && h !== 12) h += 12;
    if (ap === 'am' && h === 12) h = 0;
    return (h < 10 ? '0' + h : h) + ':' + min;
  }

  function hours(h) {
    h = clean(h).replace(/&ndash;|&mdash;/g, '-').replace(/[–—]/g, '-');
    if (!h) return undefined;
    var out = [];
    var chunks = h.split(/[,.;]| and /i).map(clean).filter(Boolean);
    for (var i = 0; i < chunks.length; i++) {
      var c = chunks[i];
      var m = /^([A-Za-z]{3,9})\s*(?:-|to|through|–)\s*([A-Za-z]{3,9})\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm))\s*(?:-|to|until|–)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm))$/i.exec(c);
      var days;
      if (m) {
        var a = day(m[1]), b = day(m[2]);
        if (!a || !b) return undefined;
        var ia = DAY_ORDER.indexOf(a), ib = DAY_ORDER.indexOf(b);
        if (ia < 0 || ib < 0 || ib < ia) return undefined;
        days = DAY_ORDER.slice(ia, ib + 1);
      } else {
        m = /^([A-Za-z]{3,9})\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm))\s*(?:-|to|until|–)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm))$/i.exec(c);
        if (!m) return undefined;
        var d1 = day(m[1]);
        if (!d1) return undefined;
        days = [d1];
        m = [m[0], m[1], m[1], m[2], m[3]];
      }
      var opens = time24(m[3]), closes = time24(m[4]);
      if (!opens || !closes) return undefined;
      out.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens: opens, closes: closes });
    }
    return out.length ? out : undefined;
  }

  /* ---- the graph --------------------------------------------------------- */

  var SPECIALTY_BASE = 'https://schema.org/';

  // What each service card offers, as an OfferCatalog. This is the part an AI
  // assistant reads to answer "does this practice do couples work?".
  function offerCatalog(d, provider) {
    var items = [];
    for (var n = 1; n <= 6; n++) {
      var t = clean(d['svc' + n + 'Title']);
      if (!t) continue;
      items.push({
        '@type': 'Offer',
        itemOffered: prune({ '@type': 'Service', name: t, description: clean(d['svc' + n + 'Desc']), provider: provider })
      });
    }
    if (!items.length) return undefined;
    return { '@type': 'OfferCatalog', name: clean(d.servicesTitle) || 'Services', itemListElement: items };
  }

  function faqPage(d) {
    var qs = [];
    for (var n = 1; n <= 6; n++) {
      var q = clean(d['faq' + n + 'Q']), a = clean(d['faq' + n + 'A']);
      if (!q || !a) continue;
      qs.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } });
    }
    if (!qs.length) return undefined;
    return { '@type': 'FAQPage', mainEntity: qs };
  }

  // The practice itself. Every other node on every other page points back here.
  function practiceNode(d) {
    var site = absUrl(d.siteUrl);
    var id = site ? site + '/#practice' : undefined;
    var ref = id ? { '@id': id } : undefined;
    var node = {
      '@type': d.schemaType || 'MedicalBusiness',
      '@id': id,
      name: clean(d.brandName),
      description: clean(d.description) || clean(d.heroSub),
      url: site || undefined,
      telephone: phone(d.phone),
      email: email(d.email),
      address: address(d.address),
      image: absUrl(d.image),
      medicalSpecialty: d.specialty ? SPECIALTY_BASE + d.specialty : undefined,
      openingHoursSpecification: hours(d.hours),
      hasOfferCatalog: offerCatalog(d, ref || { '@type': (d.schemaType || 'MedicalBusiness'), name: clean(d.brandName) })
    };
    if (!node.name) return undefined;
    return node;
  }

  /* page: 'home' | 'blog' | 'post' */
  function build(d) {
    d = d || {};
    var site = absUrl(d.siteUrl);
    var practice = practiceNode(d);
    if (!practice) return null;
    var pref = practice['@id'] ? { '@id': practice['@id'] } : { '@type': practice['@type'], name: practice.name };
    var graph = [];

    if (d.page === 'blog' || d.page === 'post') {
      var blogUrl = site ? site + '/blog.html' : undefined;
      var blogNode = {
        '@type': 'Blog',
        '@id': blogUrl ? blogUrl + '#blog' : undefined,
        name: clean(d.blogTitle) || (practice.name ? practice.name + ' Blog' : undefined),
        description: clean(d.blogSub),
        url: blogUrl,
        publisher: pref,
        inLanguage: 'en-US'
      };
      if (d.page === 'blog') {
        var posts = (d.posts || []).map(function (p) {
          return prune({
            '@type': 'BlogPosting',
            headline: clean(p.title),
            description: clean(p.dek),
            datePublished: clean(p.date),
            url: site && p.href ? site + '/' + String(p.href).replace(/^\.\//, '') : undefined,
            author: clean(p.author) ? { '@type': 'Person', name: clean(p.author) } : pref,
            publisher: pref
          });
        }).filter(Boolean);
        if (posts.length) blogNode.blogPost = posts;
        graph.push(blogNode, practice);
      } else {
        var postUrl = site && d.postHref ? site + '/' + String(d.postHref).replace(/^\.\//, '') : undefined;
        graph.push(prune({
          '@type': 'BlogPosting',
          '@id': postUrl ? postUrl + '#post' : undefined,
          mainEntityOfPage: postUrl ? { '@type': 'WebPage', '@id': postUrl } : undefined,
          headline: clean(d.postTitle),
          description: clean(d.postDek),
          datePublished: clean(d.postDate),
          dateModified: clean(d.postModified) || clean(d.postDate),
          articleSection: clean(d.postSection),
          author: clean(d.postAuthor) ? { '@type': 'Person', name: clean(d.postAuthor), jobTitle: clean(d.postRole) } : pref,
          publisher: pref,
          isPartOf: blogNode['@id'] ? { '@id': blogNode['@id'] } : prune(blogNode),
          inLanguage: 'en-US'
        }), practice);
      }
    } else {
      graph.push(practice);
      if (site) graph.push({ '@type': 'WebSite', '@id': site + '/#website', url: site, name: practice.name, publisher: pref, inLanguage: 'en-US' });
      var faq = faqPage(d);
      if (faq) graph.push(faq);
    }

    var g = prune(graph) || [];
    return { '@context': 'https://schema.org', '@graph': g };
  }

  function serialize(graph) { return graph ? JSON.stringify(graph, null, 2) : ''; }

  /* ---- browser side ------------------------------------------------------ */

  // Read the practice's own values straight out of the page, so the schema can
  // never drift from what a visitor reads.
  function fromDoc(doc, page) {
    var get = function (id) {
      var el = doc.querySelector('[data-field="' + id + '"]');
      if (!el) return '';
      if (el.hasAttribute('data-empty')) return '';
      return clean(el.textContent);
    };
    var html = doc.documentElement, body = doc.body;
    var d = {
      page: page || html.getAttribute('data-sw-page') || 'home',
      schemaType: html.getAttribute('data-sw-type') || 'MedicalBusiness',
      specialty: html.getAttribute('data-sw-specialty') || '',
      siteUrl: html.getAttribute('data-site-url') || '',
      brandName: get('brandName'),
      phone: get('phone'),
      email: get('email'),
      address: get('address'),
      hours: get('hours'),
      heroSub: get('heroSub'),
      servicesTitle: get('servicesTitle'),
      blogTitle: get('blogTitle'),
      blogSub: get('blogSub'),
      postTitle: get('postTitle'),
      postDek: get('postDek'),
      postDate: (doc.querySelector('[data-post-date]') || {}).getAttribute ? doc.querySelector('[data-post-date]').getAttribute('data-post-date') : '',
      postAuthor: get('postAuthor'),
      postRole: get('postRole'),
      postSection: get('postSection'),
      postHref: html.getAttribute('data-sw-href') || ''
    };
    var meta = doc.querySelector('meta[name="description"]');
    d.description = meta ? clean(meta.getAttribute('content')) : '';
    var heroImg = doc.querySelector('[data-img="hero"]') || doc.querySelector('img');
    d.image = heroImg ? heroImg.getAttribute('src') : '';
    for (var n = 1; n <= 6; n++) {
      d['svc' + n + 'Title'] = get('svc' + n + 'Title');
      d['svc' + n + 'Desc'] = get('svc' + n + 'Desc');
      d['faq' + n + 'Q'] = get('faq' + n + 'Q');
      d['faq' + n + 'A'] = get('faq' + n + 'A');
    }
    if (d.page === 'blog') {
      d.posts = [];
      Array.prototype.forEach.call(doc.querySelectorAll('[data-post]'), function (card) {
        if (card.getAttribute('data-empty') === '1') return;
        var pick = function (f) { var e = card.querySelector('[data-field="' + f + '"]'); return e ? clean(e.textContent) : ''; };
        var k = card.getAttribute('data-post');
        var link = card.matches('a') ? card : card.querySelector('a[href]');
        d.posts.push({
          title: pick('post' + k + 'Title'), dek: pick('post' + k + 'Dek'),
          date: card.getAttribute('data-post-date') || '',
          href: link ? link.getAttribute('href') : ''
        });
      });
    }
    if (body && body.getAttribute('data-sw-page')) d.page = body.getAttribute('data-sw-page');
    return d;
  }

  // Rewrite the page's own <script type="application/ld+json"> in place.
  function sync(doc, page) {
    var graph = build(fromDoc(doc, page));
    var tag = doc.getElementById('sw-jsonld');
    if (!graph) { if (tag) tag.parentNode.removeChild(tag); return null; }
    if (!tag) {
      tag = doc.createElement('script');
      tag.type = 'application/ld+json';
      tag.id = 'sw-jsonld';
      (doc.head || doc.documentElement).appendChild(tag);
    }
    tag.textContent = '\n' + serialize(graph) + '\n';
    return graph;
  }

  return { build: build, serialize: serialize, fromDoc: fromDoc, sync: sync, address: address, hours: hours, phone: phone, email: email };
}));

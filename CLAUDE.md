# FrontDoor (repo: frontdoor, formerly sitewell-studio)

FrontDoor is a web studio by iTrust Insights. This repo is the marketing site plus 30 demo templates for behavioral health practices. The brand was renamed from SiteWell Studio to FrontDoor. Some file names and commits still say SiteWell.

Live site: https://palace1997.github.io/frontdoor/

## Stack and deploy

- Plain HTML, CSS, and JavaScript. No framework, no bundler, no build step for pages.
- Hosted on GitHub Pages from `main`. `.nojekyll` is in the root. Every push to `main` goes live, so check before you push.
- Local preview: `python3 server.py` from the repo root, then open http://localhost:4787/index.html. On a Mac you can double-click `Start SiteWell.command`, which does the same and frees the port first. The server handles one request at a time, so open one page at a time and expect a gallery full of iframes to load slowly.
- Cache busting: pages load CSS and JS with a `?v=` suffix. Bump it on every page that loads a file you changed, or browsers keep the old copy. Template iframes are busted by `window.SW_TPL_V` in `js/catalog.js`.
- `tools-build-seo.js` (run `node tools-build-seo.js`) edits each of the 30 catalogued designs in place, adding structured data and Blog links, and writes `<design>-blog.html` and `<design>-post.html` beside it plus `js/blog-pages.json`. The blog and post pages copy each design's `<style>` block, so after changing a design's CSS, re-run it to keep those copies in step. It is safe to run twice.
- `tools-build-forms.js` writes `forms/<design>.html` and `forms/index.html`. It does not run as it stands: it has John's Mac path hard-coded and reads `/tmp/groups.json`, which is not in the repo. Fix both before using it.
- `studio/` and `forms/` are internal team tools. Do not link them from public nav.

## Two design systems. Do not mix them.

**1. Site pages** (index, gallery, brand, mental-health-sectors, and other FrontDoor pages) use `css/main.css`.

- Navy `--navy #112746`, `--navy-2 #0A1B33`
- Blue `--blue #1C6FB0` (CTAs, accents), `--blue-600 #15578C` (hover)
- Sky `--sky #52BEEB` (from the logo)
- Warm neutrals: `--canvas #F7F4EE`, `--paper-2 #EFE9DE`, `--cream-accent #F0EBE1`, `--ink #1B1812`
- Hairlines `--line #E5E2DC`, muted text `--g-500 #8A8480`
- Headings: Fraunces by default, Bodoni Moda on the editorial skin (`--font-display`). Body: Inter (`--font-sans`).
- Layout: `.wrap` (max 1200px), `.section`, `.section--dark`, `.section--soft`
- Buttons: `.btn`, `.btn--primary` (blue), `.btn--ghost`, `.btn--cream` (on navy), `.btn--lg`. Pill shape.
- Nav is `.nav` with `.nav__inner`, `.nav__links`, `.nav__actions`. Footer is `.footer`. Reuse these. Do not build a second nav or footer.

**2. The 30 demo templates** are the designs listed in `js/catalog.js` (18 in `templates/sectors/`, 12 in `templates/practices/`). They are not styled by `main.css`.

- Each design carries its own `<style>` block and its own short class prefix (the psychiatrist design uses `vo-nav`, `vo-btn`, and so on). Each has its own accent color and feel, set in the catalog.
- `css/template.css` is linked from every design and supplies the shared parts: the skip link, focus ring, and the "Built with FrontDoor" ribbon. Keep them on every template.
- Do not use `main.css` classes in templates, and do not give a design another design's prefix.
- Gallery and hero cards load a design in an iframe and add `is-preview` to its document, which hides the ribbon.

## Home page hero (special case)

The home page does not use the standard `.nav` or `.hero--split`. It has its own landscape hero in `css/main.css`.

- `body:has(.lhero)` hides the normal `.topbar` and `header.nav` on this page. Do not "fix" that.
- Nav is the rounded pill: `.lnav`, `.lpill`, `.lcta`, with `.lnav__right` for Browse Designs and Talk With Us.
- Center copy is `.lstage`: masthead (`.lmast`), subline (`.lsub2`), CTA (`.lcta2`). The eyebrow line ("Made for mental health practices") was removed on 11 Nov 2026 on leadership feedback. Do not put it back.
- The curved card carousel is `.lhero__reels` with `.rcard`. `reels.js` rewrites each card's `transform` every frame, so never set `transform` on `.rcard` from CSS.
- `.lfoot` is not used by any page. Do not add hero behavior there.

**Do not change the hero scrim without John's approval.** It has been tuned several times (see the long comment above `.lstage::before` in `main.css`).

- Layers: `.lhero__wash` (full frame) and `.lstage::before` (soft ellipse behind the words).
- The tradeoff is on record. Without the ellipse, the headline is unreadable over bright cards. With it, its edge can show faintly across a pale card.
- The approved levers are `--lhero-copy-y` (copy block position, now -46px) and the card size (now 60% of the frame). Try those first. Both can be tried live with the dev tuner: add `#tune` to the home page address. It saves to that browser only; the numbers that count are the ones baked into `css/main.css` and `js/reels.js`.
- After any hero change, check the headline and subline against the cards at 1440 and 375 wide.

## Brand rules

- No green anywhere on FrontDoor pages. The brand moved to navy and blue. Any green is a bug.
- White text on `--sky` fails contrast (2.1:1). Pair sky with navy text. White on `--blue` passes (5.3:1).
- Logo files live in `assets/img/` (`logo-frontdoor-full.png` for light, `logo-frontdoor-full-light.png` for dark). Minimum width 160px. Clear space equals the height of the "F".
- Use tokens (`var(--blue)`), not raw hex, in new CSS.

## Accessibility (required)

- WCAG 2.1 AA on every page and template.
- Skip link, visible focus ring (`:focus-visible`), alt text on images, labels on form fields.
- Respect `prefers-reduced-motion`.
- One H1 per page. Heading levels do not skip.

## Forms, booking and privacy

- The home page request form posts to Formspree. The form id is `REQUEST_ENDPOINT` in `js/main.js`. If it is ever set back to the `YOUR_FORM_ID` placeholder, the form shows "Request sent" and sends nothing.
- `BOOKING_URL` in `js/main.js` is still the `YOUR-HANDLE` placeholder, so Get Started and Talk With Us have no booking link yet.
- The designs' own contact forms use a placeholder too. A message from a real practice's visitors can be protected health information, so those need a form service with a signed HIPAA agreement before a real practice uses one. Do not point them at the standard Formspree plan.
- `privacy.html` is linked from the footers and under the request form. It was written from what the site actually does (no analytics, cookies or stored data on the public pages). If you add analytics, a booking widget or any other third-party script, update it. `PRIVACY-REVIEW.md` in the repo folder is an internal note for iTrust's compliance read and is git-ignored.

## SEO files

`robots.txt`, `sitemap.xml`, and `llms.txt` are in the root. A new public page needs an entry in `sitemap.xml` plus a unique title, meta description, and canonical tag.

## Green cleanup (done)

All green colors were replaced with navy, blue, or sky in `brand.html` and `css/main.css`. Treat any new green as a bug.

- `css/main.css` still has variables named `--pk-mint` and `--pk-deep`. They are blue now. The names are old. Rename only in a dedicated pass, because they are used in several rules.
- `main.css` sets `--font-display` to Bodoni Moda on the editorial skin (around line 1282), so Bodoni Moda is used on site pages too. Fraunces is the base font.

## How John likes to work

- When he asks for options, choices or variations, build a real HTML page that shows each one rendered with the site's own CSS, labeled Design 1, 2, and so on, and serve it locally. Screenshots or descriptions are not enough.
- Never use the same image twice on a page. Before adding a photo, grep for the ones already used (`grep -oE "photo-[0-9]+-[a-z0-9]+" index.html | sort | uniq -c`). The Unsplash photos are placeholders to be replaced with owned assets before launch.
- Anything a client or practice reads has to sound like a person at a small studio wrote it. The readers are clinicians and they notice. Watch for the same promise made three times, every caption built to one shape, a repeated series explaining itself on each row, em dashes, no contractions, and mixed US and UK spelling (the site is US). A stack of identical rounded white cards looks generated; a document look with one measured column and hairline rules reads as real.
- He says "push all live" when he wants a deploy. Until he says it, commit and stop. After a push, wait for the Pages build to finish and check the live page.

## How to work here

- Small copy or style fix across a few files: just do it.
- New page, new section, or shared component: use the `web-build` skill.
- After a change, open the page at 1440 and 375 wide and check it before you commit.
- Commit by file path. Never commit the generated output of the `tools-build-*.js` scripts unless the source changed.

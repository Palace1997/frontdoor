# FrontDoor (repo: sitewell-studio)

FrontDoor is a web studio by iTrust Insights. This repo is the marketing site plus 30 demo templates for behavioral health practices. The brand was renamed from SiteWell Studio to FrontDoor. Some file names and commits still say SiteWell.

Live site: https://palace1997.github.io/sitewell-studio/

## Stack and deploy

- Plain HTML, CSS, and JavaScript. No framework, no bundler, no build step for pages.
- Hosted on GitHub Pages from `main`. `.nojekyll` is in the root. Every push to `main` goes live, so check before you push.
- Local preview: run `server.py` from the repo root, then open the page in a browser. (Check `Start SiteWell.command` for the exact launch command and port, and update this line.)
- `tools-build-forms.js` and `tools-build-seo.js` generate files. Run them instead of editing their output by hand. (Add which files each one writes.)
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

**2. The 30 demo templates** use `css/template.css`. This is a separate monochrome system for the sample practice sites.

- Black and white only: `--ink #0a0a0a`, `--paper #fff`, grays `--g-*`
- Fraunces headings, Inter body
- Every class uses the `t-` prefix (`t-btn`, `t-nav`, `t-card`, `t-section`). Do not use `main.css` classes in templates.
- The skip link, focus ring, and "Built with FrontDoor" ribbon are shared accessibility parts. Keep them on every template.

## Home page hero (special case)

The home page does not use the standard `.nav` or `.hero--split`. It has its own landscape hero in `css/main.css`.

- `body:has(.lhero)` hides the normal `.topbar` and `header.nav` on this page. Do not "fix" that.
- Nav is the rounded pill: `.lnav`, `.lpill`, `.lcta`, with `.lnav__right` for Browse Designs and Talk With Us.
- Center copy is `.lstage`: eyebrow (`.leyebrow`), masthead (`.lmast`), subline (`.lsub2`), CTA (`.lcta2`).
- The curved card carousel is `.lhero__reels` with `.rcard`. `reels.js` rewrites each card's `transform` every frame, so never set `transform` on `.rcard` from CSS.
- `.lfoot` is not used by any page. Do not add hero behavior there.

**Do not change the hero scrim without John's approval.** It has been tuned several times (see the long comment above `.lstage::before` in `main.css`).

- Layers: `.lhero__wash` (full frame) and `.lstage::before` (soft ellipse behind the words).
- The tradeoff is on record. Without the ellipse, the headline is unreadable over bright cards. With it, its edge can show faintly across a pale card.
- The approved levers are `--lhero-copy-y` (copy block position, default -40px) and the card size. Try those first.
- After any hero change, check the headline, eyebrow, and subline against the cards at 1440 and 375 wide.

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

## SEO files

`robots.txt`, `sitemap.xml`, and `llms.txt` are in the root. A new public page needs an entry in `sitemap.xml` plus a unique title, meta description, and canonical tag.

## Green cleanup (done)

All green colors were replaced with navy, blue, or sky in `brand.html` and `css/main.css`. Treat any new green as a bug.

- `css/main.css` still has variables named `--pk-mint` and `--pk-deep`. They are blue now. The names are old. Rename only in a dedicated pass, because they are used in several rules.
- `main.css` sets `--font-display` to Bodoni Moda on the editorial skin (around line 1282), so Bodoni Moda is used on site pages too. Fraunces is the base font.

## How to work here

- Small copy or style fix across a few files: just do it.
- New page, new section, or shared component: use the `web-build` skill.
- After a change, open the page at 1440 and 375 wide and check it before you commit.
- Commit by file path. Never commit the generated output of the `tools-build-*.js` scripts unless the source changed.

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
- Headings: Fraunces (`--font-display`). Body: Inter (`--font-sans`).
- Layout: `.wrap` (max 1200px), `.section`, `.section--dark`, `.section--soft`
- Buttons: `.btn`, `.btn--primary` (blue), `.btn--ghost`, `.btn--cream` (on navy), `.btn--lg`. Pill shape.
- Nav is `.nav` with `.nav__inner`, `.nav__links`, `.nav__actions`. Footer is `.footer`. Reuse these. Do not build a second nav or footer.

**2. The 30 demo templates** use `css/template.css`. This is a separate monochrome system for the sample practice sites.

- Black and white only: `--ink #0a0a0a`, `--paper #fff`, grays `--g-*`
- Fraunces headings, Inter body
- Every class uses the `t-` prefix (`t-btn`, `t-nav`, `t-card`, `t-section`). Do not use `main.css` classes in templates.
- The skip link, focus ring, and "Built with FrontDoor" ribbon are shared accessibility parts. Keep them on every template.

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

## Known cleanup (green that should be blue)

Reviewers: report these as BLOCK on any page that touches the file, and fix them in a dedicated pass.

`brand.html`
- Line 11: favicon fill `%2300A583` (green)
- Line 23: body background glow `rgba(0,165,131,.14)`
- Line 49: `.panel--forest` uses `#0e3b2e`, `#082420`
- Line 58: `rgba(11,54,42,.28)` dashed border
- Line 60: `.cs__k` uses `rgba(0,165,131,...)`
- Line 153: "Door Mint" swatch `#5FCE9F` (and `--mint` on line 15)
- Names to rename: `--forest` to `--navy`, `--green` to `--blue`, "Forest Base" and "Forest Deep" to Navy, "Kenzie Green" to Blue, "Green 600" to Blue 600
- Copy on lines 7, 95, 112, 116, 117 mentions forest and Kenzie green
- Heading font here is Bodoni Moda. Every other page uses Fraunces. Switch to Fraunces.

`css/main.css`
- Line 89: `.section--dark .eyebrow` color `#4fc7ab`
- Line 130: `.topbar` text `#dff3ec`
- Line 171: `.nav--v2 .nav__links a` color `#dfeee8`
- Line 234: `.hero__statbadge .l` color `#a9d9cb`
- Line 605: `.rcard` background `#dde6dd`
- Lines 1446 to 1447, 1514, 1538: `--pk-mint`, `--pk-deep` and their hover tints are green washes
- Note: lines 1 to 629 and the green matches were reviewed. The rest of the file (about 1,280 lines) was not read in full.

## How to work here

- Small copy or style fix across a few files: just do it.
- New page, new section, or shared component: use the `web-build` skill.
- After a change, open the page at 1440 and 375 wide and check it before you commit.
- Commit by file path. Never commit the generated output of the `tools-build-*.js` scripts unless the source changed.

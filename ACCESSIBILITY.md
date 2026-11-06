# Accessibility audit, the 30 catalog designs

**Audited 6 November 2026.** Target: WCAG 2.1 Level AA.
Scope: the 30 designs listed in `js/catalog.js` (12 in `templates/practices/`,
18 in `templates/sectors/`), plus the shared `css/template.css` and
`js/template.js` they all load.

Also audited, in a second pass on the same day: the 60 generated blog and post
pages (`templates/**/*-blog.html`, `templates/**/*-post.html`), two per design,
produced by `tools-build-seo.js`.

Not in scope: the marketing site (`index.html`, `gallery.html`), the Studio
(`studio/`), the 11 general-industry templates and the 6 sector templates that
are not in the public catalog.

---

## Verdict

**Full WCAG 2.1 AA conformance is not claimed.** Four AA criteria were not
tested at all (1.4.4 Resize Text, 1.4.10 Reflow, 1.4.12 Text Spacing, and
anything that depends on a screen reader), so no honest statement can cover
the standard as a whole.

**What can be stated:** all 30 designs now pass the AA thresholds for the
criteria that were tested, at 1280px and 390px wide, as they ship. Those are
1.4.3 Contrast, 1.4.11 Non-text Contrast, 2.1.1 Keyboard, 2.4.1 Bypass Blocks,
2.4.7 Focus Visible, 1.3.1 Info and Relationships, and 4.1.2 Name, Role, Value.
Before this audit, 22 of the 30 failed 1.4.3, all 30 failed 2.4.1, and 6 failed
2.1.1 outright.

This is a measurement, not a certification. Nothing here has been reviewed by a
third party, nobody who relies on assistive technology has used these designs,
and none of it is a legal opinion. The homepage copy was written to stay inside
these limits: it says the designs are tested for contrast, keyboard navigation
and heading structure against WCAG 2.1 AA, and it does not assert conformance
or mention the ADA.

---

## How it was tested

Everything was measured in Chrome against the real pages served from
`python3 server.py` on port 4787, not read off the source.

| Tool | What it did |
|---|---|
| **axe-core 4.10.2** | All 30 pages, rules filtered to `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`. |
| **Custom contrast scanner** | Every element with its own text: resolved the real background by compositing the ancestor chain, computed the ratio, applied the 4.5:1 / 3:1 thresholds by measured font size and weight. Run at 1280x900 and 390x844, with every `<details>` forced open so accordion panels were measured too. |
| **Custom photo compositor** | For text over a photograph: re-fetched the image with CORS, redrew it with the same `object-fit` crop, repainted every scrim between the photo and the text with its real angle, stops and paint order, then sampled a 7x7 grid under each text box and took the worst pixel. This is the only one of the four that found the Lakehouse hero. |
| **Custom keyboard/semantics walker** | Tab order, accessible names, positive `tabindex`, focusable-but-`aria-hidden`, focusable-but-offscreen, heading order, `h1` count, landmarks, skip-link target, and every form control's programmatic label. |
| **Hand testing in the browser** | Tabbed through pages with real key presses; confirmed the focus ring renders, the skip link appears and moves focus, and the mobile menus open with Enter and Space and close with Escape. |

The scanner and compositor live outside the repository, in this session's
scratchpad. They are not needed to run the site.

---

## What was wrong, and what was done

### 1. Skip links, WCAG 2.4.1 Bypass Blocks (Level A)

**Was:** none of the 30 had one. Every page opened with a logo, five or six nav
links and a call-to-action that a keyboard user had to tab past on every page.

**Now:** every design opens with `<a class="t-skip" href="#main">Skip to main
content</a>` as the first element in `<body>`. It is off-screen until focused,
then slides to the top left. Styled in `css/template.css` with hardcoded
colours and `!important`, because several designs reset link colour at a higher
specificity and would otherwise have made it invisible.

Verified: the skip link is the first tab stop on all 30, its target exists on
all 30, and focusing it in the browser moves it on screen at 18:1 contrast.

### 2. The `main` landmark

**Was:** the 18 sector designs had `<header>` and `<footer>` but no `<main>`, so
the skip link had nothing to point at and the page body was not in a landmark.

**Now:** all 30 have exactly one `<main id="main" tabindex="-1">`. The
`tabindex="-1"` is what makes the skip link actually move focus rather than only
scroll; `css/template.css` suppresses the outline on that container so the user
sees no stray ring.

### 3. Keyboard operability, WCAG 2.1.1 Keyboard (Level A)

**Was, and this was the worst finding:** six designs opened their mobile menu
with the CSS checkbox trick, a `<label for>` paired with a hidden checkbox. A
`<label>` responds to a click and to nothing else. Enter and Space do not
activate it. On a phone-width viewport the menu was the only route to the
navigation, so for a keyboard user the navigation did not exist.

| Design | What it was |
|---|---|
| Beacon (`psychology-beacon`) | label not focusable at all; checkbox focusable but `aria-hidden` and invisible |
| Common Table (`clubhouse-common-table`) | label `aria-hidden`; the control was an unlabelled checkbox |
| Hearth (`aba-hearth`) | label focusable, `role="button"`, no key handler |
| Groundwork (`ot-groundwork`) | same, plus a focusable `aria-hidden` checkbox (4.1.2) |
| Rivergate (`mat-rivergate`) | checkbox `hidden`, label not focusable: no keyboard route at all |
| Throughline (`coaching-throughline`) | focusable checkbox with no accessible name |

**Now:** in all six the label is a real button (`role="button"`, `tabindex="0"`,
`aria-label`, `aria-expanded`) marked `data-menu-toggle`, and `js/template.js`
binds Enter, Space and Escape to it, keeps `aria-expanded` in sync, and returns
focus to the button on Escape. The checkbox stays in the DOM, because the CSS
`:checked ~` rules depend on it, but is now `tabindex="-1"`, `aria-hidden` and
visually hidden by the shared `.t-vh-control` class.

Verified by hand on Groundwork at 375px: Enter opens, Space toggles without
scrolling the page, Escape closes and returns focus, `aria-expanded` tracks
state.

Fieldstone (`sud-fieldstone`) already used a real `<button aria-expanded>` and
needed no change. The other 23 designs hide their nav links below 820px with no
menu at all; the same destinations are in the footer, so that is a navigation
choice rather than a failure, but it is listed under "Known gaps" below.

### 4. Focus visibility, WCAG 2.4.7 (AA) and 1.4.11 Non-text Contrast (AA)

**Was:** 22 designs set `outline:none` on form fields and replaced it with a 1px
border colour change. 18 designs defined no focus style at all and relied on the
browser default, which several of them then overrode.

**Now:** one rule in `css/template.css` gives every focusable element the same
indicator: a 3px white outline hugging the control with a 3px near-black band
just outside it. One of the two rings always clears 3:1 against whatever the
control sits on, light or dark. It uses `!important` for the same reason as the
skip link. It is `:focus-visible`, so it appears for keyboard users and not on
mouse clicks on links and buttons.

Verified by tabbing with real key presses into a Willow form field, a design
that previously had `outline:none`: computed `outline: rgb(255,255,255) solid
3px`, `box-shadow: rgb(17,20,19) 0 0 0 6px`, and visible in a screenshot.

### 5. Contrast on solid backgrounds, WCAG 1.4.3 (AA)

Measured every text element against its real composited background, at desktop
and mobile width, with accordions open.

**Was:** 194 failing text/background pairs across 22 of the 30 designs. The
pattern was consistent: mid-tone accents used both as a button fill behind white
text and as small eyebrow text on cream, landing between 2.6:1 and 4.5:1.
Anchorage was the worst case, with its entire body copy at 3.36:1.

**Now:** zero failing pairs at 1280px and at 390px, confirmed by both axe-core
and the custom scanner.

Accent changes. Hue and saturation were held constant in HSL and only lightness
was reduced, by the smallest amount that reaches the threshold against that
design's own worst real background. Fourteen of the fifteen moved by 5 lightness
points or less; the two larger moves are flagged.

| Design | Token | Was | Now | Lightness | Worst ratio |
|---|---|---|---|---|---|
| Even Keel | `--acc` | `#3D7EA6` | `#3A789E` | 45% to 43% | 4.17 to 4.52 |
| Willow | `--acc` | `#5C8A5E` | `#4E7550` | 45% to 39% | 3.44 to 4.54 |
| Riverbend | `--acc` | `#2E8B8B` | `#277676` | 36% to 31% | 3.45 to 4.54 |
| Harborlight | `--acc` | `#5A8FA0` | `#466F7D` | 49% to 38% | 2.97 to 4.55 |
| Common Ground | `--acc` | `#4E8A5A` | `#3F7049` | 43% to 35% | 3.21 to 4.52 |
| **Bright Kids** | `--acc` | `#DD6E4E` | `#C34925` | 59% to 45% | 2.72 to 3.77 |
| Bright Kids | `--acc2` | `#C4603F` | `#A75033` | | 3.43 to 4.53 |
| Clarity | `--acc` | `#1F8A99` | `#1B7986` | 34% to 31% | 3.61 to 4.51 |
| Meridian | `--acc` | `#2F8F7A` | `#287967` | 37% to 32% | 3.41 to 4.52 |
| New Path | `--acc` | `#B5763A` | `#956130` | 47% to 38% | 3.24 to 4.51 |
| Common Table | `--acc` | `#2E8B7A` | `#297A6B` | 36% to 32% | 4.13 to 4.59 |
| Hearth | `--acc` | `#2C7AAC` | `#2972A1` | 42% to 40% | 4.14 to 4.60 |
| Groundwork | `--acc` | `#AB5A34` | `#9E5330` | 44% to 40% | 4.00 to 4.54 |
| Rivergate | `--acc` | `#2C7A8C` | `#2B7789` | 36% to 35% | 4.34 to 4.52 |
| Fieldstone | `--acc` | `#A4611F` | `#9A5B1D` | 38% to 36% | 4.08 to 4.53 |
| Throughline | `--acc` | `#BE5224` | `#B04C21` | 44% to 41% | 4.00 to 4.52 |
| Open Road | `--acc` | `#C4522A` | `#BE4F29` | 47% to 45% | 4.35 to 4.58 |

The two that moved noticeably are **Bright Kids** (coral, now a deeper
terracotta coral) and **Harborlight** (sea blue, now a deeper sea blue). Both
used the accent as a button fill behind white text at 3.27:1 and 3.58:1, which
no smaller change could fix. The alternative, putting dark text on the lighter
accent, would have changed those buttons more than darkening the colour did.
`js/catalog.js` was updated so the catalog's recorded accents match.
Three of these values were darkened once more after the blog pages were
audited; section 7 explains why.

Muted text tokens darkened the same way: Riverbend `--muted`, Anchorage
`--muted` (3.36 to 4.52, the whole page), Harborlight `--muted`, Common Ground
`--muted`, Bright Kids `--muted`, New Path `--muted`, Lakehouse `--muted` and
`--gold`, Spectrum Bridge `--muted`, Juniper `--soft`, Beacon `--faint`,
Fieldstone `--muted`.

Six cases a token change could not fix:

- **Northshore**: the stat band's number tag used the accent on navy at 2.81:1.
  Darkening makes that worse, so the tag is now a light tint, `#9FBEDD`.
- **Lifeline**: the service numbers were `var(--line)` on white, 1.34:1. They
  now use `--muted`.
- **Clarity**: the nav pill was 82% white over the dark hero, so its links were
  reading on a `#D4DADB` composite at 3.55:1. Those links are now `#516260`, and
  the pill itself was raised to 96% white, because measuring against the real
  hero photo showed the links still at 3.54:1 through the translucent pill.
- **Rivergate, mobile only**: the drawer's own link colour out-specified
  `.rg-btn--pri`, so the filled call-to-action rendered dark ink on the accent at
  3.07:1. Found only because the scan was repeated at 390px.
- **Anywhere**: three labels in the mock video-call window were white at 42 to
  45% alpha, and the Leave button was `#D9485F`. Alphas raised, red darkened.
- **Lakehouse**: the quote eyebrow was `--gold` over a dark photo panel.

### 6. Text over photographs, WCAG 1.4.3 (AA)

This is where the flat-background scan was not enough, and where the worst
real-world failure was.

**Lakehouse** set its white hero headline, kicker, lede and buttons over a
mountain photograph behind a scrim that thinned to 15% opacity in the middle of
the hero, exactly where the text sits. Compositing the actual photo with the
actual gradient put the headline at **2.23:1** and the kicker at **1.59:1**. A
screenshot confirms the text is close to invisible against the bright water and
rock. The scrim now holds 50% to 90% top to bottom, which is a visibly darker
hero; the photo is still clearly the subject, and the headline is now readable.

Also fixed:

| Design | What | Was | Now |
|---|---|---|---|
| Lakehouse | hero kicker, headline, lede, buttons | 1.59 to 2.23 | scrim 50 to 90% |
| Lakehouse | gallery captions over photos | 3.90 | scrim ramp starts at 30%, ends 88% |
| Lakehouse | quote scrim light end | 1.63 | 74% |
| Lakehouse | quote eyebrow in `--gold` over the photo | 2.22 | light gold `#E6CE9C` |
| Common Table | hero sub and eyebrow over the photo | 2.88 / 3.89 | scrim 52 to 82%, eyebrow chip 88% |
| Meridian | day-band labels over the photo | 3.33 | scrim top stop 62% to 80% |
| Meridian | the transparent "home for the evening" card | 2.59 | card carries a 55% fill |
| Anywhere | the "You" self-view tile label | 1.08 | sits on its own 72% chip |
| Valor | nav links over the unscrimmed hero photo | 3.23 | nav carries its own gradient |
| Clarity | nav links reading through the translucent pill | 3.54 | pill raised from 82% to 96% white |

**A regression found on the way.** Four designs carry the shared `.t-nav` class
on their header. On Throughline and Hearth, whose navs are meant to be
transparent over a photo hero with white text, `.t-nav`'s
`background:rgba(255,255,255,.82)` was winning, leaving **white nav links on a
near-white bar at 1.2:1**. Both now set `background:transparent` explicitly.
This came from outside this audit and is worth knowing about: adding a shared
class to a design with its own nav styling can silently invert its contrast.

### 7. The generated blog and post pages

Each design now also ships a blog index and a post page, generated by
`tools-build-seo.js`. They copy the design's own `<style>` block and inherit
`css/template.css`, so they already carried the skip link, the `<main>`
landmark and the shared focus ring. Scanning all 60 found two things anyway.

**An invisible call-to-action on three designs.** The generator styled the
post-page button as `.sw-cta__btn{background:var(--sw-acc);color:var(--on,#fff)}`.
That selector is one class, so a template's own link rule beat it: Beacon's
`.bn a{color:var(--acc)}` is two classes and won. The result was accent text on
an accent fill, **1:1**, a solid rectangle with the words "Get in touch"
invisible inside it. Beacon and Common Table rendered at 1:1, Fieldstone at
2.95:1.

The rule is now `.sw-blog .sw-cta__btn`, with a literal `#fff` and a dedicated
`--sw-acc-solid` fill. Measured on the regenerated pages, white on that fill
runs 8.8:1 to 11.9:1 across the designs that were failing.

This is the third instance of one pattern in this codebase: a low-specificity
button rule losing to a broad link-colour rule. The first two were the Rivergate
mobile drawer and the `.t-nav` background. It is worth a lint rule.

**Three accents needed one more notch.** The blog pages put accent-coloured text
on each design's cream surface, a background those accents had never been
measured against. Bright Kids `#CC4C27` to `#C34925`, Open Road `#C4522A` to
`#BE4F29`, Common Table `#2C8474` to `#297A6B`. All three moves are 2 to 3
lightness points. Open Road had not needed a change before this.

The lesson for the invariant in "Notes" below: an accent is only safe against
the backgrounds it has been measured on. Adding a new surface to a design means
re-measuring its accent.

### 8. Headings, landmarks and form labels, WCAG 1.3.1 (Level A)

- Every form control on all 30 has a programmatic label. No exceptions found.
- Every design has exactly one `<h1>`, and `<header>`, `<main>`, `<footer>` and
  at least one `<nav>`.
- **Was:** footer column headings were `<h4>` directly after an `<h2>`, skipping
  a level, in 28 designs; Groundwork also had an `<h4>` straight after its `<h1>`.
  **Now:** footer columns are `<h3>` with the stylesheet selector widened so
  nothing changes visually, and Groundwork's hero tile heading is an `<h2>`. No
  design skips a heading level.
- No positive `tabindex`, no focusable element inside `aria-hidden`, no
  focusable element stranded off-screen, on any of the 30.
- Rivergate used three `<dl>` elements that contained no `<dt>` or `<dd>`. They
  are `<ul>` now.

---

## What this audit does not cover

These are the honest limits. Anything the marketing copy claims should stay
inside them.

1. **No screen reader testing.** Nothing here was run through VoiceOver, NVDA or
   JAWS. Programmatic names and roles were checked; how they are actually
   announced was not.
2. **No testing by disabled users.** Measurement is not lived experience.
3. **Two viewport widths only**, 1280px and 390px. Criteria that depend on
   zoom and reflow, **1.4.4 Resize Text** and **1.4.10 Reflow** (both AA), were
   not tested at 200% or 400%.
4. **1.4.12 Text Spacing (AA) not tested.**
5. **2.5.5 Target Size is Level AAA** in WCAG 2.1 and was not assessed. Several
   designs have nav links and icon buttons under 44px.
6. **Client photographs are the live risk.** Contrast over a photo was measured
   against the demo photos that ship with each design, sampling a 7x7 grid under
   each text box and taking the worst pixel. These are templates: when a practice
   swaps in a brighter photo behind the same white hero text, the scrims now
   carry enough weight for a typical bright image, but no scrim is proof against
   every photograph. Any build that replaces a hero image should be re-measured.
   This is the single most likely way for a delivered site to fall out of
   conformance.
7. **Content is fictional.** Real practice copy, longer names and real
   credentials will change line counts and could reintroduce layout problems.
8. **The Studio's brand recolour feature is unguarded.** `studio/customize.html`
   lets an operator set any accent colour, including ones that fail. Nothing
   warns them. See "What is left".
9. **No automated regression test.** These fixes can be undone by the next edit
   without anything noticing.

---

## What is left

- [ ] Run a screen reader pass on three or four representative designs.
- [ ] Test at 200% and 400% zoom for 1.4.4 and 1.4.10.
- [ ] Add a contrast check to the Studio's colour picker, so an operator cannot
      ship an accent that fails against that design's own backgrounds.
- [ ] Add a contrast warning when an operator swaps a hero photograph.
- [ ] Decide whether the 23 designs with no mobile menu should get one.
- [ ] Wire axe-core into a check that runs before release, so this does not
      silently regress.
- [ ] Review target sizes if AAA ever becomes a goal.

---

## Notes for whoever edits these files next

- The skip link and the focus ring live in `css/template.css` and use
  `!important` on purpose. Several designs reset `outline` and link colour at a
  higher specificity; without it, the indicator disappears in those designs.
- The mobile menu keyboard handler keys off `data-menu-toggle` on the label. If
  you copy a burger menu into a new design, copy that attribute too.
- Each design's accent is now the darkest-safe version of its original hue.
  Lightening one reintroduces a contrast failure. If a design needs a lighter
  accent for decoration, add a second token rather than changing `--acc`.
- Adding a shared class such as `.t-nav` to a design that already styles its own
  nav can invert its contrast. Check the result over the hero photo.
- After editing any template or `css/template.css`, bump `window.SW_TPL_V` in
  `js/catalog.js` or previews will serve a stale build.

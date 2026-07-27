# Changelog

Session-by-session build history. Each entry maps to the commits it produced,
so `git log` and this file cross-reference. Newest first.

---

## 2026-07-26 — The build session: migration → full site → refinement → audits

Ten commits, `5253f28..3ce6199`. The repo went from a Vite single-page design
system to the complete production site in one session.

### Migration (`5253f28`)

- Vite 5 + Express retired; **Next.js 16 App Router + React 19**, deployed on
  Railway via `nixpacks.toml` (`next start` binds `$PORT`).
- The v1 design-system document survives intact at **`/design-system`**
  (its 30 sections, sidebar and splash), moved to `src/design-system/`.
- **Literata replaced Fraunces** as the display face — the client rejected
  Fraunces' ball-terminal J/f/j. Imported via `opsz.css`: the `index.css`
  import Fraunces used shipped the weight axis only, so every optical-sizing
  rule had been dead since March. Nine files carried `SOFT`/`WONK` axes that
  don't exist in Literata; stripped, `opsz` clamped to its real 7–72 range.
- Semantic colour tokens (`success/warning/error/info`) added to `@theme`;
  error is a distinct red, NOT the coral — coral sits ~10° from the brand
  orange and would read as a button. Answers the client's Foundations 01 question.
- `Icon` supports multi-path glyphs; `prose-jigsaw` (referenced since v1,
  defined nowhere) exists; radius tokens deliberately NOT changed — the doc
  page was wrong, not the build, and it was corrected instead.

### Data layer (`74ee1fb`)

- **18 team bios** and **17 case studies** migrated verbatim from the live
  White Fuse site by subagents (curl + byte-exact extraction, not summarised).
  Case studies restructured into the brief's four fixed sections and flagged
  `isDerived: true` — drafts for client approval, said so on every page.
  The one exception is Voices of Refugee Youth: the client's own worked example.
- **10 real publications** with their S3 PDFs. Dates, authors, abstracts and
  covers are null because the live site publishes none — honest gaps, not bugs.
- `country` is null for 16 of 18 team members on purpose: only two bios state
  a current base, and publishing a guess about where a person lives was ruled out.
- Services (6), technical focus areas (8), distinctives (5) with the brief's
  exact titles; `[tbc]` copy renders through the `placeholder()` helper.

### Full site frontend (`4d65d24`)

Eleven routes over the approved sitemap: Home, Services, Technical focus,
Distinctives (with `#our-story`), Team + bios, Case studies + details,
Publications + details, Contact, Policies, Work for us, 404.

- SEO baseline the old site never had: generated `sitemap.xml` and
  `robots.txt`, per-route canonical + meta description, Organization /
  Person / ScholarlyArticle structured data, OG image, favicon.
- Verified against prerendered HTML: one `h1` per page, no heading skips.
- Real filtering (search, facets, chips, sort, pagination) on both libraries.
- Interactive world map + office locator plates: d3-geo + world-atlas
  TopoJSON, matched on numeric ISO codes so country renames can't silently
  drop a highlight. No Google Maps — no third-party cookies.

### Editorial redesign pass (same commit, directed via `docs/design-direction.md`)

Client feedback: grids read as AI-generated (box-in-box), text-wall hero,
Services identical to Technical focus, dated feel. Five parallel subagents,
one direction doc, reference patterns verified against Clay.global, Koto,
Bakken & Bæck, Pentagram:

- **Home**: asymmetric hero, first sentence display-size with italic accent,
  client's own field photo in duotone, quiet mono stat line; signposts as
  hairline columns, no boxes; partner wall as a slow two-row marquee (60s).
- **Services**: sticky rail + six numbered index rows (Clay's 01/02/03
  pattern), expand-in-place with related case studies, ringed-disc control.
- **Technical focus**: asymmetric 6+6/4+4+4/3+3+6 mosaic, icons as heroes
  (crisp plate + oversized ghost), surface variety (sea/navy/orange tiles),
  full-width detail band, one open at a time.
- **Distinctives**: bleeding watermark numerals (104–200px), alternating
  rows, count-up stats band, real IDRC pull quote recovered from the live
  site, Our story with timeline rail.
- **Shared**: CrossLinks became the "Continue" band; `SmartImage` shimmer
  skeletons; route `loading.jsx`; redesigned `<Placeholder>` (inline chip,
  killed the dashed-slab-in-card look).

### Iteration batch (`0457503`, `84d7327`, `bf88c28`)

- **cobe globe** behind the home hero (5KB WebGL; three.js rejected as 600KB
  of scene graph for a background). Three placement iterations — behind the
  photo it read as a flat disc; final position rises from the bottom-left
  like a horizon, offices marked orange, one arc London–Lusaka.
- **Contact** rebuilt on the email-as-hero pattern (display-size mailtos,
  thick cloned-underline sweep); **footer** became a three-band content map
  with the mailing-list capture and both offices; footer signup is
  route-aware (stands down on Contact and Work for us — one form per page,
  verified in prerendered HTML) and the top band recomposes rather than
  leaving a hole.
- **8 custom spot glyphs** for the technical focus areas, generated with
  media-gen (Nano Banana Pro) from one style anchor, object-only per the
  client's no-AI-people photo policy, downscaled to ~150KB each. UI icons
  remain SVG (currentColor, crisp scaling — raster can't do either).
- **Design system v2 sync**: seven doc pages updated to match the shipped
  components, changelog entry v2.0 added inside the system document.
- `MailingListForm` ids became per-instance (`useId`) — duplicate-DOM-id fix.

### Compliance audit (`221d2b8`)

A subagent audited every page against the docx structure tables. Real gaps
found and fixed the same day:

1. Publications' method filter never rendered (all-null facet) → draft
   method classifications on the four self-describing briefs, country facet
   added, and the tile now prints method/topic/country (the card was
   dropping three of the brief's six fields).
2. Contact's mailboxes were stacked; the brief says "deliberately
   side-by-side so that there is no hierarchy" → two equal columns. Signup
   moved to first position, where the brief lists it.
3. Distinctives ¶3 got its `[link to each relevant page]` anchors inside the
   client's own phrases (exact-substring, zero retyping).
4. Work for us: client sentence restored verbatim (including their
   "sign-up" hyphen), invented lede removed.
5. Case-study method links land on the named service row, which now opens
   itself on hash arrival (`/services#slug`).

Documented non-actions: the publications↔case-studies bridge stays dormant
(the brief's own wording is conditional and no honest link exists yet);
the "Type" facet is an extra with real values; Contact's differing address
labels are the client's own.

### Mobile audit (`f7eca4e`)

Programmatic audit at 390×844 across routes. Fixed:

- **The drawer had never worked**: the header's `backdrop-blur` creates a
  containing block for fixed descendants, so the menu's `fixed inset-0`
  wrapper resolved against the 80px header box. Moved to a sibling of the
  header; opens full height.
- iOS zoom-on-focus killed (every form control ≥16px on touch); tap targets
  to 40–44px on primary controls, zero below the 24px WCAG floor; filter
  panel capped at viewport width; `.tactile` press feedback; tap-highlight
  flash removed; `viewport-fit: cover` + safe-area padding.

### App-grade navigation (`a395431`)

- **Bottom tab bar** (mobile): Home / Services / Work / Library + Menu,
  icons from the site's own SVG set (active state via `currentColor`), same
  orange indicator the desktop nav underlines with. Menu drives the same
  drawer as the hamburger through `MobileNavContext` — one menu, two triggers.
- Header auto-hides on scroll-down, returns on scroll-up (dead-zoned).
- Drawer: focus trap + focus restore, swipe-to-close, `overscroll-contain`,
  and it now carries the full site map (footer routes + both mailboxes).
- Floating back-to-top clear of the tab bar; route-enter transition via
  `(site)/template.jsx` — app-shell effect with no experimental flags.

### Home globe + focus interaction (`3ce6199`)

- Globe uncropped: hero and signposts share a positioning context, the
  sphere flows behind both on a 0.22 scroll parallax (rAF, direct style
  writes, static under reduced motion).
- Technical focus detail opens **under the clicked tile's row** at every
  breakpoint (per-row order maps per layout), so first-row answers stop
  hiding below the fold. Verified: panel fully in view on click, no scroll.

### Root cleanup + globe legibility (this commit)

Dead Vite `dist/` removed; the client docx moved into `docs/client/`
(gitignored — public repo); README rewritten for the Next.js site; this
changelog created. The globe gained a vertical fade mask so it dissolves
under the signpost text instead of running dot matrix beneath the copy, and
the column hover went translucent — a solid fill was cutting a hard-edged
rectangle out of the backdrop.

---

## Still open (carried from `docs/build-plan.md`)

**Waiting on the client:** copy for every `[tbc]` slot (~25 texts), 18
partner logos as SVG, six policy PDFs, publication covers/dates/authors,
country list for the map, founding-date decision (10 vs 15 years), 60+ vs
50+ organisations, citation URL for the Distinctives statistics, log-frame
links between publications and case studies, mailing-list decision for
vacancies, logo wordmark files.

**Before launch:** strip the review-phase notes rendered on six pages
(draft warnings, pending-asset lines); connect Mailchimp; migrate S3 assets
off the legacy `jigsawconsult` bucket.

**Next phase:** the content backend — `src/data/*` is the contract; the CMS
replaces those files, not the pages.

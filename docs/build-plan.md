# Build plan — Jigsaw website rebuild

**Phase:** frontend mockup · **Branch:** `main` · **Deploy:** Railway
**Written:** 26 July 2026 · pending Diego's sign-off on the four open decisions in §6.

Sources this plan reconciles:
- `docs/client/new-website-sitemap.md` — the client's July brief + design-system feedback
- `docs/project-context.md` — commercial and decision history
- Audit of the design system in `src/` (30 sections, 3.461 lines)
- Audit of the live site at jigsaweducation.org (34 pages, 17 stories, 12 PDFs)
- Type research: 32 candidate display faces rendered and measured against the client's complaint

---

## 1. Sitemap

Header: 7 items, no dropdowns, logo returns home. Everything reachable in two clicks.

```
/                          Home
/services                  Services            — 6 expandable service boxes
/technical-focus           Technical focus     — 8 expandable focus boxes
/distinctives              Distinctives        — 5 distinctives
/team                      Team                — grid of ~18
  /team/[slug]             Individual bio
/case-studies              Case studies        — filterable grid
  /case-studies/[slug]     Individual case study
/publications              Publications        — Evidence Library, filtered
  /publications/[slug]     Individual publication
/contact                   Contact             — dual office, mailing list

Footer only:
/policies                  Policies            — PDF hub
/work-for-us               Work for us         — holding page
/404                       Not found
```

**Routes the brief does not name but the build needs:** `/404` (design system already has the template), and optionally `/search` (site search was accepted in the March calls but is absent from the July brief — carrying it as out of scope unless raised).

### Two structural gaps in the client's sitemap

**"About" disappears.** The current site's `/pages/25-about` holds four blocks: Our story, Our values, Our clients, Our partners. In the new map, the values feed Distinctives and the clients/partners feed the Home logo wall — but **Our story has no destination**. A 15-year-old research practice with no origin story anywhere on the site is a real loss. Options in §6.

**"Technical assistance" has no home today.** The live site's home and footer both promise "research, evaluation, strategy **and technical assistance**", but only three service pages exist. The new brief fixes this: it lands inside "Technical assistance and evidence synthesis". Worth telling the client we caught it.

### Expand-in-place vs subpage

The brief asks for different interaction models and they should stay different:

| Content | Model | Why |
|---|---|---|
| Services (6), Technical focus (8) | **Expand in place** — accordion inside the card | The brief says "dropdown/popout from each which links to relevant case studies". These are short summaries plus links, not pages. Keeps the page short, which the client asked for. |
| Team (18) | **Real route** `/team/[slug]` | Becky asked "or dropdowns/popouts? Whatever you think would work best." Real URLs win: 18 indexable pages, shareable links for a research team whose people are the product, and ORCID/LinkedIn context. |
| Case studies, Publications | **Real route** | Explicitly requested. Also the SEO argument Becky made for publications. |

---

## 2. Design system v2 — changes driven by client feedback

Every item below traces to a line in `docs/client/new-website-sitemap.md` §3.

### Answers the client asked for

**Error colour: keep the standard red, do not use coral.** Coral `#ff421d` sits ~10° from the brand orange `#ff7816`. On a page where orange means "primary action", a coral error state reads as a button, not a warning. Coral stays in the dataviz ramp where it never neighbours a CTA. This applies to the public site as much as the backend.

**Icon library: custom set, generated with media-gen (Nanobanana 2).** No Noun Project, no third-party dependency, and the client gets a documented source for future icons. Scope note: the system has 54 icons but only ~30 are used. Generating 30 and documenting the prompt recipe beats generating 54.

**Stat cards: yes, colour is a variant.** Shipping three — cream (default), navy-inverted, and orange-accent — rather than leaving it to ad-hoc overrides.

**Article page: no, not every publication gets one.** The article template is for long-form pieces Jigsaw hosts itself. Most publications are a PDF plus an abstract page. The publication subpage in the brief (title, authors, date, taxonomy, abstract, download button) is a much lighter template. Building both, using each where it fits.

**Languages: specify them.** Confirmed by Becky. English primary, plus Arabic, French, Spanish. i18n is scaffolded in this phase, not populated.

**Dot pattern.** Currently decorative filler on the publication cards, which the client questioned twice. Proposal: retire it from cards and keep it as a single, defined use — a large-scale background texture on section breaks. If that doesn't earn its place, drop it entirely.

### Fixes to apply

| # | Feedback | Change |
|---|---|---|
| 1 | Fraunces J, f, j are "wiggly" | Replace the display face (§3) |
| 2 | Statement hero blobs are distracting | One colour, orange only |
| 3 | Editorial split hero too dark | Background navy-900 → sea-700; headline and lede in cream-50 |
| 4 | Photo hero title colour | Confirmed white/cream-50 over the navy gradient |
| 5 | Publication card image box hard to fill | Remove the landscape tile. Portrait cover thumbnail on the left, with an initials/type fallback when no cover exists |
| 6 | Dots and shadow on the card | Removed along with the tile |
| 7 | Case study card | Stays landscape — a separate component from the publication card |
| 8 | Team photo filter inconsistent | Single fixed duotone recipe; **filter removes on hover**; supply colour photos, the system desaturates |
| 9 | Team card location | City → country |
| 10 | Footer blurb takes space | Removed |
| 11 | Footer legal line in a different font | Unify to Lato. The mono was deliberate but reads as a mistake, which is reason enough |
| 12 | Library cards blend into the background | Container → cream-200, cards stay cream-50/100. Inverts the current contrast |
| 13 | Wordmark uses the heading font | Wordmark uses the supplied logo asset only, never a web font. Blocked on the client sending PNG + SVG; until then, J mark alone |

### Debt to clear while extending, not after

- **Tokenize spacing and radius in `@theme`.** Today they exist only as prose in the docs pages. `Spacing.jsx` documents `rounded-2xl` as 32px; Tailwind v4 renders 16px. The docs page draws its own swatches with inline styles, so it looks correct and the code lies.
- **Add semantic colour tokens** (`success`, `warning`, `error`, `info`). `Badge` and `Feedback` currently reach for Tailwind's default `emerald`/`amber`/`red`, which are outside the brand.
- **Rebuild dark mode as token redefinition.** It's currently 12 `!important` overrides on specific utility classes and will not respond to any new component. Separately: the public site does not need a theme toggle. Recommend keeping navy-reverse as a section treatment and dropping the toggle from the site (it stays in the design system doc).
- **Add `id`/`slug` to `publications.js` and `team.js`.** Without them there is no routing and no real filtering.
- **Extract inline markup to components.** Heroes, stats, cards and the filter bar are markup inside doc pages. `Filters.jsx` is a literal copy of `Library.jsx:22-76`.
- **`Icon.jsx` renders exactly one `<path>`.** The custom icon set will need multi-element glyphs.
- **`prose-jigsaw`** is referenced in `Article.jsx:32` and defined nowhere.
- **Fraunces `opsz`/`SOFT`/`WONK` never applied.** `app.css:4` imports `index.css`, which ships the weight axis only. Lines 116–119 have been dead the whole time. Whatever face replaces it, import the multi-axis stylesheet.

---

## 3. Display typeface

32 candidates rendered from the real binaries and measured for J descent below the baseline.

**Recommended: Literata** — `@fontsource-variable/literata`, OFL-1.1, `wght` 200–900 + `opsz` 7–72, roman and italic.

The J plants on the baseline and ends in a blunt flat terminal. The f's hook closes in a small contained flag with no ball. The j has a straight descender cut at an angle. It stays a warm book serif, so the change reads as a correction rather than a rebrand — which is what the client asked for. It's the only top candidate carrying weight range, optical size and italic, so it covers Display XL through Heading 3 and the pull quotes without gaps.

**Runner-up: Faustina** — `@fontsource-variable/faustina`, `wght` 300–800, roman and italic. The most sober J of the set and the straightest j. Narrower, which helps if long headlines break the grid. No optical axis, so display tracking needs manual tuning.

**Third way: Platypi** — a wedge serif with no round terminal anywhere in the face. Lowest literal risk against the complaint, but sharp where Fraunces was soft. The client asked to fix three letters, not change temperature.

**Rejected, worth knowing why: Petrona.** Aesthetically the closest thing to Fraunces in the catalogue — and its J drops 29% of cap height below the baseline. In the "Jigsaw" wordmark the J hangs. Also rejected for the same reason: Bitter (22%), Source Serif 4 (21%), Vollkorn (36%), Crimson Pro (34%). Besley and Lora reproduce the ball terminals outright.

Samples rendered at 230px with baseline guides, plus "Jigsaw Education Evidence" set with real Lato body, are in the session scratchpad (`p1–p3.png`, `z1–z4.png`).

---

## 4. Modules to build

**Reusable as-is from v1:** Footer (rewire hrefs), Article template, Evidence Library shell, About blocks (timeline, location cards, values grid), the three heroes, three stat formats, 404, TeamCard, filter bar + chips + pagination, modal, accordion, alerts, empty state, breadcrumbs.

**New, driven by the sitemap:**

| Module | Used by | Notes |
|---|---|---|
| `SiteHeader` | every page | Sticky, 7 items, no dropdowns, logo→home, mobile drawer. Exists only as a demo inside `Navigation.jsx` |
| `ExpandableCard` | Services ×6, Technical focus ×8 | One component, two datasets. Accordion revealing summary + linked case studies |
| `WorldMap` | Home | Interactive, highlights countries worked in. The largest new build — see §5 |
| `PartnerLogoWall` | Home | 18 logos in the client's fixed order. **All 18 need recreating as SVG** — the current site has one composite PNG |
| `SignpostTrio` | Home | Three boxes → Services / Technical focus / Distinctives. Action card from `Cards.jsx` is the base |
| `DistinctiveList` | Distinctives | 5 numbered items |
| `CaseStudyCard` | Case studies | Landscape. Title, countries, partners, service |
| `CaseStudyTemplate` | `/case-studies/[slug]` | Summary box with country flags, partner logos, method linked to its service page + the four fixed sections |
| `PublicationCard` (revised) | Library, Home strip | Portrait cover left, per feedback #5 |
| `PublicationTemplate` | `/publications/[slug]` | Light template — taxonomy, abstract, download, optional link to its case study |
| `TeamGrid` + `TeamTemplate` | Team | ~18 members, bio ≤150 words, LinkedIn + optional ORCID |
| `OfficeCards` | Contact | Two, side by side, deliberately no hierarchy, a map each |
| `MailingListForm` | Contact, Work for us, Footer | Real validation, stubbed submit until Mailchimp is wired |
| `PolicyList` | Policies | PDF links with type and size |
| `JobTiles` + empty state | Work for us | Holding message when empty, which is the current state |
| `FlagChip` | Case studies | Country flags |
| `PageMeta` | every route | title, description, canonical, og:image, Schema.org |

`PageMeta` is not cosmetic. The live site has zero meta descriptions across 34 pages, no sitemap.xml, an `og:url` set to a relative path, no canonical tags and no structured data. That is the single largest measurable defect in the current site and it's cheap to fix in a rebuild.

---

## 5. Technical notes

**World map.** Proposal: `react-simple-maps` + `world-atlas` TopoJSON. No API key, no tiles, no external requests at runtime, ~40 KB gzipped, and it styles with brand tokens. Countries come from a data file the client can edit. Rejected: Mapbox/Google (API keys, cost, external calls, and a cookie-consent problem), and a hand-drawn SVG (unmaintainable when the country list changes).

**Office maps on Contact.** Static map images rather than embedded Google Maps — avoids third-party cookies, which matters given the client's GDPR posture and the fact their current cookie banner is already opt-out and questionable.

**Accessibility.** WCAG AA is a client requirement. The live site fails at the basics: every content image carries `alt=""`, `/pages/9-team` has one `<h1>` and no other heading so the 18 names aren't headings at all, and the home skips from `<h2>` to `<h4>`. Heading order and alt text are build-time discipline, not a later audit.

**Placeholder discipline.** Where the brief says `[tbc]`, placeholder text must be visibly placeholder. If it reads as finished copy, the client will review it as finished copy and nobody will notice it shipped.

---

## 6. Decisions — locked 26 July 2026

**1. Framework: Next.js App Router.** The design system is React + Tailwind v4, so it ports with almost no change. We get file-based routing, per-route metadata, a generated sitemap, and a native home for the content backend that is the stated end goal. Railway supports it. `server.js` and the Express static setup retire.

**2. "Our story" lives inside Distinctives, with its own entry point on the Home.** The Distinctives box in the home's signpost trio carries a secondary link that deep-links to the story block, so a visitor looking for "about us" has somewhere to click. The header stays at 7 items.

**3. Display face: Literata** — `@fontsource-variable/literata`, imported multi-axis so `opsz` actually applies this time.

**4. Mockup content: recycle what exists, mark the gaps.** The 18 bios and 17 case studies migrate from the live site. Visible placeholder only where the brief says `[tbc]` — the 6 service summaries, the 8 focus areas, the 5 distinctives. The case studies get rewritten into the brief's four-section structure.

## 6b. Build status — 26 July 2026

The frontend mockup is built. 56 pages prerender; `npm run build` is clean.

| Phase | Status |
|---|---|
| 1 · Next.js migration, design system preserved at `/design-system` | Done |
| 2 · Foundations v2 — Literata multi-axis, semantic tokens, `prose-jigsaw`, multi-path `Icon` | Done |
| 3 · Data layer — 18 bios, 17 case studies, 10 publications, services, focus areas, distinctives | Done |
| 4 · Shared chrome — `SiteHeader`, `SiteFooter`, `SiteLogo`, `Placeholder`, `Section` | Done |
| 5 · All routes in the sitemap | Done |
| 6 · Feedback fixes | Done in the site components; design system doc pages not yet resynced |
| 7 · Custom icon set via media-gen | Not started |

### Feedback fixes as applied

| # | Feedback | Where |
|---|---|---|
| 1 | Fraunces J/f/j | `app/globals.css` — Literata via `opsz.css`. 9 files had dead `SOFT`/`WONK` axes stripped |
| 2 | Hero blobs one colour | `PageHero.jsx`, home hero — orange only |
| 3 | Editorial split hero too dark | Deferred: the site uses statement heroes throughout, so the split hero has no page using it yet |
| 4 | Photo hero title white | Same — no photo hero in the site build yet |
| 5 | Publication card portrait cover | `PublicationCard.jsx` — landscape tile removed, portrait cover left |
| 6 | Dots and shadow | Gone with the tile |
| 7 | Case study card stays landscape | `CaseStudyCard.jsx`, a separate component |
| 8 | Team photo filter | `TeamCard.jsx` — one fixed duotone, clears on hover and focus |
| 9 | City → country | `TeamCard.jsx`; chip omitted when country is unknown |
| 10 | Footer blurb removed | `SiteFooter.jsx` |
| 11 | Footer legal line font | `SiteFooter.jsx` — Lato, not mono |
| 12 | Library cards blend in | Surface goes darker (`tone="sunken"`) so cards lift off it |
| 13 | Wordmark not in the heading font | `SiteLogo.jsx` — Lato stand-in, single `WORDMARK_SRC` constant to swap |

### Things built beyond the fix list

- **Real filtering.** Search, faceted filters, chips, sort and pagination all work on both Case studies and Publications. The design system's versions were cosmetic.
- **Interactive world map.** `WorldMap.jsx`, built on world-atlas TopoJSON with d3-geo. No API key, no third-party runtime request. Answers the client's "Is it possible to have an interactive world map design?"
- **Office locator maps.** Same approach on Contact, instead of embedded Google Maps, which would set third-party cookies before consent.
- **SEO baseline.** Generated `sitemap.xml` and `robots.txt`, per-route canonical and meta description, `Organization`/`Person`/`ScholarlyArticle` structured data, an OG image, and a favicon. The live site has none of these.
- **Heading structure verified.** One `h1` per page, no skipped levels, meta description on all 56 routes — checked against the prerendered HTML, not by eye. The live site's Team page has a single `h1` and no other heading at all.
- **Skip link** as the first focusable element on every page.

### Compliance audit — 26 July 2026

A page-by-page audit against the brief's structure tables found ten gaps.
Fixed the same day, in code:

- **Publications method filter was dead** — `method` was null on all ten
  records and empty facets don't render, so one of the brief's three named
  filters didn't exist for the user. Four briefs whose titles state their own
  method now carry a draft classification (flagged `needsReview`, same footing
  as the case-study tagging); Year in Review and the anti-racism resources
  stay null honestly. A `country` facet joined `region`, per "Region/Country".
- **The publication tile dropped three of the brief's six fields** — method,
  topic and country now print on the card.
- **Contact's two emails were stacked** — the brief says "deliberately
  side-by-side so that there is no hierarchy". Now two equal columns split by
  a hairline. The signup also moved to first position, where the brief lists it.
- **Distinctives paragraph three had no inline links** — the brief marks it
  "[link to each relevant page]". The client's own phrases now anchor to
  Services and Technical focus, matched by substring, never retyped.
- **Work for us had rewritten client copy and an invented lede** — the
  sentence is verbatim again (including their "sign-up" hyphen, now an anchor
  to the form) and the lede is gone.
- **Case-study method links landed on the Services index** — each service row
  now carries `id={slug}` and opens itself on hash arrival, so the link lands
  on the named service, open.

Documented as deliberate, no action:
- `caseStudySlug` stays null on all ten publications — the brief's own wording
  is conditional ("[If linked…]") and no public output maps cleanly to a case
  study. The client's log frame draws those links; both sides of the bridge
  are built and switch on with the data.
- The footer tagline: the client removed the descriptive blurb; the official
  tagline was added later at Diego's direction as the footer's one line of
  voice. Different sentence, different job.
- The "Type" facet on Publications is an extra beyond the brief's three
  filters; it has values from day one and stays unless the client objects.
- Contact's address labels differ ("Office address" / "Registered address")
  because the client's own docx uses exactly those labels.
- The Case studies intro paragraph is build-written (the brief requires the
  "indicative, not comprehensive" statement but supplies no copy) — needs
  client sign-off, listed in §7.

Still blocked on client assets: six Policies PDFs, 18 partner logo files,
publication cover images, country flags and partner logos for case-study
summary boxes. Note for launch: six pages render review-phase notes aimed at
the client (draft warnings, pending-asset lines); they must strip before go-live.

### Known gaps in this build

- The design system doc pages still demo the v1 publication card and team card. They need resyncing with the site components so the client reviews one system, not two.
- The icon set is still the 54 Lucide-style paths. The custom set is not started.
- `country` is null for 16 of 18 team members. Only Hollow and Thomas state a current base in their bio; the rest name countries they studied or worked in, in the past tense. Guessing where someone lives is not a gap worth filling with an inference.
- 16 of 17 case studies carry `isDerived: true` — the four-section bodies were restructured from Jigsaw's own prose and need the team's approval. Each page says so on the page.

---

## 7. Open questions for the client

Not blockers for the mockup, but they need answers before copy is final.

- **10 years or 15?** The live site says "over the last decade" and they published a *Decade in Review 2013-2023*. The July brief says 15 years. Company 06844615 dates to roughly 2009, so 15 is defensible — but it contradicts their own publication. Pick a founding date and use it everywhere.
- **60+ organisations or 50+?** The live site has said "over 60 organisations" for years. The July brief says "more than 50". Presenting a lower number after years of a higher one reads as decline.
- **Where did "30+ countries" go?** The brief drops it. For a practice whose differentiator is global reach, it's the strongest of the three numbers.
- **Nothing published since 2023.** Last Year in Review is 2021-2022; the Decade in Review ends 2023. A research practice showing no output for three years undercuts the whole site. Worth flagging to Kara directly.
- **Mailing list** — one list or a separate one for vacancies? (Becky's open comment)
- **Concerns-reporting contact** for the Policies page — still `[tbc]`.
- **Citation URL** for the Distinctives statistics.
- **Logo files** — without "Consult", plus the wordmark as PNG and SVG.

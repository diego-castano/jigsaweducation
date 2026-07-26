# Design direction — refinement pass, 26 July 2026

Read this before touching any page. It overrides the first-draft patterns.

**Design read:** redesign-overhaul of presentation, brand preserved. B2B research
consultancy that must feel "clean, not corporate, has character". Dials:
VARIANCE 7 · MOTION 6 · DENSITY 4. Trust-first audience caps the chaos: no
scroll-hijack, no GSAP, no physics.

**What the client called out:** grids that look AI-generated (a module inside a
box inside a card), text-wall hero, pages that are "just text on a flat
background", too much negative space, Services and Technical focus looking
identical, a design that reads 2020 rather than 2026.

---

## Hard rules (all agents)

1. **The design system is law.** Colours only from the tokens in
   `app/globals.css` (@theme). Literata for display (`font-display` +
   `.display-*` optical classes), Lato body, JetBrains Mono for data only.
   Orange stays an accent: roughly one orange element per viewport.
2. **No box-in-box.** A card never contains another bordered/filled slab.
   Structure comes from hairlines (`border-t border-cream-300`), surface bands
   (cream-50 → cream-100 → cream-200 → navy-900) and type scale, not from
   nesting containers. Cards are only for discrete artifacts (a publication, a
   person, a case study).
3. **Eyebrow rationing.** Max 1 uppercase-tracking kicker per 3 sections. The
   first draft put one on every section; delete most of them. A display
   headline needs no label.
4. **Placeholder copy stays visibly placeholder** but never as a dashed slab
   inside a card. Use the redesigned `<Placeholder>` (inline "Copy tbc" chip +
   muted italic). Client-supplied copy is verbatim and untouchable.
5. **No em dashes in any NEW string you write.** Client verbatim copy keeps its
   own punctuation.
6. **Motion is CSS-first.** Use the shared utilities (below). No GSAP, no
   framer-motion, no `window.addEventListener('scroll')`, no new deps.
   Everything honours `prefers-reduced-motion` automatically via globals.css.
7. **Accessibility is non-negotiable:** exactly one h1 per page, no heading
   level skips, focus-visible rings on everything interactive, real buttons
   with `aria-expanded` for anything that expands, WCAG AA contrast.
8. **Do not run builds or dev servers.** The director builds and QAs after.
9. **Keep each page's `export const metadata` intact** (title/description/canonical).
10. **Content and IA are frozen.** Every piece of content on the page today
    stays on the page (the client approved the structure). You are re-presenting,
    not re-scoping. Keep route slugs and section ids (`#our-story`).

## Shared utilities (already in globals.css — use these, don't reinvent)

- `<Reveal>` from `src/site/components/Reveal.jsx` — scroll-reveal wrapper.
  `<Reveal delay={80}>…</Reveal>` staggers children as they enter. Server-safe
  to import (it's a client leaf).
- `.rv` / `.rv-in` — what Reveal drives; don't hand-roll IO observers.
- `.link-sweep` — underline sweep on hover for inline links.
- `.row-sweep` — full-row background sweep on hover; set the colour with
  `style={{'--sweep': 'var(--color-cream-100)'}}`. Content needs `relative z-[1]`.
- `.expand-grid` / `.expand-grid.open` — smooth height expansion for
  accordions (grid-template-rows 0fr→1fr). Child needs `overflow-hidden`.
- `.marquee` + `.marquee-track` — slow infinite band, pauses on hover.
  **Maximum one marquee on the whole site** — it belongs to the Home partner wall.
- Literata numerals: use `font-display` + `fontVariationSettings: "'opsz' 72"`
  for oversized index numbers; tint them `text-cream-400` (watermark) and let
  them turn `text-orange-500` on the active state.

## Per-page direction

### Home (agent A)
- **Hero, asymmetric 12-col split.** Left (7 cols): sentence 1 as the headline
  in `display-xl`, with "education research" in italic of the same family
  (leading ≥1.1, descender clearance). Sentences 2–4 are NOT a wall: three
  short lines, hairline-top each, staggered `Reveal`, second-level type
  (`text-xl/2xl`, ink-700). CTAs under. Right (5 cols): a real visual — the
  client's own field photo from the Voices of Refugee Youth case study
  (`https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/44/tile_fill_Dubai_Cares_-_ecubed_-_2019_-_participatory_activity.JPG`),
  duotone-treated like TeamCard (grayscale + navy multiply that lifts on
  hover), rounded-2xl, linking to `/case-studies/voices-of-refugee-youth` with
  a quiet caption line. No stock, no invented imagery — photo policy.
  Keep the single-hue orange blobs but subtler (opacity down).
- **Signpost trio: kill the boxes.** Three columns separated by `border-l
  border-cream-300`, generous but not empty: title in `display-m` (h2), inline
  Placeholder summary, arrow link with `.link-sweep`; hover tints the whole
  column (`row-sweep` vertical variant is fine: just bg transition on the
  column). Distinctives column keeps the secondary "Our story" link. No icons
  in tiles — the icon plates were part of the AI look here.
- **Map band** stays sunken; tighten the copy column, drop its kicker.
- **Partner wall → slow two-row marquee** of the typographic plates (real SVG
  logos still pending from client — keep plates honest), hairline frame top and
  bottom, pause on hover, `aria-hidden` duplicate track + sr-only static list.
  Under reduced motion it renders as a static wrapped grid.
- Section rhythm: hero (cream-50) → signposts (cream-50, hairline-framed) →
  map (cream-200) → partners (cream-50) → footer (navy). Only one kicker
  allowed on the whole page — spend it on the map or partners, not both.

### Services (agent B) — layout family: sticky rail + numbered index rows
The core offer. NOT cards, NOT the accordion boxes from draft one.
- `lg:grid-cols-12`: left rail (4 cols, `sticky top-28`): h1 "Services", intro
  Placeholder, a quiet "Six ways of working" line, then a small nav hint to
  Technical focus/Team. Right (8 cols): six **full-width index rows** separated
  by hairlines only.
- Each row: oversized Literata numeral (01–06, opsz 72, `text-cream-400`,
  turns orange when open), title `display-s/m`, chevron→rotates. Row is one
  `<button aria-expanded>` (h2 wraps it). Hover: `.row-sweep` cream-100.
  Open: `.expand-grid` reveals summary (Placeholder inline) + related case
  studies as a 2-col link list with arrows, plus the service icon rendered
  LARGE (size 80–96, strokeWidth 1) as a ghosted watermark right-aligned
  behind the panel (`text-sea-200`, aria-hidden).
- First row starts open so the page never looks empty.
- Mobile: rail unsticks and stacks above; rows keep behaviour.
- End: CrossLinks (agent E redesigns its internals; keep the import + hrefs).

### Technical focus (agent C) — layout family: asymmetric mosaic + detail panel
MUST read as a different page from Services at a glance.
- After a compact opener (h1 + intro, no kicker), an **asymmetric mosaic** of
  the 8 areas on `lg:grid-cols-12`: two feature tiles (6 cols each, taller),
  then rows of 4-col and 3-col tiles — deliberate size variety, exact cell
  count (8 items → 8 cells, no fillers).
- **Icons are the heroes here** (the client asked for icon priority, shown
  differently): each tile carries its icon twice — crisp at 28 in a corner
  plate, and oversized (110–140px, strokeWidth ~0.8) bleeding out of the
  bottom-right corner at 8–12% opacity as a ghost glyph (`aria-hidden`).
- Background diversity: most tiles cream-100, one sea-600 (reversed text), one
  navy-900 (reversed), one orange-100. Never all-cream.
- Interaction: tile click (real `<button aria-expanded>`) opens a **full-width
  detail band** directly beneath the mosaic — selected tile gets an orange
  ring; the band shows the big icon, summary Placeholder, and related case
  study links in columns. One open at a time; smooth with `.expand-grid`.
  Mobile: tiles stack single-column and the band opens in place under the
  tapped tile (accordion behaviour).
- End: CrossLinks.

### Distinctives (agent D) — editorial density, watermark numerals
Kill the empty feel; this is the manifesto page.
- Opener: two-column editorial (left: h1 + client para 1 set large
  `text-xl/2xl`; right: para 2 as running text). No kicker, no info-boxes.
- **Stats band** (navy-900, full-bleed): keep the three figures but let them
  count up on first reveal (small client-leaf `CountUp` you may create in
  `src/site/components/distinctives/`; rAF on textContent, IO-triggered,
  reduced-motion renders final value). Citation footnote becomes one quiet
  mono line under the band, not a dashed box.
- Para 3 + preamble as a full-width editorial moment: para 3 in Literata
  `display-s` italic accents allowed.
- **The five distinctives:** full-width rows, hairlines between, each with a
  giant watermark numeral (opsz 72, 120–160px, `text-cream-300`, positioned
  behind/left, aria-hidden), title `display-s` (h2 or h3 consistent with
  outline), summary Placeholder inline, generous but filled: on lg the row is
  a 12-col grid with the numeral occupying the left 3 cols and text 7 cols —
  offset, not centered. Hover: numeral tints orange, row sweeps cream-100.
- **Our story** (#our-story stays): split layout with a vertical timeline rail
  (hairline + orange dots) even while milestones are placeholder — render 3
  placeholder milestone slots with Placeholder inline lines. The
  founding-date caveat becomes a single footnote line (mono, ink-500), not an
  info card.
- End: CrossLinks.

### Shared (agent E) — CrossLinks, boneyard, image polish
- **CrossLinks → "Continue" band.** Same props API (`hrefs`). Internals: not
  three boxes — stacked full-width rows, each `border-t border-cream-300`,
  display-m title left, one-line blurb under it (ink-600, small), arrow right
  that slides 8px on hover, `.row-sweep` cream-100, whole row is the link.
  One small "Continue" label at top (this is one of the page's rationed
  eyebrows — fine, it's a nav device). Compact: rows ~py-8. This kills the
  negative-space complaint everywhere at once.
- **Boneyard integration** (`boneyard-js` is already a dependency):
  1. `src/site/components/SmartImage.jsx` ('use client'): img wrapper that
     shows the `.shimmer` skeleton until load, then fades the image in 300ms.
     Props: `src, alt, className, imgClassName, aspect`. Reduced-motion: no fade.
  2. Wire SmartImage into `TeamCard`, `CaseStudyCard`, `PublicationCard`
     (cover slot) — replace the raw `<img>`s. Do NOT change those cards'
     layout, only the image loading.
  3. `app/(site)/loading.jsx`: route-transition skeleton matching the page
     anatomy (header spacer, hero block, 3-col grid) using `.shimmer` blocks —
     skeletal loaders matching layout shape, no spinners.
- Do not touch CrossLinks' consumers.

## File ownership (hard boundaries)

| Agent | Owns | Frozen for them |
|---|---|---|
| A | `app/(site)/page.jsx`, `SignpostTrio.jsx`, `PartnerLogoWall.jsx`, `WorldMap.jsx` (polish only) | everything else |
| B | `app/(site)/services/page.jsx`, new files under `src/site/components/services/` | ExpandableCard (stop importing it, don't edit it) |
| C | `app/(site)/technical-focus/page.jsx`, new files under `src/site/components/technical-focus/` | same |
| D | `app/(site)/distinctives/page.jsx`, new files under `src/site/components/distinctives/` | |
| E | `CrossLinks.jsx`, new `SmartImage.jsx`, `TeamCard.jsx`/`CaseStudyCard.jsx`/`PublicationCard.jsx` (image wiring only), `app/(site)/loading.jsx` | card layouts |

Frozen for everyone: `app/globals.css`, `Reveal.jsx`, `Placeholder.jsx`,
`Section.jsx`, `PageHero.jsx`, `SiteHeader/Footer/Logo`, `Icon.jsx`, all of
`src/data/` (exception: agent D may create `src/data/testimonials.js`), all of
`src/design-system/`. If you need a keyframe the utilities don't cover, inline
a uniquely-prefixed `<style>` in your own component.

---

## Reference addendum (verified against Clay.global, Koto, Bakken & Bæck, Pentagram, Nesta)

Patterns confirmed in production on awarded consultancy sites. Apply these
numbers, they are the difference between "intentional" and "Webflow template":

- **Arrow nudge is 6–8px, never 20px.** 250ms ease-out.
- **Underline sweep is directional**: enters from the left, exits to the right
  (`.link-sweep` already does this, just use it).
- **Numbered rows (Services)**: numeral at 15–20% opacity behind the title,
  jumps to full orange on hover/open; title nudges 8–12px right on hover
  (`transform`, 350ms, ease-emphasized). This is Clay's verified "01/02/03" pattern.
- **Bleeding numerals (Distinctives)**: 140–200px Literata, 8–12% opacity,
  absolutely positioned and partially cropped by the row edge. Text alternates
  left/right rows (max 2 consecutive same side).
- **Marquee**: 60s per cycle, not 40 (slow reads premium; fast reads ad banner).
- **Photo filter lift on hover**: 500ms on the filter transition.
- **Stat rows in hero** (Clay): allowed as ONE quiet mono line under the hero
  photo (the three brief figures). Not a badge strip, not a trust wall.
- **Anti-pattern confirmed on Nesta.org.uk**: clean hero followed by three
  equal mission cards, exactly what the client rejected. Do not rebuild it.
- **Pull quote for Distinctives** (real client testimonial from the live site,
  agent D: put it in `src/data/testimonials.js` and render it between
  distinctives 3 and 4, full-width, Literata italic display-s, no quote marks,
  attribution "IDRC" on a plain line):
  "Jigsaw pushed our own thinking to the next level… we consider them as
  thought partners."
- **No scroll cues** anywhere (banned), and the "category micro-label per
  distinctive row" idea from the reference pass is REJECTED: it violates
  eyebrow rationing. The numeral alone carries the scan anchor.

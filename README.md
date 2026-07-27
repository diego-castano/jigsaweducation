# Jigsaw Education Evidence — Website

The full site rebuild for **Jigsaw Education Evidence** ([jigsaweducation.org](https://www.jigsaweducation.org/)): eleven routes over the client's approved sitemap, plus the living design system preserved at [`/design-system`](https://jigsaweducation-production.up.railway.app/design-system).

## Stack

- **Next.js 16** — App Router, static prerendering (62 pages), per-route metadata, generated `sitemap.xml` and `robots.txt`
- **React 19** · **Tailwind CSS v4** — tokens declared in `app/globals.css` under `@theme`
- **Literata** (variable, multi-axis) + **Lato** + **JetBrains Mono**, self-hosted via [@fontsource](https://fontsource.org)
- **cobe** — the 5KB WebGL globe behind the home hero
- **d3-geo + world-atlas** — the interactive world map and the office locator plates, no tile provider, no API keys

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
```

## Build & deploy

```bash
npm run build        # static prerender, all routes
npm run start        # production server on $PORT
```

Railway builds from `main` via `nixpacks.toml` (`npm ci` → `next build` → `next start`). No environment variables required yet; Mailchimp wiring lands with the backend phase.

## Project structure

```
app/
├── (site)/              # public site: 11 routes, shared chrome in layout.jsx
│   └── template.jsx     # route-enter transition (app-shell effect)
├── design-system/       # the v1 design-system document, preserved
├── sitemap.js · robots.js · opengraph-image.jsx · icon.svg
src/
├── data/                # ALL content lives here — bios, case studies,
│                        #   publications, services, focus areas, offices.
│                        #   The future CMS replaces these files, not the pages.
├── site/components/     # site-only components (header, footer, tab bar, cards…)
├── components/          # design-system primitives (also used by /design-system)
├── design-system/       # the 30 documentation pages
docs/
├── build-plan.md        # decisions, feedback fixes, audits, open client items
├── design-direction.md  # the design rules every page follows
├── CHANGELOG.md         # session-by-session build history
└── client/              # client-private material (gitignored — public repo)
```

## Conventions that keep this scalable

- **Content is data.** Pages render from `src/data/*`; placeholder copy is marked with the `placeholder()` helper and renders visibly unfinished via `<Placeholder>`. Swapping in the client's copy is a data edit, never a layout edit.
- **Client copy is verbatim.** Anything the client wrote is never retyped — emphasis and inline links are applied by exact-substring split (`withItalic`, `withInlineLinks` in `distinctives/page.jsx`).
- **Motion is CSS-first** and lives in `globals.css` (`.rv`/`<Reveal>`, `.link-sweep`, `.row-sweep`, `.expand-grid`, `.marquee`, `.tactile`, `.route-enter`). Everything collapses under `prefers-reduced-motion`.
- **A11y is enforced, not aspired to**: one `h1` per page, no heading skips, meta description on every route — checked against the prerendered HTML in `.next/server/app`.
- **Assets still owed by the client** (partner logos, policy PDFs, publication covers, flags) render as honest, documented fallbacks — never invented stand-ins.

## Credits

Design & build · Diego Castaño · v2.0 · July 2026

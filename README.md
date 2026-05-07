# Jigsaw 2026 — Design System

The presentation-ready design system for **Jigsaw Education Evidence**.
Foundations, components, motion patterns, site templates, brand applications, and documentation — all in one scrollable document.

## Stack

- **Vite 5** — bundler with code-splitting and Lightning CSS minification
- **React 18** — with `lazy()` + `Suspense` for per-section code splitting
- **Tailwind CSS v4** — via the official Vite plugin, tokens declared in `src/app.css` with `@theme`
- **Boneyard** — auto-generated skeleton loading placeholders ([github.com/0xGF/boneyard](https://github.com/0xGF/boneyard))
- **Self-hosted fonts** — Fraunces (variable), Lato, JetBrains Mono via [@fontsource](https://fontsource.org)
- **Express + compression** — production static server for Railway

## Develop

```bash
npm install
npm run dev          # Vite dev server, hot reload, http://localhost:5173
```

## Build & preview

```bash
npm run build        # → ./dist
npm run preview      # serve the production build locally on :4173
```

## Generate boneyard skeletons (optional)

The skeleton wrapper has a built-in shimmer fallback, so the site works without
boneyard snapshots. To generate pixel-accurate skeletons from your real layout:

```bash
npm run boneyard:generate
```

(Requires `boneyard-js` CLI to discover `<Skeleton>` markers and snapshot them.)

## Deploy to Railway

This repo includes both `railway.json` and `nixpacks.toml`. Railway will:

1. `npm ci` (install)
2. `npm run build` (Vite build → `./dist`)
3. `node server.js` (Express static server, listens on `$PORT`)

Connect the repo in Railway. No environment variables required.

```bash
# Or deploy via the Railway CLI
railway up
```

The Express server (`server.js`) sets:
- `Cache-Control: max-age=1y, immutable` on `/assets/*` (Vite-hashed filenames)
- `Cache-Control: max-age=1h` on everything else
- `gzip` compression for HTML, JS, CSS, JSON
- SPA fallback: every unmatched route serves `index.html`

## Speed optimisations applied

- Per-section `React.lazy()` + `<Suspense>` → only the visible code ships first
- Manual chunks split for `react`, `boneyard`, `fonts`, and remaining `vendor`
- Self-hosted fonts (no Google Fonts CDN round-trip)
- Tailwind v4 generates only the classes used (built-in tree-shake)
- Lightning CSS minification
- All Unsplash images use `?auto=format&q=80` and `loading="lazy"`
- `dns-prefetch` + `preconnect` for `images.unsplash.com`
- `prefers-reduced-motion` honoured — animations short-circuit
- Express `compression()` for gzip on all text responses

## Project structure

```
src/
├── App.jsx                # single-page scroll shell + scroll-spy
├── main.jsx               # React entry
├── app.css                # tokens (@theme) + base styles + dark mode
├── components/            # shared primitives
│   ├── Sidebar.jsx
│   ├── LogoMark.jsx       # uses /public/logo.png
│   ├── Icon.jsx
│   ├── Btn.jsx · Badge.jsx · Card.jsx · Section.jsx · PageHeader.jsx
│   ├── CodeBlock.jsx · Swatch.jsx · Splash.jsx · CopyToast (in-App)
│   ├── PublicationCard.jsx · TeamCard.jsx
│   └── SkeletonWrapper.jsx
├── pages/                 # 30 lazy-loaded sections
├── data/                  # nav.js · publications.js · team.js · tokens.js
├── hooks/                 # useCopy.js · useScrollSpy.js
└── icons/                 # ICON_PATHS (Lucide-style stroke 1.5)
public/
└── logo.png               # the official Jigsaw J badge
```

## Credits

Design & build · Diego Castaño · v1.0 · March 2026
Built for [jigsaweducation.org](https://www.jigsaweducation.org/).

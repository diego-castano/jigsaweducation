# Prompt: Jigsaw Education Evidence — Design System 2026

Build a comprehensive, presentation-ready design system website for **Jigsaw Education Evidence** using **Vite + React + Tailwind CSS v4**. The deliverable is a static site that will be deployed to GitHub Pages and shared with the client. It must be polished, professional, and showcase EVERY foundation, component, motion pattern, and site module.

## Project Setup

```bash
npm create vite@latest jigsaw-design-system -- --template react
cd jigsaw-design-system
npm install
npm install -D tailwindcss@latest @tailwindcss/vite postcss autoprefixer
npm install lucide-react framer-motion react-router-dom
```

Configure Tailwind v4 with the Vite plugin. Use a single `app.css` with `@import "tailwindcss"` and CSS variables for the design tokens.

Configure `vite.config.js` with `base: '/jigsaw-design-system/'` for GitHub Pages.

## Project Structure

```
src/
├── App.jsx (router shell with sidebar nav)
├── app.css (tokens + global styles)
├── pages/
│   ├── Home.jsx (cover/intro)
│   ├── Foundations/
│   │   ├── Colors.jsx
│   │   ├── Typography.jsx
│   │   ├── Spacing.jsx
│   │   ├── Radius.jsx
│   │   ├── Elevation.jsx
│   │   ├── Iconography.jsx
│   │   └── Grid.jsx
│   ├── Components/
│   │   ├── Buttons.jsx
│   │   ├── Inputs.jsx
│   │   ├── Cards.jsx
│   │   ├── Badges.jsx
│   │   ├── Navigation.jsx
│   │   ├── Feedback.jsx
│   │   └── Containers.jsx
│   ├── Motion.jsx
│   ├── Modules/
│   │   ├── Hero.jsx
│   │   ├── Footer.jsx
│   │   ├── PublicationCard.jsx
│   │   ├── TeamCard.jsx
│   │   ├── CaseStudyCard.jsx
│   │   ├── Stats.jsx
│   │   ├── Filters.jsx
│   │   └── EmptyStates.jsx
│   └── Documentation/
│       ├── Principles.jsx
│       ├── VoiceAndTone.jsx
│       └── Accessibility.jsx
└── components/ (shared building blocks for the showcase itself)
    ├── Sidebar.jsx
    ├── PageHeader.jsx
    ├── TokenCard.jsx
    ├── ComponentDemo.jsx
    └── CodeBlock.jsx
```

---

## Design Tokens (in app.css)

```css
@import "tailwindcss";

@theme {
  /* === BRAND COLOURS === */
  /* Primary palette - from existing brand guidelines */
  --color-orange-500: #ff7816;
  --color-orange-400: #ff9445;
  --color-orange-300: #ffb077;
  --color-orange-200: #ffcca8;
  --color-orange-100: #ffe8da;
  --color-orange-50:  #fff4ed;

  --color-sea-700: #2d5a6f;
  --color-sea-600: #366d85;
  --color-sea-500: #407c9b;  /* primary brand */
  --color-sea-400: #6296af;
  --color-sea-300: #87b1c4;
  --color-sea-200: #b1ccd8;
  --color-sea-100: #d8e6ec;
  --color-sea-50:  #ecf3f6;

  --color-navy-900: #1a3340;
  --color-navy-800: #234454;
  --color-navy-700: #2c5368;  /* deep primary */
  --color-navy-600: #426c83;
  --color-navy-500: #5d869d;
  --color-navy-400: #7ea3b8;
  --color-navy-300: #a3c0d0;
  --color-navy-200: #c8dae5;
  --color-navy-100: #e3edf2;

  /* === NEUTRALS — WARM CREAM PALETTE (2026 evolution) === */
  --color-cream-50:  #FDFAF4;  /* lightest, page background */
  --color-cream-100: #FAF6EE;  /* default neutral background */
  --color-cream-200: #F2EDE0;  /* subtle elevation */
  --color-cream-300: #E8E2D2;  /* borders, dividers */
  --color-cream-400: #C9C2B0;
  --color-cream-500: #9C9583;

  --color-ink-900: #1A1A17;    /* body text on cream */
  --color-ink-800: #2B2B26;
  --color-ink-700: #44443D;
  --color-ink-600: #6B6B61;
  --color-ink-500: #8E8E83;

  /* === EXTENDED (data viz, illustrations) === */
  --color-cyan: #66c8d8;
  --color-teal: #52a0b2;
  --color-emerald: #1c998a;
  --color-amber: #f9b233;
  --color-coral: #ff421d;

  /* === SEMANTIC === */
  --color-success: #1c998a;
  --color-warning: #f9b233;
  --color-error:   #d63a1a;
  --color-info:    #407c9b;

  /* === TYPOGRAPHY === */
  --font-display: 'Fraunces', 'Georgia', serif;
  --font-body: 'Lato', 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;

  /* Type scale */
  --text-display-xl: 5.5rem;   /* 88px */
  --text-display-l:  4rem;     /* 64px */
  --text-display-m:  3rem;     /* 48px */
  --text-h1:         2.5rem;   /* 40px */
  --text-h2:         2rem;     /* 32px */
  --text-h3:         1.5rem;   /* 24px */
  --text-h4:         1.25rem;  /* 20px */
  --text-body-l:     1.125rem; /* 18px */
  --text-body-m:     1rem;     /* 16px */
  --text-body-s:     0.875rem; /* 14px */
  --text-caption:    0.75rem;  /* 12px */

  /* === SPACING (8pt base) === */
  --space-1:  0.25rem;  /* 4 */
  --space-2:  0.5rem;   /* 8 */
  --space-3:  0.75rem;  /* 12 */
  --space-4:  1rem;     /* 16 */
  --space-5:  1.25rem;  /* 20 */
  --space-6:  1.5rem;   /* 24 */
  --space-8:  2rem;     /* 32 */
  --space-10: 2.5rem;   /* 40 */
  --space-12: 3rem;     /* 48 */
  --space-16: 4rem;     /* 64 */
  --space-24: 6rem;     /* 96 */
  --space-32: 8rem;     /* 128 */

  /* === RADIUS === */
  --radius-xs:   2px;
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-2xl:  32px;
  --radius-full: 9999px;

  /* === ELEVATION (subtle, warm shadows) === */
  --shadow-xs: 0 1px 2px rgba(44, 83, 104, 0.04);
  --shadow-sm: 0 2px 4px rgba(44, 83, 104, 0.06);
  --shadow-md: 0 4px 12px rgba(44, 83, 104, 0.08);
  --shadow-lg: 0 12px 24px rgba(44, 83, 104, 0.10);
  --shadow-xl: 0 24px 48px rgba(44, 83, 104, 0.12);

  /* === MOTION === */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);

  --duration-instant: 100ms;
  --duration-fast:    200ms;
  --duration-base:    300ms;
  --duration-slow:    500ms;
  --duration-slower:  800ms;

  /* === BREAKPOINTS === */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Body defaults */
body {
  background: var(--color-cream-50);
  color: var(--color-ink-900);
  font-family: var(--font-body);
  font-size: var(--text-body-m);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--color-navy-900);
}
```

Load Google Fonts in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Lato:wght@300;400;700;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Page Specifications

### Home (Cover)

A full-height landing page with:
- Massive Fraunces display title: "Jigsaw 2026" (--text-display-xl)
- Subtitle: "Design System & Brand Evolution"
- Brief intro paragraph (~3 sentences) explaining the system
- The Jigsaw J logo mark (use `https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/theme/logo/1/logo_Jigsaw_logo_thin_left.png` or recreate as SVG)
- Decorative blob shapes in sea-500 and orange-500 (subtle, organic)
- Bottom: small grid of section previews (Foundations, Components, Motion, Modules, Documentation) as clickable cards leading into each area
- Subtle grain texture overlay on the cream background

### Foundations / Colors

Show ALL color tokens visually:
- Primary palette section: Orange, Sea Blue, Navy, each with full scale (50–900) as swatches with hex codes
- Cream/Neutral palette: full scale with hex codes
- Ink (text) palette: full scale
- Extended palette: cyan, teal, emerald, amber, coral as individual swatches
- Semantic colors: success, warning, error, info — each with usage example
- Show the **3:1 ratio rule** visually: a horizontal bar showing 75% sea/cream + 25% orange/navy
- Accessibility: contrast ratio chart showing which combinations pass WCAG AA / AAA

Each swatch is a card with: color block, name, hex, RGB, CSS variable name, and a "Copy" button.

### Foundations / Typography

- Display the type pairing: **Fraunces (display) + Lato (body)** with rationale
- Render every size in the scale with name, pixel value, REM value, line height
- Show weights: Lato (300, 400, 700, 900), Fraunces (300, 400, 500, 600)
- Show real headings using each style: H1 example, H2 example, etc.
- Demonstrate optical sizing for Fraunces (it's a variable font)
- Pull quote example using Fraunces italic at large size
- Body paragraph example with proper line-height
- Caption and small text examples
- Pairing examples: H1 + body, H2 + body, etc.

### Foundations / Spacing

- Visualise the 8pt scale: horizontal bars showing each spacing token
- Usage examples: card with internal padding, gaps between cards, section spacing
- Annotated diagram of a typical layout showing which tokens are used where

### Foundations / Radius

- Show every radius token applied to a square: xs, sm, md, lg, xl, 2xl, full
- Usage guidance: when to use each (buttons, cards, pills, images)
- Photo example with rounded corners (16px and 24px versions)

### Foundations / Elevation

- Show 5 cards stacked, each with a different shadow level (xs to xl)
- Annotated to show pixel values and rgba
- Usage guidance: when to elevate (cards on hover, modals, dropdowns)

### Foundations / Iconography

Use **Lucide React** as the icon library. Display a curated grid of relevant icons:
- Education / research: BookOpen, GraduationCap, FileText, FlaskConical, Microscope
- Geography: Globe, MapPin, Map, Compass
- People / community: Users, User, UserCheck
- Communication: Mail, MessageCircle, Send, Phone
- Actions: Download, ExternalLink, Search, Filter, ChevronRight
- Status: Check, X, AlertCircle, Info
- Show three sizes (16, 24, 32) with usage guidance
- Show stroke weight rules (1.5px standard)

### Foundations / Grid

- Visualise 12-column grid with gutters
- Show breakpoints with current viewport indicator
- Container max-widths
- Example layouts: 2-col, 3-col, 4-col, asymmetric

---

### Components / Buttons

Every variant, size, and state:
- **Variants**: Primary (orange filled), Secondary (navy filled), Tertiary (sea outline), Ghost (text only), Destructive
- **Sizes**: XS, SM, MD, LG, XL
- **States**: Default, Hover, Active, Focus (visible focus ring), Disabled, Loading
- **With icons**: leading icon, trailing icon, icon-only
- **Pill variant**: full radius (matches Brightaid reference)
- **Floating Action Button (FAB)**: circular, fixed-position example
- Code snippet block showing usage for each
- Accessibility note: minimum 44px touch target, focus ring requirements

### Components / Inputs

- Text input: default, filled, focused, error, disabled
- Textarea
- Select / dropdown (build a custom one matching the design)
- Checkbox: unchecked, checked, indeterminate, disabled
- Radio button
- Toggle / switch
- File upload (publication PDF example)
- Search input with leading icon
- All with proper labels, helper text, error messages
- Form composition example (full contact form mockup)

### Components / Cards

- Basic card (cream background, subtle border)
- Elevated card (with shadow)
- Image card (publication thumbnail style)
- Profile card (team member style)
- Stat card (number + label, like Brightaid's $385,970.70)
- Action card (with CTA button)
- Show hover states with subtle lift animation

### Components / Badges

- Solid badges: orange, sea, navy, semantic colors
- Outline badges
- Pill tags with close button (filter chips)
- Status indicators (active dot + label)
- Sizes: SM, MD

### Components / Navigation

- Top navbar: logo + nav links + CTA (mimicking Brightaid)
- Mobile hamburger version
- Sidebar nav (with active state)
- Breadcrumbs
- Pagination
- Tab navigation (for Evidence Library filters)
- Dropdown menu

### Components / Feedback

- Alert: info, success, warning, error variants
- Toast notification (with auto-dismiss demo)
- Progress bar (linear)
- Spinner / loading indicator
- Skeleton loader (for publication card loading state)
- Empty state illustration

### Components / Containers

- Modal / dialog (with overlay)
- Drawer (right-side slide-in)
- Accordion (FAQ-style, used in discovery brief)
- Tooltip
- Popover
- Tabs

---

### Motion

A dedicated page demonstrating motion principles:
- **Easing curves**: Animated balls demonstrating standard, decelerate, accelerate, emphasized — each with the cubic-bezier visualisation
- **Duration scale**: 5 boxes animating with each duration token (100ms to 800ms), so the user can feel the difference
- **Microinteractions**: Hover lift on a card, button press, focus ring transition, accordion expand
- **Page transitions**: Demonstrate fade-in-up entrance, stagger children
- **Patterns**: Modal entry/exit, drawer slide, toast slide-in, skeleton shimmer
- Use **Framer Motion** for all animations
- Code snippet for each pattern
- Principle: motion should be subtle and purposeful — never decorative

---

### Modules / Hero

Show 3 hero variations, each fully built:
1. **Headline-first hero** (no photo): large Fraunces title on cream, decorative blob shapes, primary CTA + secondary link
2. **Photo hero** (with own-photo policy): full-width photo with rounded corners, navy duotone overlay, headline + CTA overlaid (mimics Brightaid)
3. **Editorial split hero**: left column with title and intro copy, right column with stats card or featured publication (mimics AbegChop)

### Modules / Footer

Build a complete footer matching the discovery brief and Jigsaw's needs:
- Logo + tagline column
- Navigation columns (Services, Resources, About, Contact)
- Mailing list signup (cream background, orange button)
- Social links (LinkedIn only — explicitly note no Twitter/X)
- Bottom bar: copyright, registered company info, registered office, VAT number
- Small accessibility statement link

### Modules / Publication Card (Evidence Library)

The KEY component for the project. Build the publication card with:
- Type tag (Learning Brief / Policy Brief / Research Report / Year in Review)
- Title (Fraunces, prominent)
- Authors (Lato, smaller)
- Date + region tags
- Short summary (2-3 lines, truncated)
- Action: "Read PDF" or "View on external site" with appropriate icon
- Hover state with subtle elevation
- Show 4-6 examples in a grid, with realistic mock data

### Modules / Team Member Card

- Photo (rounded full or rounded square)
- Name + role
- Brief bio (2 lines, truncated)
- LinkedIn + ORCID icons
- Hover: shows full bio in expanded card
- Show 3-4 examples with realistic mock data (use Jigsaw team names from the discovery brief)

### Modules / Case Study Card

- Country/region tag
- Project title (Fraunces)
- Client/funder logos (small)
- 1-line description
- "Read case study" link
- Optional photo treatment (own-photo, rounded corners)

### Modules / Stats

- Single stat with number + label (Fraunces number, Lato label)
- Stat group: 3-4 stats in a row (countries, organisations, years, projects)
- Animated counter on scroll-into-view
- Variants: cream background, navy background, image background with overlay

### Modules / Filters (Evidence Library)

- Filter bar layout: search + multiple dropdowns + sort
- Active filter chips below
- "Clear all" link
- Result count
- Loading state
- Empty state (no results) with helpful copy

### Modules / Empty States

- No publications match filter
- No case studies in this region yet
- 404 page (custom illustration with J mark)
- Search no results

---

### Documentation / Principles

Write 5 design principles as full sections:
1. **Evidence over decoration** — Every element must earn its place. No visual noise.
2. **Dignity in storytelling** — Imagery and language respect the people we work with.
3. **Clarity for stakeholders** — Donors, partners, and researchers find what they need within two clicks.
4. **Calm credibility** — Subtle motion, generous space, considered typography. We don't shout.
5. **Accessible by default** — WCAG AA minimum, multilingual-ready, mobile-first.

Each principle gets a paragraph explaining the rationale and a small "in practice" example.

### Documentation / Voice & Tone

- Voice attributes: rigorous, warm, clear, grounded
- Tone shifts by context (research output → formal; team page → personable; case study → narrative)
- Do/Don't examples in side-by-side cards
- Word choices: prefer "evidence" over "data points", "communities" over "beneficiaries", etc.
- Plain English commitment

### Documentation / Accessibility

- WCAG AA commitment
- Color contrast checker showing all primary combinations with their ratios
- Focus management rules
- Keyboard navigation guidance
- Screen reader notes
- RTL preparation (mention Arabic via Tajawal font)
- Multilingual considerations (auto-translation system)
- Image alt-text guidelines (per photo policy)

---

## Sidebar Navigation (Persistent)

Left-side fixed sidebar (260px wide), cream-100 background, subtle right border. Contains:
- Logo at top (J mark + "Jigsaw 2026")
- Grouped nav with collapsible sections:
  - Overview (Home)
  - Foundations (7 items)
  - Components (7 items)
  - Motion
  - Modules (8 items)
  - Documentation (3 items)
- Active state: orange-500 left border, navy-900 text, cream-200 background
- Hover state: cream-200 background
- Bottom: link to GitHub repo + version number ("v1.0 · March 2026")
- Mobile: collapses to top hamburger

## Page Layout Pattern

Every page follows this structure:
1. **Page header**: Fraunces title + Lato subtitle/description + breadcrumbs
2. **Section blocks**: each major topic as its own block with H2 + content + optional code snippet
3. **Spacing**: generous (--space-16 between sections)
4. **Code snippets**: dark cream background, JetBrains Mono, syntax highlighted (use `react-syntax-highlighter`)
5. **Token cards**: every visual demo paired with the underlying token name and value

---

## Design Direction Reminders

- **Cream cream cream**. Never pure white as a page background. Always `cream-50` or `cream-100`.
- **Fraunces for everything that wants to feel important**. Lato for everything else.
- **Subtle shadows only**. Use `shadow-md` or smaller for 90% of cases.
- **Generous space**. Don't crowd things. Padding minimums: 24px on cards, 64px between sections, 96px between major page areas.
- **Orange is precious**. Reserve orange-500 for primary CTAs and accents only. The 3:1 rule means most of the page is sea/cream/navy, with orange used sparingly.
- **Rounded everything**. Default radius: lg (16px) for cards, full for buttons (pill shape), xl (24px) for images.
- **Decorative elements**: subtle organic blobs in sea-200/orange-200 at low opacity, or the J pattern as faded background texture (5-8% opacity). Use sparingly.
- **No emojis anywhere in the design system**. Use Lucide icons only.
- **Photography (when shown in modules)**: rounded corners, optional navy duotone overlay, never crop tightly on faces.

## Mobile Responsiveness

- Sidebar collapses to hamburger drawer below 1024px
- All grids reflow to single column below 768px
- Touch targets minimum 44px
- Typography scales down: display-xl becomes display-l on mobile

## Final Polish

- Add `framer-motion` page transitions: fade-in-up with 200ms duration
- Smooth scroll behavior site-wide
- Custom scrollbar styled in cream/sea palette
- Keyboard shortcuts for nav (J/K to navigate sections)
- Print stylesheet that hides sidebar
- Favicon: the J mark
- `<title>`: "Jigsaw 2026 · Design System"
- Meta description: "The design system for Jigsaw Education Evidence — foundations, components, motion patterns, and documentation for the 2026 brand evolution."
- Open Graph image: cream background with the J mark and "Jigsaw 2026 Design System" title

## Build & Deploy

After everything is built:
```bash
npm run build
```
Output goes to `dist/`. For GitHub Pages, ensure `vite.config.js` has the correct `base` path. Add a deploy script using `gh-pages` package if needed.

---

## Acceptance Criteria

The system is complete when:
- Every foundation token is documented and visualised
- Every component variant has at least one demo with all states shown
- Every site module is built with realistic Jigsaw mock data (use names from the discovery brief)
- All three documentation pages are written with substantive content
- The site is fully responsive and accessible (WCAG AA)
- Total Lighthouse score: Performance 90+, Accessibility 100, Best Practices 100
- Single deployable static build under 2MB gzipped

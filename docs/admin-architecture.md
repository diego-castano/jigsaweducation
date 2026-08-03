# Admin architecture — the content backend

The CMS phase. `docs/CHANGELOG.md` set the contract: `src/data/*` is the
interface, the backend replaces those files, the pages stay. This document
fixes the architecture so every implementation task builds the same system.

## What the client gets

A branded console at `/admin` where a non-technical editor can change every
text, image and list on the public site, see a live preview of the page they
are editing, upload files, and publish when ready. No URLs typed by hand, no
raw JSON, no fields that can break the layout.

## Stack

Everything lives in this repo and deploys as the one existing Railway service.

- **Postgres** (Railway `JigsawDB`) through `pg`. No ORM: the store is a
  document model, two tables carry all content.
- **Railway bucket** (S3-compatible, `t3.storageapi.dev`) through
  `@aws-sdk/client-s3`. Objects are private; the app serves them from
  `/media/[...key]` with immutable cache headers.
- **Auth**: email + password (`bcryptjs`), stateless session in an httpOnly
  cookie signed with `jose`. Single-tenant; an account page changes email and
  password.
- **Mutations**: server actions. Route handlers exist only where actions
  cannot reach: media proxy, preview toggle, login POST target if needed.
- **Admin UI**: same Tailwind v4 theme, same fonts, same tokens as the site.
  The console is on-brand Jigsaw, chrome tinted navy so site and admin never
  look confusable.

## Data model

```sql
singletons       (key text pk, data jsonb, draft jsonb, updated_at)
collection_items (id uuid pk, collection text, slug text, data jsonb,
                  draft jsonb, sort int, status text, created_at, updated_at,
                  unique (collection, slug))
media            (id uuid pk, key text unique, filename text, mime text,
                  size int, width int, height int, alt text, created_at)
admin_users      (id uuid pk, email text unique, name text,
                  password_hash text, created_at, last_login_at)
revisions        (id uuid pk, target_type text, target_key text, data jsonb,
                  user_email text, saved_at)
subscribers      (id uuid pk, email text unique, source text, created_at)
```

**Singletons** hold page-level copy and configuration: one per site page
(hero copy, section headings, inline sentences, SEO fields — including the
strings currently hardcoded in page JSX) plus `site-settings`, `tracking`,
`seo-defaults`.

**Collections**: `team`, `case-studies`, `publications`, `services`,
`technical-focus`, `partners`, `testimonials`, `jobs`, `policies`,
`map-countries`. Items keep the exact field shape the current `src/data/*`
files export; the wiring phase depends on that equivalence.

**Draft / publish**: editors write to `draft`. Publish copies `draft` into
`data`, snapshots the previous `data` into `revisions`, clears `draft`, and
calls `revalidateTag`. Discard clears `draft`. The public site reads `data`
only; preview (Next `draftMode`) reads `draft ?? data`.

## Field schemas drive the UI

`src/cms/schemas/*.js` declares every singleton and collection: sections,
fields, labels, help text, validation. Field types:

`text`, `textarea` (paragraphs via blank lines, exactly as the data files
store them), `image` (media picker, never a URL input), `link` (internal
route picker or external URL, validated), `email`, `number`, `select`,
`toggle`, `icon` (visual picker over `src/icons`), `list` (ordered sub-items
with add / remove / drag-reorder, each item its own field set), `color`
(brand palette swatches only).

The admin renders forms generically from these schemas. Adding a field later
is a schema edit, not a new screen. Labels and help text are UK English,
written for the client, and they carry the locked editorial rules
("verbatim copy — check with Dave before rewording", photo policy, the
no-hierarchy office rule).

## Read path

`src/lib/content.js` exposes `getSingleton(key)`, `getCollection(name)`,
`getItem(collection, slug)`. Wrapped in `unstable_cache` tagged
`content:<key>`; publish invalidates the tag. Facets stay computed
(`relations.js` logic moves into the loaders). If Postgres is unreachable the
loaders fall back to the seed data in `src/data/*` — a database outage
degrades to yesterday's content, never to a 500.

`scripts/seed.mjs` migrates `src/data/*` into the database verbatim,
idempotently (skips keys that already exist), and creates the first admin
user.

## Admin surface

```
/admin/login       branded sign-in
/admin             dashboard: page cards, draft indicators, recent edits
/admin/pages/:key  singleton editor — form left, live preview right
/admin/:collection list: search, drag-reorder, status chips
/admin/:collection/:id   item editor with preview of its detail page
/admin/media       library: grid, drag-drop upload, alt text, usage
/admin/settings    organisation & contact · navigation · SEO · tracking
                   codes · mailing list & subscribers (CSV export) · account
```

Preview is the real page in an iframe with `draftMode` on, reloaded
(debounced) as the editor autosaves drafts. Width toggle for a phone-size
check. The editor never sees JSX, slugs are generated from titles, images
come from the media library, and destructive actions confirm first.

The review-phase notes rendered on six pages become conditional on a
`site-settings.showReviewNotes` toggle, so launch day is a switch, not a
code change.

The mailing-list form stops being a stub: it writes to `subscribers` and the
admin lists and exports them. Mailchimp stays a later integration.

## Security

`middleware.js` guards `/admin` and all admin actions re-verify the session
server-side. Passwords hashed with bcrypt. Session cookie: httpOnly,
secure, sameSite=lax, 7-day expiry. Media uploads validated by MIME and
size. No secret ever enters the repo: local dev reads `.env.local`
(gitignored), production reads Railway service variables.

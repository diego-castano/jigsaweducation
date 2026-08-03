# Admin UI specification

The console at `/admin`. Companion to `docs/admin-architecture.md`; this file
fixes layout, component contracts and interaction rules so every module ships
the same product. The audience is Kara and Becky: non-technical, publishing a
few times a month. Every label UK English, every action reversible or
confirmed, nothing that can silently break the site.

## Look

The site's own design system, recomposed as a console:

- Canvas `cream-50`, surfaces `cream-100` bordered `cream-200/300`,
  radius `rounded-xl`+.
- Sidebar `navy-900`, text `cream-100`, active item `orange-400` accent bar +
  `navy-800` fill. The site's `J` logo mark on top, label "Console" in
  JetBrains Mono caps.
- Literata for page titles and section headings (opsz working), Lato for UI
  text, JetBrains Mono for slugs, keys, counts and statuses.
- Primary action `orange-500` hover `orange-600`, white text, `rounded-full`,
  `.tactile` press. Destructive: `error-500` outline style, filled only inside
  the confirm dialog. Never coral.
- Focus states `focus-visible:ring-2 ring-orange-500 ring-offset-2` on
  everything interactive. Inputs `text-base` on touch (iOS zoom rule).
- Motion: the site's easing tokens, 150–250ms, `Reveal`-style entrances kept
  subtle; `prefers-reduced-motion` respected (Tailwind `motion-safe:`).

## Shell

```
app/admin/(console)/layout.jsx     auth gate (requireAdmin) + shell
app/admin/(console)/page.jsx       dashboard
```

Desktop: fixed sidebar 260px + content column (max-w none, px-8). Mobile:
top bar with menu button opening the sidebar as a drawer (focus trap, like
the site's). Sidebar nav groups, in order:

1. **Pages** — Home, Services, Technical focus, Distinctives, Team page,
   Case studies page, Publications page, Contact, Policies page, Work for
   us, Not found → `/admin/pages/<key>`
2. **Content** — Team, Case studies, Publications, Services, Technical
   focus, Distinctives, Partners, Testimonials, Jobs, Policies →
   `/admin/collections/<key>`
3. **Library** — Media → `/admin/media`; Subscribers → `/admin/subscribers`
4. **Settings** → `/admin/settings`

Top bar: breadcrumb (mono, small), right side: draft-count chip, "View
site ↗" (new tab), user menu (Account, Sign out). A persistent amber banner
across the console while `site-settings.showReviewNotes` is on: "Review mode
is on — internal notes are visible on the public site." linking to settings.

## UI kit — `src/admin/ui.jsx` (single file, owned by the shell module)

Exports (contract — other modules import these blindly):
`Button` ({variant: 'primary'|'secondary'|'ghost'|'danger', size, icon,
loading}), `IconButton`, `Input`, `Textarea` (auto-grow), `NativeSelect`,
`Switch`, `Badge` ({tone}), `Modal` ({open, onClose, title, footer}) with
focus trap + `overscroll-contain`, `ConfirmDialog` (promise-based
`useConfirm()`), `Toast` (`ToastProvider` + `useToast()`; bottom-right,
auto-dismiss, success/error), `EmptyState` ({icon, title, body, action}),
`Spinner`, `Kbd`, `SearchInput`, `Tabs`, `Tooltip`. All styled per **Look**,
all keyboard-accessible.

## Editor engine — `src/admin/editor/*` (owned by the engine module)

The generic form that renders any schema (see `src/cms/schema.js`).

- `<SchemaForm schema={singleton|collection item} value={merged doc}
  draft={draft|null} onSave={saveDraft action} targetType targetKey>` —
  client component holding form state.
- **Autosave**: 800ms debounce after any change → `saveDraft` with the
  changed fields only. Status pill in the action bar: "Saving…", "Draft
  saved HH:MM", or "Published" when no draft exists. Never a manual save
  button for drafts.
- **Action bar**: sticky bottom, cream-100 blur, contents: status pill ·
  `Preview` toggle · `Discard draft` (ghost, confirm) · `Publish` (primary,
  disabled when no draft). Publish → toast "Published — the site is live
  with your changes."
- **Sections** render as anchored cards with Literata headings; a slim
  in-page section nav (scrollspy, like the design-system sidebar) appears
  when a form has 3+ sections.
- **Field chrome**: label + optional counter (`maxLength`/`maxWords`), help
  text under in `ink-600`, `verbatim` renders a navy chip "Client copy —
  supplied word-for-word", `warning` renders an amber note with the alert
  icon. Validation inline on blur; Publish blocked only on hard errors
  (required empty, invalid email/url).

Field components (one per schema type):

- `text`, `email`, `url`, `number` → Input variants with validation.
- `textarea` → auto-grow, paragraph hint ("Blank line starts a new
  paragraph"), live word count when `maxWords`.
- `richtext` → TipTap WYSIWYG limited to what the site renders: paragraphs,
  bold, italic, links, the two list kinds. Stores HTML once formatted;
  plain seeded text opens converted and only becomes HTML when edited. The
  site renders through `<Prose>` (sanitised server-side, `src/lib/rich-text.js`).
  Long collection forms group via `editorSections` in the schema, which also
  brings the scrollspy rail.
- `select` → styled listbox; with `allowCustom` a combobox with an "Add
  '<value>'" row.
- `icon` → popover grid of the site's 54 icons (rendered live via `Icon`),
  searchable.
- `boolean` → Switch with the label inline.
- `country` → searchable combobox over `src/cms/iso-countries.js`; stores
  `{name, id}`; never shows the numeric id as the primary UI.
- `image` / `file` → framed preview (or dashed empty slot) + "Choose" →
  MediaPicker modal (see Media); "Remove" when `nullable`. Alt text edited
  in place for images. Never a raw URL input.
- `link` → segmented control "Page on this site | External URL": internal
  shows a searchable list of routes and collection items; external a
  validated URL input.
- `list` → rows as collapsible cards: drag handle (@dnd-kit/sortable),
  summary line (first text field), expand to edit, add via ghost button at
  the bottom, remove with confirm. `fixed:true` hides add/remove/drag.
  `minItems`/`maxItems` enforced with a friendly note.

## Singleton editor — `/admin/pages/[key]` (+ `/admin/settings` reuses this)

Two-pane on `xl:`: form left (min 480px), **live preview** right; below
`xl:` the preview is a full-screen overlay behind a "Preview" button.

`<PreviewPane route>`: iframe `src=/api/preview?to=<route>` (draft mode).
Reloads (with a soft fade, no scroll reset — restore scroll position via
postMessage or iframe key + scroll cache) 1.2s after the last successful
autosave. Header: route in mono · device toggle (desktop/390px) · refresh ·
"Open ↗". The pane remembers its open/closed state (localStorage).

## Collections — `/admin/collections/[key]` and `/[key]/[id]`

List: header (title, count in mono, "Add <itemLabel>" primary), SearchInput
filtering client-side, rows: drag handle (when `orderable`), item title
(`titleField`), `listColumns` values in `ink-600`, status badges — "Draft
edits" (amber) when `draft` present, "Hidden" (ink) when status hidden —
row click opens the editor. Reorder persists immediately via `reorderItems`
+ toast.

Item editor: same SchemaForm; preview pane targets `itemRoute` when the
collection has one, else the list `route`. Header: back link, item title,
status switch (Visible/Hidden with plain-language explanation). Footer
"Danger zone" card: slug shown in mono with a lock icon and "Slug changes
break links — contact your developer" (no inline editing); Delete
(ConfirmDialog naming the item, mentions revision snapshot).

"Add" flow: modal asking only for the title/name field → creates hidden
item → routes straight into its editor with a toast "Created as hidden —
publish when ready."

## Media — `/admin/media` + `MediaPicker`

Grid of square tiles (cover-fit thumbs; file-type plate for PDFs), tabs
All / Images / Documents, search by filename/alt, upload via drag-drop
anywhere on the grid (dashed overlay while dragging) or "Upload" button;
multi-file, progress per tile, errors as toasts. Tile click → side drawer:
large preview, filename (mono), dimensions/size/date, alt text field
(autosaves), "Where it's used" list (via `getMediaUsage`), Copy URL,
Delete (blocked with explanation when used; confirm otherwise). The photo
policy line ("Jigsaw's own photography only — no stock, no AI-generated
people") sits quietly under the upload button.

`MediaPicker({accept, onSelect})`: same grid inside a Modal, plus upload;
selecting returns the media record. Owned by the media module; the
image/file fields import it.

## Settings — `/admin/settings`

Tabs (URL-addressable): **Organisation** (site-settings), **Site text**
(ui-strings), **SEO & tracking** (tracking), **Account** (email/password
change forms with current-password confirm), **Subscribers** is its own
route: table (email, source, date, mono), count, "Download CSV" button
(route handler `/admin/subscribers/export`), delete row with confirm.
Settings forms are the same SchemaForm engine (no preview pane except
Organisation, which previews `/`).

## Dashboard — `/admin`

- Greeting with the editor's name, date (en-GB format).
- "Pages" card grid: icon, page title, draft badge when a draft exists,
  Edit / View↗ actions.
- "Content" strip: per-collection counts (mono) linking to lists.
- "Recent changes": last 8 revisions (what, who, when — en-GB relative).
- Review-mode banner when on (same as shell banner, larger).

## Rules

- Every mutation goes through the server actions from
  `src/cms/actions/*` — no client-side fetch to ad-hoc endpoints.
- Server components by default; `'use client'` only where state demands it
  (SchemaForm, pickers, drag lists, preview pane).
- No new dependencies. @dnd-kit, sharp, jose, bcryptjs, pg, AWS SDK are in.
- Empty states everywhere (no blank screens): what this area is, what to do
  first.
- Loading: route-level `loading.jsx` with the site's shimmer skeleton
  pattern.
- Errors: `error.jsx` per route group with a retry button; toasts for
  action failures — never a dead button.
- All destructive paths: ConfirmDialog naming the exact object.
- `aria-*` and focus management to the same standard as the public site.

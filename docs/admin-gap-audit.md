# Jigsaw CMS gap audit — 2026-08-03

Read-only audit of app/(site), src/site/components, src/cms/schemas, src/data and app/admin + src/admin.
Severity: HIGH = client edits something and the site lies or leaks; MED = visible drift or misleading tooling; LOW = polish.

---

## 1. HARDCODED-BUT-VISIBLE (rendered strings the admin cannot edit)

### 1.1 — /case-studies browser ignores four "Site text" fields (wiring bug)
- Files: `src/site/components/CaseStudyBrowser.jsx:69-88` and `src/site/components/FilterBar.jsx:89-110`
- What: CaseStudyBrowser passes `resultCountTemplate` and `resultCountAllTemplate` as top-level props (lines 80-81), but FilterBar only reads them from its `ui` prop — and CaseStudyBrowser never passes `ui` to FilterBar. So on /case-studies the result-count line, the "Sort" label and the "Clear all" link always render the hardcoded defaults, whatever the admin types. PublicationBrowser passes `ui={ui}` (PublicationBrowser.jsx:106) so /publications behaves.
- Severity: HIGH
- Fix: add `ui={ui}` to the FilterBar call in CaseStudyBrowser and drop the two ignored props.

### 1.2 — Policies: internal commentary publishes when the concerns email is empty
- File: `app/(site)/policies/page.jsx:128-131`
- What: with `concernsContact` empty the card prints the hardcoded "Reporting route to be confirmed by the Jigsaw team. A whistleblowing policy without a route to use it does not work." This is build commentary, yet it is NOT gated by `showReviewNotes` — it survives launch if the email stays empty, and the admin cannot edit it.
- Severity: HIGH
- Fix: gate the fallback behind `settings.showReviewNotes` and/or move the sentence into the page-policies schema as an editable review note.

### 1.3 — Case study "[tbc]" explainer is one study's excuse shown on all
- File: `app/(site)/case-studies/[slug]/page.jsx:130-136`
- What: any section whose body is `[tbc]` renders the hardcoded "The source page describes a partnership rather than a study, so there was nothing to restructure here without inventing it." — copy written for one specific study, shown for every study with a `[tbc]` section, uneditable.
- Severity: MED
- Fix: move the sentence into the page-case-studies notices section as an editable field.

### 1.4 — Distinctives citation strings
- File: `app/(site)/distinctives/page.jsx:201, 210`
- What: the "Source:" prefix and the review note "Citation URL to come from the Jigsaw team. Figures should not publish unsourced." are hardcoded. The note is at least gated by showReviewNotes, but every comparable review note lives in a schema field; this one does not.
- Severity: MED
- Fix: add a `statsCitationNote` field to page-distinctives, or reuse REVIEW_NOTE_HELP pattern.

### 1.5 — SiteLogo fallback wordmark and OG-image subtitle ignore the org name
- Files: `src/site/components/SiteLogo.jsx:52-68`, `app/opengraph-image.jsx:44-51`
- What: until a wordmark uploads, the header/footer print hardcoded "Jigsaw" + "Education Evidence"; the share card prints a hardcoded "J" roundel and "EDUCATION EVIDENCE". Renaming the organisation in Settings changes browser titles but never this chrome.
- Severity: MED
- Fix: derive both from `settings.name` (split or a second settings field).

### 1.6 — Metadata-box and filter labels (cluster)
- Files: `app/(site)/case-studies/[slug]/page.jsx:79,87,93` ("Country/ies", "Partner/s", "Method"), `:82` ("Not specified"); `app/(site)/publications/[slug]/page.jsx:54-61` (Type/Date/Region/Country/Method / service/Topic); `src/site/components/CaseStudyCard.jsx:50,56` (Partners/Service); `src/site/components/FilterBar.jsx:148` (dropdown labels title-cased from facet keys: Country, Service, Topic, Region, Method, Type).
- What: every classification label a visitor sees on cards, dropdowns and summary boxes is hardcoded; ui-strings covers none of them.
- Severity: MED (one decision: either add fields or declare labels structural)
- Fix: one `facetLabels` group in ui-strings, or document these as fixed.

### 1.7 — Footer chrome
- Files: `src/site/components/SiteFooter.jsx:174-176` ("Back to top"), `app/(site)/layout.jsx:46-48` ("Skip to content")
- Severity: LOW — arguably chrome, but "Back to top" is a visible link and its footer siblings are all editable.
- Fix: one ui-strings field each, or accept as structural.

### 1.8 — Team profile link labels
- File: `app/(site)/team/[slug]/page.jsx:114, 130`
- What: visible "LinkedIn" and "ORCID" anchors hardcoded (the footer's LinkedIn label IS editable via `linkedinLabel` — inconsistent).
- Severity: LOW

### 1.9 — "Year tbc" timeline fallback
- File: `app/(site)/distinctives/page.jsx:348`
- What: hardcoded; the schema help even names the string ("Shows as 'Year tbc'"), so at least documentation and code agree.
- Severity: LOW

### 1.10 — Home map count words
- File: `app/(site)/page.jsx:200` — "`{n} countries shown.`" words hardcoded (the schema help for mapNote documents this).
- Severity: LOW

### 1.11 — Publication detail file size bypasses the template
- File: `app/(site)/publications/[slug]/page.jsx:113`
- What: renders `({pub.fileSize})` raw; cards and policy rows use the editable `pdfSizeTemplate` ("PDF · {size}"). Editing the template changes cards and policies but never the detail-page button.
- Severity: LOW
- Fix: run the same template here.

### 1.12 — Server-side signup messages
- File: `src/cms/actions/content.js:271-285`
- What: the server action's own validation/failure strings ("Enter an email address.", "Something went wrong at our end…") are hardcoded duplicates of the ui-strings seeds; the client form usually intercepts, but the server-failure message always shows verbatim and is uneditable.
- Severity: LOW

### 1.13 — Focus mosaic close-button title
- File: `src/site/components/technical-focus/FocusMosaic.jsx:58` — `closeTitleTemplate = 'Close {title}'` default, no ui-strings field, page never passes it. Icon-title only.
- Severity: LOW

Verified WIRED (suspects that check out): signposts `secondaryLinkLabel` (SignpostTrio.jsx:66-73), `tabBar`/`tabBarMenuLabel` ((site)/layout.jsx:73 → MobileTabBar), `footerExploreHeading`/`footerMoreHeading`, `logoWordmark` in BOTH header and footer (layout.jsx:54,69; not-found.jsx:33,87), MailingListForm ui props passed on footer, contact AND work-for-us, CrossLinks `ui` passed on all six pages that render it, PageHero fields on case-studies/publications/policies/work-for-us, the whole 404 copy, `itemsPerPage`, `mapNote`/`mapSummary`, `morePublicationsTemplate`, `pdfSizeTemplate` (cards + policies), sitemap honours `noIndex`.

---

## 2. EDITABLE-BUT-DEAD (schema fields nothing reads)

### 2.1 — jobs.applyUrl
- Schema: `src/cms/schemas/collections.js:712-720`; renderer: `app/(site)/work-for-us/page.jsx:85-99`
- What: the vacancy card renders title, location, description — no apply button, ever. The help text promises "Where the apply button points."
- Severity: HIGH
- Fix: render an Apply button when applyUrl is set (fallback link to /contact as the help describes).

### 2.2 — tracking.ogImage ("Default share image")
- Schema: `src/cms/schemas/settings.js:714-721`
- What: grep finds no consumer. `src/lib/page-metadata.js` only reads the per-page ogImage; the site-wide default card is the generated `app/opengraph-image.jsx`, which never looks at this field. Uploading a default share image changes nothing.
- Severity: HIGH
- Fix: feed it into root layout openGraph.images (falling back to the generated card), or remove the field.

### 2.3 — publications.fileSize / policies.fileSize "Filled automatically on upload" is false
- Schemas: `src/cms/schemas/collections.js:443-447` and `:750-754`
- What: no autofill exists. `MediaField.jsx` stores only the URL (select() at :28-35); `uploadMedia` writes size to the media table but never into a document. The editor must type "403 KB" by hand while the help says "no need to touch it". Worse: `app/(site)/policies/page.jsx:31` renders `pdfSizeTemplate.replace('{size}', policy.fileSize)` unguarded — an empty fileSize prints "PDF · ".
- Severity: HIGH
- Fix: on PDF select, write the formatted media size into the sibling fileSize field (record is available in select()); guard the policies row meanwhile.

### 2.4 — ui-strings sortLabel, clearAll, resultCountTemplate, resultCountAllTemplate — dead on /case-studies
- Same bug as finding 1.1. They work on /publications only. `resultCountAllTemplate` (a named suspect) is therefore half-dead.
- Severity: HIGH (same one-line fix as 1.1)

### 2.5 — team.needsReview and publications.needsReview
- Schemas: `collections.js:121-128` and `:475-482`
- What: no site consumer, and no admin surface either — no list badge, no filter, nothing. An editor flips "Needs review" and nothing anywhere shows it.
- Severity: MED
- Fix: show a badge/column in the collection list rows (SortableList already renders Draft/Hidden badges).

### 2.6 — site-settings socialEnterprise, ukCompanyNumber, zambiaCompanyNumber
- Schema: `settings.js:188-212`
- What: never read. The rendered footer sentence is the separate `legalLine` textarea; `vatNumber` at least feeds JSON-LD (site layout.jsx:23). Editing the three fields changes nothing — the warning admits legalLine "repeats" them but the fields still look load-bearing.
- Severity: MED
- Fix: either compose legalLine from these fields, or mark them read-only reference like the wiring fields.

### 2.7 — tracking.headSnippet lands in <body>, not <head>
- Schema help: `settings.js:693-699` ("injected into the <head> of every page"); code: `app/layout.jsx:46-48` renders it inside a hidden `<div>` at the top of `<body>`.
- What: scripts still execute on first load (SSR HTML), but providers whose snippet must sit in head (meta-tag site verification, some consent tools) will not work, and a `<meta>` inside a body div is invalid.
- Severity: MED
- Fix: inject into the real head (Next Script or a head-injection strategy), or correct the help text.

### 2.8 — Media alt text never reaches the public site
- Claim: `src/admin/media/MediaDrawer.jsx:250` and `MediaField.jsx:151` ("Applies everywhere this image appears"); reality: site components hardcode `alt=""` (CaseStudyCard.jsx:16, PublicationCard.jsx:46, TeamCard.jsx:50, home hero page.jsx:146). Only the admin's own previews show it.
- Severity: MED
- Fix: resolve alt from the media table where images render (or at build of the doc), or reword the admin copy.

### 2.9 — tracking.metaTitleTemplate
- Schema: `settings.js:722-730`; no consumer (root layout builds the template from settings.name). The warning does say "for reference only", so it is dead by design — but it is still an editable text input whose edits do nothing, and its seed hardcodes "— Jigsaw".
- Severity: LOW
- Fix: render read-only like the wiring fields.

### 2.10 — site-settings.needsClientConfirmation
- Schema: `settings.js:111-117` — "internal note only" by design; nothing (not even the dashboard) surfaces it.
- Severity: LOW

### 2.11 — page-not-found SEO share image
- `app/not-found.jsx:8-15` builds metadata by hand: title/description are used, `ogImage` is ignored (noIndex is force-set, which is right). The 404 editor still offers the share-image picker.
- Severity: LOW

Verified LIVE (suspects that check out): `caseStudySlug` select options refresh from the live collections at edit time (`app/admin/(console)/collections/[key]/[id]/page.jsx:28-67` LIVE_OPTION_SOURCES), so the "options freshness" concern is handled; policies `concernsContact` renders; `standards` list renders; every `{count}/{total}/{noun}/{type}/{size}` placeholder is substituted where its component actually receives the template.

---

## 3. LEGACY hubble-live-assets S3 URLS (content inventory for the migration)

44 asset references in seeds + schema (31 raw greps; template-literal prefixes expand to more):

| Collection / field | Count | Where |
|---|---|---|
| team.photo | 17 | `src/data/team.js` (17 of 18 members; one has no photo) |
| case-studies.image | 5 | `src/data/case-studies.js` via IMAGE_BASE (line 10) |
| case-studies.links[].url (PDFs) | 9 | `src/data/case-studies.js:67,71,75,296,511,515,555` (https eu-west-1) + `:411,415,419` (three legacy **http** `hubble-live-assets.s3.amazonaws.com/...redactor2_assets` URLs — different host pattern, plain http) |
| publications.pdf | 10 | `src/data/publications.js` via S3 const (line 33) |
| policies.file | 2 | `src/data/policies.js:30,37` via S3 const (line 9) |
| page-home.heroPhoto (seed) | 1 | `src/cms/schemas/pages.js:131` |

Notes for the report: the three `redactor2_assets` links are http:// (mixed-content warnings once migrated pages are https) and on a different bucket host; migrate or drop them explicitly. Docs references (`docs/design-direction.md`, `docs/discovery/*`) are inert.

---

## 4. CONSOLE USABILITY (ranked, max 12)

1. **Revision history has no UI.** `listRevisions`/`restoreRevision` exist (`src/cms/actions/content.js:219-259`) but nothing imports them. Meanwhile the delete confirm promises "A snapshot is kept in the revision history" (SortableList.jsx:205) and the dashboard empty state says "it can always be restored" (admin page.jsx:233). An editor who deletes on that promise has no restore button anywhere. HIGH — build a history panel (per-item and per-page), or soften the copy.
2. **The fileSize trap** (2.3): help says automatic, reality is manual, and the policies row renders "PDF · " blank. An editor following the help ships broken chrome. HIGH.
3. **Alt text mirage** (2.8): the drawer's autosaving alt editor claims site-wide effect that does not exist, and uploads never prompt for alt at all. MED-HIGH.
4. **Edits that visibly do nothing erode trust:** the Site text tab includes Sort/Clear-all/result-count fields that /case-studies ignores (1.1), and the SEO & tracking tab shows two dead fields (Default share image, Browser title pattern — 2.2/2.9). The editor's feedback loop (edit → preview) fails silently. HIGH in aggregate, one-line fixes each.
5. **SERP preview hardcodes the brand:** `SchemaForm.jsx:42,57-59` prints "— Jigsaw" and `jigsaweducation.org` literally; if the org name or URL changes in Settings the preview lies. Also fine print: it shows `www.` which the canonical URL does not use. LOW-MED.
6. **Collection lists: no status filter.** Search exists (SortableList), but there is no published/hidden/has-draft filter and no way to see only flagged items; at the promised ~100 publications, finding the hidden or drafted ones means scrolling for badges. The list also has no pagination. MED.
7. **needsReview has no surface** (2.5): the one workflow flag editors are told to use appears in no list column, badge or filter. MED.
8. **Media tiles hide usage.** "Where it's used" lives only in the per-file drawer (good), but the grid gives no used/unused signal and there is no "unused files" filter — housekeeping means opening drawers one by one. Delete is correctly locked until the usage check answers. LOW-MED.
9. **Subscribers page: no search, no pagination** — fine at dozens, painful at thousands; CSV export mitigates. LOW.
10. **Site text findability.** ~40 ui-strings fields across four sections with location-descriptions in help text; no screenshots or "view on site" anchors, so matching a string to its on-page spot takes trial and error. The section rail and autosave are good. LOW.
11. **Review-notes visibility.** The switch lives in Settings → Review mode; individual note fields say they are gated, but nothing in a page editor shows whether a given note is currently live on the public page. LOW.
12. **Publication detail-page inconsistency** (1.11) will read as an admin bug: editor changes "PDF size line" template, cards change, the detail button does not. LOW.

What is genuinely good (context for the report): autosave with honest status pill and retry; publish/discard flow with validation scroll-to-error; live preview pane with remembered state; drag-reorder with optimistic rollback; media drawer usage-guarded delete; error/loading boundaries on the console routes; live select options; SERP preview concept; toast + confirm everywhere.

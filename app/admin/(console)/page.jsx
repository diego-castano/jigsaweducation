// The console dashboard: greeting, page cards with draft badges, the content
// strip with collection counts, and the last eight revisions. Reads Postgres
// directly - data AND draft columns, always fresh.

import Link from 'next/link';
import { requireAdmin } from '../../../src/lib/auth';
import { query } from '../../../src/lib/db';
import { SINGLETONS, COLLECTIONS, getCollectionSchema } from '../../../src/cms/schema';
import Icon from '../../../src/components/Icon';
import { Badge, EmptyState } from '../../../src/admin/ui';
import ReviewModeBanner from '../../../src/admin/shell/ReviewModeBanner';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false }
};

const PAGE_SINGLETONS = SINGLETONS.filter(
  (s) => s.key.startsWith('page-') && s.route !== null
);

function greetingFor(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// "2 hours ago" / "yesterday" - en-GB, coarse on purpose.
function relativeTime(value) {
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return '';
  const rtf = new Intl.RelativeTimeFormat('en-GB', { numeric: 'auto' });
  const seconds = Math.round((then - Date.now()) / 1000);
  const steps = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.348, 'week'],
    [12, 'month'],
    [Infinity, 'year']
  ];
  let amount = seconds;
  for (const [limit, unit] of steps) {
    if (Math.abs(amount) < limit) return rtf.format(Math.round(amount), unit);
    amount /= limit;
  }
  return '';
}

// A revision row -> what to show and where it links. Singleton keys resolve
// through the schema; item uuids resolve through the joined row (the item may
// have been deleted since the snapshot).
function describeRevision(row) {
  if (row.target_type === 'singleton') {
    const schema = SINGLETONS.find((s) => s.key === row.target_key);
    const isPage = row.target_key.startsWith('page-');
    return {
      title: schema?.title || row.target_key,
      context: isPage ? 'Page' : 'Settings',
      icon: schema?.icon || 'file-text',
      href: isPage ? `/admin/pages/${row.target_key}` : '/admin/settings'
    };
  }

  const schema = getCollectionSchema(row.target_type);
  const doc = row.item_draft || row.item_data;
  const title = doc?.[schema?.titleField] || null;
  return {
    title: title || `Removed ${schema?.itemLabel || 'item'}`,
    context: schema?.title || row.target_type,
    icon: schema?.icon || 'file-text',
    href: doc
      ? `/admin/collections/${row.target_type}/${row.target_key}`
      : `/admin/collections/${row.target_type}`
  };
}

async function dashboardData() {
  const [singletonDrafts, itemStats, revisions, settings] = await Promise.all([
    query('select key from singletons where draft is not null'),
    query(
      `select collection, count(*)::int as total, count(draft)::int as drafted
         from collection_items group by collection`
    ),
    query(
      `select r.target_type, r.target_key, r.user_email, r.saved_at,
              ci.data as item_data, ci.draft as item_draft
         from revisions r
         left join collection_items ci
           on r.target_type <> 'singleton' and ci.id::text = r.target_key
        order by r.saved_at desc
        limit 8`
    ),
    query(
      `select coalesce((data ->> 'showReviewNotes')::boolean, false) as review_on
         from singletons where key = 'site-settings'`
    )
  ]);

  return {
    draftKeys: new Set(singletonDrafts.rows.map((r) => r.key)),
    stats: new Map(itemStats.rows.map((r) => [r.collection, r])),
    revisions: revisions.rows,
    reviewOn: Boolean(settings.rows[0]?.review_on)
  };
}

export default async function DashboardPage() {
  const session = await requireAdmin();
  const { draftKeys, stats, revisions, reviewOn } = await dashboardData();

  const firstName = (session.name || '').trim().split(/\s+/)[0] || 'there';
  const now = new Date();
  const today = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(now);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="reveal">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-600">{today}</p>
        <h1 className="mt-2 font-display display-m text-3xl sm:text-4xl text-navy-900">
          {greetingFor(now.getHours())}, {firstName}
        </h1>
        <p className="mt-2 text-[15px] text-ink-600">
          Everything on the public site is edited from here. Changes stay as drafts until
          you publish them.
        </p>
      </header>

      {reviewOn && (
        <div className="reveal reveal-1">
          <ReviewModeBanner large />
        </div>
      )}

      {/* Pages */}
      <section aria-labelledby="dash-pages" className="reveal reveal-1">
        <h2 id="dash-pages" className="font-display display-s text-xl text-navy-900">
          Pages
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {PAGE_SINGLETONS.map((page) => {
            const hasDraft = draftKeys.has(page.key);
            return (
              <div
                key={page.key}
                className="group relative flex items-center gap-4 rounded-2xl border border-cream-200 bg-cream-100 p-4 transition-[border-color,box-shadow] duration-200 hover:border-navy-300 hover:shadow-sm focus-within:border-navy-300"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream-200 text-navy-700 transition-colors group-hover:bg-orange-100 group-hover:text-orange-600">
                  <Icon name={page.icon} size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/pages/${page.key}`}
                    className="font-bold text-navy-900 focus:outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-orange-500"
                  >
                    {page.title}
                  </Link>
                  <p className="mt-0.5 truncate font-mono text-xs text-ink-500">{page.route}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {hasDraft && <Badge tone="amber">Draft</Badge>}
                  <a
                    href={page.route}
                    target="_blank"
                    rel="noopener"
                    aria-label={`View ${page.title} on the site (opens in a new tab)`}
                    className="tactile relative z-10 rounded-full p-2 text-ink-500 opacity-0 transition-opacity hover:bg-cream-200 hover:text-navy-900 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 group-hover:opacity-100 max-lg:opacity-100"
                  >
                    <Icon name="arrow-up-right" size={16} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Content */}
      <section aria-labelledby="dash-content" className="reveal reveal-2">
        <h2 id="dash-content" className="font-display display-s text-xl text-navy-900">
          Content
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {COLLECTIONS.map((collection) => {
            const stat = stats.get(collection.key);
            const total = stat?.total ?? 0;
            const drafted = stat?.drafted ?? 0;
            return (
              <Link
                key={collection.key}
                href={`/admin/collections/${collection.key}`}
                className="group rounded-2xl border border-cream-200 bg-cream-100 p-4 transition-[border-color,box-shadow] duration-200 hover:border-navy-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <Icon
                    name={collection.icon}
                    size={18}
                    className="text-ink-500 transition-colors group-hover:text-orange-600"
                  />
                  {drafted > 0 && (
                    <span
                      className="h-2 w-2 rounded-full bg-orange-500"
                      title={`${drafted} with draft edits`}
                    />
                  )}
                </div>
                <p className="mt-3 font-mono text-2xl text-navy-900">{total}</p>
                <p className="mt-0.5 truncate text-sm text-ink-700">{collection.title}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent changes */}
      <section aria-labelledby="dash-recent" className="reveal reveal-3">
        <h2 id="dash-recent" className="font-display display-s text-xl text-navy-900">
          Recent changes
        </h2>
        <div className="mt-4">
          {revisions.length === 0 ? (
            <EmptyState
              icon="edit"
              title="Nothing published yet"
              body="When you publish a change, the previous version is saved here so it can always be restored."
            />
          ) : (
            <ul className="divide-y divide-cream-200 overflow-hidden rounded-2xl border border-cream-200 bg-cream-100">
              {revisions.map((row, index) => {
                const change = describeRevision(row);
                return (
                  <li key={`${row.target_key}-${row.saved_at}-${index}`}>
                    <Link
                      href={change.href}
                      className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-cream-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-200 text-navy-700">
                        <Icon name={change.icon} size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-bold text-navy-900">
                          {change.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-ink-600">
                          {change.context} · published by {row.user_email || 'unknown'}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-xs text-ink-500">
                        {relativeTime(row.saved_at)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

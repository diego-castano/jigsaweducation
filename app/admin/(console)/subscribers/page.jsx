// /admin/subscribers - the mailing list, newest first. Count in mono, CSV
// export via the sibling route handler, instant search, per-row delete with
// a confirm naming the exact address. Reads Postgres directly, always fresh.

import { requireAdmin } from '../../../../src/lib/auth';
import { query } from '../../../../src/lib/db';
import Icon from '../../../../src/components/Icon';
import { EmptyState } from '../../../../src/admin/ui';
import SubscribersTable from '../../../../src/admin/settings/SubscribersTable.jsx';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Subscribers',
  robots: { index: false, follow: false }
};

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
});

export default async function SubscribersPage() {
  await requireAdmin();

  const { rows } = await query(
    'select id, email, source, created_at from subscribers order by created_at desc, email asc'
  );
  const subscribers = rows.map((row) => ({
    id: row.id,
    email: row.email,
    source: row.source,
    signedUp: row.created_at ? dateFormat.format(new Date(row.created_at)) : null
  }));

  return (
    <div>
      <header className="reveal flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display display-m text-3xl text-navy-900 sm:text-4xl">
            Subscribers
          </h1>
          <p className="mt-2 text-[15px] text-ink-600">
            <span className="font-mono text-navy-900">{subscribers.length}</span>{' '}
            {subscribers.length === 1 ? 'address' : 'addresses'} on the mailing list, newest
            first.
          </p>
        </div>

        {subscribers.length > 0 && (
          <a
            href="/admin/subscribers/export"
            download
            className="tactile inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-[15px] font-bold text-white shadow-xs transition-colors hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <Icon name="download" size={16} className="shrink-0" />
            Download CSV
          </a>
        )}
      </header>

      <div className="reveal reveal-1 mt-6">
        {subscribers.length === 0 ? (
          <EmptyState
            icon="send"
            title="No subscribers yet"
            body="Every address entered in the mailing-list form: in the site footer and on the Contact and Work for us pages: lands here, ready to download as a CSV."
          />
        ) : (
          <SubscribersTable subscribers={subscribers} />
        )}
      </div>
    </div>
  );
}

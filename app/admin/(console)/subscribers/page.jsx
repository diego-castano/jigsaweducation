// /admin/subscribers — the mailing list, newest first. Count in mono, CSV
// export via the sibling route handler, per-row delete with a confirm naming
// the exact address. Reads Postgres directly and always fresh.

import { requireAdmin } from '../../../../src/lib/auth';
import { query } from '../../../../src/lib/db';
import Icon from '../../../../src/components/Icon';
import { Badge, EmptyState } from '../../../../src/admin/ui';
import SubscriberDelete from '../../../../src/admin/settings/SubscriberDelete.jsx';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Subscribers',
  robots: { index: false, follow: false }
};

// Where each signup came from. Unlisted sources fall back to a neutral badge
// showing the raw value.
const SOURCE_TONES = {
  footer: 'navy',
  contact: 'sea',
  'work-for-us': 'amber',
  site: 'neutral'
};

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
});

export default async function SubscribersPage() {
  await requireAdmin();

  const { rows: subscribers } = await query(
    'select id, email, source, created_at from subscribers order by created_at desc, email asc'
  );

  return (
    <div className="mx-auto max-w-4xl">
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
            body="Every address entered in the mailing-list form — in the site footer and on the Contact and Work for us pages — lands here, ready to download as a CSV."
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-cream-200 bg-cream-100">
            <table className="w-full text-left text-[15px]">
              <thead>
                <tr className="border-b border-cream-200 font-mono text-[11px] uppercase tracking-wider text-ink-600">
                  <th scope="col" className="px-4 py-3 font-normal">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3 font-normal">
                    Source
                  </th>
                  <th scope="col" className="px-4 py-3 font-normal">
                    Signed up
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="transition-colors hover:bg-cream-50">
                    <td className="max-w-[18rem] truncate px-4 py-3 font-medium text-navy-900">
                      {subscriber.email}
                    </td>
                    <td className="px-4 py-3">
                      {subscriber.source ? (
                        <Badge tone={SOURCE_TONES[subscriber.source] || 'neutral'}>
                          {subscriber.source}
                        </Badge>
                      ) : (
                        <span className="text-ink-500">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-600">
                      {subscriber.created_at ? dateFormat.format(new Date(subscriber.created_at)) : '—'}
                    </td>
                    <td className="px-2 py-2 text-right">
                      <SubscriberDelete id={subscriber.id} email={subscriber.email} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

// The subscribers table with instant, client-side search over address and
// source. Rows arrive serialised from the server page; deletion is per-row
// with a confirm naming the exact address.

import { useState } from 'react';
import { Badge, SearchInput } from '../ui.jsx';
import SubscriberDelete from './SubscriberDelete.jsx';

// Where each signup came from. Unlisted sources fall back to a neutral badge
// showing the raw value.
const SOURCE_TONES = {
  footer: 'navy',
  contact: 'sea',
  'work-for-us': 'amber',
  site: 'neutral'
};

export default function SubscribersTable({ subscribers }) {
  const [search, setSearch] = useState('');
  const needle = search.trim().toLowerCase();
  const visible = needle
    ? subscribers.filter(
        (s) =>
          s.email.toLowerCase().includes(needle) ||
          (s.source || '').toLowerCase().includes(needle)
      )
    : subscribers;

  return (
    <div className="space-y-3">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by address or source…"
        aria-label="Search subscribers"
        className="max-w-sm"
      />

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-cream-300 px-4 py-8 text-center text-sm text-ink-600">
          Nothing matches “{search.trim()}”.
        </p>
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
              {visible.map((subscriber) => (
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
                    {subscriber.signedUp || '—'}
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
  );
}

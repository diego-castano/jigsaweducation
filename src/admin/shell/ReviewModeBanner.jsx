// Amber warning shown across the console while site-settings.showReviewNotes
// is on — the public site is rendering internal notes. The layout decides
// whether to render it; the dashboard shows the large variant.

import Link from 'next/link';
import Icon from '../../components/Icon';

export default function ReviewModeBanner({ large = false }) {
  if (large) {
    return (
      <div
        role="status"
        className="flex flex-col gap-3 rounded-2xl border border-orange-200 bg-orange-100 p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3">
          <Icon name="alert" size={20} className="mt-0.5 shrink-0 text-orange-700" />
          <div>
            <p className="font-bold text-orange-700">Review mode is on</p>
            <p className="mt-0.5 text-sm text-ink-800">
              Internal review notes are visible on the public site. Switch them off before
              launch.
            </p>
          </div>
        </div>
        <Link
          href="/admin/settings"
          className="tactile inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:self-auto"
        >
          Open settings
          <Icon name="arrow-right" size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2.5 border-b border-orange-200 bg-orange-100 px-4 py-2 text-center"
    >
      <Icon name="alert" size={15} className="shrink-0 text-orange-700" />
      <p className="text-[13px] text-ink-800">
        Review mode is on — internal notes are visible on the public site.{' '}
        <Link
          href="/admin/settings"
          className="font-bold text-orange-700 underline decoration-orange-300 underline-offset-2 transition-colors hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
        >
          Turn it off in Settings
        </Link>
      </p>
    </div>
  );
}

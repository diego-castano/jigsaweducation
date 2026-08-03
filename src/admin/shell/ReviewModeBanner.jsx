// Shown across the console while site-settings.showReviewNotes is on. The
// switch keeps the site's internal build notes ("awaiting copy" placeholders,
// draft-approval warnings) visible to the public during the review phase.
// Warning tokens, not orange: orange means "action" everywhere else in the
// console, and this is a status. The layout decides whether to render it;
// the dashboard shows the large variant.

import Link from 'next/link';
import Icon from '../../components/Icon';

export default function ReviewModeBanner({ large = false }) {
  if (large) {
    return (
      <div
        role="status"
        className="flex flex-col gap-3 rounded-2xl border border-warning-500/30 bg-warning-50 p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3">
          <Icon name="eye" size={20} className="mt-0.5 shrink-0 text-warning-700" />
          <div>
            <p className="font-bold text-navy-900">The site is in review mode</p>
            <p className="mt-0.5 max-w-2xl text-sm text-ink-800">
              Visitors can see the notes meant for the Jigsaw team, such as the
              &ldquo;awaiting copy&rdquo; placeholders and draft warnings. That is right while
              the site is under review. Before it goes live, switch review mode off and the
              notes disappear everywhere at once.
            </p>
          </div>
        </div>
        <Link
          href="/admin/settings"
          className="tactile inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-navy-900 px-4 py-2 text-sm font-bold text-cream-50 transition-colors hover:bg-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:self-auto"
        >
          Review mode settings
          <Icon name="arrow-right" size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="flex shrink-0 items-center gap-2.5 border-b border-warning-500/30 bg-warning-50 px-4 py-2 sm:px-8"
    >
      <Icon name="eye" size={15} className="shrink-0 text-warning-700" />
      <p className="text-[13px] text-ink-800">
        Review mode: visitors can see the team&rsquo;s internal notes on the site.{' '}
        <Link
          href="/admin/settings"
          className="rounded-sm font-bold text-navy-900 underline decoration-warning-500/60 underline-offset-2 transition-colors hover:decoration-warning-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          About review mode
        </Link>
      </p>
    </div>
  );
}

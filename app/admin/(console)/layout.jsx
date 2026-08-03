// The console shell: auth gate, navy sidebar, top bars, review-mode banner
// and the toast/confirm host every module relies on. Reads draft counts and
// the review switch straight from Postgres — the admin always sees fresh
// data and draft columns, never the cached public loaders.

import { requireAdmin } from '../../../src/lib/auth';
import { query } from '../../../src/lib/db';
import { NAV_GROUPS, SEGMENT_LABELS } from '../../../src/admin/shell/nav';
import Sidebar from '../../../src/admin/shell/Sidebar';
import TopBar from '../../../src/admin/shell/TopBar';
import MobileShell from '../../../src/admin/shell/MobileShell';
import ReviewModeBanner from '../../../src/admin/shell/ReviewModeBanner';
import { ToastProvider } from '../../../src/admin/ui';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: { default: 'Console', template: '%s · Console' },
  robots: { index: false, follow: false }
};

// The shell must render even when Postgres is down — the page-level error
// boundary reports the failure with the navigation still around it.
async function shellData() {
  try {
    const [settings, drafts] = await Promise.all([
      query(
        `select coalesce((data ->> 'showReviewNotes')::boolean, false) as review_on
           from singletons where key = 'site-settings'`
      ),
      query(
        `select (select count(*) from singletons where draft is not null)::int
              + (select count(*) from collection_items where draft is not null)::int
              as count`
      )
    ]);
    return {
      reviewOn: Boolean(settings.rows[0]?.review_on),
      draftCount: drafts.rows[0]?.count ?? 0
    };
  } catch {
    return { reviewOn: false, draftCount: 0 };
  }
}

export default async function ConsoleLayout({ children }) {
  const session = await requireAdmin();
  const { reviewOn, draftCount } = await shellData();

  return (
    <ToastProvider>
      <div className="min-h-dvh bg-cream-50">
        <a
          href="#admin-main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy-900 focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-cream-50"
        >
          Skip to content
        </a>

        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] lg:block">
          <Sidebar groups={NAV_GROUPS} />
        </aside>

        <MobileShell groups={NAV_GROUPS} session={session} draftCount={draftCount} />

        <div className="flex min-h-dvh flex-col lg:pl-[260px]">
          <TopBar session={session} draftCount={draftCount} labels={SEGMENT_LABELS} />
          {reviewOn && <ReviewModeBanner />}
          <main id="admin-main" className="flex-1 px-4 py-6 sm:px-8 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

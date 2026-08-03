// The console shell: auth gate, navy sidebar, top bars, review-mode banner
// and the toast/confirm host every module relies on. Reads draft counts and
// the review switch straight from Postgres — the admin always sees fresh
// data and draft columns, never the cached public loaders.

import { requireAdmin } from '../../../src/lib/auth';
import { query } from '../../../src/lib/db';
import { NAV_GROUPS, SEGMENT_LABELS } from '../../../src/admin/shell/nav';
import ConsoleFrame from '../../../src/admin/shell/ConsoleFrame';
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
      {/* One scroll container: only <main> scrolls, so the sidebar, top bar
          and review banner hold still and the console reads as an app.
          ConsoleFrame owns the collapsible sidebar widths client-side. */}
      <ConsoleFrame
        groups={NAV_GROUPS}
        session={session}
        draftCount={draftCount}
        labels={SEGMENT_LABELS}
        reviewOn={reviewOn}
      >
        {children}
      </ConsoleFrame>
    </ToastProvider>
  );
}

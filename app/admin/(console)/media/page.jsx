// The media library at /admin/media. The first page of tiles renders on the
// server — straight from Postgres, always fresh — and MediaBrowser takes over
// for tabs, search, uploads, pagination and the detail drawer.

import { requireAdmin } from '../../../../src/lib/auth';
import { query } from '../../../../src/lib/db';
import MediaBrowser from '../../../../src/admin/media/MediaBrowser';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Media',
  robots: { index: false, follow: false }
};

const PAGE_SIZE = 24;

export default async function MediaPage() {
  await requireAdmin();

  const { rows } = await query(
    `select id, key, filename, mime, size, width, height, alt, created_at,
            count(*) over() as total
       from media
      order by created_at desc
      limit $1`,
    [PAGE_SIZE]
  );

  // Same shape the listMedia action returns, so the client mixes both freely.
  const items = rows.map((row) => ({
    id: row.id,
    key: row.key,
    url: `/media/${row.key}`,
    filename: row.filename,
    mime: row.mime,
    size: row.size,
    width: row.width,
    height: row.height,
    alt: row.alt,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
  }));
  const total = rows.length ? Number(rows[0].total) : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="reveal">
        <h1 className="font-display display-m text-3xl text-navy-900 sm:text-4xl">Media</h1>
        <p className="mt-2 text-[15px] text-ink-600">
          Photography and PDF documents for the site. Upload here, then place them from
          each page&rsquo;s editor.
        </p>
      </header>

      <div className="reveal reveal-1 mt-6">
        <MediaBrowser
          mode="manage"
          initialItems={items}
          initialTotal={total}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
}

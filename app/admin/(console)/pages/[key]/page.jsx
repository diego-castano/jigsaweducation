// The singleton page editor: schema-driven form on the left, the live page
// in a preview pane on the right. Reads Postgres directly - data AND draft
// columns, always fresh - and merges the published document over the schema
// seed so every declared field arrives with a value even before first save.

import { notFound } from 'next/navigation';
import { requireAdmin } from '../../../../../src/lib/auth';
import { query } from '../../../../../src/lib/db';
import { getSingletonSchema, singletonSeedDoc, COLLECTIONS } from '../../../../../src/cms/schema';
import { PAGE_SINGLETONS } from '../../../../../src/cms/schemas/pages.js';
import { SingletonEditor } from '../../../../../src/admin/editor/PreviewPane';
import Icon from '../../../../../src/components/Icon';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { key } = await params;
  const schema = getSingletonSchema(key);
  return {
    title: schema ? schema.title : 'Page',
    robots: { index: false, follow: false }
  };
}

// Collections whose items have their own public page - their routes join the
// static page routes as internal link targets. Today: team, case-studies,
// publications.
const DETAIL_COLLECTIONS = COLLECTIONS.filter((c) => c.itemRoute);

async function editorData(key) {
  const [singletonResult, settingsResult, itemsResult] = await Promise.all([
    query('select data, draft from singletons where key = $1', [key]),
    query("select data ->> 'name' as name, data ->> 'url' as url from singletons where key = 'site-settings'"),
    query(
      `select collection, slug, data from collection_items
        where collection = any($1::text[]) and status = 'published'
        order by collection, sort`,
      [DETAIL_COLLECTIONS.map((c) => c.key)]
    )
  ]);
  const settings = settingsResult.rows[0] || {};
  return {
    row: singletonResult.rows[0] || null,
    items: itemsResult.rows,
    brand: {
      name: settings.name || 'Jigsaw',
      host: String(settings.url || 'https://www.jigsaweducation.org').replace(/^https?:\/\//, '')
    }
  };
}

function buildLinkTargets(items) {
  const staticTargets = PAGE_SINGLETONS
    // Every page with a real address; the not-found page is no link target.
    .filter((s) => s.route && s.route !== '/404')
    .map((s) => ({ label: s.title, href: s.route }));

  const itemTargets = items.map((item) => {
    const collection = DETAIL_COLLECTIONS.find((c) => c.key === item.collection);
    return {
      label: `${collection.title} · ${item.data?.[collection.titleField] || item.slug}`,
      href: collection.itemRoute.replace(':slug', item.slug)
    };
  });

  return [...staticTargets, ...itemTargets];
}

export default async function SingletonPage({ params }) {
  await requireAdmin();

  const { key } = await params;
  const schema = getSingletonSchema(key);
  if (!schema) notFound();

  const { row, items, brand } = await editorData(key);

  // Published document over the schema seed: a page that has never been
  // saved still shows today's live copy in every field.
  const value = { ...singletonSeedDoc(schema), ...(row?.data || {}) };
  const draft = row?.draft || null;

  return (
    <div className="space-y-8">
      <header className="reveal flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-display display-s text-3xl text-navy-900">{schema.title}</h1>
            {schema.route && (
              <span className="font-mono text-xs text-ink-500">{schema.route}</span>
            )}
          </div>
          {schema.description && (
            <p className="mt-2 max-w-2xl text-[15px] text-ink-600">{schema.description}</p>
          )}
        </div>

        {schema.route && (
          <a
            href={schema.route}
            target="_blank"
            rel="noopener"
            className="tactile inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cream-300 bg-white px-4 py-1.5 text-sm font-bold text-navy-800 transition-colors hover:border-navy-300 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            View page
            <Icon name="arrow-up-right" size={14} />
          </a>
        )}
      </header>

      <div className="reveal reveal-1">
        <SingletonEditor
          schema={schema}
          targetKey={key}
          value={value}
          draft={draft}
          linkTargets={buildLinkTargets(items)}
          brand={brand}
        />
      </div>
    </div>
  );
}

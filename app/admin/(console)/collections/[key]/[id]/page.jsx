// The item editor: the generic SchemaForm over one collection item, with the
// live preview of its public page and the danger-zone footer. Reads Postgres
// directly — data AND draft columns, always fresh.

import { notFound } from 'next/navigation';
import { requireAdmin } from '../../../../../../src/lib/auth';
import { query } from '../../../../../../src/lib/db';
import { getCollectionSchema } from '../../../../../../src/cms/schema';
import ItemEditor from '../../../../../../src/admin/collections/ItemEditor';

export const dynamic = 'force-dynamic';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }) {
  const { key } = await params;
  const schema = getCollectionSchema(key);
  return {
    title: schema ? `Edit ${schema.itemLabel}` : 'Content',
    robots: { index: false, follow: false }
  };
}

// Select options that must track the live collections rather than the arrays
// seeded at module load: a case study created in the admin has to appear in
// the publications picker straight away. The seeded options stay as the
// fallback whenever a query returns nothing.
const LIVE_OPTION_SOURCES = {
  'case-studies': {
    service: { collection: 'services', field: 'title' },
    topics: { collection: 'technical-focus', field: 'title' }
  },
  publications: {
    method: { collection: 'services', field: 'title' },
    topic: { collection: 'technical-focus', field: 'title' },
    caseStudySlug: { collection: 'case-studies', field: 'slug' }
  }
};

async function liveOptionsFor(schemaKey) {
  const sources = LIVE_OPTION_SOURCES[schemaKey];
  if (!sources) return {};
  const out = {};
  await Promise.all(
    Object.entries(sources).map(async ([fieldName, source]) => {
      try {
        const { rows } =
          source.field === 'slug'
            ? await query(
                `select slug as value from collection_items
                  where collection = $1 order by sort asc, created_at asc`,
                [source.collection]
              )
            : await query(
                `select coalesce(draft ->> $2, data ->> $2) as value from collection_items
                  where collection = $1 order by sort asc, created_at asc`,
                [source.collection, source.field]
              );
        const values = rows.map((row) => row.value).filter(Boolean);
        if (values.length > 0) out[fieldName] = values;
      } catch {
        // Fall back to the options seeded in the schema.
      }
    })
  );
  return out;
}

const withLiveOptions = (fields, live) =>
  fields.map((field) => {
    const options = live[field.name];
    if (!options) return field;
    if (field.type === 'list') return { ...field, of: [{ ...field.of[0], options }] };
    return { ...field, options };
  });

// Every declared field arrives with a value of its own shape, so the form
// never feeds undefined into a controlled input. One level of nesting is all
// the schemas use (sections.criticalQuestion and friends).
const fieldDefault = (field) => {
  if (field.type === 'list') return [];
  if (field.type === 'boolean') return false;
  if (field.type === 'country') return null;
  return '';
};

function withDefaults(fields, data) {
  const doc = { ...(data || {}) };
  fields.forEach((field) => {
    const [top, nested] = field.name.split('.');
    if (!nested) {
      if (doc[top] === undefined) doc[top] = fieldDefault(field);
      return;
    }
    doc[top] = { ...(doc[top] || {}) };
    if (doc[top][nested] === undefined) doc[top][nested] = fieldDefault(field);
  });
  return doc;
}

export default async function CollectionItemPage({ params }) {
  await requireAdmin();

  const { key, id } = await params;
  const schema = getCollectionSchema(key);
  if (!schema || !UUID_PATTERN.test(id)) notFound();

  const [itemResult, live] = await Promise.all([
    query(
      `select id, slug, status, data, draft from collection_items
        where collection = $1 and id = $2`,
      [key, id]
    ),
    liveOptionsFor(key)
  ]);

  const row = itemResult.rows[0];
  if (!row) notFound();

  const fields = withLiveOptions(schema.fields, live);
  const value = withDefaults(schema.fields, row.data);
  const draft = row.draft && Object.keys(row.draft).length > 0 ? row.draft : null;
  const mergedTitle = { ...value, ...(draft || {}) }[schema.titleField];

  return (
    <div className="mx-auto max-w-6xl">
      <ItemEditor
        meta={{
          key: schema.key,
          title: schema.title,
          itemLabel: schema.itemLabel,
          route: schema.route,
          itemRoute: schema.itemRoute,
          titleField: schema.titleField
        }}
        fields={fields}
        itemId={row.id}
        slug={row.slug}
        status={row.status}
        value={value}
        draft={draft}
        initialTitle={mergedTitle || `Untitled ${schema.itemLabel}`}
      />
    </div>
  );
}

// The collection list page: every item of one content type with search,
// status badges and — when the schema says order matters — drag-reorder.
// Reads Postgres directly: data AND draft columns, always fresh.

import { notFound } from 'next/navigation';
import { requireAdmin } from '../../../../../src/lib/auth';
import { query } from '../../../../../src/lib/db';
import { getCollectionSchema } from '../../../../../src/cms/schema';
import SortableList from '../../../../../src/admin/collections/SortableList';
import AddItemModal from '../../../../../src/admin/collections/AddItemModal';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { key } = await params;
  const schema = getCollectionSchema(key);
  return {
    title: schema ? schema.title : 'Content',
    robots: { index: false, follow: false }
  };
}

// A list column shows the merged (draft over data) value, rendered flat:
// arrays join, booleans show their label when on, everything else is text.
const columnDisplay = (field, doc) => {
  const raw = doc?.[field.name];
  if (field.type === 'boolean') return raw ? field.label : '';
  if (Array.isArray(raw)) return raw.filter(Boolean).join(', ');
  if (raw == null || raw === '') return '';
  if (typeof raw === 'object') return raw.name || '';
  return String(raw);
};

export default async function CollectionListPage({ params }) {
  await requireAdmin();

  const { key } = await params;
  const schema = getCollectionSchema(key);
  if (!schema) notFound();

  const { rows } = await query(
    `select id, slug, status, data, draft from collection_items
      where collection = $1
      order by sort asc, created_at asc`,
    [key]
  );

  const merged = rows.map((row) => ({ row, doc: { ...(row.data || {}), ...(row.draft || {}) } }));

  // Orderable collections keep their dragged order; the rest sort themselves —
  // newest year first where a year exists (publications), then by title.
  if (!schema.orderable) {
    const yearOf = (doc) => {
      const year = Number(doc.year);
      return Number.isFinite(year) ? year : -1;
    };
    const titleOf = (doc) => String(doc[schema.titleField] || '');
    merged.sort(
      (a, b) => yearOf(b.doc) - yearOf(a.doc) || titleOf(a.doc).localeCompare(titleOf(b.doc))
    );
  }

  const columnFields = schema.listColumns.map(
    (name) => schema.fields.find((field) => field.name === name) || { name, label: name, type: 'text' }
  );

  const items = merged.map(({ row, doc }) => ({
    id: row.id,
    slug: row.slug,
    title: doc[schema.titleField] || `Untitled ${schema.itemLabel}`,
    hasDraft: row.draft != null && Object.keys(row.draft).length > 0,
    hidden: row.status === 'hidden',
    publicHref: schema.itemRoute ? schema.itemRoute.replace(':slug', row.slug) : null,
    columns: columnFields.map((field) => ({
      name: field.name,
      type: field.type,
      value: columnDisplay(field, doc)
    }))
  }));

  const titleField = schema.fields.find((field) => field.name === schema.titleField);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="reveal flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 items-baseline gap-3">
          <h1 className="font-display display-s text-3xl text-navy-900">{schema.title}</h1>
          <span className="font-mono text-sm text-ink-500">{items.length}</span>
        </div>
        <AddItemModal collection={key} itemLabel={schema.itemLabel} field={titleField} />
      </header>

      <div className="reveal reveal-1">
        <SortableList
          collection={key}
          itemLabel={schema.itemLabel}
          orderable={Boolean(schema.orderable)}
          rows={items}
        />
      </div>
    </div>
  );
}

// The read path for all site content. Pages call these three loaders and
// nothing else: published reads come from Postgres through unstable_cache
// (invalidated by tag on publish), preview reads come fresh with the draft
// overlaid, and a database failure degrades to the seed in src/cms/seed-data.js
// rather than a 500.

import { draftMode } from 'next/headers';
import { unstable_cache } from 'next/cache';
import { query } from './db.js';
import { SINGLETON_SEEDS, COLLECTION_SEEDS } from '../cms/seed-data.js';

// draftMode() throws outside a request scope (build-time callers such as
// generateStaticParams and the sitemap); those callers get published content.
const isPreview = async () => {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
};

const overlay = (data, draft) => ({ ...(data || {}), ...(draft || {}) });

const seedFallback = (error, label, value) => {
  console.error(`content: database read failed for ${label}, serving seed data.`, error);
  return value;
};

// ---------------------------------------------------------------------------
// Singletons

const readSingletonRow = async (key) => {
  const { rows } = await query(
    'select data, draft from singletons where key = $1',
    [key]
  );
  return rows[0] || null;
};

const cachedSingleton = (key) =>
  unstable_cache(
    async () => {
      const row = await readSingletonRow(key);
      return row ? row.data : null;
    },
    [key],
    { tags: ['content', `content:${key}`] }
  )();

export async function getSingleton(key) {
  const seed = SINGLETON_SEEDS[key] || {};
  try {
    let doc;
    if (await isPreview()) {
      const row = await readSingletonRow(key);
      doc = row ? overlay(row.data, row.draft) : null;
    } else {
      doc = await cachedSingleton(key);
    }
    // Merge over the schema seed so a field added to the schema after the row
    // was published never comes back undefined.
    return { ...seed, ...(doc || {}) };
  } catch (error) {
    return seedFallback(error, `singleton ${key}`, { ...seed });
  }
}

// ---------------------------------------------------------------------------
// Collections

const toItem = (row, preview) => ({
  slug: row.slug,
  ...(preview ? overlay(row.data, row.draft) : row.data || {})
});

const readCollectionRows = async (key, { includeHidden = false } = {}) => {
  const { rows } = await query(
    `select slug, data, draft, status from collection_items
      where collection = $1 ${includeHidden ? '' : "and status = 'published'"}
      order by sort asc, created_at asc`,
    [key]
  );
  return rows;
};

const cachedCollection = (key, includeHidden) =>
  unstable_cache(
    async () => {
      const rows = await readCollectionRows(key, { includeHidden });
      return rows.map((row) => toItem(row, false));
    },
    [key, includeHidden ? 'all' : 'published'],
    { tags: ['content', `content:${key}`] }
  )();

export async function getCollection(key, opts = {}) {
  const { includeHidden = false } = opts;
  try {
    if (await isPreview()) {
      const rows = await readCollectionRows(key, { includeHidden });
      return rows.map((row) => toItem(row, true));
    }
    return await cachedCollection(key, includeHidden);
  } catch (error) {
    const seed = COLLECTION_SEEDS[key] || [];
    return seedFallback(
      error,
      `collection ${key}`,
      seed.map((item) => ({ slug: item.slug, ...item.data }))
    );
  }
}

// ---------------------------------------------------------------------------
// Single items

const cachedItem = (collection, slug) =>
  unstable_cache(
    async () => {
      const { rows } = await query(
        `select slug, data from collection_items
          where collection = $1 and slug = $2 and status = 'published'`,
        [collection, slug]
      );
      return rows[0] ? toItem(rows[0], false) : null;
    },
    [collection, slug],
    { tags: ['content', `content:${collection}`] }
  )();

export async function getItem(collection, slug) {
  try {
    if (await isPreview()) {
      // Any status: a newly created item is hidden until first publish, and
      // its detail page must still preview.
      const { rows } = await query(
        'select slug, data, draft from collection_items where collection = $1 and slug = $2',
        [collection, slug]
      );
      return rows[0] ? toItem(rows[0], true) : null;
    }
    return await cachedItem(collection, slug);
  } catch (error) {
    const seed = (COLLECTION_SEEDS[collection] || []).find((item) => item.slug === slug);
    return seedFallback(
      error,
      `item ${collection}/${slug}`,
      seed ? { slug: seed.slug, ...seed.data } : null
    );
  }
}

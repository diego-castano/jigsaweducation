'use server';

// Every content mutation the admin performs, plus the one public action the
// site itself calls (the mailing-list signup). Editors write to `draft`;
// publish snapshots the outgoing `data` into revisions, folds the draft in,
// and invalidates the content cache tags. Collection items are addressed by
// their uuid `id`; singletons by their schema `key`.

import { revalidateTag } from 'next/cache';
import { requireAdmin } from '../../lib/auth.js';
import { query } from '../../lib/db.js';
import { getSingletonSchema, getCollectionSchema } from '../schema.js';
import { slugify } from '../seed-data.js';

const ITEM_STATUSES = ['published', 'hidden'];

const assertTarget = (type, key) => {
  if (type === 'singleton') {
    if (!getSingletonSchema(key)) throw new Error(`Unknown singleton: ${key}`);
  } else if (!getCollectionSchema(type)) {
    throw new Error(`Unknown collection: ${type}`);
  }
};

const assertCollection = (collection) => {
  const schema = getCollectionSchema(collection);
  if (!schema) throw new Error(`Unknown collection: ${collection}`);
  return schema;
};

const revalidateContent = (key) => {
  // 'max' = expire now everywhere; Next 16 deprecates the one-argument form.
  revalidateTag('content', 'max');
  revalidateTag(`content:${key}`, 'max');
};

export async function saveDraft(type, key, patch) {
  await requireAdmin();
  assertTarget(type, key);
  const json = JSON.stringify(patch || {});
  if (type === 'singleton') {
    await query(
      `insert into singletons (key, draft) values ($1, $2::jsonb)
       on conflict (key) do update
         set draft = coalesce(singletons.draft, '{}'::jsonb) || excluded.draft,
             updated_at = now()`,
      [key, json]
    );
  } else {
    await query(
      `update collection_items
          set draft = coalesce(draft, '{}'::jsonb) || $3::jsonb,
              updated_at = now()
        where collection = $1 and id = $2`,
      [type, key, json]
    );
  }
  return { ok: true };
}

export async function publishContent(type, key) {
  const session = await requireAdmin();
  assertTarget(type, key);
  // Snapshot and publish in one statement so both see the same row state.
  if (type === 'singleton') {
    await query(
      `with snapshot as (
         insert into revisions (target_type, target_key, data, user_email)
         select 'singleton', key, data, $2 from singletons where key = $1
       )
       update singletons
          set data = data || coalesce(draft, '{}'::jsonb),
              draft = null,
              updated_at = now()
        where key = $1`,
      [key, session.email]
    );
  } else {
    await query(
      `with snapshot as (
         insert into revisions (target_type, target_key, data, user_email)
         select collection, id::text, data, $3 from collection_items
          where collection = $1 and id = $2
       )
       update collection_items
          set data = data || coalesce(draft, '{}'::jsonb),
              draft = null,
              updated_at = now()
        where collection = $1 and id = $2`,
      [type, key, session.email]
    );
  }
  revalidateContent(type === 'singleton' ? key : type);
  return { ok: true };
}

export async function discardDraft(type, key) {
  await requireAdmin();
  assertTarget(type, key);
  if (type === 'singleton') {
    await query(
      'update singletons set draft = null, updated_at = now() where key = $1',
      [key]
    );
  } else {
    await query(
      `update collection_items set draft = null, updated_at = now()
        where collection = $1 and id = $2`,
      [type, key]
    );
  }
  return { ok: true };
}

export async function createItem(collection, fields = {}) {
  await requireAdmin();
  const schema = assertCollection(collection);
  const base = slugify(fields[schema.slugFrom]) || `new-${schema.itemLabel.replace(/\s+/g, '-')}`;
  const { rows: existing } = await query(
    'select slug from collection_items where collection = $1 and (slug = $2 or slug like $3)',
    [collection, base, `${base}-%`]
  );
  const taken = new Set(existing.map((row) => row.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n += 1) slug = `${base}-${n}`;

  const { rows } = await query(
    `insert into collection_items (collection, slug, data, sort, status)
     values ($1, $2, $3::jsonb,
             (select coalesce(max(sort), -1) + 1 from collection_items where collection = $1),
             'hidden')
     returning id, slug`,
    [collection, slug, JSON.stringify(fields)]
  );
  return { ok: true, id: rows[0].id, slug: rows[0].slug };
}

export async function duplicateItem(collection, id) {
  await requireAdmin();
  const schema = assertCollection(collection);

  const { rows: source } = await query(
    'select slug, data, draft from collection_items where collection = $1 and id = $2',
    [collection, id]
  );
  if (!source.length) return { error: 'That item no longer exists.' };

  // The copy is what the editor currently sees: draft merged over data. It
  // starts hidden with no draft of its own, titled "… (copy)" so the two
  // never read as the same item in a list.
  const doc = { ...(source[0].data || {}), ...(source[0].draft || {}) };
  if (typeof doc[schema.titleField] === 'string' && doc[schema.titleField]) {
    doc[schema.titleField] = `${doc[schema.titleField]} (copy)`;
  }

  const base = `${source[0].slug}-copy`;
  const { rows: existing } = await query(
    'select slug from collection_items where collection = $1 and (slug = $2 or slug like $3)',
    [collection, base, `${base}-%`]
  );
  const taken = new Set(existing.map((row) => row.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n += 1) slug = `${base}-${n}`;

  const { rows } = await query(
    `insert into collection_items (collection, slug, data, sort, status)
     values ($1, $2, $3::jsonb,
             (select coalesce(max(sort), -1) + 1 from collection_items where collection = $1),
             'hidden')
     returning id, slug`,
    [collection, slug, JSON.stringify(doc)]
  );
  return { ok: true, id: rows[0].id, slug: rows[0].slug };
}

export async function deleteItem(collection, id) {
  const session = await requireAdmin();
  assertCollection(collection);
  await query(
    `with snapshot as (
       insert into revisions (target_type, target_key, data, user_email)
       select collection, id::text, data, $3 from collection_items
        where collection = $1 and id = $2
     )
     delete from collection_items where collection = $1 and id = $2`,
    [collection, id, session.email]
  );
  revalidateContent(collection);
  return { ok: true };
}

export async function reorderItems(collection, orderedIds) {
  await requireAdmin();
  assertCollection(collection);
  await query(
    `update collection_items as item
        set sort = ordering.position - 1, updated_at = now()
       from unnest($2::uuid[]) with ordinality as ordering(id, position)
      where item.collection = $1 and item.id = ordering.id`,
    [collection, orderedIds]
  );
  revalidateContent(collection);
  return { ok: true };
}

export async function setItemStatus(collection, id, status) {
  await requireAdmin();
  assertCollection(collection);
  if (!ITEM_STATUSES.includes(status)) throw new Error(`Unknown status: ${status}`);
  await query(
    `update collection_items set status = $3, updated_at = now()
      where collection = $1 and id = $2`,
    [collection, id, status]
  );
  revalidateContent(collection);
  return { ok: true };
}

export async function listRevisions(type, key) {
  await requireAdmin();
  assertTarget(type, key);
  const { rows } = await query(
    `select id, user_email, saved_at from revisions
      where target_type = $1 and target_key = $2
      order by saved_at desc
      limit 50`,
    [type === 'singleton' ? 'singleton' : type, String(key)]
  );
  return rows.map((row) => ({
    id: row.id,
    userEmail: row.user_email,
    savedAt: row.saved_at instanceof Date ? row.saved_at.toISOString() : row.saved_at
  }));
}

export async function restoreRevision(revisionId) {
  await requireAdmin();
  const { rows } = await query(
    'select target_type, target_key, data from revisions where id = $1',
    [revisionId]
  );
  const revision = rows[0];
  if (!revision) throw new Error('Revision not found.');
  const json = JSON.stringify(revision.data || {});
  // A restore lands in the draft for review — never straight onto the live site.
  if (revision.target_type === 'singleton') {
    await query(
      'update singletons set draft = $2::jsonb, updated_at = now() where key = $1',
      [revision.target_key, json]
    );
  } else {
    await query(
      `update collection_items set draft = $3::jsonb, updated_at = now()
        where collection = $1 and id = $2`,
      [revision.target_type, revision.target_key, json]
    );
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Public: the mailing-list form on the footer, contact and work-for-us pages.
// No auth, no thrown errors — the form shows whatever message comes back.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToMailingList(formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const source = String(formData.get('source') || 'site').trim().slice(0, 100);
  if (!email) {
    return { ok: false, message: 'Enter an email address.' };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, message: 'That does not look like an email address.' };
  }
  try {
    // A repeat signup reads as success: the address is on the list either way.
    await query(
      'insert into subscribers (email, source) values ($1, $2) on conflict (email) do nothing',
      [email, source]
    );
    return { ok: true, message: 'Thank you. You are on the list.' };
  } catch (error) {
    console.error('subscribeToMailingList: insert failed.', error);
    return { ok: false, message: 'Something went wrong at our end. Please try again later.' };
  }
}

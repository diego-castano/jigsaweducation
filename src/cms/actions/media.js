'use server';

// Media library actions. Every action re-verifies the session; expected
// failures return { error } because Next masks thrown messages in production.

import { randomBytes } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import sharp from 'sharp';
import { requireAdmin } from '../../lib/auth';
import { query } from '../../lib/db';
import { putObject, deleteObject } from '../../lib/storage';

const MAX_BYTES = 25 * 1024 * 1024;

const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
};

// Types sharp can measure. SVG and PDF keep null dimensions.
const RASTER_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const slugifyName = (filename) => {
  const stem = filename.replace(/\.[^.]*$/, '');
  const slug = stem
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return slug || 'file';
};

const escapeLike = (value) => value.replace(/[\\%_]/g, '\\$&');

const toMediaResult = (row) => ({
  id: row.id,
  key: row.key,
  url: `/media/${row.key}`,
  filename: row.filename,
  mime: row.mime,
  size: row.size,
  width: row.width,
  height: row.height,
  alt: row.alt,
  focal_x: row.focal_x ?? null,
  focal_y: row.focal_y ?? null,
  createdAt: row.created_at,
});

export async function uploadMedia(formData) {
  await requireAdmin();

  const file = formData.get('file');
  if (!file || typeof file.arrayBuffer !== 'function') {
    return { error: 'No file received. Choose a file and try again.' };
  }

  const ext = EXTENSIONS[file.type];
  if (!ext) {
    return { error: 'That file type is not supported. Upload a JPEG, PNG, WebP, GIF, SVG or PDF.' };
  }
  if (file.size === 0) {
    return { error: 'That file is empty.' };
  }
  if (file.size > MAX_BYTES) {
    return { error: 'That file is larger than 25 MB. Compress it and try again.' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let width = null;
  let height = null;
  if (RASTER_TYPES.has(file.type)) {
    try {
      const meta = await sharp(buffer).metadata();
      width = meta.width ?? null;
      height = meta.height ?? null;
    } catch {
      return { error: 'That image could not be read. It may be corrupt; re-export it and try again.' };
    }
  }

  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const hex = randomBytes(3).toString('hex');
  const key = `uploads/${yyyy}/${mm}/${slugifyName(file.name)}-${hex}.${ext}`;

  await putObject(key, buffer, file.type);

  const { rows } = await query(
    `insert into media (key, filename, mime, size, width, height)
     values ($1, $2, $3, $4, $5, $6)
     returning id, key, filename, mime, size, width, height, alt, created_at`,
    [key, file.name, file.type, file.size, width, height]
  );

  return toMediaResult(rows[0]);
}

export async function listMedia({ search, type, limit = 50, offset = 0 } = {}) {
  await requireAdmin();

  const where = [];
  const params = [];

  if (search) {
    params.push(`%${escapeLike(search.trim())}%`);
    where.push(`(filename ilike $${params.length} or alt ilike $${params.length} or key ilike $${params.length})`);
  }
  if (type === 'image') {
    where.push(`mime like 'image/%'`);
  } else if (type === 'pdf') {
    where.push(`mime = 'application/pdf'`);
  }

  params.push(limit, offset);
  const { rows } = await query(
    `select id, key, filename, mime, size, width, height, alt, focal_x, focal_y, created_at,
            count(*) over() as total
     from media
     ${where.length ? `where ${where.join(' and ')}` : ''}
     order by created_at desc
     limit $${params.length - 1} offset $${params.length}`,
    params
  );

  return {
    items: rows.map(toMediaResult),
    total: rows.length ? Number(rows[0].total) : 0,
  };
}

export async function updateAlt(id, alt) {
  await requireAdmin();

  const { rows } = await query(
    `update media set alt = $2 where id = $1 returning id, alt`,
    [id, alt ?? '']
  );
  if (!rows.length) return { error: 'That file no longer exists.' };
  // Alt text renders on the public site wherever the image is used.
  revalidateTag('content:media', 'max');
  revalidateTag('content', 'max');
  return rows[0];
}

// The focal point steers object-position wherever the site crops this image.
// x/y are 0..1 from the top-left; null clears back to centre.
export async function setFocalPoint(id, x, y) {
  await requireAdmin();

  const clamp = (v) => (v == null ? null : Math.min(1, Math.max(0, Number(v))));
  const { rows } = await query(
    `update media set focal_x = $2, focal_y = $3 where id = $1
     returning id, focal_x, focal_y`,
    [id, clamp(x), clamp(y)]
  );
  if (!rows.length) return { error: 'That file no longer exists.' };
  revalidateTag('content:media', 'max');
  revalidateTag('content', 'max');
  return { id: rows[0].id, focalX: rows[0].focal_x, focalY: rows[0].focal_y };
}

export async function deleteMedia(id) {
  await requireAdmin();

  const { rows } = await query(`select key from media where id = $1`, [id]);
  if (!rows.length) return { error: 'That file no longer exists.' };

  // Storage first, row last: a row without an object shows a broken tile the
  // admin can retry; an object without a row can never be cleaned up.
  try {
    await deleteObject(rows[0].key);
  } catch {
    return { error: 'The file could not be removed from storage. Nothing was deleted; try again.' };
  }

  await query(`delete from media where id = $1`, [id]);
  return { ok: true };
}

// Where is this file referenced? Content stores media as '/media/<key>'
// strings inside jsonb documents, so a text scan over data and draft finds
// every use, so the admin can warn before a delete would break a page.
export async function getMediaUsage(id) {
  await requireAdmin();

  const { rows } = await query(`select key from media where id = $1`, [id]);
  if (!rows.length) return { error: 'That file no longer exists.' };

  const pattern = `%${escapeLike(`/media/${rows[0].key}`)}%`;

  const [singletons, items] = await Promise.all([
    query(
      `select key from singletons
       where data::text like $1 or draft::text like $1
       order by key`,
      [pattern]
    ),
    query(
      `select collection, slug from collection_items
       where data::text like $1 or draft::text like $1
       order by collection, slug`,
      [pattern]
    ),
  ]);

  return {
    singletons: singletons.rows.map((r) => r.key),
    items: items.rows.map((r) => ({ collection: r.collection, slug: r.slug })),
    count: singletons.rows.length + items.rows.length,
  };
}

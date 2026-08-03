// Moves every asset the content still loads from the legacy Hubble bucket
// (the old White Fuse site's S3) into our own Railway bucket, registers each
// file in the media library, and rewrites the URLs inside the live content.
//
//   npm run assets:migrate          (dry run — reports what it would do)
//   npm run assets:migrate -- --go  (does it)
//
// Idempotent: keys derive from the source URL, so a re-run uploads nothing
// twice and a second pass finds no legacy URLs left. The seed files in
// src/data keep their original URLs on purpose — they are the offline
// fallback, not the live content.

import { createHash } from 'node:crypto';
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (specifier.startsWith('.') && !/\.[a-z]+$/.test(specifier)) {
        return nextResolve(`${specifier}.js`, context);
      }
      throw error;
    }
  }
});

const { query, pool } = await import('../src/lib/db.js');
const { putObject } = await import('../src/lib/storage.js');

const LEGACY = /https?:\/\/hubble-live-assets\.s3[^"'\s)]*/g;
const APPLY = process.argv.includes('--go');

const sharp = (await import('sharp')).default;

// ---------------------------------------------------------------- collect
const collectUrls = (value, found) => {
  if (typeof value === 'string') {
    for (const match of value.match(LEGACY) || []) found.add(match);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectUrls(item, found));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectUrls(item, found));
  }
};

const rewrite = (value, map) => {
  if (typeof value === 'string') {
    return value.replace(LEGACY, (url) => map.get(url) || url);
  }
  if (Array.isArray(value)) return value.map((item) => rewrite(item, map));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, rewrite(item, map)])
    );
  }
  return value;
};

const singletons = (await query('select key, data, draft from singletons')).rows;
const items = (
  await query('select id, collection, slug, data, draft from collection_items')
).rows;

const urls = new Set();
for (const row of [...singletons, ...items]) {
  collectUrls(row.data, urls);
  collectUrls(row.draft, urls);
}

console.log(`Found ${urls.size} unique legacy URLs in live content.`);
if (urls.size === 0) {
  console.log('Nothing to migrate.');
  await pool.end();
  process.exit(0);
}

// ---------------------------------------------------------------- transfer
const keyFor = (url) => {
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 10);
  const base = decodeURIComponent(url.split('/').pop() || 'file')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(-80);
  return `migrated/${hash}-${base}`;
};

const map = new Map();
const failures = [];
let uploaded = 0;
let skipped = 0;

for (const url of urls) {
  const key = keyFor(url);
  const target = `/media/${key}`;

  const existing = await query('select 1 from media where key = $1', [key]);
  if (existing.rows.length > 0) {
    map.set(url, target);
    skipped += 1;
    continue;
  }

  if (!APPLY) {
    console.log(`  would migrate ${url}\n            -> ${target}`);
    map.set(url, target);
    continue;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const body = Buffer.from(await response.arrayBuffer());
    const mime = response.headers.get('content-type')?.split(';')[0] || 'application/octet-stream';

    let width = null;
    let height = null;
    if (mime.startsWith('image/') && mime !== 'image/svg+xml') {
      try {
        const meta = await sharp(body).metadata();
        width = meta.width ?? null;
        height = meta.height ?? null;
      } catch {
        // Dimensions stay unknown; the file still migrates.
      }
    }

    await putObject(key, body, mime);
    await query(
      `insert into media (key, filename, mime, size, width, height, alt)
       values ($1, $2, $3, $4, $5, $6, '')
       on conflict (key) do nothing`,
      [key, key.split('/').pop(), mime, body.length, width, height]
    );

    map.set(url, target);
    uploaded += 1;
    console.log(`  migrated ${(body.length / 1024).toFixed(0).padStart(6)} KB  ${key}`);
  } catch (error) {
    failures.push({ url, reason: error.message });
    console.error(`  FAILED  ${url}  (${error.message})`);
  }
}

// ---------------------------------------------------------------- rewrite
let rewritten = 0;
if (APPLY) {
  for (const row of singletons) {
    const data = rewrite(row.data, map);
    const draft = rewrite(row.draft, map);
    if (JSON.stringify(data) !== JSON.stringify(row.data) ||
        JSON.stringify(draft) !== JSON.stringify(row.draft)) {
      await query('update singletons set data = $2::jsonb, draft = $3::jsonb, updated_at = now() where key = $1', [
        row.key,
        JSON.stringify(data),
        draft == null ? null : JSON.stringify(draft)
      ]);
      rewritten += 1;
      console.log(`  rewrote singleton ${row.key}`);
    }
  }
  for (const row of items) {
    const data = rewrite(row.data, map);
    const draft = rewrite(row.draft, map);
    if (JSON.stringify(data) !== JSON.stringify(row.data) ||
        JSON.stringify(draft) !== JSON.stringify(row.draft)) {
      await query(
        'update collection_items set data = $2::jsonb, draft = $3::jsonb, updated_at = now() where id = $1',
        [row.id, JSON.stringify(data), draft == null ? null : JSON.stringify(draft)]
      );
      rewritten += 1;
      console.log(`  rewrote ${row.collection}/${row.slug}`);
    }
  }
}

console.log('');
console.log(APPLY ? 'Migration complete.' : 'Dry run only — nothing changed. Re-run with --go.');
console.log(`  uploaded: ${uploaded}   already present: ${skipped}   rows rewritten: ${rewritten}   failures: ${failures.length}`);
if (failures.length > 0) {
  console.log('  Failed URLs stay untouched in the content:');
  failures.forEach((f) => console.log(`    ${f.url} — ${f.reason}`));
}
console.log(
  APPLY
    ? 'Deploy (or publish anything in the console) so the cached pages pick the new URLs up.'
    : ''
);

await pool.end();

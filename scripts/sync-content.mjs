// Pushes seed changes into the live database without clobbering admin edits.
//
//   node --env-file=.env.local scripts/sync-content.mjs --base <dir> [--apply] [--force key.field,...]
//
// `--base` points at a copy of src/ from the commit the database was seeded
// from (e.g. `git archive HEAD src | tar -x -C feedback/base`). Singleton
// fields merge three ways: a field the seed changed is written only when the
// live value still equals the base seed; a field someone edited in the admin
// is reported as a conflict and left alone unless named in --force.
// Collections in REPLACE are rewritten from the seed (items missing from the
// seed are hidden, never deleted); POLICIES only gain keys they lack;
// publications get their renamed classification values and case-study links.
// A JSON backup of both tables is written before anything else. Without
// --apply nothing is written to the database.

import { registerHooks } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { pool, query } from '../src/lib/db.js';

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (error?.code === 'ERR_MODULE_NOT_FOUND' && /^\.\.?\//.test(specifier) && !/\.[a-z]+$/i.test(specifier)) {
        return nextResolve(`${specifier}.js`, context);
      }
      throw error;
    }
  }
});

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? null : process.argv[i + 1];
};
const APPLY = process.argv.includes('--apply');
const BASE = arg('--base');
const FORCE = new Set((arg('--force') || '').split(',').filter(Boolean));
if (!BASE) throw new Error('--base <dir containing src/> is required');

const next = await import('../src/cms/seed-data.js');
const base = await import(path.resolve(BASE, 'src/cms/seed-data.js'));

const REPLACE = ['services', 'technical-focus', 'distinctives', 'partners', 'case-studies'];
const MERGE_ONLY = ['policies'];

const RENAME = {
  method: {
    'Design-based and implementation research': 'Implementation research',
    'Research localisation, training, and capacity strengthening': 'Research training and capacity strengthening'
  },
  topic: {
    'Foundational Learning': 'Foundational learning and pedagogy',
    'Teacher professional development': 'Foundational learning and pedagogy',
    'Technology and education': 'Digital technologies and AI',
    'Education financing and cost-effectiveness': 'Cost effectiveness',
    'Education policy, systems and governance': 'Education policy, systems and financing'
  }
};

// Old case-study slugs whose study lives on under a new slug; the rest have
// no successor and lose their links.
const CASE_STUDY_REMAP = {
  'voices-of-refugee-youth': 'youth-centred-evidence-building-for-post-primary-refugee-education',
  'british-council-environmental-impact-of-tpd': 'measuring-the-carbon-footprint-of-teacher-training',
  'gpe-unhcr-historical-mapping-refugee-edu': 'historical-mapping-of-refugee-education-provision',
  'girls-education-challenge': 'evaluating-marginalised-girls-learning-completion-and-transition'
};

const short = (v) => {
  const s = JSON.stringify(v);
  return s && s.length > 140 ? `${s.slice(0, 140)}...` : s;
};

const client = await pool.connect();
const log = [];
const say = (line) => {
  log.push(line);
  console.log(line);
};

try {
  // Backup first.
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = {
    singletons: (await client.query('select * from singletons')).rows,
    collection_items: (await client.query('select * from collection_items')).rows
  };
  const backupFile = `feedback/round-3/backup-${stamp}.json`;
  fs.mkdirSync(path.dirname(backupFile), { recursive: true });
  fs.writeFileSync(backupFile, JSON.stringify(backup));
  say(`backup: ${backupFile} (${backup.singletons.length} singletons, ${backup.collection_items.length} items)`);

  await client.query('begin');

  // --- Singletons: three-way merge per field --------------------------------
  const liveSingletons = Object.fromEntries(backup.singletons.map((r) => [r.key, r]));
  for (const [key, mine] of Object.entries(next.SINGLETON_SEEDS)) {
    const old = base.SINGLETON_SEEDS[key] || {};
    const row = liveSingletons[key];
    const live = row?.data || {};
    const draft = row?.draft || {};
    const patch = {};
    for (const field of new Set([...Object.keys(mine), ...Object.keys(old)])) {
      if (isDeepStrictEqual(old[field], mine[field])) continue;
      const id = `${key}.${field}`;
      if (draft && field in draft) say(`  note ${id}: has an unpublished admin draft, draft dropped`);
      if (live[field] === undefined || isDeepStrictEqual(live[field], old[field]) || FORCE.has(id)) {
        patch[field] = mine[field] === undefined ? null : mine[field];
        say(`  set ${id}: ${short(live[field])} -> ${short(mine[field])}`);
      } else if (!isDeepStrictEqual(live[field], mine[field])) {
        say(`  CONFLICT ${id}: live ${short(live[field])} | seed ${short(mine[field])}`);
      }
    }
    if (!Object.keys(patch).length) continue;
    if (!row) {
      await client.query('insert into singletons (key, data) values ($1, $2::jsonb)', [key, JSON.stringify(mine)]);
      continue;
    }
    await client.query(
      `update singletons set data = data || $2::jsonb,
         draft = case when draft is null then null else draft - $3::text[] end
       where key = $1`,
      [key, JSON.stringify(patch), Object.keys(patch)]
    );
  }

  // --- Collections rewritten from the seed ----------------------------------
  for (const collection of REPLACE) {
    const items = next.COLLECTION_SEEDS[collection] || [];
    for (const [index, item] of items.entries()) {
      await client.query(
        `insert into collection_items (collection, slug, data, sort, status)
         values ($1, $2, $3::jsonb, $4, 'published')
         on conflict (collection, slug) do update
           set data = excluded.data, draft = null, sort = excluded.sort, status = 'published'`,
        [collection, item.slug, JSON.stringify(item.data), item.sort ?? index]
      );
    }
    const hidden = await client.query(
      `update collection_items set status = 'hidden'
        where collection = $1 and not (slug = any($2::text[])) and status <> 'hidden'
        returning slug`,
      [collection, items.map((i) => i.slug)]
    );
    say(`collection ${collection}: ${items.length} upserted, hidden: ${hidden.rows.map((r) => r.slug).join(', ') || 'none'}`);
  }

  // --- Collections that only gain new keys ----------------------------------
  for (const collection of MERGE_ONLY) {
    for (const [index, item] of (next.COLLECTION_SEEDS[collection] || []).entries()) {
      await client.query(
        `insert into collection_items (collection, slug, data, sort, status)
         values ($1, $2, $3::jsonb, $4, 'published')
         on conflict (collection, slug) do update
           set data = excluded.data || collection_items.data`,
        [collection, item.slug, JSON.stringify(item.data), item.sort ?? index]
      );
    }
    say(`collection ${collection}: new keys merged`);
  }

  // --- Publications: renamed values and case-study links --------------------
  const caseStudySlugs = new Set((next.COLLECTION_SEEDS['case-studies'] || []).map((i) => i.slug));
  const seedPubs = Object.fromEntries((next.COLLECTION_SEEDS.publications || []).map((i) => [i.slug, i.data]));
  const pubs = backup.collection_items.filter((r) => r.collection === 'publications');
  for (const row of pubs) {
    const data = { ...row.data };
    let changed = false;
    for (const field of ['method', 'topic']) {
      const renamed = RENAME[field][data[field]];
      if (renamed) {
        say(`  publication ${row.slug}.${field}: ${data[field]} -> ${renamed}`);
        data[field] = renamed;
        changed = true;
      }
    }
    if (data.caseStudySlug && !caseStudySlugs.has(data.caseStudySlug)) {
      const fromSeed = CASE_STUDY_REMAP[data.caseStudySlug] ?? seedPubs[row.slug]?.caseStudySlug ?? null;
      const target = fromSeed && caseStudySlugs.has(fromSeed) ? fromSeed : null;
      say(`  publication ${row.slug}.caseStudySlug: ${data.caseStudySlug} -> ${target}`);
      data.caseStudySlug = target;
      changed = true;
    }
    if (changed) {
      await client.query(
        "update collection_items set data = $3::jsonb where collection = $1 and slug = $2",
        ['publications', row.slug, JSON.stringify(data)]
      );
    }
  }

  // --- Links to case studies that moved to a new slug ------------------------
  for (const { key } of backup.singletons) {
    const { rows } = await client.query('select data, draft from singletons where key = $1', [key]);
    const swap = (doc) => {
      if (!doc) return doc;
      let text = JSON.stringify(doc);
      for (const [from, to] of Object.entries(CASE_STUDY_REMAP)) {
        text = text.replaceAll(`/case-studies/${from}"`, `/case-studies/${to}"`).replaceAll(`/case-studies/${from}#`, `/case-studies/${to}#`);
      }
      return JSON.parse(text);
    };
    const data = swap(rows[0].data);
    const draft = swap(rows[0].draft);
    if (!isDeepStrictEqual(data, rows[0].data) || !isDeepStrictEqual(draft, rows[0].draft)) {
      say(`  case-study links remapped in ${key}`);
      await client.query('update singletons set data = $2::jsonb, draft = $3::jsonb where key = $1', [
        key,
        JSON.stringify(data),
        draft === null || draft === undefined ? null : JSON.stringify(draft)
      ]);
    }
  }

  // --- Leftover references worth a look -------------------------------------
  const after = (await client.query('select key as id, data from singletons')).rows.concat(
    (await client.query("select collection || '/' || slug as id, data from collection_items where status = 'published'")).rows
  );
  for (const { id, data } of after) {
    const text = JSON.stringify(data);
    if (/"\/services/.test(text)) say(`  stale route /services in ${id}`);
    for (const m of text.matchAll(/\/case-studies\/([a-z0-9-]+)/g)) {
      if (!caseStudySlugs.has(m[1])) say(`  link to missing case study ${m[1]} in ${id}`);
    }
  }

  if (APPLY) {
    await client.query('commit');
    say('APPLIED.');
  } else {
    await client.query('rollback');
    say('Dry run: rolled back. Re-run with --apply to write.');
  }
} catch (error) {
  await client.query('rollback').catch(() => {});
  throw error;
} finally {
  fs.writeFileSync('feedback/round-3/sync-last-run.log', log.join('\n'));
  client.release();
  await pool.end();
}

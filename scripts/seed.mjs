// Seeds the database from src/data/* via src/cms/seed-data.js. Idempotent:
// only keys and slugs that do not exist yet are inserted, so live edits are
// never overwritten. Also creates the first admin user from ADMIN_EMAIL /
// ADMIN_PASSWORD. Run with `npm run db:seed` after `npm run db:migrate`.

import { registerHooks } from 'node:module';
import bcrypt from 'bcryptjs';
import { pool, query } from '../src/lib/db.js';

// src/data/* uses bundler-style extensionless relative imports, which plain
// node refuses to resolve. This hook retries with `.js`, and it must be
// registered before the seed-data graph links — hence the dynamic import.
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

const { SINGLETON_SEEDS, COLLECTION_SEEDS } = await import('../src/cms/seed-data.js');

// src/lib/auth.js pulls in next/headers, which a plain node script cannot
// import, so the password hash is computed with bcryptjs directly. The cost
// factor matches auth.js.
const hashPassword = (password) => bcrypt.hash(password, 12);

const seedSingletons = async () => {
  let inserted = 0;
  let skipped = 0;
  for (const [key, doc] of Object.entries(SINGLETON_SEEDS)) {
    const res = await query(
      `insert into singletons (key, data)
       values ($1, $2::jsonb)
       on conflict (key) do nothing
       returning key`,
      [key, JSON.stringify(doc)]
    );
    res.rows.length ? inserted++ : skipped++;
  }
  return { target: 'singletons', inserted, skipped };
};

const seedCollection = async (collection, items) => {
  let inserted = 0;
  let skipped = 0;
  for (const [index, item] of items.entries()) {
    const res = await query(
      `insert into collection_items (collection, slug, data, sort, status)
       values ($1, $2, $3::jsonb, $4, $5)
       on conflict (collection, slug) do nothing
       returning id`,
      [
        collection,
        item.slug,
        JSON.stringify(item.data),
        item.sort ?? index,
        item.status ?? 'published'
      ]
    );
    res.rows.length ? inserted++ : skipped++;
  }
  return { target: collection, inserted, skipped };
};

const seedAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set — no admin user created.');
    return { target: 'admin user', inserted: 0, skipped: 0 };
  }
  const res = await query(
    `insert into admin_users (email, name, password_hash)
     values ($1, $2, $3)
     on conflict (email) do nothing
     returning id`,
    [email, process.env.ADMIN_NAME || 'Admin', await hashPassword(password)]
  );
  return { target: 'admin user', inserted: res.rows.length, skipped: res.rows.length ? 0 : 1 };
};

const printSummary = (rows) => {
  const width = Math.max(...rows.map((r) => r.target.length), 'Target'.length) + 2;
  console.log(`\n${'Target'.padEnd(width)}${'Inserted'.padEnd(10)}Skipped`);
  for (const row of rows) {
    console.log(`${row.target.padEnd(width)}${String(row.inserted).padEnd(10)}${row.skipped}`);
  }
};

const main = async () => {
  const rows = [await seedSingletons()];
  for (const [collection, items] of Object.entries(COLLECTION_SEEDS)) {
    rows.push(await seedCollection(collection, items));
  }
  rows.push(await seedAdminUser());
  printSummary(rows);
  console.log('\nSeed complete. Existing rows were left untouched.');
};

try {
  await main();
} finally {
  await pool.end();
}

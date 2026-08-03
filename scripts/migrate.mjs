// Creates the CMS schema on the database DATABASE_URL points at. Idempotent:
// safe to run on every deploy. Run with `npm run db:migrate`.

import { pool, query } from '../src/lib/db.js';

const TABLES = ['singletons', 'collection_items', 'media', 'admin_users', 'revisions', 'subscribers'];

const STATEMENTS = [
  // gen_random_uuid() is built into Postgres 13+, but the extension keeps the
  // schema portable to older servers.
  `create extension if not exists pgcrypto`,

  `create table if not exists singletons (
    key text primary key,
    data jsonb not null default '{}',
    draft jsonb,
    updated_at timestamptz default now()
  )`,

  `create table if not exists collection_items (
    id uuid primary key default gen_random_uuid(),
    collection text,
    slug text,
    data jsonb not null default '{}',
    draft jsonb,
    sort int default 0,
    status text default 'published',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique (collection, slug)
  )`,

  `create table if not exists media (
    id uuid primary key default gen_random_uuid(),
    key text unique,
    filename text,
    mime text,
    size int,
    width int,
    height int,
    alt text default '',
    created_at timestamptz default now()
  )`,

  `create table if not exists admin_users (
    id uuid primary key default gen_random_uuid(),
    email text unique,
    name text,
    password_hash text,
    created_at timestamptz default now(),
    last_login_at timestamptz
  )`,

  `create table if not exists revisions (
    id uuid primary key default gen_random_uuid(),
    target_type text,
    target_key text,
    data jsonb,
    user_email text,
    saved_at timestamptz default now()
  )`,

  `create table if not exists subscribers (
    id uuid primary key default gen_random_uuid(),
    email text unique,
    source text,
    created_at timestamptz default now()
  )`,

  `create index if not exists collection_items_collection_sort_idx
    on collection_items (collection, sort)`
];

const main = async () => {
  const before = await query(
    `select tablename from pg_tables where schemaname = 'public'`
  );
  const existing = new Set(before.rows.map((r) => r.tablename));

  for (const statement of STATEMENTS) {
    await query(statement);
  }

  for (const table of TABLES) {
    console.log(`  ${table.padEnd(18)} ${existing.has(table) ? 'already present' : 'created'}`);
  }
  console.log('Migration complete.');
};

try {
  await main();
} finally {
  await pool.end();
}

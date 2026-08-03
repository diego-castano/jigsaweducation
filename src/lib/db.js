// Postgres access for the whole app. One lazy pool: nothing connects at
// import time, so `next build` and scripts that never touch the database run
// without DATABASE_URL. Plain pg, no ORM — the store is a document model.

import pg from 'pg';

const { Pool } = pg;

let instance = null;

const createPool = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }
  const config = { connectionString: url, max: 5 };
  // Railway proxy URLs speak plain TCP and need no ssl config. When the URL
  // itself demands TLS, managed hosts present certs node rejects by default,
  // so verification is relaxed rather than letting pg fail the handshake.
  if (/[?&]ssl(mode=(require|no-verify)|=true)/.test(url)) {
    config.ssl = { rejectUnauthorized: false };
  }
  return new Pool(config);
};

// The pool export stays lazy behind a proxy: the Pool is created on first
// use, yet consumers can `import { pool }` and call connect()/end() as usual.
export const pool = new Proxy({}, {
  get(_target, prop) {
    instance ??= createPool();
    const value = instance[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});

export const query = (text, params) => pool.query(text, params);

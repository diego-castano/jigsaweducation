/**
 * Production static server for Railway.
 * Serves the Vite build output from /dist with gzip + sane caching.
 */
import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');

if (!existsSync(DIST)) {
  console.error('[fatal] dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const app = express();
app.disable('x-powered-by');
app.use(compression());

// Long-cache hashed assets (Vite emits hashed filenames)
app.use(
  '/assets',
  express.static(join(DIST, 'assets'), {
    maxAge: '1y',
    immutable: true
  })
);

// Short-cache everything else (logo, index.html, fonts via @fontsource bundle)
app.use(
  express.static(DIST, {
    maxAge: '1h',
    setHeaders(res, path) {
      if (path.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
    }
  })
);

// SPA fallback — every non-asset path serves index.html
app.get('*', (_req, res) => {
  res.sendFile(join(DIST, 'index.html'));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`[jigsaw] design system listening on :${port}`);
});

// GET /admin/subscribers/export - the mailing list as a CSV attachment.
// Session-gated like every admin surface: no session redirects to the login
// page rather than serving an empty file.

import { NextResponse } from 'next/server';
import { getSession } from '../../../../../src/lib/auth.js';
import { query } from '../../../../../src/lib/db.js';

export const dynamic = 'force-dynamic';

// RFC 4180: quote a field when it carries a comma, quote or line break;
// double any embedded quotes.
const csvField = (value) => {
  const text = value == null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const { rows } = await query(
    'select email, source, created_at from subscribers order by created_at desc, email asc'
  );

  const lines = [
    'email,source,created_at',
    ...rows.map((row) =>
      [
        csvField(row.email),
        csvField(row.source),
        csvField(
          row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
        )
      ].join(',')
    )
  ];

  return new NextResponse(`${lines.join('\r\n')}\r\n`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="jigsaw-subscribers.csv"',
      'Cache-Control': 'no-store'
    }
  });
}

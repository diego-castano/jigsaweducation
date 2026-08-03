import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from './src/lib/auth';

// Next 16 renamed this convention to proxy.js; middleware.js still runs
// unchanged and the rename is a mechanical follow-up when the deprecation
// bites. This is the outer gate only — every admin server action re-verifies
// the session itself via requireAdmin().

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname === '/admin/login') return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (session) return NextResponse.next();

  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('from', pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*']
};

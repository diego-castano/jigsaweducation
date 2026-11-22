import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

// Everything above the cookie helpers is pure crypto, so scripts/seed.mjs can
// import hashPassword without a Next request context. next/headers and
// next/navigation load lazily inside the functions that need them for the
// same reason - a top-level import would crash any plain-node caller.

export const SESSION_COOKIE = 'jigsaw_admin';

const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // seconds - matches the JWT expiry

function sessionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Shared by getSession and middleware.js so both sides agree on what a valid
// session is. jose only, edge-safe.
export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, sessionKey(), {
      algorithms: ['HS256']
    });
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name ?? null,
      mustChange: payload.mustChange === true
    };
  } catch {
    return null;
  }
}

// The path a session flagged with mustChange is confined to.
export const CHANGE_PASSWORD_PATH = '/admin/change-password';

export async function createSession(user) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    mustChange: user.mustChange === true
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(sessionKey());

  const { cookies } = await import('next/headers');
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // secure:true over plain-http localhost means the browser drops the
    // cookie and login silently loops, hence the production guard.
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE
  });
}

export async function getSession() {
  const { cookies } = await import('next/headers');
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

// A session still on its temporary password can do nothing but change it:
// every console page and admin action lands on the change-password page
// unless the caller opts in with allowPasswordChange.
export async function requireAdmin({ allowPasswordChange = false } = {}) {
  const session = await getSession();
  if (!session) {
    const { redirect } = await import('next/navigation');
    redirect('/admin/login');
  }
  if (session.mustChange && !allowPasswordChange) {
    const { redirect } = await import('next/navigation');
    redirect(CHANGE_PASSWORD_PATH);
  }
  return session;
}

export async function destroySession() {
  const { cookies } = await import('next/headers');
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

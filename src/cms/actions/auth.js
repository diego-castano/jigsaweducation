'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { query } from '../../lib/db';
import {
  createSession,
  destroySession,
  hashPassword,
  requireAdmin,
  verifyPassword
} from '../../lib/auth';

// Only follow redirect targets inside the console: an attacker-supplied
// ?from= must never bounce a fresh login to an external site.
const SAFE_FROM = /^\/admin(\/|\?|$)/;

// Compared against when the email finds no account, so both failure paths
// cost one bcrypt round and response timing does not confirm which emails
// have accounts. Any well-formed hash works; the compare always fails.
const DECOY_HASH = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2W';

// Login rate limiting: a sliding 15-minute window per address+email pair,
// kept in process memory. The site runs as one Railway instance, so this
// covers the real attack surface without another table; a restart clearing
// the counters costs nothing but a briefly shorter memory.
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const ATTEMPT_LIMIT = 5;
const attempts = new Map(); // key -> [timestamps]

const clientKey = async (email) => {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get('x-forwarded-for') || 'local';
  const ip = forwarded.split(',')[0].trim();
  return `${ip}|${email}`;
};

const tooManyAttempts = (key) => {
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((t) => now - t < ATTEMPT_WINDOW_MS);
  attempts.set(key, recent);
  // Opportunistic cleanup so the map never grows unbounded.
  if (attempts.size > 500) {
    for (const [k, list] of attempts) {
      if (list.every((t) => now - t >= ATTEMPT_WINDOW_MS)) attempts.delete(k);
    }
  }
  return recent.length >= ATTEMPT_LIMIT;
};

const recordFailure = (key) => {
  const list = attempts.get(key) || [];
  list.push(Date.now());
  attempts.set(key, list);
};

export async function login(formData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const from = String(formData.get('from') ?? '');

  if (!email || !password) {
    return { error: 'Enter your email address and password.' };
  }

  const key = await clientKey(email);
  if (tooManyAttempts(key)) {
    return {
      error: 'Too many attempts. Wait fifteen minutes and try again.'
    };
  }

  const { rows } = await query(
    'select id, email, name, password_hash from admin_users where lower(email) = $1',
    [email]
  );
  const user = rows[0];
  const valid = await verifyPassword(password, user?.password_hash ?? DECOY_HASH);

  if (!user || !valid) {
    recordFailure(key);
    return { error: 'That email address and password do not match our records.' };
  }

  attempts.delete(key);
  await createSession(user);
  await query('update admin_users set last_login_at = now() where id = $1', [
    user.id
  ]);

  redirect(SAFE_FROM.test(from) ? from : '/admin');
}

export async function logout() {
  await destroySession();
  redirect('/admin/login');
}

export async function changePassword(formData) {
  const session = await requireAdmin();
  const current = String(formData.get('currentPassword') ?? '');
  const next = String(formData.get('newPassword') ?? '');
  const confirm = String(formData.get('confirmPassword') ?? '');

  if (next.length < 10) {
    return { error: 'Choose a new password of at least 10 characters.' };
  }
  if (next !== confirm) {
    return { error: 'The new passwords do not match.' };
  }

  const { rows } = await query(
    'select password_hash from admin_users where id = $1',
    [session.id]
  );
  const stored = rows[0]?.password_hash;
  if (!stored || !(await verifyPassword(current, stored))) {
    return { error: 'Your current password is incorrect.' };
  }

  await query('update admin_users set password_hash = $1 where id = $2', [
    await hashPassword(next),
    session.id
  ]);

  return { success: 'Password updated.' };
}

export async function changeEmail(formData) {
  const session = await requireAdmin();
  const password = String(formData.get('currentPassword') ?? '');
  const email = String(formData.get('newEmail') ?? '').trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { error: 'That does not look like an email address.' };
  }

  const { rows } = await query(
    'select name, password_hash from admin_users where id = $1',
    [session.id]
  );
  const stored = rows[0]?.password_hash;
  if (!stored || !(await verifyPassword(password, stored))) {
    return { error: 'Your current password is incorrect.' };
  }

  try {
    await query('update admin_users set email = $1 where id = $2', [
      email,
      session.id
    ]);
  } catch (err) {
    if (err?.code === '23505') {
      return { error: 'Another account already uses that email address.' };
    }
    throw err;
  }

  // The session JWT carries the email, so reissue it or the console keeps
  // showing the old address until the cookie expires.
  await createSession({ id: session.id, email, name: rows[0].name });

  return { success: 'Email address updated. Use it the next time you sign in.' };
}

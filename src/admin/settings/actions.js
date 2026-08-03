'use server';

// Settings-module mutations that have no home in src/cms/actions: the
// subscribers table is not content (no draft, no revisions), and the
// admin_users table is accounts, not content — both live here beside the
// pages that use them.

import { revalidatePath } from 'next/cache';
import { hashPassword, requireAdmin } from '../../lib/auth.js';
import { query } from '../../lib/db.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createAdminUser(formData) {
  await requireAdmin();

  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!name) return { error: 'Give the account a name.' };
  if (!EMAIL_PATTERN.test(email)) return { error: 'That does not look like an email address.' };
  if (password.length < 10) return { error: 'The password needs at least 10 characters.' };

  try {
    const hash = await hashPassword(password);
    await query(
      'insert into admin_users (email, name, password_hash) values ($1, $2, $3)',
      [email, name, hash]
    );
  } catch (error) {
    if (error?.code === '23505') {
      return { error: 'An account with that email address already exists.' };
    }
    console.error('createAdminUser: insert failed.', error);
    return { error: 'The account could not be created. Try again.' };
  }
  revalidatePath('/admin/settings');
  return { ok: true, email };
}

export async function deleteAdminUser(id) {
  const session = await requireAdmin();

  if (String(id) === String(session.id)) {
    return { error: 'You cannot remove the account you are signed in with.' };
  }

  try {
    const { rows } = await query('select count(*)::int as count from admin_users');
    if ((rows[0]?.count ?? 0) <= 1) {
      return { error: 'The console needs at least one account.' };
    }
    const { rowCount } = await query('delete from admin_users where id = $1', [id]);
    if (rowCount === 0) return { error: 'That account was already removed.' };
  } catch (error) {
    console.error('deleteAdminUser: delete failed.', error);
    return { error: 'The account could not be removed. Try again.' };
  }
  revalidatePath('/admin/settings');
  return { ok: true };
}

export async function deleteSubscriber(id) {
  await requireAdmin();
  try {
    const { rowCount } = await query('delete from subscribers where id = $1', [id]);
    if (rowCount === 0) {
      return { error: 'That subscriber was already removed.' };
    }
  } catch (error) {
    console.error('deleteSubscriber: delete failed.', error);
    return { error: 'The subscriber could not be removed. Try again.' };
  }
  revalidatePath('/admin/subscribers');
  return { ok: true };
}

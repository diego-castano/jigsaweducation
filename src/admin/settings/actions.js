'use server';

// Settings-module mutations that have no home in src/cms/actions: the
// subscribers table is not content (no draft, no revisions), so its one
// destructive operation lives here beside the pages that use it.

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '../../lib/auth.js';
import { query } from '../../lib/db.js';

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

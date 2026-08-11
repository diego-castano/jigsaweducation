// Toggles Next draft mode for the admin's live preview iframe.
//
//   GET /api/preview?to=/team            enable (signed-in editors only)
//   GET /api/preview?disable=1&to=/team  disable (open - leaving preview is safe)
//
// `to` must be an app-relative path; anything else falls back to '/' so the
// route can never redirect off-site.

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '../../../src/lib/auth.js';

const safePath = (to) =>
  typeof to === 'string' && to.startsWith('/') && !to.startsWith('//') && !to.includes('\\')
    ? to
    : '/';

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const to = safePath(params.get('to'));
  const draft = await draftMode();

  if (params.get('disable')) {
    draft.disable();
    redirect(to);
  }

  const session = await getSession();
  if (!session) redirect('/admin/login');

  draft.enable();
  redirect(to);
}

import { redirect } from 'next/navigation';
import { requireAdmin } from '../../../src/lib/auth';
import ChangePasswordForm from './ChangePasswordForm';

// First sign-in with a temporary password lands here, and proxy.js keeps the
// session here until a new password is set. Anyone else is sent on.
export const dynamic = 'force-dynamic';

export default async function ChangePasswordPage() {
  const session = await requireAdmin({ allowPasswordChange: true });
  if (!session.mustChange) redirect('/admin');
  return <ChangePasswordForm name={session.name} />;
}

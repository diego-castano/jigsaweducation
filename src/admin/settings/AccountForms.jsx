'use client';

// The Account tab: change-email and change-password forms over the server
// actions in src/cms/actions/auth.js. Both actions demand the current
// password and return {error}/{success} objects; errors render inline,
// success shows a toast. changeEmail reissues the session JWT server-side,
// so a success refreshes the router and the console chrome picks up the new
// address at once. React 19 resets the form fields after each submission,
// which is exactly right for password fields.

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { changeEmail, changePassword } from '../../cms/actions/auth.js';
import { Button, Input, useToast } from '../ui.jsx';

function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg bg-error-50 px-3.5 py-2.5 text-sm text-error-700">
      {message}
    </p>
  );
}

function Field({ id, label, help, ...inputProps }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink-800">
        {label}
      </label>
      <Input id={id} {...inputProps} />
      {help && <p className="text-sm text-ink-600">{help}</p>}
    </div>
  );
}

export default function AccountForms({ email }) {
  const toast = useToast();
  const router = useRouter();

  const [emailState, emailAction, emailPending] = useActionState(
    async (_previous, formData) => (await changeEmail(formData)) ?? {},
    null
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    async (_previous, formData) => (await changePassword(formData)) ?? {},
    null
  );

  useEffect(() => {
    if (emailState?.success) {
      toast.success(emailState.success);
      // The action reissued the session cookie; re-render the server tree so
      // the top bar and this page show the new address.
      router.refresh();
    }
  }, [emailState, toast, router]);

  useEffect(() => {
    if (passwordState?.success) toast.success(passwordState.success);
  }, [passwordState, toast]);

  return (
    <div className="max-w-2xl space-y-6">
      <section
        aria-labelledby="account-email-h"
        className="rounded-2xl border border-cream-200 bg-cream-100 p-5 shadow-xs sm:p-7"
      >
        <h2 id="account-email-h" className="font-display text-xl text-ink-900">
          Email address
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          You sign in as <span className="font-mono text-ink-800">{email}</span>. Change it here
          and use the new address the next time you sign in.
        </p>

        <form action={emailAction} className="mt-5 space-y-5">
          <Field
            id="account-new-email"
            label="New email address"
            name="newEmail"
            type="email"
            autoComplete="email"
            required
            invalid={Boolean(emailState?.error)}
          />
          <Field
            id="account-email-password"
            label="Current password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            help="Confirms it is really you making the change."
          />
          <ErrorNote message={emailState?.error} />
          <Button type="submit" loading={emailPending}>
            Change email address
          </Button>
        </form>
      </section>

      <section
        aria-labelledby="account-password-h"
        className="rounded-2xl border border-cream-200 bg-cream-100 p-5 shadow-xs sm:p-7"
      >
        <h2 id="account-password-h" className="font-display text-xl text-ink-900">
          Password
        </h2>

        <form action={passwordAction} className="mt-5 space-y-5">
          <Field
            id="account-current-password"
            label="Current password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
          />
          <Field
            id="account-new-password"
            label="New password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            invalid={Boolean(passwordState?.error)}
            help="At least 10 characters. A short sentence works well."
          />
          <Field
            id="account-confirm-password"
            label="New password again"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            invalid={Boolean(passwordState?.error)}
          />
          <ErrorNote message={passwordState?.error} />
          <Button type="submit" loading={passwordPending}>
            Change password
          </Button>
        </form>
      </section>
    </div>
  );
}

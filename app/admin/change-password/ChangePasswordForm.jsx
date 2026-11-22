'use client';

import { useActionState } from 'react';
import SiteLogo from '../../../src/site/components/SiteLogo';
import { changePassword, logout } from '../../../src/cms/actions/auth';

const INPUT =
  'w-full px-5 py-3 bg-cream-50 border border-cream-300 rounded-full text-base text-ink-900 transition-colors focus:outline-none focus:border-orange-500';

function Field({ id, name, label, autoComplete, hint, autoFocus }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-navy-800 mb-2">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="password"
        autoComplete={autoComplete}
        required
        autoFocus={autoFocus}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={INPUT}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-2 px-2 text-xs text-ink-600">
          {hint}
        </p>
      )}
    </div>
  );
}

export default function ChangePasswordForm({ name }) {
  const [state, formAction, pending] = useActionState(
    async (_previous, formData) => changePassword(formData),
    null
  );

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center reveal">
          <SiteLogo size={48} href="/" />
        </div>

        <div className="mt-10 bg-white border border-cream-200 rounded-3xl shadow-lg p-8 sm:p-10 reveal reveal-1">
          <h1 className="display-s text-3xl">Choose a new password</h1>
          <p className="mt-2 text-sm text-ink-600">
            {name ? `Welcome, ${name}. ` : ''}You signed in with a temporary
            password. Set your own to open the console.
          </p>

          <form action={formAction} className="mt-8 space-y-5" noValidate>
            <Field
              id="cp-current"
              name="currentPassword"
              label="Temporary password"
              autoComplete="current-password"
              autoFocus
            />
            <Field
              id="cp-new"
              name="newPassword"
              label="New password"
              autoComplete="new-password"
              hint="At least 10 characters."
            />
            <Field
              id="cp-confirm"
              name="confirmPassword"
              label="Repeat the new password"
              autoComplete="new-password"
            />

            {state?.error && (
              <p role="alert" className="px-4 py-3 bg-error-50 text-error-700 text-sm rounded-xl">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="tactile w-full px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
            >
              {pending ? 'Saving…' : 'Save and continue'}
            </button>
          </form>
        </div>

        <form action={logout} className="mt-8 text-center reveal reveal-2">
          <button type="submit" className="text-xs text-ink-600 underline underline-offset-2 hover:text-navy-800">
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}

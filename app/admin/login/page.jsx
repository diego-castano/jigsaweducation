'use client';

import { use, useActionState } from 'react';
import SiteLogo from '../../../src/site/components/SiteLogo';
import { login } from '../../../src/cms/actions/auth';

// Client page: useActionState gives inline errors and a pending state without
// bouncing credentials through the URL. searchParams arrives as a Promise in
// Next 16, unwrapped with use().
export default function AdminLoginPage({ searchParams }) {
  const { from = '' } = use(searchParams);

  const [state, formAction, pending] = useActionState(
    async (_previous, formData) => login(formData),
    null
  );

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center reveal">
          <SiteLogo size={48} href="/" />
        </div>

        <div className="mt-10 bg-white border border-cream-200 rounded-3xl shadow-lg p-8 sm:p-10 reveal reveal-1">
          <h1 className="display-s text-3xl">Sign in</h1>
          <p className="mt-2 text-sm text-ink-600">
            The Jigsaw content console. Changes you make here publish to the
            public site.
          </p>

          <form action={formAction} className="mt-8 space-y-5" noValidate>
            <input type="hidden" name="from" value={from} />

            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-bold text-navy-800 mb-2"
              >
                Email address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                autoFocus
                // text-base: anything under 16px makes iOS Safari zoom the
                // page on focus.
                className="w-full px-5 py-3 bg-cream-50 border border-cream-300 rounded-full text-base text-ink-900 transition-colors focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-bold text-navy-800 mb-2"
              >
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-5 py-3 bg-cream-50 border border-cream-300 rounded-full text-base text-ink-900 transition-colors focus:outline-none focus:border-orange-500"
              />
            </div>

            {state?.error && (
              <p
                role="alert"
                className="px-4 py-3 bg-error-50 text-error-700 text-sm rounded-xl"
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="tactile w-full px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-ink-600 reveal reveal-2">
          Accounts are created by invitation. If you need access, ask your
          administrator.
        </p>
      </div>
    </main>
  );
}

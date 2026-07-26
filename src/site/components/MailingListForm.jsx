'use client';

import { useState } from 'react';
import Icon from '../../components/Icon';

// The client has a barely-used Mailchimp account and wants to capture contacts
// without committing to a newsletter cadence. Submission is stubbed until the
// Mailchimp audience ID is wired in the backend phase — the form validates for
// real, then reports that it is not connected yet rather than pretending to
// have subscribed anyone.
export default function MailingListForm({ reversed = false, compact = false }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | error | stubbed
  const [message, setMessage] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const value = email.trim();

    if (!value) {
      setState('error');
      setMessage('Enter an email address.');
      return;
    }
    // Deliberately permissive: the only reliable test of an address is sending
    // to it. This catches typos, not exotic-but-valid addresses.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setState('error');
      setMessage('That does not look like an email address.');
      return;
    }

    setState('stubbed');
    setMessage('Form validated. Mailchimp is not connected yet — this is a mockup.');
  };

  const inputBase = reversed
    ? 'bg-navy-800 border-navy-700 text-cream-50 placeholder:text-cream-400 focus:border-orange-400'
    : 'bg-cream-50 border-cream-300 text-ink-900 placeholder:text-ink-500 focus:border-orange-500';

  return (
    <form onSubmit={submit} noValidate>
      <div className={`flex gap-2 ${compact ? '' : 'flex-col sm:flex-row'}`}>
        <label htmlFor="mailing-list-email" className="sr-only">
          Email address
        </label>
        <input
          id="mailing-list-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== 'idle') setState('idle');
          }}
          placeholder="your@email.com"
          aria-invalid={state === 'error'}
          aria-describedby={state === 'idle' ? undefined : 'mailing-list-message'}
          className={`flex-1 min-w-0 px-4 py-3 border rounded-full text-sm transition-colors focus:outline-none ${inputBase}`}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          Sign up
        </button>
      </div>

      {state !== 'idle' && (
        <p
          id="mailing-list-message"
          role="status"
          className={`mt-3 text-sm flex items-start gap-2 ${
            state === 'error'
              ? 'text-error-500'
              : reversed
                ? 'text-cream-300'
                : 'text-ink-600'
          }`}
        >
          <Icon name={state === 'error' ? 'alert' : 'info'} size={16} className="mt-0.5 shrink-0" />
          {message}
        </p>
      )}
    </form>
  );
}

'use client';

import { useActionState, useId, useState } from 'react';
import Icon from '../../components/Icon';
import { subscribeToMailingList } from '../../cms/actions/content';

// The real mailing-list capture: a valid address lands in the subscribers
// table through the subscribeToMailingList server action, tagged with which
// form it came from (`source`). Validation still happens here first, so an
// empty or misspelt address never costs a round trip, and the messages are
// editable interface text passed down as props — the defaults mirror the
// ui-strings seed so a missing prop never blanks the form.
export default function MailingListForm({
  reversed = false,
  compact = false,
  source = 'footer',
  emailPlaceholder = 'your@email.com',
  signupButton = 'Sign up',
  signupErrorEmpty = 'Enter an email address.',
  signupErrorInvalid = 'That does not look like an email address.',
  signupSuccess = 'Thank you. You are on the list.'
}) {
  // Unique per instance: Contact renders this form twice on one page (its
  // own band plus the footer's), and a hardcoded id meant duplicate DOM ids.
  const inputId = useId();
  const messageId = useId();
  const [email, setEmail] = useState('');
  const [dismissed, setDismissed] = useState(false);

  const [result, formAction] = useActionState(async (previous, formData) => {
    const value = String(formData.get('email') || '').trim();

    if (!value) {
      return { ok: false, message: signupErrorEmpty };
    }
    // Deliberately permissive: the only reliable test of an address is sending
    // to it. This catches typos, not exotic-but-valid addresses.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return { ok: false, message: signupErrorInvalid };
    }

    const response = await subscribeToMailingList(formData);
    // The saved-address message is interface text the admin edits; server
    // failures keep the action's own explanation.
    return response.ok ? { ok: true, message: signupSuccess } : response;
  }, null);

  const state = !result || dismissed ? 'idle' : result.ok ? 'success' : 'error';
  const message = result?.message || '';

  const inputBase = reversed
    ? 'bg-navy-800 border-navy-700 text-cream-50 placeholder:text-cream-400 focus:border-orange-400'
    : 'bg-cream-50 border-cream-300 text-ink-900 placeholder:text-ink-500 focus:border-orange-500';

  return (
    <form action={formAction} onSubmit={() => setDismissed(false)} noValidate>
      <input type="hidden" name="source" value={source} />
      <div className={`flex gap-2 ${compact ? '' : 'flex-col sm:flex-row'}`}>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (!dismissed) setDismissed(true);
          }}
          placeholder={emailPlaceholder}
          aria-invalid={state === 'error'}
          aria-describedby={state === 'idle' ? undefined : messageId}
          // text-base on touch screens: any input under 16px makes iOS Safari zoom
          // the whole page on focus, which is the single most app-breaking bug
          // a mobile form can have.
          className={`flex-1 min-w-0 px-4 py-3 border rounded-full text-base sm:text-sm transition-colors focus:outline-none ${inputBase}`}
        />
        <button
          type="submit"
          className="tactile px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          {signupButton}
        </button>
      </div>

      {state !== 'idle' && (
        <p
          id={messageId}
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

'use client';

// Route-group error boundary: the shell stays up, the failed screen explains
// itself and offers a retry - never a dead console.

import { useEffect } from 'react';
import Icon from '../../../src/components/Icon';
import { Button } from '../../../src/admin/ui';

export default function ConsoleError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-error-50 text-error-700">
        <Icon name="alert" size={26} />
      </span>
      <h1 className="mt-5 font-display display-s text-2xl text-navy-900">
        This screen could not load
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
        Nothing has been lost: the public site is unaffected and your drafts are safe.
        Try again, and if it keeps happening, contact your developer.
      </p>
      {error?.message && (
        <p className="mt-4 max-w-full overflow-x-auto rounded-xl bg-cream-100 px-4 py-2 font-mono text-xs text-ink-600">
          {error.message}
        </p>
      )}
      <div className="mt-6">
        <Button onClick={reset} icon="arrow-right">
          Try again
        </Button>
      </div>
    </div>
  );
}

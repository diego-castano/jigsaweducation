'use client';

// One button that republishes every cached page from the database. Exists
// for the rare change made outside the console (a script, a direct database
// edit) that the automatic revalidation never saw.

import { useState } from 'react';
import Icon from '../../components/Icon.jsx';
import { Button, useToast } from '../ui.jsx';
import { refreshSiteCache } from './actions.js';

export default function CacheRefresh() {
  const toast = useToast();
  const [pending, setPending] = useState(false);

  const refresh = async () => {
    setPending(true);
    try {
      const result = await refreshSiteCache();
      if (result?.error) toast.error(result.error);
      else toast.success('Done: every page now shows the latest content.');
    } catch {
      toast.error('The refresh did not go through. Try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cream-200 bg-cream-100 p-5">
      <div className="flex min-w-0 items-start gap-3">
        <Icon name="zap" size={18} className="mt-0.5 shrink-0 text-ink-500" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-navy-900">Refresh the site</p>
          <p className="mt-0.5 text-sm text-ink-600">
            Publishing already refreshes everything automatically. Press this only if the
            site somehow shows older content than the console.
          </p>
        </div>
      </div>
      <Button variant="secondary" size="sm" loading={pending} onClick={refresh}>
        Refresh site
      </Button>
    </div>
  );
}

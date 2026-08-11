'use client';

// Watches /api/version and offers a reload when production moves under the
// editor's feet - a new deploy while the console is open otherwise means
// stale forms talking to new actions. Polls every minute and on tab focus;
// dismissing stands down until the version changes again. Reloading is the
// editor's choice: drafts autosave, so nothing is lost either way.

import { useEffect, useRef, useState } from 'react';
import Icon from '../../components/Icon';

const POLL_MS = 60_000;

export default function VersionWatcher() {
  const [updateReady, setUpdateReady] = useState(false);
  const baselineRef = useRef(null);
  const dismissedRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch('/api/version', { cache: 'no-store' });
        if (!res.ok) return;
        const { version } = await res.json();
        if (cancelled || !version) return;
        if (baselineRef.current === null) {
          baselineRef.current = version;
          return;
        }
        if (version !== baselineRef.current && version !== dismissedRef.current) {
          setUpdateReady(version);
        }
      } catch {
        // Offline or mid-deploy: try again on the next tick.
      }
    };

    check();
    const timer = setInterval(check, POLL_MS);
    const onFocus = () => document.visibilityState === 'visible' && check();
    document.addEventListener('visibilitychange', onFocus);
    window.addEventListener('focus', onFocus);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onFocus);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  if (!updateReady) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-[90] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-navy-800 bg-navy-900 px-4 py-3 text-cream-100 shadow-xl"
    >
      <Icon name="rocket" size={18} className="shrink-0 text-orange-400" />
      <p className="min-w-0 flex-1 text-sm">
        The console has been updated. Reload to pick up the new version: your work is
        already saved.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="tactile shrink-0 rounded-full bg-orange-500 px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      >
        Reload
      </button>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          dismissedRef.current = updateReady;
          setUpdateReady(false);
        }}
        className="shrink-0 rounded-full p-1.5 text-cream-300 transition-colors hover:bg-navy-800 hover:text-cream-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      >
        <Icon name="x" size={14} />
      </button>
    </div>
  );
}

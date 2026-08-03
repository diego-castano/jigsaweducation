'use client';

// The console below lg: a slim top bar with the menu button, and the Sidebar
// re-hung as a left drawer. Focus trap, Escape, overlay tap and navigation
// all close it — the same behaviours as the public site's drawer, mirrored
// (this one slides from the left, where the sidebar lives).

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../../components/Icon';
import { Badge } from '../ui';
import { logout } from '../../cms/actions/auth';
import Sidebar from './Sidebar';

const FOCUSABLE = 'a[href], button:not([disabled])';

export default function MobileShell({ groups, session, draftCount = 0 }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Close on navigation; lock the page behind the drawer while open.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Focus trap: Tab cycles inside the drawer, Escape closes it, and whoever
  // opened it gets focus back.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    closeBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = dialogRef.current?.querySelectorAll(FOCUSABLE);
      if (!nodes?.length) return;
      const list = [...nodes];
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open]);

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/90 backdrop-blur-md lg:hidden"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex h-16 items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open console menu"
              aria-expanded={open}
              aria-controls="admin-drawer"
              className="tactile -ml-2 rounded-xl p-3 text-navy-900 transition-colors hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Icon name="menu" size={22} />
            </button>

            <Link
              href="/admin"
              className="flex items-center gap-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <span className="block h-8 w-8 shrink-0 overflow-hidden rounded-full">
                <img
                  src="/logo.png"
                  alt=""
                  width={128}
                  height={32}
                  decoding="async"
                  style={{
                    width: 128,
                    height: 32,
                    maxWidth: 'none',
                    objectFit: 'cover',
                    objectPosition: 'left center',
                    display: 'block'
                  }}
                />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-navy-900">
                Console
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {draftCount > 0 && (
              <Badge tone="amber">
                {draftCount} draft{draftCount === 1 ? '' : 's'}
              </Badge>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener"
              aria-label="View site (opens in a new tab)"
              className="tactile -mr-1 rounded-xl p-2.5 text-ink-700 transition-colors hover:bg-cream-200 hover:text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Icon name="arrow-up-right" size={18} />
            </a>
          </div>
        </div>
      </header>

      <div
        id="admin-drawer"
        className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className="absolute inset-0 bg-navy-900/50"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Console menu"
          className={`absolute bottom-0 left-0 top-0 flex w-[300px] max-w-[86%] flex-col bg-navy-900 shadow-xl transition-transform duration-300 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute right-2 top-4 z-10">
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close console menu"
              className="tactile rounded-xl p-3 text-cream-100 transition-colors hover:bg-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Icon name="x" size={20} />
            </button>
          </div>

          <Sidebar groups={groups} className="min-h-0 flex-1" />

          <div
            className="shrink-0 border-t border-navy-800 px-3 py-3"
            style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
          >
            <p className="truncate px-4 pb-2 font-mono text-[11px] text-navy-300">
              {session?.email}
            </p>
            <div className="flex items-center gap-1">
              <Link
                href="/admin/settings?tab=account"
                className="flex flex-1 items-center gap-2.5 rounded-lg py-2 pl-4 pr-3 text-sm text-navy-200 transition-colors hover:bg-navy-800/60 hover:text-cream-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
              >
                <Icon name="user" size={16} className="text-navy-300" />
                Account
              </Link>
              <form action={logout} className="flex-1">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 rounded-lg py-2 pl-4 pr-3 text-left text-sm text-navy-200 transition-colors hover:bg-navy-800/60 hover:text-cream-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
                >
                  <Icon name="arrow-right" size={16} className="text-navy-300" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

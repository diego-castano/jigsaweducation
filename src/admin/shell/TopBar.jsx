'use client';

// Desktop top bar: mono breadcrumb on the left; draft chip, "View site" and
// the user menu on the right. Hidden below lg — MobileShell owns that bar.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../../components/Icon';
import { Badge } from '../ui';
import { logout } from '../../cms/actions/auth';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Group segments have no index route of their own — linking them would 404.
const UNLINKABLE = new Set(['pages', 'collections']);

function crumbsFor(pathname, labels) {
  const segments = pathname.split('/').filter(Boolean).slice(1); // drop 'admin'
  const crumbs = [{ label: 'Console', href: '/admin' }];
  let path = '/admin';
  for (const segment of segments) {
    path += `/${segment}`;
    const label = labels[segment] || (UUID.test(segment) ? 'Item' : segment);
    crumbs.push({ label, href: UNLINKABLE.has(segment) ? null : path });
  }
  return crumbs;
}

export default function TopBar({ session, draftCount = 0, labels = {} }) {
  const pathname = usePathname();
  const crumbs = crumbsFor(pathname, labels);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the user menu on outside click, Escape, and navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const initial = (session?.name || session?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <header className="z-30 hidden lg:flex h-16 shrink-0 items-center justify-between gap-6 border-b border-cream-200 bg-cream-50 px-8">
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex items-center gap-1.5 font-mono text-xs text-ink-600">
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex min-w-0 items-center gap-1.5">
                {index > 0 && (
                  <span aria-hidden="true" className="text-cream-400">
                    /
                  </span>
                )}
                {last ? (
                  <span aria-current="page" className="truncate text-navy-900 font-bold">
                    {crumb.label}
                  </span>
                ) : crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="truncate rounded-sm transition-colors hover:text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="truncate">{crumb.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        {draftCount > 0 && (
          <Link
            href="/admin"
            className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            title="Unpublished draft edits across the console"
          >
            <Badge tone="amber">
              {draftCount} draft{draftCount === 1 ? '' : 's'}
            </Badge>
          </Link>
        )}

        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="tactile inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ink-700 transition-colors hover:bg-cream-200 hover:text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          View site
          <Icon name="arrow-up-right" size={14} />
        </a>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Account menu"
            className="tactile flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 font-display text-sm text-cream-50 transition-colors hover:bg-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            {initial}
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="slide-in absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-lg"
            >
              <div className="border-b border-cream-200 px-4 py-3">
                {session?.name && (
                  <p className="truncate text-sm font-bold text-navy-900">{session.name}</p>
                )}
                <p className="truncate font-mono text-xs text-ink-600">{session?.email}</p>
              </div>
              <div className="p-1.5">
                <Link
                  href="/admin/settings?tab=account"
                  role="menuitem"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-ink-800 transition-colors hover:bg-cream-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
                >
                  <Icon name="user" size={16} className="text-ink-500" />
                  Account
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-ink-800 transition-colors hover:bg-cream-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
                  >
                    <Icon name="arrow-right" size={16} className="text-ink-500" />
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

// The console's navy spine. Rendered twice: fixed on desktop, inside the
// MobileShell drawer on small screens — identical markup, so the console
// reads the same everywhere. Client only for usePathname (active states)
// and the disclosure state.
//
// Two row registers keep 25 destinations calm: top-level items (Dashboard,
// Media, Subscribers, Settings) carry icons; the Pages and Content groups
// collapse behind a disclosure and their rows are text-only. The group
// holding the active route opens itself; manual choices persist.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../../components/Icon';

const STORAGE_KEY = 'jigsaw-admin:nav-open';

const readStored = () => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

export default function Sidebar({ groups, className = '' }) {
  const pathname = usePathname();

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const groupHasActive = (group) => group.items.some((item) => isActive(item));

  // Server render: only the active group open. After mount, manual
  // preferences overlay that default (active group always stays reachable —
  // collapsing it is a choice the editor makes, so we honour it too).
  const [open, setOpen] = useState(null);

  useEffect(() => {
    setOpen((current) => ({ ...current, ...readStored() }));
  }, []);

  const isOpen = (group) => {
    const stored = open?.[group.id];
    if (stored !== undefined) return stored;
    return groupHasActive(group);
  };

  const toggle = (group) => {
    setOpen((current) => {
      const next = { ...(current || {}), [group.id]: !isOpen(group) };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Preference simply is not remembered.
      }
      return next;
    });
  };

  return (
    <div className={`flex h-full flex-col bg-navy-900 text-cream-100 ${className}`}>
      {/* Mark + label. The badge sits in the leftmost quarter of the source
          PNG, hence the 4x-wide crop — same trick as SiteLogo. */}
      <Link
        href="/admin"
        className="flex items-center gap-3 h-20 px-5 border-b border-navy-800 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
      >
        <span className="block h-9 w-9 shrink-0 overflow-hidden rounded-full">
          <img
            src="/logo.png"
            alt=""
            width={144}
            height={36}
            decoding="async"
            style={{
              width: 144,
              height: 36,
              maxWidth: 'none',
              objectFit: 'cover',
              objectPosition: 'left center',
              display: 'block'
            }}
          />
        </span>
        <span className="leading-none">
          <span className="block font-mono text-[13px] uppercase tracking-[0.24em] text-cream-100">
            Console
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-navy-300">
            Jigsaw
          </span>
        </span>
      </Link>

      <nav
        aria-label="Console"
        className="admin-scroll flex-1 overflow-y-auto overscroll-contain px-3 py-4"
      >
        <div className="space-y-1">
          {groups.map((group) =>
            group.collapsible ? (
              <div key={group.id} className="pt-1">
                <button
                  type="button"
                  onClick={() => toggle(group)}
                  aria-expanded={isOpen(group)}
                  className="flex w-full items-center justify-between rounded-lg py-2 pl-4 pr-2.5 text-left transition-colors hover:bg-navy-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy-200">
                    {group.label}
                  </span>
                  <span className="flex items-center gap-2">
                    {!isOpen(group) && groupHasActive(group) && (
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                    )}
                    <Icon
                      name="chevron-down"
                      size={14}
                      className={`text-navy-300 transition-transform motion-reduce:transition-none ${
                        isOpen(group) ? '' : '-rotate-90'
                      }`}
                    />
                  </span>
                </button>

                {isOpen(group) && (
                  <ul className="mt-0.5 mb-1.5 ml-4 space-y-px border-l border-navy-800 pl-1">
                    {group.items.map((item) => {
                      const active = isActive(item);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            className={`relative block rounded-md py-1.5 pl-3 pr-2 text-[13px] leading-snug transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset ${
                              active
                                ? 'font-bold text-cream-50'
                                : 'text-navy-200 hover:bg-navy-800/60 hover:text-cream-100'
                            }`}
                          >
                            {active && (
                              <span
                                aria-hidden="true"
                                className="absolute -left-[5px] top-1.5 bottom-1.5 w-0.5 rounded-full bg-orange-400"
                              />
                            )}
                            <span className="block truncate">{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ) : (
              <ul key={group.id} className="space-y-px">
                {group.items.map((item) => {
                  const active = isActive(item);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={`relative flex items-center gap-3 rounded-lg py-2 pl-4 pr-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset ${
                          active
                            ? 'bg-navy-800 font-bold text-cream-50'
                            : 'text-navy-200 hover:bg-navy-800/60 hover:text-cream-100'
                        }`}
                      >
                        {active && (
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-orange-400"
                          />
                        )}
                        <Icon
                          name={item.icon}
                          size={17}
                          className={`shrink-0 ${active ? 'text-orange-400' : 'text-navy-300'}`}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )
          )}
        </div>
      </nav>

      <div
        className="border-t border-navy-800 px-3 py-3 shrink-0"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-3 rounded-lg py-2 pl-4 pr-3 text-sm text-navy-200 transition-colors hover:bg-navy-800/60 hover:text-cream-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
        >
          <Icon name="external" size={16} className="shrink-0 text-navy-300" />
          View site
        </a>
      </div>
    </div>
  );
}

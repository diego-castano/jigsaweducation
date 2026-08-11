'use client';

// The console's navy spine. Rendered twice: in the desktop rail (where it
// can collapse to icons) and inside the MobileShell drawer (always expanded).
//
// Two row registers keep 25 destinations calm: top-level items carry icons;
// Pages and Content collapse behind disclosures with text-only rows. Each
// big group has its own accent colour so the eye separates them at a glance:
// Pages runs sea, Content runs orange. Collapsed to the rail, each group is
// one icon - pressing it expands the rail with that group open.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../../components/Icon';

const STORAGE_KEY = 'jigsaw-admin:nav-open';

// Static class maps - Tailwind needs the full strings in source.
const ACCENTS = {
  sea: {
    label: 'text-sea-300',
    bar: 'bg-sea-400',
    activeText: 'text-sea-200',
    railIcon: 'text-sea-300'
  },
  orange: {
    label: 'text-orange-300',
    bar: 'bg-orange-400',
    activeText: 'text-orange-200',
    railIcon: 'text-orange-300'
  },
  neutral: {
    label: 'text-navy-200',
    bar: 'bg-orange-400',
    activeText: 'text-cream-50',
    railIcon: 'text-cream-200'
  }
};

const readStored = () => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

export default function Sidebar({ groups, collapsed = false, onToggleCollapsed, className = '' }) {
  const pathname = usePathname();

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const groupHasActive = (group) => group.items.some((item) => isActive(item));

  const [open, setOpen] = useState(null);

  useEffect(() => {
    setOpen((current) => ({ ...current, ...readStored() }));
  }, []);

  const isOpen = (group) => {
    const stored = open?.[group.id];
    if (stored !== undefined) return stored;
    return groupHasActive(group);
  };

  const setGroup = (group, value) => {
    setOpen((current) => {
      const next = { ...(current || {}), [group.id]: value };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Preference simply is not remembered.
      }
      return next;
    });
  };

  const accentOf = (group) => ACCENTS[group.accent] || ACCENTS.neutral;

  // ---- Collapsed rail -------------------------------------------------------
  if (collapsed) {
    return (
      <div className={`flex h-full flex-col items-stretch bg-navy-900 text-cream-100 ${className}`}>
        <Link
          href="/admin"
          title="Dashboard"
          className="flex h-20 items-center justify-center border-b border-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
        >
          <span className="block h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <img
              src="/logo.png"
              alt="Console"
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
        </Link>

        <nav aria-label="Console" className="flex flex-1 flex-col items-center gap-1 overflow-y-auto py-4">
          {groups.map((group) =>
            group.collapsible ? (
              <button
                key={group.id}
                type="button"
                title={group.label}
                aria-label={`${group.label}: expand the menu`}
                onClick={() => {
                  setGroup(group, true);
                  onToggleCollapsed?.();
                }}
                className={`relative grid size-11 place-items-center rounded-xl transition-colors hover:bg-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset ${accentOf(group).railIcon}`}
              >
                {groupHasActive(group) && (
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${accentOf(group).bar}`}
                  />
                )}
                <Icon name={group.icon} size={19} />
              </button>
            ) : (
              group.items.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    aria-label={item.label}
                    aria-current={active ? 'page' : undefined}
                    className={`relative grid size-11 place-items-center rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset ${
                      active
                        ? 'bg-navy-800 text-orange-400'
                        : 'text-cream-200 hover:bg-navy-800 hover:text-cream-50'
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-orange-400"
                      />
                    )}
                    <Icon name={item.icon} size={19} />
                  </Link>
                );
              })
            )
          )}
        </nav>

        <div className="flex flex-col items-center gap-1 border-t border-navy-800 py-3">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            title="View site"
            aria-label="View site"
            className="grid size-11 place-items-center rounded-xl text-cream-200 transition-colors hover:bg-navy-800 hover:text-cream-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
          >
            <Icon name="external" size={18} />
          </a>
          <button
            type="button"
            title="Expand the menu"
            aria-label="Expand the menu"
            onClick={onToggleCollapsed}
            className="grid size-11 place-items-center rounded-xl text-cream-200 transition-colors hover:bg-navy-800 hover:text-cream-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
          >
            <Icon name="chevron-right" size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ---- Expanded -------------------------------------------------------------
  return (
    <div className={`flex h-full flex-col bg-navy-900 text-cream-100 ${className}`}>
      {/* Mark + label. The badge sits in the leftmost quarter of the source
          PNG, hence the 4x-wide crop: same trick as SiteLogo. */}
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
          <span className="block font-mono text-[13px] uppercase tracking-[0.24em] text-cream-50">
            Console
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-navy-200">
            Jigsaw
          </span>
        </span>
      </Link>

      <nav
        aria-label="Console"
        className="admin-scroll flex-1 overflow-y-auto overscroll-contain px-3 py-4"
      >
        <div className="space-y-1">
          {groups.map((group) => {
            const accent = accentOf(group);
            return group.collapsible ? (
              <div key={group.id} className="pt-1">
                <button
                  type="button"
                  onClick={() => setGroup(group, !isOpen(group))}
                  aria-expanded={isOpen(group)}
                  className="flex w-full items-center justify-between rounded-lg py-2 pl-4 pr-2.5 text-left transition-colors hover:bg-navy-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon name={group.icon} size={15} className={accent.label} />
                    <span className={`font-mono text-[11px] uppercase tracking-[0.2em] ${accent.label}`}>
                      {group.label}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    {!isOpen(group) && groupHasActive(group) && (
                      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${accent.bar}`} />
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
                  <ul className="mt-0.5 mb-1.5 ml-[1.35rem] space-y-px border-l border-navy-700 pl-1">
                    {group.items.map((item) => {
                      const active = isActive(item);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            className={`relative block rounded-md py-1.5 pointer-coarse:py-2.5 pl-3 pr-2 text-[13px] leading-snug transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset ${
                              active
                                ? `font-bold ${accent.activeText}`
                                : 'text-cream-200 hover:bg-navy-800/60 hover:text-cream-50'
                            }`}
                          >
                            {active && (
                              <span
                                aria-hidden="true"
                                className={`absolute -left-[5px] top-1.5 bottom-1.5 w-0.5 rounded-full ${accent.bar}`}
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
                            : 'text-cream-200 hover:bg-navy-800/60 hover:text-cream-50'
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
                          className={`shrink-0 ${active ? 'text-orange-400' : 'text-cream-300'}`}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </div>
      </nav>

      <div
        className="border-t border-navy-800 px-3 py-3 shrink-0"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center gap-1">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-lg py-2 pl-4 pr-3 text-sm text-cream-200 transition-colors hover:bg-navy-800/60 hover:text-cream-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
          >
            <Icon name="external" size={16} className="shrink-0 text-cream-300" />
            View site
          </a>
          {onToggleCollapsed && (
            <button
              type="button"
              title="Collapse the menu"
              aria-label="Collapse the menu"
              onClick={onToggleCollapsed}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-cream-300 transition-colors hover:bg-navy-800/60 hover:text-cream-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
            >
              <Icon name="chevron-left" size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

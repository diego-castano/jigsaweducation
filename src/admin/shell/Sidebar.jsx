'use client';

// The console's navy spine. Rendered twice: fixed on desktop, inside the
// MobileShell drawer on small screens — identical markup, so the console
// reads the same everywhere. Client only for usePathname (active states).

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../../components/Icon';

export default function Sidebar({ groups, className = '' }) {
  const pathname = usePathname();

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

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

      <nav aria-label="Console" className="flex-1 overflow-y-auto overscroll-contain px-3 py-5">
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.id}>
              {group.label && (
                <p className="mb-1.5 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-navy-300">
                  {group.label}
                </p>
              )}
              <ul className="space-y-px">
                {group.items.map((item) => {
                  const active = isActive(item.href);
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
            </div>
          ))}
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

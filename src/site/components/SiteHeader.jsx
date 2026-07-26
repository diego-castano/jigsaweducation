'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SiteLogo from './SiteLogo';
import Icon from '../../components/Icon';
import { MAIN_NAV, FOOTER_NAV, OFFICES } from '../../data/site';

// Seven items, no dropdowns, logo returns home — exactly as the brief asks.
// The client's dislikes were explicit: "busy, enormous dropdowns" on
// poverty-action.org, mega menus generally. So this stays one flat row.
export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer on navigation, and lock the page behind it while open.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
    <header
      className={`sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md transition-shadow ${
        scrolled ? 'shadow-sm border-b border-cream-300' : 'border-b border-transparent'
      }`}
    >
      <div
        className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between h-20 gap-6">
          <SiteLogo size={40} />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {MAIN_NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative px-3.5 py-2 rounded-full text-[15px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                        active
                          ? 'text-navy-900 font-bold'
                          : 'text-ink-700 hover:text-navy-900 font-normal'
                      }`}
                    >
                      {item.label}
                      {active && (
                        <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-0.5 bg-orange-500 rounded-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="tactile lg:hidden p-3 -mr-3 rounded-xl text-navy-900 hover:bg-cream-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>
    </header>

      {/* Mobile drawer. A SIBLING of the header on purpose: the header's
          backdrop-blur creates a containing block for fixed descendants, and
          inside it this fixed inset-0 wrapper measured 80px tall — the whole
          menu rendered clipped into the header strip. */}
      <div
        // overflow-hidden matters: the drawer sits translated 100% to the
        // right while closed, and without clipping here that off-canvas box
        // still widens the document's scrollable area on mobile.
        className={`lg:hidden fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-navy-900/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-[86%] max-w-sm bg-cream-50 shadow-xl flex flex-col transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between h-20 px-6 border-b border-cream-300">
            <SiteLogo size={36} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="tactile p-3 -mr-3 rounded-xl text-navy-900 hover:bg-cream-200 transition-colors"
              aria-label="Close menu"
            >
              <Icon name="x" size={22} />
            </button>
          </div>
          <nav
            aria-label="Main, mobile"
            className="flex-1 overflow-y-auto px-4 py-6"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
          >
            <ul className="space-y-1">
              {MAIN_NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-lg transition-colors ${
                        active
                          ? 'bg-cream-200 text-navy-900 font-bold'
                          : 'text-ink-800 hover:bg-cream-100'
                      }`}
                    >
                      {item.label}
                      <Icon name="chevron-right" size={18} className={active ? 'text-orange-500' : 'text-cream-400'} />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* The drawer is the whole site map, the way an app drawer is:
                the two footer-only routes and both mailboxes ride along. */}
            <ul className="mt-6 pt-6 border-t border-cream-300 space-y-1">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-3 rounded-xl text-base text-ink-700 hover:bg-cream-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 pt-6 border-t border-cream-300 space-y-1">
              {OFFICES.map((office) => (
                <li key={office.id}>
                  <a
                    href={`mailto:${office.email}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-sea-700 hover:bg-cream-100 transition-colors [overflow-wrap:anywhere]"
                  >
                    <Icon name="mail" size={16} className="shrink-0 text-ink-500" />
                    {office.email}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

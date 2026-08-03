'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SiteLogo from './SiteLogo';
import Icon from '../../components/Icon';
import { useMobileNav } from './MobileNavContext';

// Seven items, no dropdowns, logo returns home — exactly as the brief asks.
//
// App behaviours layered on:
// - The header hides on scroll-down and returns on scroll-up (mobile only),
//   reclaiming 80px of reading room the way every content app does.
// - The drawer state lives in MobileNavContext so the tab bar's Menu slot
//   drives the same drawer as the hamburger.
// - The drawer traps focus while open, restores it on close, and closes on a
//   rightward swipe as well as Escape and the overlay.
//
// Nav lists, offices and the wordmark arrive as plain props from the server
// layout — this is a client component, so it cannot call the content loaders
// itself. The defaults mirror the seed so a missing prop never blanks the
// chrome.
const DEFAULT_MAIN_NAV = [
  { href: '/services', label: 'Services' },
  { href: '/technical-focus', label: 'Technical focus' },
  { href: '/distinctives', label: 'Distinctives' },
  { href: '/team', label: 'Team' },
  { href: '/case-studies', label: 'Case studies' },
  { href: '/publications', label: 'Publications' },
  { href: '/contact', label: 'Contact' }
];

const DEFAULT_FOOTER_NAV = [
  { href: '/policies', label: 'Policies' },
  { href: '/work-for-us', label: 'Work for us' }
];

const DEFAULT_OFFICES = [
  { id: 'uk', email: 'info@jigsaweducation.org' },
  { id: 'zm', email: 'zambiateam@jigsaweducation.org' }
];

export default function SiteHeader({
  mainNav = DEFAULT_MAIN_NAV,
  footerNav = DEFAULT_FOOTER_NAV,
  offices = DEFAULT_OFFICES,
  wordmarkSrc = null
}) {
  const pathname = usePathname();
  const { menuOpen, setMenuOpen } = useMobileNav();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const dialogRef = useRef(null);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const touch = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Direction with a small dead zone, so a rubber-band bounce or a 1px
      // jitter never flickers the header.
      if (y > lastY.current + 6 && y > 96) setHidden(true);
      else if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer on navigation, and lock the page behind it while open.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setMenuOpen]);

  // Focus trap: while the drawer is open Tab cycles inside it, and whoever
  // opened it gets focus back when it closes.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.activeElement;
    closeBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const nodes = dialogRef.current?.querySelectorAll('a[href], button:not([disabled])');
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
  }, [menuOpen]);

  // Swipe-to-close: the panel follows the finger to the right and lets go
  // past 90px. Inline styles override the utility transform only while
  // dragging, then clear so the classes take back over.
  const onTouchStart = (e) => {
    touch.current = { x: e.touches[0].clientX };
  };
  const onTouchMove = (e) => {
    if (!touch.current || !panelRef.current) return;
    const dx = e.touches[0].clientX - touch.current.x;
    if (dx > 0) {
      panelRef.current.style.transition = 'none';
      panelRef.current.style.transform = `translateX(${dx}px)`;
    }
  };
  const onTouchEnd = (e) => {
    const dx = (e.changedTouches[0]?.clientX ?? 0) - (touch.current?.x ?? 0);
    if (panelRef.current) {
      panelRef.current.style.transition = '';
      panelRef.current.style.transform = '';
    }
    if (dx > 90) setMenuOpen(false);
    touch.current = null;
  };

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md transition-[transform,box-shadow] duration-300 motion-reduce:transition-none ${
          scrolled ? 'shadow-sm border-b border-cream-300' : 'border-b border-transparent'
        } ${hidden && !menuOpen ? 'max-lg:-translate-y-full' : ''}`}
      >
        <div
          className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="flex items-center justify-between h-20 gap-6">
            <SiteLogo size={40} wordmarkSrc={wordmarkSrc} />

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {mainNav.map((item) => {
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
              onClick={() => setMenuOpen(true)}
              className="tactile lg:hidden p-3 -mr-3 rounded-xl text-navy-900 hover:bg-cream-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
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
        id="mobile-drawer"
        className={`lg:hidden fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-navy-900/40"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
        <div
          ref={(el) => {
            dialogRef.current = el;
            panelRef.current = el;
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className={`absolute right-0 top-0 bottom-0 w-[86%] max-w-sm bg-cream-50 shadow-xl flex flex-col transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between h-20 px-6 border-b border-cream-300 shrink-0">
            <SiteLogo size={36} wordmarkSrc={wordmarkSrc} />
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              className="tactile p-3 -mr-3 rounded-xl text-navy-900 hover:bg-cream-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              aria-label="Close menu"
            >
              <Icon name="x" size={22} />
            </button>
          </div>
          <nav
            aria-label="Main, mobile"
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-6"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
          >
            <ul className="space-y-1">
              {mainNav.map((item) => {
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
                      <Icon
                        name="chevron-right"
                        size={18}
                        className={active ? 'text-orange-500' : 'text-cream-400'}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* The drawer is the whole site map, the way an app drawer is:
                the two footer-only routes and both mailboxes ride along. */}
            <ul className="mt-6 pt-6 border-t border-cream-300 space-y-1">
              {footerNav.map((item) => (
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
              {offices.map((office) => (
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

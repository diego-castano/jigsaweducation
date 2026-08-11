'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../../components/Icon';
import { useMobileNav } from './MobileNavContext';

// The app-grade bottom navigation, mobile only. Four destinations plus Menu:
// a tab bar holds four or five slots or it stops being one, so the four
// most-travelled routes ride here and the Menu slot opens the drawer, which
// remains the complete site map. Icons come from the site's own SVG set -
// they inherit currentColor for the active state, which a raster glyph never
// could - and the active slot carries the same orange top bar the desktop
// nav underlines with, so the two systems read as one.
// The routes, icons and five-slot count are structural; only the labels are
// editable, arriving as the `tabs` prop (a list of { label } rows from Site
// settings) merged over these defaults by position.
const TABS = [
  { href: '/', label: 'Home', icon: 'home', exact: true },
  { href: '/services', label: 'Services', icon: 'compass' },
  { href: '/case-studies', label: 'Work', icon: 'briefcase' },
  { href: '/publications', label: 'Library', icon: 'book-open' }
];

function Slot({ active, icon, label, children }) {
  return (
    <span className="relative flex flex-col items-center gap-1 w-full py-2">
      {active && (
        <span
          className="absolute top-0 h-0.5 w-8 rounded-full bg-orange-500"
          aria-hidden="true"
        />
      )}
      <Icon
        name={icon}
        size={22}
        strokeWidth={active ? 2 : 1.5}
        className={active ? 'text-orange-600' : 'text-ink-600'}
      />
      <span
        className={`text-[10px] leading-none tracking-wide ${
          active ? 'font-bold text-navy-900' : 'font-medium text-ink-600'
        }`}
      >
        {label}
      </span>
      {children}
    </span>
  );
}

export default function MobileTabBar({ tabs, menuLabel = 'Menu' }) {
  const pathname = usePathname();
  const { menuOpen, setMenuOpen } = useMobileNav();

  const slots = TABS.map((tab, i) => ({ ...tab, label: tabs?.[i]?.label || tab.label }));

  const isActive = (tab) =>
    tab.exact ? pathname === tab.href : pathname === tab.href || pathname.startsWith(tab.href + '/');

  return (
    <nav
      aria-label="Quick navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-cream-50/95 backdrop-blur-md border-t border-cream-300"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-5 max-w-lg mx-auto">
        {slots.map((tab) => {
          const active = isActive(tab);
          return (
            <li key={tab.href} className="flex">
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className="tactile flex w-full min-h-14 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
              >
                <Slot active={active} icon={tab.icon} label={tab.label} />
              </Link>
            </li>
          );
        })}
        <li className="flex">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            className="tactile flex w-full min-h-14 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
          >
            <Slot active={menuOpen} icon="menu" label={menuLabel} />
          </button>
        </li>
      </ul>
    </nav>
  );
}

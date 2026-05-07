import LogoMark from './LogoMark';
import Icon from './Icon';
import { NAV } from '../data/nav';

export default function Sidebar({ active, onNav, mobileOpen, setMobileOpen, theme, toggleTheme }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-[280px] bg-cream-100 border-r border-cream-300 overflow-y-auto z-40 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} no-print`}
    >
      <div className="px-6 py-7 border-b border-cream-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoMark size={36} />
          <div>
            <div className="font-[var(--font-display)] text-lg font-medium text-navy-900 leading-none">Jigsaw</div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-ink-600 mt-1">2026 system</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
            className="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 text-navy-900 flex items-center justify-center transition-colors"
          >
            <Icon name={theme === 'dark' ? 'sparkles' : 'circle'} size={14} />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-ink-700 hover:text-orange-500 ml-1"
            aria-label="Close menu"
          >
            <Icon name="x" size={20} />
          </button>
        </div>
      </div>
      <nav className="px-3 py-4">
        {NAV.map((group, gi) => (
          <div key={gi} className="mb-5">
            <div className="px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-ink-500 font-bold">
              {group.group}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => { onNav(item.id); setMobileOpen(false); }}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[13.5px] transition-colors duration-200 border-l-2 ${
                    active === item.id
                      ? 'border-orange-500 bg-cream-200 text-navy-900 font-bold'
                      : 'border-transparent text-ink-700 hover:bg-cream-200 hover:text-navy-900'
                  }`}
                >
                  <Icon
                    name={item.icon}
                    size={16}
                    className={active === item.id ? 'text-orange-500' : 'text-ink-500 group-hover:text-sea-500'}
                  />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-cream-300 text-[11px] text-ink-500">
        <div>v1.0 · March 2026</div>
        <div className="mt-1">Prepared by Diego Castaño</div>
      </div>
    </aside>
  );
}

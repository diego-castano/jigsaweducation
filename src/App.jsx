import { lazy, useEffect, useState, Fragment } from 'react';
import Sidebar from './components/Sidebar';
import Splash from './components/Splash';
import Icon from './components/Icon';
import SkeletonWrapper, { Fallback } from './components/SkeletonWrapper';
import useCopy from './hooks/useCopy';
import useScrollSpy from './hooks/useScrollSpy';
import { NAV, SECTION_IDS } from './data/nav';

// Lazy-load every page → enables code splitting + skeleton loading
const Home          = lazy(() => import('./pages/Home'));
const Colors        = lazy(() => import('./pages/Colors'));
const Typography    = lazy(() => import('./pages/Typography'));
const Spacing       = lazy(() => import('./pages/Spacing'));
const Elevation     = lazy(() => import('./pages/Elevation'));
const Icons         = lazy(() => import('./pages/Icons'));
const Buttons       = lazy(() => import('./pages/Buttons'));
const Inputs        = lazy(() => import('./pages/Inputs'));
const Cards         = lazy(() => import('./pages/Cards'));
const Badges        = lazy(() => import('./pages/Badges'));
const Navigation    = lazy(() => import('./pages/Navigation'));
const Feedback      = lazy(() => import('./pages/Feedback'));
const Containers    = lazy(() => import('./pages/Containers'));
const Motion        = lazy(() => import('./pages/Motion'));
const Heroes        = lazy(() => import('./pages/Heroes'));
const Publication   = lazy(() => import('./pages/Publication'));
const Team          = lazy(() => import('./pages/Team'));
const Stats         = lazy(() => import('./pages/Stats'));
const Filters       = lazy(() => import('./pages/Filters'));
const Footer        = lazy(() => import('./pages/Footer'));
const Article       = lazy(() => import('./pages/Article'));
const Library       = lazy(() => import('./pages/Library'));
const About         = lazy(() => import('./pages/About'));
const NotFound      = lazy(() => import('./pages/NotFound'));
const Brand         = lazy(() => import('./pages/Brand'));
const Principles    = lazy(() => import('./pages/Principles'));
const Voice         = lazy(() => import('./pages/Voice'));
const Accessibility = lazy(() => import('./pages/Accessibility'));
const AboutSystem   = lazy(() => import('./pages/AboutSystem'));
const Changelog     = lazy(() => import('./pages/Changelog'));

const PAGE_BY_ID = {
  home: Home,
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  elevation: Elevation,
  icons: Icons,
  buttons: Buttons,
  inputs: Inputs,
  cards: Cards,
  badges: Badges,
  navigation: Navigation,
  feedback: Feedback,
  containers: Containers,
  motion: Motion,
  heroes: Heroes,
  publication: Publication,
  team: Team,
  stats: Stats,
  filters: Filters,
  footer: Footer,
  'tpl-article': Article,
  'tpl-library': Library,
  'tpl-about': About,
  'tpl-404': NotFound,
  brand: Brand,
  principles: Principles,
  voice: Voice,
  a11y: Accessibility,
  'sys-about': AboutSystem,
  'sys-changelog': Changelog
};

// Group label that should appear before each section, if any
const GROUP_FOR_SECTION = (() => {
  const map = {};
  NAV.forEach((g) => {
    if (g.items.length) map[g.items[0].id] = g.group;
  });
  return map;
})();

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    try { return localStorage.getItem('jigsaw-theme') || 'light'; } catch (_) { return 'light'; }
  });
  const [toast, copy] = useCopy();
  const active = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    try { localStorage.setItem('jigsaw-theme', theme); } catch (_) {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // Initial hash → scroll
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) {
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
    }
  }, []);

  // Reveal-on-scroll fade-in for sections that opt in
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
    );
    document.querySelectorAll('.scroll-section.fade-in').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const onNav = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    }
  };

  return (
    <Fragment>
      <Splash />
      <Sidebar
        active={active}
        onNav={onNav}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden bg-cream-100 border border-cream-300 rounded-xl p-2.5 shadow-md no-print"
        aria-label="Open menu"
      >
        <Icon name="menu" size={18} />
      </button>
      <main className="lg:ml-[280px] px-6 sm:px-10 lg:px-16 py-12 lg:py-20 max-w-[1200px] mx-0">
        {SECTION_IDS.map((id) => {
          const Page = PAGE_BY_ID[id];
          const groupStart = GROUP_FOR_SECTION[id];
          const isHome = id === 'home';
          return (
            <Fragment key={id}>
              {groupStart && id !== 'home' && (
                <div className="section-divider scroll-section">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold">
                    {groupStart}
                  </div>
                </div>
              )}
              <section id={id} className="scroll-section py-8" data-section={id}>
                <SkeletonWrapper name={`page-${id}`} minHeight={isHome ? 600 : 320}>
                  {Page && (
                    <Page onNav={onNav} onCopy={copy} />
                  )}
                </SkeletonWrapper>
              </section>
            </Fragment>
          );
        })}
      </main>
      <div className={`copy-toast ${toast ? 'visible' : ''}`}>{toast || ' '}</div>
    </Fragment>
  );
}

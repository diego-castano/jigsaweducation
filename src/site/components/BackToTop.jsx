'use client';

import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';

// Floating back-to-top: appears after a viewport and a half of scroll, sits
// above the tab bar on mobile and in the corner on desktop. The footer link
// still covers the end of the page; this one covers the middle of a long
// list, which is where the publications and case-study grids leave you.
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`tactile fixed right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 text-cream-50 shadow-lg transition-all duration-300 hover:bg-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 motion-reduce:transition-none lg:right-8 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
      style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom) + 0.75rem)' }}
    >
      <Icon name="arrow-down" size={18} className="rotate-180" />
    </button>
  );
}

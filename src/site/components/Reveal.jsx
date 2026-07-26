'use client';

import { useEffect, useRef } from 'react';

// Scroll-reveal wrapper. Adds .rv-in when the element enters the viewport;
// the transition itself lives in globals.css (.rv), which also collapses it
// under prefers-reduced-motion. Stagger siblings with the delay prop.
//
// Server components can import this freely: it is the client leaf.
export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('rv-in');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('rv-in');
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`rv ${className}`} style={{ '--rv-delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

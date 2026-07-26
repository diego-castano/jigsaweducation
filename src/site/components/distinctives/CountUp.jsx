'use client';

import { useEffect, useRef } from 'react';

// Count-up for the three crisis figures on Distinctives.
//
// Two rules drive the implementation. First, the number never lives in React
// state: a setState per frame would re-render the whole band sixty times a
// second to change four characters, so the rAF loop writes textContent on one
// node and nothing else in the tree hears about it. Second, the markup ships
// the FINAL value as children, so the figure is correct before hydration, with
// JavaScript off, and for anything that reads the DOM rather than watching it.
// The animation only ever rewinds a value that was already right.
//
// prefers-reduced-motion, a missing IntersectionObserver and SSR all land on
// the same branch: leave the final value alone.
export default function CountUp({
  value,
  duration = 1500,
  threshold = 0.4,
  className = '',
  style
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const final = String(value);
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) {
      el.textContent = final;
      return;
    }

    let frame = 0;
    let startedAt = null;

    // Decelerating cubic: fast enough to read as a count, calm at the landing.
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      if (startedAt === null) startedAt = now;
      const progress = Math.min((now - startedAt) / duration, 1);
      el.textContent = String(Math.round(ease(progress) * value));
      frame = progress < 1 ? requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        el.textContent = '0';
        frame = requestAnimationFrame(tick);
      },
      { threshold }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
      el.textContent = final;
    };
  }, [value, duration, threshold]);

  return (
    <span ref={ref} className={className} style={style}>
      {value}
    </span>
  );
}

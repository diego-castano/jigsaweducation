'use client';

import { useEffect, useRef } from 'react';

// The case study journey. Design feedback, 15 September 2026: "create some
// kind of thread between the four boxes, so that the page takes you
// step-by-step through the journey of the case study."
//
// The steps render on the server and pass through as children. This wrapper
// only marks each [data-step] as reached once it scrolls into the reading
// zone, and CSS fills that step's node and the thread below it. Without
// JavaScript, or under reduced motion, the thread is simply there, complete.
export default function JourneyThread({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const steps = [...root.querySelectorAll('[data-step]')];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      steps.forEach((step) => {
        step.dataset.reached = 'true';
      });
      return;
    }

    // A step counts as reached when its top passes 60% down the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.dataset.reached = 'true';
        }
      },
      { rootMargin: '0px 0px -40% 0px' }
    );
    steps.forEach((step) => io.observe(step));
    return () => io.disconnect();
  }, []);

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}

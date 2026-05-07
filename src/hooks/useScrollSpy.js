import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently most-visible in the viewport.
 * Sections must have an id matching one of the values in `ids` and must be
 * mounted in the DOM at the time the observer runs.
 */
export default function useScrollSpy(ids, options = {}) {
  const [active, setActive] = useState(ids[0] || null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const visibility = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visibility.set(entry.target.id, entry.intersectionRatio));
        let bestId = null;
        let bestRatio = 0;
        visibility.forEach((ratio, id) => {
          if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
        });
        if (bestId && bestRatio > 0.05) setActive(bestId);
      },
      {
        rootMargin: options.rootMargin || '-20% 0px -55% 0px',
        threshold: options.threshold || [0, 0.05, 0.25, 0.5, 0.75, 1]
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  return active;
}

'use client';

import { useEffect, useState } from 'react';

// Anchor index of the approaches. On lg it is the sticky rail and highlights
// the section in view (IntersectionObserver, no scroll listeners); below lg it
// is a plain numbered list under the opener.
export default function ServiceIndex({ services }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const seen = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id);
          else seen.delete(e.target.id);
        }
        const first = services.find((s) => seen.has(s.slug));
        if (first) setActive(first.slug);
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );
    services.forEach((s) => {
      const el = document.getElementById(s.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [services]);

  return (
    <nav aria-label="Approaches">
      <ol className="divide-y divide-cream-300 border-y border-cream-300">
        {services.map((s, i) => {
          const on = active === s.slug;
          return (
            <li key={s.slug}>
              <a
                href={`#${s.slug}`}
                aria-current={on ? 'true' : undefined}
                className={`group flex min-h-11 items-baseline gap-3 py-3 text-[15px] leading-snug transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  on ? 'text-navy-900' : 'text-ink-600 hover:text-navy-900'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`font-display tabular-nums transition-colors ${
                    on ? 'text-orange-500' : 'text-cream-500 group-hover:text-orange-500'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{s.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

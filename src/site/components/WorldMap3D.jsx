'use client';

import { useEffect, useRef, useState } from 'react';
import WorldMap from './WorldMap';

// Tilted, extruded 3D world map. three.js and the scene code load only when
// the section is within 600px of the viewport. Until the first 3D frame the
// flat WorldMap shows (and it stays if WebGL is unavailable).
export default function WorldMap3D({
  countries = [],
  legendOffices = 'Our offices',
  legendWorked = 'Where we have worked'
}) {
  const stageRef = useRef(null);
  const hostRef = useRef(null);
  const tipRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    let disposed = false;
    let handle = null;
    const load = async () => {
      try {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mod = await import('./worldmap3d-scene');
        if (disposed) return;
        handle = mod.createScene({
          stage,
          host: hostRef.current,
          tooltip: tipRef.current,
          countries,
          reduced,
          onFirstFrame: () => !disposed && setReady(true)
        });
      } catch {
        // No WebGL: the flat map stays.
      }
    };
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        load();
      },
      { rootMargin: '600px' }
    );
    io.observe(stage);
    return () => {
      disposed = true;
      io.disconnect();
      handle?.dispose();
    };
  }, [countries]);

  return (
    <div className="relative -mx-6 sm:-mx-8 lg:mx-0">
      <div ref={stageRef} className="relative w-full aspect-[9/4]">
        <div
          aria-hidden="true"
          className={`absolute inset-0 flex items-center transition-opacity duration-700 ${
            ready ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <WorldMap countries={countries} dark hideLegend />
        </div>
        <div
          ref={hostRef}
          className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          ref={tipRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 whitespace-nowrap rounded bg-cream-50 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-navy-900 opacity-0 transition-opacity duration-150"
        />
      </div>
      <ul className="sr-only">
        {countries.map((c) => (
          <li key={c.id}>{c.office ? `${c.name} (office)` : c.name}</li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 px-6 sm:px-8 lg:px-0 text-xs text-cream-200">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-orange-500" />
          {legendOffices}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-sea-500" />
          {legendWorked}
        </span>
      </div>
    </div>
  );
}

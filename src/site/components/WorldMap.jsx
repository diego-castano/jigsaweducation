'use client';

import { useMemo, useState, useId } from 'react';
import { geoPath, geoNaturalEarth1 } from 'd3-geo';
import { feature } from 'topojson-client';
import topology from 'world-atlas/countries-110m.json';

// Built from world-atlas TopoJSON with d3-geo rather than a tile provider.
// No API key, no runtime request to a third party, no cookie-consent problem —
// which matters for a client whose own policies lead on data protection.
//
// Natural Earth I projection: it keeps land areas honest without Mercator's
// habit of inflating the global north, which would be a poor look on a map of
// work in low and middle-income countries.
const WIDTH = 980;
const HEIGHT = 480;

const projection = geoNaturalEarth1()
  .scale(180)
  .translate([WIDTH / 2, HEIGHT / 2 + 10]);

const toPath = geoPath(projection);

// `countries` rows are { name, id, office } with STRING ids — the numeric
// ISO 3166-1 codes world-atlas keys its features on. A row with a wrong id
// simply never matches a shape, so it silently drops off the map.
export default function WorldMap({
  countries = [],
  legendOffices = 'Our offices',
  legendWorked = 'Where we have worked'
}) {
  const titleId = useId();
  const [hovered, setHovered] = useState(null);

  const { shapes, highlighted } = useMemo(() => {
    const collection = feature(topology, topology.objects.countries);
    const lookup = new Map(countries.map((c) => [c.id, c]));
    return {
      shapes: collection.features.map((f) => ({
        key: f.id ?? f.properties.name,
        d: toPath(f),
        name: f.properties.name,
        match: lookup.get(f.id) || null
      })),
      highlighted: countries
    };
  }, [countries]);

  const activeName = hovered?.match?.name || hovered?.name || null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>
          {`World map highlighting ${highlighted.length} countries where Jigsaw has worked: ${highlighted
            .map((c) => c.name)
            .join(', ')}.`}
        </title>
        <g>
          {shapes.map((s) => {
            const isMatch = Boolean(s.match);
            const isOffice = s.match?.office;
            const isHovered = hovered?.key === s.key;
            return (
              <path
                key={s.key}
                d={s.d}
                fill={
                  isOffice
                    ? '#ff7816'
                    : isMatch
                      ? isHovered
                        ? '#2c5368'
                        : '#407c9b'
                      : '#E8E2D2'
                }
                stroke="#F2EDE0"
                strokeWidth={0.5}
                className={isMatch ? 'cursor-pointer transition-[fill] duration-200' : ''}
                onMouseEnter={isMatch ? () => setHovered(s) : undefined}
                onMouseLeave={isMatch ? () => setHovered(null) : undefined}
                // Not tabbable, deliberately. The svg is role="img", which makes
                // its subtree presentational, and a focusable node inside a
                // labelled image is a contradiction. The hover readout is
                // mouse-only decoration; the full country list already reaches
                // assistive tech through the svg <title>.
              />
            );
          })}
        </g>
      </svg>

      {/* Legend and the hover readout share one rule, so the name appears in a
          fixed place instead of floating over the coastline. */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-cream-300 text-xs text-ink-600">
        <span className="inline-flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />{` ${legendOffices}`}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-sea-500" />{` ${legendWorked}`}
        </span>
        <span
          role="status"
          aria-live="polite"
          className="ml-auto min-h-[18px] font-mono text-[11px] uppercase tracking-[0.14em] text-navy-900"
        >
          {activeName}
        </span>
      </div>
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Icon from '../../../components/Icon';
import Reveal from '../Reveal';
import Placeholder from '../Placeholder';
import FocusTile from './FocusTile';

// Eight areas, eight cells, no filler. Widths change every row (6+6 / 4+4+4 /
// 3+3+6) so the mosaic reads as composed rather than generated, and the two
// reversed tiles plus the orange one break the all-cream field the client
// complained about.
const LAYOUT = [
  { span: 'lg:col-span-6', tone: 'sea', height: 'min-h-[260px] lg:min-h-[340px]', titleClass: 'display-m text-2xl lg:text-[2rem]', ghostSize: 140 },
  { span: 'lg:col-span-6', tone: 'cream', height: 'min-h-[260px] lg:min-h-[340px]', titleClass: 'display-m text-2xl lg:text-[2rem]', ghostSize: 140 },
  { span: 'lg:col-span-4', tone: 'cream', height: 'min-h-[220px] lg:min-h-[250px]', titleClass: 'display-s text-xl lg:text-2xl', ghostSize: 124 },
  { span: 'lg:col-span-4', tone: 'orange', height: 'min-h-[220px] lg:min-h-[250px]', titleClass: 'display-s text-xl lg:text-2xl', ghostSize: 124 },
  { span: 'lg:col-span-4', tone: 'cream', height: 'min-h-[220px] lg:min-h-[250px]', titleClass: 'display-s text-xl lg:text-2xl', ghostSize: 124 },
  { span: 'lg:col-span-3', tone: 'cream', height: 'min-h-[210px] lg:min-h-[230px]', titleClass: 'display-s text-lg lg:text-xl', ghostSize: 110 },
  { span: 'lg:col-span-3', tone: 'cream', height: 'min-h-[210px] lg:min-h-[230px]', titleClass: 'display-s text-lg lg:text-xl', ghostSize: 110 },
  { span: 'lg:col-span-6', tone: 'navy', height: 'min-h-[210px] lg:min-h-[230px]', titleClass: 'display-s text-xl lg:text-2xl', ghostSize: 124 }
];

// Written out rather than interpolated so Tailwind's scanner sees them.
// Tiles take the even slots; the detail band slots in on the odd one directly
// after whichever tile is open, which is what makes the mobile accordion work
// without a second copy of the panel in the DOM.
const TILE_ORDER = [
  'order-0', 'order-2', 'order-4', 'order-6',
  'order-8', 'order-10', 'order-12', 'order-14'
];
const BAND_ORDER = [
  'order-1', 'order-3', 'order-5', 'order-7',
  'order-9', 'order-11', 'order-13', 'order-15'
];

const PANEL_ID = 'technical-focus-detail';
const tileId = (i) => `technical-focus-tile-${i}`;

export default function FocusMosaic({ areas }) {
  // `shown` keeps the last opened area mounted so the collapse animates out
  // with its own content instead of emptying first.
  const [state, setState] = useState({ active: null, shown: 0 });
  const buttons = useRef([]);

  const open = state.active !== null;
  const area = areas[state.shown];

  const toggle = (i) =>
    setState((s) => (s.active === i ? { active: null, shown: i } : { active: i, shown: i }));

  const close = () => {
    setState((s) => ({ active: null, shown: s.shown }));
  };

  const closeAndRefocus = () => {
    const i = state.active;
    close();
    if (i != null) buttons.current[i]?.focus();
  };

  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation();
          closeAndRefocus();
        }
      }}
    >
      {areas.map((item, i) => {
        const cell = LAYOUT[i % LAYOUT.length];
        return (
          <Reveal
            as="h2"
            key={item.slug}
            delay={i * 60}
            className={`flex ${cell.span} ${TILE_ORDER[i % TILE_ORDER.length]}`}
          >
            <FocusTile
              area={item}
              tone={cell.tone}
              height={cell.height}
              titleClass={cell.titleClass}
              ghostSize={cell.ghostSize}
              selected={state.active === i}
              buttonId={tileId(i)}
              panelId={PANEL_ID}
              onToggle={() => toggle(i)}
              buttonRef={(el) => {
                buttons.current[i] = el;
              }}
            />
          </Reveal>
        );
      })}

      <div
        id={PANEL_ID}
        role="region"
        aria-labelledby={tileId(state.shown)}
        aria-hidden={open ? undefined : true}
        inert={open ? undefined : true}
        className={[
          'col-span-full expand-grid',
          open ? 'open' : '',
          open ? BAND_ORDER[state.active % BAND_ORDER.length] : 'order-last',
          'sm:order-last'
        ].join(' ')}
      >
        <div>
          <FocusDetail area={area} onClose={closeAndRefocus} />
        </div>
      </div>
    </div>
  );
}

function FocusDetail({ area, onClose }) {
  const hasCaseStudies = area.caseStudies.length > 0;

  return (
    <div className="relative mt-1 rounded-2xl bg-cream-200 p-6 sm:p-8 lg:p-10">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-cream-300 hover:text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <Icon name="x" size={16} title={`Close ${area.title}`} />
      </button>

      <div className="lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          {/* The custom illustrated spot (media-gen, brand palette, no human
              figures per photo policy). The stroke icon stays as fallback for
              any area whose glyph is missing. */}
          {area.spot ? (
            <img
              src={area.spot}
              alt=""
              width={112}
              height={112}
              loading="lazy"
              decoding="async"
              className="w-24 lg:w-28 rounded-2xl border border-cream-300"
            />
          ) : (
            <Icon name={area.icon} size={72} strokeWidth={1} className="text-sea-600" />
          )}
          <h3 className="mt-5 font-display display-s text-2xl leading-tight text-navy-900">
            {area.title}
          </h3>
          <Placeholder className="mt-4 leading-relaxed text-ink-700">{area.summary}</Placeholder>
        </div>

        <div className="mt-8 border-t border-cream-300 pt-8 lg:col-span-7 lg:col-start-6 lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-700">
            Related case studies
          </p>

          {hasCaseStudies ? (
            <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {area.caseStudies.map((cs) => (
                <li key={cs.slug}>
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="group inline-flex items-start gap-3 rounded-sm text-sea-700 transition-colors hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-200"
                  >
                    <Icon
                      name="arrow-right"
                      size={16}
                      className="mt-1 shrink-0 transition-transform duration-[250ms] ease-out motion-safe:group-hover:translate-x-1.5"
                    />
                    <span className="link-sweep leading-snug">{cs.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm italic text-ink-700">
              No published case studies tagged to this area yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

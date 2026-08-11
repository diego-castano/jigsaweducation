'use client';

import { useEffect, useRef, useState } from 'react';
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
// Tiles take the even slots; the detail band slots into the odd slot right
// AFTER THE ROW of whichever tile is open - click a first-row tile and the
// summary unfolds directly under that row, not at the bottom of the mosaic
// where it lands off-screen. Each breakpoint has its own row shape, so each
// gets its own order map: 1-col (every tile is a row), 2-col pairs from sm,
// and the 6+6 / 4+4+4 / 3+3+6 mosaic from lg.
const TILE_ORDER = [
  'order-0', 'order-2', 'order-4', 'order-6',
  'order-8', 'order-10', 'order-12', 'order-14'
];
const BAND_ORDER_BASE = [
  'order-1', 'order-3', 'order-5', 'order-7',
  'order-9', 'order-11', 'order-13', 'order-15'
];
// sm rows: [0,1] [2,3] [4,5] [6,7] → band follows the row's last tile.
const BAND_ORDER_SM = [
  'sm:order-3', 'sm:order-3', 'sm:order-7', 'sm:order-7',
  'sm:order-11', 'sm:order-11', 'sm:order-15', 'sm:order-15'
];
// lg rows: [0,1] [2,3,4] [5,6,7].
const BAND_ORDER_LG = [
  'lg:order-3', 'lg:order-3', 'lg:order-9', 'lg:order-9',
  'lg:order-9', 'lg:order-15', 'lg:order-15', 'lg:order-15'
];

const PANEL_ID = 'technical-focus-detail';
const tileId = (i) => `technical-focus-tile-${i}`;

export default function FocusMosaic({
  areas,
  relatedCaseStudiesHeading = 'Related case studies',
  relatedCaseStudiesEmpty = 'No published case studies tagged to this area yet.',
  closeTitleTemplate = 'Close {title}'
}) {
  // `shown` keeps the last opened area mounted so the collapse animates out
  // with its own content instead of emptying first.
  const [state, setState] = useState({ active: null, shown: 0 });
  const buttons = useRef([]);

  // Safety net for the tall first-row tiles: once the band has its height,
  // nudge it into view if the fold still cuts it. block:'nearest' is a no-op
  // when it is already visible, so most clicks scroll nothing.
  useEffect(() => {
    if (state.active === null) return;
    const t = setTimeout(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document
        .getElementById(PANEL_ID)
        ?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    }, 540);
    return () => clearTimeout(t);
  }, [state.active]);

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
          open
            ? `${BAND_ORDER_BASE[state.active]} ${BAND_ORDER_SM[state.active]} ${BAND_ORDER_LG[state.active]}`
            : 'order-last'
        ].join(' ')}
      >
        <div>
          <FocusDetail
            area={area}
            onClose={closeAndRefocus}
            relatedCaseStudiesHeading={relatedCaseStudiesHeading}
            relatedCaseStudiesEmpty={relatedCaseStudiesEmpty}
            closeTitleTemplate={closeTitleTemplate}
          />
        </div>
      </div>
    </div>
  );
}

function FocusDetail({
  area,
  onClose,
  relatedCaseStudiesHeading,
  relatedCaseStudiesEmpty,
  closeTitleTemplate
}) {
  const hasCaseStudies = area.caseStudies.length > 0;

  return (
    <div className="relative mt-1 rounded-2xl bg-cream-200 p-6 sm:p-8 lg:p-10">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-cream-300 hover:text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <Icon name="x" size={16} title={closeTitleTemplate.replace('{title}', area.title)} />
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
            {relatedCaseStudiesHeading}
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
              {relatedCaseStudiesEmpty}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useId } from 'react';
import Link from 'next/link';
import Icon from '../../../components/Icon';
import Placeholder from '../Placeholder';
import Reveal from '../Reveal';

// One numbered index row. The whole row is a real <button aria-expanded>
// wrapped in the h2, so the service title stays in the document outline and
// keyboard users get the same affordance as the pointer.
//
// The panel is never `hidden` — .expand-grid animates it from 0fr to 1fr — so
// a closed panel would otherwise keep its links in the tab order. `inert`
// takes the collapsed content out of both the tab order and the accessibility
// tree. No role="region" on the panel: six of them would flood the landmark
// list, which the ARIA authoring practices warn against at this count.
export default function ServiceRow({ service, index, open, onToggle, delay = 0 }) {
  const panelId = useId();
  const buttonId = useId();

  const numeral = String(index + 1).padStart(2, '0');
  const caseStudies = service.caseStudies || [];

  return (
    <Reveal as="li" delay={delay} id={service.slug} className="border-t border-cream-300 scroll-mt-24">
      {/* The open row reads as a surface band between two hairlines, not as a
          card. It sits on this wrapper rather than on the <Reveal> element,
          whose own transition is declared unlayered in globals.css and would
          win the cascade over a Tailwind utility. */}
      <div className={`transition-colors duration-300 ${open ? 'bg-cream-100' : ''}`}>
        <h2>
          <button
            id={buttonId}
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
            style={{ '--sweep': 'var(--color-cream-100)' }}
            className="row-sweep group grid w-full grid-cols-[2.75rem_1fr] items-center gap-x-4 px-4 py-7 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset sm:grid-cols-[5rem_1fr] sm:gap-x-6 sm:px-6 sm:py-9 lg:grid-cols-[6.5rem_1fr]"
          >
            <span
              aria-hidden="true"
              style={{ fontVariationSettings: "'opsz' 72" }}
              className={`font-display text-2xl leading-none tabular-nums transition-colors duration-300 sm:text-4xl lg:text-[3.25rem] ${
                open ? 'text-orange-500' : 'text-cream-400 group-hover:text-orange-500'
              }`}
            >
              {numeral}
            </span>

            <span className="flex min-w-0 items-center justify-between gap-4">
              <span
                style={{ transitionTimingFunction: 'var(--ease-emphasized)' }}
                className="font-display display-s block min-w-0 text-xl leading-[1.15] text-navy-900 transition-transform duration-[350ms] motion-safe:group-hover:translate-x-2.5 sm:text-2xl lg:text-[1.875rem]"
              >
                {service.title}
              </span>
              {/* The affordance was a bare chevron in cream-500 — near
                  invisible, per client feedback. Now a ringed disc that reads
                  as a control at a glance: fills orange when open, darkens on
                  row hover, chevron rotates. */}
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  open
                    ? 'rotate-180 border-orange-300 bg-orange-100 text-orange-700'
                    : 'border-cream-400 bg-cream-50 text-navy-700 group-hover:border-navy-400'
                }`}
                aria-hidden="true"
              >
                <Icon name="chevron-down" size={16} strokeWidth={2} />
              </span>
            </span>
          </button>
        </h2>

        <div id={panelId} className={`expand-grid ${open ? 'open' : ''}`}>
          <div inert={!open}>
            <div className="relative grid grid-cols-[2.75rem_1fr] gap-x-4 px-4 pb-10 sm:grid-cols-[5rem_1fr] sm:gap-x-6 sm:px-6 sm:pb-12 lg:grid-cols-[6.5rem_1fr]">
              {/* Ghost glyph: the service icon at watermark weight, anchored to
                  the bottom-right corner and bleeding past it on purpose — the
                  .expand-grid child's overflow-hidden does the cropping. Sized
                  and placed so it never sits under the first line of copy. */}
              <span
                className="pointer-events-none absolute -bottom-10 -right-6 hidden text-sea-200/70 sm:block"
                aria-hidden="true"
              >
                <Icon name={service.icon} size={170} strokeWidth={0.75} />
              </span>

              <span aria-hidden="true" />

              <div className="relative">
                <Placeholder className="max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
                  {service.summary}
                </Placeholder>

                {caseStudies.length > 0 ? (
                  <div className="mt-8 border-t border-cream-300 pt-6">
                    <p className="mb-2 text-[13px] text-ink-500">Related case studies</p>
                    <ul className="grid gap-x-10 sm:grid-cols-2">
                      {caseStudies.map((cs) => (
                        <li key={cs.slug}>
                          <Link
                            href={`/case-studies/${cs.slug}`}
                            className="group/cs flex items-start gap-3 py-2 text-sea-700 transition-colors hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                          >
                            <Icon
                              name="arrow-right"
                              size={16}
                              className="mt-1 shrink-0 transition-transform duration-[250ms] ease-out motion-safe:group-hover/cs:translate-x-1.5"
                            />
                            <span className="link-sweep inline-block text-[15px] leading-snug">
                              {cs.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="mt-8 border-t border-cream-300 pt-6 text-sm italic text-ink-500">
                    No published case studies tagged to this area yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

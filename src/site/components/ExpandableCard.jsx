'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import Icon from '../../components/Icon';
import Placeholder from './Placeholder';

// The brief asks for "a dropdown/popout from each service which links to
// relevant case studies". Expanding in place rather than navigating keeps the
// page short, which the client asked for twice - they marked r4d.org and
// fab-ai.org down for "pages too long".
//
// It is a real <button> driving aria-expanded on a real region, not a div with
// a click handler, so keyboard and screen reader users get the same affordance.
export default function ExpandableCard({ item, caseStudies = [], index }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonId = useId();

  const hasCaseStudies = caseStudies.length > 0;

  return (
    <li className="bg-cream-50 border border-cream-300 rounded-2xl overflow-hidden transition-shadow hover:shadow-sm">
      {/* h2: each service is a top-level section of its page. */}
      <h2>
        <button
          id={buttonId}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="w-full text-left flex items-start gap-4 p-6 sm:p-7 group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
        >
          <span className="w-11 h-11 rounded-xl bg-sea-100 text-sea-600 group-hover:bg-orange-100 group-hover:text-orange-600 flex items-center justify-center shrink-0 transition-colors">
            <Icon name={item.icon} size={20} />
          </span>

          <span className="flex-1 min-w-0">
            <span className="font-display text-xl sm:text-2xl text-navy-900 block leading-snug">
              {item.title}
            </span>
            {index != null && (
              <span className="font-mono text-[11px] text-ink-500 mt-1 block">
                {String(index + 1).padStart(2, '0')}
              </span>
            )}
          </span>

          <span
            className={`w-8 h-8 rounded-full border border-cream-400 flex items-center justify-center shrink-0 text-navy-700 transition-transform duration-300 ${
              open ? 'rotate-180 bg-cream-200' : ''
            }`}
            aria-hidden="true"
          >
            <Icon name="chevron-down" size={16} />
          </span>
        </button>
      </h2>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="px-6 sm:px-7 pb-7 pl-6 sm:pl-[76px]"
      >
        <Placeholder className="text-ink-700 leading-relaxed">{item.summary}</Placeholder>

        {hasCaseStudies ? (
          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-3">
              Related case studies
            </p>
            <ul className="space-y-2">
              {caseStudies.map((cs) => (
                <li key={cs.slug}>
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="group inline-flex items-start gap-2 text-sm text-sea-700 hover:text-orange-600 transition-colors"
                  >
                    <Icon
                      name="arrow-right"
                      size={15}
                      className="mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform"
                    />
                    <span className="underline underline-offset-4 decoration-cream-400 group-hover:decoration-orange-400">
                      {cs.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-6 text-sm text-ink-500 italic">
            No published case studies tagged to this area yet.
          </p>
        )}
      </div>
    </li>
  );
}

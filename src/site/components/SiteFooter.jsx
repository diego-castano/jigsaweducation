import Link from 'next/link';
import SiteLogo from './SiteLogo';
import MailingListForm from './MailingListForm';
import { MAIN_NAV, FOOTER_NAV, OFFICES, LEGAL, SITE } from '../../data/site';

// The footer is the close of the site, not an afterthought: three bands on
// navy-900, hairline-divided.
//   1. Logo + LinkedIn beside the mailing-list capture (the client's
//      Mailchimp ask — MailingListForm handles validation and stubs the
//      submit itself, this component just places it).
//   2. Explore / More navigation beside the two offices, shown side by side
//      with no hierarchy between them per the client's brief.
//   3. The legal line, copyright and a quiet "back to top" link.
// No dropdowns anywhere in the header means this is the only way onward (or
// back) from the bottom of a long page.
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-cream-50 mt-24">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10">
        <div className="py-14 lg:py-16 grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            {/* SiteLogo is inline-flex, so it needs a block wrapper or the
                LinkedIn link below rides up onto the same line. */}
            <div>
              <SiteLogo size={44} reversed />
            </div>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 mt-8 text-sm font-bold text-cream-50 hover:text-orange-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-full"
            >
              <span className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center shrink-0">
                <span className="font-bold text-xs">in</span>
              </span>
              <span className="link-sweep">LinkedIn</span>
            </a>
          </div>

          <div className="lg:col-span-7">
            <h2 className="font-display text-xl text-cream-50 mb-1.5">
              Occasional updates about our work
            </h2>
            <p className="text-sm text-cream-300 mb-5 max-w-md">
              New case studies and publications, a few times a year. Nothing more frequent than that.
            </p>
            <div className="max-w-md">
              <MailingListForm reversed />
            </div>
          </div>
        </div>

        <div className="border-t border-navy-800 py-12 lg:py-14 grid gap-10 lg:grid-cols-12">
          <nav aria-label="Footer" className="lg:col-span-3">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-cream-400 font-bold mb-4">
              Explore
            </h2>
            <ul className="space-y-2.5 text-sm">
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-sweep text-cream-200 hover:text-orange-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal and careers" className="lg:col-span-3">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-cream-400 font-bold mb-4">
              More
            </h2>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-sweep text-cream-200 hover:text-orange-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-6">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-cream-400 font-bold mb-4">
              Our offices
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {OFFICES.map((office, i) => (
                <address
                  key={office.id}
                  className={`not-italic text-sm text-cream-200 leading-relaxed ${
                    i === 1
                      ? 'border-t border-navy-800 pt-6 sm:border-t-0 sm:pt-0 sm:border-l sm:border-navy-800 sm:pl-6'
                      : ''
                  }`}
                >
                  <p className="font-bold text-cream-50 mb-1.5">{office.org}</p>
                  <p>
                    {office.city}, {office.country}
                  </p>
                  <a
                    href={`mailto:${office.email}`}
                    className="link-sweep inline-block mt-1.5 text-cream-200 hover:text-orange-400 transition-colors"
                  >
                    {office.email}
                  </a>
                </address>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-navy-800 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <p className="text-xs text-cream-400 leading-relaxed max-w-3xl">{LEGAL.line}</p>
          <div className="flex items-center gap-6 shrink-0">
            <p className="text-xs text-cream-400">© {year}</p>
            <a href="#main" className="link-sweep text-xs text-cream-300 hover:text-orange-400 transition-colors">
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

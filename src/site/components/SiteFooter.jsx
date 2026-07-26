import Link from 'next/link';
import SiteLogo from './SiteLogo';
import FooterSignup from './FooterSignup';
import { MAIN_NAV, FOOTER_NAV, OFFICES, LEGAL, SITE } from '../../data/site';

// The footer is the close of the site, not an afterthought: three bands on
// navy-900, hairline-divided.
//   1. Logo + LinkedIn beside the mailing-list capture (the client's
//      Mailchimp ask — MailingListForm handles validation and stubs the
//      submit itself, this component just places it).
//   2. A content map: four columns on one grid, every seam a hairline, every
//      column starting on the same line. Explore runs two deep so seven links
//      stop dragging that column twice the height of its neighbours, which is
//      what knocked the band out of alignment.
//   3. The legal line, copyright and a quiet "back to top" link.
// No dropdowns anywhere in the header means this is the only way onward (or
// back) from the bottom of a long page.

// One label style for all four columns. Identical size, tracking and margin is
// the whole trick: the columns only share a start line if their headings do.
const LABEL = 'font-body text-[10px] uppercase tracking-[0.2em] text-cream-400 font-bold mb-4';

// Columns two, three and four. Stacked on small screens the seam is a rule
// above; from lg it turns and becomes the vertical hairline between columns.
const SEAM =
  'mt-9 pt-9 border-t border-navy-800 lg:mt-0 lg:pt-0 lg:border-t-0 lg:border-l lg:border-navy-800 lg:pl-8';

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
            {/* The one line of voice in the footer. It is the client's own
                tagline, so it says something rather than decorating. */}
            <p className="mt-6 max-w-[30ch] font-display text-lg text-cream-200 italic">
              {SITE.tagline}
            </p>
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

          {/* Route-aware: stands down on /contact, where the page carries its
              own signup band with the client's verbatim copy. */}
          <FooterSignup />
        </div>

        {/* Four columns, one grid. Cells stretch so every hairline runs the
            full height of the band; the content still starts at the top of
            each cell, which is the alignment the band was missing. */}
        <div className="border-t border-navy-800 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
          <nav aria-label="Footer" className="lg:col-span-4">
            <h2 className={LABEL}>Explore</h2>
            {/* Seven links in one column ran twice the height of everything
                beside it. Two CSS columns flow them 4 + 3 and the band levels
                out. `columns` keeps reading order down then across, which a
                two-track grid would not. */}
            <ul className="text-sm lg:columns-2 lg:gap-x-6">
              {MAIN_NAV.map((item) => (
                <li key={item.href} className="mb-2.5 break-inside-avoid last:mb-0">
                  <Link
                    href={item.href}
                    className="link-sweep text-cream-200 hover:text-orange-400 transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal and careers" className={`lg:col-span-2 ${SEAM}`}>
            <h2 className={LABEL}>More</h2>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-sweep text-cream-200 hover:text-orange-400 transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Each office is its own column rather than a pair squeezed into
              one, so all four labels sit on the same line. The city carries
              the label because it is what a reader scans for; <address> takes
              flow content but not headings, so the h2 stays outside it. */}
          {OFFICES.map((office) => (
            <div key={office.id} className={`lg:col-span-3 ${SEAM}`}>
              <h2 className={LABEL}>{office.city}</h2>
              <address className="not-italic">
                <span className="block font-display text-lg leading-snug text-cream-50">
                  {office.org}
                </span>
                <span className="block mt-1.5 font-mono text-[11px] tracking-[0.06em] text-cream-300">
                  {office.country}
                </span>
                <a
                  href={`mailto:${office.email}`}
                  className="link-sweep inline-block mt-3 text-sm text-cream-200 hover:text-orange-400 transition-colors rounded-sm [overflow-wrap:anywhere] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  {office.email}
                </a>
              </address>
            </div>
          ))}
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

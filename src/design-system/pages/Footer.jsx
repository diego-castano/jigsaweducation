import PageHeader from '../../components/PageHeader';
import LogoMark from '../../components/LogoMark';

// v2 recipe, matching src/site/components/SiteFooter.jsx. Site Modules 06
// feedback removed the four-column layout with a company blurb and replaced
// it with three hairline-divided bands, mailing-list capture promoted to a
// primary position rather than a fourth column competing with navigation:
//   Band 1: logo + LinkedIn beside the mailing-list heading and form (the
//     client's Mailchimp ask; the real form validates and stubs submission
//     until an audience ID is wired in).
//   Band 2: Explore / More navigation shown side by side with the two
//     offices, no hierarchy between them per the client's brief.
//   Band 3: the legal line, copyright and a quiet "back to top" link.
// The blurb paragraph is gone; nothing in this footer is describing the
// company, only helping someone move on or sign up. The legal line has also
// moved off mono: it is a sentence for a reader, not a data field, so it now
// sets in Lato like the rest of the footer's body copy.
export default function Footer() {
  return (
    <div>
      <PageHeader
        kicker="Site Modules · 06"
        title="Footer"
        lede="Three bands on navy-900, hairline-divided: mailing-list capture beside the logo, navigation beside the two offices, then the legal line. No company blurb, no fourth competing column."
      />
      <div className="bg-navy-900 rounded-2xl overflow-hidden text-cream-50">
        <div className="px-8 py-12 lg:px-12 lg:py-16 grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <LogoMark size={40} />
              <div>
                <div className="font-display text-xl">Jigsaw</div>
                <div className="text-xs uppercase tracking-[0.18em] text-cream-300">Education Evidence</div>
              </div>
            </div>
            <a className="inline-flex items-center gap-2.5 text-sm font-bold text-cream-50">
              <span className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center">
                <span className="font-bold text-xs">in</span>
              </span>
              LinkedIn
            </a>
          </div>
          <div className="lg:col-span-7">
            <h3 className="font-display text-xl text-cream-50 mb-1.5">Occasional updates about our work</h3>
            <p className="text-sm text-cream-300 mb-5 max-w-md">New case studies and publications, a few times a year. Nothing more frequent than that.</p>
            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-w-0 px-4 py-3 bg-navy-800 border border-navy-700 rounded-full text-sm text-cream-50 placeholder:text-cream-400 focus:outline-none focus:border-orange-400"
              />
              <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold transition-colors shrink-0">
                Sign up
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-800 px-8 py-12 lg:px-12 lg:py-14 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-cream-400 font-bold mb-4">Explore</div>
            <ul className="space-y-2.5 text-sm">
              {['Services', 'Technical focus', 'Distinctives', 'Team'].map((l) => (
                <li key={l}><a className="text-cream-200 hover:text-orange-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-cream-400 font-bold mb-4">More</div>
            <ul className="space-y-2.5 text-sm">
              {['Case studies', 'Publications', 'Contact'].map((l) => (
                <li key={l}><a className="text-cream-200 hover:text-orange-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-cream-400 font-bold mb-4">Our offices</div>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { org: 'Jigsaw Education Evidence Ltd', city: 'London', country: 'United Kingdom' },
                { org: 'Jigsaw Zambia', city: 'Lusaka', country: 'Zambia' }
              ].map((office, i) => (
                <address
                  key={office.org}
                  className={`not-italic text-sm text-cream-200 leading-relaxed ${
                    i === 1 ? 'border-t border-navy-800 pt-6 sm:border-t-0 sm:pt-0 sm:border-l sm:border-navy-800 sm:pl-6' : ''
                  }`}
                >
                  <p className="font-bold text-cream-50 mb-1.5">{office.org}</p>
                  <p>{office.city}, {office.country}</p>
                </address>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-navy-800 px-8 py-6 lg:px-12 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <p className="text-xs text-cream-400 leading-relaxed max-w-3xl">
            Jigsaw Education Evidence Ltd is registered in England and Wales, company number 06844615. VAT registration GB173850004.
          </p>
          <div className="flex items-center gap-6 shrink-0">
            <p className="text-xs text-cream-400">© 2026</p>
            <a className="text-xs text-cream-300 hover:text-orange-400 transition-colors">Back to top</a>
          </div>
        </div>
      </div>
      <p className="text-sm text-ink-600 mt-6 max-w-2xl">
        The legal line sets in Lato now, not JetBrains Mono. It is a sentence written for a reader, the same way the rest of the footer reads, rather than a data field that happens to sit at the bottom of the page.
      </p>
    </div>
  );
}

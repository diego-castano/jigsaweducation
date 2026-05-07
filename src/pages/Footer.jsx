import PageHeader from '../components/PageHeader';
import LogoMark from '../components/LogoMark';

export default function Footer() {
  return (
    <div>
      <PageHeader
        kicker="Site Modules · 06"
        title="Footer"
        lede="A four-column footer with the mailing list signup as the primary CTA. Includes the registered company information required for UK and Zambian entities."
      />
      <div className="bg-navy-900 rounded-2xl overflow-hidden text-cream-50">
        <div className="px-8 py-12 lg:px-12 lg:py-16">
          <div className="grid lg:grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-10">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <LogoMark size={40} />
                <div>
                  <div className="font-display text-xl">Jigsaw</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-cream-300">Education Evidence</div>
                </div>
              </div>
              <p className="text-sm text-cream-300 leading-relaxed mb-5 max-w-xs">A social enterprise producing rigorous evidence in education across low and middle-income contexts.</p>
              <a className="inline-flex items-center gap-2 text-sm font-bold text-cream-50 hover:text-orange-400 transition-colors">
                <span className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center">
                  <span className="font-bold text-xs">in</span>
                </span>
                LinkedIn
              </a>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-cream-400 font-bold mb-4">Work</div>
              <ul className="space-y-2.5 text-sm">
                {['Evidence Library', 'Case Studies', 'Services', 'How we work'].map(l => (
                  <li key={l}>
                    <a className="text-cream-200 hover:text-orange-400 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-cream-400 font-bold mb-4">About</div>
              <ul className="space-y-2.5 text-sm">
                {['The team', 'Our values', 'Zambia office', 'Contact', 'FAQ'].map(l => (
                  <li key={l}>
                    <a className="text-cream-200 hover:text-orange-400 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-cream-400 font-bold mb-4">Stay informed</div>
              <p className="text-sm text-cream-300 mb-3">Updates on our latest research. No spam, ever.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2.5 bg-navy-800 border border-navy-700 rounded-full text-sm text-cream-50 placeholder:text-cream-400 focus:outline-none focus:border-orange-400"
                />
                <button className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold transition-colors">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-navy-800 px-8 py-5 lg:px-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-[11px] text-cream-400 font-mono">
          <div>© 2026 Jigsaw Education Evidence Ltd · Company No. 06844615 · VAT GB173850004</div>
          <div className="flex flex-wrap gap-5">
            <a className="hover:text-orange-400">Privacy</a>
            <a className="hover:text-orange-400">Cookies</a>
            <a className="hover:text-orange-400">Accessibility</a>
          </div>
        </div>
      </div>
    </div>
  );
}

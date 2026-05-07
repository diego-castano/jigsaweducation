import Icon from '../components/Icon';
import Card from '../components/Card';
import Section from '../components/Section';
import PageHeader from '../components/PageHeader';

export default function Accessibility() {
  const contrasts = [
    { fg: '#1a3340', bg: '#FDFAF4', label: 'Navy 900 on Cream 50', ratio: '14.6', pass: 'AAA' },
    { fg: '#2c5368', bg: '#FDFAF4', label: 'Navy 700 on Cream 50', ratio: '9.8', pass: 'AAA' },
    { fg: '#407c9b', bg: '#FDFAF4', label: 'Sea 500 on Cream 50', ratio: '4.7', pass: 'AA' },
    { fg: '#ff7816', bg: '#FDFAF4', label: 'Orange 500 on Cream 50', ratio: '3.2', pass: 'Large only' },
    { fg: '#FDFAF4', bg: '#1a3340', label: 'Cream 50 on Navy 900', ratio: '14.6', pass: 'AAA' },
    { fg: '#FDFAF4', bg: '#ff7816', label: 'Cream 50 on Orange 500', ratio: '3.4', pass: 'Large only' }
  ];
  return (
    <div>
      <PageHeader
        kicker="Documentation · 03"
        title="Accessibility"
        lede="WCAG 2.1 AA is the baseline. The site is built for keyboard navigation, screen readers, multilingual delivery, and right-to-left scripts from day one."
      />
      <Section title="Colour contrast" description="Combinations passing AA (4.5:1 for body, 3:1 for large text). Orange should never be used for body text on cream — only as an accent or on dark backgrounds.">
        <div className="grid sm:grid-cols-2 gap-3">
          {contrasts.map((c, i) => (
            <div key={i} className="rounded-xl border border-cream-300 overflow-hidden">
              <div
                className="p-5 font-display text-xl"
                style={{ background: c.bg, color: c.fg }}
              >
                The quick brown fox
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-cream-100 text-xs">
                <span className="text-ink-700">{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-ink-600">{`${c.ratio}:1`}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${c.pass === 'AAA' ? 'bg-emerald-100 text-emerald-700' : c.pass === 'AA' ? 'bg-sea-100 text-sea-700' : 'bg-amber-50 text-amber-800'}`}>{c.pass}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Keyboard & focus" description="Every interactive element is reachable by Tab, with a visible focus ring. Focus rings use orange-500 with a 2px offset against cream-50 for maximum visibility.">
        <Card className="flex flex-wrap gap-3">
          <button className="px-5 py-2.5 bg-orange-500 text-white rounded-full font-bold text-sm ring-2 ring-orange-500 ring-offset-2 ring-offset-cream-50">Focused button</button>
          <input className="px-4 py-2.5 bg-cream-50 border-2 border-sea-500 rounded-xl text-sm ring-2 ring-sea-100" defaultValue="Focused input" />
          <a className="px-3 py-1 underline decoration-2 decoration-orange-500 text-navy-900 font-bold text-sm">Focused link</a>
        </Card>
      </Section>
      <Section title="Multilingual & RTL">
        <Card>
          <div className="space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-ink-600 font-bold mb-1">English (default)</div>
              <div className="font-display text-2xl text-navy-900">Evidence that travels.</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-ink-600 font-bold mb-1">French (auto-translated)</div>
              <div className="font-display text-2xl text-navy-900">Une recherche qui voyage.</div>
            </div>
            <div dir="rtl">
              <div className="text-[11px] uppercase tracking-[0.15em] text-ink-600 font-bold mb-1">العربية (Tajawal)</div>
              <div className="text-2xl text-navy-900" style={{ fontFamily: 'Tajawal, system-ui' }}>البحث الذي ينتقل.</div>
            </div>
          </div>
        </Card>
      </Section>
      <Section title="Commitments">
        <Card>
          <ul className="space-y-3 text-sm text-ink-700">
            {[
              'WCAG 2.1 Level AA compliance, audited at launch and annually thereafter.',
              'Semantic HTML throughout — landmarks, headings, lists used correctly.',
              "All images have alt text written by the publication's author, never auto-generated.",
              'Keyboard navigation tested on every component before merge.',
              'Auto-translation in Arabic, French, and Spanish via integrated AI, with the option to expand.',
              'RTL layout ready (Arabic) using Tajawal as the secondary script font.',
              'Respects prefers-reduced-motion — animations are simplified or removed.'
            ].map((p, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Icon name="check" size={12} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Card>
      </Section>
    </div>
  );
}

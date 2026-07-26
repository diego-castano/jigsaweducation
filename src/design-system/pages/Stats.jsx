import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';

export default function Stats() {
  return (
    <div>
      <PageHeader
        kicker="Site Modules · 04"
        title="Stats"
        lede="Numbers tell a story donors and partners read first. Three formats: cream, navy, photo."
      />
      <Section title="Cream stats" description="For mid-page impact sections. Light, readable, low-pressure.">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { num: '60+', label: 'Organisations' },
            { num: '30+', label: 'Countries' },
            { num: '11,708', label: 'Research participants' },
            { num: '10y', label: 'Years of practice' }
          ].map((s, i) => (
            <div key={i} className="bg-cream-100 border border-cream-300 rounded-2xl p-6 text-center">
              <div className="font-display text-5xl text-navy-900 mb-2 leading-none" style={{ fontVariationSettings: "'opsz' 72" }}>{s.num}</div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-ink-600 font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Navy hero stats" description="For homepage and impact pages. Confident, weighted, with the orange accent.">
        <div className="bg-navy-900 rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '60+', label: 'Organisations' },
              { num: '30+', label: 'Countries' },
              { num: '11,708', label: 'Participants' },
              { num: '10y', label: 'Years' }
            ].map((s, i) => (
              <div key={i}>
                <div className="h-1 w-8 bg-orange-500 mb-4 rounded" />
                <div className="font-display text-5xl lg:text-6xl text-cream-50 mb-2 leading-none" style={{ fontVariationSettings: "'opsz' 72" }}>{s.num}</div>
                <div className="text-xs uppercase tracking-[0.15em] text-cream-400 font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section title="Single statement stat" description="For a featured number on a hero or section header. Maximum drama, minimum elements.">
        <div className="bg-cream-100 border border-cream-300 rounded-2xl p-12 text-center">
          <div className="font-display text-[clamp(80px,20vw,200px)] leading-[0.85] text-navy-900" style={{ fontVariationSettings: "'opsz' 72, 'wght' 400" }}>11,708</div>
          <div className="text-base text-ink-700 max-w-md mx-auto mt-4">research participants engaged across a decade of practice</div>
        </div>
      </Section>
    </div>
  );
}

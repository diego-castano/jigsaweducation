import Icon from '../components/Icon';
import Card from '../components/Card';
import Section from '../components/Section';
import PageHeader from '../components/PageHeader';

export default function CardsPage() {
  return (
    <div>
      <PageHeader
        kicker="Components · 03"
        title="Cards"
        lede="Containers for content. Cream backgrounds, soft borders, generous internal padding."
      />
      <Section title="Basic card">
        <div className="grid lg:grid-cols-3 gap-4">
          <Card>
            <h3 className="text-xl mb-2 text-navy-900">Calm by default</h3>
            <p className="text-sm text-ink-700 leading-relaxed">A cream-100 surface with cream-300 border. The resting state of every container in the system.</p>
          </Card>
          <Card className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
            <h3 className="text-xl mb-2 text-navy-900">Elevated on hover</h3>
            <p className="text-sm text-ink-700 leading-relaxed">Interactive cards lift gently. shadow-md to shadow-lg, with a 2px Y translation.</p>
          </Card>
          <Card className="bg-navy-900 border-navy-900 text-cream-50">
            <h3 className="text-xl mb-2 text-cream-50">Inverted</h3>
            <p className="text-sm text-cream-300 leading-relaxed">For emphasis sections. Use sparingly — once per page maximum.</p>
          </Card>
        </div>
      </Section>
      <Section title="Stat card" description={'Large display number, small label below. The pattern that powers every "Impact" section.'}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { num: '60+', label: 'Organisations served' },
            { num: '30+', label: 'Countries' },
            { num: '11k', label: 'Research participants' },
            { num: '10y', label: 'Years of practice' }
          ].map((s, i) => (
            <Card key={i} className="text-center hover:shadow-md transition-shadow">
              <div className="font-display text-5xl text-navy-900 mb-2 leading-none" style={{ fontVariationSettings: "'opsz' 96" }}>{s.num}</div>
              <div className="text-xs uppercase tracking-[0.15em] text-ink-600 font-bold">{s.label}</div>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Action card" description={'For pages like "How We Work" or "Services" — informational with a clear next step.'}>
        <div className="grid lg:grid-cols-2 gap-4">
          {[
            { icon: 'flask', title: 'Research & Evaluation', desc: 'Mixed-methods studies in education, with a focus on participatory and locally-led approaches.' },
            { icon: 'lightbulb', title: 'Strategy & Advisory', desc: 'Helping organisations turn evidence into clearer decisions and stronger programmes.' }
          ].map((c, i) => (
            <Card key={i} className="group hover:bg-cream-200 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-sea-100 group-hover:bg-orange-100 flex items-center justify-center mb-4 text-sea-600 group-hover:text-orange-500 transition-colors">
                <Icon name={c.icon} size={22} />
              </div>
              <h3 className="text-2xl mb-2 text-navy-900">{c.title}</h3>
              <p className="text-sm text-ink-700 leading-relaxed mb-4">{c.desc}</p>
              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-500 group-hover:gap-2 transition-all">
                Learn more
                <Icon name="arrow-right" size={14} />
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

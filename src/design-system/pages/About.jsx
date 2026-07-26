import Icon from '../../components/Icon';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';

export default function About() {
  return (
    <div>
      <PageHeader
        kicker="Site Templates · 03"
        title="About page"
        lede="The full About layout — mission statement hero, story timeline, locations, values, and a team teaser feeding into the Team page."
      />
      <div className="bg-cream-100 border border-cream-300 rounded-3xl p-8 lg:p-14 mb-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-4">About Jigsaw</div>
        <h2 className="font-display text-3xl lg:text-5xl text-navy-900 leading-[1.05] max-w-3xl mb-6" style={{ fontVariationSettings: "'opsz' 72" }}>
          We produce evidence that helps decisions about education travel further, faster.
        </h2>
        <p className="text-lg text-ink-700 max-w-2xl leading-relaxed">
          Jigsaw is a social enterprise founded in 2014. We work with governments, INGOs and donors across low and middle-income contexts — running rigorous, locally-grounded studies and turning them into the kinds of products that actually get read.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {[
          { city: 'London', country: 'United Kingdom', role: 'Operational HQ', team: '6 people', icon: 'globe' },
          { city: 'Lusaka', country: 'Zambia', role: 'Research office, founded 2024', team: '3 people', icon: 'map-pin' }
        ].map((l, i) => (
          <div key={i} className="bg-cream-100 border border-cream-300 rounded-2xl p-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sea-100 text-sea-700 flex items-center justify-center">
                <Icon name={l.icon} size={18} />
              </div>
              <div>
                <div className="font-display text-2xl text-navy-900 leading-none">{l.city}</div>
                <div className="text-xs text-ink-600 mt-1">{l.country}</div>
              </div>
            </div>
            <div className="text-sm text-ink-700">
              {l.role}
              {' · '}
              <span className="font-mono text-ink-500">{l.team}</span>
            </div>
          </div>
        ))}
      </div>
      <Section title="Our story" description="A decade of practice, told as the milestones that mattered.">
        <div className="relative pl-7 border-l-2 border-cream-300">
          {[
            { yr: '2014', t: 'Founded', d: 'David Hollow founds Jigsaw to bridge research and practice in education.' },
            { yr: '2017', t: 'First multi-country study', d: 'A study of EdTech effectiveness across four East African countries.' },
            { yr: '2020', t: 'Pandemic pivot', d: 'Re-tooled methods for remote field research as schools closed worldwide.' },
            { yr: '2023', t: 'Year in Review series', d: "Launched the annual editorial product synthesising the year's findings." },
            { yr: '2024', t: 'Lusaka office', d: 'Opened our first in-region office, deepening local partnerships.' },
            { yr: '2026', t: 'Brand evolution', d: "A new design system and identity, reflecting the work's scale and care." }
          ].map((m, i) => (
            <div key={i} className="relative mb-8 last:mb-0">
              <div className="absolute -left-[34px] top-1 w-4 h-4 rounded-full bg-orange-500 border-4 border-cream-50" />
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-orange-500 font-bold mb-1">{m.yr}</div>
              <div className="font-display text-xl text-navy-900 mb-1">{m.t}</div>
              <div className="text-sm text-ink-700 leading-relaxed">{m.d}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="What we value" description="Four commitments that shape how we work.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { ic: 'flask', t: 'Rigour', d: 'Methods chosen for the question, not the brand.' },
            { ic: 'users', t: 'Partnership', d: 'Locally-led where it matters most.' },
            { ic: 'message', t: 'Plain speaking', d: 'Translate evidence so it travels.' },
            { ic: 'shield', t: 'Care', d: 'Dignity for everyone in our research.' }
          ].map((v, i) => (
            <div key={i} className="bg-cream-100 border border-cream-300 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-4">
                <Icon name={v.ic} size={18} />
              </div>
              <div className="font-display text-xl text-navy-900 mb-1">{v.t}</div>
              <div className="text-sm text-ink-700">{v.d}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

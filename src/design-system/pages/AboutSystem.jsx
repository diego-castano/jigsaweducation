import Icon from '../../components/Icon';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';

export default function AboutSystem() {
  return (
    <div>
      <PageHeader
        kicker="System · 01"
        title="About this system"
        lede={"How this design system was built, who it's for, and how to use it across teams."}
      />
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {[
          { ic: 'palette', t: 'Tokens first', d: 'Every visual decision is a token. Change the cream-100 variable and the whole system follows.' },
          { ic: 'square', t: 'Components composed', d: 'No bespoke widgets. Buttons, cards, badges, fields are the only atoms.' },
          { ic: 'shield', t: 'Accessible baseline', d: 'WCAG 2.1 AA on every component. Focus rings, semantic markup, motion preferences.' }
        ].map((c, i) => (
          <div key={i} className="bg-cream-100 border border-cream-300 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-4">
              <Icon name={c.ic} size={18} />
            </div>
            <div className="font-display text-xl text-navy-900 mb-1">{c.t}</div>
            <div className="text-sm text-ink-700">{c.d}</div>
          </div>
        ))}
      </div>
      <Section title="Stack" description={"A pragmatic build. The reference page you're reading is one HTML file; the production site uses the same tokens through Vite + React + Tailwind v4."}>
        <div className="bg-cream-100 border border-cream-300 rounded-2xl p-6">
          <div className="space-y-3">
            {[
              ['Production stack', 'Vite · React 18 · Tailwind v4 · Framer Motion · Lucide React'],
              ['Design tokens', '— delivered as CSS custom properties in app.css'],
              ['Type', 'Fraunces (variable, opsz/wght/SOFT/WONK) · Lato · JetBrains Mono'],
              ['Hosting', 'Static build, GitHub Pages compatible'],
              ['Source of truth', 'This document · v1.0']
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-2 border-b border-cream-300 last:border-0">
                <div className="sm:w-44 text-[12px] uppercase tracking-[0.15em] text-ink-600 font-bold">{k}</div>
                <div className="flex-1 text-sm text-ink-800 font-mono">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section title="Roles & contribution">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { t: 'Designers', d: 'Use Foundations + Components as the source. Custom variants require token review.' },
            { t: 'Developers', d: "Compose pages from Modules + Templates. Don't hand-roll one-offs." },
            { t: 'Editors / writers', d: 'Voice & Tone is binding. When in doubt, plain English wins.' }
          ].map((r, i) => (
            <div key={i} className="bg-cream-100 border border-cream-300 rounded-2xl p-5">
              <div className="font-display text-lg text-navy-900 mb-1">{r.t}</div>
              <div className="text-sm text-ink-700 leading-relaxed">{r.d}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Credits">
        <div className="bg-navy-900 text-cream-50 rounded-2xl p-8">
          <div className="text-xs uppercase tracking-[0.2em] text-orange-400 font-bold mb-4">Prepared for Jigsaw Education Evidence</div>
          <p className="text-cream-100 leading-relaxed mb-3 max-w-2xl">
            Design system v1.0, March 2026. Brand evolution led with the existing Jigsaw team, building forward from the original 2014 brand guidelines while reflecting a decade of practice.
          </p>
          <div className="text-sm font-mono text-cream-300 mt-5">Design & build · Diego Castaño</div>
        </div>
      </Section>
    </div>
  );
}

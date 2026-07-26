import PageHeader from '../../components/PageHeader';

export default function Principles() {
  const principles = [
    { num: '01', title: 'Evidence over decoration', body: "Every visual element earns its place by communicating something specific. We don't add ornament for its own sake. The visual system is calm because the work it represents is precise — and the design should never compete with the substance.", practice: 'Before adding a graphic flourish, ask: does this clarify, or does it distract?' },
    { num: '02', title: 'Dignity in storytelling', body: "How we represent people matters. Photography, language, and case study framing reflect respect for the communities we work with. We never reduce people to victims, problems, or statistics — and we don't use stock photography of people we have no relationship with.", practice: 'Photos come from our own work, with consent. Numbers come with context. Names come with permission.' },
    { num: '03', title: 'Clarity for stakeholders', body: 'Our audience — donors, governments, partners, researchers — needs to find what they need fast. The site is structured so any major page is two clicks from anywhere. No mega-menus, no dropdowns, no labyrinths. Information architecture is part of the design.', practice: 'If a user has to think about how to navigate, the system has failed them.' },
    { num: '04', title: 'Calm credibility', body: "We don't shout. The brand earns trust through restraint — generous whitespace, considered typography, subtle motion, careful colour use. We are an evidence organisation, not a campaign. Visual quietness signals intellectual confidence.", practice: 'When in doubt, take something away rather than add something more.' },
    { num: '05', title: 'Accessible by default', body: 'Accessibility is a baseline, not a feature. WCAG AA compliance is the floor. The site supports keyboard navigation, screen readers, and right-to-left languages. Multilingual delivery via auto-translation reflects the contexts we work in.', practice: 'Test with real assistive tech, not just colour-contrast tools.' }
  ];
  return (
    <div>
      <PageHeader
        kicker="Documentation · 01"
        title="Design principles"
        lede="Five principles that guide every design decision in the system. They are tools for resolving disagreement and shortcuts for new contributors."
      />
      <div className="space-y-4">
        {principles.map(p => (
          <div key={p.num} className="group bg-cream-100 border border-cream-300 rounded-2xl p-8 hover:bg-cream-50 transition-colors">
            <div className="flex items-baseline gap-4 mb-4">
              <span className="font-display text-5xl text-orange-500 leading-none" style={{ fontVariationSettings: "'opsz' 72" }}>{p.num}</span>
              <h2 className="text-3xl text-navy-900 leading-tight">{p.title}</h2>
            </div>
            <p className="text-base text-ink-700 leading-relaxed mb-5 max-w-3xl">{p.body}</p>
            <div className="inline-flex items-start gap-3 bg-cream-200 rounded-xl px-4 py-3 max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.18em] text-orange-600 font-bold mt-1 shrink-0">In practice</span>
              <span className="text-sm text-ink-800 italic">{p.practice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

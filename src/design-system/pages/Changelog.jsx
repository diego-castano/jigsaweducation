import Badge from '../../components/Badge';
import PageHeader from '../../components/PageHeader';

export default function Changelog() {
  const releases = [
    { v: 'v1.0.0', date: 'March 2026', tag: 'Initial release', items: [
      'Full token set — colour, type, spacing, radius, elevation, motion',
      'Component library — buttons, inputs, cards, badges, navigation, feedback, containers',
      'Site modules — heroes, publication card, team card, stats, filters, footer',
      'Site templates — article, evidence library, about, 404',
      'Brand applications — logo system, photography rules, pattern',
      'Documentation — principles, voice & tone, accessibility'
    ]},
    { v: 'v0.9.0', date: 'February 2026', tag: 'Beta', items: [
      'Cream neutrals introduced as warm replacement for legacy grey',
      'Fraunces added as display typeface alongside Lato',
      'Photo policy formalised — own-work, dignified, consensual'
    ]},
    { v: 'v0.5.0', date: 'January 2026', tag: 'Discovery', items: [
      'Brand audit completed against 2014 guidelines',
      '3:1 colour rule (sea/cream vs navy/orange) carried forward',
      'Lusaka office identity requirements gathered'
    ]}
  ];
  return (
    <div>
      <PageHeader
        kicker="System · 02"
        title="Changelog"
        lede="Versioned releases of the design system. Major versions are tagged when tokens change in a breaking way."
      />
      <div className="space-y-4">
        {releases.map((r, i) => (
          <div key={i} className="bg-cream-100 border border-cream-300 rounded-2xl p-7">
            <div className="flex flex-wrap items-baseline gap-3 mb-4">
              <span className="font-display text-3xl text-navy-900">{r.v}</span>
              <Badge variant={i === 0 ? 'orange' : 'cream'}>{r.tag}</Badge>
              <span className="text-[11px] font-mono text-ink-500 ml-auto">{r.date}</span>
            </div>
            <ul className="space-y-2">
              {r.items.map((it, j) => (
                <li key={j} className="flex gap-3 text-sm text-ink-700">
                  <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

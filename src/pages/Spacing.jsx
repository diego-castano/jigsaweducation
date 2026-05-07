import Card from '../components/Card';
import Section from '../components/Section';
import PageHeader from '../components/PageHeader';

export default function SpacingPage() {
  const spaces = [
    { token: 'space-1', px: '4px' }, { token: 'space-2', px: '8px' },
    { token: 'space-3', px: '12px' }, { token: 'space-4', px: '16px' },
    { token: 'space-6', px: '24px' }, { token: 'space-8', px: '32px' },
    { token: 'space-12', px: '48px' }, { token: 'space-16', px: '64px' },
    { token: 'space-24', px: '96px' }, { token: 'space-32', px: '128px' }
  ];
  const radii = [
    { token: 'sm', px: '4px' }, { token: 'md', px: '8px' },
    { token: 'lg', px: '16px' }, { token: 'xl', px: '24px' },
    { token: '2xl', px: '32px' }, { token: 'full', px: '9999px' }
  ];

  return (
    <div>
      <PageHeader
        kicker="Foundations · 03"
        title="Spacing & Radius"
        lede="An 8-point grid for spatial rhythm. Generous padding is a feature, not a bug — it reflects the calm credibility of the brand."
      />
      <Section title="8pt scale" description="All spacing tokens are multiples of 4px, with the most-used values hitting the 8pt grid. Consistency here means the entire site reads as a unified system.">
        <Card>
          {spaces.map((s) => (
            <div key={s.token} className="flex items-center gap-6 py-2 border-b border-cream-300 last:border-0">
              <div className="w-32 text-[12px] font-mono text-ink-700">{s.token}</div>
              <div className="w-16 text-[11px] font-mono text-ink-500">{s.px}</div>
              <div className="flex-1">
                <div className="h-3 bg-orange-500 rounded-sm" style={{ width: s.px }} />
              </div>
            </div>
          ))}
        </Card>
      </Section>
      <Section title="Radius" description="Generous rounding for cards (lg), pill shapes for buttons (full), and softly rounded photography (xl).">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          {radii.map((r) => (
            <div key={r.token} className="text-center">
              <div
                className="aspect-square bg-sea-200 mb-3 mx-auto"
                style={{ borderRadius: r.px, maxWidth: '120px' }}
              />
              <div className="text-[12px] font-mono text-ink-700">{r.token}</div>
              <div className="text-[11px] font-mono text-ink-500">{r.px}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Section rhythm" description="Recommended whitespace between major page elements.">
        <Card>
          <div className="space-y-2">
            {[
              ['Inside cards (padding)', '24px → 32px'],
              ['Between elements in a card', '12px → 16px'],
              ['Between cards in a grid', '16px → 24px'],
              ['Between sections (vertical)', '64px → 96px'],
              ['Page top/bottom padding', '64px → 128px']
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-cream-300 last:border-0">
                <span className="text-sm text-ink-700">{k}</span>
                <span className="text-[12px] font-mono text-ink-500">{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </div>
  );
}

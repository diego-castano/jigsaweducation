import Card from '../../components/Card';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';

export default function ElevationPage() {
  const shadows = [
    { name: 'shadow-xs', val: '0 1px 2px rgba(44,83,104,0.04)', use: 'Subtle border replacement' },
    { name: 'shadow-sm', val: '0 2px 4px rgba(44,83,104,0.06)', use: 'Resting cards' },
    { name: 'shadow-md', val: '0 4px 12px rgba(44,83,104,0.08)', use: 'Hover state, interactive cards' },
    { name: 'shadow-lg', val: '0 12px 24px rgba(44,83,104,0.10)', use: 'Dropdowns, popovers' },
    { name: 'shadow-xl', val: '0 24px 48px rgba(44,83,104,0.12)', use: 'Modals, overlays' }
  ];

  return (
    <div>
      <PageHeader
        kicker="Foundations · 04"
        title="Elevation"
        lede="Five steps of soft, navy-tinted shadow. Subtle by design — Jigsaw earns trust through restraint, not depth theatre."
      />
      <Section title="Shadow scale">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {shadows.map((s, i) => (
            <div key={s.name} className="flex flex-col items-center">
              <div
                className="w-full aspect-square bg-cream-100 rounded-2xl mb-4 flex items-center justify-center"
                style={{ boxShadow: s.val }}
              >
                <span className="text-[11px] font-mono text-ink-500">{`level ${i}`}</span>
              </div>
              <div className="text-sm font-mono text-ink-700 mb-1">{s.name}</div>
              <div className="text-[11px] text-ink-600 text-center max-w-[140px]">{s.use}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Use sparingly" description="90% of UI uses shadow-sm or no shadow at all. Reserve shadow-lg and above for true overlays. Stacked shadows feel cheap; one well-placed elevation feels considered.">
        <Card>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { tone: '✓', label: 'Subtle resting elevation', good: true },
              { tone: '✓', label: 'Lift on hover (sm → md)', good: true },
              { tone: '✗', label: 'Layered drop shadows', good: false }
            ].map((item) => (
              <div key={item.label} className={`p-4 rounded-xl ${item.good ? 'bg-sea-50 text-sea-700' : 'bg-orange-50 text-orange-700'}`}>
                <div className="text-2xl font-display mb-1">{item.tone}</div>
                <div className="text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </div>
  );
}

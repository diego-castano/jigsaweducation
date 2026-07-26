import Icon from '../../components/Icon';
import Card from '../../components/Card';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';

export default function IconsPage() {
  const groups = {
    'Education & Research': ['book-open', 'graduation', 'file-text', 'flask', 'microscope', 'lightbulb'],
    'Geography': ['globe', 'map-pin', 'compass'],
    'People': ['users', 'user'],
    'Communication': ['mail', 'message', 'send', 'phone'],
    'Actions': ['download', 'external', 'search', 'filter', 'edit', 'copy'],
    'Status': ['check', 'check-circle', 'x', 'alert', 'info', 'shield']
  };

  return (
    <div>
      <PageHeader
        kicker="Foundations · 05"
        title="Iconography"
        lede="A consistent line-icon system at 1.5px stroke weight. Calm, considered, never cartoonish."
      />
      <Section title="Sizing" description="Three sizes cover 95% of needs. Always pair an icon with text or an aria-label.">
        <Card>
          <div className="flex items-center gap-12">
            {[16, 20, 24, 32].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div className="text-navy-900">
                  <Icon name="book-open" size={s} />
                </div>
                <span className="text-[11px] font-mono text-ink-500">{`${s}px`}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>
      {Object.entries(groups).map(([groupName, icons]) => (
        <Section key={groupName} title={groupName}>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {icons.map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 p-4 bg-cream-100 rounded-xl border border-cream-300 hover:bg-cream-200 hover:-translate-y-0.5 transition-all"
              >
                <div className="text-navy-700">
                  <Icon name={name} size={22} />
                </div>
                <span className="text-[11px] font-mono text-ink-600">{name}</span>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}

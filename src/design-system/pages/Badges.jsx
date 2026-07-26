import Icon from '../../components/Icon';
import Badge from '../../components/Badge';
import Card from '../../components/Card';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';

export default function BadgesPage() {
  return (
    <div>
      <PageHeader
        kicker="Components · 04"
        title="Badges & Tags"
        lede="Small labels for categorisation, status, and filtering."
      />
      <Section title="Solid badges">
        <Card className="flex flex-wrap gap-2">
          <Badge variant="orange">Featured</Badge>
          <Badge variant="sea">Learning Brief</Badge>
          <Badge variant="navy">Research Report</Badge>
          <Badge variant="cream">Year in Review</Badge>
          <Badge>Policy Brief</Badge>
        </Card>
      </Section>
      <Section title="Status indicators">
        <Card className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active project
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            In review
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 text-ink-700 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-500" />
            Archived
          </span>
        </Card>
      </Section>
      <Section title="Filter chips" description="Removable tags for active filters in the Evidence Library.">
        <Card className="flex flex-wrap gap-2">
          {['East Africa', 'EdTech', '2024–2026', 'English'].map((t) => (
            <span key={t} className="inline-flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-sea-500 text-white text-xs font-bold">
              {t}
              <button className="w-5 h-5 rounded-full bg-sea-700 hover:bg-navy-900 flex items-center justify-center">
                <Icon name="x" size={10} />
              </button>
            </span>
          ))}
        </Card>
      </Section>
    </div>
  );
}

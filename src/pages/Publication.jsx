import Card from '../components/Card';
import Section from '../components/Section';
import PageHeader from '../components/PageHeader';
import PublicationCard from '../components/PublicationCard';
import { PUBLICATIONS } from '../data/publications';

export default function Publication() {
  return (
    <div>
      <PageHeader
        kicker="Site Modules · 02"
        title="Publication card"
        lede={"The atom of the Evidence Library. Each card surfaces a publication's type, authors, date, region, and a one-paragraph summary — enough to decide whether to read further."}
      />
      <Section title="Default state">
        <div className="grid lg:grid-cols-2 gap-4">
          {PUBLICATIONS.map((p, i) => (
            <PublicationCard key={i} pub={p} />
          ))}
        </div>
      </Section>
      <Section title="Anatomy" description="Each card breaks down into seven semantic regions, all driven from a single publication record in the Evidence Library database.">
        <Card>
          <ol className="space-y-2 text-sm text-ink-700">
            {[
              'Type badge — Learning Brief, Research Report, Policy Brief, Year in Review',
              'Region label — primary geographic focus',
              'Title — Fraunces, 20px, navy-900',
              'Summary — 2–3 lines, truncated if longer',
              'Authors + date — small, JetBrains Mono',
              'Primary action — Download PDF or View source (external)',
              'Save — secondary action, persisted per user'
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-sea-100 text-sea-700 text-[11px] font-mono flex items-center justify-center font-bold">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Card>
      </Section>
    </div>
  );
}

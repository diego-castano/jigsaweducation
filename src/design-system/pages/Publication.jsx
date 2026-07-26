import Link from 'next/link';
import Card from '../../components/Card';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';
import Icon from '../../components/Icon';
import { PUBLICATIONS } from '../../data/publications';
import { isPlaceholder } from '../../data/placeholder';

// v2 recipe, matching src/site/components/PublicationCard.jsx exactly.
// Client feedback on Site Modules 02 killed the v1 card in two moves:
//   "we're wondering about removing the landscape image/icon box, as we're
//    going to struggle to fill those for every publication. As an
//    alternative, might we maybe include a small portrait image of the front
//    cover of each report to the left of each card?"
//      -> the landscape tile is gone. A portrait cover sits on the left.
//   "if we retain the image box, can we remove the dots and top right
//    shadow?"
//      -> moot, but the dot pattern and the shadow went with it too.
//
// The design system does not import site components (that boundary matters
// more than saving a few lines), so this replica lives here, built from the
// same local primitives as the rest of the document. No cover images exist
// in the data yet, so every card below is showing the typographic fallback:
// a spine tinted by publication type, standing in for a scanned front cover.
const TYPE_STYLE = {
  'Learning Brief': { badge: 'bg-orange-100 text-orange-700', spine: '#FFE8DA', ink: '#B34E07' },
  'Research Report': { badge: 'bg-navy-100 text-navy-800', spine: '#E3EDF2', ink: '#2C5368' },
  'Policy Brief': { badge: 'bg-sea-100 text-sea-700', spine: '#D8E6EC', ink: '#407C9B' },
  'Year in Review': { badge: 'bg-cream-200 text-ink-700', spine: '#F2EDE0', ink: '#6B6B61' },
  Resource: { badge: 'bg-success-50 text-success-700', spine: '#E8F5F3', ink: '#14705F' }
};

function PublicationCardDemo({ pub }) {
  const style = TYPE_STYLE[pub.type] || TYPE_STYLE['Research Report'];

  return (
    <li className="group relative flex gap-5 bg-cream-50 border border-cream-300 rounded-2xl p-5">
      <div className="shrink-0 w-[84px] sm:w-[100px]">
        <div
          className="aspect-[1/1.414] rounded-lg overflow-hidden border border-cream-300 flex items-center justify-center p-2 text-center"
          style={{ background: style.spine }}
        >
          <span
            className="font-display text-[10px] leading-tight uppercase tracking-wider"
            style={{ color: style.ink }}
          >
            {pub.type}
          </span>
        </div>
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${style.badge}`}>
            {pub.type}
          </span>
          {pub.region && <span className="font-mono text-[11px] text-ink-500">{pub.region}</span>}
        </div>

        <h3 className="font-display text-lg leading-snug text-navy-900">
          <Link
            href="#"
            className="after:absolute after:inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-2xl"
          >
            {pub.title}
          </Link>
        </h3>

        {pub.summary && (
          <p
            className={`text-sm leading-relaxed mt-2.5 flex-1 ${
              isPlaceholder(pub.summary) ? 'text-ink-500 italic' : 'text-ink-700'
            }`}
          >
            {isPlaceholder(pub.summary) && (
              <span className="not-italic font-mono text-[10px] uppercase tracking-[0.15em] text-orange-600 mr-2">
                Awaiting copy
              </span>
            )}
            {pub.summary}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 font-mono text-[11px] text-ink-500">
          {pub.authors ? <span>{pub.authors}</span> : <span className="italic">Authors tbc</span>}
          {pub.date ? <span>{pub.date}</span> : <span className="italic">Date tbc</span>}
          {pub.fileSize && <span className="ml-auto">PDF · {pub.fileSize}</span>}
        </div>
      </div>

      {pub.pdf && (
        <span
          className="relative z-10 self-start shrink-0 w-9 h-9 rounded-full bg-cream-200 text-navy-700 flex items-center justify-center"
          aria-hidden="true"
        >
          <Icon name="download" size={16} />
        </span>
      )}
    </li>
  );
}

export default function Publication() {
  return (
    <div>
      <PageHeader
        kicker="Site Modules · 02"
        title="Publication card"
        lede={"The atom of the Evidence Library. Each card surfaces a publication's type, authors, date, region, and a one-paragraph summary: enough to decide whether to read further."}
      />
      <Section
        title="Default state"
        description="No box-in-box, no shadow, no dot pattern. A portrait cover sits on the left at an A5-ish proportion, so a scanned front cover can drop in later without the layout moving. Until then, it falls back to a typographic spine coloured by publication type."
      >
        <ul className="grid lg:grid-cols-2 gap-4">
          {PUBLICATIONS.map((p, i) => (
            <PublicationCardDemo key={i} pub={p} />
          ))}
        </ul>
      </Section>
      <Section
        title="Anatomy"
        description="Each card breaks down into seven semantic regions, all driven from a single publication record in the Evidence Library database."
      >
        <Card>
          <ol className="space-y-2 text-sm text-ink-700">
            {[
              'Portrait cover: A5 proportion, left-aligned. Falls back to a typographic spine tinted by type when no cover image exists; no landscape tile, no icon plate, no dot pattern',
              'Type badge: Learning Brief, Research Report, Policy Brief, Year in Review, Resource',
              'Region label: primary geographic focus, mono, next to the badge',
              'Title: Literata, 18px, navy-900, the card\'s stretched link',
              'Summary: one sentence where the client has supplied it, or a muted italic line with an "Awaiting copy" tag where they have not',
              'Authors and date: small mono metadata row; renders "Authors tbc" / "Date tbc" rather than guessing',
              'Download: circular icon action, raised above the stretched title link so it stays independently clickable'
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

import Link from 'next/link';
import Icon from '../../components/Icon';
import { isPlaceholder } from '../../data/placeholder';
import SmartImage from './SmartImage';

// Site modules 02 feedback, applied in full:
//   "we're wondering about removing the landscape image/icon box, as we're
//    going to struggle to fill those for every publication. As an alternative,
//    might we maybe include a small portrait image of the front cover of each
//    report to the left of each card?"
//      → the landscape tile is gone. A portrait cover sits on the left.
//   "if we retain the image box, can we remove the dots and top right shadow?"
//      → moot, but the dot pattern and the shadow went with it.
//
// No cover images exist yet, so the fallback is a typographic spine coloured by
// publication type. It reads as a document at a glance and needs no asset.
const TYPE_STYLE = {
  'Learning Brief': { badge: 'bg-orange-100 text-orange-700', spine: '#FFE8DA', ink: '#B34E07' },
  'Research Report': { badge: 'bg-navy-100 text-navy-800', spine: '#E3EDF2', ink: '#2C5368' },
  'Policy Brief': { badge: 'bg-sea-100 text-sea-700', spine: '#D8E6EC', ink: '#407C9B' },
  'Year in Review': { badge: 'bg-cream-200 text-ink-700', spine: '#F2EDE0', ink: '#6B6B61' },
  Resource: { badge: 'bg-success-50 text-success-700', spine: '#E8F5F3', ink: '#14705F' }
};

export default function PublicationCard({ pub }) {
  const style = TYPE_STYLE[pub.type] || TYPE_STYLE['Research Report'];

  return (
    <li className="group relative flex gap-5 bg-cream-50 border border-cream-300 rounded-2xl p-5 transition-shadow hover:shadow-md">
      {/* Portrait cover, left. A5-ish proportion so a real front cover drops in
          without the layout moving. */}
      <div className="shrink-0 w-[84px] sm:w-[100px]">
        <div
          className="aspect-[1/1.414] rounded-lg overflow-hidden border border-cream-300 flex items-center justify-center p-2 text-center"
          style={{ background: style.spine }}
        >
          {pub.coverImage ? (
            <SmartImage
              src={pub.coverImage}
              alt=""
              className="w-full h-full"
              imgClassName="object-cover"
            />
          ) : (
            <span
              className="font-display text-[10px] leading-tight uppercase tracking-wider"
              style={{ color: style.ink }}
              aria-hidden="true"
            >
              {pub.type}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        {/* The brief lists six tile fields: cover, title, date, region/country,
            method/service, topic specialism. Region and country ride the badge
            row; method and topic close the card as quiet mono lines below. */}
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${style.badge}`}>
            {pub.type}
          </span>
          {pub.region && (
            <span className="font-mono text-[11px] text-ink-500">
              {pub.region}
              {pub.countries?.length > 0 && ` · ${pub.countries.join(' · ')}`}
            </span>
          )}
        </div>

        <h3 className="font-display text-lg leading-snug text-navy-900">
          <Link
            href={`/publications/${pub.slug}`}
            className="after:absolute after:inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-2xl"
          >
            {pub.title}
          </Link>
        </h3>

        {/* The brief's own note on the EdTech Hub library: it filters well but
            has "no simple summary sentence". This is that sentence.
            Compact placeholder styling rather than the full dashed slab — ten
            of those stacked in a grid would drown the real content. */}
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

        {(pub.method || pub.topic) && (
          <p className="mt-3 text-xs text-ink-600 leading-relaxed">
            {[pub.method, pub.topic].filter(Boolean).join(' · ')}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 font-mono text-[11px] text-ink-500">
          {pub.authors ? <span>{pub.authors}</span> : <span className="italic">Authors tbc</span>}
          {pub.date ? <span>{pub.date}</span> : <span className="italic">Date tbc</span>}
          {pub.fileSize && <span className="ml-auto">PDF · {pub.fileSize}</span>}
        </div>
      </div>

      {/* relative z-10 lifts the download above the title's stretched ::after,
          so it stays independently clickable. No JS needed for that. */}
      {pub.pdf && (
        <a
          href={pub.pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 self-start shrink-0 w-9 h-9 rounded-full bg-cream-200 hover:bg-orange-100 text-navy-700 hover:text-orange-700 flex items-center justify-center transition-colors"
          aria-label={`Download ${pub.title} as PDF, ${pub.fileSize}`}
        >
          <Icon name="download" size={16} />
        </a>
      )}
    </li>
  );
}

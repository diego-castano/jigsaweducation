import Link from 'next/link';
import Icon from '../../components/Icon';
import SmartImage from './SmartImage';
import { altFor, objectPositionFor } from '../../lib/media-meta';

// Site modules 03 feedback, applied:
//   "How can we ensure the colour filter is consistent?"
//     → one fixed recipe in CSS, not per-image editing. Supply colour photos;
//       the system desaturates them identically every time.
//   "when you hover on a card, can the filter disappear so that their face is
//    less murky?"
//     → grayscale and the navy wash both drop to zero on hover and on focus.
//   "Can we change cities to countries for location?"
//     → country, and the chip is omitted entirely when we do not know it,
//       rather than guessing where someone lives.
//
// The initials fallback exists because of the client's photo policy: no stock,
// no AI-generated people, no identifiable faces without written consent. A
// missing photo is a normal state here, not an error. It carries the same
// aspect box, the same navy wash and the same hover lift as a photograph, so
// the one person without a picture does not read as a broken card.
//
// The root is a <div>, not an <li>: the Team grid wraps each card in
// <Reveal as="li"> so the entrance stagger has an element of its own. The
// stretched link still resolves against this div, which is the nearest
// positioned ancestor.
export default function TeamCard({ person, mediaMeta }) {
  const initials = person.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  // Deterministic tint so a person's plate never changes between renders.
  const tints = ['#407c9b', '#2c5368', '#ff7816', '#1c998a'];
  const tint = tints[person.name.charCodeAt(0) % tints.length];

  // Rozina Zazai has no country, no LinkedIn and no ORCID. Rendering the row
  // anyway left an empty band of padding under her role, so the row only
  // exists when it has something in it.
  const hasLinks = Boolean(person.linkedin || person.orcid);
  const hasMeta = Boolean(person.country) || hasLinks;

  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 transition-[box-shadow,border-color] duration-300 ease-[var(--ease-emphasized)] hover:border-cream-400 hover:shadow-md focus-within:border-cream-400 focus-within:shadow-md motion-reduce:transition-none">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
        {person.photo ? (
          <>
            <SmartImage
              src={person.photo}
              alt={altFor(mediaMeta, person.photo)}
              objectPosition={objectPositionFor(mediaMeta, person.photo)}
              className="absolute inset-0 w-full h-full"
              imgClassName="object-cover grayscale-[0.55] contrast-[1.05] transition-all duration-500 group-hover:grayscale-0 group-focus-within:grayscale-0 group-hover:scale-[1.02]"
            />
            <span
              className="absolute inset-0 bg-navy-900 mix-blend-multiply opacity-25 transition-opacity duration-500 group-hover:opacity-0 group-focus-within:opacity-0 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </>
        ) : (
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${tint}, #1a3340)` }}
            aria-hidden="true"
          >
            <span
              className="font-display text-5xl sm:text-6xl leading-none tracking-[0.06em] text-cream-50"
              style={{ fontVariationSettings: "'opsz' 48" }}
            >
              {initials}
            </span>
            <span className="absolute inset-0 bg-navy-900 opacity-20 transition-opacity duration-500 group-hover:opacity-0 group-focus-within:opacity-0 motion-reduce:transition-none" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <h2
          className="font-display display-s text-[22px] sm:text-2xl text-navy-900 leading-[1.15]"
        >
          <Link
            href={`/team/${person.slug}`}
            className="after:absolute after:inset-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            {person.name}
          </Link>
        </h2>
        <p className="mt-2 text-[13px] font-light leading-snug tracking-[0.01em] text-ink-600">
          {person.role}
        </p>

        {hasMeta && (
          <div className="mt-auto flex items-center gap-3 pt-5 text-ink-500">
            {person.country && (
              <span className="inline-flex items-center gap-1.5 text-xs">
                <Icon name="map-pin" size={13} />
                {person.country}
              </span>
            )}
            {hasLinks && (
              // Quiet until the card is hovered or something inside it takes
              // focus, so eighteen cards do not read as a wall of badges.
              <span className="relative z-10 ml-auto flex items-center gap-2 opacity-60 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none">
                {person.linkedin && (
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${person.name} on LinkedIn`}
                    className="tactile flex h-10 w-10 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-cream-200 text-[10px] font-bold text-navy-900 transition-colors hover:bg-sea-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    in
                  </a>
                )}
                {person.orcid && (
                  <a
                    href={person.orcid}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${person.name} on ORCID`}
                    className="tactile flex h-10 w-10 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-cream-200 text-[9px] font-bold text-navy-900 transition-colors hover:bg-success-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    iD
                  </a>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

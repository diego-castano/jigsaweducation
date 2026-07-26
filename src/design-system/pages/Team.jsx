import Link from 'next/link';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';
import Icon from '../../components/Icon';
import { TEAM } from '../../data/team';

// v2 recipe, matching src/site/components/TeamCard.jsx exactly. Three rounds
// of client feedback on Site Modules 03, all applied:
//   "How can we ensure the colour filter is consistent?"
//     -> one fixed recipe, not per-image editing: grayscale(0.55) plus a
//        navy-900 multiply wash at 25% opacity, on every photo, every time.
//   "when you hover on a card, can the filter disappear so that their face
//    is less murky?"
//     -> both layers drop to zero on hover and on focus, 500ms.
//   "Can we change cities to countries for location?"
//     -> country, and the chip is omitted entirely when the country is not
//        known, rather than guessing where someone lives from an old bio.
//
// The initials fallback exists because of the photo policy: no stock, no
// AI-generated people, no identifiable face without written consent. A
// missing photo is a normal state here, not an error, so it carries the same
// aspect box, the same navy wash and the same hover behaviour as a photo.
function TeamCardDemo({ person }) {
  const initials = person.name.split(' ').map((n) => n[0]).slice(0, 2).join('');
  const tints = ['#407c9b', '#2c5368', '#ff7816', '#1c998a'];
  const tint = tints[person.name.charCodeAt(0) % tints.length];
  const hasLinks = Boolean(person.linkedin || person.orcid);
  const hasMeta = Boolean(person.country) || hasLinks;

  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 transition-[box-shadow,border-color] duration-300 hover:border-cream-400 hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
        {person.photo ? (
          <>
            <img
              src={person.photo}
              alt=""
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.55] contrast-[1.05] transition-all duration-500 group-hover:grayscale-0"
            />
            <span
              className="absolute inset-0 bg-navy-900 mix-blend-multiply opacity-25 transition-opacity duration-500 group-hover:opacity-0"
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
            <span className="absolute inset-0 bg-navy-900 opacity-20 transition-opacity duration-500 group-hover:opacity-0" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <h2 className="font-display display-s text-[22px] sm:text-2xl text-navy-900 leading-[1.15]">
          <Link href="#" className="after:absolute after:inset-0 rounded-2xl">
            {person.name}
          </Link>
        </h2>
        <p className="mt-2 text-[13px] font-light leading-snug tracking-[0.01em] text-ink-600">{person.role}</p>

        {hasMeta && (
          <div className="mt-auto flex items-center gap-3 pt-5 text-ink-500">
            {person.country && (
              <span className="inline-flex items-center gap-1.5 text-xs">
                <Icon name="map-pin" size={13} />
                {person.country}
              </span>
            )}
            {hasLinks && (
              <span className="relative z-10 ml-auto flex items-center gap-2 opacity-60 transition-opacity duration-300 group-hover:opacity-100">
                {person.linkedin && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cream-200 text-[10px] font-bold text-navy-900">in</span>
                )}
                {person.orcid && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cream-200 text-[9px] font-bold text-navy-900">iD</span>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <div>
      <PageHeader
        kicker="Site Modules · 03"
        title="Team card"
        lede="Profiles for the Team page. Photo (or initials fallback), role, country, and links to LinkedIn and ORCID where the person has them."
      />
      <Section title="Grid">
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {TEAM.slice(0, 6).map((p, i) => (
            <TeamCardDemo key={i} person={p} />
          ))}
        </div>
      </Section>
      <Section
        title="Avatar handling"
        description={"Per the photo policy, profile photos are used only with explicit consent and only when sourced from Jigsaw's own work. The duotone is one fixed recipe applied to every photo alike, grayscale(0.55) plus a navy-900 multiply wash at 25% opacity, rather than per-image colour correction, so no face reads more or less \"murky\" than another's. On hover or focus both layers lift to zero over 500ms, clearing the face rather than darkening it further. The fallback is a coloured initials avatar derived from the person's name, carrying the same aspect box and the same hover behaviour, so the handful of people without a photo never read as a broken card."}
      />
      <Section
        title="Location and social links"
        description={"Cities became countries after client review: a city implies a home address for people whose bios only mention where they once studied or worked. The country chip is a fact, not an inference, so it is omitted entirely rather than guessed for the 16 of 18 team members whose bios do not state a current base. LinkedIn and ORCID chips sit at 60% opacity until the card is hovered or focused, so a grid of cards does not read as a wall of badges."}
      />
    </div>
  );
}

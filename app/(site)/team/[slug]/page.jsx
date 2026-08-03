import Link from 'next/link';
import { notFound } from 'next/navigation';
import Section from '../../../../src/site/components/Section';
import Icon from '../../../../src/components/Icon';
import { getCollection, getItem, getSingleton } from '../../../../src/lib/content';
import Prose from '../../../../src/site/components/Prose';
import { proseToText } from '../../../../src/lib/rich-text';

export async function generateStaticParams() {
  const team = await getCollection('team');
  return team.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const person = await getItem('team', slug);
  if (!person) return {};

  return {
    title: `${person.name}, ${person.role}`,
    // First two sentences of the bio, so each of the 18 pages carries a real
    // description. The live site has none on any of its 34 pages.
    description: proseToText(person.bio).replace(/\s+/g, ' ').split('. ').slice(0, 2).join('. ') + '.',
    alternates: { canonical: `/team/${person.slug}` }
  };
}

export default async function TeamMemberPage({ params }) {
  const { slug } = await params;
  const [person, site, ui] = await Promise.all([
    getItem('team', slug),
    getSingleton('site-settings'),
    getSingleton('ui-strings')
  ]);
  if (!person) notFound();

  const initials = person.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.role,
    worksFor: { '@type': 'Organization', name: site.legalName, url: site.url },
    url: `${site.url}/team/${person.slug}`,
    ...(person.linkedin || person.orcid
      ? { sameAs: [person.linkedin, person.orcid].filter(Boolean) }
      : {}),
    ...(person.orcid ? { identifier: person.orcid } : {})
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <Section width="default">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-orange-600 transition-colors"
          >
            <Icon name="chevron-left" size={16} />
            {ui.breadcrumbTeam}
          </Link>
        </nav>

        <div className="grid lg:grid-cols-[300px_1fr] gap-10 lg:gap-16">
          <div>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-cream-200 relative">
              {person.photo ? (
                <img
                  src={person.photo}
                  alt={person.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <span
                  className="absolute inset-0 flex items-center justify-center font-display text-6xl text-cream-50"
                  style={{ background: 'linear-gradient(135deg, #407c9b, #1a3340)' }}
                  aria-hidden="true"
                >
                  {initials}
                </span>
              )}
            </div>

            {(person.linkedin || person.orcid || person.country) && (
              <dl className="mt-6 space-y-3 text-sm">
                {person.country && (
                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Based in</dt>
                    <Icon name="map-pin" size={15} className="text-ink-500" />
                    <dd className="text-ink-700">{person.country}</dd>
                  </div>
                )}
                {person.linkedin && (
                  <div>
                    <dt className="sr-only">LinkedIn</dt>
                    <dd>
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sea-700 hover:text-orange-600 transition-colors"
                      >
                        <Icon name="external" size={15} />
                        LinkedIn
                      </a>
                    </dd>
                  </div>
                )}
                {person.orcid && (
                  <div>
                    <dt className="sr-only">ORCID</dt>
                    <dd>
                      <a
                        href={person.orcid}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sea-700 hover:text-orange-600 transition-colors"
                      >
                        <Icon name="external" size={15} />
                        ORCID
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-3">
              {person.role}
            </p>
            <h1 className="font-display display-l text-4xl sm:text-5xl lg:text-6xl text-navy-900 leading-[1.02]">
              {person.name}
            </h1>

            <Prose text={person.bio} className="prose-jigsaw mt-8 text-lg text-ink-800 max-w-2xl" />
          </div>
        </div>
      </Section>
    </>
  );
}

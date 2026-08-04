import Link from 'next/link';
import { notFound } from 'next/navigation';
import Section from '../../../../src/site/components/Section';
import CaseStudyCard from '../../../../src/site/components/CaseStudyCard';
import Icon from '../../../../src/components/Icon';
import { getCollection, getItem, getSingleton, getMediaMeta } from '../../../../src/lib/content';
import { publicationsForCaseStudy } from '../../../../src/lib/derive';
import Prose from '../../../../src/site/components/Prose';
import { CLASSIFICATION_LABELS, countLabel } from '../../../../src/lib/labels';
import { altFor, objectPositionFor } from '../../../../src/lib/media-meta';

export async function generateStaticParams() {
  const studies = await getCollection('case-studies');
  return studies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = await getItem('case-studies', slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: `/case-studies/${study.slug}` }
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const [mediaMeta, study, studies, services, publications, page, settings, ui] = await Promise.all([
    getMediaMeta(),
    getItem('case-studies', slug),
    getCollection('case-studies'),
    getCollection('services'),
    getCollection('publications'),
    getSingleton('page-case-studies'),
    getSingleton('site-settings'),
    getSingleton('ui-strings')
  ]);
  if (!study) notFound();

  const showReviewNotes = Boolean(settings.showReviewNotes);
  const service = services.find((s) => s.title === study.service);
  const relatedPublications = publicationsForCaseStudy(publications, study.slug);
  const others = studies
    .filter((c) => c.slug !== study.slug && c.topics?.some((t) => study.topics?.includes(t)))
    .slice(0, 3);

  // The brief fixes the same four sections on every case study page, in this
  // order, so a reader who has seen one knows where to look on all of them.
  // The order and keys are structural; only the headings are editable.
  const sectionOrder = [
    { key: 'criticalQuestion', label: ui.sectionCriticalQuestion },
    { key: 'collaboration', label: ui.sectionCollaboration },
    { key: 'buildingEvidence', label: ui.sectionBuildingEvidence },
    { key: 'pathwaysToUptake', label: ui.sectionPathwaysToUptake }
  ];

  return (
    <>
      <Section width="default" className="pb-0">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 py-2 -my-2 text-sm text-ink-600 hover:text-orange-600 transition-colors"
          >
            <Icon name="chevron-left" size={16} />
            {ui.breadcrumbCaseStudies}
          </Link>
        </nav>

        <h1 className="font-display display-l text-4xl sm:text-5xl lg:text-6xl text-navy-900 leading-[1.02] max-w-4xl">
          {study.title}
        </h1>

        {/* Summary box: countries, partners, method. The brief asks for flags
            and partner logos here; neither asset exists yet, so this reads as
            plain text rather than pretending. */}
        <dl className="mt-10 grid sm:grid-cols-3 gap-px bg-cream-300 border border-cream-300 rounded-2xl overflow-hidden">
          <div className="bg-cream-100 p-6">
            <dt className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-3">
              {countLabel('country', study.countries?.length ?? 0)}
            </dt>
            <dd className="text-navy-900">
              {study.countries?.length ? study.countries.join(', ') : <span className="text-ink-500 italic">Not specified</span>}
            </dd>
          </div>
          <div className="bg-cream-100 p-6">
            <dt className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-3">
              {countLabel('partner', study.partners?.length ?? 0)}
            </dt>
            <dd className="text-navy-900">{study.partners?.join(', ')}</dd>
          </div>
          <div className="bg-cream-100 p-6">
            <dt className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-3">
              {CLASSIFICATION_LABELS.method}
            </dt>
            <dd className="text-navy-900">
              {study.method}
              {service && (
                <Link
                  href={`/services#${service.slug}`}
                  className="inline-block mt-1 py-1.5 text-sm text-sea-700 hover:text-orange-600 underline underline-offset-4"
                >
                  {service.title}
                </Link>
              )}
            </dd>
          </div>
        </dl>

        {study.image && (
          <div className="mt-10 aspect-[21/9] rounded-2xl overflow-hidden bg-cream-200">
            <img
              src={study.image}
              alt={altFor(mediaMeta, study.image)}
              style={{ objectPosition: objectPositionFor(mediaMeta, study.image) }}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </Section>

      <Section width="narrow">
        <div className="space-y-12">
          {sectionOrder.map(({ key, label }) => {
            const body = study.sections?.[key];
            if (!body) return null;
            // '[tbc]' marks copy still awaited from the team. The placeholder
            // box is a review-phase note: it shows only while review notes are
            // on, and the section vanishes entirely once they are off.
            const missing = body === '[tbc]';
            if (missing && !showReviewNotes) return null;
            return (
              <div key={key}>
                <h2 className="font-display text-2xl sm:text-3xl text-navy-900 mb-4">{label}</h2>
                {missing ? (
                  <p className="border border-dashed border-cream-400 bg-cream-100/60 rounded-xl px-4 py-3 text-ink-500 italic">
                    <span className="not-italic font-mono text-[10px] uppercase tracking-[0.18em] text-orange-600 block mb-1">
                      {ui.awaitingCopyBadge}
                    </span>
                    This section is still awaited from the Jigsaw team.
                  </p>
                ) : (
                  <Prose text={body} className="text-lg text-ink-800 leading-[1.75]" />
                )}
              </div>
            );
          })}
        </div>

        {showReviewNotes && study.isDerived && (
          <p className="mt-12 flex items-start gap-2.5 text-sm text-ink-600 bg-cream-100 border border-cream-300 rounded-xl p-4">
            <Icon name="info" size={16} className="mt-0.5 shrink-0 text-sea-600" />
            <span>{page.draftNotice}</span>
          </p>
        )}

        {study.links?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-cream-300">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-4">
              {ui.findOutMoreHeading}
            </h2>
            <ul className="space-y-2">
              {study.links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sea-700 hover:text-orange-600 underline underline-offset-4"
                  >
                    <Icon name="external" size={15} />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {relatedPublications.length > 0 && (
          <div className="mt-10">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-4">
              {ui.publicationsFromStudyHeading}
            </h2>
            <ul className="space-y-2">
              {relatedPublications.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/publications/${p.slug}`}
                    className="text-sea-700 hover:text-orange-600 underline underline-offset-4"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {others.length > 0 && (
        <Section tone="sunken">
          <h2 className="font-display text-2xl sm:text-3xl text-navy-900 mb-8">
            {ui.relatedWorkHeading}
          </h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {others.map((o) => (
              <CaseStudyCard key={o.slug} study={o} mediaMeta={mediaMeta} />
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import Section from '../../../../src/site/components/Section';
import CaseStudyCard from '../../../../src/site/components/CaseStudyCard';
import Icon from '../../../../src/components/Icon';
import { getCollection, getItem, getSingleton, getMediaMeta } from '../../../../src/lib/content';
import { publicationsForCaseStudy } from '../../../../src/lib/derive';
import Prose from '../../../../src/site/components/Prose';
import JourneyThread from '../../../../src/site/components/JourneyThread';
import { countLabel } from '../../../../src/lib/labels';

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

  // '[tbc]' marks copy still awaited from the team. The placeholder box is a
  // review-phase note: it shows only while review notes are on, and the step
  // drops out entirely once they are off, so the numbering never skips.
  const steps = sectionOrder
    .map((section) => ({ ...section, body: study.sections?.[section.key] }))
    .filter(({ body }) => body && (body !== '[tbc]' || showReviewNotes))
    .map((step) => ({ ...step, missing: step.body === '[tbc]' }));

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
              Method
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
        {/* No photograph here any more. Design feedback, 15 September 2026:
            the individual pages should be "short and clean, to make it clear
            that they are just a snapshot of our work". The image still fronts
            the study's card on the index and in related work. The journey
            shares this section, so no second band of padding opens a gap. */}

        <div className="max-w-[760px] mx-auto mt-14 lg:mt-16">
          {/* The four sections as one journey: numbered steps on a single
              thread, filling in as the reader moves down the page. */}
          <JourneyThread>
            {steps.map(({ key, label, body, missing }, i) => (
              <li key={key} data-step className="group relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 pb-6 last:pb-0 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-6 sm:pb-8">
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-5 top-10 bottom-0 w-0.5 -translate-x-1/2 overflow-hidden rounded-full bg-sea-500/25 sm:left-6 sm:top-12"
                  >
                    <span className="block h-full w-full origin-top scale-y-0 bg-orange-500 transition-transform duration-700 ease-out group-data-[reached=true]:scale-y-100 motion-reduce:transition-none" />
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-sea-500 bg-cream-50 font-mono text-xs font-bold text-navy-900 transition-colors duration-500 group-data-[reached=true]:border-orange-500 group-data-[reached=true]:bg-orange-500 group-data-[reached=true]:text-white sm:h-12 sm:w-12 sm:text-sm motion-reduce:transition-none"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 rounded-2xl border border-cream-300 bg-cream-100 p-5 sm:p-8">
                  <h2 className="font-display text-2xl sm:text-[1.75rem] leading-tight text-navy-900 sm:pt-0.5">{label}</h2>
                  {missing ? (
                    <p className="mt-4 border border-dashed border-cream-400 bg-cream-50/60 rounded-xl px-4 py-3 text-ink-500 italic">
                      <span className="not-italic font-mono text-[10px] uppercase tracking-[0.18em] text-orange-600 block mb-1">
                        {ui.awaitingCopyBadge}
                      </span>
                      This section is still awaited from the Jigsaw team.
                    </p>
                  ) : (
                    <Prose text={body} className="mt-4 text-[17px] text-ink-800 leading-[1.7]" />
                  )}
                </div>
              </li>
            ))}
          </JourneyThread>

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
        </div>
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

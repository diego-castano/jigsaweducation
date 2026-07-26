import Link from 'next/link';
import { notFound } from 'next/navigation';
import Section from '../../../../src/site/components/Section';
import CaseStudyCard from '../../../../src/site/components/CaseStudyCard';
import Icon from '../../../../src/components/Icon';
import { CASE_STUDIES } from '../../../../src/data/case-studies';
import { SERVICES } from '../../../../src/data/services';
import { publicationsForCaseStudy } from '../../../../src/data/relations';
import { SITE } from '../../../../src/data/site';

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: `/case-studies/${study.slug}` }
  };
}

// The brief fixes the same four sections on every case study page, in this
// order, so a reader who has seen one knows where to look on all of them.
const SECTION_ORDER = [
  { key: 'criticalQuestion', label: 'The critical question' },
  { key: 'collaboration', label: 'Collaboration' },
  { key: 'buildingEvidence', label: 'Building evidence' },
  { key: 'pathwaysToUptake', label: 'Pathways to evidence uptake' }
];

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) notFound();

  const service = SERVICES.find((s) => s.title === study.service);
  const relatedPublications = publicationsForCaseStudy(study.slug);
  const others = CASE_STUDIES.filter(
    (c) => c.slug !== study.slug && c.topics?.some((t) => study.topics?.includes(t))
  ).slice(0, 3);

  return (
    <>
      <Section width="default" className="pb-0">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-orange-600 transition-colors"
          >
            <Icon name="chevron-left" size={16} />
            All case studies
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
              {study.countries?.length === 1 ? 'Country' : 'Countries'}
            </dt>
            <dd className="text-navy-900">
              {study.countries?.length ? study.countries.join(', ') : <span className="text-ink-500 italic">Not specified</span>}
            </dd>
          </div>
          <div className="bg-cream-100 p-6">
            <dt className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-3">
              {study.partners?.length === 1 ? 'Partner' : 'Partners'}
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
                  className="block mt-2 text-sm text-sea-700 hover:text-orange-600 underline underline-offset-4"
                >
                  {service.title}
                </Link>
              )}
            </dd>
          </div>
        </dl>

        {study.image && (
          <div className="mt-10 aspect-[21/9] rounded-2xl overflow-hidden bg-cream-200">
            <img src={study.image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </Section>

      <Section width="narrow">
        <div className="space-y-12">
          {SECTION_ORDER.map(({ key, label }) => {
            const body = study.sections?.[key];
            if (!body) return null;
            const missing = body === '[tbc]';
            return (
              <div key={key}>
                <h2 className="font-display text-2xl sm:text-3xl text-navy-900 mb-4">{label}</h2>
                {missing ? (
                  <p className="border border-dashed border-cream-400 bg-cream-100/60 rounded-xl px-4 py-3 text-ink-500 italic">
                    <span className="not-italic font-mono text-[10px] uppercase tracking-[0.18em] text-orange-600 block mb-1">
                      Awaiting copy
                    </span>
                    The source page describes a partnership rather than a study, so there was nothing
                    to restructure here without inventing it.
                  </p>
                ) : (
                  <p className="text-lg text-ink-800 leading-[1.75]">{body}</p>
                )}
              </div>
            );
          })}
        </div>

        {study.isDerived && (
          <p className="mt-12 flex items-start gap-2.5 text-sm text-ink-600 bg-cream-100 border border-cream-300 rounded-xl p-4">
            <Icon name="info" size={16} className="mt-0.5 shrink-0 text-sea-600" />
            <span>
              Draft. This text was restructured from Jigsaw&rsquo;s existing case study into the
              four-section format the new brief specifies. It needs the team&rsquo;s approval before
              it publishes.
            </span>
          </p>
        )}

        {study.links?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-cream-300">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-4">
              Find out more
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
              Publications from this study
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
          <h2 className="font-display text-2xl sm:text-3xl text-navy-900 mb-8">Related work</h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {others.map((o) => (
              <CaseStudyCard key={o.slug} study={o} />
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}

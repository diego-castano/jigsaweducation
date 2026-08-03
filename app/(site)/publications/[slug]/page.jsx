import Link from 'next/link';
import { notFound } from 'next/navigation';
import Section from '../../../../src/site/components/Section';
import Placeholder from '../../../../src/site/components/Placeholder';
import PublicationCard from '../../../../src/site/components/PublicationCard';
import Icon from '../../../../src/components/Icon';
import { getSingleton, getCollection, getItem } from '../../../../src/lib/content';
import Prose from '../../../../src/site/components/Prose';
import { isPlaceholder } from '../../../../src/data/placeholder';

export async function generateStaticParams() {
  const publications = await getCollection('publications');
  return publications.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pub = await getItem('publications', slug);
  if (!pub) return {};
  return {
    title: pub.title,
    description: `${pub.type} from Jigsaw Education Evidence${pub.date ? `, ${pub.date}` : ''}. Free to download.`,
    alternates: { canonical: `/publications/${pub.slug}` }
  };
}

// A light template, deliberately. Answering the client's Site templates 01
// question: no, not every publication gets the long-form article page. That one
// is for pieces Jigsaw hosts and writes in full. Most publications are a PDF
// plus the metadata below.
export default async function PublicationPage({ params }) {
  const { slug } = await params;
  const [pub, site, ui, publications] = await Promise.all([
    getItem('publications', slug),
    getSingleton('site-settings'),
    getSingleton('ui-strings'),
    getCollection('publications')
  ]);
  if (!pub) notFound();

  const study = pub.caseStudySlug ? await getItem('case-studies', pub.caseStudySlug) : null;
  const related = publications.filter((p) => p.slug !== pub.slug && p.type === pub.type).slice(0, 2);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: pub.title,
    ...(pub.date ? { datePublished: pub.date } : {}),
    publisher: { '@type': 'Organization', name: site.legalName, url: site.url },
    url: `${site.url}/publications/${pub.slug}`,
    isAccessibleForFree: true
  };

  const meta = [
    { label: 'Type', value: pub.type },
    { label: 'Date', value: pub.date },
    { label: 'Region', value: pub.region },
    { label: 'Country', value: pub.countries?.join(', ') },
    { label: 'Method / service', value: pub.method },
    { label: 'Topic', value: pub.topic }
  ].filter((m) => m.value);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Section width="default">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-orange-600 transition-colors"
          >
            <Icon name="chevron-left" size={16} />
            {ui.breadcrumbPublications}
          </Link>
        </nav>

        <div className="grid lg:grid-cols-[1fr_300px] gap-10 lg:gap-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-4">
              {pub.type}
            </p>
            <h1 className="font-display display-m text-3xl sm:text-4xl lg:text-5xl text-navy-900 leading-[1.08]">
              {pub.title}
            </h1>

            <p className="mt-5 font-mono text-sm text-ink-600">
              {pub.authors || <span className="italic">{ui.authorsFallback}</span>}
              {' · '}
              {pub.date || <span className="italic">{ui.dateFallback}</span>}
            </p>

            <h2 className="font-display text-2xl text-navy-900 mt-12 mb-4">{ui.abstractHeading}</h2>
            {isPlaceholder(pub.abstract) ? (
              <Placeholder className="text-lg text-ink-800 leading-[1.75]">{pub.abstract}</Placeholder>
            ) : (
              <Prose text={pub.abstract} className="text-lg text-ink-800 leading-[1.75]" />
            )}

            <div className="flex flex-wrap gap-3 mt-10">
              {pub.pdf && (
                <a
                  href={pub.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold transition-colors"
                >
                  <Icon name="download" size={16} />
                  {pub.external ? ui.viewPublicationLabel : ui.downloadPdfLabel}
                  {pub.fileSize && <span className="font-normal opacity-80">({pub.fileSize})</span>}
                </a>
              )}
              {study && (
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-sea-500 text-sea-700 hover:bg-sea-50 rounded-full text-sm font-bold transition-colors"
                >
                  {ui.readMoreAboutStudy}
                  <Icon name="arrow-right" size={16} />
                </Link>
              )}
            </div>
          </div>

          <aside>
            <dl className="bg-cream-100 border border-cream-300 rounded-2xl divide-y divide-cream-300">
              {meta.map((m) => (
                <div key={m.label} className="px-5 py-4">
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-500 font-bold mb-1.5">
                    {m.label}
                  </dt>
                  <dd className="text-sm text-navy-900">{m.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="sunken">
          <h2 className="font-display text-2xl sm:text-3xl text-navy-900 mb-8">
            {ui.morePublicationsTemplate.replace('{type}', pub.type.toLowerCase())}
          </h2>
          <ul className="grid lg:grid-cols-2 gap-5">
            {related.map((p) => (
              <PublicationCard key={p.slug} pub={p} ui={ui} />
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}

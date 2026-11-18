import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHero from '../../../../src/site/components/PageHero';
import Section from '../../../../src/site/components/Section';
import Prose from '../../../../src/site/components/Prose';
import Icon from '../../../../src/components/Icon';
import { getSingleton, getCollection, getItem } from '../../../../src/lib/content';

export async function generateStaticParams() {
  const policies = await getCollection('policies');
  return policies.filter((p) => p.body).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const policy = await getItem('policies', slug);
  if (!policy?.body) return {};
  return {
    title: policy.title,
    ...(policy.summary ? { description: policy.summary } : {}),
    alternates: { canonical: `/policies/${policy.slug}` }
  };
}

export default async function PolicyPage({ params }) {
  const { slug } = await params;
  const [policy, page, ui] = await Promise.all([
    getItem('policies', slug),
    getSingleton('page-policies'),
    getSingleton('ui-strings')
  ]);
  if (!policy || !policy.body) notFound();

  return (
    <>
      <PageHero kicker={page.kicker} title={policy.title} lede={policy.summary} />

      <Section width="narrow">
        <div className="max-w-[68ch]">
          {policy.updated && (
            <p className="font-mono text-sm text-ink-600 mb-8">Last updated {policy.updated}</p>
          )}
          <Prose text={policy.body} className="text-lg text-ink-800 leading-[1.75]" />

          {policy.file && (
            <a
              href={policy.file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-10 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold transition-colors"
            >
              <Icon name="download" size={16} />
              {ui.downloadPdfLabel}
              {policy.fileSize && (
                <span className="font-normal opacity-80">
                  ({ui.pdfSizeTemplate.replace('{size}', policy.fileSize)})
                </span>
              )}
            </a>
          )}

          <nav aria-label="Breadcrumb" className="mt-12">
            <Link
              href="/policies"
              className="inline-flex items-center gap-2 py-2 -my-2 text-sm text-ink-600 hover:text-orange-600 transition-colors"
            >
              <Icon name="chevron-left" size={16} />
              {page.heading}
            </Link>
          </nav>
        </div>
      </Section>
    </>
  );
}

import Link from 'next/link';
import Section from '../../../src/site/components/Section';
import PageHero from '../../../src/site/components/PageHero';
import Prose from '../../../src/site/components/Prose';
import CrossLinks from '../../../src/site/components/CrossLinks';
import ServiceIndex from '../../../src/site/components/services/ServiceIndex';
import ServiceRow from '../../../src/site/components/services/ServiceRow';
import { getSingleton, getCollection } from '../../../src/lib/content';
import { pageMetadata } from '../../../src/lib/page-metadata';

export async function generateMetadata() {
  const page = await getSingleton('page-services');
  return pageMetadata(page, { canonical: '/approaches' });
}

export default async function ServicesPage() {
  const [page, ui, allServices, allCaseStudies] = await Promise.all([
    getSingleton('page-services'),
    getSingleton('ui-strings'),
    getCollection('services'),
    getCollection('case-studies')
  ]);

  const published = new Set(allCaseStudies.map((cs) => cs.slug));
  const services = allServices;
  // Plain seeds split on blank lines; console HTML stays whole in the columns.
  const paras = String(page.intro || '').includes('<') ? [] : String(page.intro || '').split(/\n\s*\n/);
  const [lede, ...rest] = paras;

  return (
    <>
      <PageHero
        title={page.heading}
        lede={paras.length > 0 ? lede : <Prose text={page.intro} className="space-y-0" />}
        more={rest.length > 0 ? rest.map((p) => <Prose key={p} text={p} className="space-y-0" />) : null}
        meta={page.countCaption}
      />

      <Section className="relative">
      <div className="relative grid gap-y-14 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start">
          <ServiceIndex services={services.map((s) => ({ slug: s.slug, title: s.title }))} />
          <p className="mt-6 text-sm text-ink-600">
            See also{' '}
            <Link href="/technical-focus" className="link-sweep py-1 text-sea-700 hover:text-orange-600">
              {page.seeAlsoFirstLabel}
            </Link>{' '}
            and{' '}
            <Link href="/team" className="link-sweep py-1 text-sea-700 hover:text-orange-600">
              {page.seeAlsoSecondLabel}
            </Link>
            .
          </p>
        </div>

        <div className="lg:col-span-9">
          {services.map((service, i) => (
            <ServiceRow key={service.slug} service={service} index={i} published={published} />
          ))}
        </div>
      </div>

      <div className="relative mt-20 lg:mt-28">
        <CrossLinks hrefs={['/technical-focus', '/distinctives', '/team']} ui={ui} />
      </div>
      </Section>
    </>
  );
}

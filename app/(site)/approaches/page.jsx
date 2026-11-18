import Link from 'next/link';
import Section from '../../../src/site/components/Section';
import Reveal from '../../../src/site/components/Reveal';
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
    <Section className="relative">
      {/* The clip lives on this wrapper, not on the section: an overflow other
          than visible on an ancestor of the rail would kill position: sticky. */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span
          className="blob"
          style={{ width: 520, height: 520, top: -240, right: -140, background: '#ffcca8', opacity: 0.35 }}
        />
      </span>

      <div className="relative">
        <Reveal>
          <h1 className="font-display display-xl text-5xl leading-[1.02] text-navy-900 sm:text-6xl lg:text-[4rem]">
            {page.heading}
          </h1>
        </Reveal>

        <Reveal delay={80}>
          {paras.length > 0 ? (
            <>
              <Prose text={lede} className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-700" />
              <div className="mt-4 grid max-w-5xl gap-4 lg:grid-cols-2 lg:gap-12">
                {rest.map((p) => (
                  <Prose key={p} text={p} className="text-base leading-relaxed text-ink-700" />
                ))}
              </div>
            </>
          ) : (
            <Prose text={page.intro} className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-700" />
          )}
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-8 border-t border-cream-300 pt-4 text-sm text-ink-500">{page.countCaption}</p>
        </Reveal>
      </div>

      <div className="relative mt-10 grid gap-y-14 lg:mt-14 lg:grid-cols-12 lg:gap-x-16">
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
  );
}

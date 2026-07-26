import Link from 'next/link';
import Section from '../../../src/site/components/Section';
import Reveal from '../../../src/site/components/Reveal';
import Placeholder from '../../../src/site/components/Placeholder';
import CrossLinks from '../../../src/site/components/CrossLinks';
import ServiceIndex from '../../../src/site/components/services/ServiceIndex';
import { SERVICES, SERVICES_INTRO } from '../../../src/data/services';
import { caseStudiesByService } from '../../../src/data/relations';

export const metadata = {
  title: 'Services',
  description:
    'Large-scale mixed-method studies, design-based and implementation research, research localisation and capacity strengthening, technical assistance and evidence synthesis, strategy and advisory, and embedded learning partnerships.',
  alternates: { canonical: '/services' }
};

export default function ServicesPage() {
  // Cross-references are resolved on the server; the client island only needs
  // the slug and title of each linked case study, not the whole record.
  const services = SERVICES.map((service) => ({
    slug: service.slug,
    title: service.title,
    icon: service.icon,
    summary: service.summary,
    caseStudies: caseStudiesByService(service.title).map((cs) => ({
      slug: cs.slug,
      title: cs.title
    }))
  }));

  return (
    <Section className="relative">
      {/* The clip lives on this wrapper, not on the section: an overflow other
          than visible on an ancestor of the rail would kill position: sticky. */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span
          className="blob"
          style={{
            width: 520,
            height: 520,
            top: -240,
            right: -140,
            background: '#ffcca8',
            opacity: 0.35
          }}
        />
      </span>

      <div className="relative grid gap-y-14 lg:grid-cols-12 lg:gap-x-16">
        {/* Left rail: the page's whole framing sits here and stays put while
            the index scrolls past it. Unsticks and stacks under lg. */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h1 className="font-display display-xl text-5xl leading-[1.02] text-navy-900 sm:text-6xl lg:text-[4rem]">
              Services
            </h1>
          </Reveal>

          <Reveal delay={80}>
            <Placeholder className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700">
              {SERVICES_INTRO}
            </Placeholder>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-10 border-t border-cream-300 pt-4 text-sm text-ink-500">
              Six ways of working
            </p>
            <p className="mt-3 text-sm text-ink-600">
              See also{' '}
              <Link href="/technical-focus" className="link-sweep text-sea-700 hover:text-orange-600">
                Technical focus
              </Link>{' '}
              and{' '}
              <Link href="/team" className="link-sweep text-sea-700 hover:text-orange-600">
                Team
              </Link>
              .
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <ServiceIndex services={services} />
        </div>
      </div>

      <div className="relative mt-20 lg:mt-28">
        <CrossLinks hrefs={['/technical-focus', '/distinctives', '/team']} />
      </div>
    </Section>
  );
}

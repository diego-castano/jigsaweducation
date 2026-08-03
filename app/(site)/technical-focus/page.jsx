import Section from '../../../src/site/components/Section';
import Placeholder from '../../../src/site/components/Placeholder';
import CrossLinks from '../../../src/site/components/CrossLinks';
import FocusMosaic from '../../../src/site/components/technical-focus/FocusMosaic';
import { getSingleton, getCollection } from '../../../src/lib/content';
import { caseStudiesByTopic } from '../../../src/lib/derive';

export async function generateMetadata() {
  const page = await getSingleton('page-technical-focus');
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: '/technical-focus' }
  };
}

export default async function TechnicalFocusPage() {
  const [page, ui, focusAreas, allCaseStudies] = await Promise.all([
    getSingleton('page-technical-focus'),
    getSingleton('ui-strings'),
    getCollection('technical-focus'),
    getCollection('case-studies')
  ]);

  // Cross-references are derived at render, and only the two fields the mosaic
  // needs cross into the client bundle.
  const areas = focusAreas.map((area) => ({
    slug: area.slug,
    title: area.title,
    icon: area.icon,
    spot: area.spot,
    summary: area.summary,
    caseStudies: caseStudiesByTopic(allCaseStudies, area.title).map((cs) => ({
      slug: cs.slug,
      title: cs.title
    }))
  }));

  return (
    <>
      {/* Compact opener: title and intro share one line of the grid so the
          mosaic starts high on the page. No kicker, no hero slab. */}
      <section className="border-b border-cream-300">
        <div className="mx-auto max-w-[1240px] px-6 pt-14 pb-10 sm:px-8 lg:px-10 lg:pt-20 lg:pb-14">
          <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
            <h1 className="reveal font-display display-l text-4xl leading-[1.02] text-navy-900 sm:text-5xl lg:col-span-5 lg:text-6xl">
              {page.heading}
            </h1>
            <Placeholder className="reveal reveal-2 mt-6 max-w-3xl text-lg leading-relaxed text-ink-700 sm:text-xl lg:col-span-6 lg:col-start-7 lg:mt-0">
              {page.intro}
            </Placeholder>
          </div>
        </div>
      </section>

      <Section>
        <p className="mb-6 text-sm text-ink-600">{page.instruction}</p>
        <FocusMosaic
          areas={areas}
          relatedCaseStudiesHeading={ui.relatedCaseStudiesHeading}
          relatedCaseStudiesEmpty={ui.relatedCaseStudiesEmpty}
        />
      </Section>

      <Section className="pt-0">
        <CrossLinks hrefs={['/services', '/distinctives', '/team']} ui={ui} />
      </Section>
    </>
  );
}

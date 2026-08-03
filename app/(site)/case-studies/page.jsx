import PageHero from '../../../src/site/components/PageHero';
import Section from '../../../src/site/components/Section';
import CaseStudyBrowser from '../../../src/site/components/CaseStudyBrowser';
import CrossLinks from '../../../src/site/components/CrossLinks';
import { getCollection, getSingleton } from '../../../src/lib/content';
import { caseStudyFacets } from '../../../src/lib/derive';

export async function generateMetadata() {
  const page = await getSingleton('page-case-studies');
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: '/case-studies' }
  };
}

export default async function CaseStudiesPage() {
  const [page, studies, ui] = await Promise.all([
    getSingleton('page-case-studies'),
    getCollection('case-studies'),
    getSingleton('ui-strings')
  ]);

  return (
    <>
      {/* The brief asks the lede to state plainly that these are indicative
          and not comprehensive, so nobody reads 17 entries as the whole
          portfolio. */}
      <PageHero kicker={page.kicker} title={page.heading} lede={page.lede} />

      <Section tone="sunken">
        <CaseStudyBrowser studies={studies} facets={caseStudyFacets(studies)} ui={ui} />
      </Section>

      <Section className="pt-0">
        <CrossLinks hrefs={['/services', '/technical-focus', '/publications']} ui={ui} />
      </Section>
    </>
  );
}

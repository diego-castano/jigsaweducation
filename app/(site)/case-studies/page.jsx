import PageHero from '../../../src/site/components/PageHero';
import Section from '../../../src/site/components/Section';
import CaseStudyBrowser from '../../../src/site/components/CaseStudyBrowser';
import CrossLinks from '../../../src/site/components/CrossLinks';
import { CASE_STUDIES } from '../../../src/data/case-studies';
import { caseStudyFacets } from '../../../src/data/relations';

export const metadata = {
  title: 'Case studies',
  description:
    'Indicative examples of Jigsaw’s work with partners including UNICEF, UNHCR, FCDO, Dubai Cares, the World Bank and EdTech Hub, across education technology, refugee education, teacher development and girls’ education.',
  alternates: { canonical: '/case-studies' }
};

// The brief asks the intro to state plainly that these are indicative and not
// comprehensive, so nobody reads 17 entries as the whole portfolio.
const INTRO =
  'These case studies are indicative of our work rather than a comprehensive record. Much of what we do is confidential and cannot be published. The examples here show the range of partners we work with, the methods we use, and the contexts we work in.';

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero kicker="Our work" title="Case studies" lede={INTRO} />

      <Section tone="sunken">
        <CaseStudyBrowser studies={CASE_STUDIES} facets={caseStudyFacets()} />
      </Section>

      <Section className="pt-0">
        <CrossLinks hrefs={['/services', '/technical-focus', '/publications']} />
      </Section>
    </>
  );
}

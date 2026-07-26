import { CASE_STUDIES } from './case-studies';
import { PUBLICATIONS } from './publications';
import { TEAM } from './team';

// Cross-references are derived, not stored twice. The brief asks each service
// and focus box to expand and link to its relevant case studies; keeping a
// hand-maintained slug list in three files would drift the first time someone
// retags a case study.

export const caseStudiesByService = (serviceTitle) =>
  CASE_STUDIES.filter((cs) => cs.service === serviceTitle);

export const caseStudiesByTopic = (topicTitle) =>
  CASE_STUDIES.filter((cs) => cs.topics?.includes(topicTitle));

export const caseStudyBySlug = (slug) => CASE_STUDIES.find((cs) => cs.slug === slug) || null;

export const publicationBySlug = (slug) => PUBLICATIONS.find((p) => p.slug === slug) || null;

export const publicationsForCaseStudy = (slug) =>
  PUBLICATIONS.filter((p) => p.caseStudySlug === slug);

export const teamMemberBySlug = (slug) => TEAM.find((p) => p.slug === slug) || null;

// Facet options for the Evidence Library, built from what actually exists
// rather than a fixed list. An empty facet is worse than a missing one.
export const publicationFacets = () => {
  const uniq = (xs) => [...new Set(xs.filter(Boolean))].sort();
  return {
    region: uniq(PUBLICATIONS.map((p) => p.region)),
    method: uniq(PUBLICATIONS.map((p) => p.method)),
    topic: uniq(PUBLICATIONS.map((p) => p.topic)),
    type: uniq(PUBLICATIONS.map((p) => p.type))
  };
};

export const caseStudyFacets = () => {
  const uniq = (xs) => [...new Set(xs.filter(Boolean))].sort();
  return {
    country: uniq(CASE_STUDIES.flatMap((c) => c.countries || [])),
    service: uniq(CASE_STUDIES.map((c) => c.service)),
    topic: uniq(CASE_STUDIES.flatMap((c) => c.topics || []))
  };
};

// Countries named across the case studies. The Home map's country list is
// [tbc] from the client; this is the verifiable floor.
export const countriesFromCaseStudies = () =>
  [...new Set(CASE_STUDIES.flatMap((c) => c.countries || []))].sort();

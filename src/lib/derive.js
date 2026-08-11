// Pure derivations over content arrays. The same logic as src/data/relations.js
// but parameterised: pages fetch collections through src/lib/content.js and
// pass them in, so these functions never touch the database or the seed files
// themselves. Cross-references stay derived, not stored twice - a hand-kept
// slug list in three documents would drift the first time someone retags a
// case study.

const uniq = (xs) => [...new Set(xs.filter(Boolean))].sort();

export const caseStudiesByService = (caseStudies, serviceTitle) =>
  (caseStudies || []).filter((cs) => cs.service === serviceTitle);

export const caseStudiesByTopic = (caseStudies, topicTitle) =>
  (caseStudies || []).filter((cs) => cs.topics?.includes(topicTitle));

export const publicationsForCaseStudy = (publications, caseStudySlug) =>
  (publications || []).filter((p) => p.caseStudySlug === caseStudySlug);

// Facet options built from what actually exists rather than a fixed list.
// An empty facet is worse than a missing one.
export const publicationFacets = (publications) => {
  const pubs = publications || [];
  // The brief names the filters "Region/Country · Method/service · Topic
  // specialism". Country rides with region as its own facet; Type is an extra
  // beyond the brief that earns its place by having values from day one.
  return {
    region: uniq(pubs.map((p) => p.region)),
    country: uniq(pubs.flatMap((p) => p.countries || [])),
    method: uniq(pubs.map((p) => p.method)),
    topic: uniq(pubs.map((p) => p.topic)),
    type: uniq(pubs.map((p) => p.type))
  };
};

export const caseStudyFacets = (caseStudies) => {
  const studies = caseStudies || [];
  return {
    country: uniq(studies.flatMap((c) => c.countries || [])),
    service: uniq(studies.map((c) => c.service)),
    topic: uniq(studies.flatMap((c) => c.topics || []))
  };
};

// Countries named across the case studies. The Home map's country list is
// [tbc] from the client; this is the verifiable floor.
export const countriesFromCaseStudies = (caseStudies) =>
  uniq((caseStudies || []).flatMap((c) => c.countries || []));

// Database items are addressed by slug; the seed fallback still carries the
// legacy `id` key on the one existing entry, so both are honoured.
export const getTestimonial = (testimonials, slug) =>
  (testimonials || []).find((t) => t.slug === slug || t.id === slug) || null;

// The classification vocabulary, in one place. Filter dropdowns, card
// metadata rows and detail-page summary boxes all label the same concepts;
// deriving every label from this map keeps them identical everywhere -
// which is also what search engines should see: one consistent vocabulary.

export const CLASSIFICATION_LABELS = {
  country: 'Country',
  countries: 'Countries',
  partner: 'Partner',
  partners: 'Partners',
  service: 'Service',
  method: 'Method',
  methodService: 'Method / service',
  topic: 'Topic',
  region: 'Region',
  type: 'Type',
  date: 'Date'
};

// Facet keys come from the data (country, service, topic, region, method,
// type); unknown keys degrade to title case rather than disappearing.
export const facetLabel = (key) =>
  CLASSIFICATION_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1);

// Singular/plural pair, e.g. countLabel('country', 2) -> 'Countries'.
export const countLabel = (singularKey, count) =>
  count === 1
    ? CLASSIFICATION_LABELS[singularKey]
    : CLASSIFICATION_LABELS[`${singularKey.replace(/y$/, 'ie')}s`] ||
      `${CLASSIFICATION_LABELS[singularKey]}s`;

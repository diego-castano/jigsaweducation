// The database seed, assembled from the same modules the pages read today.
// Singleton documents come from the schema `seed` values; collection items are
// the src/data arrays verbatim — the wiring phase depends on that equivalence,
// so nothing here renames or reshapes a field. The loaders in src/lib/content.js
// also use these objects as the fallback when Postgres is unreachable.

import { SINGLETONS, singletonSeedDoc } from './schema.js';
import { TEAM } from '../data/team.js';
import { CASE_STUDIES } from '../data/case-studies.js';
import { PUBLICATIONS } from '../data/publications.js';
import { SERVICES } from '../data/services.js';
import { TECHNICAL_FOCUS } from '../data/technical-focus.js';
import { DISTINCTIVES } from '../data/distinctives.js';
import { PARTNERS } from '../data/partners.js';
import { TESTIMONIALS } from '../data/testimonials.js';
import { JOBS } from '../data/jobs.js';
import { POLICIES, ADDITIONAL_POLICIES } from '../data/policies.js';

// Shared with the create-item action so admin-made slugs match seeded ones.
export const slugify = (value) =>
  String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const SINGLETON_SEEDS = Object.fromEntries(
  SINGLETONS.map((schema) => [schema.key, singletonSeedDoc(schema)])
);

// Array order is the published order, so sort is simply the index.
const items = (records, toSlug = (record) => record.slug) =>
  records.map((record, index) => {
    const { slug, ...data } = record;
    return { slug: toSlug(record), data, sort: index, status: 'published' };
  });

export const COLLECTION_SEEDS = {
  team: items(TEAM),
  'case-studies': items(CASE_STUDIES),
  publications: items(PUBLICATIONS),
  services: items(SERVICES),
  'technical-focus': items(TECHNICAL_FOCUS),
  distinctives: items(DISTINCTIVES),
  partners: items(PARTNERS, (partner) => slugify(partner.name)),

  // The legacy `id` becomes the slug; items are addressed by slug from here on.
  testimonials: TESTIMONIALS.map(({ id, ...data }, index) => ({
    slug: id,
    data,
    sort: index,
    status: 'published'
  })),

  jobs: items(JOBS),

  // One collection for both lists on the policies page: the brief's six carry
  // group 'core', the two already published carry group 'additional'.
  policies: items([
    ...POLICIES.map((policy) => ({ ...policy, group: 'core' })),
    ...ADDITIONAL_POLICIES.map((policy) => ({ ...policy, group: 'additional' }))
  ])
};

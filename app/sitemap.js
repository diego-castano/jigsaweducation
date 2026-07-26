import { SITE } from '../src/data/site';
import { TEAM } from '../src/data/team';
import { CASE_STUDIES } from '../src/data/case-studies';
import { PUBLICATIONS } from '../src/data/publications';

// The current site has no sitemap at all — jigsaweducation.org/sitemap.xml
// returns 404 and robots.txt is a single "#". Generated here so it can never
// drift from the routes that actually exist.
export default function sitemap() {
  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/technical-focus', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/distinctives', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/team', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/case-studies', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/publications', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/policies', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/work-for-us', priority: 0.5, changeFrequency: 'weekly' }
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE.url}${r.path}`,
      changeFrequency: r.changeFrequency,
      priority: r.priority
    })),
    ...TEAM.map((p) => ({
      url: `${SITE.url}/team/${p.slug}`,
      changeFrequency: 'yearly',
      priority: 0.6
    })),
    ...CASE_STUDIES.map((c) => ({
      url: `${SITE.url}/case-studies/${c.slug}`,
      changeFrequency: 'yearly',
      priority: 0.7
    })),
    ...PUBLICATIONS.map((p) => ({
      url: `${SITE.url}/publications/${p.slug}`,
      changeFrequency: 'yearly',
      priority: 0.7
    }))
  ];
}

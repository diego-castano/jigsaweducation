import { getSingleton, getCollection } from '../src/lib/content';

// The current site has no sitemap at all — jigsaweducation.org/sitemap.xml
// returns 404 and robots.txt is a single "#". Generated here from the live
// collections so it can never drift from the routes that actually exist.
export default async function sitemap() {
  const [settings, team, caseStudies, publications] = await Promise.all([
    getSingleton('site-settings'),
    getCollection('team'),
    getCollection('case-studies'),
    getCollection('publications')
  ]);

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
      url: `${settings.url}${r.path}`,
      changeFrequency: r.changeFrequency,
      priority: r.priority
    })),
    ...team.map((p) => ({
      url: `${settings.url}/team/${p.slug}`,
      changeFrequency: 'yearly',
      priority: 0.6
    })),
    ...caseStudies.map((c) => ({
      url: `${settings.url}/case-studies/${c.slug}`,
      changeFrequency: 'yearly',
      priority: 0.7
    })),
    ...publications.map((p) => ({
      url: `${settings.url}/publications/${p.slug}`,
      changeFrequency: 'yearly',
      priority: 0.7
    }))
  ];
}

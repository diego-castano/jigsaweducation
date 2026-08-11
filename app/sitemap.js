import { getSingleton, getCollection } from '../src/lib/content';

// The current site has no sitemap at all - jigsaweducation.org/sitemap.xml
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
    { path: '', key: 'page-home', priority: 1.0, changeFrequency: 'monthly' },
    { path: '/services', key: 'page-services', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/technical-focus', key: 'page-technical-focus', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/distinctives', key: 'page-distinctives', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/team', key: 'page-team', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/case-studies', key: 'page-case-studies', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/publications', key: 'page-publications', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/contact', key: 'page-contact', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/policies', key: 'page-policies', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/work-for-us', key: 'page-work-for-us', priority: 0.5, changeFrequency: 'weekly' }
  ];

  // A page hidden from search engines also leaves the sitemap - the two
  // signals must agree or crawlers get mixed messages.
  const pages = await Promise.all(staticRoutes.map((r) => getSingleton(r.key)));
  const visibleRoutes = staticRoutes.filter((r, i) => !pages[i]?.noIndex);

  return [
    ...visibleRoutes.map((r) => ({
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

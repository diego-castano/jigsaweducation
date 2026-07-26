import { SITE } from '../src/data/site';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The design system is a working document for the client, not content
        // anyone should reach from a search result.
        disallow: ['/design-system']
      }
    ],
    sitemap: `${SITE.url}/sitemap.xml`
  };
}

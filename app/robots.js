import { getSingleton } from '../src/lib/content';

export default async function robots() {
  const settings = await getSingleton('site-settings');
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
    sitemap: `${settings.url}/sitemap.xml`
  };
}

import './globals.css';
import { getSingleton } from '../src/lib/content';

export async function generateMetadata() {
  const [settings, tracking] = await Promise.all([
    getSingleton('site-settings'),
    getSingleton('tracking')
  ]);
  return {
    metadataBase: new URL(settings.url),
    ...(tracking.googleVerification
      ? { verification: { google: tracking.googleVerification.trim() } }
      : {}),
    title: {
      default: `${settings.name} — ${settings.tagline}`,
      template: `%s — ${settings.name}`
    },
    description: settings.description,
    openGraph: {
      type: 'website',
      siteName: settings.name,
      locale: 'en_GB',
      title: `${settings.name} — ${settings.tagline}`,
      description: settings.description
    },
    alternates: { canonical: '/' },
    robots: { index: true, follow: true }
  };
}

export const viewport = {
  themeColor: '#FDFAF4',
  width: 'device-width',
  initialScale: 1,
  // Lets the page draw into the notch/home-bar areas; the header, footer and
  // drawer pad themselves back out with env(safe-area-inset-*).
  viewportFit: 'cover'
};

export default async function RootLayout({ children }) {
  // Analytics snippets pasted into the admin. Empty by default, in which case
  // nothing renders at all — no empty script tags, no wrapper elements.
  const tracking = await getSingleton('tracking');
  const headSnippet = (tracking.headSnippet || '').trim();
  const bodySnippet = (tracking.bodySnippet || '').trim();

  // data-scroll-behavior tells Next the smooth scrolling in globals.css is
  // deliberate, so router navigations opt out without a console warning.
  return (
    <html lang="en-GB" data-scroll-behavior="smooth">
      <body>
        {headSnippet ? (
          <div hidden dangerouslySetInnerHTML={{ __html: headSnippet }} />
        ) : null}
        {children}
        {bodySnippet ? (
          <div hidden dangerouslySetInnerHTML={{ __html: bodySnippet }} />
        ) : null}
      </body>
    </html>
  );
}

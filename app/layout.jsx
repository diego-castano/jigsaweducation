import './globals.css';
import { SITE } from '../src/data/site';

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`
  },
  description: SITE.description,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_GB',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true }
};

export const viewport = {
  themeColor: '#FDFAF4',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}

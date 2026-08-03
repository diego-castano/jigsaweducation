import Link from 'next/link';
import SiteHeader from '../src/site/components/SiteHeader';
import { MobileNavProvider } from '../src/site/components/MobileNavContext';
import SiteFooter from '../src/site/components/SiteFooter';
import Icon from '../src/components/Icon';
import { getSingleton } from '../src/lib/content';

export async function generateMetadata() {
  const page = await getSingleton('page-not-found');
  return {
    title: page.title,
    ...(page.description ? { description: page.description } : {}),
    ...(page.ogImage ? { openGraph: { images: [{ url: page.ogImage }] } } : {}),
    robots: { index: false, follow: true }
  };
}

// Lives at the root rather than inside the (site) group so it also catches
// unmatched URLs outside it. Carries the chrome itself for that reason, so it
// fetches the chrome's settings itself too.
export default async function NotFound() {
  const [page, settings, ui] = await Promise.all([
    getSingleton('page-not-found'),
    getSingleton('site-settings'),
    getSingleton('ui-strings')
  ]);

  return (
    <MobileNavProvider>
      <SiteHeader
        mainNav={settings.mainNav}
        footerNav={settings.footerNav}
        offices={settings.offices}
        wordmarkSrc={settings.logoWordmark}
      />
      <main id="main">
        <section className="relative overflow-hidden">
          <span
            className="blob"
            style={{ width: 460, height: 460, top: -180, right: -120, background: '#ffb077' }}
            aria-hidden="true"
          />
          <div className="relative max-w-[760px] mx-auto px-6 py-24 lg:py-32 text-center">
            <p
              className="font-display text-7xl sm:text-8xl text-cream-400 leading-none"
              style={{ fontVariationSettings: "'opsz' 72" }}
            >
              {page.numeral}
            </p>
            <h1 className="font-display display-m text-3xl sm:text-4xl lg:text-5xl text-navy-900 mt-6 leading-tight">
              {page.heading}
            </h1>
            <p className="mt-5 text-lg text-ink-700">{page.lede}</p>

            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold transition-colors"
              >
                {page.ctaHomeLabel}
                <Icon name="arrow-right" size={16} />
              </Link>
              <Link
                href="/publications"
                className="inline-flex items-center gap-2 px-6 py-3 border border-sea-500 text-sea-700 hover:bg-sea-50 rounded-full text-sm font-bold transition-colors"
              >
                {page.ctaLibraryLabel}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-cream-400 text-ink-700 hover:bg-cream-100 rounded-full text-sm font-bold transition-colors"
              >
                {page.ctaContactLabel}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter
        mainNav={settings.mainNav}
        footerNav={settings.footerNav}
        offices={settings.offices}
        legalLine={settings.legalLine}
        exploreHeading={settings.footerExploreHeading}
        moreHeading={settings.footerMoreHeading}
        tagline={settings.tagline}
        linkedin={settings.linkedin}
        wordmarkSrc={settings.logoWordmark}
        ui={ui}
      />
    </MobileNavProvider>
  );
}

import SiteHeader from '../../src/site/components/SiteHeader';
import SiteFooter from '../../src/site/components/SiteFooter';
import MobileTabBar from '../../src/site/components/MobileTabBar';
import BackToTop from '../../src/site/components/BackToTop';
import { MobileNavProvider } from '../../src/site/components/MobileNavContext';
import { getSingleton } from '../../src/lib/content';

// Route group: every public page renders inside this chrome. /design-system
// sits outside it deliberately — it ships its own sidebar and splash.

// Structured data. The live site has none at all, which for an organisation
// with 18 named researchers and 17 case studies is free visibility left on the
// table. Organization is the minimum; Person and Article schemas follow on the
// team and publication routes.
const organisationSchema = (settings) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: settings.legalName,
  alternateName: settings.name,
  url: settings.url,
  description: settings.description,
  sameAs: [settings.linkedin],
  vatID: settings.vatNumber,
  address: (settings.offices || []).map((o) => ({
    '@type': 'PostalAddress',
    streetAddress: (o.address || []).slice(0, -1).join(', '),
    addressLocality: o.city,
    addressCountry: o.country
  })),
  email: settings.offices?.[0]?.email
});

export default async function SiteLayout({ children }) {
  const [settings, ui] = await Promise.all([
    getSingleton('site-settings'),
    getSingleton('ui-strings')
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // Serialising content the loaders returned, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema(settings)) }}
      />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <MobileNavProvider>
        <SiteHeader
          mainNav={settings.mainNav}
          footerNav={settings.footerNav}
          offices={settings.offices}
          wordmarkSrc={settings.logoWordmark}
        />
        {/* The wrapper's bottom padding keeps the footer's legal line clear of
            the fixed tab bar on mobile; from lg the bar is gone and so is it. */}
        <div className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0">
          <main id="main">{children}</main>
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
        </div>
        <MobileTabBar tabs={settings.tabBar} menuLabel={settings.tabBarMenuLabel} />
        <BackToTop />
      </MobileNavProvider>
    </>
  );
}

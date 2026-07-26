import SiteHeader from '../../src/site/components/SiteHeader';
import SiteFooter from '../../src/site/components/SiteFooter';
import MobileTabBar from '../../src/site/components/MobileTabBar';
import BackToTop from '../../src/site/components/BackToTop';
import { MobileNavProvider } from '../../src/site/components/MobileNavContext';
import { SITE, LEGAL, OFFICES } from '../../src/data/site';

// Route group: every public page renders inside this chrome. /design-system
// sits outside it deliberately — it ships its own sidebar and splash.

// Structured data. The live site has none at all, which for an organisation
// with 18 named researchers and 17 case studies is free visibility left on the
// table. Organization is the minimum; Person and Article schemas follow on the
// team and publication routes.
const organisationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.legalName,
  alternateName: SITE.name,
  url: SITE.url,
  description: SITE.description,
  sameAs: [SITE.linkedin],
  vatID: LEGAL.vatNumber,
  address: OFFICES.map((o) => ({
    '@type': 'PostalAddress',
    streetAddress: o.address.slice(0, -1).join(', '),
    addressLocality: o.city,
    addressCountry: o.country
  })),
  email: OFFICES[0].email
};

export default function SiteLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        // Serialising our own constant, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
      />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <MobileNavProvider>
        <SiteHeader />
        {/* The wrapper's bottom padding keeps the footer's legal line clear of
            the fixed tab bar on mobile; from lg the bar is gone and so is it. */}
        <div className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0">
          <main id="main">{children}</main>
          <SiteFooter />
        </div>
        <MobileTabBar />
        <BackToTop />
      </MobileNavProvider>
    </>
  );
}

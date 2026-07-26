import SiteHeader from '../../src/site/components/SiteHeader';
import SiteFooter from '../../src/site/components/SiteFooter';
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
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}

import PageHero from '../../../src/site/components/PageHero';
import Section from '../../../src/site/components/Section';
import PublicationBrowser from '../../../src/site/components/PublicationBrowser';
import CrossLinks from '../../../src/site/components/CrossLinks';
import Icon from '../../../src/components/Icon';
import { getSingleton, getCollection } from '../../../src/lib/content';
import { publicationFacets } from '../../../src/lib/derive';

export async function generateMetadata() {
  const page = await getSingleton('page-publications');
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: '/publications' }
  };
}

export default async function PublicationsPage() {
  const [page, settings, ui, publications] = await Promise.all([
    getSingleton('page-publications'),
    getSingleton('site-settings'),
    getSingleton('ui-strings'),
    getCollection('publications')
  ]);

  return (
    <>
      <PageHero kicker={page.kicker} title={page.heading} lede={page.intro} />

      {/* Site templates 02 feedback: "The publication cards are sitting on top
          of the same cream colour. Can the background box be lighter, so that
          they stand out more on top of it?" — the contrast is inverted instead:
          the surface goes one step darker so the cards lift off it. Making the
          cards lighter than cream-50 would have meant pure white, which is not
          in the palette. */}
      <Section tone="sunken">
        <PublicationBrowser
          publications={publications}
          facets={publicationFacets(publications)}
          perPage={page.itemsPerPage}
          ui={ui}
        />

        {settings.showReviewNotes && page.libraryNote && (
          <p className="mt-10 flex items-start gap-2.5 text-sm text-ink-600 bg-cream-100 border border-cream-300 rounded-xl p-4 max-w-3xl">
            <Icon name="info" size={16} className="mt-0.5 shrink-0 text-sea-600" />
            <span>
              These {publications.length} {page.libraryNote}
            </span>
          </p>
        )}
      </Section>

      <Section className="pt-0">
        <CrossLinks hrefs={['/case-studies', '/technical-focus', '/team']} ui={ui} />
      </Section>
    </>
  );
}

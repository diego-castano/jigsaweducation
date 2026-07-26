import PageHero from '../../../src/site/components/PageHero';
import Section from '../../../src/site/components/Section';
import PublicationBrowser from '../../../src/site/components/PublicationBrowser';
import CrossLinks from '../../../src/site/components/CrossLinks';
import Icon from '../../../src/components/Icon';
import { PUBLICATIONS, PUBLICATIONS_INTRO } from '../../../src/data/publications';
import { publicationFacets } from '../../../src/data/relations';

export const metadata = {
  title: 'Publications',
  description:
    'The Jigsaw evidence library: learning briefs, research reports, policy briefs and annual reviews authored or co-authored by our team. All free to download.',
  alternates: { canonical: '/publications' }
};

export default function PublicationsPage() {
  return (
    <>
      <PageHero kicker="Evidence library" title="Publications" lede={PUBLICATIONS_INTRO} />

      {/* Site templates 02 feedback: "The publication cards are sitting on top
          of the same cream colour. Can the background box be lighter, so that
          they stand out more on top of it?" — the contrast is inverted instead:
          the surface goes one step darker so the cards lift off it. Making the
          cards lighter than cream-50 would have meant pure white, which is not
          in the palette. */}
      <Section tone="sunken">
        <PublicationBrowser publications={PUBLICATIONS} facets={publicationFacets()} />

        <p className="mt-10 flex items-start gap-2.5 text-sm text-ink-600 bg-cream-100 border border-cream-300 rounded-xl p-4 max-w-3xl">
          <Icon name="info" size={16} className="mt-0.5 shrink-0 text-sea-600" />
          <span>
            These {PUBLICATIONS.length}{' '}
            outputs are what is public on the current site. The full library is expected to run to
            roughly 100 entries, fed from the team&rsquo;s log frame. Dates, authors and abstracts
            are missing from every publication today and will need filling before launch.
          </span>
        </p>
      </Section>

      <Section className="pt-0">
        <CrossLinks hrefs={['/case-studies', '/technical-focus', '/team']} />
      </Section>
    </>
  );
}

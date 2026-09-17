import Link from 'next/link';
import Section, { SectionHeading } from '../../src/site/components/Section';
import SignpostTrio from '../../src/site/components/SignpostTrio';
import HeroGlobe from '../../src/site/components/HeroGlobe';
import WorldMap from '../../src/site/components/WorldMap';
import PartnerLogoWall from '../../src/site/components/PartnerLogoWall';
import Placeholder from '../../src/site/components/Placeholder';
import Reveal from '../../src/site/components/Reveal';
import Icon from '../../src/components/Icon';
import { getSingleton, getCollection, getMediaMeta } from '../../src/lib/content';
import { pageMetadata } from '../../src/lib/page-metadata';
import { altFor, objectPositionFor } from '../../src/lib/media-meta';
import { countryCentroid } from '../../src/lib/country-centroid';

export async function generateMetadata() {
  const page = await getSingleton('page-home');
  return pageMetadata(page, { canonical: '/', absoluteTitle: true });
}

// Sentence 1 carries the headline. Splitting on the phrase rather than
// retyping it keeps the client's copy verbatim and in one place. If an edit
// ever loses the phrase, the headline renders whole and unstyled - no crash,
// no stray "undefined" on the end.
const ITALIC_PHRASE = 'education research';

// Four blocks, in the brief's order, and nothing else. The client rejected
// homepages that "do too much" by name, so extra sections need them to ask.
export default async function HomePage() {
  const [home, settings, ui, partners, mediaMeta] = await Promise.all([
    getSingleton('page-home'),
    getSingleton('site-settings'),
    getSingleton('ui-strings'),
    getCollection('partners'),
    getMediaMeta()
  ]);

  const headline = home.headline || '';
  const hasItalicPhrase = headline.includes(ITALIC_PHRASE);
  const [leadBefore, leadAfter] = hasItalicPhrase
    ? headline.split(ITALIC_PHRASE)
    : [headline, ''];

  const supportingSentences = (home.supportingSentences || []).map((row) => row.text);

  // Three field photographs, each pinned to the country it was taken in. The
  // country's centre is worked out here on the server, so the browser never
  // downloads the atlas for three points. A photo with no country still
  // shows; it simply has no thread.
  const heroPhotos = (home.heroPhotos || [])
    .filter((row) => row?.photo)
    .slice(0, 3)
    .map((row) => ({
      src: row.photo,
      alt: altFor(mediaMeta, row.photo),
      objectPosition: objectPositionFor(mediaMeta, row.photo),
      caption: row.caption || '',
      country: row.country?.name || '',
      coords: countryCentroid(row.country?.id),
      href: row.link || '/case-studies'
    }));

  // The document stores { country: { name, id }, office } rows; the map wants
  // flat { name, id, office } with STRING ids - world-atlas keys on them, and
  // a row without an id can never match, so it drops here rather than there.
  const mapCountries = (home.mapCountries || [])
    .filter((row) => row?.country?.id)
    .map(({ country, office }) => ({
      name: country.name,
      id: String(country.id),
      office: Boolean(office)
    }));

  return (
    <>
      {/* 1. The four core sentences beside the field photographs and the globe.
          The globe bleeds off the right edge by design; overflow-x-clip keeps
          it from ever pushing the page sideways.
          Type and spacing scale with the viewport's HEIGHT as well as its
          width. Design feedback, 15 September 2026, showed a Windows laptop
          (about 1270x650 CSS pixels) where the buttons fell below the fold
          and the old background globe sat on the sentences. Now the opening
          fits the first screen on short laptops and keeps its size on tall
          ones. */}
      <section className="relative overflow-x-clip">
        {/* The blob keeps its own clipper so it never widens the page. */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <span
            className="blob"
            style={{ width: 380, height: 380, top: -190, right: -120, background: '#ffcca8', opacity: 0.22 }}
          />
        </div>

        <div className="relative max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 pt-12 pb-16 lg:pt-[clamp(2.5rem,7vh,5.5rem)] lg:pb-[clamp(3rem,9vh,6rem)]">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 xl:gap-14 lg:items-center">
            {/* Left: the words */}
            <div className="lg:col-span-7">
              <h1 className="font-display display-xl text-navy-900 text-[2.5rem] sm:text-[3.5rem] lg:text-[clamp(2.75rem,min(8.6vh,5.4vw),4.25rem)] leading-[1.1] pb-1">
                {hasItalicPhrase ? (
                  <>
                    {leadBefore}
                    <em className="italic">{ITALIC_PHRASE}</em>
                    {leadAfter}
                  </>
                ) : (
                  headline
                )}
              </h1>

              {/* Sentences 2 to 4 as three measured lines, not a paragraph
                  stack. Hairline above each, staggered in. */}
              <div className="mt-10 lg:mt-[clamp(1.75rem,4.5vh,3rem)] max-w-xl">
                {supportingSentences.map((sentence, i) => (
                  <Reveal
                    key={sentence}
                    as="p"
                    delay={140 + i * 110}
                    className="border-t border-cream-300 pt-4 pb-5 lg:pt-[clamp(0.625rem,1.6vh,1rem)] lg:pb-[clamp(0.75rem,2vh,1.25rem)] text-lg sm:text-xl lg:text-[clamp(1.0625rem,2.6vh,1.375rem)] leading-[1.35] text-ink-700"
                  >
                    {sentence}
                  </Reveal>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-8 lg:mt-[clamp(1.25rem,3.5vh,2rem)]">
                <Link
                  href="/case-studies"
                  className="tactile group inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50"
                >
                  {home.primaryCtaLabel}
                  <Icon
                    name="arrow-right"
                    size={16}
                    className="transition-transform duration-[250ms] ease-out group-hover:translate-x-[6px]"
                  />
                </Link>
                <Link
                  href="/publications"
                  className="link-sweep inline-block py-3 text-sm font-bold text-sea-700 hover:text-orange-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
                >
                  {home.secondaryCtaLabel}
                </Link>
              </div>
              {/* Clay's quiet stat line: one mono row, not a badge strip, under the
                  buttons so the right-hand column stays all photographs.
                  Figures come from Settings → Organisation; the unit words
                  after them belong to this page. */}
              {/* The labels join their figures inside one expression so the
                  server HTML keeps the exact text nodes the static page had. */}
              <p className="mt-8 lg:mt-[clamp(1.25rem,3.5vh,2rem)] pt-4 border-t border-cream-300 max-w-xl font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
                {settings.years}{` ${home.statYearsLabel}`}
                <span className="text-cream-400 px-2" aria-hidden="true">/</span>
                {settings.assignments}{`+ ${home.statAssignmentsLabel}`}
                <span className="text-cream-400 px-2" aria-hidden="true">/</span>
                {settings.organisations}{`+ ${home.statOrganisationsLabel}`}
              </p>
            </div>

            {/* Right: three field photographs pinned to their countries on the
                globe. On desktop the stage is capped by the viewport height so
                it never runs past the first screen. */}
            <div className="lg:col-span-5">
              <HeroGlobe
                photos={heroPhotos}
                className="mx-auto w-full max-w-[520px] lg:max-w-none lg:mr-0 lg:w-[min(100%,calc((100svh-9rem)*0.943))]"
              />

            </div>
          </div>
        </div>
      </section>

      {/* 2. Three ways in, on the bold navy of the Distinctives stats banner */}
      <Section tone="navy">
        <SignpostTrio signposts={home.signposts} readMore={ui.readMore} />
      </Section>

      {/* 3. Where we work */}
      <Section tone="sunken">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10 lg:gap-16 items-center">
          <Reveal className="order-2 lg:order-1">
            <WorldMap
              countries={mapCountries}
              legendOffices={home.legendOfficesLabel}
              legendWorked={home.legendWorkedLabel}
            />
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading title={home.mapHeading} />
            <Placeholder className="mt-5 text-ink-700 leading-relaxed">{home.mapSummary}</Placeholder>
            <p className="mt-8 pt-4 border-t border-cream-300 font-mono text-[11px] leading-relaxed text-ink-500">
              <span className="text-navy-900">{mapCountries.length} countries shown.</span>
              {` ${home.mapNote}`}
            </p>
          </div>
        </div>
      </Section>

      {/* 4. Who we work with. The page's one kicker is spent here.
          Two aligned columns: heading left, the client's paragraph right -
          a single left-hung column left half the band empty. */}
      <Section>
        <div className="grid lg:grid-cols-12 gap-y-6 lg:gap-x-12 items-start">
          <div className="lg:col-span-5">
            <SectionHeading kicker={home.partnersKicker} title={home.partnersHeading} />
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-lg text-ink-700 leading-relaxed lg:pt-9">
            {home.partnersIntro}
          </p>
        </div>
        <div className="mt-12">
          <PartnerLogoWall
            partners={partners}
            pendingNote={settings.showReviewNotes ? home.partnerWallNote : null}
          />
        </div>
      </Section>
    </>
  );
}

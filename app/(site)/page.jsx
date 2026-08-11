import Link from 'next/link';
import Section, { SectionHeading } from '../../src/site/components/Section';
import SignpostTrio from '../../src/site/components/SignpostTrio';
import GlobeBackdrop from '../../src/site/components/GlobeBackdrop';
import WorldMap from '../../src/site/components/WorldMap';
import PartnerLogoWall from '../../src/site/components/PartnerLogoWall';
import Placeholder from '../../src/site/components/Placeholder';
import Reveal from '../../src/site/components/Reveal';
import Icon from '../../src/components/Icon';
import { getSingleton, getCollection, getMediaMeta } from '../../src/lib/content';
import { pageMetadata } from '../../src/lib/page-metadata';
import { altFor, objectPositionFor } from '../../src/lib/media-meta';

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
      {/* Blocks 1 and 2 share one positioning context so the globe can live
          uncropped behind both: it rises through the hero's bottom-left and
          keeps drifting behind the signpost band, on a parallax that lets it
          recede slower than the page. The signposts sit at z-10 with the page
          background showing the globe through their hairline gaps. Desktop
          only: on mobile the hero stacks and a background globe muddies type. */}
      <div className="relative">
        {/* The vertical mask is the legibility deal: the sphere runs at full
            presence through the hero and the seam, then dissolves under the
            signpost text zone so placeholder copy never fights dot matrix.
            The parallax drags the fade along with the globe, which keeps the
            crest visible into the band without ever sitting under words. */}
        <GlobeBackdrop
          parallax={0.22}
          officeCoords={(settings.offices || []).map((office) => office.coords)}
          className="absolute top-[440px] -left-72 z-0 hidden lg:block opacity-[0.5] [mask-image:linear-gradient(to_bottom,black_32%,transparent_72%)]"
        />

        {/* 1. The four core sentences, split hero */}
        <section className="relative">
          {/* The blob keeps its own clipper now that the section no longer
              crops: unclipped it would push the page sideways on the right. */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <span
              className="blob"
              style={{ width: 380, height: 380, top: -190, right: -120, background: '#ffcca8', opacity: 0.22 }}
            />
          </div>

        <div className="relative max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 pt-16 pb-16 lg:pt-24 lg:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left: the words */}
            <div className="lg:col-span-7">
              <h1 className="font-display display-xl text-navy-900 text-[2.5rem] sm:text-[3.5rem] lg:text-[4.25rem] leading-[1.1] pb-1">
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
              <div className="mt-10 lg:mt-12 max-w-xl">
                {supportingSentences.map((sentence, i) => (
                  <Reveal
                    key={sentence}
                    as="p"
                    delay={140 + i * 110}
                    className="border-t border-cream-300 pt-4 pb-5 text-lg sm:text-xl lg:text-[1.375rem] leading-[1.35] text-ink-700"
                  >
                    {sentence}
                  </Reveal>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-8">
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
            </div>

            {/* Right: the client's own field photo, duotone until you touch it */}
            <Reveal delay={220} className="lg:col-span-5 lg:pt-2">
              <Link
                href={home.heroPhotoLink}
                className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-200">
                  <img
                    src={home.heroPhoto}
                    alt={altFor(mediaMeta, home.heroPhoto)}
                    style={{ objectPosition: objectPositionFor(mediaMeta, home.heroPhoto) }}
                    decoding="async"
                    fetchPriority="high"
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.55] contrast-[1.05] transition-all duration-500 group-hover:grayscale-0 group-focus-within:grayscale-0 group-hover:scale-[1.02]"
                  />
                  <span
                    className="absolute inset-0 bg-navy-900 mix-blend-multiply opacity-25 transition-opacity duration-500 group-hover:opacity-0 group-focus-within:opacity-0"
                    aria-hidden="true"
                  />
                </div>
                <span className="flex items-start gap-2 mt-4 text-sm text-ink-600 group-hover:text-navy-900 transition-colors">
                  <span className="link-sweep">
                    {home.heroPhotoCredit}
                  </span>
                  <Icon name="arrow-up-right" size={14} className="mt-1 shrink-0" />
                </span>
              </Link>

              {/* Clay's quiet stat line: one mono row, not a badge strip.
                  Figures come from Settings → Organisation; the unit words
                  after them belong to this page. */}
              {/* The labels join their figures inside one expression so the
                  server HTML keeps the exact text nodes the static page had. */}
              <p className="mt-6 pt-4 border-t border-cream-300 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
                {settings.years}{` ${home.statYearsLabel}`}
                <span className="text-cream-400 px-2" aria-hidden="true">/</span>
                {settings.assignments}{`+ ${home.statAssignmentsLabel}`}
                <span className="text-cream-400 px-2" aria-hidden="true">/</span>
                {settings.organisations}{`+ ${home.statOrganisationsLabel}`}
              </p>
            </Reveal>
          </div>
        </div>
        </section>

        {/* 2. Three ways in - z-10 so the columns ride above the globe */}
        <Section className="relative z-10">
          <SignpostTrio signposts={home.signposts} readMore={ui.readMore} />
        </Section>
      </div>

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

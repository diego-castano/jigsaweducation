import Link from 'next/link';
import Section, { SectionHeading } from '../../src/site/components/Section';
import SignpostTrio from '../../src/site/components/SignpostTrio';
import GlobeBackdrop from '../../src/site/components/GlobeBackdrop';
import WorldMap from '../../src/site/components/WorldMap';
import PartnerLogoWall from '../../src/site/components/PartnerLogoWall';
import Placeholder from '../../src/site/components/Placeholder';
import Reveal from '../../src/site/components/Reveal';
import Icon from '../../src/components/Icon';
import { CORE_SENTENCES, MAP_SUMMARY, MAP_COUNTRIES } from '../../src/data/home';
import { PARTNERS_INTRO } from '../../src/data/partners';
import { TRACK_RECORD } from '../../src/data/site';

export const metadata = {
  // absolute, or the root layout's "%s — Jigsaw" template appends a second one.
  title: { absolute: 'Jigsaw — Rigorous evidence for lasting change in education' },
  description:
    'Jigsaw is an education research practice. We work globally and focus on countries with the biggest education challenges, building and using evidence to improve learning and strengthen education systems.',
  alternates: { canonical: '/' }
};

// The hero photo is the client's own, from the Voices of Refugee Youth study
// (co-researchers running a participatory activity, 2019). Photo policy: no
// stock, no invented imagery, so the one image on this page is one we can name.
const HERO_PHOTO =
  'https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/44/tile_fill_Dubai_Cares_-_ecubed_-_2019_-_participatory_activity.JPG';
const HERO_PHOTO_HREF = '/case-studies/voices-of-refugee-youth';

// Sentence 1 carries the headline. Splitting on the phrase rather than
// retyping it keeps the client's copy verbatim and in one place.
const [LEAD_SENTENCE, ...SUPPORTING_SENTENCES] = CORE_SENTENCES;
const ITALIC_PHRASE = 'education research';
const [LEAD_BEFORE, LEAD_AFTER] = LEAD_SENTENCE.split(ITALIC_PHRASE);

// Four blocks, in the brief's order, and nothing else. The client rejected
// homepages that "do too much" by name, so extra sections need them to ask.
export default function HomePage() {
  return (
    <>
      {/* 1. The four core sentences, split hero */}
      <section className="relative overflow-hidden">
        {/* The animated backdrop: a slow dotted globe rising from the hero's
            bottom-left, offices marked in orange, one arc between them.
            Placement is the lesson of two failed attempts: tucked behind the
            opaque photo only its edge slivers showed and it read as a flat
            blob. Here the dotted face is actually visible in the dead corner
            under the CTAs, cropped by the section edge like a horizon — and it
            hands off into the "Global reach" band below with motion the flat
            map deliberately does not have. Desktop only: on mobile the hero
            stacks and a background globe just muddies the type. */}
        <GlobeBackdrop className="absolute -bottom-[590px] -left-32 hidden lg:block opacity-[0.55]" />
        <span
          className="blob"
          style={{ width: 380, height: 380, top: -190, right: -120, background: '#ffcca8', opacity: 0.22 }}
          aria-hidden="true"
        />

        <div className="relative max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 pt-16 pb-16 lg:pt-24 lg:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left: the words */}
            <div className="lg:col-span-7">
              <h1 className="font-display display-xl text-navy-900 text-[2.5rem] sm:text-[3.5rem] lg:text-[4.25rem] leading-[1.1] pb-1">
                {LEAD_BEFORE}
                <em className="italic">{ITALIC_PHRASE}</em>
                {LEAD_AFTER}
              </h1>

              {/* Sentences 2 to 4 as three measured lines, not a paragraph
                  stack. Hairline above each, staggered in. */}
              <div className="mt-10 lg:mt-12 max-w-xl">
                {SUPPORTING_SENTENCES.map((sentence, i) => (
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
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50"
                >
                  See our work
                  <Icon
                    name="arrow-right"
                    size={16}
                    className="transition-transform duration-[250ms] ease-out group-hover:translate-x-[6px]"
                  />
                </Link>
                <Link
                  href="/publications"
                  className="link-sweep text-sm font-bold text-sea-700 hover:text-orange-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
                >
                  Evidence library
                </Link>
              </div>
            </div>

            {/* Right: the client's own field photo, duotone until you touch it */}
            <Reveal delay={220} className="lg:col-span-5 lg:pt-2">
              <Link
                href={HERO_PHOTO_HREF}
                className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-200">
                  <img
                    src={HERO_PHOTO}
                    alt=""
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
                    Voices of Refugee Youth, Pakistan and Rwanda
                  </span>
                  <Icon name="arrow-up-right" size={14} className="mt-1 shrink-0" />
                </span>
              </Link>

              {/* Clay's quiet stat line: one mono row, not a badge strip. */}
              <p className="mt-6 pt-4 border-t border-cream-300 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
                {TRACK_RECORD.years} years
                <span className="text-cream-400 px-2" aria-hidden="true">/</span>
                {TRACK_RECORD.assignments}+ assignments
                <span className="text-cream-400 px-2" aria-hidden="true">/</span>
                {TRACK_RECORD.organisations}+ organisations
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. Three ways in */}
      <Section>
        <SignpostTrio />
      </Section>

      {/* 3. Where we work */}
      <Section tone="sunken">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10 lg:gap-16 items-center">
          <Reveal className="order-2 lg:order-1">
            <WorldMap />
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading title="Global reach, local evidence" />
            <Placeholder className="mt-5 text-ink-700 leading-relaxed">{MAP_SUMMARY}</Placeholder>
            <p className="mt-8 pt-4 border-t border-cream-300 font-mono text-[11px] leading-relaxed text-ink-500">
              <span className="text-navy-900">{MAP_COUNTRIES.length} countries shown.</span> Drawn
              from our published case studies and not yet complete.
            </p>
          </div>
        </div>
      </Section>

      {/* 4. Who we work with. The page's one kicker is spent here.
          Two aligned columns: heading left, the client's paragraph right —
          a single left-hung column left half the band empty. */}
      <Section>
        <div className="grid lg:grid-cols-12 gap-y-6 lg:gap-x-12 items-start">
          <div className="lg:col-span-5">
            <SectionHeading kicker="Who we work with" title="Partners in building evidence" />
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-lg text-ink-700 leading-relaxed lg:pt-9">
            {PARTNERS_INTRO}
          </p>
        </div>
        <div className="mt-12">
          <PartnerLogoWall />
        </div>
      </Section>
    </>
  );
}

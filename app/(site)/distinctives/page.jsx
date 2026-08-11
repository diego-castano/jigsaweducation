import Link from 'next/link';
import { Fragment } from 'react';
import Section from '../../../src/site/components/Section';
import CrossLinks from '../../../src/site/components/CrossLinks';
import Placeholder from '../../../src/site/components/Placeholder';
import Reveal from '../../../src/site/components/Reveal';
import CountUp from '../../../src/site/components/distinctives/CountUp';
import { getSingleton, getCollection } from '../../../src/lib/content';
import { pageMetadata } from '../../../src/lib/page-metadata';
import { getTestimonial } from '../../../src/lib/derive';
import Prose from '../../../src/site/components/Prose';
import { isPlaceholder } from '../../../src/data/placeholder';

// The story stays a visible placeholder until real copy lands; once written
// (possibly formatted in the console) it renders as prose.
const StoryBody = ({ text }) =>
  isPlaceholder(text) ? (
    <Placeholder className="mt-6 text-lg text-ink-700 leading-relaxed">{text}</Placeholder>
  ) : (
    <Prose text={text} className="mt-6 text-lg text-ink-700 leading-relaxed" />
  );

export async function generateMetadata() {
  const page = await getSingleton('page-distinctives');
  return pageMetadata(page, { canonical: '/distinctives' });
}

// Text alternates side down the column so the five rows never settle into a
// list. Strict alternation keeps it under the two-consecutive limit; the
// watermark numeral always takes the opposite edge and is cropped by it.
const ROW_SIDES = ['left', 'right', 'left', 'right', 'left'];

// Sets one phrase of a client paragraph in italic without altering a character
// of it: the string is split on an exact substring and rejoined around an <em>.
// If the phrase ever moves, this falls back to the plain string.
function withItalic(text, phrase) {
  const at = text.indexOf(phrase);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <em>{phrase}</em>
      {text.slice(at + phrase.length)}
    </>
  );
}

// Same substring discipline, for links: the brief annotates paragraph three
// with "[link to each relevant page]", so the client's own phrases become the
// anchors to Services and Technical focus. Segments are matched exactly and
// never retyped; a phrase that stops matching simply renders as plain text.
function withInlineLinks(node, links) {
  let parts = [node];
  for (const { phrase, href } of links) {
    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return [part];
      const at = part.indexOf(phrase);
      if (at === -1) return [part];
      return [
        part.slice(0, at),
        <Link
          key={href}
          href={href}
          className="link-sweep text-navy-900 underline decoration-orange-300 decoration-2 underline-offset-[6px] hover:decoration-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
        >
          {phrase}
        </Link>,
        part.slice(at + phrase.length)
      ];
    });
  }
  return parts;
}

function DistinctiveRow({ index, side, title, summary }) {
  const numeral = String(index + 1).padStart(2, '0');
  const textCol =
    side === 'left'
      ? 'col-span-12 lg:col-span-7 lg:col-start-1'
      : 'col-span-12 lg:col-span-7 lg:col-start-6';

  return (
    <Reveal as="li" delay={40} className="group border-t border-cream-300">
      <div className="row-sweep" style={{ '--sweep': 'var(--color-cream-100)' }}>
        <div className="relative overflow-hidden py-11 lg:py-16">
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute top-1/2 select-none font-display leading-none text-cream-300 text-[104px] sm:text-[150px] lg:text-[200px] transition-colors duration-500 motion-reduce:transition-none group-hover:text-orange-500 ${
              side === 'left' ? 'right-0' : 'left-0'
            }`}
            style={{
              fontVariationSettings: "'opsz' 72",
              transform: side === 'left' ? 'translate(0.12em, -50%)' : 'translate(-0.12em, -50%)'
            }}
          >
            {numeral}
          </span>

          <div className="relative grid grid-cols-12 gap-x-6">
            <div
              className={`${textCol} transition-transform duration-[350ms] ease-[var(--ease-emphasized)] motion-reduce:transition-none group-hover:translate-x-2`}
            >
              <h3 className="font-display display-s text-2xl sm:text-3xl lg:text-[38px] text-navy-900 leading-[1.15] max-w-[24ch]">
                {title}
              </h3>
              <Placeholder className="mt-5 text-base lg:text-lg text-ink-700 leading-relaxed max-w-[58ch]">
                {summary}
              </Placeholder>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default async function DistinctivesPage() {
  const [page, settings, ui, distinctives, testimonials] = await Promise.all([
    getSingleton('page-distinctives'),
    getSingleton('site-settings'),
    getSingleton('ui-strings'),
    getCollection('distinctives'),
    getCollection('testimonials')
  ]);

  const { introOne, introTwo, introThree } = page;
  const crisisStats = page.crisisStats || [];
  const storyMilestones = page.storyMilestones || [];
  const showReviewNotes = Boolean(settings.showReviewNotes);
  const testimonial = getTestimonial(testimonials, page.testimonialSlug);

  return (
    <>
      {/* Opener. Two columns, no kicker: the h1 and the client's first
          paragraph carry the left, paragraph two runs as a set-in column on
          the right and drops to the baseline so the block reads as a spread. */}
      <section className="relative overflow-hidden border-b border-cream-300">
        <span
          className="blob"
          style={{ width: 520, height: 520, top: -260, right: -160, background: '#ffcca8', opacity: 0.3 }}
          aria-hidden="true"
        />

        <div className="relative max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 pt-14 pb-14 lg:pt-20 lg:pb-20">
          <div className="grid lg:grid-cols-12 gap-y-9 lg:gap-x-12">
            <div className="lg:col-span-7">
              <Reveal>
                <h1 className="font-display display-xl text-5xl sm:text-6xl lg:text-[86px] text-navy-900 leading-[0.95]">
                  {page.heading}
                </h1>
              </Reveal>
              <Reveal delay={90}>
                <p className="mt-7 lg:mt-9 text-xl sm:text-2xl text-ink-800 leading-[1.45] max-w-[36ch] sm:max-w-[42ch]">
                  {introOne}
                </p>
              </Reveal>
            </div>

            <Reveal
              delay={180}
              className="lg:col-span-4 lg:col-start-9 lg:self-end lg:border-l lg:border-cream-300 lg:pl-10"
            >
              <p className="text-base sm:text-lg text-ink-700 leading-relaxed">{introTwo}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats band. Full-bleed navy, hairline-divided, counting up on first
          reveal. The citation gap is a single mono line, not a dashed box. */}
      <section className="bg-navy-900 text-cream-50">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 py-14 lg:py-20">
          <ul className="grid sm:grid-cols-3 gap-y-10">
            {crisisStats.map((stat, i) => (
              <Reveal
                as="li"
                key={stat.value}
                delay={i * 110}
                className={`sm:px-8 sm:first:pl-0 sm:last:pr-0 ${
                  i > 0 ? 'sm:border-l sm:border-navy-700' : ''
                }`}
              >
                <span
                  className="font-display block text-6xl lg:text-7xl leading-none"
                  style={{ fontVariationSettings: "'opsz' 72", fontVariantNumeric: 'tabular-nums' }}
                >
                  <CountUp value={stat.value} duration={1400 + i * 200} />
                  <span className="text-orange-400">{stat.unit}</span>
                </span>
                <span className="block mt-5 text-sm lg:text-base text-cream-200 leading-relaxed max-w-[32ch]">
                  {stat.label}
                </span>
              </Reveal>
            ))}
          </ul>

          {(page.statsCitation || showReviewNotes) && (
            <p className="mt-12 pt-5 border-t border-navy-800 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-navy-200">
              {page.statsCitation ? (
                <>
                  Source:{' '}
                  <a
                    className="link-sweep focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 rounded-sm"
                    href={page.statsCitation}
                  >
                    {page.statsCitation}
                  </a>
                </>
              ) : (
                'Citation URL to come from the Jigsaw team. Figures should not publish unsourced.'
              )}
            </p>
          )}
        </div>
      </section>

      {/* Editorial moment: paragraph three at display size, the preamble
          running under it in two columns. One surface step off the rows. */}
      <section className="bg-cream-100 border-b border-cream-300">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 py-16 lg:py-20">
          <Reveal>
            {/* The brief marks this paragraph "[link to each relevant page]":
                the client's own phrases anchor to Services and Technical
                focus, and the italic accent rides on the remaining text. */}
            <p className="font-display display-s text-2xl sm:text-3xl lg:text-[40px] text-navy-900 leading-[1.25] max-w-[30ch] sm:max-w-[46ch] lg:max-w-[52ch]">
              {withInlineLinks(introThree, [
                { phrase: 'suite of bespoke services', href: '/services' },
                { phrase: 'technical areas', href: '/technical-focus' }
              ]).map((part, i) =>
                typeof part === 'string' ? (
                  <Fragment key={i}>{withItalic(part, 'bend the curve of progress')}</Fragment>
                ) : (
                  part
                )
              )}
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10 lg:mt-14 lg:columns-2 lg:gap-14">
            <p className="text-base lg:text-[17px] text-ink-700 leading-relaxed">
              {page.preamble}
            </p>
          </Reveal>
        </div>
      </section>

      {/* The five distinctives. Full-width rows, hairlines only, watermark
          numerals cropped by the row edge, with the IDRC quote breaking the
          run between the third and the fourth. */}
      <section>
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 pt-16 lg:pt-24">
          <Reveal>
            <h2 className="font-display display-m text-3xl sm:text-4xl lg:text-5xl text-navy-900 leading-[1.05]">
              {page.rowsHeading}
            </h2>
          </Reveal>
        </div>

        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 mt-10 lg:mt-14">
          <ol>
            {distinctives.slice(0, 3).map((d, i) => (
              <DistinctiveRow
                key={d.slug}
                index={i}
                side={ROW_SIDES[i]}
                title={d.title}
                summary={d.summary}
              />
            ))}
          </ol>
        </div>

        {testimonial && (
          <figure className="bg-cream-200 border-y border-cream-300 py-16 lg:py-24">
            <blockquote className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10">
              <Reveal>
                <p className="font-display display-s italic text-2xl sm:text-3xl lg:text-[40px] text-navy-900 leading-[1.22] max-w-[30ch] sm:max-w-[40ch] lg:max-w-[46ch]">
                  {testimonial.quote}
                </p>
              </Reveal>
            </blockquote>
            <figcaption className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 mt-8 font-mono text-xs tracking-[0.18em] uppercase text-ink-600">
              <span
                className="inline-block align-middle w-8 h-px bg-orange-500 mr-3"
                aria-hidden="true"
              />
              {testimonial.attribution}
            </figcaption>
          </figure>
        )}

        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10">
          <ol start={4}>
            {distinctives.slice(3).map((d, i) => (
              <DistinctiveRow
                key={d.slug}
                index={i + 3}
                side={ROW_SIDES[i + 3]}
                title={d.title}
                summary={d.summary}
              />
            ))}
          </ol>
        </div>
      </section>

      {/* Our story - the About page content the new sitemap left homeless.
          Linked from the Home signpost, which is the only route a visitor
          looking for "about us" has left. The #our-story id is load-bearing. */}
      <Section id="our-story" className="scroll-mt-24 border-t border-cream-300">
        <div className="grid lg:grid-cols-12 gap-y-10 lg:gap-x-14">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="font-display display-m text-3xl sm:text-4xl lg:text-5xl text-navy-900 leading-[1.05]">
                {page.storyHeading}
              </h2>
              <StoryBody text={page.storyBody} />
            </Reveal>

            {showReviewNotes && page.foundingDateNote && (
              <Reveal delay={120}>
                <p className="mt-8 pt-5 border-t border-cream-300 font-mono text-[11px] leading-relaxed text-ink-500">
                  {page.foundingDateNote}
                </p>
              </Reveal>
            )}
          </div>

          {/* Timeline rail. The hairline is a sibling of the list, not a child
              of it: an <ol> takes list items and nothing else. */}
          <div className="relative lg:col-span-6 lg:col-start-7">
            <span
              className="absolute left-[3px] top-3 bottom-3 w-px bg-cream-300"
              aria-hidden="true"
            />
            <ol>
              {storyMilestones.map((milestone, i) => (
                <Reveal
                  as="li"
                  key={i}
                  delay={i * 90}
                  className="relative pl-8 lg:pl-10 pb-9 last:pb-0"
                >
                  <span
                    className="absolute left-0 top-[7px] w-[7px] h-[7px] rounded-full bg-orange-500"
                    aria-hidden="true"
                  />
                  <span className="inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500 border-b border-dashed border-cream-400 pb-px">
                    {milestone.year || 'Year tbc'}
                  </span>
                  <Placeholder className="mt-3 text-base text-ink-700 leading-relaxed max-w-[52ch]">
                    {milestone.text}
                  </Placeholder>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section>
        <CrossLinks hrefs={['/services', '/technical-focus', '/team']} ui={ui} />
      </Section>
    </>
  );
}

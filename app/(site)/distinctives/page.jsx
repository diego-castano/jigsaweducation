import Link from 'next/link';
import { Fragment } from 'react';
import Section from '../../../src/site/components/Section';
import PageHero from '../../../src/site/components/PageHero';
import CrossLinks from '../../../src/site/components/CrossLinks';
import Reveal from '../../../src/site/components/Reveal';
import CountUp from '../../../src/site/components/distinctives/CountUp';
import { getSingleton, getCollection } from '../../../src/lib/content';
import { pageMetadata } from '../../../src/lib/page-metadata';
import Prose from '../../../src/site/components/Prose';

export async function generateMetadata() {
  const page = await getSingleton('page-distinctives');
  return pageMetadata(page, { canonical: '/distinctives' });
}

// Text alternates side down the column so the five rows never settle into a
// list. Strict alternation keeps it under the two-consecutive limit; the
// watermark numeral always takes the opposite edge.
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
// anchors to Approaches and Technical focus. Segments are matched exactly and
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
        <div className="relative py-11 lg:py-16">
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 select-none font-display leading-none text-cream-300 lg:block lg:text-[200px] transition-colors duration-500 motion-reduce:transition-none lg:group-hover:text-orange-500 ${
              side === 'left' ? 'right-0' : 'left-0'
            }`}
            style={{ fontVariationSettings: "'opsz' 72" }}
          >
            {numeral}
          </span>

          <div className="relative grid grid-cols-12 gap-x-6">
            <div
              className={`${textCol} transition-transform duration-[350ms] ease-[var(--ease-emphasized)] motion-reduce:transition-none lg:group-hover:translate-x-2`}
            >
              <span
                aria-hidden="true"
                className="mb-2 block font-display text-[56px] leading-none text-orange-500 lg:hidden"
                style={{ fontVariationSettings: "'opsz' 72" }}
              >
                {numeral}
              </span>
              <h3 className="font-display display-s text-2xl sm:text-3xl lg:text-[38px] text-navy-900 leading-[1.15] max-w-[30ch]">
                {title}
              </h3>
              <Prose
                text={summary}
                className="mt-5 max-w-[62ch] text-base lg:text-lg text-ink-700 leading-relaxed [&>p:first-child]:text-[19px] lg:[&>p:first-child]:text-[21px] [&>p:first-child]:leading-relaxed [&>p:first-child]:text-navy-900 [&>p:first-child]:font-normal [&_p+p]:mt-5"
              />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default async function DistinctivesPage() {
  const [page, ui, distinctives] = await Promise.all([
    getSingleton('page-distinctives'),
    getSingleton('ui-strings'),
    getCollection('distinctives')
  ]);

  const { introOne, introTwo, introThree } = page;
  const crisisStats = page.crisisStats || [];

  return (
    <>
      <PageHero title={page.heading} lede={introOne} more={<p>{introTwo}</p>} />

      {/* Stats band. Full-bleed navy, hairline-divided, counting up on first
          reveal. The citation gap is a single mono line, not a dashed box. */}
      <section className="bg-navy-900 text-cream-50">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 py-14 lg:py-20">
          <ul className="grid sm:grid-cols-2 gap-y-10">
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
                {stat.source && (
                  <span className="block mt-2 font-mono text-[11px] tracking-[0.04em] text-navy-200">
                    Source: {stat.source}
                  </span>
                )}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Editorial moment: paragraph three at display size, the preamble
          running under it in one capped column. One surface step off the rows. */}
      <section className="bg-cream-100 border-b border-cream-300">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 py-16 lg:py-20">
          <Reveal>
            {/* The brief marks this paragraph "[link to each relevant page]":
                the client's own phrases anchor to Approaches and Technical
                focus, and the italic accent rides on the remaining text. */}
            <p className="font-display display-s text-2xl sm:text-3xl lg:text-[40px] text-navy-900 leading-[1.25] max-w-[30ch] sm:max-w-[46ch] lg:max-w-[52ch]">
              {withInlineLinks(introThree, [
                { phrase: 'suite of bespoke services', href: '/approaches' },
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
          <Reveal delay={120} className="mt-10 lg:mt-14">
            <p className="max-w-[65ch] text-base lg:text-[17px] text-ink-700 leading-relaxed">
              {page.preamble}
            </p>
          </Reveal>
        </div>
      </section>

      {/* The five distinctives. Full-width rows, hairlines only, watermark
          numerals set whole beside the text. */}
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

        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 mt-10 lg:mt-14">
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

      <Section>
        <CrossLinks hrefs={['/approaches', '/technical-focus', '/team']} ui={ui} />
      </Section>
    </>
  );
}

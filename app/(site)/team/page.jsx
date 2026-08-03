import Link from 'next/link';
import Icon from '../../../src/components/Icon';
import Section from '../../../src/site/components/Section';
import Reveal from '../../../src/site/components/Reveal';
import TeamCard from '../../../src/site/components/TeamCard';
import CrossLinks from '../../../src/site/components/CrossLinks';
import { getCollection, getSingleton } from '../../../src/lib/content';

export async function generateMetadata() {
  const page = await getSingleton('page-team');
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: '/team' }
  };
}

// The client's paragraph is stored as two fields: introLead carries everything
// up to the closing sentence, and contractorsSentence carries that sentence on
// its own. Joined with a single space they reassemble the verbatim paragraph
// from the brief. The closing sentence is about people who are not in the
// grid, so reading it above eighteen faces sets up an expectation the grid
// then contradicts — it renders in the band under the grid instead, carrying
// the two links that sentence implies. If the sentence field is ever emptied,
// the band simply disappears rather than printing a blank.

// Soft masonry. Three columns on large screens, each one dropped a little
// further than the last so eighteen portraits stop reading as a spreadsheet.
// The offset is `top`, not margin: margin would grow the grid row and punch a
// hole under the columns that were not offset, and it is not a transform, so
// it cannot fight the translate that <Reveal> animates. Column order is the
// alphabetical order of the array and nothing else: no card is bigger,
// earlier or brighter than any other, because ranking eighteen colleagues by
// tile size is an editorial claim nobody asked us to make. The list items are
// flex containers so every card fills the height of its row.
const COLUMN_OFFSET = ['', 'lg:relative lg:top-10', 'lg:relative lg:top-20'];

export default async function TeamPage() {
  const [page, team, ui] = await Promise.all([
    getSingleton('page-team'),
    getCollection('team'),
    getSingleton('ui-strings')
  ]);

  const introTail = page.contractorsSentence || null;

  return (
    <>
      {/* Opener. Two columns settling on a shared baseline: the name of the
          page on the left with one quiet line of real figures under it, the
          client's paragraph running as a set-in column on the right. No
          kicker, no hero slab. */}
      <section className="relative overflow-hidden border-b border-cream-300">
        <span
          className="blob"
          style={{
            width: 480,
            height: 480,
            top: -240,
            right: -140,
            background: '#ffcca8',
            opacity: 0.24
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1240px] px-6 pt-14 pb-12 sm:px-8 lg:px-10 lg:pt-20 lg:pb-16">
          <div className="grid gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-12">
            <div className="lg:col-span-5">
              <Reveal>
                <h1 className="font-display display-xl text-5xl leading-[0.95] text-navy-900 sm:text-6xl lg:text-[76px]">
                  {page.heading}
                </h1>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-7 border-t border-cream-300 pt-5 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-ink-600">
                  {`${team.length} ${page.statSuffix}`}
                </p>
              </Reveal>
            </div>

            <Reveal delay={70} className="lg:col-span-6 lg:col-start-7 lg:self-end">
              <p className="max-w-[54ch] text-lg leading-[1.5] text-ink-700 sm:text-xl lg:text-[22px]">
                {page.introLead}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Section>
        {/* The live site lists all 18 names inside a single <h1> with no other
            heading in the document, so none of them are headings at all. Here
            each person's name is an h2 inside a real list. */}
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:gap-x-8 lg:pb-20">
          {team.map((person, i) => (
            <Reveal
              as="li"
              key={person.slug}
              delay={(i % 3) * 90}
              className={`flex ${COLUMN_OFFSET[i % 3]}`}
            >
              <TeamCard person={person} />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Everyone the grid cannot show. The sentence is the client's, lifted
          out of the intro rather than duplicated, and it earns its place here
          by pointing at the two routes a reader wants next. Hairline above,
          no panel: the band is a row in the same stack as CrossLinks. */}
      {introTail && (
        <section className="border-t border-cream-300">
          {/* The sweep belongs to the words but has to answer to the whole
              link, otherwise it stays dark when the pointer or the keyboard
              lands on the arrow. Reduced motion already kills the transition
              in globals.css, so this only ever snaps. */}
          <style>{
            '.team-band-link:hover .link-sweep::after,' +
            '.team-band-link:focus-visible .link-sweep::after' +
            '{transform:scaleX(1);transform-origin:left}'
          }</style>

          <div className="mx-auto max-w-[1240px] px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
            <div className="grid gap-y-7 lg:grid-cols-12 lg:items-center lg:gap-x-12">
              <Reveal className="lg:col-span-7">
                <p className="max-w-[56ch] text-lg leading-relaxed text-ink-700 lg:text-xl">
                  {introTail}
                </p>
              </Reveal>

              <Reveal
                delay={110}
                className="flex flex-col gap-4 lg:col-span-4 lg:col-start-9 lg:items-end"
              >
                <Link
                  href="/work-for-us"
                  className="team-band-link group inline-flex items-center gap-2 py-1.5 rounded-sm font-display text-xl text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50 lg:text-2xl"
                >
                  {/* The sweep sits on the words, not on the whole flex box,
                      so the rule stops where the sentence stops. */}
                  <span className="link-sweep">{page.workWithUsLabel}</span>
                  <Icon
                    name="arrow-up-right"
                    size={20}
                    className="text-sea-500 transition-transform duration-[250ms] ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transition-none"
                  />
                </Link>
                <Link
                  href="/contact"
                  className="team-band-link group inline-flex items-center gap-2 py-1.5 rounded-sm font-display text-xl text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50 lg:text-2xl"
                >
                  <span className="link-sweep">{page.talkToTeamLabel}</span>
                  <Icon
                    name="arrow-up-right"
                    size={20}
                    className="text-sea-500 transition-transform duration-[250ms] ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transition-none"
                  />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <Section className="pt-0">
        <CrossLinks hrefs={['/services', '/technical-focus', '/case-studies']} ui={ui} />
      </Section>
    </>
  );
}

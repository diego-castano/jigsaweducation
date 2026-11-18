import Link from 'next/link';
import Section from '../../../src/site/components/Section';
import Prose from '../../../src/site/components/Prose';
import Reveal from '../../../src/site/components/Reveal';
import CrossLinks from '../../../src/site/components/CrossLinks';
import FocusMosaic, { FOCUS_TONES } from '../../../src/site/components/technical-focus/FocusMosaic';
import { BARS } from '../../../src/site/components/technical-focus/FocusTile';
import Icon from '../../../src/components/Icon';
import { getSingleton, getCollection } from '../../../src/lib/content';
import { pageMetadata } from '../../../src/lib/page-metadata';

export async function generateMetadata() {
  const page = await getSingleton('page-technical-focus');
  return pageMetadata(page, { canonical: '/technical-focus' });
}

export default async function TechnicalFocusPage() {
  const [page, ui, areas, caseStudies] = await Promise.all([
    getSingleton('page-technical-focus'),
    getSingleton('ui-strings'),
    getCollection('technical-focus'),
    getCollection('case-studies')
  ]);
  const published = new Set(caseStudies.map((cs) => cs.slug));
  // Plain seeds split on blank lines; console HTML stays whole in one block.
  const paras = String(page.intro || '').includes('<') ? [] : String(page.intro || '').split(/\n\s*\n/);

  return (
    <>
      <section className="border-b border-cream-300">
        <div className="mx-auto max-w-[1240px] px-6 pt-14 pb-10 sm:px-8 lg:px-10 lg:pt-20 lg:pb-14">
          <h1 className="reveal font-display display-l text-4xl leading-[1.02] text-navy-900 sm:text-5xl lg:text-6xl">
            {page.heading}
          </h1>
          {paras.length > 1 ? (
            <div className="reveal reveal-2 mt-6 lg:mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
              <Prose
                text={paras[0]}
                className="text-lg leading-relaxed text-navy-900 lg:col-span-7 lg:text-xl"
              />
              <Prose
                text={paras.slice(1).join('\n\n')}
                className="mt-4 text-base leading-relaxed text-ink-700 lg:col-span-5 lg:mt-0 lg:border-l lg:border-cream-300 lg:pl-8"
              />
            </div>
          ) : (
            <Prose
              text={page.intro}
              className="reveal reveal-2 mt-6 max-w-[68ch] text-base leading-relaxed text-ink-700 lg:mt-8"
            />
          )}
        </div>
      </section>

      <Section>
        <p className="mb-6 text-sm text-ink-600">{page.instruction}</p>
        <FocusMosaic areas={areas} />
      </Section>

      <div className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-10">
        {areas.map((area, i) => {
          const bar = BARS[FOCUS_TONES[i % FOCUS_TONES.length]];
          const related = area.related || [];
          return (
            <section
              key={area.slug}
              id={area.slug}
              className="scroll-mt-28 border-t border-cream-300 py-14 first:border-t-0 lg:grid lg:grid-cols-12 lg:gap-12 lg:py-20"
            >
              <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
                {area.spot ? (
                  <img
                    src={area.spot}
                    alt=""
                    width={144}
                    height={144}
                    loading="lazy"
                    decoding="async"
                    className="h-28 w-28 rounded-2xl border border-cream-300 lg:h-36 lg:w-36"
                  />
                ) : (
                  <Icon name={area.icon} size={72} strokeWidth={1} className="text-sea-600" />
                )}
                <h2 className="mt-5 font-display display-s text-3xl leading-tight text-navy-900 lg:text-4xl">
                  {area.title}
                </h2>
                <div className={`mt-4 h-1 w-12 rounded-full ${bar}`} aria-hidden="true" />
              </div>

              <Reveal className="mt-8 lg:col-span-8 lg:mt-0">
                <Prose
                  text={area.summary}
                  className="max-w-[68ch] leading-relaxed text-ink-700 lg:text-lg"
                />
                {(area.relatedIntro || related.length > 0) && (
                  <div className="mt-8 border-t border-cream-300 pt-6">
                    {area.relatedIntro && <p className="text-sm text-ink-600">{area.relatedIntro}</p>}
                    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                      {related.map((r) => (
                        <li key={r.label}>
                          {r.caseStudy && published.has(r.caseStudy) ? (
                            <Link
                              href={`/case-studies/${r.caseStudy}`}
                              className="group inline-flex items-center gap-1.5 rounded-sm font-semibold text-sea-700 transition-colors hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50"
                            >
                              <span className="link-sweep">{r.label}</span>
                              <Icon name="arrow-up-right" size={16} className="shrink-0" />
                            </Link>
                          ) : (
                            <span className="text-ink-600">{r.label}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Reveal>
            </section>
          );
        })}
      </div>

      <Section className="pt-0">
        <CrossLinks hrefs={['/approaches', '/distinctives', '/team']} ui={ui} />
      </Section>
    </>
  );
}

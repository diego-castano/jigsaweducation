import Link from 'next/link';
import Icon from '../../../components/Icon';
import Prose from '../Prose';
import Reveal from '../Reveal';

// One approach, fully visible. id={slug} makes /approaches#<slug> a real
// address that case-study pages and home signposts link to.
export default function ServiceRow({ service, index, published }) {
  const numeral = String(index + 1).padStart(2, '0');
  const related = service.related || [];

  return (
    <section id={service.slug} className="scroll-mt-28 border-t border-cream-300 py-16 first:border-t-0 first:pt-0 lg:py-24 lg:first:pt-0">
      <Reveal>
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            style={{ fontVariationSettings: "'opsz' 72" }}
            className="font-display text-3xl leading-none tabular-nums text-orange-500 lg:text-[2.5rem]"
          >
            {numeral}
          </span>
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-sea-100 text-sea-700"
            aria-hidden="true"
          >
            <Icon name={service.icon} size={24} />
          </span>
        </div>

        <h2 className="font-display display-s mt-5 max-w-[24ch] text-3xl leading-[1.15] text-navy-900 lg:text-4xl">
          {service.title}
        </h2>

        <Prose
          text={service.summary}
          className="mt-6 max-w-[68ch] text-[1.0625rem] leading-relaxed text-ink-700 lg:text-lg"
        />

        {(service.relatedIntro || related.length > 0) && (
          <div className="mt-8 max-w-[68ch] border-t border-cream-300 pt-5">
            {service.relatedIntro && <p className="text-sm text-ink-500">{service.relatedIntro}</p>}
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
              {related.map((r) => (
                <li key={r.label}>
                  {r.caseStudy && published.has(r.caseStudy) ? (
                    <Link
                      href={`/case-studies/${r.caseStudy}`}
                      className="group/cs inline-flex min-h-10 items-center gap-1.5 text-[15px] text-sea-700 transition-colors hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                      <span className="link-sweep">{r.label}</span>
                      <Icon
                        name="arrow-up-right"
                        size={14}
                        className="shrink-0 transition-transform duration-200 motion-safe:group-hover/cs:-translate-y-0.5 motion-safe:group-hover/cs:translate-x-0.5"
                      />
                    </Link>
                  ) : (
                    <span className="inline-flex min-h-10 items-center text-[15px] text-ink-500">{r.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Reveal>
    </section>
  );
}

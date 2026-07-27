import Link from 'next/link';
import Icon from '../../components/Icon';
import Placeholder from './Placeholder';
import Reveal from './Reveal';
import { SIGNPOSTS } from '../../data/home';

// The three ways into the site: Services, Technical focus, Distinctives.
//
// v1 rendered these as bordered cards with an icon plate on top, which is the
// pattern the client named as looking AI-generated (a module in a box in a
// card). v2 keeps the same content and drops the containers: three columns of
// a hairline-ruled band, structure from rules and type scale only. The kickers
// go with the boxes, under the eyebrow rationing rule.
//
// The Distinctives column keeps its second link into #our-story: the new
// sitemap retires the About page, so this is the only route left for a visitor
// looking for "about us".
export default function SignpostTrio() {
  return (
    <ul className="grid md:grid-cols-3 border-t border-b border-cream-300">
      {SIGNPOSTS.map((s, i) => (
        <Reveal
          as="li"
          key={s.href}
          delay={i * 90}
          // Translucent tint, not opaque fill: with the globe drifting behind
          // this band, a solid hover patch cut a hard-edged rectangle out of
          // the backdrop and read as a glitch.
          className={`group flex flex-col min-h-[16rem] py-9 transition-colors duration-300 hover:bg-cream-100/70 focus-within:bg-cream-100/70 ${
            i > 0 ? 'border-t border-cream-300 md:border-t-0 md:border-l md:pl-8 lg:pl-10' : ''
          } ${i < SIGNPOSTS.length - 1 ? 'md:pr-8 lg:pr-10' : ''}`}
        >
          {/* h2, not h3: these columns are the home page's first real sections
              after the hero, so anything lower would skip a level. */}
          <h2 className="font-display display-m text-2xl lg:text-[1.75rem] leading-[1.15] text-navy-900">
            {s.title}
          </h2>

          <Placeholder className="mt-4 text-[15px] leading-relaxed flex-1">
            {s.summary}
          </Placeholder>

          <Link
            href={s.href}
            className="inline-flex items-center gap-2 w-fit mt-8 py-2 -my-2 text-sm font-bold text-sea-700 group-hover:text-orange-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
          >
            <span className="link-sweep">
              Read more
              <span className="sr-only"> about {s.title}</span>
            </span>
            <Icon
              name="arrow-right"
              size={16}
              className="transition-transform duration-[250ms] ease-out group-hover:translate-x-[7px]"
            />
          </Link>

          {s.secondaryLink && (
            <Link
              href={s.secondaryLink.href}
              className="inline-flex items-center gap-1.5 w-fit mt-4 py-2 -my-1 text-sm text-ink-600 hover:text-orange-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
            >
              <span className="link-sweep">{s.secondaryLink.label}</span>
              <Icon name="arrow-up-right" size={14} />
            </Link>
          )}
        </Reveal>
      ))}
    </ul>
  );
}

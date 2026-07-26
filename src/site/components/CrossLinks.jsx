import Link from 'next/link';
import Icon from '../../components/Icon';

// The brief closes Services, Technical focus and Distinctives by pointing at
// the other two plus Team. With no dropdowns anywhere, these end-of-page
// signposts carry most of the site's lateral navigation.
const ALL = {
  '/services': { title: 'Services', blurb: 'What we offer the teams we work with' },
  '/technical-focus': { title: 'Technical focus', blurb: 'The areas where we specialise' },
  '/distinctives': { title: 'Distinctives', blurb: 'What sets us apart' },
  '/team': { title: 'Team', blurb: 'The researchers behind the work' },
  '/case-studies': { title: 'Case studies', blurb: 'Indicative examples of our work' },
  '/publications': { title: 'Publications', blurb: 'Our public outputs, free to download' }
};

// Redesigned as a "Continue" band: stacked full-width rows rather than three
// boxes, so the end of every page reads as one more navigation move instead
// of a wall of cards. Same props API — six pages import this unchanged.
export default function CrossLinks({ hrefs }) {
  const items = hrefs.map((href) => ({ href, ...ALL[href] })).filter((item) => item.title);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Continue reading" className="border-t border-cream-300 pt-10">
      <p className="text-[11px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-2">
        Continue
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.href} className="border-t border-cream-300 last:border-b">
            <Link
              href={item.href}
              style={{ '--sweep': 'var(--color-cream-100)' }}
              className="row-sweep group flex items-center justify-between gap-6 py-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset"
            >
              <span className="min-w-0">
                <span className="font-display display-m text-2xl sm:text-3xl text-navy-900 block">
                  {item.title}
                </span>
                <span className="text-sm text-ink-600 mt-1 block">{item.blurb}</span>
              </span>
              <Icon
                name="arrow-right"
                size={22}
                className="shrink-0 text-sea-500 group-hover:text-orange-500 transition-all duration-[250ms] ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

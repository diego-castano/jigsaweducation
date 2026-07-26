import { placeholder } from './placeholder';

// The Home page. The brief specifies four blocks and no more — the client
// rejected homepages that "do too much" (fab-ai.org, r4d.org), so nothing gets
// added here without them asking for it.

// Final copy, supplied. Four sentences, in this order.
export const CORE_SENTENCES = [
  'Jigsaw is an education research practice.',
  'We work globally and focus on countries with the biggest education challenges.',
  'We build and use evidence to improve learning and strengthen education systems.',
  'Our offices are in London and Lusaka.'
];

// The three signpost boxes. The Distinctives box carries a second link into
// #our-story: the new sitemap retires the About page, and this is the only
// route a visitor looking for "about us" has left.
export const SIGNPOSTS = [
  {
    href: '/services',
    title: 'Services',
    kicker: 'What we offer',
    icon: 'compass',
    summary: placeholder('brief summary of Services for the home page')
  },
  {
    href: '/technical-focus',
    title: 'Technical focus',
    kicker: 'What we specialise in',
    icon: 'microscope',
    summary: placeholder('brief summary of Technical focus for the home page')
  },
  {
    href: '/distinctives',
    title: 'Distinctives',
    kicker: 'What sets us apart',
    icon: 'sparkles',
    summary: placeholder('brief summary of Distinctives for the home page'),
    secondaryLink: { href: '/distinctives#our-story', label: 'Our story' }
  }
];

// MAP DATA — the brief marks both the country list and the summary sentence
// as [tbc]. The seed below is DERIVED from countries named in the case studies
// on the live site, so the map renders with something real while the client
// compiles the full list. It is a floor, not the answer: a practice claiming
// work in 30+ countries will have many more than these.
export const MAP_SUMMARY = placeholder('summary sentence for the global map');

// `id` is the numeric ISO 3166-1 code, which is what world-atlas keys on.
// Matching on numeric rather than name on purpose: names drift (the atlas still
// says "Turkey", the country says "Türkiye"; Swaziland became Eswatini) and a
// renamed country would silently drop off the map.
export const MAP_COUNTRIES = [
  { name: 'United Kingdom', id: '826', office: true },
  { name: 'Zambia', id: '894', office: true },
  { name: 'Afghanistan', id: '004' },
  { name: 'Bangladesh', id: '050' },
  { name: 'Egypt', id: '818' },
  { name: 'Jordan', id: '400' },
  { name: 'Kenya', id: '404' },
  { name: 'Lebanon', id: '422' },
  { name: 'Pakistan', id: '586' },
  { name: 'Rwanda', id: '646' },
  { name: 'Türkiye', id: '792' },
  { name: 'Uganda', id: '800' }
];

export const MAP_IS_SEED_DATA = true;

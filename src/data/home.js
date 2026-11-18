// The Home page. The brief specifies four blocks and no more, the client
// rejected homepages that "do too much" (fab-ai.org, r4d.org), so nothing gets
// added here without them asking for it.

// Final copy, supplied. Four sentences, in this order.
export const CORE_SENTENCES = [
  'Jigsaw is a global education research practice.',
  'We focus on significant education challenges in contexts where we can contribute to meaningful change.',
  'We build and support the use of evidence to improve learning and strengthen education systems.',
  'Our offices are in London and Lusaka.'
];

// The three field photographs around the globe in the hero. Design feedback,
// 15 September 2026, asked for three smaller images instead of one, showing
// range in places and activities. These are the client's own photographs,
// already in the media library, each from a published case study and pinned
// to a country that study worked in. `country.id` is the zero-padded ISO
// numeric code the admin's country picker stores.
export const HERO_PHOTOS = [
  {
    photo: '/media/migrated/34fcc047ee-tile-fill-akf-photo.png',
    caption: 'ICT in primary schools',
    country: { name: 'Kenya', id: '404' },
    link: '/case-studies'
  },
  {
    photo: '/media/migrated/48b3ff9be3-tile-fill-dubai-cares-ecubed-2019-participatory-activity.jpg',
    caption: 'Voices of Refugee Youth',
    country: { name: 'Pakistan', id: '586' },
    link: '/case-studies/youth-centred-evidence-building-for-post-primary-refugee-education'
  },
  {
    photo: '/media/migrated/8d24c47f17-tile-fill-group-work-interaction-with-trainer-1-.jpg',
    caption: 'Teacher professional development',
    country: { name: 'Rwanda', id: '646' },
    link: '/case-studies/measuring-the-carbon-footprint-of-teacher-training'
  }
];

// The three signpost boxes. The Distinctives box carries a second link into
// #our-story: the new sitemap retires the About page, and this is the only
// route a visitor looking for "about us" has left.
export const SIGNPOSTS = [
  {
    href: '/approaches',
    title: 'Approaches',
    kicker: 'What we offer',
    icon: 'compass',
    summary: 'Jigsaw’s approaches provide a flexible toolkit designed to build and use evidence for addressing complex education challenges. We take a problem-first approach, providing useful answers to complex questions.'
  },
  {
    href: '/technical-focus',
    title: 'Technical focus',
    kicker: 'What we specialise in',
    icon: 'microscope',
    summary: 'Our work exists in order to tackle critical challenges in global education. We do this by building and using evidence that improves learning and strengthens systems. We focus on specific technical issues that we consider to be strategic priorities for the global education community, where our attention can have an out-sized impact.'
  },
  {
    href: '/distinctives',
    title: 'Distinctives',
    kicker: 'What sets us apart',
    icon: 'sparkles',
    summary: 'We have organisational distinctives alongside our approaches and technical areas. They are the kind of things that you should experience when you work with Jigsaw.',
    secondaryLink: { href: '/distinctives#our-story', label: 'Our story' }
  }
];

// MAP DATA: the client's final summary and the 77-country list (round 3).

export const MAP_SUMMARY =
  'Our work ranges from global evidence syntheses to collaborating with local community initiatives. This map visualises the geographic scope of work to date. More detail about specific projects can be found on our Case Studies page.';

// `id` is the numeric ISO 3166-1 code, which is what world-atlas keys on.
// Matching on numeric rather than name on purpose: names drift (the atlas still
// says "Turkey", the country says "Türkiye"; Swaziland became Eswatini) and a
// renamed country would silently drop off the map.
export const MAP_COUNTRIES = [
  { name: 'Afghanistan', id: '004' },
  { name: 'Algeria', id: '012' },
  { name: 'Bangladesh', id: '050' },
  { name: 'Belgium', id: '056' },
  { name: 'Benin', id: '204' },
  { name: 'Bolivia', id: '068' },
  { name: 'Botswana', id: '072' },
  { name: 'Burkina Faso', id: '854' },
  { name: 'Burundi', id: '108' },
  { name: 'Cambodia', id: '116' },
  { name: 'Cameroon', id: '120' },
  { name: 'Central African Rep.', id: '140' },
  { name: 'Chad', id: '148' },
  { name: 'China', id: '156' },
  { name: 'Colombia', id: '170' },
  { name: 'Denmark', id: '208' },
  { name: 'Dem. Rep. Congo', id: '180' },
  { name: 'Egypt', id: '818' },
  { name: 'Ethiopia', id: '231' },
  { name: 'France', id: '250' },
  { name: 'Germany', id: '276' },
  { name: 'Ghana', id: '288' },
  { name: 'Guinea', id: '324' },
  { name: 'Guinea-Bissau', id: '624' },
  { name: 'Haiti', id: '332' },
  { name: 'Honduras', id: '340' },
  { name: 'India', id: '356' },
  { name: 'Indonesia', id: '360' },
  { name: 'Iraq', id: '368' },
  { name: "Côte d'Ivoire", id: '384' },
  { name: 'Jordan', id: '400' },
  { name: 'Kenya', id: '404' },
  { name: 'Laos', id: '418' },
  { name: 'Lebanon', id: '422' },
  { name: 'Liberia', id: '430' },
  { name: 'Libya', id: '434' },
  { name: 'Madagascar', id: '450' },
  { name: 'Malawi', id: '454' },
  { name: 'Malaysia', id: '458' },
  { name: 'Mali', id: '466' },
  { name: 'Montenegro', id: '499' },
  { name: 'Morocco', id: '504' },
  { name: 'Mozambique', id: '508' },
  { name: 'Myanmar', id: '104' },
  { name: 'Namibia', id: '516' },
  { name: 'Nepal', id: '524' },
  { name: 'Nicaragua', id: '558' },
  { name: 'Niger', id: '562' },
  { name: 'Nigeria', id: '566' },
  { name: 'Pakistan', id: '586' },
  { name: 'Palestine', id: '275' },
  { name: 'Paraguay', id: '600' },
  { name: 'Peru', id: '604' },
  { name: 'Philippines', id: '608' },
  { name: 'Qatar', id: '634' },
  { name: 'Rwanda', id: '646' },
  { name: 'Senegal', id: '686' },
  { name: 'Sierra Leone', id: '694' },
  { name: 'Somalia', id: '706' },
  { name: 'S. Sudan', id: '728' },
  { name: 'Sudan', id: '729' },
  { name: 'Switzerland', id: '756' },
  { name: 'Syria', id: '760' },
  { name: 'Tajikistan', id: '762' },
  { name: 'Tanzania', id: '834' },
  { name: 'Thailand', id: '764' },
  { name: 'Tunisia', id: '788' },
  { name: 'Turkey', id: '792' },
  { name: 'United Arab Emirates', id: '784' },
  { name: 'Uganda', id: '800' },
  { name: 'United Kingdom', id: '826', office: true },
  { name: 'United States of America', id: '840' },
  { name: 'Uzbekistan', id: '860' },
  { name: 'Vietnam', id: '704' },
  { name: 'Yemen', id: '887' },
  { name: 'Zambia', id: '894', office: true },
  { name: 'Zimbabwe', id: '716' }
];

export const MAP_IS_SEED_DATA = false;

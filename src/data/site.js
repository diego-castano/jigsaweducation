// Single source of truth for organisation-level facts, navigation and legals.
// Every figure here traces to docs/client/new-website-sitemap.md.

export const SITE = {
  name: 'Jigsaw',
  legalName: 'Jigsaw Education Evidence Ltd.',
  tagline: 'Rigorous evidence for lasting change in education',
  description:
    'Jigsaw is an education research practice. We build and use evidence to improve learning and strengthen education systems in the countries with the biggest education challenges.',
  url: 'https://www.jigsaweducation.org',
  linkedin: 'https://www.linkedin.com/company/jigsaw-education-org/'
};

// Header: 7 items, no dropdowns. Home is reached via the logo, per the brief.
export const MAIN_NAV = [
  { href: '/services', label: 'Services' },
  { href: '/technical-focus', label: 'Technical focus' },
  { href: '/distinctives', label: 'Distinctives' },
  { href: '/team', label: 'Team' },
  { href: '/case-studies', label: 'Case studies' },
  { href: '/publications', label: 'Publications' },
  { href: '/contact', label: 'Contact' }
];

export const FOOTER_NAV = [
  { href: '/policies', label: 'Policies' },
  { href: '/work-for-us', label: 'Work for us' }
];

export const OFFICES = [
  {
    id: 'uk',
    // Deliberately framed as scope of work, not headquarters. The brief asks
    // for the two offices side by side with no hierarchy.
    heading: 'To contact us about our global work',
    org: 'Jigsaw',
    city: 'London',
    country: 'United Kingdom',
    countryId: '826', // numeric ISO, matches world-atlas
    coords: [-0.2405, 51.5449], // [lon, lat] — NW10 4LL
    email: 'info@jigsaweducation.org',
    address: ['The Lighthouse', '60-62 High Street', 'London NW10 4LL'],
    addressLabel: 'Office address'
  },
  {
    id: 'zm',
    heading: 'To contact us about our work in Zambia',
    org: 'Jigsaw Zambia',
    city: 'Lusaka',
    country: 'Zambia',
    countryId: '894',
    coords: [28.3228, -15.3875], // Olympia Park, Lusaka
    email: 'zambiateam@jigsaweducation.org',
    address: ['Plot No. 4, Mwaleshi Road', 'Olympia Park', 'Lusaka'],
    addressLabel: 'Registered address'
  }
];

export const LEGAL = {
  // "Registered BCorp" gets added here once the client confirms certification.
  socialEnterprise: true,
  ukCompanyNumber: '06844615',
  vatNumber: 'GB173850004',
  zambiaCompanyNumber: '120251030229',
  line: 'Jigsaw Education Evidence Ltd. is a certified Social Enterprise and a company registered in England and Wales (company number 06844615 and VAT number GB173850004) and Zambia (company number 120251030229).'
};

// Track record. The live site has said "over 60 organisations in more than 30
// countries" for years; the July brief says "over 150 assignments for more than
// 50 organisations" and drops the country count. Flagged to the client in
// docs/build-plan.md §7 — these are the brief's figures, pending their answer.
export const TRACK_RECORD = {
  years: 15,
  assignments: 150,
  organisations: 50,
  needsClientConfirmation: true
};

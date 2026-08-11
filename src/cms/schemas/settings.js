// Settings-level singletons: organisation facts, shared interface microcopy
// and tracking. Site-wide values live here so a change lands everywhere at
// once; page-specific copy lives in schemas/pages.js.
//
// Seeds for site-settings import from src/data/site.js so the database starts
// byte-identical to the files it replaces. Seeds for ui-strings are copied
// byte-exact from the components named in each section comment.

import { SITE, MAIN_NAV, FOOTER_NAV, OFFICES, LEGAL, TRACK_RECORD } from '../../data/site.js';

const SITE_SETTINGS = {
  key: 'site-settings',
  title: 'Site settings',
  description: 'Organisation facts, offices, navigation and legals used across every page',
  route: null,
  icon: 'settings',
  sections: [
    {
      id: 'organisation',
      title: 'Organisation',
      fields: [
        {
          name: 'name',
          label: 'Organisation name',
          type: 'text',
          required: true,
          seed: SITE.name,
          help: 'The short name used in browser titles, the footer and social share cards.'
        },
        {
          name: 'legalName',
          label: 'Legal name',
          type: 'text',
          required: true,
          seed: SITE.legalName,
          help: 'The registered company name, used in structured data for search engines.'
        },
        {
          name: 'logoWordmark',
          label: 'Logo wordmark',
          type: 'image',
          nullable: true,
          seed: null,
          help:
            'The official wordmark file (SVG or PNG), set in the official logo font: never a web font. Until one is uploaded the site shows the J mark with a stand-in.'
        },
        {
          name: 'tagline',
          label: 'Tagline',
          type: 'text',
          verbatim: true,
          seed: SITE.tagline,
          help: 'One line of voice: the default browser-title suffix and the footer strapline.'
        },
        {
          name: 'description',
          label: 'Site description',
          type: 'textarea',
          maxLength: 300,
          seed: SITE.description,
          help: 'The site-wide description search engines and social cards show.',
          warning:
            'This sentence restates the track-record figures below in prose. If the figures change, reword this to match.'
        },
        {
          name: 'url',
          label: 'Website address',
          type: 'url',
          seed: SITE.url,
          warning:
            'The canonical origin of the site. Changing it affects every canonical URL and social card; check with the developer first.'
        },
        {
          name: 'linkedin',
          label: 'LinkedIn page',
          type: 'url',
          seed: SITE.linkedin,
          help: 'The company LinkedIn URL the footer links to.'
        }
      ]
    },
    {
      id: 'track-record',
      title: 'Track record numbers',
      description:
        'The three headline figures from the July brief. The live site has said "over 60 organisations in more than 30 countries" for years, so these await client sign-off.',
      fields: [
        {
          name: 'years',
          label: 'Years of work',
          type: 'number',
          required: true,
          seed: TRACK_RECORD.years
        },
        {
          name: 'assignments',
          label: 'Assignments completed',
          type: 'number',
          required: true,
          seed: TRACK_RECORD.assignments,
          warning:
            'These figures are restated in prose in the partners introduction and the site description. Edit those texts to match.'
        },
        {
          name: 'organisations',
          label: 'Organisations worked with',
          type: 'number',
          required: true,
          seed: TRACK_RECORD.organisations
        },
        {
          name: 'needsClientConfirmation',
          label: 'Figures awaiting confirmation',
          type: 'boolean',
          seed: TRACK_RECORD.needsClientConfirmation,
          help: 'Internal note only, never shown to visitors. Switch off once the team confirms the figures.'
        }
      ]
    },
    {
      id: 'offices',
      title: 'Offices',
      description:
        'The brief presents the two offices side by side with no hierarchy; neither is a headquarters.',
      fields: [
        {
          name: 'offices',
          label: 'Offices',
          type: 'list',
          itemLabel: 'Office',
          fixed: true,
          minItems: 2,
          maxItems: 2,
          seed: OFFICES,
          of: [
            {
              name: 'heading',
              label: 'Heading',
              type: 'text',
              verbatim: true,
              help: 'Deliberately framed as scope of work ("To contact us about..."), not office rank. Check with Dave before rewording.'
            },
            { name: 'org', label: 'Organisation', type: 'text' },
            { name: 'city', label: 'City', type: 'text' },
            { name: 'country', label: 'Country', type: 'text' },
            { name: 'email', label: 'Email address', type: 'email' },
            {
              // Rows are plain strings in the stored data, matching
              // src/data/site.js OFFICES[].address exactly.
              name: 'address',
              label: 'Address lines',
              type: 'list',
              itemLabel: 'Address line',
              of: [{ name: 'line', label: 'Line', type: 'text' }],
              help: 'One line per row, printed exactly as written.'
            },
            {
              name: 'addressLabel',
              label: 'Address label',
              type: 'text',
              help: 'The small caption above the address, e.g. "Office address" or "Registered address".'
            },
            // The two wiring fields below render read-only in the admin; the
            // warnings say why. A wrong value drops the office off the maps
            // with no error.
            {
              name: 'countryId',
              label: 'Country code',
              type: 'text',
              warning:
                'Map plumbing: the numeric ISO code that places this office on the site maps. A wrong code silently removes the office pin; ask the developer to change it.'
            },
            {
              name: 'coords',
              label: 'Coordinates',
              type: 'text',
              warning:
                'Map plumbing: the [longitude, latitude] pair for the map pin and globe marker. Ask the developer to change it if the office moves.'
            }
          ]
        }
      ]
    },
    {
      id: 'legal',
      title: 'Legal',
      fields: [
        {
          name: 'socialEnterprise',
          label: 'Certified Social Enterprise',
          type: 'boolean',
          seed: LEGAL.socialEnterprise,
          warning:
            'For reference only: the certification wording visitors see lives in the legal sentence below: edit that sentence when the status changes.'
        },
        {
          name: 'ukCompanyNumber',
          label: 'UK company number',
          type: 'text',
          seed: LEGAL.ukCompanyNumber
        },
        {
          name: 'vatNumber',
          label: 'VAT number',
          type: 'text',
          seed: LEGAL.vatNumber,
          help: 'Also feeds the structured data search engines read (vatID).'
        },
        {
          name: 'zambiaCompanyNumber',
          label: 'Zambia company number',
          type: 'text',
          seed: LEGAL.zambiaCompanyNumber
        },
        {
          name: 'legalLine',
          label: 'Footer legal line',
          type: 'textarea',
          seed: LEGAL.line,
          help: '"Registered BCorp" joins this sentence once certification is confirmed.',
          warning:
            'This sentence repeats the company and VAT numbers above as prose. Keep them in agreement.'
        }
      ]
    },
    {
      id: 'navigation',
      title: 'Navigation',
      description:
        'The brief mandates seven header items and no dropdowns, so both lists are fixed; only the labels can change.',
      fields: [
        {
          name: 'mainNav',
          label: 'Header navigation',
          type: 'list',
          itemLabel: 'Menu item',
          fixed: true,
          seed: MAIN_NAV,
          of: [
            { name: 'label', label: 'Label', type: 'text', required: true },
            {
              name: 'href',
              label: 'Links to',
              type: 'link',
              warning: 'A structural route. Renaming the label is fine; the destination is locked.'
            }
          ]
        },
        {
          name: 'footerNav',
          label: 'Footer-only navigation',
          type: 'list',
          itemLabel: 'Menu item',
          fixed: true,
          seed: FOOTER_NAV,
          of: [
            { name: 'label', label: 'Label', type: 'text', required: true },
            {
              name: 'href',
              label: 'Links to',
              type: 'link',
              warning: 'A structural route. Renaming the label is fine; the destination is locked.'
            }
          ]
        },
        {
          name: 'footerExploreHeading',
          label: 'Footer “Explore” column heading',
          type: 'text',
          seed: 'Explore',
          help: 'Heads the footer column that repeats the header navigation.'
        },
        {
          name: 'footerMoreHeading',
          label: 'Footer “More” column heading',
          type: 'text',
          seed: 'More',
          help: 'Heads the footer column with Policies and Work for us.'
        },
        {
          name: 'tabBar',
          label: 'Mobile tab bar',
          type: 'list',
          itemLabel: 'Tab',
          fixed: true,
          help:
            'The four tabs at the bottom of the screen on phones. Keep labels to one short word: long labels wrap and break the bar.',
          seed: [
            { label: 'Home' },
            { label: 'Services' },
            { label: 'Work' },
            { label: 'Library' }
          ],
          of: [{ name: 'label', label: 'Label', type: 'text', required: true, maxLength: 10 }]
        },
        {
          name: 'tabBarMenuLabel',
          label: 'Mobile tab bar “Menu” label',
          type: 'text',
          maxLength: 10,
          seed: 'Menu',
          help: 'The fifth slot, which opens the full menu.'
        }
      ]
    },
    {
      id: 'review-mode',
      title: 'Review mode',
      fields: [
        {
          name: 'showReviewNotes',
          label: 'Show internal review notes',
          type: 'boolean',
          seed: true,
          help: 'Switch off at launch to hide every internal draft note across the site.'
        }
      ]
    }
  ]
};

const UI_STRINGS = {
  key: 'ui-strings',
  title: 'Interface text',
  description: 'Shared labels, buttons and fallback lines used on more than one page',
  route: null,
  icon: 'type',
  sections: [
    {
      // Seeds byte-exact from src/site/components/SignpostTrio.jsx.
      id: 'signposts',
      title: 'Signposts & cards',
      fields: [
        {
          name: 'readMore',
          label: 'Read more link',
          type: 'text',
          seed: 'Read more',
          help: 'The link label on the three home-page signposts.'
        }
      ]
    },
    {
      // Seeds byte-exact from FooterSignup.jsx and MailingListForm.jsx.
      id: 'footer-signup',
      title: 'Footer & signup',
      fields: [
        {
          name: 'signupHeading',
          label: 'Signup heading',
          type: 'text',
          seed: 'Occasional updates about our work',
          help: 'Above the mailing-list form in the footer.'
        },
        {
          name: 'signupBlurb',
          label: 'Signup blurb',
          type: 'text',
          seed: 'New case studies and publications, a few times a year. Nothing more frequent than that.',
          help: 'The sentence under the signup heading. It sets the expectation of how often you will write.'
        },
        {
          name: 'linkedinLabel',
          label: 'LinkedIn link label',
          type: 'text',
          seed: 'LinkedIn',
          help: 'The visible text beside the "in" roundel in the footer.'
        },
        {
          name: 'emailPlaceholder',
          label: 'Email field placeholder',
          type: 'text',
          seed: 'your@email.com'
        },
        {
          name: 'signupButton',
          label: 'Signup button',
          type: 'text',
          seed: 'Sign up'
        },
        {
          name: 'signupErrorEmpty',
          label: 'Empty email message',
          type: 'text',
          seed: 'Enter an email address.',
          help: 'Shown when the form is submitted with nothing typed.'
        },
        {
          name: 'signupErrorInvalid',
          label: 'Invalid email message',
          type: 'text',
          seed: 'That does not look like an email address.',
          help: 'Shown when the typed text is not a plausible email address.'
        },
        {
          name: 'signupSuccess',
          label: 'Success message',
          type: 'text',
          seed: 'Thank you. You are on the list.',
          help: 'Shown after an address is saved to the mailing list.'
        }
      ]
    },
    {
      // Seeds byte-exact from CaseStudyBrowser.jsx, PublicationBrowser.jsx
      // and FilterBar.jsx.
      id: 'browsers',
      title: 'Browsers & filters',
      fields: [
        {
          name: 'caseStudySearchPlaceholder',
          label: 'Case-study search placeholder',
          type: 'text',
          seed: 'Search case studies, partners or countries…'
        },
        {
          name: 'publicationSearchPlaceholder',
          label: 'Publication search placeholder',
          type: 'text',
          seed: 'Search publications…'
        },
        {
          name: 'sortLabel',
          label: 'Sort label',
          type: 'text',
          seed: 'Sort',
          help: 'The small label beside the sort dropdown.'
        },
        { name: 'sortAZ', label: 'Sort option: A to Z', type: 'text', seed: 'A–Z' },
        { name: 'sortZA', label: 'Sort option: Z to A', type: 'text', seed: 'Z–A' },
        { name: 'sortRecent', label: 'Sort option: most recent', type: 'text', seed: 'Most recent' },
        { name: 'sortOldest', label: 'Sort option: oldest', type: 'text', seed: 'Oldest' },
        {
          name: 'emptyStateTitle',
          label: 'No-results message',
          type: 'text',
          seed: 'Nothing matches those filters',
          help: 'Shown when search and filters leave nothing to display.'
        },
        {
          name: 'clearAllFilters',
          label: 'Clear filters button',
          type: 'text',
          seed: 'Clear all filters',
          help: 'The button under the no-results message.'
        },
        {
          name: 'clearAll',
          label: 'Clear all link',
          type: 'text',
          seed: 'Clear all',
          help: 'The small link beside the active filter chips.'
        },
        { name: 'paginationPrevious', label: 'Previous page button', type: 'text', seed: 'Previous' },
        { name: 'paginationNext', label: 'Next page button', type: 'text', seed: 'Next' },
        {
          name: 'resultCountTemplate',
          label: 'Result count (filtered)',
          type: 'text',
          seed: '{count} of {total} {noun}',
          warning:
            'Keep the {count}, {total} and {noun} placeholders; the site fills them in, e.g. "3 of 17 case studies".'
        },
        {
          name: 'resultCountAllTemplate',
          label: 'Result count (nothing filtered)',
          type: 'text',
          seed: '{count} {noun}',
          warning:
            'Shown when no filters are active, e.g. "17 case studies". Keep the {count} and {noun} placeholders.'
        }
      ]
    },
    {
      // Seeds byte-exact from the team, case-study and publication detail
      // pages, PublicationCard.jsx, PolicyRow in policies/page.jsx,
      // ServiceRow.jsx / FocusMosaic.jsx and CrossLinks.jsx.
      id: 'detail-pages',
      title: 'Detail pages',
      fields: [
        {
          name: 'breadcrumbTeam',
          label: 'Team breadcrumb',
          type: 'text',
          seed: 'All team',
          help: 'The back link at the top of each team profile.'
        },
        {
          name: 'breadcrumbCaseStudies',
          label: 'Case-study breadcrumb',
          type: 'text',
          seed: 'All case studies',
          help: 'The back link at the top of each case study.'
        },
        {
          name: 'breadcrumbPublications',
          label: 'Publication breadcrumb',
          type: 'text',
          seed: 'Evidence library',
          help: 'The back link at the top of each publication page.'
        },
        {
          name: 'relatedCaseStudiesHeading',
          label: 'Related case studies heading',
          type: 'text',
          seed: 'Related case studies',
          help: 'Above the case-study lists inside the services and technical-focus panels.'
        },
        {
          name: 'relatedCaseStudiesEmpty',
          label: 'Related case studies empty state',
          type: 'text',
          seed: 'No published case studies tagged to this area yet.',
          help: 'Shown when a service or technical area has no case studies tagged to it.'
        },
        {
          name: 'relatedWorkHeading',
          label: 'Related work heading',
          type: 'text',
          seed: 'Related work',
          help: 'Above the related case studies at the foot of each case study.'
        },
        {
          name: 'publicationsFromStudyHeading',
          label: 'Publications heading',
          type: 'text',
          seed: 'Publications from this study',
          help: 'Above the publication cards on a case study.'
        },
        {
          name: 'findOutMoreHeading',
          label: 'Find out more heading',
          type: 'text',
          seed: 'Find out more',
          help: 'Above the external links on a case study.'
        },
        {
          name: 'morePublicationsTemplate',
          label: 'More publications heading',
          type: 'text',
          seed: 'More {type}s',
          warning:
            'Keep the {type} placeholder; the site inserts the publication type in lower case, e.g. "More learning briefs".'
        },
        {
          name: 'abstractHeading',
          label: 'Abstract heading',
          type: 'text',
          seed: 'Abstract'
        },
        {
          name: 'downloadPdfLabel',
          label: 'Download button',
          type: 'text',
          seed: 'Download PDF',
          help: 'Used when the publication file is hosted by Jigsaw.'
        },
        {
          name: 'viewPublicationLabel',
          label: 'External link button',
          type: 'text',
          seed: 'View publication',
          help: 'Used when the publication lives on another website.'
        },
        {
          name: 'readMoreAboutStudy',
          label: 'Case-study link button',
          type: 'text',
          seed: 'Read more about this study',
          help: 'On a publication page, links to the case study it came from.'
        },
        {
          name: 'authorsFallback',
          label: 'Missing authors, publication page',
          type: 'text',
          seed: 'Authors to be confirmed'
        },
        {
          name: 'dateFallback',
          label: 'Missing date, publication page',
          type: 'text',
          seed: 'date to be confirmed',
          help: 'Deliberately lower case: it follows the authors line mid-sentence.'
        },
        {
          name: 'authorsFallbackShort',
          label: 'Missing authors, cards',
          type: 'text',
          seed: 'Authors tbc'
        },
        {
          name: 'dateFallbackShort',
          label: 'Missing date, cards',
          type: 'text',
          seed: 'Date tbc'
        },
        {
          name: 'awaitingCopyBadge',
          label: 'Awaiting copy badge',
          type: 'text',
          seed: 'Awaiting copy',
          help: 'The small badge on any card or section whose text has not arrived yet.'
        },
        {
          name: 'awaitingDocumentBadge',
          label: 'Awaiting document badge',
          type: 'text',
          seed: 'Awaiting document',
          help: 'Shown on the policies list when a policy PDF has not been supplied.'
        },
        {
          name: 'pdfSizeTemplate',
          label: 'PDF size line',
          type: 'text',
          seed: 'PDF · {size}',
          warning: 'Keep the {size} placeholder; the site fills in the file size, e.g. "PDF · 403 KB".'
        },
        {
          name: 'sectionCriticalQuestion',
          label: 'Case-study section 1',
          type: 'text',
          seed: 'The critical question',
          help: 'The brief mandates the four-part case-study format; the order is fixed, the headings are yours.'
        },
        {
          name: 'sectionCollaboration',
          label: 'Case-study section 2',
          type: 'text',
          seed: 'Collaboration'
        },
        {
          name: 'sectionBuildingEvidence',
          label: 'Case-study section 3',
          type: 'text',
          seed: 'Building evidence'
        },
        {
          name: 'sectionPathwaysToUptake',
          label: 'Case-study section 4',
          type: 'text',
          seed: 'Pathways to evidence uptake'
        },
        {
          name: 'continueKicker',
          label: 'Continue band kicker',
          type: 'text',
          seed: 'Continue',
          help: 'The small orange label above the end-of-page navigation band.'
        },
        {
          name: 'crossLinks',
          label: 'Continue band entries',
          type: 'list',
          itemLabel: 'Entry',
          fixed: true,
          seed: [
            { route: '/services', title: 'Services', blurb: 'What we offer the teams we work with' },
            { route: '/technical-focus', title: 'Technical focus', blurb: 'The areas where we specialise' },
            { route: '/distinctives', title: 'Distinctives', blurb: 'What sets us apart' },
            { route: '/team', title: 'Team', blurb: 'The researchers behind the work' },
            { route: '/case-studies', title: 'Case studies', blurb: 'Indicative examples of our work' },
            { route: '/publications', title: 'Publications', blurb: 'Our public outputs, free to download' }
          ],
          help: 'The title and one-line blurb shown when the end-of-page band points at each page.',
          of: [
            {
              name: 'route',
              label: 'Page',
              type: 'link',
              warning: 'A structural route. Which pages appear in each band is set per page; only the wording here is editable.'
            },
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'blurb', label: 'Blurb', type: 'text' }
          ]
        }
      ]
    }
  ]
};

const TRACKING = {
  key: 'tracking',
  title: 'Analytics & tracking',
  description: 'Analytics snippets and site-wide social sharing defaults',
  route: null,
  icon: 'eye',
  sections: [
    {
      id: 'tracking',
      title: 'Analytics & tracking',
      description:
        'No analytics provider is connected yet. When you choose one, paste its snippets here; nothing is loaded while these are empty.',
      fields: [
        {
          name: 'headSnippet',
          label: 'Head snippet',
          type: 'textarea',
          nullable: true,
          seed: '',
          help: 'Paste the exact snippet your analytics provider gives you. It loads at the very start of the page for every visitor. Note: search-console verification meta tags do not work here: ask your developer for those.'
        },
        {
          name: 'googleVerification',
          label: 'Google verification code',
          type: 'text',
          nullable: true,
          seed: '',
          help:
            'From Google Search Console, when it asks you to verify ownership with an HTML tag: paste only the content value (the long code), not the whole tag.'
        },
        {
          name: 'bodySnippet',
          label: 'Body snippet',
          type: 'textarea',
          nullable: true,
          seed: '',
          help: 'For providers that ask for a second snippet. It is injected at the end of <body> on every page.'
        }
      ]
    },
    {
      id: 'seo-defaults',
      title: 'SEO defaults',
      fields: [
        {
          name: 'ogImage',
          label: 'Default share image',
          type: 'image',
          nullable: true,
          seed: null,
          help: 'Shown when a page is shared on social media and has no image of its own. Leave empty for a text-only card.'
        },
        {
          name: 'metaTitleTemplate',
          label: 'Browser title pattern',
          type: 'text',
          seed: '%s · Jigsaw',
          warning:
            'For reference only: the site builds this from the organisation name in Site settings, with %s standing for the page name. Change the organisation name to change it.'
        }
      ]
    }
  ]
};

export const SETTINGS_SINGLETONS = [SITE_SETTINGS, UI_STRINGS, TRACKING];

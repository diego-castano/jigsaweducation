// One singleton per public page. Seeds are the byte-exact strings the pages
// render today: copy that lives in src/data is imported so the seed can never
// drift from the source, copy hardcoded in page JSX is duplicated here
// literally. The wiring phase replaces both with reads from these documents.

import { placeholder } from '../../data/placeholder.js';
import { CORE_SENTENCES, SIGNPOSTS, MAP_SUMMARY, MAP_COUNTRIES } from '../../data/home.js';
import { PARTNERS_INTRO } from '../../data/partners.js';
import { SERVICES_INTRO } from '../../data/services.js';
import { TECHNICAL_FOCUS_INTRO } from '../../data/technical-focus.js';
import {
  DISTINCTIVES_INTRO,
  DISTINCTIVES_PREAMBLE,
  DISTINCTIVES_STATS_CITATION,
  OUR_STORY
} from '../../data/distinctives.js';
import { POLICIES_INTRO, STANDARDS, STANDARDS_INTRO, CONCERNS_CONTACT } from '../../data/policies.js';
import { JOBS_EMPTY_MESSAGE } from '../../data/jobs.js';
import { PUBLICATIONS_INTRO } from '../../data/publications.js';

// Six pages carry notes meant for the review phase, not for the public. They
// render only while site-settings.showReviewNotes is on, so launch day is a
// switch rather than a deletion.
const REVIEW_NOTE_HELP =
  'Internal review note. It only shows on the public page while “Show review notes” is switched on in Site settings, and it disappears everywhere the moment that switch goes off.';

const seoSection = ({ title, titleHelp, description, descriptionHelp }) => ({
  id: 'seo',
  title: 'SEO',
  description: 'How this page appears in search results and the browser tab.',
  fields: [
    {
      name: 'title',
      label: 'Search title',
      type: 'text',
      required: true,
      maxLength: 60,
      help: titleHelp || 'Shown in the browser tab and search results as “(title) — Jigsaw”.',
      seed: title
    },
    {
      name: 'description',
      label: 'Search description',
      type: 'textarea',
      maxLength: 160,
      help:
        descriptionHelp ||
        'The sentence search engines show under the title. Aim for one or two plain sentences.',
      ...(description !== undefined ? { seed: description } : { nullable: true })
    }
  ]
});

export const PAGE_SINGLETONS = [
  {
    key: 'page-home',
    title: 'Home',
    description: 'The front page: four core sentences, three signposts, the map and the partner wall.',
    route: '/',
    icon: 'home',
    sections: [
      {
        id: 'hero',
        title: 'Opening',
        description: 'The four core sentences, the field photo and the two buttons.',
        fields: [
          {
            name: 'headline',
            label: 'Headline (first core sentence)',
            type: 'text',
            required: true,
            verbatim: true,
            warning:
              'The headline must contain the exact phrase “education research” — the page finds that phrase inside the sentence to set it in italics. Reword or remove the phrase and the headline styling breaks.',
            help: 'The first of the four core sentences from the brief; it is the large headline.',
            seed: CORE_SENTENCES[0]
          },
          {
            name: 'supportingSentences',
            label: 'Supporting sentences',
            type: 'list',
            itemLabel: 'Sentence',
            fixed: true,
            verbatim: true,
            help: 'Core sentences two to four, shown as three ruled lines under the headline.',
            of: [{ name: 'text', label: 'Sentence', type: 'text', required: true }],
            seed: CORE_SENTENCES.slice(1).map((text) => ({ text }))
          },
          {
            name: 'primaryCtaLabel',
            label: 'Orange button label',
            type: 'text',
            required: true,
            help: 'The main button under the sentences. It always opens the Case studies page.',
            seed: 'See our work'
          },
          {
            name: 'secondaryCtaLabel',
            label: 'Text link label',
            type: 'text',
            required: true,
            help: 'The quieter link beside the button. It always opens the Publications page.',
            seed: 'Evidence library'
          },
          {
            name: 'heroPhoto',
            label: 'Hero photograph',
            type: 'image',
            required: true,
            help:
              'The photo on the right of the opening. Jigsaw’s own photographs only — no stock imagery and no AI-generated people; identifiable faces need written consent.',
            seed:
              'https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/image_asset/file/44/tile_fill_Dubai_Cares_-_ecubed_-_2019_-_participatory_activity.JPG'
          },
          {
            name: 'heroPhotoLink',
            label: 'Photo links to',
            type: 'link',
            help: 'The case study the photo opens when clicked.',
            seed: '/case-studies/voices-of-refugee-youth'
          },
          {
            name: 'heroPhotoCredit',
            label: 'Photo caption',
            type: 'text',
            help: 'The one-line credit under the photo, naming the study it comes from.',
            seed: 'Voices of Refugee Youth, Pakistan and Rwanda'
          },
          {
            name: 'statYearsLabel',
            label: 'Stat line — years label',
            type: 'text',
            help:
              'The word after the years figure in the small line under the photo. The figures themselves live in Settings → Organisation.',
            seed: 'years'
          },
          {
            name: 'statAssignmentsLabel',
            label: 'Stat line — assignments label',
            type: 'text',
            help: 'The word after the assignments figure.',
            seed: 'assignments'
          },
          {
            name: 'statOrganisationsLabel',
            label: 'Stat line — organisations label',
            type: 'text',
            help: 'The word after the organisations figure.',
            seed: 'organisations'
          }
        ]
      },
      {
        id: 'signposts',
        title: 'Three ways in',
        description: 'The three boxes pointing at Services, Technical focus and Distinctives.',
        fields: [
          {
            name: 'signposts',
            label: 'Signpost boxes',
            type: 'list',
            itemLabel: 'Signpost',
            fixed: true,
            help:
              'The three boxes in the brief’s order. Titles and destinations are fixed by the brief; the summaries are still awaited from the Jigsaw team.',
            of: [
              { name: 'title', label: 'Title', type: 'text', required: true },
              {
                name: 'summary',
                label: 'Summary',
                type: 'textarea',
                help: 'One or two sentences saying what the page offers.'
              },
              {
                name: 'secondaryLinkLabel',
                label: 'Extra link label',
                type: 'text',
                nullable: true,
                help:
                  'Only the Distinctives box carries this: a second link to the Our story section. Leave blank on the other two.'
              }
            ],
            seed: SIGNPOSTS.map((s) => ({
              title: s.title,
              summary: s.summary,
              secondaryLinkLabel: s.secondaryLink ? s.secondaryLink.label : null
            }))
          }
          // The shared “Read more” link label lives in ui-strings (readMore),
          // one source for all three boxes.
        ]
      },
      {
        id: 'map',
        title: 'Where we work',
        description: 'The world map, its summary sentence and the country list behind it.',
        fields: [
          {
            name: 'mapHeading',
            label: 'Section heading',
            type: 'text',
            required: true,
            seed: 'Global reach, local evidence'
          },
          {
            name: 'mapSummary',
            label: 'Summary beside the map',
            type: 'textarea',
            help: 'A short paragraph about where Jigsaw works. Still awaited from the Jigsaw team.',
            seed: MAP_SUMMARY
          },
          {
            name: 'mapNote',
            label: 'Note under the summary',
            type: 'text',
            help:
              'Follows the automatic “(number) countries shown.” count — the count itself comes from the country list below and cannot be typed.',
            seed: 'Drawn from our published case studies and not yet complete.'
          },
          {
            name: 'mapCountries',
            label: 'Countries on the map',
            type: 'list',
            itemLabel: 'Country',
            minItems: 1,
            help:
              'Every country highlighted on the map. Tick “Office” for the two countries with a Jigsaw office — they fill orange instead of blue. The countries-shown count updates from this list.',
            of: [
              {
                name: 'country',
                label: 'Country',
                type: 'country',
                required: true,
                help: 'Pick from the list — a mistyped country silently drops off the map.'
              },
              { name: 'office', label: 'Office', type: 'boolean' }
            ],
            seed: MAP_COUNTRIES.map(({ name, id, office }) => ({
              country: { name, id },
              office: Boolean(office)
            }))
          },
          {
            name: 'legendOfficesLabel',
            label: 'Legend — offices',
            type: 'text',
            help: 'The label beside the orange square under the map.',
            seed: 'Our offices'
          },
          {
            name: 'legendWorkedLabel',
            label: 'Legend — where we have worked',
            type: 'text',
            help: 'The label beside the blue square under the map.',
            seed: 'Where we have worked'
          }
        ]
      },
      {
        id: 'partners',
        title: 'Who we work with',
        description:
          'The heading, the client’s paragraph and the logo wall. The eighteen partners themselves are edited under Partners.',
        fields: [
          {
            name: 'partnersKicker',
            label: 'Kicker',
            type: 'text',
            help: 'The small capitals line above the heading.',
            seed: 'Who we work with'
          },
          {
            name: 'partnersHeading',
            label: 'Section heading',
            type: 'text',
            required: true,
            seed: 'Partners in building evidence'
          },
          {
            name: 'partnersIntro',
            label: 'Partners paragraph',
            type: 'textarea',
            verbatim: true,
            warning:
              'The 15 years, 150 assignments and 50 organisations figures in this paragraph also appear in the hero stat line and the site description, fed from Settings → Organisation. Changing a figure in one place does not update the others — and the figures themselves are still under discussion with the client.',
            seed: PARTNERS_INTRO
          },
          {
            name: 'partnerWallNote',
            label: 'Pending-logos note',
            type: 'text',
            help: `The small line under the logo wall while the partner logo files are pending. ${REVIEW_NOTE_HELP}`,
            seed: 'Names are set in type while the partner logo files are pending.'
          }
        ]
      },
      seoSection({
        title: 'Jigsaw — Rigorous evidence for lasting change in education',
        titleHelp:
          'Used exactly as written — the home page is the one page that does not add the “— Jigsaw” suffix.',
        description:
          'Jigsaw is an education research practice. We work globally and focus on countries with the biggest education challenges, building and using evidence to improve learning and strengthen education systems.'
      })
    ]
  },

  {
    key: 'page-services',
    title: 'Services',
    description: 'The services index. The six services themselves are edited under Services.',
    route: '/services',
    icon: 'compass',
    sections: [
      {
        id: 'opener',
        title: 'Left rail',
        description: 'The page title and framing text that stay put while the index scrolls.',
        fields: [
          {
            name: 'heading',
            label: 'Page title',
            type: 'text',
            required: true,
            seed: 'Services'
          },
          {
            name: 'intro',
            label: 'Introduction',
            type: 'textarea',
            help:
              'The paragraph under the title, explaining what Jigsaw means by services. Still awaited from the Jigsaw team.',
            seed: SERVICES_INTRO
          },
          {
            name: 'countCaption',
            label: 'Count caption',
            type: 'text',
            help:
              'The small line above the see-also links. If the number of services ever changes, the word “Six” needs changing with it.',
            seed: 'Six ways of working'
          },
          {
            name: 'seeAlsoFirstLabel',
            label: 'See-also link one',
            type: 'text',
            help:
              'The sentence reads “See also (one) and (two).” — only the two link labels change here. This one opens Technical focus.',
            seed: 'Technical focus'
          },
          {
            name: 'seeAlsoSecondLabel',
            label: 'See-also link two',
            type: 'text',
            help: 'The second link in the see-also sentence. It opens the Team page.',
            seed: 'Team'
          }
        ]
      },
      seoSection({
        title: 'Services',
        description:
          'Large-scale mixed-method studies, design-based and implementation research, research localisation and capacity strengthening, technical assistance and evidence synthesis, strategy and advisory, and embedded learning partnerships.',
        descriptionHelp:
          'This description lists the six service names — if a service is renamed under Services, rename it here too.'
      })
    ]
  },

  {
    key: 'page-technical-focus',
    title: 'Technical focus',
    description: 'The focus-area mosaic. The eight areas themselves are edited under Technical focus.',
    route: '/technical-focus',
    icon: 'microscope',
    sections: [
      {
        id: 'opener',
        title: 'Opener',
        fields: [
          {
            name: 'heading',
            label: 'Page title',
            type: 'text',
            required: true,
            seed: 'Technical focus'
          },
          {
            name: 'intro',
            label: 'Introduction',
            type: 'textarea',
            help:
              'The paragraph beside the title, explaining why Jigsaw focuses on certain areas. Still awaited from the Jigsaw team.',
            seed: TECHNICAL_FOCUS_INTRO
          },
          {
            name: 'instruction',
            label: 'Mosaic helper line',
            type: 'text',
            help: 'The short sentence above the tiles telling the reader what tapping one does.',
            seed: 'Select an area for its summary and the case studies behind it.'
          }
        ]
      },
      seoSection({
        title: 'Technical focus',
        description:
          'Climate-resilient learning environments, education financing, education in crisis and conflict, education policy and systems, foundational learning, skills and pathways to employment, teacher professional development, and technology and education.',
        descriptionHelp:
          'This description lists the eight area names — if an area is renamed under Technical focus, rename it here too.'
      })
    ]
  },

  {
    key: 'page-distinctives',
    title: 'Distinctives',
    description: 'What sets Jigsaw apart, plus the Our story section the About page left behind.',
    route: '/distinctives',
    icon: 'sparkles',
    sections: [
      {
        id: 'opener',
        title: 'Opener',
        fields: [
          {
            name: 'heading',
            label: 'Page title',
            type: 'text',
            required: true,
            seed: 'Distinctives'
          },
          {
            name: 'introOne',
            label: 'Opening paragraph',
            type: 'textarea',
            verbatim: true,
            seed: DISTINCTIVES_INTRO[0]
          },
          {
            name: 'introTwo',
            label: 'Second paragraph (the challenge)',
            type: 'textarea',
            verbatim: true,
            warning:
              'The 80%, 250 million and 260 million figures in this paragraph are repeated as the large statistics band below. If a figure changes here, change it in the statistics too — the page does not keep them in step.',
            seed: DISTINCTIVES_INTRO[1]
          }
        ]
      },
      {
        id: 'stats',
        title: 'Statistics band',
        description: 'The three counting figures on the navy band.',
        fields: [
          {
            name: 'crisisStats',
            label: 'Statistics',
            type: 'list',
            itemLabel: 'Statistic',
            fixed: true,
            warning:
              'These three figures restate the second opening paragraph. Keep the paragraph and the band agreeing with each other.',
            of: [
              {
                name: 'value',
                label: 'Figure',
                type: 'number',
                required: true,
                help: 'The number that counts up — just the digits.'
              },
              {
                name: 'unit',
                label: 'Unit',
                type: 'text',
                help: 'The orange suffix after the number: % or m.'
              },
              { name: 'label', label: 'Caption', type: 'text', required: true }
            ],
            seed: [
              {
                value: 80,
                unit: '%',
                label: 'of children aged 10 in the lowest income countries cannot read a simple text'
              },
              { value: 250, unit: 'm', label: 'children never go to school' },
              { value: 260, unit: 'm', label: 'children cannot learn because of crisis and conflict' }
            ]
          },
          {
            name: 'statsCitation',
            label: 'Citation URL',
            type: 'url',
            nullable: true,
            help:
              'The source for the three figures — still awaited from the Jigsaw team. While it is empty the band prints a note that the figures should not publish unsourced.',
            seed: DISTINCTIVES_STATS_CITATION
          }
        ]
      },
      {
        id: 'editorial',
        title: 'Editorial band',
        description: 'The display-size third paragraph and the preamble beneath it.',
        fields: [
          {
            name: 'introThree',
            label: 'Display paragraph',
            type: 'textarea',
            verbatim: true,
            warning:
              'Three exact phrases in this paragraph must survive any edit: “suite of bespoke services” and “technical areas” become the links to Services and Technical focus, and “bend the curve of progress” is set in italics. The page finds each phrase inside the text — reword one and its link or italic silently disappears with no error.',
            seed: DISTINCTIVES_INTRO[2]
          },
          {
            name: 'preamble',
            label: 'Preamble',
            type: 'textarea',
            verbatim: true,
            help: 'Runs in two columns under the display paragraph.',
            seed: DISTINCTIVES_PREAMBLE
          }
        ]
      },
      {
        id: 'rows',
        title: 'The five distinctives',
        fields: [
          {
            name: 'rowsHeading',
            label: 'Section heading',
            type: 'text',
            required: true,
            seed: 'What you should experience'
          },
          // The five rows themselves are the Distinctives collection —
          // one source of truth, edited under Content → Distinctives.
          {
            name: 'testimonialSlug',
            label: 'Quote between the rows',
            type: 'text',
            help:
              'Which testimonial breaks the run between rows three and four — the slug of an entry under Testimonials. Only real quotations from the live site; never invent praise.',
            seed: 'idrc'
          }
        ]
      },
      {
        id: 'story',
        title: 'Our story',
        description:
          'The About-page content the new sitemap retired. The Home page signpost links straight here.',
        fields: [
          {
            name: 'storyHeading',
            label: 'Section heading',
            type: 'text',
            required: true,
            seed: OUR_STORY.heading
          },
          {
            name: 'storyBody',
            label: 'Story',
            type: 'richtext',
            help:
              'The origin story carried over from the retired About page. Still awaited — note the founding date (2009, 2013 or 15 years ago) is unresolved.',
            seed: OUR_STORY.body
          },
          {
            name: 'storyMilestones',
            label: 'Timeline',
            type: 'list',
            itemLabel: 'Milestone',
            minItems: 1,
            help: 'The dotted rail beside the story. Each milestone needs a year and a sentence.',
            of: [
              {
                name: 'year',
                label: 'Year',
                type: 'text',
                nullable: true,
                help: 'Shows as “Year tbc” until filled in.'
              },
              { name: 'text', label: 'What happened', type: 'textarea', required: true }
            ],
            seed: [
              {
                year: null,
                text: placeholder('first milestone: the founding year and what Jigsaw set out to do')
              },
              {
                year: null,
                text: placeholder(
                  'second milestone: the point at which the team or country footprint changed'
                )
              },
              { year: null, text: placeholder('third milestone: where the practice stands today') }
            ]
          },
          {
            name: 'foundingDateNote',
            label: 'Founding-date note',
            type: 'textarea',
            help: REVIEW_NOTE_HELP,
            seed:
              'Founding date unresolved: the live site says over the last decade, the Decade in Review covers 2013 to 2023, the July brief says 15 years, and company 06844615 dates to roughly 2009. One date needs choosing before this section publishes.'
          }
        ]
      },
      seoSection({
        title: 'Distinctives',
        description:
          'What you should experience when you work with Jigsaw: evidence uptake, combining global and national, mixed methods research, real partnership, and positive disruption.',
        descriptionHelp:
          'This description names the five distinctives — if one is retitled above, retitle it here too.'
      })
    ]
  },

  {
    key: 'page-team',
    title: 'Team',
    description: 'The team grid opener and band. The people themselves are edited under Team.',
    route: '/team',
    icon: 'users',
    sections: [
      {
        id: 'opener',
        title: 'Opener',
        fields: [
          {
            name: 'heading',
            label: 'Page title',
            type: 'text',
            required: true,
            seed: 'Team'
          },
          {
            name: 'statSuffix',
            label: 'Stat line suffix',
            type: 'text',
            help:
              'Follows the automatic researcher count under the title, reading “(number) researchers · London & Lusaka”. The count comes from the Team list and cannot be typed.',
            seed: 'researchers · London & Lusaka'
          },
          {
            name: 'introLead',
            label: 'Team introduction',
            type: 'textarea',
            verbatim: true,
            help:
              'The client’s team paragraph, minus its closing sentence — that sentence sits in the band under the grid, and the two fields together are the paragraph word for word.',
            seed:
              'We are a group of mixed-method education applied researchers. Our team has diverse professional backgrounds, made up of former teachers, education implementers, NGO workers, and academics. We are united by our shared drive to strengthen education in the world’s most challenging contexts. All the work that we do to build and use evidence in education is founded on the skills and expertise of our team. Most of us are based in London or Lusaka.'
          }
        ]
      },
      {
        id: 'band',
        title: 'Band under the grid',
        description: 'The contractors sentence and its two links.',
        fields: [
          {
            name: 'contractorsSentence',
            label: 'Contractors sentence',
            type: 'textarea',
            verbatim: true,
            help:
              'The closing sentence of the client’s team paragraph, shown under the grid because it is about people the grid cannot show.',
            seed:
              'In addition to our core staff team shown here, Jigsaw also works with a trusted group of contractors and advisers.'
          },
          {
            name: 'workWithUsLabel',
            label: 'First link label',
            type: 'text',
            help: 'Opens the Work for us page.',
            seed: 'Work with us'
          },
          {
            name: 'talkToTeamLabel',
            label: 'Second link label',
            type: 'text',
            help: 'Opens the Contact page.',
            seed: 'Talk to the team'
          }
        ]
      },
      seoSection({
        title: 'Team',
        description:
          'A group of mixed-method education applied researchers with backgrounds as teachers, education implementers, NGO workers and academics, based mostly in London and Lusaka.'
      })
    ]
  },

  {
    key: 'page-case-studies',
    title: 'Case studies',
    description: 'The case-studies browser. The studies themselves are edited under Case studies.',
    route: '/case-studies',
    icon: 'book-open',
    sections: [
      {
        id: 'hero',
        title: 'Hero',
        fields: [
          {
            name: 'kicker',
            label: 'Kicker',
            type: 'text',
            help: 'The small capitals line above the title.',
            seed: 'Our work'
          },
          {
            name: 'heading',
            label: 'Page title',
            type: 'text',
            required: true,
            seed: 'Case studies'
          },
          {
            name: 'lede',
            label: 'Introduction',
            type: 'textarea',
            help:
              'The brief requires this paragraph to say plainly that the case studies are indicative rather than comprehensive. The current wording is ours and still needs the Jigsaw team’s sign-off.',
            seed:
              'These case studies are indicative of our work rather than a comprehensive record. Much of what we do is confidential and cannot be published. The examples here show the range of partners we work with, the methods we use, and the contexts we work in.'
          }
        ]
      },
      {
        id: 'notices',
        title: 'Study-page notices',
        description: 'Internal notices shown on individual case-study pages during review.',
        fields: [
          {
            name: 'draftNotice',
            label: 'Draft banner',
            type: 'textarea',
            help: `Shown on every study still flagged as restructured-by-us rather than approved. ${REVIEW_NOTE_HELP}`,
            seed:
              'Draft. This text was restructured from Jigsaw’s existing case study into the four-section format the new brief specifies. It needs the team’s approval before it publishes.'
          }
        ]
      },
      seoSection({
        title: 'Case studies',
        description:
          'Indicative examples of Jigsaw’s work with partners including UNICEF, UNHCR, FCDO, Dubai Cares, the World Bank and EdTech Hub, across education technology, refugee education, teacher development and girls’ education.'
      })
    ]
  },

  {
    key: 'page-publications',
    title: 'Publications',
    description: 'The evidence library. The publications themselves are edited under Publications.',
    route: '/publications',
    icon: 'file-text',
    sections: [
      {
        id: 'hero',
        title: 'Hero',
        fields: [
          {
            name: 'kicker',
            label: 'Kicker',
            type: 'text',
            help: 'The small capitals line above the title.',
            seed: 'Evidence library'
          },
          {
            name: 'heading',
            label: 'Page title',
            type: 'text',
            required: true,
            seed: 'Publications'
          },
          {
            name: 'intro',
            label: 'Introduction',
            type: 'textarea',
            verbatim: true,
            seed: PUBLICATIONS_INTRO
          },
          {
            name: 'itemsPerPage',
            label: 'Publications per page',
            type: 'number',
            seed: 8,
            help: 'How many publications show before the Previous/Next buttons appear.'
          }
        ]
      },
      {
        id: 'notes',
        title: 'Build note',
        fields: [
          {
            name: 'libraryNote',
            label: 'Library-status note',
            type: 'textarea',
            help: `The page puts “These (number)” in front of this text automatically, using the live publication count. ${REVIEW_NOTE_HELP}`,
            seed:
              'outputs are what is public on the current site. The full library is expected to run to roughly 100 entries, fed from the team’s log frame. Dates, authors and abstracts are missing from every publication today and will need filling before launch.'
          }
        ]
      },
      // The publication-page back-link label lives in ui-strings
      // (breadcrumbPublications) beside the other two breadcrumbs.
      seoSection({
        title: 'Publications',
        description:
          'The Jigsaw evidence library: learning briefs, research reports, policy briefs and annual reviews authored or co-authored by our team. All free to download.'
      })
    ]
  },

  {
    key: 'page-contact',
    title: 'Contact',
    description: 'The contact page. Office emails and addresses are edited in Settings → Organisation.',
    route: '/contact',
    icon: 'mail',
    sections: [
      {
        id: 'hero',
        title: 'Opener',
        fields: [
          {
            name: 'heading',
            label: 'Page title',
            type: 'text',
            required: true,
            seed: 'Contact'
          },
          {
            name: 'lede',
            label: 'Introduction',
            type: 'textarea',
            seed:
              'Get in touch with us to talk about building and using evidence for education in your work.'
          }
        ]
      },
      {
        id: 'signup',
        title: 'Mailing-list strip',
        fields: [
          {
            name: 'signupText',
            label: 'Sign-up sentence',
            type: 'textarea',
            help: 'The sentence beside the sign-up form.',
            seed:
              'Sign up here if you would like to receive occasional updates about Jigsaw’s work.'
          }
        ]
      },
      {
        id: 'offices',
        title: 'Offices',
        description:
          'The two offices sit side by side with no hierarchy — that layout is fixed. Their emails and addresses are edited in Settings → Organisation.',
        fields: [
          {
            name: 'officesHeading',
            label: 'Addresses heading',
            type: 'text',
            required: true,
            seed: 'Two offices, one team'
          }
        ]
      },
      seoSection({
        title: 'Contact',
        description:
          'Get in touch with Jigsaw about building and using evidence for education. Offices in London, United Kingdom and Lusaka, Zambia.'
      })
    ]
  },

  {
    key: 'page-policies',
    title: 'Policies',
    description: 'The governance page. The policy documents themselves are edited under Policies.',
    route: '/policies',
    icon: 'shield',
    sections: [
      {
        id: 'hero',
        title: 'Hero',
        fields: [
          {
            name: 'kicker',
            label: 'Kicker',
            type: 'text',
            help: 'The small capitals line above the title.',
            seed: 'Governance'
          },
          {
            name: 'heading',
            label: 'Page title',
            type: 'text',
            required: true,
            seed: 'Policies'
          },
          {
            name: 'lede',
            label: 'Introduction',
            type: 'textarea',
            verbatim: true,
            seed: POLICIES_INTRO
          }
        ]
      },
      {
        id: 'status',
        title: 'Build notes',
        description: 'Two paragraphs of build commentary that must not survive launch.',
        fields: [
          {
            name: 'pendingNote',
            label: 'Missing-documents note',
            type: 'textarea',
            help: REVIEW_NOTE_HELP,
            seed:
              'None of the six policies above are published on the current site. The documents need to come from the Jigsaw team before this page goes live.'
          },
          {
            name: 'carriedOverNote',
            label: 'Carried-over note',
            type: 'textarea',
            help: REVIEW_NOTE_HELP,
            seed:
              'These two are live on the current site but are not in the new brief’s list. Carried over rather than dropped, since they are real published commitments.'
          },
          {
            name: 'alsoPublishedHeading',
            label: '“Also published” heading',
            type: 'text',
            seed: 'Also published'
          }
        ]
      },
      {
        id: 'standards',
        title: 'Standards',
        fields: [
          {
            name: 'standardsHeading',
            label: 'Section heading',
            type: 'text',
            required: true,
            seed: 'Standards we commit to'
          },
          {
            name: 'standardsIntro',
            label: 'Standards sentence',
            type: 'textarea',
            verbatim: true,
            seed: STANDARDS_INTRO
          },
          {
            name: 'standards',
            label: 'Standards',
            type: 'list',
            itemLabel: 'Standard',
            minItems: 1,
            of: [
              { name: 'title', label: 'Name', type: 'text', required: true },
              { name: 'url', label: 'Link', type: 'url', required: true }
            ],
            seed: STANDARDS.map(({ title, url }) => ({ title, url }))
          }
        ]
      },
      {
        id: 'concerns',
        title: 'Reporting a concern',
        fields: [
          {
            name: 'concernsHeading',
            label: 'Card heading',
            type: 'text',
            required: true,
            seed: 'Reporting a concern'
          },
          {
            name: 'concernsContact',
            label: 'Reporting email',
            type: 'email',
            nullable: true,
            help:
              'Where concerns about Jigsaw’s work should be reported — still awaited from the Jigsaw team. While it is empty the card explains that the reporting route is to be confirmed; once filled it reads “To report any concerns about Jigsaw’s work please contact (email)”.',
            seed: CONCERNS_CONTACT
          }
        ]
      },
      seoSection({
        title: 'Policies',
        description:
          'Jigsaw’s publicly available policies covering privacy, whistleblowing, ethics, data protection, cybersecurity and safeguarding, plus the standards we commit to.'
      })
    ]
  },

  {
    key: 'page-work-for-us',
    title: 'Work for us',
    description:
      'The careers holding page. The brief supplies no introduction, so the hero deliberately has no lede.',
    route: '/work-for-us',
    icon: 'briefcase',
    sections: [
      {
        id: 'hero',
        title: 'Hero',
        fields: [
          {
            name: 'kicker',
            label: 'Kicker',
            type: 'text',
            help: 'The small capitals line above the title.',
            seed: 'Careers'
          },
          {
            name: 'heading',
            label: 'Page title',
            type: 'text',
            required: true,
            seed: 'Work for us'
          }
        ]
      },
      {
        id: 'opportunities',
        title: 'Opportunities',
        description: 'Vacancies themselves are edited under Jobs; this page holds the framing copy.',
        fields: [
          {
            name: 'opportunitiesHeading',
            label: 'Section heading',
            type: 'text',
            required: true,
            seed: 'Current opportunities'
          },
          {
            name: 'emptyMessage',
            label: 'No-vacancies message',
            type: 'text',
            verbatim: true,
            help: 'Shown in the card whenever the Jobs list is empty.',
            seed: JOBS_EMPTY_MESSAGE
          },
          {
            name: 'interestSentence',
            label: 'Interest sentence',
            type: 'textarea',
            verbatim: true,
            warning:
              'The exact phrases “contact us” and “sign-up” must survive any edit — the page turns them into the links to the Contact page and the sign-up form, and the client’s hyphen in “sign-up” is deliberate (an earlier rewrite was reverted). Reword either phrase and its link silently disappears.',
            seed: 'If you are interested in working at Jigsaw, please contact us or sign-up to receive updates.'
          }
        ]
      },
      {
        id: 'notes',
        title: 'Build note',
        fields: [
          {
            name: 'openQuestionNote',
            label: 'Mailing-list question',
            type: 'textarea',
            help: REVIEW_NOTE_HELP,
            seed:
              'Open question for the client: should vacancies use a separate mailing list, or the general updates list? This form currently points at the general one.'
          }
        ]
      },
      seoSection({
        title: 'Work for us',
        description:
          'Current opportunities at Jigsaw Education Evidence, an education research practice with offices in London and Lusaka.'
      })
    ]
  },

  {
    // No fixed route of its own: any unmatched URL renders it. /404 matches
    // nothing, so it works as the preview address.
    key: 'page-not-found',
    title: 'Page not found',
    description: 'The 404 page shown for any address that does not exist.',
    route: '/404',
    icon: 'alert',
    sections: [
      {
        id: 'copy',
        title: 'Copy',
        fields: [
          {
            name: 'numeral',
            label: 'Display numeral',
            type: 'text',
            help: 'The oversized figure above the heading.',
            seed: '404'
          },
          {
            name: 'heading',
            label: 'Heading',
            type: 'text',
            required: true,
            seed: 'We can’t find that piece.'
          },
          {
            name: 'lede',
            label: 'Explanation',
            type: 'textarea',
            seed:
              'The page you were looking for has moved or never existed. The links below cover most of what is here.'
          },
          {
            name: 'ctaHomeLabel',
            label: 'First button label',
            type: 'text',
            help: 'Opens the home page.',
            seed: 'Back to home'
          },
          {
            name: 'ctaLibraryLabel',
            label: 'Second button label',
            type: 'text',
            help: 'Opens the Publications page.',
            seed: 'Evidence library'
          },
          {
            name: 'ctaContactLabel',
            label: 'Third button label',
            type: 'text',
            help: 'Opens the Contact page.',
            seed: 'Contact us'
          }
        ]
      },
      seoSection({
        title: 'Page not found',
        descriptionHelp:
          'The 404 page publishes no search description and search engines are told not to index it; leave this blank unless that changes.'
      })
    ]
  }
];

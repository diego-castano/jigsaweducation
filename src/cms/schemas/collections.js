// Every repeatable content type on the site, declared per the DSL in
// src/cms/schema.js. Field shapes mirror src/data/* exactly — the wiring
// phase depends on that equivalence, so a field here stores what the data
// file stores, nothing renamed and nothing restructured.
//
// Two conventions this file adds on top of the DSL:
//
// 1. A list whose `of` holds a single field named `value` stores BARE values
//    (an array of strings), because that is how src/data keeps countries,
//    topics and partners. Multi-field lists (case-study links) store objects.
//
// 2. A dotted field name addresses a nested key in the jsonb document:
//    'sections.criticalQuestion' reads and writes data.sections.criticalQuestion.
//    Case studies are the only collection that needs this.
//
// Select options below are seeded from src/data at module load. Once content
// lives in the database the admin should refresh them from the live
// collections (a case study created in the admin must appear in the
// publications caseStudySlug picker), keeping these arrays as the fallback.

import { SERVICES } from '../../data/services.js';
import { TECHNICAL_FOCUS } from '../../data/technical-focus.js';
import { CASE_STUDIES } from '../../data/case-studies.js';
import { PUBLICATIONS, PUBLICATION_TYPES } from '../../data/publications.js';

const SERVICE_TITLES = SERVICES.map((s) => s.title);
const FOCUS_TITLES = TECHNICAL_FOCUS.map((t) => t.title);
const CASE_STUDY_SLUGS = CASE_STUDIES.map((c) => c.slug);
const REGIONS = [...new Set(PUBLICATIONS.map((p) => p.region).filter(Boolean))];

// The client's locked photo policy, restated wherever an image is picked.
const PHOTO_POLICY =
  'Our own photographs only — no stock imagery and no AI-generated people. ' +
  'Identifiable faces need written consent, with extra care for children.';

const textList = (name, label, itemLabel, help) => ({
  name,
  label,
  help,
  type: 'list',
  itemLabel,
  of: [{ name: 'value', label: itemLabel, type: 'text' }]
});

export const COLLECTIONS = [
  {
    key: 'team',
    title: 'Team',
    itemLabel: 'team member',
    route: '/team',
    itemRoute: '/team/:slug',
    icon: 'users',
    orderable: true,
    titleField: 'name',
    listColumns: ['role', 'country'],
    slugFrom: 'name',
    editorSections: [
      { id: 'profile', title: 'Profile', fields: ['name', 'role', 'country', 'photo'] },
      { id: 'bio', title: 'Bio', fields: ['bio'] },
      { id: 'links', title: 'Links', fields: ['linkedin', 'orcid'] },
      { id: 'workflow', title: 'Workflow', fields: ['needsReview'] }
    ],
    // `bioWordCount` in the seed data is derived from `bio`; the save path
    // recomputes it rather than exposing it as a field.
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        help: 'As it appears on the team card and the profile page.'
      },
      {
        name: 'role',
        label: 'Role',
        type: 'text',
        required: true,
        help: 'Job title shown under the name, e.g. Research Manager.'
      },
      {
        name: 'country',
        label: 'Country',
        type: 'text',
        nullable: true,
        help:
          'Leave blank unless the person states a base — the card simply omits ' +
          'the chip rather than publish a guess about where someone lives.'
      },
      {
        name: 'bio',
        label: 'Bio',
        type: 'richtext',
        required: true,
        maxWords: 150,
        verbatim: true,
        help: 'The person’s own words, 150 words at most.'
      },
      {
        name: 'photo',
        label: 'Photo',
        type: 'image',
        nullable: true,
        help:
          `${PHOTO_POLICY} Upload the colour original — the site applies the ` +
          'blue treatment itself. Left empty, the card shows an initials tile.'
      },
      {
        name: 'linkedin',
        label: 'LinkedIn',
        type: 'url',
        nullable: true,
        help: 'Full address of their LinkedIn profile, if they want it shown.'
      },
      {
        name: 'orcid',
        label: 'ORCID',
        type: 'url',
        nullable: true,
        help: 'Their ORCID address, e.g. https://orcid.org/0000-0000-0000-0000.'
      },
      {
        name: 'needsReview',
        label: 'Needs review',
        type: 'boolean',
        help:
          'On while this profile still needs checking with the person before ' +
          'it counts as final.'
      }
    ]
  },

  {
    key: 'case-studies',
    title: 'Case studies',
    itemLabel: 'case study',
    route: '/case-studies',
    itemRoute: '/case-studies/:slug',
    icon: 'file-text',
    orderable: true,
    titleField: 'title',
    listColumns: ['service', 'method'],
    slugFrom: 'title',
    // How the editor groups this form; names refer to fields below.
    editorSections: [
      {
        id: 'basics',
        title: 'The study',
        description: 'Everything the summary box and the filters read.',
        fields: ['title', 'countries', 'partners', 'service', 'topics', 'method']
      },
      {
        id: 'card',
        title: 'Card',
        description: 'How the study appears on the case studies page.',
        fields: ['summary', 'image']
      },
      {
        id: 'body',
        title: 'The four sections',
        description: 'The fixed structure every case study page follows.',
        fields: [
          'sections.criticalQuestion',
          'sections.collaboration',
          'sections.buildingEvidence',
          'sections.pathwaysToUptake'
        ]
      },
      {
        id: 'linksAndWorkflow',
        title: 'Links & workflow',
        fields: ['links', 'sourceUrl', 'isDerived']
      }
    ],
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        warning:
          'The web address comes from this title when the study is first ' +
          'saved and never changes afterwards — publications and other pages ' +
          'link to it by that address.'
      },
      textList(
        'countries',
        'Countries',
        'Country',
        'Shown in the summary box and used by the country filter. Name each ' +
          'country the study worked in.'
      ),
      textList(
        'partners',
        'Partners',
        'Partner',
        'The organisations named in the summary box, in the order to show them.'
      ),
      {
        name: 'service',
        label: 'Service',
        type: 'select',
        options: SERVICE_TITLES,
        required: true,
        warning:
          'Links the study to its box on the Services page — the match is ' +
          'word for word, so pick from the list rather than retyping.'
      },
      {
        name: 'topics',
        label: 'Topics',
        type: 'list',
        itemLabel: 'Topic',
        help:
          'The technical focus areas this study touches. Pick from the list ' +
          'so the study appears under the right boxes on the Technical focus page.',
        of: [
          {
            name: 'value',
            label: 'Topic',
            type: 'select',
            options: FOCUS_TITLES,
            allowCustom: true
          }
        ]
      },
      {
        name: 'method',
        label: 'Method',
        type: 'text',
        help: 'A short label for the study design, e.g. Longitudinal panel study.'
      },
      {
        name: 'summary',
        label: 'Summary',
        type: 'textarea',
        required: true,
        help: 'One or two sentences for the card on the case studies page.'
      },
      // The four-section body is fixed by the brief: every case study page
      // carries these four named sections, nothing more, nothing fewer.
      {
        name: 'sections.criticalQuestion',
        label: 'The critical question',
        type: 'richtext',
        help:
          'Three sentences at most — the gap or problem the study set out to ' +
          'answer.'
      },
      {
        name: 'sections.collaboration',
        label: 'Collaboration',
        type: 'richtext',
        help:
          'Three sentences at most — who commissioned the work and who we ' +
          'delivered it with.'
      },
      {
        name: 'sections.buildingEvidence',
        label: 'Building evidence',
        type: 'richtext',
        help: 'Three to five sentences — the design, the data and the scale.'
      },
      {
        name: 'sections.pathwaysToUptake',
        label: 'Pathways to evidence uptake',
        type: 'richtext',
        help:
          'Two or three sentences — what was published and how the findings ' +
          'get used.'
      },
      {
        name: 'image',
        label: 'Image',
        type: 'image',
        nullable: true,
        help: `Photograph for the card and the study page. ${PHOTO_POLICY}`
      },
      {
        name: 'links',
        label: 'Links',
        type: 'list',
        itemLabel: 'Link',
        help: 'Reports and related pages listed at the end of the study.',
        of: [
          {
            name: 'label',
            label: 'Label',
            type: 'text',
            required: true,
            help: 'What the link says, e.g. the report’s title.'
          },
          { name: 'url', label: 'Address', type: 'url', required: true }
        ]
      },
      {
        name: 'sourceUrl',
        label: 'Source page',
        type: 'url',
        help:
          'Where this copy came from on the old site — kept for reference in ' +
          'the admin, never shown on the page.'
      },
      {
        name: 'isDerived',
        label: 'Draft text',
        type: 'boolean',
        help:
          'Shows the draft-approval banner while on. Turn it off once the ' +
          'team has approved the restructured four-section text.'
      }
    ]
  },

  {
    key: 'publications',
    title: 'Publications',
    itemLabel: 'publication',
    route: '/publications',
    itemRoute: '/publications/:slug',
    icon: 'book-open',
    orderable: false,
    titleField: 'title',
    listColumns: ['type', 'year'],
    slugFrom: 'title',
    editorSections: [
      {
        id: 'basics',
        title: 'The publication',
        fields: ['type', 'title', 'authors', 'date', 'year']
      },
      {
        id: 'classification',
        title: 'Classification',
        description: 'These values feed the library filters.',
        fields: ['region', 'countries', 'method', 'topic']
      },
      { id: 'text', title: 'Summary & abstract', fields: ['summary', 'abstract'] },
      {
        id: 'file',
        title: 'File & cover',
        fields: ['pdf', 'fileSize', 'external', 'coverImage']
      },
      {
        id: 'connections',
        title: 'Connections & workflow',
        fields: ['caseStudySlug', 'needsReview']
      }
    ],
    fields: [
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        options: PUBLICATION_TYPES,
        required: true,
        help: 'What kind of output this is; shown on the card and usable as a filter.'
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true
      },
      {
        name: 'authors',
        label: 'Authors',
        type: 'text',
        nullable: true,
        help:
          'As they should appear on the page. Leave blank until known — the ' +
          'page simply omits the line.'
      },
      {
        name: 'date',
        label: 'Date',
        type: 'text',
        nullable: true,
        help:
          'Shown on the card, e.g. 2023 or March 2024. Leave blank when ' +
          'unknown rather than guess.'
      },
      {
        name: 'year',
        label: 'Year',
        type: 'number',
        nullable: true,
        help: 'Drives the Most recent sort in the library.'
      },
      {
        name: 'region',
        label: 'Region',
        type: 'select',
        options: REGIONS,
        allowCustom: true,
        help: 'Feeds the Region filter; add a new region if none fits.'
      },
      textList(
        'countries',
        'Countries',
        'Country',
        'Feeds the Country filter. Leave empty for global outputs.'
      ),
      {
        name: 'method',
        label: 'Method / service',
        type: 'select',
        options: SERVICE_TITLES,
        allowCustom: true,
        nullable: true,
        help:
          'Feeds the Method/service filter. Leave blank when the output has ' +
          'no research method — an annual report, say.'
      },
      {
        name: 'topic',
        label: 'Topic',
        type: 'select',
        options: FOCUS_TITLES,
        allowCustom: true,
        nullable: true,
        help:
          'Feeds the Topic filter. Leave blank rather than stretch a label to fit.'
      },
      {
        name: 'summary',
        label: 'Summary',
        type: 'textarea',
        help: 'One sentence for the library card.'
      },
      {
        name: 'abstract',
        label: 'Abstract',
        type: 'richtext',
        help: 'The fuller abstract shown on the publication’s own page.'
      },
      {
        name: 'pdf',
        label: 'PDF',
        type: 'file',
        help: 'The document itself, from the media library.'
      },
      {
        name: 'fileSize',
        label: 'File size',
        type: 'text',
        help: 'Filled automatically on upload — no need to touch it.'
      },
      {
        name: 'external',
        label: 'Hosted elsewhere',
        type: 'boolean',
        help:
          'On when the publication lives on another organisation’s site ' +
          'rather than as a PDF of ours.'
      },
      {
        name: 'coverImage',
        label: 'Cover image',
        type: 'image',
        nullable: true,
        help:
          'Portrait image of the front cover. Left empty, the card shows a ' +
          'typographic plate instead.'
      },
      {
        name: 'caseStudySlug',
        label: 'Linked case study',
        type: 'select',
        options: CASE_STUDY_SLUGS,
        nullable: true,
        help:
          'Links the publication to its case study — a “Read more about this ' +
          'study” button appears when set.'
      },
      {
        name: 'needsReview',
        label: 'Needs review',
        type: 'boolean',
        help:
          'On while a draft classification — usually the method tag — still ' +
          'needs the team’s confirmation.'
      }
    ]
  },

  {
    key: 'services',
    title: 'Services',
    itemLabel: 'service',
    route: '/services',
    itemRoute: null,
    icon: 'compass',
    orderable: true,
    titleField: 'title',
    listColumns: ['icon'],
    slugFrom: 'title',
    // Slugs are locked once created: case studies land on /services#<slug>
    // and the home signposts link the same way. The admin never regenerates
    // an existing slug on rename.
    // `caseStudySlugs` in the seed data stays but is not editable — the links
    // under each service derive from the service field on the case studies.
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        warning:
          'Case studies attach to this service by its exact title. Renaming ' +
          'it here means updating the Service field on every linked case ' +
          'study in the same sitting, or their links vanish.'
      },
      {
        name: 'summary',
        label: 'Summary',
        type: 'textarea',
        help: 'What this service offers, shown when the box expands.'
      },
      {
        name: 'icon',
        label: 'Icon',
        type: 'icon',
        help: 'The small symbol on the service box.'
      }
    ]
  },

  {
    key: 'technical-focus',
    title: 'Technical focus',
    itemLabel: 'focus area',
    route: '/technical-focus',
    itemRoute: null,
    icon: 'globe',
    orderable: true,
    titleField: 'title',
    listColumns: ['icon'],
    slugFrom: 'title',
    // Same slug lock as services: the home globe's focus panels link by slug.
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        warning:
          'Case studies attach to this area by its exact title, and the home ' +
          'globe links to it by its fixed web anchor. Renaming it here means ' +
          'updating the Topics field on every linked case study too.'
      },
      {
        name: 'summary',
        label: 'Summary',
        type: 'textarea',
        help: 'Why we focus here, shown when the box expands.'
      },
      {
        name: 'icon',
        label: 'Icon',
        type: 'icon',
        help: 'The small symbol on the area box.'
      },
      {
        name: 'spot',
        label: 'Spot illustration',
        type: 'image',
        nullable: true,
        help:
          'The illustrated glyph for the detail band. Object-only artwork — ' +
          'the photo policy bars AI-generated people, so no human figures.'
      }
    ]
  },

  {
    key: 'distinctives',
    title: 'Distinctives',
    itemLabel: 'distinctive',
    route: '/distinctives',
    itemRoute: null,
    icon: 'star',
    orderable: true,
    titleField: 'title',
    listColumns: [],
    slugFrom: 'title',
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        verbatim: true,
        help:
          'A full sentence, full stop included. The five titles are supplied ' +
          'word for word — reword only as a deliberate decision.'
      },
      {
        name: 'summary',
        label: 'Summary',
        type: 'textarea',
        help: 'What this distinctive means in practice when you work with Jigsaw.'
      }
    ]
  },

  {
    key: 'partners',
    title: 'Partners',
    itemLabel: 'partner',
    route: '/',
    itemRoute: null,
    icon: 'heart',
    orderable: true,
    titleField: 'name',
    listColumns: ['full'],
    slugFrom: 'name',
    // The wall order is the client's own fixed sequence — reordering is a
    // deliberate drag, never an automatic sort.
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        help: 'The short name shown on the logo wall, e.g. UNICEF.'
      },
      {
        name: 'full',
        label: 'Full name',
        type: 'text',
        help: 'The full organisation name, read out by screen readers.'
      },
      {
        name: 'logo',
        label: 'Logo',
        type: 'image',
        nullable: true,
        help:
          'SVG preferred. Until one is uploaded the wall shows the name as a ' +
          'typographic plate.'
      }
    ]
  },

  {
    key: 'testimonials',
    title: 'Testimonials',
    itemLabel: 'testimonial',
    route: '/distinctives',
    itemRoute: null,
    icon: 'message',
    orderable: true,
    titleField: 'attribution',
    listColumns: [],
    slugFrom: 'attribution',
    // The seed data carries a legacy `id` key on the one existing entry;
    // items are addressed by slug from here on.
    fields: [
      {
        name: 'quote',
        label: 'Quote',
        type: 'textarea',
        required: true,
        verbatim: true,
        help:
          'Real quotes only — never invent praise. Publish nothing the named ' +
          'organisation has not actually said.'
      },
      {
        name: 'attribution',
        label: 'Attribution',
        type: 'text',
        required: true,
        help: 'Who said it, e.g. IDRC.'
      }
    ]
  },

  {
    key: 'jobs',
    title: 'Work for us',
    itemLabel: 'vacancy',
    route: '/work-for-us',
    itemRoute: null,
    icon: 'briefcase',
    orderable: true,
    titleField: 'title',
    listColumns: ['location'],
    slugFrom: 'title',
    // An empty list is the real state, and the page shows the holding
    // message; nothing here needs a placeholder vacancy.
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        help: 'The role being advertised, e.g. Research Assistant.'
      },
      {
        name: 'location',
        label: 'Location',
        type: 'text',
        help: 'Where the role is based, e.g. London or Remote.'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'richtext',
        help: 'The vacancy text.'
      },
      {
        name: 'applyUrl',
        label: 'Application link',
        type: 'url',
        nullable: true,
        help:
          'Where the apply button points. Leave blank to direct applicants ' +
          'to the contact page instead.'
      }
    ]
  },

  {
    key: 'policies',
    title: 'Policies',
    itemLabel: 'policy',
    route: '/policies',
    itemRoute: null,
    icon: 'shield',
    orderable: true,
    titleField: 'title',
    listColumns: ['group', 'awaitingFile'],
    slugFrom: 'title',
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        help: 'The policy name as listed on the page, e.g. Safeguarding.'
      },
      {
        name: 'file',
        label: 'PDF',
        type: 'file',
        nullable: true,
        help: 'The policy document. Leave empty while it is still awaited.'
      },
      {
        name: 'fileSize',
        label: 'File size',
        type: 'text',
        help: 'Filled automatically on upload — no need to touch it.'
      },
      {
        name: 'awaitingFile',
        label: 'Awaiting document',
        type: 'boolean',
        help:
          'On while no PDF exists yet — the page lists the policy as ' +
          'forthcoming rather than hiding it.'
      },
      {
        name: 'group',
        label: 'Group',
        type: 'select',
        options: ['core', 'additional'],
        help:
          'Core covers the brief’s six policies; additional covers the two ' +
          'already published — the language and environmental policies.'
      }
    ]
  }
];

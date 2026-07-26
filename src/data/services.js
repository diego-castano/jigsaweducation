import { placeholder } from './placeholder';

// The six services, named exactly as the client's July brief lists them.
// Every summary is still [tbc] — the brief marks all six as
// "[summary text and linked case studies tbc]".
//
// caseStudySlugs are wired from src/data/case-studies.js once that lands; the
// brief asks each service box to expand and link to its relevant case studies.

export const SERVICES_INTRO = placeholder(
  'summary paragraph explaining what we mean by services and what we offer those we work with'
);

export const SERVICES = [
  {
    slug: 'large-scale-mixed-method-studies',
    title: 'Large-scale, mixed-method studies',
    icon: 'microscope',
    summary: placeholder('summary of large-scale, mixed-method studies'),
    caseStudySlugs: []
  },
  {
    slug: 'design-based-and-implementation-research',
    title: 'Design-based and implementation research',
    icon: 'flask',
    summary: placeholder('summary of design-based and implementation research'),
    caseStudySlugs: []
  },
  {
    slug: 'research-localisation-training-and-capacity-strengthening',
    title: 'Research localisation, training, and capacity strengthening',
    icon: 'users',
    summary: placeholder('summary of research localisation, training and capacity strengthening'),
    caseStudySlugs: []
  },
  {
    slug: 'technical-assistance-and-evidence-synthesis',
    title: 'Technical assistance and evidence synthesis',
    icon: 'book-open',
    // Worth telling the client: the live site's home and footer have promised
    // "research, evaluation, strategy and technical assistance" for years while
    // only three service pages existed. This entry closes that gap.
    summary: placeholder('summary of technical assistance and evidence synthesis'),
    caseStudySlugs: []
  },
  {
    slug: 'strategy-and-advisory',
    title: 'Strategy and advisory',
    icon: 'compass',
    summary: placeholder('summary of strategy and advisory'),
    caseStudySlugs: []
  },
  {
    slug: 'embedded-learning-partnerships',
    title: 'Embedded learning partnerships',
    icon: 'heart',
    summary: placeholder('summary of embedded learning partnerships'),
    caseStudySlugs: []
  }
];

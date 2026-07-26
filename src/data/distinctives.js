import { placeholder } from './placeholder';

// The Distinctives page. Unlike Services and Technical focus, the client
// supplied finished copy for the intro and the story block — only the five
// summaries are still [tbc].
//
// This page also absorbs "Our story". The new sitemap drops the About page,
// and its values fed these distinctives while its clients and partners moved
// to the Home logo wall — but the origin story had nowhere to land. It lives
// here, anchored at #our-story, with an entry point from the Home signpost.

export const DISTINCTIVES_INTRO = [
  'Over the last 15 years Jigsaw has become an established and trusted partner for the global education sector. We are driven by the shared conviction that building and using evidence is the best way to strengthen learning and education systems.',
  'The challenges are large and complicated. In the lowest income countries, more than 80% of children aged 10 cannot read a simple text, 250 million children never go to school, 260 million children cannot learn because of crisis and conflict. Education budgets are shrinking, hard won gains are in danger of being lost.',
  'We are committed to using our skills to bend the curve of progress as much as possible. No single team can do this on all fronts — and that is why we have a suite of bespoke services and specialise in the technical areas where we can have maximum impact.'
];

// The brief marks a citation URL as [tbc] for the statistics in paragraph two.
export const DISTINCTIVES_STATS_CITATION = null;

export const DISTINCTIVES_PREAMBLE =
  'These are the distinctives that you should experience when you work with Jigsaw. They shape who we are and how we operate. We enjoy talking with people about these distinctives, the values underlying them, and how they shape our decision-making. If you engage with Jigsaw and we don’t match up to these things then please tell us — we appreciate feedback and are committed to learning and improving.';

export const DISTINCTIVES = [
  {
    slug: 'evidence-uptake',
    title: 'We are driven by evidence uptake.',
    summary: placeholder('summary of what being driven by evidence uptake means in practice')
  },
  {
    slug: 'global-and-national',
    title: 'We combine the best of global and national.',
    summary: placeholder('summary of how we combine global and national expertise')
  },
  {
    slug: 'mixed-methods',
    title: 'We are a team of mixed methods researchers.',
    summary: placeholder('summary of our mixed methods approach')
  },
  {
    slug: 'real-partnership',
    title: 'Real partnership.',
    summary: placeholder('summary of what real partnership looks like')
  },
  {
    slug: 'positive-disruption',
    title: 'Change is needed — we prioritise and bring positive disruption.',
    summary: placeholder('summary of how we prioritise and bring positive disruption')
  }
];

// "Our story" — the About page content that the new sitemap left homeless.
// Milestones are placeholder: the live site says "a decade" and published a
// Decade in Review 2013-2023, while the July brief says 15 years. Company
// 06844615 dates to roughly 2009. The client needs to settle on one founding
// date before any of these years get published.
export const OUR_STORY = {
  heading: 'Our story',
  needsClientConfirmation: true,
  body: placeholder(
    'origin story, carried over from the About page the new sitemap retires. Note the unresolved question of whether Jigsaw dates from 2009, 2013 or elsewhere'
  ),
  milestones: []
};

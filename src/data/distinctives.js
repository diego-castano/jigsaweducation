import { placeholder } from './placeholder';

// The Distinctives page. Unlike Services and Technical focus, the client
// supplied finished copy for the intro and the story block - the five
// distinctives are the client's own copy too.
//
// This page also absorbs "Our story". The new sitemap drops the About page,
// and its values fed these distinctives while its clients and partners moved
// to the Home logo wall - but the origin story had nowhere to land. It lives
// here, anchored at #our-story, with an entry point from the Home signpost.

export const DISTINCTIVES_INTRO = [
  'Over the last 15 years Jigsaw has become an established and trusted partner for the global education sector. We are driven by the conviction that building and using evidence is the best way to strengthen learning and education systems.',
  'The challenges are large and complex: in the lowest income countries more than 80% of children aged 10 cannot read a simple text, 270 million children never go to school, and education systems face constrained public financing and large cuts to international aid.',
  'We are committed to using our skills to bend the curve of progress as much as possible. No single team can do this on all fronts - and that is why we have a suite of bespoke services and specialise in the technical areas where we can have maximum impact.'
];

// The brief marks a citation URL as [tbc] for the statistics in paragraph two.
export const DISTINCTIVES_STATS_CITATION = null;

export const DISTINCTIVES_PREAMBLE =
  'We have organisational distinctives alongside our approaches and technical areas. They are the kind of things that you should experience when you work with Jigsaw. We enjoy talking with people about these distinctives, the values underlying them, and how they shape our decision-making. If you engage with Jigsaw and we don’t match up to these things then please let us know.';

export const DISTINCTIVES = [
  {
    slug: 'trusted-long-term-partnerships',
    title: 'We work in trusted long-term partnerships.',
    summary:
      'We recognise that we are a small part of the big work to improve education - having impact requires operating within a complex system of education organisations.\n\nIn our partnerships we prioritise being fair, open-handed and adaptable and we have management systems that reflect this. Our work is often delivered alongside a small group of partner organisations and we learn from each other, and prioritise trust, technical excellence and contextual insight. These partners include REUK, Brink, FabInc, University of Cambridge, University of Zambia, R4D and eLearning Africa. Ask them about what it is like working with us.'
  },
  {
    slug: 'generous-in-sharing',
    title: 'We are generous in sharing our advice, knowledge and connections across the education sector.',
    summary:
      'At any one time we will be running about 15 projects, some of them lasting a few months and others lasting a few years.\n\nBut a lot of the value of Jigsaw is what happens beyond the projects. A core part of our contribution is informal work for the benefit of the sector.\n\nPeople ask for our advice so we try to be generous in sharing insights and ideas, whether or not it ever leads to paid work. We do this because we believe it helps our mission: we want the global education sector to thrive and so we want to be generous with our ideas and our technical insight to strengthen the networks that can foster substantive change.'
  },
  {
    slug: 'evidence-being-useful',
    title: 'We care about evidence being useful.',
    summary:
      'Too many research studies and evaluations lead to outputs which are never read and do not inform practice.\n\nEvidence should be built to be accessible so that it can be used to bring about change. Lots of our work focuses on how to do this well, it is complex to achieve but it starts by turning down work that is about box-ticking.\n\nIt means prioritising work with organisations serious about learning from findings and applying them in practice. This includes building intentional pathways from evidence to uptake. So we focus our energy on ensuring our work is useful for decision-makers, addresses their priorities, and informs practice and policy.'
  },
  {
    slug: 'changing-how-research-is-done',
    title: 'We try to change how education research is done.',
    summary:
      'There is a problematic gap between the rhetoric of localisation and the reality of how much global education research is extractive and detached from the priorities of affected communities.\n\nWe do not claim to have simple answers to address this structural challenge but we do try to help change the status quo. As part of this we have developed initiatives, training and tools that enable affected communities to build evidence with us. This includes crisis-affected people working as researchers, building their research skills and creating opportunities for their knowledge and experience to shape the evidence.\n\nIt is complicated to do this well and we are transparent about the power dynamics we are working within. We actively seek advice and critique, and keep working to move the dial towards global education research that is more locally led, participatory and reciprocal.'
  },
  {
    slug: 'in-it-for-the-long-haul',
    title: 'We are in this for the long haul.',
    summary:
      'By its nature, education is longitudinal, with learning and impact usually happening over years rather than days.\n\nIn addition, education is a complex system and a lot of things within it don’t work as well as they could. The challenges are real, and education systems have many blockages and perverse incentives that can make change difficult. We are in this for the long haul, which means taking these challenges seriously and trying to grapple with them properly.\n\nWe listen carefully to the people closest to the challenges, ask useful questions and think critically and constructively about the problems we are trying to solve. We are motivated by learning, and work collaboratively to understand complex systems, test our assumptions and adapt as we learn. As mixed-method researchers, we choose the tools that best fit the problem and context, rather than starting with a fixed methodological approach.\n\nWe also deliberately grow Jigsaw steadily rather than quickly. This allows us to be selective about the work we take on and prioritise projects where we believe we can make a meaningful contribution to positive change in education.'
  }
];

// "Our story" - the About page content that the new sitemap left homeless.
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

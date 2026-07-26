import { placeholder } from './placeholder';

// The eight technical focus areas, named exactly as the client's July brief
// lists them, in the brief's order. Note this replaces the live site's four
// areas (education technology · education in emergencies and protracted crises ·
// education, climate and environment · education for girls) — the new set is
// broader and renames most of them.
//
// "Foundational Learning" carries a capital L in the brief. Kept as written.

export const TECHNICAL_FOCUS_INTRO = placeholder(
  'summary paragraph explaining why we focus on certain areas and how these intersect'
);

export const TECHNICAL_FOCUS = [
  {
    slug: 'climate-resilient-learning-environments',
    title: 'Climate-resilient learning environments',
    icon: 'globe',
    summary: placeholder('summary of climate-resilient learning environments'),
    caseStudySlugs: []
  },
  {
    slug: 'education-financing-and-cost-effectiveness',
    title: 'Education financing and cost-effectiveness',
    icon: 'briefcase',
    summary: placeholder('summary of education financing and cost-effectiveness'),
    caseStudySlugs: []
  },
  {
    slug: 'education-in-crisis-and-conflict',
    title: 'Education in crisis and conflict',
    icon: 'shield',
    summary: placeholder('summary of education in crisis and conflict'),
    caseStudySlugs: []
  },
  {
    slug: 'education-policy-systems-and-governance',
    title: 'Education policy, systems and governance',
    icon: 'layers',
    summary: placeholder('summary of education policy, systems and governance'),
    caseStudySlugs: []
  },
  {
    slug: 'foundational-learning',
    title: 'Foundational Learning',
    icon: 'book-open',
    summary: placeholder('summary of foundational learning'),
    caseStudySlugs: []
  },
  {
    slug: 'skills-and-pathways-to-employment',
    title: 'Skills and pathways to employment',
    icon: 'graduation',
    summary: placeholder('summary of skills and pathways to employment'),
    caseStudySlugs: []
  },
  {
    slug: 'teacher-professional-development',
    title: 'Teacher professional development',
    icon: 'users',
    summary: placeholder('summary of teacher professional development'),
    caseStudySlugs: []
  },
  {
    slug: 'technology-and-education',
    title: 'Technology and education',
    icon: 'zap',
    summary: placeholder('summary of technology and education'),
    caseStudySlugs: []
  }
];

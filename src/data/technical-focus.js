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

// Each area carries a custom illustrated spot glyph, generated with the
// media-gen toolkit (Nano Banana Pro) in the brand palette from one shared
// style anchor. Object-only compositions: the client's photo policy bars
// AI-generated people, so no glyph contains a human figure. These are spot
// illustrations for the detail bands; the 16-24px UI icons stay SVG.
export const TECHNICAL_FOCUS = [
  {
    slug: 'climate-resilient-learning-environments',
    spot: '/icons/focus/climate-resilient-learning-environments.png',
    title: 'Climate-resilient learning environments',
    icon: 'globe',
    summary: placeholder('summary of climate-resilient learning environments'),
    caseStudySlugs: []
  },
  {
    slug: 'education-financing-and-cost-effectiveness',
    spot: '/icons/focus/education-financing-and-cost-effectiveness.png',
    title: 'Education financing and cost-effectiveness',
    icon: 'briefcase',
    summary: placeholder('summary of education financing and cost-effectiveness'),
    caseStudySlugs: []
  },
  {
    slug: 'education-in-crisis-and-conflict',
    spot: '/icons/focus/education-in-crisis-and-conflict.png',
    title: 'Education in crisis and conflict',
    icon: 'shield',
    summary: placeholder('summary of education in crisis and conflict'),
    caseStudySlugs: []
  },
  {
    slug: 'education-policy-systems-and-governance',
    spot: '/icons/focus/education-policy-systems-and-governance.png',
    title: 'Education policy, systems and governance',
    icon: 'layers',
    summary: placeholder('summary of education policy, systems and governance'),
    caseStudySlugs: []
  },
  {
    slug: 'foundational-learning',
    spot: '/icons/focus/foundational-learning.png',
    title: 'Foundational Learning',
    icon: 'book-open',
    summary: placeholder('summary of foundational learning'),
    caseStudySlugs: []
  },
  {
    slug: 'skills-and-pathways-to-employment',
    spot: '/icons/focus/skills-and-pathways-to-employment.png',
    title: 'Skills and pathways to employment',
    icon: 'graduation',
    summary: placeholder('summary of skills and pathways to employment'),
    caseStudySlugs: []
  },
  {
    slug: 'teacher-professional-development',
    spot: '/icons/focus/teacher-professional-development.png',
    title: 'Teacher professional development',
    icon: 'users',
    summary: placeholder('summary of teacher professional development'),
    caseStudySlugs: []
  },
  {
    slug: 'technology-and-education',
    spot: '/icons/focus/technology-and-education.png',
    title: 'Technology and education',
    icon: 'zap',
    summary: placeholder('summary of technology and education'),
    caseStudySlugs: []
  }
];

// Client testimonials, lifted verbatim from the live site. Only quotes Jigsaw
// already publishes under its own name belong here: nothing on this site
// invents praise, and an attribution without a real source is a liability.
//
// The IDRC line is the one the Distinctives page carries, set between the third
// and fourth distinctive so the manifesto is broken by an outside voice rather
// than by another band of our own prose.

export const TESTIMONIALS = [
  {
    id: 'idrc',
    quote:
      'Jigsaw pushed our own thinking to the next level… we consider them as thought partners.',
    attribution: 'IDRC'
  }
];

export const getTestimonial = (id) => TESTIMONIALS.find((t) => t.id === id) || null;

// Named export so the page reads by intent rather than by array index.
export const DISTINCTIVES_TESTIMONIAL = getTestimonial('idrc');

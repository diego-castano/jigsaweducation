export const NAV = [
  { group: 'Overview', items: [{ id: 'home', label: 'Cover', icon: 'home' }] },
  { group: 'Foundations', items: [
    { id: 'colors', label: 'Colour', icon: 'palette' },
    { id: 'typography', label: 'Typography', icon: 'type' },
    { id: 'spacing', label: 'Spacing & Radius', icon: 'ruler' },
    { id: 'elevation', label: 'Elevation', icon: 'layers' },
    { id: 'icons', label: 'Iconography', icon: 'sparkles' }
  ]},
  { group: 'Components', items: [
    { id: 'buttons', label: 'Buttons', icon: 'square' },
    { id: 'inputs', label: 'Inputs & Forms', icon: 'edit' },
    { id: 'cards', label: 'Cards', icon: 'file-text' },
    { id: 'badges', label: 'Badges & Tags', icon: 'star' },
    { id: 'navigation', label: 'Navigation', icon: 'menu' },
    { id: 'feedback', label: 'Feedback', icon: 'alert' },
    { id: 'containers', label: 'Containers', icon: 'layers' }
  ]},
  { group: 'Motion', items: [{ id: 'motion', label: 'Motion', icon: 'zap' }] },
  { group: 'Site Modules', items: [
    { id: 'heroes', label: 'Heroes', icon: 'rocket' },
    { id: 'publication', label: 'Publication Card', icon: 'book-open' },
    { id: 'team', label: 'Team Card', icon: 'users' },
    { id: 'stats', label: 'Stats', icon: 'sparkles' },
    { id: 'filters', label: 'Filter System', icon: 'filter' },
    { id: 'footer', label: 'Footer', icon: 'briefcase' }
  ]},
  { group: 'Site Templates', items: [
    { id: 'tpl-article', label: 'Article page', icon: 'file-text' },
    { id: 'tpl-library', label: 'Evidence Library', icon: 'book-open' },
    { id: 'tpl-about', label: 'About page', icon: 'info' },
    { id: 'tpl-404', label: '404 page', icon: 'alert' }
  ]},
  { group: 'Brand', items: [
    { id: 'brand', label: 'Brand applications', icon: 'palette' }
  ]},
  { group: 'Documentation', items: [
    { id: 'principles', label: 'Design Principles', icon: 'compass' },
    { id: 'voice', label: 'Voice & Tone', icon: 'message' },
    { id: 'a11y', label: 'Accessibility', icon: 'shield' }
  ]},
  { group: 'System', items: [
    { id: 'sys-about', label: 'About this system', icon: 'info' },
    { id: 'sys-changelog', label: 'Changelog', icon: 'sparkles' }
  ]}
];

// Flat list of all section ids in scroll order
export const SECTION_IDS = NAV.flatMap(g => g.items.map(i => i.id));

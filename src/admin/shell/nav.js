// Console navigation, derived from the CMS schemas so a new page or
// collection appears in the sidebar by declaration, never by editing the
// shell. Plain data — the server layout imports this and hands serialisable
// groups to the client components, keeping the schema seeds out of the
// client bundle.

import { SINGLETONS, COLLECTIONS } from '../../cms/schema';

const pageEntries = SINGLETONS.filter(
  (s) => s.key.startsWith('page-') && s.route !== null
).map((s) => ({
  label: s.title,
  href: `/admin/pages/${s.key}`,
  icon: s.icon
}));

const collectionEntries = COLLECTIONS.map((c) => ({
  label: c.title,
  href: `/admin/collections/${c.key}`,
  icon: c.icon
}));

// site-settings, ui-strings and tracking fold into the single Settings link.
// Pages and Content are collapsible: with 21 entries between them, showing
// everything at once buried the four utility links. Text-only rows inside
// the disclosures keep the icon set for the top level.
export const NAV_GROUPS = [
  {
    id: 'top',
    items: [{ label: 'Dashboard', href: '/admin', icon: 'home', exact: true }]
  },
  {
    id: 'pages',
    label: 'Pages',
    collapsible: true,
    icon: 'file-text',
    accent: 'sea',
    items: pageEntries
  },
  {
    id: 'content',
    label: 'Content',
    collapsible: true,
    icon: 'book-open',
    accent: 'orange',
    items: collectionEntries
  },
  {
    id: 'library',
    items: [
      { label: 'Media', href: '/admin/media', icon: 'layers' },
      { label: 'Subscribers', href: '/admin/subscribers', icon: 'send' },
      { label: 'Settings', href: '/admin/settings', icon: 'settings' }
    ]
  }
];

// Breadcrumb dictionary: URL segment -> human label. Item uuids fall through
// and the TopBar shortens them.
export const SEGMENT_LABELS = {
  pages: 'Pages',
  collections: 'Content',
  media: 'Media',
  subscribers: 'Subscribers',
  settings: 'Settings',
  ...Object.fromEntries(SINGLETONS.map((s) => [s.key, s.title])),
  ...Object.fromEntries(COLLECTIONS.map((c) => [c.key, c.title]))
};

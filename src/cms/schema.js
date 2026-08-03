// The CMS schema contract. Every editable surface on the site is declared in
// src/cms/schemas/* as plain data conforming to the shapes below; the admin
// renders its forms from these declarations and the seed script builds the
// initial database from the `seed` values. Adding a field to the admin is an
// edit here, never a new screen.
//
// FIELD SHAPE
// {
//   name:      'fieldName',            // key inside the jsonb document
//   label:     'Plain UK-English label for the client',
//   help:      'One sentence of guidance. Carries editorial rules.',
//   type:      one of FIELD_TYPES below
//   required:  true | false            // default false
//   maxLength: number                  // soft cap, counter shown in the UI
//   maxWords:  number                  // soft cap for prose (e.g. 150-word bios)
//   verbatim:  true                    // client-supplied copy — admin shows a
//                                      // "supplied word-for-word" notice on edit
//   warning:   'string'                // amber note, e.g. substring-anchor rules
//   options:   ['a','b']               // for select
//   allowCustom: true                  // select renders as combobox with add-new
//   of:        [fields]                // for list: the fields of each row
//   itemLabel: 'Country'               // for list: what one row is called
//   minItems / maxItems: number        // for list: structural bounds
//   fixed:     true                    // for list: no add/remove/reorder, edit only
//   seed:      value                   // current production value, used by seed
//   nullable:  true                    // empty is a legitimate published state
// }
//
// FIELD TYPES
//   text       single line
//   textarea   multi-paragraph prose; blank line = paragraph break (matches
//              how src/data stores bios and section bodies)
//   richtext   formatted prose edited WYSIWYG (bold, italic, links, lists);
//              stored as HTML once formatted — plain seeded text stays plain
//              until edited, and the site's <Prose> renderer accepts both
//   image      media-library picker (upload or choose); value is a URL string
//   file       media-library picker for documents (PDF); value is a URL string
//   link       internal route or external URL; admin renders a picker, value
//              is the href string
//   email      validated email
//   url        validated absolute URL
//   number     integer
//   boolean    toggle
//   select     one of `options` (combobox when allowCustom)
//   icon       one of the site icon names (src/icons); visual picker
//   country    world-atlas country; value is { name, id } with numeric ISO id
//   list       ordered rows, each shaped by `of`
//
// SINGLETON SHAPE  (one per site page + settings groups)
// {
//   key:      'page-home',
//   title:    'Home',
//   description: 'What this page is, one line',
//   route:    '/',                     // public path, drives the live preview
//   icon:     'home',
//   sections: [{ id, title, description?, fields: [FIELD] }]
// }
//
// COLLECTION SHAPE
// {
//   key:        'team',
//   title:      'Team',
//   itemLabel:  'team member',
//   route:      '/team',               // public list page for preview
//   itemRoute:  '/team/:slug',         // detail preview; null when none exists
//   icon:       'users',
//   orderable:  true,                  // drag order is meaningful (else sorted)
//   titleField: 'name',                // which field names an item in lists
//   listColumns: ['role', 'country'],  // extra columns in the admin list view
//   slugFrom:   'name',                // field slugs generate from
//   fields:     [FIELD]
// }

export const FIELD_TYPES = [
  'text', 'textarea', 'richtext', 'image', 'file', 'link', 'email', 'url',
  'number', 'boolean', 'select', 'icon', 'country', 'list'
];

import { PAGE_SINGLETONS } from './schemas/pages.js';
import { SETTINGS_SINGLETONS } from './schemas/settings.js';
import { COLLECTIONS } from './schemas/collections.js';

export const SINGLETONS = [...PAGE_SINGLETONS, ...SETTINGS_SINGLETONS];
export { COLLECTIONS };

export const getSingletonSchema = (key) => SINGLETONS.find((s) => s.key === key) || null;
export const getCollectionSchema = (key) => COLLECTIONS.find((c) => c.key === key) || null;

// Flat field list for a singleton — used by seed and validation.
export const singletonFields = (schema) => schema.sections.flatMap((s) => s.fields);

// Build the seed document for a singleton from its declared seed values.
export const singletonSeedDoc = (schema) =>
  Object.fromEntries(
    singletonFields(schema)
      .filter((f) => 'seed' in f)
      .map((f) => [f.name, f.seed])
  );

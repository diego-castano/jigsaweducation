// Pure helpers behind the editor engine: dotted-path access into the jsonb
// document, per-field validation, and the small text metrics the field chrome
// shows. No React in here.

// --- Dotted paths -----------------------------------------------------------
// Field names like 'sections.criticalQuestion' address nested keys inside the
// stored document. saveDraft merges patches SHALLOWLY (jsonb ||), so the
// autosave always sends the whole top-level object a dotted field lives in.

export const topKeyOf = (name) => name.split('.')[0];

export const getPath = (doc, name) => {
  if (!doc) return undefined;
  if (!name.includes('.')) return doc[name];
  return name.split('.').reduce((node, part) => (node == null ? undefined : node[part]), doc);
};

// Immutable set: returns a new document with `name` set to `value`, cloning
// only the objects along the path. Intermediate objects are created when
// missing so a first edit to sections.collaboration works on an empty doc.
export const setPath = (doc, name, value) => {
  const parts = name.split('.');
  const next = { ...(doc || {}) };
  let node = next;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i];
    node[part] = { ...(node[part] || {}) };
    node = node[part];
  }
  node[parts[parts.length - 1]] = value;
  return next;
};

// --- Text metrics -----------------------------------------------------------

// Rich text stores HTML; every metric and emptiness check must look at the
// words, not the markup.
export const stripTags = (text) =>
  String(text || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim();

export const countWords = (text) =>
  stripTags(text).split(/\s+/).filter(Boolean).length;

// --- Read-only wiring convention -------------------------------------------
// Some schema fields carry a `warning` that describes locked plumbing rather
// than an editorial rule: the nav hrefs ("A structural route…") and the office
// countryId/coords ("Map plumbing…"). Those render as read-only values with
// the warning shown; every other warning stays on an editable field.

export const isWiringField = (field) =>
  /^(Map plumbing|A structural route)/.test(field?.warning || '');

// --- Validation -------------------------------------------------------------
// Hard errors (they block Publish): required-and-empty, invalid email,
// invalid absolute URL. maxLength/maxWords are soft caps — counter only.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmptyValue = (field, value) => {
  if (value == null) return true;
  if (field.type === 'boolean') return false;
  if (field.type === 'number') return value === '' || value == null;
  if (field.type === 'country') return !value.id;
  if (field.type === 'list') return !Array.isArray(value) || value.length === 0;
  // An empty rich-text document is markup with no words ('<p></p>').
  if (field.type === 'richtext') return stripTags(value) === '';
  return String(value).trim() === '';
};

const isAbsoluteHttpUrl = (value) => {
  try {
    const parsed = new URL(String(value));
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// Returns an error message, or null when the value passes the hard gate.
export const validateFieldValue = (field, value) => {
  const empty = isEmptyValue(field, value);
  if (empty) {
    return field.required ? `${field.label} is required.` : null;
  }
  switch (field.type) {
    case 'email':
      return EMAIL_PATTERN.test(String(value).trim())
        ? null
        : 'That does not look like an email address.';
    case 'url':
      return isAbsoluteHttpUrl(String(value).trim())
        ? null
        : 'Enter a full web address starting with https://';
    case 'link': {
      const href = String(value).trim();
      if (href.startsWith('/') || href.startsWith('#')) return null;
      return isAbsoluteHttpUrl(href)
        ? null
        : 'Pick a page on this site or enter a full web address starting with https://';
    }
    case 'number':
      return Number.isFinite(Number(value))
        ? null
        : `${field.label} must be a number.`;
    default:
      return null;
  }
};

// Walks a field list against a document and returns every hard error as
// { path, label, message }. List rows recurse; wiring fields are skipped
// because the editor never lets them change.
export const collectErrors = (fields, doc, prefix = '', labelTrail = []) => {
  const found = [];
  fields.forEach((field) => {
    if (isWiringField(field)) return;
    const path = prefix ? `${prefix}.${field.name}` : field.name;
    const resolved = getPath(doc, field.name);
    const trail = [...labelTrail, field.label];

    if (field.type === 'list' && Array.isArray(resolved)) {
      const bare = isBareStringList(field);
      resolved.forEach((row, index) => {
        const rowDoc = bare ? { value: row } : row || {};
        found.push(
          ...collectErrors(field.of, rowDoc, `${path}.${index}`, [
            ...labelTrail,
            `${field.label} — ${field.itemLabel || 'row'} ${index + 1}`,
          ])
        );
      });
    }

    const message = validateFieldValue(field, resolved);
    if (message) found.push({ path, label: trail.join(' — '), message });
  });
  return found;
};

// A list whose `of` is a single field named `value` serialises as a bare
// array of strings (countries, topics, partners).
export const isBareStringList = (field) =>
  Array.isArray(field.of) && field.of.length === 1 && field.of[0].name === 'value';

// Stable DOM id for a field path, used for inline error anchors and the
// scroll-to-first-error behaviour on Publish.
export const fieldDomId = (path) => `fld-${String(path).replace(/[^a-zA-Z0-9_-]/g, '-')}`;

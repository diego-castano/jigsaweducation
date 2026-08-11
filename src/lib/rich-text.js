// Server-side handling for CMS prose that may be plain text or HTML.
//
// Rich-text fields store plain seeded text until someone edits them in the
// console, after which they hold a small HTML subset (paragraphs, bold,
// italic, links, lists). Everything that renders such a field goes through
// here: HTML is sanitised to exactly that subset, plain text is split into
// paragraphs - so both shapes come out as safe HTML strings.

import sanitizeHtml from 'sanitize-html';

const SANITIZE_OPTIONS = {
  allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'a', 'ul', 'ol', 'li'],
  allowedAttributes: { a: ['href', 'rel', 'target'] },
  allowedSchemes: ['http', 'https', 'mailto'],
  // Site-relative links ('/case-studies/…') must survive.
  allowProtocolRelative: false,
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener' })
  }
};

export const isRichHtml = (text) => /<\s*[a-z][^>]*>/i.test(String(text || ''));

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Plain text or HTML → sanitised HTML string, always paragraph-wrapped.
export const proseToHtml = (text) => {
  const value = String(text || '');
  if (!value.trim()) return '';
  if (isRichHtml(value)) return sanitizeHtml(value, SANITIZE_OPTIONS);
  return value
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('');
};

// Prose → plain text (metadata descriptions, word counts, excerpts).
export const proseToText = (text) => {
  const value = String(text || '');
  if (!isRichHtml(value)) return value;
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, ' ')
    .trim();
};

// Prose → array of plain-text paragraphs, for render sites that lay each
// paragraph out themselves and only need the words.
export const proseToParagraphs = (text) => {
  const value = String(text || '');
  if (!isRichHtml(value)) return value.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return value
    .split(/<\/(?:p|li)>/i)
    .map((chunk) => sanitizeHtml(chunk, { allowedTags: [], allowedAttributes: {} }).trim())
    .filter(Boolean);
};

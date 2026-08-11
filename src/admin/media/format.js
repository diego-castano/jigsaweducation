// Shared media-module constants and formatters. The mime lists mirror the
// server-side EXTENSIONS map in src/cms/actions/media.js so the client can
// reject a bad file before the round trip (the server still validates).

export const IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
];

export const PDF_MIME = 'application/pdf';

export const UPLOADABLE_MIMES = [...IMAGE_MIMES, PDF_MIME];

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export const isImageMime = (mime) => typeof mime === 'string' && mime.startsWith('image/');

// What the hidden <input type="file"> advertises to the OS picker.
export const acceptAttr = (accept) =>
  accept === 'image' ? IMAGE_MIMES.join(',') : accept === 'pdf' ? PDF_MIME : UPLOADABLE_MIMES.join(',');

// 'annual-report.pdf' -> 'PDF' - for the file plate on document tiles.
export const fileExt = (item) => {
  const name = String(item?.filename || '');
  const dot = name.lastIndexOf('.');
  if (dot > 0 && name.length - dot <= 6) return name.slice(dot + 1).toUpperCase();
  return item?.mime === PDF_MIME ? 'PDF' : 'FILE';
};

export const formatSize = (bytes) => {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n < 0) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

// en-GB, e.g. "3 Aug 2026".
export const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

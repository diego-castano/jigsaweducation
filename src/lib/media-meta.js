// Helpers over the getMediaMeta() map: alt text and object-position for a
// stored media URL. Non-library URLs (seeds, local files) simply return the
// fallbacks, so callers never branch.

export const altFor = (meta, url, fallback = '') => meta?.[url]?.alt || fallback;

export const objectPositionFor = (meta, url) => {
  const entry = meta?.[url];
  if (!entry || entry.focalX == null || entry.focalY == null) return undefined;
  return `${Math.round(entry.focalX * 100)}% ${Math.round(entry.focalY * 100)}%`;
};

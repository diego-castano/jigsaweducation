// One place turns a page singleton's SEO section into Next metadata, so all
// eleven pages honour the same fields: title, description, share image and
// the hide-from-search toggle.

export const pageMetadata = (page, { canonical, absoluteTitle = false } = {}) => {
  const metadata = {
    title: absoluteTitle ? { absolute: page.title } : page.title,
    description: page.description || undefined,
    alternates: canonical ? { canonical } : undefined
  };
  if (page.noIndex) {
    metadata.robots = { index: false, follow: true };
  }
  if (page.ogImage) {
    metadata.openGraph = { images: [{ url: page.ogImage }] };
  }
  return metadata;
};

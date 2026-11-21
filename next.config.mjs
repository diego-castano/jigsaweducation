/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Admin uploads allow 25 MB (src/cms/actions/media.js). The defaults are 1 MB
  // for Server Actions and 10 MB for requests that pass through proxy.js.
  experimental: {
    serverActions: { bodySizeLimit: '26mb' },
    proxyClientMaxBodySize: '26mb'
  },

  async redirects() {
    return [{ source: '/services', destination: '/approaches', permanent: true }];
  },

  images: {
    // Field photography still lives on the legacy Hubble/S3 bucket while the
    // client assembles their own image bank. Remove once assets migrate.
    remotePatterns: [
      { protocol: 'https', hostname: 'hubble-live-assets.s3.eu-west-1.amazonaws.com' },
      { protocol: 'https', hostname: 'hubble-live-assets.s3.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  }
};

export default nextConfig;

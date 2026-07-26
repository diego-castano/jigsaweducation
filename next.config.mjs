/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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

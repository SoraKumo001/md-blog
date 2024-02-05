/**
 * @type { import("next").NextConfig}
 */
const config = {
  experimental: {
    cpus: 4,
  },
  images: {
    path: process.env.IMAGE_URL,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: `/${process.env.GOOGLE_PROJECT_ID}.appspot.com/**`,
      },
    ],
  },
  output: 'standalone',
};
export default config;

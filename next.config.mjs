/**
 * @type { import("next").NextConfig}
 */
const config = {
  i18n: {
    locales: ['ja'],
    defaultLocale: 'ja',
  },
  experimental: {
    cpus: 4,
  },
  images: {
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

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
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
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
  productionBrowserSourceMaps: true,
};
module.exports = config;

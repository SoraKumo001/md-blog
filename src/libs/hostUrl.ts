const isServerSide = typeof window === 'undefined';
export const hostUrl = isServerSide
  ? process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
  : '';

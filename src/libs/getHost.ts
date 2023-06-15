import type { IncomingMessage } from 'http';

export const getHost = (req?: Partial<IncomingMessage>) => {
  const headers = req?.headers;
  if (!headers?.['x-forwarded-host']) return undefined;
  const proto = headers?.['x-forwarded-proto']?.toString().split(',')[0] ?? 'http';
  return headers ? `${proto}://${headers['x-forwarded-host']}` : undefined;
};

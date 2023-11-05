export const getHost = (headers?: { [key: string]: string | string[] | undefined }) => {
  const host = headers?.['x-forwarded-host'] ?? headers?.['host'];
  if (!host) return undefined;
  const proto = headers?.['x-forwarded-proto']?.toString().split(',')[0] ?? 'http';
  return headers ? `${proto}://${host}` : undefined;
};

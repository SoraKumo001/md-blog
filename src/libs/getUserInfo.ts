import crypto from 'crypto';

const fetchPublicKeys = async () => {
  const response = await fetch(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  );
  const cacheControlHeader = response.headers.get('cache-control');
  const maxAgeMatch = cacheControlHeader?.match(/max-age=(\d+)/);

  if (!maxAgeMatch?.[1]) throw new Error('error');

  const maxAgeSeconds = parseInt(maxAgeMatch[1], 10);
  const expirationTime = Date.now() + maxAgeSeconds * 1000;

  const publicKeys: { [key: string]: string } = await response.json();
  return { publicKeys, expirationTime };
};

let publicKeys: { [key: string]: string };
let expirationTime: number;

const getPublicKey = async (kid: string) => {
  if (expirationTime === undefined || Date.now() >= expirationTime) {
    const result = await fetchPublicKeys();
    publicKeys = result.publicKeys;
    expirationTime = result.expirationTime;
  }
  return publicKeys[kid];
};

export const getUserInfo = async (
  projectId?: string,
  token?: string
): Promise<{ name: string; email: string; exp: number } | undefined> => {
  if (!projectId || !token) return undefined;

  const [headerBase64, payloadBase64, signatureBase64] = token.split('.');

  const header = JSON.parse(Buffer.from(headerBase64, 'base64').toString('utf8')) as {
    kid: string;
  };
  const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
  if (Date.now() > payload.exp * 1000 || payload.aud !== projectId) return undefined;

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${headerBase64}.${payloadBase64}`);

  const publicKey = await getPublicKey(header.kid);
  const signature = Buffer.from(signatureBase64, 'base64');
  if (verifier.verify(publicKey, signature)) {
    const { name, email, exp } = payload;
    return { name, email, exp };
  }
  return undefined;
};

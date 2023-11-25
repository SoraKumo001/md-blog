import { getStorage } from 'firebase-storage';

const projectId = process.env.GOOGLE_PROJECT_ID!;
const bucket = `${projectId}.appspot.com`;
export const storage = getStorage({
  privateKey: process.env.GOOGLE_PRIVATE_KEY!,
  clientEmail: process.env.GOOGLE_CLIENT_EMAIL!,
  bucket,
});

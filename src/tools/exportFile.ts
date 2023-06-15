import fs from 'fs';
import { semaphore } from '@node-libraries/semaphore';
import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { prisma } from '@/server/context';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.GOOGLE_PROJECT_ID,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY,
  }),
  storageBucket: `${process.env.GOOGLE_PROJECT_ID}.appspot.com`,
});

const main = async () => {
  const users = await prisma.user.findMany();
  const categories = await prisma.category.findMany();
  const system = await prisma.system.findMany();
  const posts = await prisma.post.findMany({ include: { categories: { select: { id: true } } } });
  const files = await prisma.fireStore.findMany();

  const s = semaphore(5);

  const bucket = getStorage().bucket();
  const fireStoreFiles = await Promise.all(
    files.map(async (file) => {
      await s.acquire();
      try {
        const storageFile = await bucket.file(file.id).download();
        return { ...file, binary: storageFile[0].toString('base64') };
      } catch (e) {
        return { ...file, binary: '' };
      } finally {
        s.release();
      }
    })
  );

  fs.writeFileSync(
    'output.json',
    JSON.stringify({ system, users, categories, posts, files: fireStoreFiles }, undefined, '  ')
  );
};

main();

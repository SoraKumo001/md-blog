import { getStorage } from 'firebase-admin/storage';
import { prisma } from '@/server/context';

export const restorationFiles = async () => {
  const ids = new Set((await prisma.fireStore.findMany()).map(({ id }) => id));
  const bucket = getStorage().bucket();
  const files = await bucket.getFiles();
  for (const file of files[0]) {
    if (!ids.has(file.name)) {
      const mime = file.metadata.contentType;
      await prisma.fireStore.create({
        data: {
          id: file.name,
          name: 'file.' + mime.split('/')[1],
          mimeType: file.metadata.contentType,
        },
      });
    }
  }
};

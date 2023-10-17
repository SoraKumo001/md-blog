import { getStorage } from 'firebase-admin/storage';
import { uuid } from 'uuidv4';
import { prisma } from '@/app/api/graphql/libs/context';

export const uploadFile = async (binary: File) => {
  const bucket = getStorage().bucket();
  const id = uuid();
  const storage = bucket.file(id);
  await storage.save(Buffer.from(await binary.arrayBuffer()), {
    public: true,
    metadata: { mime: binary.type, cacheControl: 'public, max-age=31536000, immutable' },
  });
  return prisma.fireStore.create({
    data: { id, name: binary.name, mimeType: binary.type ?? '' },
  });
};

export const isolatedFiles = async () => {
  const files = await prisma.fireStore.findMany({
    where: {
      posts: { none: {} },
      postCards: { none: {} },
      systemIcons: { none: {} },
      systemCards: { none: {} },
    },
  });
  const bucket = getStorage().bucket();
  for (const { id } of files) {
    await bucket
      .file(id)
      .delete()
      .catch(() => null);
    await prisma.fireStore.delete({ where: { id } });
  }
};

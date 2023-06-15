import { FormidableFile } from '@react-libraries/next-apollo-server';
import { getStorage } from 'firebase-admin/storage';
import { prisma } from '@/server/context';

export const uploadFile = async (binary: FormidableFile) => {
  const bucket = getStorage().bucket();
  const name = binary.originalFilename ?? 'file';
  const storage = await bucket.upload(binary.filepath, {
    public: true,
    contentType: binary.mimetype ?? undefined,
    metadata: { mime: binary.mimetype, cacheControl: 'public, max-age=31536000, immutable' },
  });
  const id = storage[0]?.id;
  if (!id) throw new Error('CloudStorage error');
  return prisma.fireStore.create({
    data: { id, name, mimeType: binary.mimetype ?? '' },
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

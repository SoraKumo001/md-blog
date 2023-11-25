import { ref, uploadBytes, getStorage, deleteObject } from '@firebase/storage';
import { uuid } from 'uuidv4';
import { prisma } from '@/app/api/graphql/libs/context';
import { firebaseApp } from './getFirebaseApp';

const storage = getStorage(firebaseApp);

export const uploadFile = async (binary: File) => {
  const id = uuid();
  uploadBytes(ref(storage, id), binary, {
    contentType: binary.type,
    cacheControl: 'public, max-age=31536000, immutable',
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
  for (const { id } of files) {
    await deleteObject(ref(storage, id));
    await prisma.fireStore.delete({ where: { id } });
  }
};

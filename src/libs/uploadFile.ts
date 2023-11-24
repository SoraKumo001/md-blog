import { FirebaseOptions, initializeApp } from '@firebase/app';
import { ref, uploadBytes, getStorage, deleteObject } from '@firebase/storage';
import { uuid } from 'uuidv4';
import { prisma } from '@/app/api/graphql/libs/context';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  projectId: process.env.NEXT_PUBLIC_projectId,
  authDomain: `${process.env.NEXT_PUBLIC_projectId}.firebaseapp.com`,
  storageBucket: `${process.env.NEXT_PUBLIC_projectId}.appspot.com`,
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

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

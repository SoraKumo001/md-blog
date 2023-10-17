import { semaphore } from '@node-libraries/semaphore';
import { Category, FireStore, Post, System, User } from '@prisma/client';
import { getStorage } from 'firebase-admin/storage';
import { prisma } from '@/app/api/graphql/libs/context';
import { getImages } from '@/libs/getImages';

type DataType = {
  users: User[];
  categories: Category[];
  system: System[];
  posts: (Post & { categories: { id: string }[] })[];
  files: (FireStore & { binary: string })[];
};

export const importFile = async (file: string) => {
  const data: DataType = JSON.parse(file);
  if (data) {
    for (const value of data.users) {
      await prisma.user.upsert({
        create: value,
        update: value,
        where: { id: value.id },
      });
    }
    const bucket = getStorage().bucket();
    const s = semaphore(10);

    data.files.forEach(async (file) => {
      await s.acquire();
      const { binary, ...storeFile } = file;
      await bucket.file(file.id).save(Buffer.from(binary, 'base64'), {
        public: true,
        contentType: file.mimeType,
        metadata: { mime: file.mimeType, cacheControl: 'public, max-age=31536000, immutable' },
      });
      await prisma.fireStore.upsert({
        create: storeFile,
        update: storeFile,
        where: {
          id: file.id,
        },
      });
      s.release();
    });
    await s.all();

    await prisma.system.upsert({
      create: data.system[0],
      update: data.system[0],
      where: { id: 'system' },
    });

    data.categories.forEach(async (value) => {
      await s.acquire();
      await prisma.category.upsert({
        create: value,
        update: value,
        where: { id: value.id },
      });
      s.release();
    });
    await s.all();

    const ids = new Set((await prisma.fireStore.findMany()).map(({ id }) => id));

    data.posts.forEach(async (value) => {
      await s.acquire();
      const images = await getImages(value.content);
      const { categories, ...post } = value;
      await prisma.post.upsert({
        create: post,
        update: post,
        where: { id: value.id },
      });
      const connectImages = images.filter((v) => ids.has(v));
      if (connectImages.length) {
        await prisma.post.update({
          data: {
            postFiles: { connect: connectImages.map((id) => ({ id })) },
            categories: { connect: categories.map((id) => id) },
          },
          where: { id: value.id },
        });
      }
      s.release();
    });
    await s.all();
  }
};
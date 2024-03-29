import { semaphore } from '@node-libraries/semaphore';
import { prisma } from '@/app/api/graphql/libs/context';
import { storage } from '@/app/api/graphql/libs/getStorage';
import { getImages } from '@/libs/getImages';
import type { Category, FireStore, Post, System, User } from '@prisma/client';

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
    const s = semaphore(1);

    data.files.forEach(async (file) => {
      await s.acquire();
      const { binary, ...storeFile } = file;
      const blob = new Blob([Buffer.from(binary, 'base64')], { type: file.mimeType });
      await storage
        .upload({
          file: blob,
          name: file.id,
          published: true,
          metadata: { cacheControl: 'public, max-age=31536000, immutable' },
        })
        .catch((e) => console.error(file.id, file.name, e));
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

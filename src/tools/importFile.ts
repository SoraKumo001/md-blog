import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { prisma } from '@/server/context';

export interface Root {
  type: Type;
  value?: string;
  contentType?: ContentType;
  path?: string;
  collection?: Collection;
  values?: Values;
}

export type Collection = 'Admins' | 'Application' | 'Content' | 'ContentBody';

export type ContentType = 'image/webp' | 'image/gif';

export type Type = 'storage' | 'file' | 'document';

export interface Values {
  id: string;
  title?: string;
  host?: string;
  description?: string;
  directStorage?: boolean;
  cardUrl?: string;
  visible?: boolean;
  system?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  body?: string;
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.GOOGLE_PROJECT_ID,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY,
  }),
  storageBucket: process.env.GOOGLE_STRAGE_BUCKET,
});

const main = async () => {
  const value = fs.readFileSync(path.resolve(__dirname, './blog.json'), { encoding: 'utf8' });
  const root = JSON.parse(value) as Root[];

  const contents: {
    [key: string]: {
      id: string;
      title: string;
      visible: boolean;
      system: boolean;
      createdAt: string;
      updatedAt: string;
    };
  } = {};
  const bodies: {
    [key: string]: {
      id: string;
      body: string;
    };
  } = {};
  const files: {
    [key: string]: {
      id: string;
      contentType: string;
      name: string;
    };
  } = {};
  const regex = /\/([^/]+)$/;

  const bucket = getStorage().bucket();
  await Promise.all((await bucket.getFiles())[0].map((file) => file.delete()));

  for (const data of root) {
    if (data.type === 'file') {
      const fileName = data.path?.match(regex)?.[1];
      const id = fileName?.split('.')[0];
      if (id && data.contentType && data.value) {
        const fileId = crypto.randomUUID().replaceAll('-', '');
        await bucket.file(fileId).save(Buffer.from(data.value, 'base64'), {
          public: true,
          contentType: data.contentType ?? undefined,
          metadata: { mime: data.contentType, cacheControl: 'public, max-age=31536000, immutable' },
        });
        files[id] = {
          id: fileId,
          contentType: data.contentType,
          name: fileName,
        };
      }
    }
    if (data.collection === 'Content') contents[data.values?.id as string] = data.values as never;
    if (data.collection === 'ContentBody') bodies[data.values?.id as string] = data.values as never;
  }
  const authorId = (await prisma.user.findFirstOrThrow()).id;
  const regexContentFile1 = /!\[(.*?)\]\([^)]+\/[^%]+%2F.*?%2F([^\/]+)\..+?\)/g;

  for (const header of Object.values(contents)) {
    if (header.system) continue;
    const id = header.id;
    const body = bodies[header.id];
    let content = body.body.replace(regexContentFile1, '![$1]($2)');
    const images: string[] = [];
    Object.entries(files).forEach(([key, file]) => {
      content = content.replaceAll(`(${key})`, `(${file.id})`);
      if (content !== content) {
        images.push(file.id);
      }
    });
    await prisma.post.upsert({
      where: { id },
      create: {
        id,
        authorId,
        content: content,
        published: header.visible,
        createdAt: new Date(header.createdAt),
        publishedAt: new Date(header.createdAt),
        updatedAt: new Date(header.updatedAt),
        title: header.title,
        postFiles: {
          connect: images.map((id) => ({
            id,
          })),
        },
      },
      update: {
        authorId,
        content: content,
        published: header.visible,
        createdAt: new Date(header.createdAt),
        publishedAt: new Date(header.createdAt),
        updatedAt: new Date(header.updatedAt),
        title: header.title,
        postFiles: {
          connect: images.map((id) => ({
            id,
          })),
        },
      },
    });
  }
};

main();

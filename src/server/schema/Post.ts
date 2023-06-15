import { PrismaSelect } from '@paljs/plugins';
import { PrismaClient } from '@prisma/client';
import { getStorage } from 'firebase-admin/storage';
import {
  arg,
  booleanArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from 'nexus';
import { Post } from 'nexus-prisma';
import { getImages } from '@/libs/getImages';
import { isolatedFiles, uploadFile } from '@/libs/uploadFile';
import { Upload } from './Upload';

export const PostsType = objectType({
  name: Post.$name,
  description: Post.$description,
  definition(t) {
    Object.entries(Post).forEach(([key, value]) => {
      if (!key.startsWith('$')) t.field(value);
    });
  },
});

export const PostQuery = queryField('Post', {
  type: nonNull(PostsType),
  args: {
    id: nonNull(stringArg()),
  },
  resolve: (_parent, { id }, { prisma, user }, info) => {
    const select = new PrismaSelect(info, {
      defaultFields: { Post: { id: true, published: true, updatedAt: true } },
    }).value;
    return prisma.post
      .findUniqueOrThrow({
        where: { id },
        ...select,
      })
      .then((v) => {
        if (!user) {
          if (!v.published || new Date(v.publishedAt).getTime() > new Date().getTime())
            throw new Error('not found');
        }
        return v;
      });
  },
});

export const Posts = queryField('Posts', {
  type: nonNull(list(nonNull(PostsType))),
  resolve: (_parent, {}, { prisma, user }, info) => {
    const select = new PrismaSelect(info, { defaultFields: { Post: { id: true } } }).value;
    return prisma.post.findMany<{}>({
      where: user
        ? undefined
        : {
            published: true,
            publishedAt: {
              lte: new Date(),
            },
          },
      ...select,
    });
  },
});

export const PostMutation = mutationField('Post', {
  type: PostsType,
  args: {
    id: stringArg(),
    title: stringArg(),
    content: stringArg(),
    publishedAt: arg({ type: 'DateTime' }),
    published: booleanArg(),
    categories: list(nonNull(stringArg())),
    card: Upload,
    isTrash: booleanArg(),
  },
  resolve: async (
    _parent,
    { id, title, content, published, publishedAt, categories, card, isTrash },
    { prisma, user }
  ) => {
    if (!user?.email) throw new Error('Authentication error');
    const auth = await prisma.user.findUniqueOrThrow({ where: { email: user.email } });
    if (id) {
      if (isTrash) {
        await normalizationFiles(prisma, id, []);
        return prisma.post.delete({ where: { id } });
      } else {
        if (typeof content === 'string') {
          const images = (await getImages(content)).result;
          await normalizationFiles(prisma, id, images);
        }
        const file = card && (await uploadFile(card));
        const result = await prisma.post.update({
          data: {
            title: title ?? undefined,
            content: content ?? undefined,
            authorId: auth.id,
            published: published ?? undefined,
            publishedAt: publishedAt ?? undefined,
            categories: categories
              ? {
                  connect: categories.map((id) => ({
                    id,
                  })),
                }
              : undefined,
            cardId: card === null ? null : file?.id,
          },
          where: { id },
        });
        await isolatedFiles();
        return result;
      }
    } else {
      return prisma.post.create({
        data: {
          title: title ?? undefined,
          content: content ?? undefined,
          published: published ?? undefined,
          authorId: auth.id,
          categories: categories
            ? {
                connect: categories.map((id) => ({
                  id,
                })),
              }
            : undefined,
        },
      });
    }
  },
});

const normalizationFiles = async (prisma: PrismaClient, postId: string, images: string[]) => {
  const files = await prisma.fireStore.findMany({
    select: { id: true, posts: { select: { id: true } } },
    where: { posts: { some: { id: postId } } },
  });
  const adds = images.filter((image) => !files.some(({ id }) => id === image));
  const deletes = files.filter((file) => !images.includes(file.id));
  const bucket = getStorage().bucket();
  return Promise.all([
    ...deletes.map(({ id }) =>
      prisma.fireStore.update({
        data: { posts: { disconnect: { id: postId } } },
        where: { id },
      })
    ),
    ...adds.map((image) =>
      prisma.fireStore.update({
        data: { posts: { connect: { id: postId } } },
        where: { id: image },
      })
    ),
    ...deletes.map(({ id, posts }) => posts.length === 1 && bucket.file(id).delete()),
  ]);
};

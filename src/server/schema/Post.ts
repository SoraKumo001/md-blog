import { PrismaSelect } from '@paljs/plugins';
import { PrismaClient } from '@prisma/client';
import { getStorage } from 'firebase-admin/storage';
import { Root } from 'mdast';
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
import type { Processor, Compiler } from 'unified';

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
  resolve: (_parent, { id }, { prisma, user }) => {
    return prisma.post.findFirstOrThrow({
      where: user
        ? { id }
        : {
            id,
            published: true,
            publishedAt: {
              lte: new Date(),
            },
          },
    });
  },
});

export const Posts = queryField('Posts', {
  type: nonNull(list(nonNull(PostsType))),
  resolve: (_parent, {}, { prisma, user }, info) => {
    const select = new PrismaSelect(info).value.select;
    return prisma.post.findMany<{}>({
      select: { ...select, id: true },
      where: user
        ? undefined
        : {
            published: true,
            publishedAt: {
              lte: new Date(),
            },
          },
    });
  },
});

export const PostMutation = mutationField('Post', {
  type: PostsType,
  args: {
    id: stringArg(),
    title: stringArg(),
    content: stringArg(),
    publishedDate: arg({ type: 'DateTime' }),
    published: booleanArg(),
    categories: list(nonNull(stringArg())),
    isTrash: booleanArg(),
  },
  resolve: async (
    _parent,
    { id, title, content, published, categories, isTrash },
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
        return prisma.post.update({
          data: {
            title: title ?? undefined,
            content: content ?? undefined,
            authorId: auth.id,
            published: published ?? undefined,
            categories: categories
              ? {
                  connect: categories.map((id) => ({
                    id,
                  })),
                }
              : undefined,
          },
          where: { id },
        });
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

const getImages = async (content: string) => {
  function getImagesCompiler(this: Processor) {
    const grep = /^https?:\/\//i;
    const getImage = (nodes: Root['children']): string[] => {
      return nodes.flatMap((node) => {
        return 'children' in node
          ? getImage(node.children)
          : node.type === 'image' && node.url && !grep.test(node.url)
          ? node.url
          : [];
      });
    };
    const Compiler: Compiler<Root, string[]> = (tree) => {
      return Array.from(new Set(getImage(tree.children)));
    };
    this.Compiler = Compiler;
  }
  const remarkParse = (await import('remark-parse')).default;
  const { unified } = await import('unified');

  const processor = unified().use(remarkParse).use(getImagesCompiler) as Processor<
    Root,
    Root,
    Root,
    string[]
  >;
  return processor().process(content);
};

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

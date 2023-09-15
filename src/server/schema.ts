import { join } from 'path';
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import PrismaUtils from '@pothos/plugin-prisma-utils';
import { FormidableFile } from '@react-libraries/next-apollo-server';
import { serialize } from 'cookie';
import { GraphQLScalarType } from 'graphql';
import jsonwebtoken from 'jsonwebtoken';
import PothosPrismaGeneratorPlugin from 'pothos-prisma-generator';
import PothosSchemaExporter from 'pothos-schema-exporter';
import { getUserInfo } from '@/libs/getUserInfo';
import { isolatedFiles, uploadFile } from '@/libs/uploadFile';
import { Context, prisma } from './context';
import PrismaTypes from './generated/pothos-types';
import { getUser } from './libs/getUser';
import { normalizationPostFiles } from './libs/normalizationPostFiles';
/**
 * Create a new schema builder instance
 */
export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    Upload: {
      Input: FormidableFile;
      Output: FormidableFile;
    };
  };
  Context: Context;
}>({
  plugins: [PrismaPlugin, PrismaUtils, PothosPrismaGeneratorPlugin, PothosSchemaExporter],
  prisma: {
    client: prisma,
  },
  pothosSchemaExporter: {
    output:
      process.env.NODE_ENV === 'development' &&
      join(process.cwd(), 'src', 'server', 'generated', 'schema.graphql'),
  },
  pothosPrismaGenerator: {
    authority: ({ context }) => (context.user ? ['USER'] : []),
    replace: { '%%USER%%': ({ context }) => context.user?.id },
  },
});

builder.mutationType({
  fields: (t) => {
    return {
      signIn: t.prismaField({
        args: { token: t.arg({ type: 'String' }) },
        type: 'User',
        nullable: true,
        resolve: async (_query, _root, { token }, { res }) => {
          const userInfo =
            typeof token === 'string'
              ? await getUserInfo(process.env.NEXT_PUBLIC_projectId, token)
              : undefined;
          if (!userInfo) {
            res.setHeader(
              'Set-Cookie',
              serialize('auth-token', '', {
                httpOnly: true,
                maxAge: -1,
                path: '/',
              })
            );
            return null;
          }
          const user = await getUser(prisma, userInfo.name, userInfo.email);
          if (user) {
            const secret = process.env.SECRET_KEY;
            if (!secret) throw new Error('SECRET_KEY is not defined');
            const token = jsonwebtoken.sign({ payload: { user: user } }, secret);
            res.setHeader(
              'Set-Cookie',
              serialize('auth-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60,
                path: '/',
              })
            );
          }
          return user;
        },
      }),
      uploadSystemIcon: t.prismaField({
        type: 'FireStore',
        args: {
          file: t.arg({ type: 'Upload', required: true }),
        },
        resolve: async (_query, _root, { file }, { prisma, user }) => {
          if (!user) throw new Error('Unauthorized');
          const firestore = await uploadFile(file);
          const system = await prisma.system.update({
            select: { icon: true },
            data: {
              iconId: firestore.id,
            },
            where: { id: 'system' },
          });
          await isolatedFiles();
          if (!system.icon) throw new Error('icon is not found');
          return system.icon;
        },
      }),
      uploadPostIcon: t.prismaField({
        type: 'FireStore',
        args: {
          postId: t.arg({ type: 'String', required: true }),
          file: t.arg({ type: 'Upload' }),
        },
        resolve: async (_query, _root, { postId, file }, { prisma, user }) => {
          if (!user) throw new Error('Unauthorized');
          if (!file) {
            const firestore = await prisma.post
              .findUniqueOrThrow({ select: { card: true }, where: { id: postId } })
              .card();
            if (!firestore) throw new Error('firestore is not found');
            await prisma.fireStore.delete({
              where: { id: firestore.id },
            });
            return firestore;
          }
          const firestore = await uploadFile(file);
          const post = await prisma.post.update({
            select: { card: true },
            data: {
              cardId: firestore.id,
            },
            where: { id: postId },
          });
          await isolatedFiles();
          if (!post.card) throw new Error('card is not found');
          return post.card;
        },
      }),
      uploadPostImage: t.prismaField({
        type: 'FireStore',
        args: {
          postId: t.arg({ type: 'String', required: true }),
          file: t.arg({ type: 'Upload', required: true }),
        },
        resolve: async (_query, _root, { postId, file }, { prisma, user }) => {
          if (!user) throw new Error('Unauthorized');
          const firestore = await uploadFile(file);
          await prisma.post.update({
            data: {
              postFiles: { connect: { id: firestore.id } },
            },
            where: { id: postId },
          });
          return firestore;
        },
      }),
      normalizationPostFiles: t.boolean({
        args: {
          postId: t.arg({ type: 'String', required: true }),
          removeAll: t.arg({ type: 'Boolean' }),
        },
        resolve: async (_root, { postId, removeAll }, { prisma, user }) => {
          if (!user) throw new Error('Unauthorized');
          await normalizationPostFiles(prisma, postId, removeAll === true);
          await isolatedFiles();
          return true;
        },
      }),
    };
  },
});

const Upload = new GraphQLScalarType({
  name: 'Upload',
});

builder.addScalarType('Upload', Upload, {});

export const schema = builder.toSchema({ sortSchema: false });

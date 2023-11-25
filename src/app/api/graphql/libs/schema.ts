import { join } from 'path';
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import PrismaUtils from '@pothos/plugin-prisma-utils';
import { GraphQLScalarType } from 'graphql';
import { SignJWT } from 'jose';
import PothosPrismaGeneratorPlugin from 'pothos-prisma-generator';
import PothosSchemaExporter from 'pothos-schema-exporter';
import PrismaTypes from '@/app/generated/pothos-types';
import { getUserInfo } from '@/libs/getUserInfo';
import { isolatedFiles, uploadFile } from '@/libs/uploadFile';
import { Context, prisma } from './context';
import { getUser } from './getUser';
import { importFile } from './importFile';
import { normalizationPostFiles } from './normalizationPostFiles';

/**
 * Create a new schema builder instance
 */
export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    Upload: {
      Input: File;
      Output: File;
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
      join(process.cwd(), 'src', 'app', 'generated', 'schema.graphql'),
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
        resolve: async (_query, _root, { token }, { cookies }) => {
          const userInfo =
            typeof token === 'string'
              ? await getUserInfo(process.env.NEXT_PUBLIC_projectId, token)
              : undefined;
          if (!userInfo) {
            cookies.set('auth-token', '', {
              httpOnly: true,
              secure: process.env.NODE_ENV !== 'development',
              sameSite: 'strict',
              path: '/',
              expires: 0,
              domain: undefined,
            });
            return null;
          }
          const user = await getUser(prisma, userInfo.name, userInfo.email);
          if (user) {
            const secret = process.env.SECRET_KEY;
            if (!secret) throw new Error('SECRET_KEY is not defined');
            const token = await new SignJWT({ payload: { user: user } })
              .setProtectedHeader({ alg: 'HS256' })
              .sign(new TextEncoder().encode(secret));
            cookies.set('auth-token', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV !== 'development',
              expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
              sameSite: 'strict',
              path: '/',
              domain: undefined,
            });
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
      restore: t.boolean({
        args: {
          file: t.arg({ type: 'Upload', required: true }),
        },
        resolve: async (_root, { file }, { user }) => {
          if (!user) throw new Error('Unauthorized');
          importFile(await file.text());
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

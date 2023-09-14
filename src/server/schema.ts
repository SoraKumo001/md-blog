import { join } from 'path';
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import PrismaUtils from '@pothos/plugin-prisma-utils';
import { PrismaClient } from '@prisma/client';
import { FormidableFile } from '@react-libraries/next-apollo-server';
import { serialize } from 'cookie';
import { GraphQLScalarType } from 'graphql';
import jsonwebtoken from 'jsonwebtoken';
import PothosPrismaGeneratorPlugin from 'pothos-prisma-generator';
import PothosSchemaExporter from 'pothos-schema-exporter';
import { getUserInfo } from '@/libs/getUserInfo';
import { Context, prisma } from './context';
/**
 * Create a new schema builder instance
 */
export const builder = new SchemaBuilder<{
  Scalars: {
    Upload: {
      // type all ID arguments and input values as string
      Input: FormidableFile;
      // Allow resolvers for ID fields to return strings, numbers, or bigints
      Output: FormidableFile;
    };
  };
  Context: Context;
  // PrismaTypes: PrismaTypes; //Not used because it is generated automatically
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
    // Set the following permissions
    /// @pothos-generator any {authority:["ROLE"]}
    authority: ({ context }) => (context.user ? ['USER'] : []),
  },
});

builder.mutationType({
  fields: (t) => {
    return {
      // Example of how to add a custom auth query
      // This query will return true if the user is authenticated
      signIn: t.boolean({
        args: { token: t.arg({ type: 'String' }) },
        resolve: async (_root, { token }, { res }) => {
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
            return true;
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
                maxAge: userInfo.exp - Date.now() / 1000,
                path: '/',
              })
            );
          }
          return true;
        },
      }),
      // Example of how to add a custom auth query
      // and will clear the session cookie
      signOut: t.boolean({
        resolve: (_root, args, ctx) => {
          const token = jsonwebtoken.sign({ payload: { user: args.user } }, 'test');
          const res = ctx.res;
          res.setHeader(
            'Set-Cookie',
            serialize('session', token, {
              maxAge: 0,
              path: '/',
            })
          );
          return true;
        },
      }),
    };
  },
});

const Upload = new GraphQLScalarType({
  name: 'Upload',
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (value) => value,
  extensions: {},
});

builder.addScalarType('Upload', Upload, {});

const getUser = async (prisma: PrismaClient, name: string, email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) return user;
  else {
    if (await prisma.user.count()) {
      return null;
    }
    const user = await prisma.user.create({
      data: { name: name, email: email },
    });
    return user;
  }
};

export const schema = builder.toSchema();

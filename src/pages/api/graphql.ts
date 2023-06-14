import { ApolloServer } from '@apollo/server';
import { executeHTTPGraphQLRequest } from '@react-libraries/next-apollo-server';
import admin from 'firebase-admin';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { Context, prisma } from '../../server/context';
import { schema } from '../../server/schema';
import type { NextApiHandler } from 'next';

/**
 * apolloServer
 */
const createApolloServer = async () => {
  const apolloServer = new ApolloServer<Context>({
    schema: await schema,
  });
  apolloServer.start();
  return apolloServer;
};

const apolloServer = createApolloServer();

/**
 * APIRoute handler for Next.js
 */
const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions).catch(() => undefined);
  await executeHTTPGraphQLRequest({
    req,
    res,
    apolloServer: await apolloServer,
    context: async () => {
      const user = session?.user;
      return { req, res, prisma, user };
    },
  });
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};

!admin.apps.length &&
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.GOOGLE_PROJECT_ID,
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY,
    }),
    storageBucket: process.env.GOOGLE_STRAGE_BUCKET,
  });

prisma.system.findUnique({ where: { id: 'system' } }).then(async (v) => {
  if (!v) {
    await prisma.system.create({ data: { id: 'system', title: 'タイトル', description: '説明' } });
  }
});

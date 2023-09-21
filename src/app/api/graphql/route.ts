/* eslint-disable react-hooks/rules-of-hooks */
import { useGraphQlJit } from '@envelop/graphql-jit';
import { useCookies } from '@whatwg-node/server-plugin-cookies';
import admin from 'firebase-admin';
import { createYoga } from 'graphql-yoga';
import { getUserFromToken } from '@/libs/getUserFromToken';
import { Context, prisma } from '../../libs/context';
import { schema } from '../../libs/schema';

const { handleRequest } = createYoga<Context>({
  schema,
  fetchAPI: { Response },
  plugins: [useCookies(), useGraphQlJit()],
  context: async ({ request: req }) => {
    const { cookieStore } = req;
    if (!cookieStore) throw new Error('cookieStore is undefined');
    const token = (await cookieStore.get('auth-token'))?.value;
    const user = await getUserFromToken(token);
    return { req, prisma, user, cookieStore };
  },
});

export { handleRequest as GET, handleRequest as POST };

!admin.apps.length &&
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.GOOGLE_PROJECT_ID,
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY,
    }),
    storageBucket: `${process.env.GOOGLE_PROJECT_ID}.appspot.com`,
  });

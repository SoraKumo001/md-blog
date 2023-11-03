import { createYoga } from 'graphql-yoga';
import { cookies as getCookies } from 'next/headers';
import { Context, prisma } from './libs/context';
import { initializeApp } from './libs/initializeApp';
import { schema } from './libs/schema';
import { getUserFromToken } from '../../../libs/getUserFromToken';

initializeApp();

const { handleRequest } = createYoga<Context>({
  schema,
  fetchAPI: { Response },
  // eslint-disable-next-line react-hooks/rules-of-hooks
  context: async ({ request: req }) => {
    const cookies = getCookies();
    const token = cookies.get('auth-token')?.value;
    const user = await getUserFromToken(token);
    return { req, prisma, user, cookies };
  },
});

export { handleRequest as GET, handleRequest as POST };

import { createYoga } from 'graphql-yoga';
import { cookies as getCookies } from 'next/headers';
import { Context, isEdge, prisma } from './libs/context';
import { schema } from './libs/schema';
import { getUserFromToken } from '../../../libs/getUserFromToken';

const { handleRequest } = createYoga<Context>({
  schema,
  fetchAPI: { Response },
  context: async ({ request: req }) => {
    const cookies = getCookies();
    const token = cookies.get('auth-token')?.value;
    const user = await getUserFromToken(token);
    return { req, prisma, user, cookies };
  },
});

export { handleRequest as GET, handleRequest as POST };

export const runtime = isEdge ? 'edge' : 'nodejs';

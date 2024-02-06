import { createYoga } from 'graphql-yoga';
import { cookies as getCookies } from 'next/headers';
import { Context, prisma } from './libs/context';
import { schema } from './libs/schema';
import { getUserFromToken } from '../../../libs/getUserFromToken';

let handleRequest: (request: Request, ctx: Context) => Response | Promise<Response>;

const callRequest = (request: Request, ctx: Context) => {
  if (!handleRequest) {
    handleRequest = createYoga<Context>({
      schema: schema(),
      fetchAPI: { Response },
      context: async ({ request: req }) => {
        console.log('context');
        const cookies = getCookies();
        const token = cookies.get('auth-token')?.value;
        const user = await getUserFromToken(token);
        return { req, prisma, user, cookies };
      },
    }).handleRequest;
  }
  return handleRequest(request, ctx);
};

export { callRequest as GET, callRequest as POST, callRequest as OPTIONS };

export const runtime = 'edge';

import { PrismaClient, User } from '@prisma/client';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export type Context = {
  req: Request;
  prisma: PrismaClient;
  user?: User;
  cookies: ReadonlyRequestCookies;
};

export const prisma =
  (global as { prisma?: PrismaClient }).prisma ??
  new PrismaClient({
    log: [
      {
        emit: 'stdout',
        level: 'query',
      },
    ],
  });

(global as { prisma?: PrismaClient }).prisma = prisma as never;

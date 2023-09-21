import { PrismaClient, User } from '@prisma/client';
import { CookieStore } from '@whatwg-node/cookie-store';

export type Context = {
  cookieStore: CookieStore;
  req: Request;
  prisma: PrismaClient;
  user?: User;
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

(global as { prisma?: PrismaClient }).prisma = prisma;

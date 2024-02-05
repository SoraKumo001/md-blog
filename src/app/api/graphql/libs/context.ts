import { PrismaClient as PrismaClientEdge, User } from '@prisma/client/edge';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import type { PrismaClient } from '@prisma/client';

export const isEdge = process.env.DATABASE_URL!.startsWith('prisma:');

export type Context = {
  req: Request;
  prisma: PrismaClient;
  user?: User;
  cookies: ReadonlyRequestCookies;
};

export const prisma = new PrismaClientEdge({
  log: [
    {
      emit: 'stdout',
      level: 'query',
    },
  ],
}) as unknown as PrismaClient;

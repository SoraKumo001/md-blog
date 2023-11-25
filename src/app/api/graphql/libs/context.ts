import { PrismaClient as PrismaNormal } from '@prisma/client';
import { PrismaClient as PrismaEdge } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import type { User, PrismaClient } from '@prisma/client';

export const isEdge = process.env.DATABASE_URL!.startsWith('prisma:');

export type Context = {
  req: Request;
  prisma: PrismaClient;
  user?: User;
  cookies: ReadonlyRequestCookies;
};

export const prisma = isEdge
  ? (new PrismaEdge({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
      ],
    }).$extends(withAccelerate()) as unknown as PrismaClient)
  : new PrismaNormal({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
      ],
    });

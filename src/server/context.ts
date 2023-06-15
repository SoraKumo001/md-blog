import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export type Context = {
  res: NextApiResponse;
  req: NextApiRequest;
  prisma: PrismaClient;
  user?: { email: string; name: string };
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

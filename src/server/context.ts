import { PrismaClient, User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export type Context = {
  res: NextApiResponse;
  req: NextApiRequest;
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

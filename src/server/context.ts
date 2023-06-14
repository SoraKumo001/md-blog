import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';

export type Context = {
  res: NextApiResponse;
  req: NextApiRequest;
  prisma: PrismaClient;
  user: Session['user'];
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

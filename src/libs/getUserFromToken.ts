import { User } from '@prisma/client';
import * as jsonwebtoken from 'jsonwebtoken';

export const getUserFromToken = async (token?: string) => {
  if (!token) return undefined;
  const secret = process.env.SECRET_KEY;
  if (!secret) throw new Error('SECRET_KEY is not defined');
  return new Promise<User | undefined>((resolve) => {
    jsonwebtoken.verify(token, secret, (_, data) => {
      resolve(typeof data === 'object' ? (data.payload?.user as User | undefined) : undefined);
    });
  });
};

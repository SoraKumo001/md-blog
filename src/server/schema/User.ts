import { PrismaClient } from '@prisma/client';
import { serialize } from 'cookie';
import * as jsonwebtoken from 'jsonwebtoken';
import { mutationField, objectType, stringArg } from 'nexus';
import { User } from 'nexus-prisma';
import { getUserInfo } from '@/libs/getUserInfo';

export const UserType = objectType({
  name: User.$name,
  description: User.$description,
  definition(t) {
    Object.entries(User).forEach(([key, value]) => {
      if (!key.startsWith('$')) t.field(value);
    });
  },
});

export const SignIn = mutationField('SignIn', {
  type: UserType,
  args: {
    token: stringArg(),
  },
  resolve: async (_parent, { token }, { res, prisma }) => {
    const userInfo =
      typeof token === 'string'
        ? await getUserInfo(process.env.NEXT_PUBLIC_projectId, token)
        : undefined;
    if (!userInfo) {
      res.setHeader(
        'Set-Cookie',
        serialize('auth-token', '', {
          httpOnly: true,
          maxAge: -1,
          path: '/',
        })
      );
      return null;
    }
    const user = await getUser(prisma, userInfo.name, userInfo.email);
    if (user) {
      const secret = process.env.SECRET_KEY;
      if (!secret) throw new Error('SECRET_KEY is not defined');
      const token = jsonwebtoken.sign({ payload: { user: user } }, secret);
      res.setHeader(
        'Set-Cookie',
        serialize('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: userInfo.exp - Date.now() / 1000,
          path: '/',
        })
      );
    }
    return user;
  },
});

const getUser = async (prisma: PrismaClient, name: string, email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) return user;
  else {
    if (await prisma.user.count()) {
      return null;
    }
    const user = await prisma.user.create({
      data: { name: name, email: email },
    });
    return user;
  }
};

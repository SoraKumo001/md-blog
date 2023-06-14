import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/server/context';

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? '',
    }),
  ],
  callbacks: {
    signIn: async ({ profile }) => {
      if (!profile?.email) return false;
      if (await prisma.user.findUnique({ where: { email: profile.email } })) return true;
      if (await prisma.user.count()) {
        return false;
      }
      await prisma.user.create({
        data: { name: profile.name, email: profile.email },
      });
      return true;
    },
  },
};
export default NextAuth(authOptions);

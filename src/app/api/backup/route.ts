import { semaphore } from '@node-libraries/semaphore';
import { NextRequest } from 'next/server';
import { isEdge, prisma } from '@/app/api/graphql/libs/context';
import { storage } from '@/libs/getStorage';
import { getUserFromToken } from '@/libs/getUserFromToken';

export const POST = async (req: NextRequest) => {
  const { cookies } = req;
  if (!cookies) throw new Error('cookieStore is undefined');
  const token = (await cookies.get('auth-token'))?.value;
  const user = await getUserFromToken(token);
  if (!user) {
    throw new Error('Authentication error');
  }
  const users = await prisma.user.findMany();
  const categories = await prisma.category.findMany();
  const system = await prisma.system.findMany();
  const posts = await prisma.post.findMany({ include: { categories: { select: { id: true } } } });
  const files = await prisma.fireStore.findMany();

  const s = semaphore(5);

  const fireStoreFiles = await Promise.all(
    files.map(async (file) => {
      await s.acquire();
      try {
        const storageFile = await storage.download({ name: file.id });
        return { ...file, binary: Buffer.from(storageFile).toString('base64') };
      } catch (e) {
        return { ...file, binary: '' };
      } finally {
        s.release();
      }
    })
  );
  return Response.json({ system, users, categories, posts, files: fireStoreFiles });
};

export const runtime = isEdge ? 'edge' : 'nodejs';

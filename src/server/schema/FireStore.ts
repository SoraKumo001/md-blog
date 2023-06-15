import { mutationField, nonNull, objectType, stringArg } from 'nexus';
import { FireStore } from 'nexus-prisma';
import { uploadFile } from '@/libs/uploadFile';
import { Upload } from './Upload';

export const FireStoreType = objectType({
  name: FireStore.$name,
  description: FireStore.$description,
  definition(t) {
    Object.entries(FireStore).forEach(([key, value]) => {
      if (!key.startsWith('$')) t.field(value);
    });
  },
});

export const PostFileMutation = mutationField('PostFile', {
  type: nonNull(FireStoreType),
  args: {
    postId: nonNull(stringArg()),
    binary: nonNull(Upload),
  },
  resolve: async (_parent, { postId, binary }, { prisma, user }) => {
    if (!user) throw new Error('Authentication error');
    const file = await uploadFile(binary);
    await prisma.post.update({
      data: {
        postFiles: { connect: { id: file.id } },
      },
      where: { id: postId },
    });
    return file;
  },
});

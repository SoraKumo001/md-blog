import { getStorage } from 'firebase-admin/storage';
import { mutationField, nonNull, objectType, stringArg } from 'nexus';
import { FireStore } from 'nexus-prisma';
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

    const bucket = getStorage().bucket();

    const fileName = binary.originalFilename ?? 'file';
    const storage = await bucket.upload(binary.filepath, {
      public: true,
      contentType: binary.mimetype ?? undefined,
      metadata: { mime: binary.mimetype, cacheControl: 'public, max-age=31536000, immutable' },
    });
    const file = storage[0];
    if (!file.id) throw new Error('CloudStorage error');
    return prisma.fireStore.create({
      data: {
        posts: { connect: { id: postId } },
        id: file.id,
        name: fileName,
        mimeType: binary.mimetype ?? '',
      },
    });
  },
});

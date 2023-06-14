import { PrismaSelect } from '@paljs/plugins';
import { list, nonNull, objectType, queryField } from 'nexus';
import { User } from 'nexus-prisma';

export const UserType = objectType({
  name: User.$name,
  description: User.$description,
  definition(t) {
    Object.entries(User).forEach(([key, value]) => {
      if (!key.startsWith('$')) t.field(value);
    });
  },
});

export const Users = queryField('Users', {
  type: nonNull(list('User')),
  resolve: (_parent, {}, { prisma }, info) => {
    const select = new PrismaSelect(info).value.select;
    return prisma.user.findMany<{}>({
      select: { ...select, id: true },
    });
  },
});

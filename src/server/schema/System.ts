import { mutationField, nonNull, objectType, queryField, stringArg } from 'nexus';
import { System } from 'nexus-prisma';

export const SystemType = objectType({
  name: System.$name,
  description: System.$description,
  definition(t) {
    Object.entries(System).forEach(([key, value]) => {
      if (!key.startsWith('$')) t.field(value);
    });
  },
});

export const SystemQuery = queryField('System', {
  type: nonNull(SystemType),
  resolve: (_parent, {}, { prisma }) => {
    return prisma.system.findUniqueOrThrow({
      where: { id: 'system' },
    });
  },
});

export const SystemMutation = mutationField('System', {
  type: nonNull(SystemType),
  args: {
    title: stringArg(),
    description: stringArg(),
  },
  resolve: async (_parent, { title, description }, { prisma, user }) => {
    if (!user) throw new Error('Authentication error');
    return prisma.system.update({
      data: {
        title: title ?? undefined,
        description: description ?? undefined,
      },
      where: { id: 'system' },
    });
  },
});

import { PrismaSelect } from '@paljs/plugins';
import { list, mutationField, nonNull, objectType, queryField, stringArg } from 'nexus';
import { Category } from 'nexus-prisma';

export const CategoryType = objectType({
  name: Category.$name,
  description: Category.$description,
  definition(t) {
    Object.entries(Category).forEach(([key, value]) => {
      if (key === 'Posts') {
        t.field({
          ...value,
          resolve: async (parent, {}, { prisma, user }) => {
            return prisma.category
              .findUniqueOrThrow({ where: { id: parent.id } })
              .Posts(user ? undefined : { where: { published: true } });
          },
        });
      } else if (!key.startsWith('$')) t.field(value);
    });
  },
});

export const Categories = queryField('Categories', {
  type: nonNull(list(nonNull(CategoryType))),
  resolve: (_parent, {}, { prisma }, info) => {
    const select = new PrismaSelect(info).value.select;
    return prisma.category.findMany<{}>({
      select: { ...select, id: true },
    });
  },
});

export const CategoryQuery = queryField('Category', {
  type: nonNull(CategoryType),
  args: {
    id: nonNull(stringArg()),
  },
  resolve: (_parent, { id }, { prisma }, info) => {
    const select = new PrismaSelect(info).value.select;
    return prisma.category.findUniqueOrThrow({
      select: { ...select, id: true },
      where: { id },
    }) as never;
  },
});

export const CategoryMutation = mutationField('Category', {
  type: nonNull(CategoryType),
  args: {
    id: stringArg(),
    name: nonNull(stringArg()),
  },
  resolve: async (_parent, { id, name }, { prisma, user }) => {
    if (!user) throw new Error('Authentication error');
    if (id) {
      return prisma.category.update({
        data: {
          name,
        },
        where: { id },
      });
    }
    return prisma.category.create({
      data: {
        name,
      },
    });
  },
});

import { PrismaSelect } from '@paljs/plugins';
import { list, mutationField, nonNull, objectType, queryField, stringArg } from 'nexus';
import { FieldOutConfigWithName, ObjectDefinitionBlock, OutputScalarConfig } from 'nexus/dist/core';
import { Category } from 'nexus-prisma';

const createResolve = <
  TypeName extends string,
  FieldName extends string,
  Model extends
    | { [key in FieldName]: FieldOutConfigWithName<TypeName, FieldName> | string | undefined }
    | { [key in `$name` | '$description']?: string }
>(
  t: ObjectDefinitionBlock<TypeName>,
  model: Model,
  resolves?: { [key in FieldName]?: OutputScalarConfig<TypeName, key>['resolve'] }
) => {
  Object.values<FieldOutConfigWithName<TypeName, FieldName> | string | undefined>(model).forEach(
    (value) => {
      if (typeof value === 'object' && 'name' in value) {
        const { name } = value;
        const resolve = resolves?.[name] ?? value.resolve;
        t.field({ ...value, resolve });
      }
    }
  );
};

export const CategoryType = objectType({
  name: Category.$name,
  description: Category.$description,
  definition(t) {
    createResolve(t, Category, {
      posts: async (parent, {}, { prisma, user }) => {
        return prisma.category
          .findUniqueOrThrow({ where: { id: parent.id } })
          .posts(user ? undefined : { where: { published: true } });
      },
    });
  },
});

export const Categories = queryField('Categories', {
  type: nonNull(list(nonNull(CategoryType))),
  resolve: (_parent, {}, { prisma }, info) => {
    const select = new PrismaSelect(info, { defaultFields: { Category: { id: true } } }).value;
    return prisma.category.findMany<{}>({
      ...select,
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

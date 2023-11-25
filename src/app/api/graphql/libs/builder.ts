import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import PrismaUtils from '@pothos/plugin-prisma-utils';
import PothosPrismaGeneratorPlugin from 'pothos-prisma-generator';
import PrismaTypes from '@/app/generated/pothos-types';
import { Context, prisma } from './context';

/**
 * Create a new schema builder instance
 */
export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    Upload: {
      Input: File;
      Output: File;
    };
  };
  Context: Context;
}>({
  plugins: [PrismaPlugin, PrismaUtils, PothosPrismaGeneratorPlugin],
  prisma: {
    client: prisma,
  },
  pothosPrismaGenerator: {
    authority: ({ context }) => (context.user ? ['USER'] : []),
    replace: { '%%USER%%': ({ context }) => context.user?.id },
  },
});

import { join } from 'path';
import { makeSchema } from 'nexus';
import * as NexusPrismaScalars from 'nexus-prisma/scalars';
import * as allTypes from './schema/index';

const nexusSchema = makeSchema({
  types: [NexusPrismaScalars, allTypes],
  contextType: {
    module: join(process.cwd(), 'src', 'server', 'context.ts'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
  outputs: {
    typegen: join(process.cwd(), 'src', 'server', 'generated', 'nexus-typegen.ts'),
    schema: join(process.cwd(), 'src', 'server', 'generated', 'schema.graphql'),
  },
});

export const schema = nexusSchema;

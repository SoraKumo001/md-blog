'use server';
import { printSchema } from 'graphql';
import { NextPage } from 'next';
import { Explorer } from './explorer';
import { createBuilder } from '../api/graphql/libs/builder';

const Page: NextPage = async () => {
  const builder = createBuilder(process.env.DATABASE_URL ?? '');
  const schema = printSchema(builder.toSchema({ sortSchema: false }));
  return <Explorer schema={schema} />;
};

export default Page;

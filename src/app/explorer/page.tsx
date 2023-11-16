import { printSchema } from 'graphql';
import { NextPage } from 'next';
import { schema } from '@/app/api/graphql/libs/schema';
import { Explorer } from './explorer';

const Page: NextPage = async () => {
  return <Explorer schema={await printSchema(schema)} />;
};

export default Page;

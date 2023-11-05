'use client';
import { ApolloExplorer } from '@apollo/explorer/react';
import { printSchema } from 'graphql';
import { GetStaticProps, NextPage } from 'next';
import { schema } from '@/app/api/graphql/libs/schema';

const Page: NextPage<{ schema: string }> = ({ schema }) => {
  return (
    <>
      <style>{`
        .explorer {
          position: fixed;
          height: 100vh;
          width: 100vw;
          top: 0;
          left: 0;
        }
      `}</style>
      <ApolloExplorer
        className="explorer"
        schema={schema}
        endpointUrl="/api/graphql"
        persistExplorerState={true}
        handleRequest={(url, option) => fetch(url, { ...option, credentials: 'same-origin' })}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { schema: printSchema(schema) },
  };
};

export default Page;

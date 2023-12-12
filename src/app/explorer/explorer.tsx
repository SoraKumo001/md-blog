'use client';
import { ApolloExplorer } from '@apollo/explorer/react';

export const Explorer = ({ schema }: { schema: string }) => {
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
